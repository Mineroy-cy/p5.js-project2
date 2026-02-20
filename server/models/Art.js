import mongoose from "mongoose";

/**
 * Art Schema - Defines the structure for artwork documents
 * Each artwork can have an image, optional video background, and optional audio
 */
const artSchema = new mongoose.Schema({
  title: String,              // Artwork title
  description: String,        // Artwork description
  imageUrl: String,           // Main image (Cloudinary URL)
  videoUrl: String,           // Optional background video
  audioUrl: String,           // Optional background audio
  auctionEnd: Date           // Auction end datetime
}, { timestamps: true });     // Automatically adds createdAt and updatedAt

export default mongoose.model("Art", artSchema);
