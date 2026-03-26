import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        profile_image: true,
        online_status: true,
        created_at: true,
      }
    });

    if (!userProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: userProfile }, { status: 200 });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// 2. [PATCH] สำหรับบันทึกข้อมูล (แก้บัค 500 ที่เจอใน Log)
// ---------------------------------------------------------
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, online_status, profile_image } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: username,
        online_status: online_status,
        profile_image: profile_image,
      },
    });

    return NextResponse.json({ 
      message: "อัปเดตข้อมูลสำเร็จ", 
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ 
      message: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" 
    }, { status: 500 });
  }
}