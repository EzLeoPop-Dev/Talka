import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// อัปเดตข้อมูล Tag (PATCH) - [อัปเดตสี]
export async function PATCH(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        
        const body = await request.json();
        const { color } = body;

        const updatedTag = await prisma.tag.update({
            where: { tag_id: id },
            data: { color: color },
        });

        return NextResponse.json({ success: true, tag: updatedTag });
    } catch (error) {
        console.error("Error updating tag:", error);
        return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
    }
}

// ลบ Tag (DELETE)
export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        // ลบการเชื่อมต่อระหว่าง Tag กับ Chat
        await prisma.chatTag.deleteMany({
            where: { tag_id: id },
        });
        // ลบการเชื่อมต่อระหว่าง Tag กับ Customer
        await prisma.customerTag.deleteMany({
            where: { tag_id: id },
        });

        // ลบ Tag หลัก
        await prisma.tag.delete({
            where: { tag_id: id },
        });

        return NextResponse.json({ success: true, message: "Tag deleted successfully" });
    } catch (error) {
        console.error("Error deleting tag:", error);
        return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
    }
}