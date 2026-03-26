import { prisma } from "@/lib/prisma";

export async function GET() {
    const chats = await prisma.chatSession.findMany({
        include: {
            customer: true,
            platform: true,
            messages: {
                orderBy: { created_at: "asc" },
            },
            tags: true,
        },
        orderBy: {
            start_time: "desc",
        },
    });

    return Response.json(chats);
}