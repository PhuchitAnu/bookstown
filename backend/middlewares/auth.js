import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware ตรวจสอบ JWT
 * @param {boolean} requireAdmin - true หาก endpoint ต้องการ admin
 */

export const authenticateToken = (requireAdmin = false) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header)
        return res
          .status(401)
          .json({ message: "Missing Authorization header" });

      const token = header.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Missing token" });

      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid or expired token" });
        if (requireAdmin && decoded.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        req.user = decoded; // decoded should contain at least user id
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};
