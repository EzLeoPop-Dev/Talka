import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: GET for /api/test
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example: { "success": true }
 */
export function GET() { return Response.json({ok: !!bcrypt && !!nodemailer}) }
