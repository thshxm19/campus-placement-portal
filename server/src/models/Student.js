import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    branch: String,
    cgpa: Number,
    skills: [String],
    resumeText: String
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
