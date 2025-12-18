import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ConflictWarning } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dueDate, id } = body; // id is optional (for updates)

    if (!dueDate) {
      return NextResponse.json(
        { error: "Missing required field: dueDate" },
        { status: 400 }
      );
    }

    const targetDate = new Date(dueDate);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const warnings: ConflictWarning[] = [];

    // Find all homeworks due on the same day (excluding current if updating)
    const sameDayHomeworks = await prisma.homework.findMany({
      where: {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(id && { id: { not: id } }),
      },
    });

    // Check for same-day conflicts
    if (sameDayHomeworks.length > 0) {
      warnings.push({
        type: "sameDay",
        message: `${sameDayHomeworks.length} other homework assignment(s) due on the same day`,
        affectedDates: [dueDate],
      });
    }

    return NextResponse.json(warnings);
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return NextResponse.json(
      { error: "Failed to check conflicts" },
      { status: 500 }
    );
  }
}

