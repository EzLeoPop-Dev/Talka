import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//  ดึงรายชื่อ User ทั้งหมด (GET)
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { created_at: 'desc' }
        });

        const formattedUsers = users.map((user) => ({
            id: user.user_id,
            name: user.username,
            email: user.email,
            role: user.role,
            permission: user.role
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// สร้าง User ใหม่ (POST)
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, role } = body;

        const newUser = await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: "defaultPassword123!",
                role: role,
                is_setup: true
            },
        });

        return NextResponse.json({
            id: newUser.user_id,
            name: newUser.username,
            email: newUser.email,
            role: role,
            permission: role
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}