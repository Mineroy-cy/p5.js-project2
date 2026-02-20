import express from "express";
import { addAboutMedia, getAboutMedia } from "../controllers/aboutMediaController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET about media
router.get("/", getAboutMedia);

// POST add about intro video (admin only)
router.post("/", protect, adminOnly, upload.single("video"), addAboutMedia);

export default router;
