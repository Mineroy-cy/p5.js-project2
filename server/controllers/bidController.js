import Bid from "../models/Bid.js";

/**
 * Place a new bid on artwork
 * POST /api/art/:id/bid
 * @access Public
 */
export const placeBid = async (req, res) => {
  const { email, amount } = req.body;

  // Create bid linked to artwork ID from URL params
  const bid = await Bid.create({
    art: req.params.id,
    email,
    amount
  });

  res.json(bid);
};

/**
 * Get all bids for a specific artwork
 * Sorted by amount (highest first)
 * GET /api/art/:id/bids
 * @access Public
 */
export const getBidsForArt = async (req, res) => {
  const bids = await Bid.find({ art: req.params.id })
    .sort({ amount: -1 });

  res.json(bids);
};

/**
 * Get all bids across all artworks
 * Includes full artwork details via populate
 * GET /api/bids
 * @access Admin only
 */
export const getAllBids = async (req, res) => {
  const bids = await Bid.find().sort({ amount: -1 }).populate("art");
  res.json(bids);
};
