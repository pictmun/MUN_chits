import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

export async function protectRoute(req, res, next) {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized / No token" });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized / Invalid token" });
    }
    const decodedId = decoded.userId;
    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: decodedId,
      },
      select: {
        id: true,
        username: true,
        portfolio: true,
        role: true,
        committee: true,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized/Invalid token" });
    }
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
