import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: POST for /api/auth/verify-email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: "อีเมลนี้ยืนยันไปแล้ว OR รหัสยืนยันไม่ถูกต้อง OR รหัสยืนยันหมดอายุแล้ว โปรดขอรหัสใหม่"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "อีเมลนี้ยืนยันไปแล้ว OR รหัสยืนยันไม่ถูกต้อง OR รหัสยืนยันหมดอายุแล้ว โปรดขอรหัสใหม่" }
 *       404:
 *         description: "ไม่พบผู้ใช้งานนี้"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ไม่พบผู้ใช้งานนี้" }
 *       500:
 *         description: "ยืนยันอีเมลสำเร็จ"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ยืนยันอีเมลสำเร็จ" }
 */
export async function POST(req) {
  try {
    const { email, code } = await req.json();

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้งานนี้" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "อีเมลนี้ยืนยันไปแล้ว" }, { status: 400 });
    }

    if (user.verificationToken !== code) {
      return NextResponse.json({ message: "รหัสยืนยันไม่ถูกต้อง" }, { status: 400 });
    }

    if (new Date() > new Date(user.tokenExpiry)) {
      return NextResponse.json({ message: "รหัสยืนยันหมดอายุแล้ว โปรดขอรหัสใหม่" }, { status: 400 });
    }

    // ถ้ารหัสถูกและไม่หมดอายุ อัปเดตฐานข้อมูลว่ายืนยันแล้ว และลบ Token ทิ้ง
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        tokenExpiry: null
      }
    });

    return NextResponse.json({ success: true, message: "ยืนยันอีเมลสำเร็จ" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}