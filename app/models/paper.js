import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  uploaderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  institute: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  program: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1 },
  year: { type: Number, required: true, min: 2000 },
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending",
  },
  isExtracted: { type: Boolean, default: false },
  storageFileName: { type: String, required: true, trim: true },
  storageURL: { type: String, required: true, trim: true },
  unlockCounts: { type: Number, default: 0, min: 0 },
  saveCounts: { type: Number, default: 0, min: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

const Paper = mongoose.models.Paper || mongoose.model("Paper", paperSchema);

export default Paper;