import express from "express";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";
import {
  getMessages,
  getUserForSidebar,
  replyMessage,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/conversations", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.post("/reply/:id", protectRoute, replyMessage);
export default messageRouter;
