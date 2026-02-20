import mongoose from "mongoose";

/**
 * HomeMedia Schema - Stores homepage background image
 * Only one document should exist at a time (latest upload replaces previous)
 */
const homeMediaSchema = new mongoose.Schema(
  {
    backgroundImageUrl: String,                       // Cloudinary URL for background image
    uploadedAt: { type: Date, default: Date.now }    // Track upload time
  },
  { timestamps: true }
);

export default mongoose.model("HomeMedia", homeMediaSchema);
