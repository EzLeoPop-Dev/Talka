// app/api/chat-sessions/[id]/status/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { status } = body;

        // เช็คว่าส่งค่ามาครบไหม
        if (!id || !status) {
            return NextResponse.json({ error: 'Missing chat ID or status' }, { status: 400 });
        }

        // อัปเดตข้อมูลใน Database (อ้างอิงตาม schema.prisma model ChatSession)
        const updatedChat = await prisma.chatSession.update({
            where: { chat_session_id: id },
            data: { status: status },
        });

        // (Optional) คุณอาจจะบันทึก ActivityLog ลง DB ตรงนี้ด้วยก็ได้ถ้าต้องการเก็บใน DB

        return NextResponse.json({
            success: true,
            message: 'Status updated successfully',
            chat: updatedChat
        });

    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}