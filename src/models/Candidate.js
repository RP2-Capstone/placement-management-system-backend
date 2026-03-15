import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    jobOpeningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpening",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    interviewRounds: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      trim: true,
    },
    interviewDate: {
      type: Date,
      default: Date.now,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

candidateSchema.index({ companyId: 1, jobOpeningId: 1 });
candidateSchema.index({ studentName: 1 });

export default mongoose.model("Candidate", candidateSchema);
