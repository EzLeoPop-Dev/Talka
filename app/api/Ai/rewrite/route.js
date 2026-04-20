import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/Ai/rewrite:
 *   post:
 *     summary: POST for /api/Ai/rewrite
 *     tags: [Ai]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "exampleKey": "exampleValue" }
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example: { "success": true }
 *       400:
 *         description: "Missing text or action"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Missing text or action" }
 *       500:
 *         description: "AI response empty OR Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "AI response empty OR Internal Server Error" }
 */
export async function POST(req) {
  try {
    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: "Missing text or action" }, { status: 400 });
    }

    // 1. กำหนดหน้าที่ให้ AI (System Prompt)
    const systemInstruction = `You are a professional writing assistant. Your task is to rewrite the user's text strictly following this instruction: "${action}". 
CRITICAL RULE: Return ONLY the rewritten text. Do not include any quotes, conversational filler, or explanations.`;

    // 2. ยิงไปให้ Dify ประมวลผล
    const difyResponse = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { custom_prompt: systemInstruction },
        query: text, // ข้อความต้นฉบับที่พนักงานพิมพ์
        response_mode: "blocking",
        user: `employee-rewrite-${Date.now()}`
      })
    });

    const difyData = await difyResponse.json();
    const rewrittenText = difyData.answer?.trim();

    if (rewrittenText) {
      return NextResponse.json({ text: rewrittenText }, { status: 200 });
    } else {
      return NextResponse.json({ error: "AI response empty" }, { status: 500 });
    }

  } catch (error) {
    console.error("AI Rewrite Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}