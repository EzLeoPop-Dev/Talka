import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// 🟢 GET ปล่อยผ่านเหมือนเดิม
/**
 * @swagger
 * /api/board/columns:
 *   get:
 *     summary: GET for /api/board/columns
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BoardColumn'
 *       500:
 *         description: "Failed to fetch columns"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Failed to fetch columns" }
 */
export async function GET() {
    try {
        const columns = await prisma.boardColumn.findMany({
            orderBy: { order_index: 'asc' }
        });

        let responseData = columns;

        if (columns.length === 0) {
            await prisma.boardColumn.createMany({
                data: [
                    { column_id: "col-1", title: "Inbox", order_index: 1 },
                ]
            });
            responseData = await prisma.boardColumn.findMany({ orderBy: { order_index: 'asc' } });
        }

        return NextResponse.json(responseData, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch columns" }, { status: 500 });
    }
}

//  POST (สร้างคอลัมน์ใหม่)
/**
 * @swagger
 * /api/board/columns:
 *   post:
 *     summary: POST for /api/board/columns
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardColumn'
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardColumn'
 *       500:
 *         description: "Failed to create column"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Failed to create column" }
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const newCol = await prisma.boardColumn.create({
            data: {
                column_id: body.id,
                title: body.title,
                order_index: body.order_index
            }
        });

        try {
            await pusherServer.trigger('global-board', 'board-layout-updated', { message: "มีคอลัมน์ใหม่" });
        } catch (e) { console.error("Pusher Error:", e); }

        return NextResponse.json(newCol);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to create column" }, { status: 500 });
    }
}