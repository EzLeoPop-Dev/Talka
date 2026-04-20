import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 🟢 ใช้ตัวแปร prisma จาก lib กลาง
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: ดึงรายชื่อทีมใน Workspace ปัจจุบัน
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: ดึงทีมสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Support Team"
 *                   desc:
 *                     type: string
 *                     example: "ทีมดูแลลูกค้า"
 *                   members:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["john", "alice"]
 *                   memberDetails:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "john"
 *                         email:
 *                           type: string
 *                           example: "john@email.com"
 *                         image:
 *                           type: string
 *                           example: "/profile.jpg"
 *                   platforms:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["facebook", "line"]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to fetch teams"
 *
 *   post:
 *     summary: สร้างทีมใหม่
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Support Team"
 *               desc:
 *                 type: string
 *                 example: "ทีมดูแลลูกค้า"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["john", "alice"]
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["facebook", "line"]
 *     responses:
 *       201:
 *         description: สร้างทีมสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "Support Team"
 *               desc: "ทีมดูแลลูกค้า"
 *               members: ["john", "alice"]
 *               platforms: ["facebook", "line"]
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *         content:
 *           application/json:
 *             example:
 *               error: "No Workspace Found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to create team"
 */

// ดึงรายชื่อทีมเฉพาะใน Workspace ของตัวเอง (GET)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 1. หาข้อมูล User เพื่อเอา current_workspace_id
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { current_workspace_id: true }
        });

        if (!user?.current_workspace_id) return NextResponse.json([]);

        // 2. ดึงเฉพาะทีมที่อยู่ใน Workspace นี้
        const teams = await prisma.team.findMany({
            where: { workspace_id: user.current_workspace_id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                username: true,
                                email: true,
                                profile_image: true // 🟢 เพิ่มรูปโปรไฟล์เผื่อใช้ใน UI
                            }
                        }
                    }
                }
            },
            orderBy: { team_id: 'desc' }
        });

        const formattedTeams = teams.map((team) => ({
            id: team.team_id,
            name: team.team_name,
            desc: team.description || "",
            members: team.members.map(m => m.user.username),
            memberDetails: team.members.map(m => ({
                id: m.user.user_id,
                name: m.user.username,
                email: m.user.email,
                image: m.user.profile_image
            })),
            platforms: Array.isArray(team.platforms) ? team.platforms : []
        }));

        return NextResponse.json(formattedTeams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
    }
}

// สร้างทีมใหม่ (POST)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { current_workspace_id: true }
        });

        if (!user?.current_workspace_id) return NextResponse.json({ error: "No Workspace Found" }, { status: 400 });

        const body = await request.json();
        const { name, desc, members, platforms } = body;

        // 3. ใช้ Transaction เพื่อให้มั่นใจว่าถ้าสร้างทีมสำเร็จ สมาชิกต้องถูกเพิ่มครบ (ถ้าพังก็พังทั้งหมด)
        const result = await prisma.$transaction(async (tx) => {
            // สร้างทีมใหม่พร้อมระบุ workspace_id
            const newTeam = await tx.team.create({
                data: {
                    workspace_id: user.current_workspace_id, // 👈 บรรทัดนี้สำคัญมาก!
                    team_name: name,
                    description: desc,
                    platforms: platforms || []
                }
            });

            // เพิ่มสมาชิกในทีม (เช็คเฉพาะ User ที่อยู่ใน Workspace เดียวกันเท่านั้น)
            if (members && members.length > 0) {
                for (const memberName of members) {
                    const targetUser = await tx.workspaceMember.findFirst({
                        where: { 
                            workspace_id: user.current_workspace_id,
                            user: { username: memberName }
                        },
                        select: { user_id: true }
                    });
                    
                    if (targetUser) {
                        await tx.teamMember.create({
                            data: {
                                team_id: newTeam.team_id,
                                user_id: targetUser.user_id
                            }
                        });
                    }
                }
            }
            return newTeam;
        });

        return NextResponse.json({
            id: result.team_id,
            name: result.team_name,
            desc: result.description || "",
            members: members || [],
            platforms: result.platforms || []
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating team:", error);
        return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
    }
}