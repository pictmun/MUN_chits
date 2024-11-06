export async function adminAuth(req, res, next) {
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
