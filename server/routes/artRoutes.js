import express from "express";
import { createArt, getArts, getArt, deleteArt } from "../controllers/artController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getArts);
router.get("/:id", getArt);

router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  createArt
);

router.delete("/:id", protect, adminOnly, deleteArt);

export default router;
