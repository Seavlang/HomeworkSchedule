import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Subject } from "@/types";

export async function GET() {
  try {
    // Check if DATABASE_URL is set (this will throw early if not set)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: "DATABASE_URL is not configured. Please create a .env file with your database connection string.",
          details: "Example: DATABASE_URL=\"postgresql://user:password@localhost:5432/homeworksched?schema=public\""
        },
        { status: 500 }
      );
    }
    
    const homeworks = await prisma.homework.findMany({
      orderBy: {
        dueDate: "asc",
      },
    });

    return NextResponse.json(homeworks);
  } catch (error: any) {
    console.error("Error fetching homeworks:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Error stack:", error?.stack);
    
    // Check for Prisma errors
    if (error?.code) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          { error: "Cannot reach database server. Please check your database connection." },
          { status: 500 }
        );
      }
      if (error.code === 'P1002') {
        return NextResponse.json(
          { error: "Database connection timed out. Please try again." },
          { status: 500 }
        );
      }
      if (error.code === 'P1003') {
        return NextResponse.json(
          { error: "Database does not exist. Please check your DATABASE_URL." },
          { status: 500 }
        );
      }
      if (error.code === 'P1017') {
        return NextResponse.json(
          { error: "Database server has closed the connection." },
          { status: 500 }
        );
      }
    }
    
    // Check if it's a schema mismatch error
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('column') || errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      return NextResponse.json(
        { error: "Database schema mismatch. Please run: npx prisma db push" },
        { status: 500 }
      );
    }
    
    // Provide more detailed error message
    const detailedError = errorMessage || "Failed to fetch homeworks. Check server logs for details.";
    return NextResponse.json(
      { error: detailedError, details: process.env.NODE_ENV === 'development' ? error?.stack : undefined },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));
    
    const {
      subject,
      title,
      description,
      assignedDate,
      dueDate,
      createdBy,
    } = body;

    // Validate required fields
    if (!subject || !title || !assignedDate || !dueDate || !createdBy) {
      console.log("Validation failed:", {
        subject: !!subject,
        title: !!title,
        assignedDate: !!assignedDate,
        dueDate: !!dueDate,
        createdBy: !!createdBy,
      });
      return NextResponse.json(
        { error: "Missing required fields", details: { subject: !!subject, title: !!title, assignedDate: !!assignedDate, dueDate: !!dueDate, createdBy: !!createdBy } },
        { status: 400 }
      );
    }

    // Validate subject
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

    // Parse dates and validate
    const assignedDateObj = new Date(assignedDate);
    const dueDateObj = new Date(dueDate);
    
    if (isNaN(assignedDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid assigned date format" },
        { status: 400 }
      );
    }
    
    if (isNaN(dueDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid due date format" },
        { status: 400 }
      );
    }
    
    console.log("Creating homework with data:", {
      subject,
      title,
      description: description || "",
      assignedDate: assignedDateObj.toISOString(),
      dueDate: dueDateObj.toISOString(),
      createdBy,
    });
    
    const homework = await prisma.homework.create({
      data: {
        subject,
        title,
        description: description || "",
        assignedDate: assignedDateObj,
        dueDate: dueDateObj,
        createdBy,
      },
    });

    return NextResponse.json(homework, { status: 201 });
  } catch (error: any) {
    console.error("Error creating homework:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Error stack:", error?.stack);
    
    // Check for Prisma errors
    if (error?.code) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Duplicate entry. This homework already exists." },
          { status: 400 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "Invalid reference. Please check your data." },
          { status: 400 }
        );
      }
      if (error.code === 'P1001') {
        return NextResponse.json(
          { error: "Cannot reach database server. Please check your database connection." },
          { status: 500 }
        );
      }
      if (error.code === 'P1002') {
        return NextResponse.json(
          { error: "Database connection timed out. Please try again." },
          { status: 500 }
        );
      }
      if (error.code === 'P1003') {
        return NextResponse.json(
          { error: "Database does not exist. Please check your DATABASE_URL." },
          { status: 500 }
        );
      }
    }
    
    // Check if it's a schema mismatch error
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('estimatedHours') || errorMessage.includes('column') || errorMessage.includes('does not exist')) {
      return NextResponse.json(
        { error: "Database schema mismatch. The database still has the 'estimatedHours' column. Please run: ALTER TABLE homeworks DROP COLUMN IF EXISTS \"estimatedHours\";" },
        { status: 500 }
      );
    }
    
    // Provide more detailed error message
    const detailedError = errorMessage || "Failed to create homework. Check server logs for details.";
    return NextResponse.json(
      { error: detailedError, details: process.env.NODE_ENV === 'development' ? error?.stack : undefined },
      { status: 500 }
    );
  }
}

