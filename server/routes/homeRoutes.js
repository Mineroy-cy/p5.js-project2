import express from "express";
import { addHomeMedia, getHomeMedia } from "../controllers/homeController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET homepage content
router.get("/", getHomeMedia);

// POST add homepage media (admin only)
router.post("/", protect, adminOnly, upload.single("image"), addHomeMedia);

export default router;
