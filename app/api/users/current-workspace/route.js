import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

// ดึง ID ทีมปัจจุบันที่ใช้งานอยู่
/**
 * @swagger
 * /api/users/current-workspace:
 *   get:
 *     summary: GET for /api/users/current-workspace
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Unauthorized" }
 *       404:
 *         description: "User not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "User not found" }
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Internal Server Error" }
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { user_id: true, current_workspace_id: true }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        let activeWsId = user.current_workspace_id;

        // 1. ถ้าใน DB มี ID ทีมอยู่... เราต้องเช็คด้วยว่า "ยังเป็นสมาชิกอยู่ไหม?" (เผื่อโดนเตะ)
        if (activeWsId) {
            const checkMembership = await prisma.workspaceMember.findFirst({
                where: { user_id: user.user_id, workspace_id: activeWsId }
            });

            // ถ้าหาไม่เจอ แปลว่าโดนเตะออกไปแล้ว! ให้ล้างค่า activeWsId เป็น null ทันที
            if (!checkMembership) {
                activeWsId = null;
            }
        }

        // 🔥 2. ถ้า activeWsId เป็น null (ไม่เคยมีทีม หรือเพิ่งโดนเตะมาหมาดๆ)
        if (!activeWsId) {
            const firstWs = await prisma.workspaceMember.findFirst({
                where: { user_id: user.user_id }
            });

            activeWsId = firstWs ? firstWs.workspace_id : null;

            await prisma.user.update({
                where: { user_id: user.user_id },
                data: { current_workspace_id: activeWsId }
            });
        }

        return NextResponse.json({ activeWorkspaceId: activeWsId });
    } catch (error) {
        console.error("Current Workspace API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/users/current-workspace:
 *   post:
 *     summary: POST for /api/users/current-workspace
 *     tags: [Users]
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
 *         description: "Missing Workspace ID"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Missing Workspace ID" }
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

        const { workspaceId } = await req.json();

        if (!workspaceId) return NextResponse.json({ error: "Missing Workspace ID" }, { status: 400 });

        await prisma.user.update({
            where: { email: session.user.email },
            data: { current_workspace_id: parseInt(workspaceId) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update Workspace API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}