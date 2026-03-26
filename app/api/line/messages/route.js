import { prisma } from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chat_session_id");

    const messages = await prisma.message.findMany({
        where: {
            chat_session_id: chatId,
        },
        orderBy: {
            created_at: "asc",
        },
    });

    return Response.json(messages);
}