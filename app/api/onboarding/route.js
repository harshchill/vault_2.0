import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import User from "@/app/models/user";
import CoinTransaction from "@/app/models/coinTransactions";

const ONBOARDING_REWARD = 100;

function parseSemester(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const semester = Number(value);
  if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
    return null;
  }

  return semester;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("isOnboarded referralCode referredBy university program specialization semester coinBalance")
      .lean();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      isOnboarded: user.isOnboarded,
      referralCode: user.referralCode || null,
      hasRedeemedReferral: Boolean(user.referredBy),
      profile: {
        university: user.university || "",
        program: user.program || "",
        specialization: user.specialization || "",
        semester: user.semester || "",
      },
      coinBalance: user.coinBalance || 0,
    });
  } catch (error) {
    console.error("Onboarding GET error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const dbSession = await mongoose.startSession();

  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, university, program, specialization, semester } = await req.json();

    if (action !== "skip" && action !== "done") {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const normalizedUniversity = typeof university === "string" ? university.trim() : "";
    const normalizedProgram = typeof program === "string" ? program.trim() : "";
    const normalizedSpecialization = typeof specialization === "string" ? specialization.trim() : "";
    const normalizedSemester = parseSemester(semester);

    if (action === "done") {
      if (!normalizedUniversity || !normalizedProgram || !normalizedSemester) {
        return Response.json(
          { error: "University, program, and valid semester are required." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    let responsePayload = null;

    await dbSession.withTransaction(async () => {
      const user = await User.findById(authSession.user.id).session(dbSession);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (user.isOnboarded) {
        responsePayload = {
          alreadyOnboarded: true,
          isOnboarded: true,
          coinBalance: user.coinBalance,
          coinsAdded: 0,
        };
        return;
      }

      if (action === "done") {
        user.university = normalizedUniversity;
        user.program = normalizedProgram;
        user.specialization = normalizedSpecialization || null;
        user.semester = normalizedSemester;
      }

      user.isOnboarded = true;
      user.coinBalance += ONBOARDING_REWARD;

      await user.save({ session: dbSession });

      await CoinTransaction.create(
        [
          {
            userID: user._id,
            amount: ONBOARDING_REWARD,
            transactionType: "sign-up",
            balanceAfter: user.coinBalance,
            createdAt: new Date(),
          },
        ],
        { session: dbSession }
      );

      responsePayload = {
        success: true,
        isOnboarded: true,
        coinBalance: user.coinBalance,
        coinsAdded: ONBOARDING_REWARD,
      };
    });

    if (!responsePayload) {
      return Response.json({ error: "Unable to complete onboarding" }, { status: 500 });
    }

    return Response.json(responsePayload, { status: 200 });
  } catch (error) {
    if (error?.message === "USER_NOT_FOUND") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    console.error("Onboarding POST error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await dbSession.endSession();
  }
}
