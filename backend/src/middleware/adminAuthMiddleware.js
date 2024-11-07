import prisma from "../db/prisma.js";

export async function adminAuth(req, res, next) {
  const id = req.user.id;
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Unauthorized to access admin controls" });
  }
  if (
    !req.body.adminPass ||
    req.body.adminPass !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(403).json({
      message:
        "Unauthorized ! Wrong admin password provided or password not provided",
    });
  }
  next();
}
