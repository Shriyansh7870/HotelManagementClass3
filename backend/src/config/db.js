import mongoose from "mongoose";

const RETRY_DELAY_MS = 5000;

const connectDB = async () => {
  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // fail fast instead of hanging ~30s
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(
        `MongoDB connection failed: ${error.message}\nRetrying in ${
          RETRY_DELAY_MS / 1000
        }s... (check your Atlas IP whitelist if this persists)`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

export default connectDB;
