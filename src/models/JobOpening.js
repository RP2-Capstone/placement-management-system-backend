import mongoose from "mongoose";

const jobOpeningSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },

    // ✅ NEW FIELD — Requirements
    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
    },

    // ✅ NEW FIELD — Experience Range
    experience: {
      min: {
        type: Number,
        required: [true, "Minimum experience is required"],
      },
      max: {
        type: Number,
        required: [true, "Maximum experience is required"],
      },
    },

    package: {
      type: Number,
      required: true,
    },

    location: {
      city: String,
      state: String,
      country: String,
    },

    openingDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CLOSED"],
      default: "ACTIVE",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// Auto-expire before save
jobOpeningSchema.pre("save", async function () {
  if (this.expiryDate < new Date()) {
    this.status = "EXPIRED";
  }
});

// Auto-expire before update
jobOpeningSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.expiryDate && new Date(update.expiryDate) < new Date()) {
    update.status = "EXPIRED";
  }
});

export default mongoose.model("JobOpening", jobOpeningSchema);