import { NextResponse } from "next/server";
import { dbLog, getActivityLogs, getActivityLogCount } from "@/lib/dbLogger";
import { pusherServer } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: ดึงข้อมูล Activity Logs
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         example: "info"
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         example: "CREATE_USER"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         example: "system"
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: chatId
 *         schema:
 *           type: integer
 *         example: 100
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         example: 0
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         example: "created_at"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         example: "desc"
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               logs: []
 *               total: 100
 *       500:
 *         description: ดึงข้อมูลไม่สำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to fetch logs"
 *
 *   post:
 *     summary: สร้าง Activity Log ใหม่
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 example: "CREATE_ORDER"
 *               level:
 *                 type: string
 *                 example: "info"
 *               type:
 *                 type: string
 *                 example: "user"
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               chat_session_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: สร้าง log สำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               log: {}
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */

// 🟢 GET: สำหรับดึงข้อมูล Log ไปแสดงที่ ActivityLogPanel และหน้า Admin
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const filters = {
            level: searchParams.get("level") || undefined,
            action: searchParams.get("action") || undefined,
            type: searchParams.get("type") || undefined,
            user_id: searchParams.get("user_id") ? Number(searchParams.get("user_id")) : undefined,
            chat_session_id: searchParams.get("chatId") ? Number(searchParams.get("chatId")) : undefined,
            limit: Number(searchParams.get("limit")) || 50,
            offset: Number(searchParams.get("offset")) || 0,
            sortBy: searchParams.get("sortBy") || "created_at",
            sortOrder: searchParams.get("sortOrder") || "desc",
        };

        // ใช้ dbLogger ของคุณดึงข้อมูล
        const logs = await getActivityLogs(filters);
        const total = await getActivityLogCount(filters);

        return NextResponse.json({ logs, total }, { status: 200 });
    } catch (error) {
        console.error("❌ Fetch Log Error:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}

// 🟢 POST: สำหรับบันทึก Log ใหม่ (จากโค้ดเดิมของคุณ)
export async function POST(req) {
    try {
        const body = await req.json();
        const newLog = await dbLog(body);

        if (newLog && body.chat_session_id) {
            const chat = await prisma.chatSession.findUnique({
                where: { chat_session_id: parseInt(body.chat_session_id) },
                include: { channel: true }
            });
            if (chat?.channel?.workspace_id) {
                await pusherServer.trigger(`workspace-${chat.channel.workspace_id}`, 'log-updated', {
                    chatId: body.chat_session_id,
                    action: body.action
                });
            }
        }
        return NextResponse.json({ success: true, log: newLog });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}