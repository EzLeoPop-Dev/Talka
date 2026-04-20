import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { pusherServer } from "@/lib/pusher";

/**
 * @swagger
 * /api/chat-sessions/{id}/tags:
 *   post:
 *     summary: POST for /api/chat-sessions/{id}/tags
 *     tags: [Chat-sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
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
 *       400:
 *         description: "ข้อมูลไม่ครบถ้วน"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ข้อมูลไม่ครบถ้วน" }
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Internal Server Error" }
 */
export async function POST(req, context) {
    try {
        const params = await context.params;
        const chatId = parseInt(params.id); 
        const { tagId } = await req.json();

        if (!tagId || !chatId) {
            return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
        }

        const chatSession = await prisma.chatSession.findUnique({
            where: { chat_session_id: chatId },
            select: { channel: { select: { workspace_id: true } } }
        });

        const existingChatTag = await prisma.chatTag.findFirst({
            where: {
                chat_session_id: chatId,
                tag_id: parseInt(tagId)
            }
        });

        let actionType = "added";

        if (existingChatTag) {
            await prisma.chatTag.deleteMany({
                where: { 
                    chat_session_id: chatId,
                    tag_id: parseInt(tagId)
                }
            });
            actionType = "removed";
        } else {
            await prisma.chatTag.create({
                data: {
                    chat_session_id: chatId,
                    tag_id: parseInt(tagId)
                }
            });
        }

        // 3. ตะโกนบอก Pusher
        if (chatSession?.channel?.workspace_id) {
            try {
                await pusherServer.trigger(`workspace-${chatSession.channel.workspace_id}`, 'chat-details-updated', {
                    chatId: chatId,
                    message: `Tag ถูก ${actionType}`
                });
            } catch (e) {
                console.error("Pusher Error:", e);
            }
        }

        return NextResponse.json({ action: actionType, tagId });

    } catch (error) {
        console.error("❌ Tag API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}