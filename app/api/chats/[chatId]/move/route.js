import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

/**
 * @swagger
 * /api/chats/{chatId}/move:
 *   patch:
 *     summary: PATCH for /api/chats/{chatId}/move
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: chatId
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
 *         description: "ข้อมูลไม่ครบถ้วน (chatId หรือ columnId หาย)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ข้อมูลไม่ครบถ้วน (chatId หรือ columnId หาย)" }
 *       500:
 *         description: "ไม่สามารถบันทึกการย้ายแชทลง Database ได้"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ไม่สามารถบันทึกการย้ายแชทลง Database ได้" }
 */
export async function PATCH(req, context) {
    try {
        const params = await Promise.resolve(context.params);
        
        const rawId = params.chatId || params.id; 
        const chatId = parseInt(rawId);
        
        const body = await req.json();
        const columnId = body.columnId;

        if (!chatId || isNaN(chatId) || !columnId) {
            console.error(`❌ Move Error: chatId=${rawId}, columnId=${columnId}`);
            return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน (chatId หรือ columnId หาย)" }, { status: 400 });
        }

        const updatedChat = await prisma.chatSession.update({
            where: { chat_session_id: chatId },
            data: { board_column_id: columnId },
            include: { channel: { select: { workspace_id: true } } } 
        });

        console.log(`✅ ย้ายแชท ${chatId} ไปที่คอลัมน์ ${columnId} สำเร็จ!`);

        //  2. ตะโกนบอกทีมผ่าน Pusher)
        if (updatedChat.channel?.workspace_id) {
            try {
                await pusherServer.trigger(`workspace-${updatedChat.channel.workspace_id}`, 'board-updated', {
                    action: "MOVE_CHAT",
                    chatId: chatId,
                    columnId: columnId,
                    message: "มีการย้ายแชทในบอร์ด"
                });
            } catch (e) {
                console.error("Pusher Error:", e);
            }
        }

        return NextResponse.json({ success: true, chat: updatedChat });

    } catch (error) {
        console.error("❌ Move Chat Error:", error);
        return NextResponse.json({ error: "ไม่สามารถบันทึกการย้ายแชทลง Database ได้" }, { status: 500 });
    }
}