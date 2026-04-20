import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/chats/{chatId}/read:
 *   patch:
 *     summary: PATCH for /api/chats/{chatId}/read
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
 *         description: "Invalid Chat ID"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Invalid Chat ID" }
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Internal Server Error" }
 */
export async function PATCH(req, context) {
    try {

        const params = await context.params; 
        const chatId = parseInt(params.chatId); 

        if (!chatId) {
            return NextResponse.json({ error: "Invalid Chat ID" }, { status: 400 });
        }

        const updated = await prisma.message.updateMany({
            where: {
                chat_session_id: chatId,
                is_read: false,
                sender_type: "CUSTOMER"
            },
            data: {
                is_read: true
            }
        });
        return NextResponse.json({ success: true, updatedCount: updated.count });

    } catch (error) {
        console.error("❌ [Read API] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}