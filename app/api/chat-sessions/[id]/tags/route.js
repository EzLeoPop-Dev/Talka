// app/api/chat-sessions/[id]/tags/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    try {
        // 🟢 เพิ่ม await เพื่อแกะ params ออกมาก่อน
        const resolvedParams = await params; 
        const chatId = parseInt(resolvedParams.id); 
        
        const { tagName } = await request.json();

        // 1. หา Tag_id จากฐานข้อมูล (ใช้ contains เพราะใน DB อาจมี Emoji รวมอยู่ในชื่อ)
        const tag = await prisma.tag.findFirst({
            where: { tag_name: { contains: tagName } }
        });

        if (!tag) {
            return NextResponse.json({ error: "Tag not found" }, { status: 404 });
        }

        // 2. เช็คว่าแชทนี้มี Tag นี้เชื่อมอยู่แล้วหรือยังในตาราง ChatTag
        const existingChatTag = await prisma.chatTag.findFirst({
            where: {
                chat_session_id: chatId,
                tag_id: tag.tag_id
            }
        });

        if (existingChatTag) {
            // ถ้ามีแล้ว -> ให้ลบออก (Toggle Off)
            await prisma.chatTag.delete({
                where: { chat_tag_id: existingChatTag.chat_tag_id }
            });
            return NextResponse.json({ action: "removed", tagName });
        } else {
            // ถ้ายังไม่มี -> ให้เพิ่มเข้าไป (Toggle On)
            await prisma.chatTag.create({
                data: {
                    chat_session_id: chatId,
                    tag_id: tag.tag_id
                }
            });
            return NextResponse.json({ action: "added", tagName });
        }

    } catch (error) {
        console.error("Error toggling tag:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}