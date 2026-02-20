import jwt from "jsonwebtoken";

/**
 * Authentication middleware - Verifies user has a valid token
 * Supports both simple admin token and JWT verification
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const protect = (req, res, next) => {
  // Extract token from "Bearer <token>" format in Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Simple token check for admin (demo purposes)
  if (token === "admin-token") {
    req.user = { role: "admin" };
    return next();
  }

  // JWT verification for production use
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Admin authorization middleware - Verifies user has admin privileges
 * Must be used after protect middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};
