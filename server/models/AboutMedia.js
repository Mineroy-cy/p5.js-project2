import mongoose from "mongoose";

/**
 * AboutMedia Schema - Stores About page intro video and text
 * Only one document should exist at a time (latest upload replaces previous)
 */
const aboutMediaSchema = new mongoose.Schema(
  {
    introVideoUrl: String,                           // Cloudinary URL for intro video
    introText: String,                               // Optional introductory text
    uploadedAt: { type: Date, default: Date.now }   // Track upload time
  },
  { timestamps: true }
);

export default mongoose.model("AboutMedia", aboutMediaSchema);
