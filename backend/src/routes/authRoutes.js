import express from "express";
import { login, logout, getMe } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protectRoute, getMe);

export default authRouter;
