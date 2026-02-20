import AboutMedia from "../models/AboutMedia.js";
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
 * Upload new about intro video with optional intro text
 * Deletes previous intro and replaces with new one
 * POST /api/about-media
 * @access Admin only
 */
export const addAboutMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video is required" });
    }

    // Upload video to Cloudinary
    const videoUrl = await uploadToCloudinary(
      req.file.buffer,
      "about-intro"
    );

    // Delete previous intro (only keep one)
    await AboutMedia.deleteMany({});

    // Create new intro entry with optional text
    const media = await AboutMedia.create({
      introVideoUrl: videoUrl,
      introText: req.body.introText || ""
    });

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get current about intro video and text
 * GET /api/about-media
 * @access Public
 */
export const getAboutMedia = async (req, res) => {
  try {
    // Find the most recent about intro
    const media = await AboutMedia.findOne();
    res.json(media || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
