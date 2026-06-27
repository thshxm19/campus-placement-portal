import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: String,
    industry: String,
    location: String,
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
