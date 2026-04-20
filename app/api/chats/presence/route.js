import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

/**
 * @swagger
 * /api/chats/presence:
 *   post:
 *     summary: POST for /api/chats/presence
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatSession'
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatSession'
 *       500:
 *         description: "Presence error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Presence error" }
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { workspaceId, chatId, user, action } = body;

        await pusherServer.trigger(`workspace-${workspaceId}`, 'viewer-activity', {
            chatId: chatId,
            user: user,
            action: action
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Presence Error:", e);
        return NextResponse.json({ error: "Presence error" }, { status: 500 });
    }
}