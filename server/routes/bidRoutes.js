import express from "express";
import { placeBid, getBidsForArt, getAllBids } from "../controllers/bidController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Get all bids (admin only)
router.get("/", protect, adminOnly, getAllBids);

// Get bids for specific artwork
router.get("/:id", getBidsForArt);

// Place a bid
router.post("/:id", placeBid);

export default router;
