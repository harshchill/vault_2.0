import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import User from "@/app/models/user";
import CoinTransaction from "@/app/models/coinTransactions";

const REFERRAL_REWARD = 50;

export async function POST(req) {
  const dbSession = await mongoose.startSession();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const referralCode = typeof body?.referralCode === "string" ? body.referralCode.trim().toUpperCase() : "";

    if (!referralCode) {
      return Response.json({ error: "Referral code is required" }, { status: 400 });
    }

    await connectDB();

    let responsePayload = null;

    await dbSession.withTransaction(async () => {
      const currentUser = await User.findById(session.user.id).session(dbSession);
      if (!currentUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (currentUser.referredBy) {
        throw new Error("ALREADY_REDEEMED");
      }

      if ((currentUser.referralCode || "").toUpperCase() === referralCode) {
        throw new Error("SELF_REFERRAL");
      }

      const referrer = await User.findOne({ referralCode }).session(dbSession);
      if (!referrer) {
        throw new Error("REFERRAL_NOT_FOUND");
      }

      if (String(referrer._id) === String(currentUser._id)) {
        throw new Error("SELF_REFERRAL");
      }

      currentUser.referredBy = referrer._id;
      currentUser.coinBalance += REFERRAL_REWARD;
      referrer.coinBalance += REFERRAL_REWARD;

      await currentUser.save({ session: dbSession });
      await referrer.save({ session: dbSession });

      await CoinTransaction.insertMany(
        [
          {
            userID: currentUser._id,
            amount: REFERRAL_REWARD,
            transactionType: "referral",
            balanceAfter: currentUser.coinBalance,
            createdAt: new Date(),
          },
          {
            userID: referrer._id,
            amount: REFERRAL_REWARD,
            transactionType: "referral",
            balanceAfter: referrer.coinBalance,
            createdAt: new Date(),
          },
        ],
        { session: dbSession }
      );

      responsePayload = {
        success: true,
        coinBalance: currentUser.coinBalance,
        coinsAdded: REFERRAL_REWARD,
      };
    });

    return Response.json(responsePayload, { status: 200 });
  } catch (error) {
    if (error?.message === "USER_NOT_FOUND") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (error?.message === "ALREADY_REDEEMED") {
      return Response.json({ error: "Referral already redeemed" }, { status: 409 });
    }
    if (error?.message === "REFERRAL_NOT_FOUND") {
      return Response.json({ error: "Invalid referral code" }, { status: 404 });
    }
    if (error?.message === "SELF_REFERRAL") {
      return Response.json({ error: "You cannot use your own referral code" }, { status: 400 });
    }

    console.error("Referral redeem error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await dbSession.endSession();
  }
}
