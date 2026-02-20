import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * Uses MongoDB Atlas cluster or falls back to local MongoDB
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB with timeout configurations
    // serverSelectionTimeoutMS: Time to find available server
    // socketTimeoutMS: Time for socket operations
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/art_auction', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.log("\n⚠️  Check your internet connection and MongoDB Atlas settings");
    process.exit(1); // Exit application if DB connection fails
  }
};

export default connectDB;
