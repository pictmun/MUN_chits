import express from "express";
import {
  getAllMarks,
  getAllMessages,
  getMessageFromId,
  signup,
  updateMessageStatus,
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";
import { ebAuth } from "../middleware/ebAuthMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/create", adminAuth, protectRoute, signup);
adminRouter.patch(
  "/update-message-status/:id",
  protectRoute,
  ebAuth,
  updateMessageStatus
);
adminRouter.get("/get-messages", protectRoute, ebAuth, getAllMessages);
adminRouter.get("/get-message/:id", protectRoute, ebAuth, getMessageFromId);
adminRouter.get("/get-marks", protectRoute, ebAuth, getAllMarks);
export default adminRouter;
