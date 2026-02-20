import express from "express";
import { updateAbout, getAbout } from "../controllers/aboutController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", protect, adminOnly, updateAbout);

export default router;
