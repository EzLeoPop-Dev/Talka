import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/workspaces/members:
 *   get:
 *     summary: GET for /api/workspaces/members
 *     tags: [Workspaces]
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workspace'
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
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 1. หาว่าเราอยู่ Workspace ไหน
        const myWorkspace = await prisma.workspaceMember.findFirst({
            where: { user_id: dbUser.user_id },
            select: { workspace_id: true }
        });

        if (!myWorkspace) {
            return NextResponse.json([]);
        }

        // 2. ดึงสมาชิกทุกคนที่อยู่ใน Workspace เดียวกับเรา
        const members = await prisma.workspaceMember.findMany({
            where: { workspace_id: myWorkspace.workspace_id },
            include: {
                user: {
                    select: {
                        user_id: true,
                        username: true,
                        email: true,
                        profile_image: true
                    }
                }
            }
        });

        // 3. แปลงข้อมูลส่งกลับไปให้หน้าเว็บโชว์สวยๆ
        const formattedMembers = members.map(m => {
            let role = m.role || "EMPLOYEE";
            // Normalize role format เป็น uppercase และแปลง "Owner" -> "OWNER"
            if (typeof role === "string") {
                role = role.toUpperCase();
                if (role === "OWNER") role = "OWNER";
            }
            return {
                id: m.user.user_id,
                name: m.user.username || "Unnamed User",
                email: m.user.email,
                role: role,
                profile_image: m.user.profile_image
            };
        });

        return NextResponse.json(formattedMembers);

    } catch (error) {
        console.error("❌ Get Workspace Members Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}