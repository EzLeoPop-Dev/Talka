import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();

    const updatedPrompt = await prisma.aiPrompt.update({
      where: { id: id },
      data: { 
        name: body.name,
        action: body.action,
        active: body.active
      } 
    });

    return NextResponse.json(updatedPrompt, { status: 200 });
  } catch (error) {
    console.error("Update Prompt Error:", error);
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    await prisma.aiPrompt.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Prompt Error:", error);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}