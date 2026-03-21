import User from "@/app/models/user";

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEFAULT_CODE_LENGTH = 8;
const MAX_GENERATION_ATTEMPTS = 20;

function buildCode(length = DEFAULT_CODE_LENGTH) {
  let code = "";
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    code += CHARSET[randomIndex];
  }
  return code;
}

export async function generateUniqueReferralCode() {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const code = buildCode();
    const existingUser = await User.findOne({ referralCode: code }).select("_id").lean();
    if (!existingUser) {
      return code;
    }
  }

  throw new Error("Failed to generate unique referral code");
}

export async function createUserWithUniqueReferralCode(payload) {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      const referralCode = await generateUniqueReferralCode();
      const user = await User.create({ ...payload, referralCode });
      return user;
    } catch (error) {
      if (error?.code === 11000 && error?.keyPattern?.referralCode) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Unable to create user with unique referral code");
}

export async function ensureUserReferralCode(userId) {
  const user = await User.findById(userId).select("_id referralCode");
  if (!user) {
    return null;
  }

  if (user.referralCode) {
    return user.referralCode;
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const referralCode = await generateUniqueReferralCode();
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        $or: [
          { referralCode: { $exists: false } },
          { referralCode: null },
          { referralCode: "" },
        ],
      },
      { $set: { referralCode } },
      { new: true }
    )
      .select("referralCode")
      .lean();

    if (updatedUser?.referralCode) {
      return updatedUser.referralCode;
    }

    const existing = await User.findById(userId).select("referralCode").lean();
    if (existing?.referralCode) {
      return existing.referralCode;
    }
  }

  throw new Error("Unable to ensure referral code");
}
