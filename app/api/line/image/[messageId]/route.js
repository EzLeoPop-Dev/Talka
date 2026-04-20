import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/encryption";

/**
 * @swagger
 * /api/line/image/{messageId}:
 *   get:
 *     summary: GET for /api/line/image/{messageId}
 *     tags: [Line]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example: { "success": true }
 *       500:
 *         description: "Failed to fetch image from LINE"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { "error": "Failed to fetch image from LINE" }
 */
export async function GET(req, context) {
    try {
        const { messageId } = await context.params;

        // 1. ดึง Access Token จากแชนเนล LINE ล่าสุด
        const channel = await prisma.channel.findFirst({
            where: { platform_name: "LINE" },
            orderBy: { channel_id: 'desc' }
        });

        if (!channel) return new Response("Channel not found", { status: 404 });

        // 🚨 2. ถอดรหัส Token ก่อนเอาไปใช้งาน
        const realAccessToken = decryptToken(channel.line_access_token);

        // 3. ยิงไปขอไฟล์รูปจาก LINE Data API
        const lineRes = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
            headers: {
                Authorization: `Bearer ${realAccessToken}`,
            },
        });

        if (!lineRes.ok) throw new Error("Failed to fetch image from LINE");

        // 4. ส่งข้อมูลรูปภาพกลับไปให้ Browser โชว์
        const contentType = lineRes.headers.get("content-type");
        const arrayBuffer = await lineRes.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: {
                "Content-Type": contentType || "image/jpeg",
                "Cache-Control": "public, max-age=86400", 
            },
        });

    } catch (error) {
        console.error("❌ Line Image Proxy Error:", error);
        return new Response("Image error", { status: 500 });
    }
}