import multer from "multer";

/**
 * Multer Configuration for File Uploads
 * Uses memory storage to hold files in RAM before uploading to Cloudinary
 * This avoids writing files to disk temporarily
 */

// Store files in memory as Buffer objects
const storage = multer.memoryStorage();

/**
 * Multer instance with configuration
 * - memoryStorage: Files stored in memory (req.file.buffer)
 * - fileSize limit: 100MB max file size
 */
export const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});
