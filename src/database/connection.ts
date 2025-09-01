import mongoose from "mongoose";
 import dotenv from "dotenv";
 dotenv.config();
const connectDB = async (): Promise<void> => {
    console.log("MONGO_URI:", process.env.DATABAS_URL!);

  try {
    const conn = await mongoose.connect(process.env.DATABAS_URL!)
    console.log("Conected ");
  } catch (error) {
    console.error(" MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
