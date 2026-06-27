import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: String,
    title: String,
    package: String,
    location: String,
    type: String,
    requiredCgpa: Number,
    skills: [String],
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
