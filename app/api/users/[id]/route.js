import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// อัปเดตข้อมูล User (PATCH)
export async function PATCH(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const body = await request.json();
        const { email, role } = body;

        let dbRole = "EMPLOYEE";
        if (role === "Owner" || role === "Admin") dbRole = "ADMIN";
        if (role === "Employee") dbRole = "EMPLOYEE";

        const updatedUser = await prisma.user.update({
            where: { user_id: id },
            data: {
                email: email,
                role: dbRole
            },
        });

        return NextResponse.json({
            id: updatedUser.user_id,
            name: updatedUser.username,
            email: updatedUser.email,
            role: role,
            permission: role
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

// ลบ User (DELETE)
export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        await prisma.teamMember.deleteMany({ where: { user_id: id } });
        await prisma.assignment.deleteMany({ where: { user_id: id } });
        await prisma.note.deleteMany({ where: { user_id: id } });
        await prisma.activityLog.deleteMany({ where: { user_id: id } });

        await prisma.chatSession.updateMany({
            where: { assigned_user_id: id },
            data: { assigned_user_id: null }
        });

        await prisma.user.delete({
            where: { user_id: id },
        });

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}