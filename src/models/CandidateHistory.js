import mongoose from "mongoose";

const candidateHistorySchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
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
    interviewDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

candidateHistorySchema.index({ candidateId: 1, createdAt: -1 });
candidateHistorySchema.index({ companyId: 1, jobOpeningId: 1 });

export default mongoose.model("CandidateHistory", candidateHistorySchema);
