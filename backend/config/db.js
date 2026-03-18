import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Cache the connection across serverless warm invocations
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  try {
    cached.conn = await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
