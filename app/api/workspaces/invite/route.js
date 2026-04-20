import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

/**
 * @swagger
 * /api/workspaces/invite:
 *   post:
 *     summary: POST for /api/workspaces/invite
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
 *         description: "กรุณากรอกอีเมลที่ต้องการเชิญ OR ไม่พบ Workspace ของคุณ OR ผู้ใช้นี้อยู่ในทีมของคุณอยู่แล้ว OR คุณส่งคำเชิญไปหาผู้ใช้นี้แล้ว กรุณารอการตอบรับ"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "กรุณากรอกอีเมลที่ต้องการเชิญ OR ไม่พบ Workspace ของคุณ OR ผู้ใช้นี้อยู่ในทีมของคุณอยู่แล้ว OR คุณส่งคำเชิญไปหาผู้ใช้นี้แล้ว กรุณารอการตอบรับ" }
 *       401:
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Unauthorized" }
 *       404:
 *         description: "ไม่พบผู้ใช้งานนี้ในระบบ (เขาต้องสมัครสมาชิกก่อน)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "ไม่พบผู้ใช้งานนี้ในระบบ (เขาต้องสมัครสมาชิกก่อน)" }
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
        if (!session || !session.user || !session.user.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { email, role } = body;

        if (!email) return NextResponse.json({ error: "กรุณากรอกอีเมลที่ต้องการเชิญ" }, { status: 400 });

        const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        const myWorkspace = await prisma.workspaceMember.findFirst({
            where: { user_id: currentUser.user_id },
            select: { workspace_id: true }
        });

        if (!myWorkspace) return NextResponse.json({ error: "ไม่พบ Workspace ของคุณ" }, { status: 400 });
        const workspaceId = myWorkspace.workspace_id;

        const targetUser = await prisma.user.findUnique({ where: { email: email.trim() } });
        if (!targetUser) return NextResponse.json({ error: "ไม่พบผู้ใช้งานนี้ในระบบ (เขาต้องสมัครสมาชิกก่อน)" }, { status: 404 });

        const isAlreadyMember = await prisma.workspaceMember.findUnique({
            where: { workspace_id_user_id: { workspace_id: workspaceId, user_id: targetUser.user_id } }
        });
        if (isAlreadyMember) return NextResponse.json({ error: "ผู้ใช้นี้อยู่ในทีมของคุณอยู่แล้ว" }, { status: 400 });

        const alreadyInvited = await prisma.workspaceInvite.findFirst({
            where: { workspace_id: workspaceId, invitee_email: email.trim(), status: "PENDING" }
        });
        if (alreadyInvited) return NextResponse.json({ error: "คุณส่งคำเชิญไปหาผู้ใช้นี้แล้ว กรุณารอการตอบรับ" }, { status: 400 });

        // 1. สร้างคำเชิญลง Database
        await prisma.workspaceInvite.create({
            data: {
                workspace_id: workspaceId,
                inviter_id: currentUser.user_id,
                invitee_email: email.trim(),
                role: role ? role.toUpperCase() : "EMPLOYEE"
            }
        });

        // 2. ตะโกนบอกคนที่ถูกเชิญ (เป้าหมาย) ให้ดึงข้อมูลการแจ้งเตือนใหม่ทันที
        try {
            await pusherServer.trigger(`user-${targetUser.user_id}`, 'new-invitation', {
                message: "คุณได้รับคำเชิญเข้าทีมใหม่!"
            });
        } catch (e) { console.error("Pusher Notification Error:", e); }

        // 3. ตะโกนบอกเพื่อนในทีมเดิม ว่ามีการส่งคำเชิญออกไป (อัปเดตตารางให้แอดมินคนอื่นเห็น)
        try {
            await pusherServer.trigger(`workspace-${workspaceId}`, 'workspace-updated', {
                message: "อัปเดตรายการส่งคำเชิญแล้ว"
            });
        } catch (e) { console.error("Pusher Workspace Error:", e); }

        return NextResponse.json({ success: true, message: `ส่งคำเชิญไปยัง ${email} สำเร็จแล้ว!` });

    } catch (error) {
        console.error("❌ Workspace Invite Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}