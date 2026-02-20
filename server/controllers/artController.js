import Art from "../models/Art.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

/**
 * Helper function to upload file buffer to Cloudinary
 * Converts buffer to readable stream and pipes to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} filename - Original filename
 * @param {string} resourceType - Type of resource (image, video, auto)
 * @returns {Promise<Object>} - Cloudinary upload result with secure_url
 */
const uploadToCloudinary = (buffer, filename, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    // Create upload stream to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "gallery", // Upload to 'gallery' folder in Cloudinary
        public_id: `${Date.now()}-${filename}` // Unique identifier using timestamp
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    Readable.from(buffer).pipe(stream);
  });
};

/**
 * Create new artwork with image, optional video, and optional audio
 * POST /api/art
 * @access Admin only
 */
export const createArt = async (req, res) => {
  try {
    const { title, description, auctionEnd } = req.body;

    console.log("=== UPLOAD DEBUG ===");
    console.log("Body:", { title, description, auctionEnd });
    console.log("Files received:", Object.keys(req.files || {}));

    // Validate required image file
    if (!req.files?.image?.[0]) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image (required)
    console.log("Uploading image...");
    const imageResult = await uploadToCloudinary(
      req.files.image[0].buffer,
      req.files.image[0].originalname,
      "image"
    );
    const imageUrl = imageResult.secure_url || imageResult.url || "";
    console.log("Image uploaded:", imageUrl);

    // Upload video (optional)
    let videoUrl = null;
    if (req.files?.video?.[0]) {
      console.log("Uploading video...");
      const videoResult = await uploadToCloudinary(
        req.files.video[0].buffer,
        req.files.video[0].originalname,
        "video"
      );
      videoUrl = videoResult.secure_url || videoResult.url || null;
      console.log("Video uploaded:", videoUrl);
      if (!videoUrl) {
        return res.status(500).json({ message: "Video upload failed" });
      }
    }

    // Upload audio (optional)
    let audioUrl = null;
    if (req.files?.audio?.[0]) {
      console.log("Uploading audio...");
      const audioResult = await uploadToCloudinary(
        req.files.audio[0].buffer,
        req.files.audio[0].originalname,
        "video" // Cloudinary stores audio as video resource type
      );
      audioUrl = audioResult.secure_url || audioResult.url || null;
      console.log("Audio uploaded:", audioUrl);
      if (!audioUrl) {
        return res.status(500).json({ message: "Audio upload failed" });
      }
    }

    // Create artwork document in MongoDB
    const art = await Art.create({
      title,
      description,
      imageUrl,
      videoUrl,
      audioUrl,
      auctionEnd
    });

    console.log("Artwork created:", art);
    res.json(art);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all artworks sorted by creation date (newest first)
 * GET /api/art
 * @access Public
 */
export const getArts = async (req, res) => {
  try {
    const arts = await Art.find().sort({ createdAt: -1 });
    res.json(arts);
  } catch (error) {
    console.error("Get arts error:", error);
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
};

/**
 * Get single artwork by ID
 * GET /api/art/:id
 * @access Public
 */
export const getArt = async (req, res) => {
  const art = await Art.findById(req.params.id);
  res.json(art);
};

/**
 * Delete artwork by ID
 * DELETE /api/art/:id
 * @access Admin only
 */
export const deleteArt = async (req, res) => {
  const art = await Art.findByIdAndDelete(req.params.id);
  res.json({ message: "Artwork deleted", art });
};
