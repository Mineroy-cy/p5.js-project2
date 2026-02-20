import express from "express";
import { sendMessage } from "../controllers/contactController.js";

const router = express.Router();

// POST contact form submission
router.post("/", sendMessage);

export default router;
