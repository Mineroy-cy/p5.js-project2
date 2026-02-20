import HomeMedia from "../models/HomeMedia.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Helper function to upload buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Secure URL of uploaded file
 */
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || result?.url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Upload new home background image
 * Deletes previous background and replaces with new one
 * POST /api/home
 * @access Admin only
 */
export const addHomeMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      "home-background"
    );

    // Delete previous background (only keep one)
    await HomeMedia.deleteMany({});

    // Create new background entry
    const media = await HomeMedia.create({
      backgroundImageUrl: imageUrl
    });

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get current home background image
 * GET /api/home
 * @access Public
 */
export const getHomeMedia = async (req, res) => {
  try {
    // Find the most recent home background
    const media = await HomeMedia.findOne();
    res.json(media || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
