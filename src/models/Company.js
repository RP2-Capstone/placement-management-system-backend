import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    industry: String,
    website: String,
    aboutCompany: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

companySchema.virtual("contacts", {
  ref: "Contact",
  localField: "_id",
  foreignField: "companyId",
});

companySchema.set("toObject", { virtuals: true });
companySchema.set("toJSON", { virtuals: true });
companySchema.index({ companyName: "text" }); // for search

export default model("Company", companySchema); //Companies
