import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

// 🟢 1. ฟังก์ชันสำหรับ "ลบคอลัมน์" (DELETE)
/**
 * @swagger
 * /api/board/columns/{id}:
 *   delete:
 *     summary: DELETE for /api/board/columns/{id}
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example: { "success": true }
 *       400:
 *         description: "ไม่พบ ID ของคอลัมน์ OR ไม่สามารถลบ Inbox หลักได้"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ไม่พบ ID ของคอลัมน์ OR ไม่สามารถลบ Inbox หลักได้" }
 *       500:
 *         description: "ลบคอลัมน์ใน Database ไม่สำเร็จ"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ลบคอลัมน์ใน Database ไม่สำเร็จ" }
 */
export async function DELETE(req, context) {
    try {
        const params = await context.params;
        const columnId = params.id;

        if (!columnId) {
            return NextResponse.json({ error: "ไม่พบ ID ของคอลัมน์" }, { status: 400 });
        }

        if (columnId === "col-1") {
            return NextResponse.json({ error: "ไม่สามารถลบ Inbox หลักได้" }, { status: 400 });
        }

        await prisma.chatSession.updateMany({
            where: { board_column_id: columnId },
            data: { board_column_id: "col-1" }
        });

        await prisma.boardColumn.delete({
            where: { column_id: columnId }
        });

        console.log(`✅ ลบคอลัมน์ ${columnId} สำเร็จ`);

        // 🔥 2. ตะโกนบอกทุกทีม (เพราะตอนนี้บอร์ดยังไม่แยกทีม)
        try {
            await pusherServer.trigger('global-board', 'board-layout-updated', { message: "คอลัมน์ถูกลบ" });
        } catch (e) { console.error("Pusher Error:", e); }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Delete Column Error:", error);
        return NextResponse.json({ error: "ลบคอลัมน์ใน Database ไม่สำเร็จ" }, { status: 500 });
    }
} 

// 🟢 2. อัปเดตชื่อคอลัมน์ (PATCH)
/**
 * @swagger
 * /api/board/columns/{id}:
 *   patch:
 *     summary: PATCH for /api/board/columns/{id}
 *     tags: [Board]
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
 *             $ref: '#/components/schemas/BoardColumn'
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardColumn'
 *       400:
 *         description: "ข้อมูลไม่ครบถ้วน"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ข้อมูลไม่ครบถ้วน" }
 *       500:
 *         description: "ไม่สามารถอัปเดตคอลัมน์ได้"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ไม่สามารถอัปเดตคอลัมน์ได้" }
 */
export async function PATCH(req, context) {
    try {
        const params = await context.params;
        const columnId = params.id;
        const { title } = await req.json();

        if (!columnId || !title) {
            return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
        }

        const updatedCol = await prisma.boardColumn.update({
            where: { column_id: columnId },
            data: { title: title }
        });

        //  3. ตะโกนบอกทุกคน
        try {
            await pusherServer.trigger('global-board', 'board-layout-updated', { message: "คอลัมน์ถูกเปลี่ยนชื่อ" });
        } catch (e) { console.error("Pusher Error:", e); }

        return NextResponse.json({ success: true, column: updatedCol });

    } catch (error) {
        console.error("❌ Update Column Error:", error);
        return NextResponse.json({ error: "ไม่สามารถอัปเดตคอลัมน์ได้" }, { status: 500 });
    }
}