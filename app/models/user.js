import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, default: null }, // Allow null for OAuth-only users
  name: { type: String, required: true },
  coinBalance: { type: Number, default: 0 }, 
  isPremium: { type: Boolean, default: false  },
  premiumExpiry: { type: Date },
  referralCode: { type: String, required: true, unique: true },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  pfp_url: { type: String },
  isOnboarded: { type: Boolean, default: false },
  university: { type: String, default: null },
  program: { type: String, default: null },
  specialization: { type: String, default: null },
  semester: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
