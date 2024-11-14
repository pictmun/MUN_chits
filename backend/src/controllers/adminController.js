import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import pkg from "@prisma/client";
import { getReceiverSocketId, io } from "../socket/socket.js";

const { Role } = pkg;

export const signup = async (req, res) => {
  try {
    const { username, password, portfolio, role, committee } = req.body;
    // Check if username and password are provided
    if (!username || !password || !portfolio || !committee) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a user
    const userRole = Object.values(Role).includes(role) ? role : Role.DELEGATE;
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        portfolio,
        role: userRole,
        committee,
      },
    });
    if (newUser) {
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        portfolio: newUser.portfolio,
        role: newUser.role,
        committee: newUser.committee,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMessageStatus = async (req, res) => {
  const { id: messageId } = req.params;
  const { status, score } = req.body;
  const statusArray = ["APPROVED", "REJECTED", "PENDING"];

  if (!statusArray.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedMessage = await prisma.message.update({
      where: { id: messageId, isViaEB: true },
      data: { status, score },
    });
    const findConversation = await prisma.conversation.findFirst({
      where: { id: updatedMessage.conversationId },
    });
    if (!findConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const receiverId = findConversation.participantIds.find(
      (id) => id !== updatedMessage.senderId
    );
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageStatusUpdated", {
        messageId,
        status,
        score,
      });
    }
    io.to(getReceiverSocketId(updatedMessage.senderId)).emit(
      "messageStatusUpdated",
      {
        messageId,
        status,
        score,
      }
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error in updateMessageStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const pendingMessages = await prisma.message.findMany({
      where: { isViaEB: true, status: "PENDING" },
    });

    // Optionally, emit the latest list of messages to connected clients
    io.emit("allMessagesUpdated", pendingMessages);

    res.status(200).json(pendingMessages);
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
