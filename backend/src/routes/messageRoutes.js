import express from "express";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/conversations", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
