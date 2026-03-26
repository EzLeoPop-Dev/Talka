import { prisma } from "@/lib/prisma";

let clients = [];

export async function POST(req) {
    try {
        const body = await req.json();
        const { chat_session_id, text } = body;

        // 🔥 save DB
        await prisma.message.create({
            data: {
                chat_session_id,
                content: text,
                sender_type: "ADMIN",
            },
        });

        // 🔥 ยิง realtime
        clients.forEach((res) => {
            res.write(
                `data: ${JSON.stringify({
                    chatId: chat_session_id,
                    text,
                    from: "me",
                })}\n\n`
            );
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error(err);
        return Response.json({ error: true });
    }
}