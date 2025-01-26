import express from "express";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";
import {
  getConversationFromId,
  getMessages,
  getReceivedMessages,
  getSentConversations,
  getUserForSidebar,
  replyMessage,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/conversations", protectRoute, getUserForSidebar);
messageRouter.get("/get", protectRoute, getReceivedMessages);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/sent",protectRoute,getSentConversations);
messageRouter.get("/chit/:id", protectRoute, getConversationFromId);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.post("/reply/:id", protectRoute, replyMessage);
export default messageRouter;
