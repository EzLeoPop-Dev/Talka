import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// 🔥 1. บังคับไม่ให้ Next.js ทำ Caching ในหน้านี้เด็ดขาด (สำคัญสำหรับ SSE)
export const dynamic = "force-dynamic";

// 🔥 2. ใช้ globalThis เพื่อป้องกันไม่ให้ clients หายไปตอน Hot Reload ในโหมด Dev
// (หมายเหตุ: วิธีนี้ใช้ได้ผลดีถ้ารันบนเซิร์ฟเวอร์แบบ VPS / Custom Node Server
// แต่ถ้า Deploy บน Vercel ต้องพิจารณาใช้ Redis Pub/Sub หรือ Pusher แทน)
const globalClients = globalThis.sseClients || [];
if (process.env.NODE_ENV !== "production") {
  globalThis.sseClients = globalClients;
}

function broadcast(data) {
  globalClients.forEach((res, index) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error(`❌ ขัดข้องตอนส่งข้อมูลให้ Client ที่ ${index}`, error);
      // ลบ client ที่เชื่อมต่อไม่ได้แล้วออก
      globalClients.splice(index, 1);
    }
  });
}

// =========================
// 🔥 SSE (Realtime)
// =========================
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("stream") !== "true") {
    return new Response("Not Found", { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const push = (data) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      const clientInfo = { write: push };
      globalClients.push(clientInfo);

      req.signal.addEventListener("abort", () => {
        const index = globalClients.indexOf(clientInfo);
        if (index !== -1) {
          globalClients.splice(index, 1);
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform", // เพิ่ม no-transform ป้องกัน proxy ปรับแต่งข้อมูล
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*", // อนุญาตให้ Frontend ยิงมารับได้
    },
  });
}

// =========================
// 🔥 WEBHOOK (LINE)
// =========================
export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-line-signature");

    const hash = crypto
      .createHmac("sha256", process.env.LINE_CHANNEL_SECRET)
      .update(body)
      .digest("base64");

    if (hash !== signature) {
      console.error("❌ Invalid signature");
      return new Response("Unauthorized", { status: 401 }); // ควรใช้ 401 ถ้าคนยิงมาไม่ใช่ LINE
    }

    const data = JSON.parse(body);

    // รอจัดการอีเวนต์ทั้งหมดให้เสร็จ (ใช้ Promise.all เผื่อมีหลาย event มาพร้อมกัน)
    await Promise.all(
      data.events.map(async (event) => {
        if (event.type !== "message" || event.message.type !== "text") return;

        const userId = event.source.userId;
        const text = event.message.text;

        // 🔥 หา chat session
        let chat = await prisma.chatSession.findFirst({
          where: { customerId: userId },
        });

        if (!chat) {
          chat = await prisma.chatSession.create({
            data: {
              customerId: userId,
              status: "New Chat",
            },
          });
        }

        // 🔥 save message
        await prisma.message.create({
          data: {
            chat_session_id: chat.chat_session_id,
            content: text,
            sender_type: "USER",
          },
        });

        // 🔥 realtime ยิงไป frontend
        broadcast({
          chatId: chat.chat_session_id,
          text,
          from: "user",
        });
      })
    );

    return new Response(JSON.stringify({ message: "OK" }), { status: 200 });

  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err);

    // รีเทิร์น 200 เพื่อไม่ให้ LINE ยิงมาซ้ำเวลามี Error ภายใน
    return new Response(JSON.stringify({ message: "fail but ok" }), {
      status: 200,
    });
  }
}