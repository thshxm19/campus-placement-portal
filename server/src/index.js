import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import apiRouter from "./routes/api.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Campus Placement Portal API", docs: "/api/health" });
});

async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.warn("MongoDB connection failed, using in-memory data:", error.message);
    }
  } else {
    console.log("MONGO_URI not set, using in-memory demo data");
  }

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

start();
