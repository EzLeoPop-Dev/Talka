import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * @swagger
 * /api/workspaces/create:
 *   post:
 *     summary: POST for /api/workspaces/create
 *     tags: [Workspaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workspace'
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: "Name is required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Name is required" }
 *       401:
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Unauthorized" }
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Internal Server Error" }
 */
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name } = body;

        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        // 1. หา User ปัจจุบัน
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        // 2. สร้าง Workspace ใหม่แบบรวบรัด และตั้งเป็น Owner
        const newWorkspace = await prisma.workspace.create({
            data: {
                name: name,
                members: {
                    create: { user_id: currentUser.user_id, role: "Owner" }
                }
            }
        });

        await prisma.user.update({
            where: { user_id: currentUser.user_id },
            data: { role: "Owner" }
        });

        console.log(`✅ [Waiting Page] สร้าง Workspace: ${newWorkspace.name} สำเร็จ พร้อมเลื่อนยศเป็น Owner`);
        return NextResponse.json({ success: true, workspaceId: newWorkspace.workspace_id });

    } catch (error) {
        console.error("❌ Create Workspace Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}