import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. New Customers (นับจำนวนลูกค้าทั้งหมดในระบบ)
    const newCustomersCount = await prisma.customer.count();

    // 2. Unreplied (นับจำนวนแชทที่สถานะยังเป็น OPEN คือเปิดไว้แต่ยังไม่ได้ปิด/แก้ปัญหา)
    const unrepliedCount = await prisma.chatSession.count({
      where: { status: "OPEN" }
    });

    // 3. Incoming Message (นับข้อความทั้งหมดที่ส่งมาจากฝั่ง CUSTOMER)
    const incomingMessagesCount = await prisma.message.count({
      where: { sender_type: "CUSTOMER" }
    });

    // 4. Close Chat % (คำนวณเปอร์เซ็นต์แชทที่ปิดแล้ว)
    const totalChats = await prisma.chatSession.count(); // แชททั้งหมด
    const closedChats = await prisma.chatSession.count({
      where: { status: "CLOSED" } // แชทที่ปิดแล้ว
    });
    
    // ป้องกันการหารด้วย 0 ถ้ายังไม่มีแชทเลย
    const closedChatPercent = totalChats > 0 
      ? ((closedChats / totalChats) * 100).toFixed(2) 
      : "0.00";

    // แพ็กข้อมูลทั้งหมดส่งกลับไปให้หน้า Frontend
    return NextResponse.json({
      newCustomers: newCustomersCount,
      unreplied: unrepliedCount,
      incomingMessages: incomingMessagesCount,
      closedChatPercent: closedChatPercent
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" }, 
      { status: 500 }
    );
  }
}