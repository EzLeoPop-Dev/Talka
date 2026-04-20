import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🟢 ดึงข้อมูล Prompt ทั้งหมด
/**
 * @swagger
 * /api/prompts:
 *   get:
 *     summary: GET for /api/prompts
 *     tags: [Prompts]
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AiPrompt'
 *       500:
 *         description: "Failed to fetch prompts"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Failed to fetch prompts" }
 */
export async function GET() {
  try {
    const prompts = await prisma.aiPrompt.findMany({
      orderBy: { created_at: 'desc' } // เรียงจากอันใหม่ล่าสุดขึ้นก่อน
    });
    return NextResponse.json(prompts, { status: 200 });
  } catch (error) {
    console.error("Fetch Prompts Error:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

// 🟢 สร้าง Prompt ใหม่
/**
 * @swagger
 * /api/prompts:
 *   post:
 *     summary: POST for /api/prompts
 *     tags: [Prompts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AiPrompt'
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiPrompt'
 *       500:
 *         description: "Failed to create prompt"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Failed to create prompt" }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, action } = body;

    const newPrompt = await prisma.aiPrompt.create({
      data: {
        name,
        action,
        active: true,
        isDefault: false
      }
    });

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error("Create Prompt Error:", error);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}
