import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ระบบดึงข้อมูล (GET) ไปโชว์ที่หน้าเว็บ
export async function GET() {
  try {
    const settings = await prisma.workspaceSetting.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}

// ระบบบันทึก/อัปเดตข้อมูล (POST) จากหน้าเว็บลงฐานข้อมูล
export async function POST(request) {
  try {
    const body = await request.json();
    const { workspaceName, timeoutMinutes, timeZone, logoUrl } = body;

    // เช็กว่ามีข้อมูลเดิมอยู่ในตารางหรือยัง
    const existingSettings = await prisma.workspaceSetting.findFirst();

    let updatedSettings;
    if (existingSettings) {
      // ถ้ามีแล้ว ให้เป็นการ "อัปเดต" ข้อมูลเดิม
      updatedSettings = await prisma.workspaceSetting.update({
        where: { id: existingSettings.id },
        data: { 
          workspaceName, 
          timeoutMinutes: Number(timeoutMinutes), 
          timeZone,
          ...(logoUrl && { logoUrl })
        },
      });
    } else {
      // ถ้ายังไม่มี (เพิ่งเซฟครั้งแรก) ให้ "สร้างใหม่"
      updatedSettings = await prisma.workspaceSetting.create({
        data: { 
          workspaceName, 
          timeoutMinutes: Number(timeoutMinutes), 
          timeZone,
          logoUrl
        },
      });
    }

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}