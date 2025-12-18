import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Subject } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const homework = await prisma.homework.findUnique({
      where: { id },
    });

    if (!homework) {
      return NextResponse.json(
        { error: "Homework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(homework);
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json(
      { error: "Failed to fetch homework" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      subject,
      title,
      description,
      assignedDate,
      dueDate,
      createdBy,
    } = body;

    // Check if homework exists
    const existing = await prisma.homework.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Homework not found" },
        { status: 404 }
      );
    }

    // Validate subject if provided
    if (subject) {
      const validSubjects: Subject[] = [
        "Web",
        "Java",
        "Spring",
        "Database",
        "Git",
        "UX/UI",
        "Deployment",
      ];
      if (!validSubjects.includes(subject)) {
        return NextResponse.json(
          { error: "Invalid subject" },
          { status: 400 }
        );
      }
    }

    const homework = await prisma.homework.update({
      where: { id },
      data: {
        ...(subject && { subject }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(assignedDate && { assignedDate: new Date(assignedDate) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(createdBy && { createdBy }),
      },
    });

    return NextResponse.json(homework);
  } catch (error) {
    console.error("Error updating homework:", error);
    return NextResponse.json(
      { error: "Failed to update homework" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const homework = await prisma.homework.findUnique({
      where: { id },
    });

    if (!homework) {
      return NextResponse.json(
        { error: "Homework not found" },
        { status: 404 }
      );
    }

    await prisma.homework.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Homework deleted successfully" });
  } catch (error) {
    console.error("Error deleting homework:", error);
    return NextResponse.json(
      { error: "Failed to delete homework" },
      { status: 500 }
    );
  }
}

