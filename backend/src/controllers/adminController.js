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
  const { score } = req.body;

  try {
    const updatedMessage = await prisma.message.update({
      where: { id: messageId, isViaEB: true },
      data: { status: "APPROVED", score },
    });

    const findConversation = await prisma.conversation.findFirst({
      where: { id: updatedMessage.conversationId },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!findConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const receiverId = findConversation.participantIds.find(
      (id) => id !== updatedMessage.senderId
    );

    // Build the payload to match `getMessages` response structure
    const payload = {
      id: updatedMessage.id,
      body: updatedMessage.body,
      createdAt: updatedMessage.createdAt,
      senderId: updatedMessage.senderId,
      receiverId,
      status: updatedMessage.status,
      score: updatedMessage.score,
      conversationId: updatedMessage.conversationId,
    };

    // Emit updates to the involved parties
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageStatusUpdated", payload);
    }

    const senderSocketId = getReceiverSocketId(updatedMessage.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageStatusUpdated", payload);
    }

    res
      .status(200)
      .json({
        message: "Message status updated successfully",
        data: updatedMessage,
      });
  } catch (error) {
    console.error("Error in updateMessageStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllMessages = async (req, res) => {
  try {
    const pendingMessages = await prisma.message.findMany({
      where: { isViaEB: true, status: "PENDING" },
      include: { sender:{
        select: {
          id: true,
          username: true, // Include the sender's username
        },
      }, conversation: true },
    });

    // Optionally, emit the latest list of messages to connected clients
    io.emit("allMessagesUpdated", pendingMessages);

    res.status(200).json(pendingMessages);
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMessageFromId = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.message.findUnique({
      where: { id },
      include: { sender:{
        select: {
          id: true,
          username: true, // Include the sender's username
        },
      } },
    });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in getMessageFromId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};