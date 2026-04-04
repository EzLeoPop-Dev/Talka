import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { prisma } from "../lib/prisma.js";
import { verifyJWT } from "../lib/jwt.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on("connection", (ws) => {
  let userId = null;
  let lastMessageTime = 0;

  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("error", () => {
    if (userId) clients.delete(userId);
  });

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (!data.type) return

      // INIT (AUTH)
      if (data.type === "init") {
        let decoded;
        try {
          decoded = verifyJWT(data.token);
        } catch {
          return ws.send(JSON.stringify({ error: "Invalid token" }));
        }

        userId = decoded.userId;

        // กัน login ซ้ำ
        if (clients.has(userId)) {
          clients.get(userId).terminate();
        }

        clients.set(userId, ws);
        return;
      }

      // ยังไม่ได้ login
      if (!userId) {
        return ws.send(JSON.stringify({ error: "Unauthorized" }));
      }

      // CHAT
      if (data.type === "chat") {
        // validate
        if (typeof data.message !== "string") return;
        if (!data.to || typeof data.to !== "number") return;

        // กันข้อความยาว
        if (data.message.length > 1000) {
          return ws.send(JSON.stringify({ error: "Message too long" }));
        }

        // กัน spam (200ms)
        if (Date.now() - lastMessageTime < 200) return;
        lastMessageTime = Date.now();

        // save DB
        const saved = await prisma.message.create({
          data: {
            text: data.message,
            senderId: userId,
            receiverId: data.to,
          },
        });

        const payload = JSON.stringify({
          type: "chat",
          id: saved.id,
          message: saved.text,
          from: saved.senderId,
          to: saved.receiverId,
          time: saved.createdAt,
        });

        // ส่งให้ผู้รับ
        const receiver = clients.get(data.to);
        if (receiver && receiver.readyState === WebSocket.OPEN) {
          receiver.send(payload);
        }

        // ส่งกลับ sender
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      }
    } catch (err) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: "Invalid data format" }));
      }
    }
  });

  ws.on("close", () => {
    if (userId) clients.delete(userId);
  });
});

// เช็ค connection ทุก 30 วินาที
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// start server
server.listen(3001, () => {
  console.log("WS running on ws://localhost:3001");
});