"use server";

import { connectDB } from "@/lib/connectDB";
import Paper from "@/app/models/paper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Fetches approved papers with optional filters
 * @param {Object} filters - Filter options (institute, subject, program, semester, year, search)
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of papers per page
 */
export async function getPapers(filters = {}, page = 1, limit = 12) {
  try {
    await connectDB();

    const {
      institute,
      subject,
      program,
      specialization,
      semester,
      year,
      search,
    } = filters;

    // Build query for approved papers only
    const query = { status: "approved" };

    // Add filters if provided
    if (institute) query.institute = new RegExp(institute, "i");
    if (subject) query.subject = new RegExp(subject, "i");
    if (program) query.program = new RegExp(program, "i");
    if (specialization) query.specialization = new RegExp(specialization, "i");
    if (semester) query.semester = parseInt(semester);
    if (year) query.year = parseInt(year);

    // Add search across multiple fields
    if (search) {
      query.$or = [
        { institute: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { program: new RegExp(search, "i") },
        { specialization: new RegExp(search, "i") },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch papers with pagination
    const [papers, totalCount] = await Promise.all([
      Paper.find(query)
        .select(
          "institute subject program specialization semester year storageURL uploadedAt unlockCounts saveCounts"
        )
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Paper.countDocuments(query),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      papers: JSON.parse(JSON.stringify(papers)),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.error("Get papers error:", error);
    return {
      success: false,
      error: "Failed to fetch papers",
      papers: [],
      pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasMore: false },
    };
  }
}

/**
 * Gets unique filter options from approved papers
 */
export async function getFilterOptions() {
  try {
    await connectDB();

    const [institutes, subjects, programs, specializations] = await Promise.all([
      Paper.distinct("institute", { status: "approved" }),
      Paper.distinct("subject", { status: "approved" }),
      Paper.distinct("program", { status: "approved" }),
      Paper.distinct("specialization", { status: "approved" }),
    ]);

    return {
      success: true,
      options: {
        institutes: institutes.sort(),
        subjects: subjects.sort(),
        programs: programs.sort(),
        specializations: specializations.sort(),
      },
    };
  } catch (error) {
    console.error("Get filter options error:", error);
    return {
      success: false,
      options: {
        institutes: [],
        subjects: [],
        programs: [],
        specializations: [],
      },
    };
  }
}

/**
 * Saves a paper to user's saved list
 */
export async function savePaper(paperId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const SavedPaper = (await import("@/app/models/savedPaper")).default;

    // Check if already saved
    const existing = await SavedPaper.findOne({
      userID: session.user.id,
      paperID: paperId,
    });

    if (existing) {
      return { success: false, error: "Paper already saved" };
    }

    // Save paper
    await SavedPaper.create({
      userID: session.user.id,
      paperID: paperId,
      savedAt: new Date(),
    });

    // Increment save count
    await Paper.findByIdAndUpdate(paperId, { $inc: { saveCounts: 1 } });

    return { success: true, message: "Paper saved successfully" };
  } catch (error) {
    console.error("Save paper error:", error);
    return { success: false, error: "Failed to save paper" };
  }
}

/**
 * Checks if user has saved specific papers
 */
export async function checkSavedPapers(paperIds) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: true, savedPaperIds: [] };
    }

    await connectDB();

    const SavedPaper = (await import("@/app/models/savedPaper")).default;

    const savedPapers = await SavedPaper.find({
      userID: session.user.id,
      paperID: { $in: paperIds },
    }).select("paperID");

    const savedPaperIds = savedPapers.map((sp) => sp.paperID.toString());

    return { success: true, savedPaperIds };
  } catch (error) {
    console.error("Check saved papers error:", error);
    return { success: true, savedPaperIds: [] };
  }
}
