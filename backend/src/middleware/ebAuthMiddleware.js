import prisma from "../db/prisma.js";

export async function ebAuth(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "EB") {
      return res
        .status(403)
        .json({ message: "Unauthorized to access EB controls" });
    }
    next();
  } catch (error) {
    console.log("Error in ebAuthMiddleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
