import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import route handlers
import artRoutes from "./routes/artRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import aboutMediaRoutes from "./routes/aboutMediaRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use("/api/auth", authRoutes);          // Authentication endpoints
app.use("/api/art", artRoutes);            // Artwork CRUD operations
app.use("/api/bids", bidRoutes);           // Bid management
app.use("/api/home", homeRoutes);          // Home background upload
app.use("/api/about", aboutRoutes);        // About page content
app.use("/api/about-media", aboutMediaRoutes); // About intro video
app.use("/api/contact", contactRoutes);    // Contact form

/**
 * Connect to MongoDB first, then start Express server
 * This ensures database is ready before accepting requests
 */
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
  });
