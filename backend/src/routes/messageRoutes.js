import express from "express";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";
import {
  getMessageFromId,
  getMessages,
  getReceivedMessages,
  getUserForSidebar,
  replyMessage,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/conversations", protectRoute, getUserForSidebar);
messageRouter.get("/get", protectRoute, getReceivedMessages);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.get("/chit/:id", protectRoute, getMessageFromId);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.post("/reply/:id", protectRoute, replyMessage);
export default messageRouter;
