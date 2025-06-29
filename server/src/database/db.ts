import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDataBase = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MongoDB URL not defined in .env file.");
    }
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
