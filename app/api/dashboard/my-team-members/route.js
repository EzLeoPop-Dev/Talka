import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. ดึงข้อมูลผู้ใช้งานจากตาราง User มาสัก 10 คนล่าสุด
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { created_at: 'desc' }
    });

    // 2. แปลงข้อมูลให้หน้าตาเหมือนที่ Frontend ต้องการเป๊ะๆ
    const formattedMembers = users.map(user => {
      return {
        id: user.user_id,
        name: user.username,
        role: user.role, // ดึงตำแหน่งจากฐานข้อมูล (USER, ADMIN, EMPLOYEE, MANAGER)
        // ถ้ามีรูปโปรไฟล์ให้ใช้รูปจริง ถ้าไม่มี (null) ให้ใช้ API สร้างรูปสุ่มตามชื่อ
        avatar: user.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`
      };
    });

    // 3. ส่งข้อมูลกลับไปให้หน้าเว็บ
    return NextResponse.json({
      teamName: "OneChat Support Team", // ส่งชื่อทีมกลับไปด้วย
      members: formattedMembers
    });

  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" }, 
      { status: 500 }
    );
  }
}