import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Paper from "@/app/models/paper";
import mongoose from "mongoose";

/**
 * POST /api/papers/upload
 * Creates a new Paper record after file is uploaded to Supabase
 */
export async function POST(req) {
  const dbSession = await mongoose.startSession();

  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await req.json();
    const {
      uploaderID,
      institute,
      subject,
      program,
      specialization,
      semester,
      year,
      storageFileName,
      storageURL,
    } = body;

    // Validate uploaderID matches session
    if (uploaderID !== session.user.id) {
      return NextResponse.json(
        { error: "Uploader ID mismatch" },
        { status: 403 }
      );
    }

    // Validate required fields
    if (
      !institute?.trim() ||
      !subject?.trim() ||
      !program?.trim() ||
      !specialization?.trim() ||
      !semester ||
      !year ||
      !storageFileName?.trim() ||
      !storageURL?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate semester and year ranges
    const semesterNum = parseInt(semester);
    const yearNum = parseInt(year);

    if (
      !Number.isInteger(semesterNum) ||
      semesterNum < 1 ||
      semesterNum > 12
    ) {
      return NextResponse.json(
        { error: "Invalid semester (must be 1-12)" },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(yearNum) ||
      yearNum < 2000 ||
      yearNum > new Date().getFullYear() + 1
    ) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    // 3. Connect to database
    await connectDB();

    // 4. Check for duplicate storageFileName
    const existingPaper = await Paper.findOne({ storageFileName });
    if (existingPaper) {
      return NextResponse.json(
        { error: "Paper with this filename already exists" },
        { status: 409 }
      );
    }

    // 5. Create Paper record in transaction
    let newPaper;
    await dbSession.withTransaction(async () => {
      newPaper = await Paper.create(
        [
          {
            uploaderID: new mongoose.Types.ObjectId(uploaderID),
            institute: institute.trim(),
            subject: subject.trim(),
            program: program.trim(),
            specialization: specialization.trim(),
            semester: semesterNum,
            year: yearNum,
            status: "pending", // Default from schema
            storageFileName: storageFileName.trim(),
            storageURL: storageURL.trim(),
            uploadedAt: new Date(),
          },
        ],
        { session: dbSession }
      );
    });

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Paper uploaded successfully. Pending approval.",
        paperId: newPaper[0]._id.toString(),
        status: newPaper[0].status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Paper upload error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate paper detected" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await dbSession.endSession();
  }
}

/**
 * GET /api/papers/upload
 * Optional: Get user's uploaded papers
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const papers = await Paper.find({ uploaderID: session.user.id })
      .select("subject institute program semester year status uploadedAt")
      .sort({ uploadedAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ papers }, { status: 200 });
  } catch (error) {
    console.error("Get papers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
