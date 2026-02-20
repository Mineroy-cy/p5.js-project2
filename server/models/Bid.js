import mongoose from "mongoose";

/**
 * Bid Schema - Stores bid information for artworks
 * Links to Art collection through ObjectId reference
 */
const bidSchema = new mongoose.Schema({
  art: { type: mongoose.Schema.Types.ObjectId, ref: "Art" },  // Reference to Art document
  email: String,                                                // Bidder's email
  amount: Number                                                // Bid amount in currency
}, { timestamps: true });  // Tracks when bid was created/updated

export default mongoose.model("Bid", bidSchema);
