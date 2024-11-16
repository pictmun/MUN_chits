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
      return res.status(400).json({ message: "All fields are required",success:false });
    }
    // Check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      return res.status(400).json({ message: "User already exists",success:false });
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
        success: true,
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
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        }
      },
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

    // Build the payload to match `getMessages` response structure
    const socketPayload = {
      id: updatedMessage.id,
      body: updatedMessage.body,
      senderId: updatedMessage.senderId,
      conversationId: updatedMessage.conversationId,
      isViaEB: updatedMessage.isViaEB,
      status: updatedMessage.status,
      createdAt: updatedMessage.createdAt,
      sender: {
        id: updatedMessage.sender.id,
        username: updatedMessage.sender.username,
      },
    };

    // Emit updates to the involved parties
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", JSON.stringify(socketPayload));
    }

    const senderSocketId = getReceiverSocketId(updatedMessage.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageStatusUpdated", JSON.stringify(socketPayload));
    }

    res.status(200).json({
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
    // Ensure the user is authenticated
    const { id: userId } = req.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { committee: true }, // Only select the committee field
    });

    // Check if the user exists and has a committee
    if (!user || !user.committee) {
      return res.status(404).json({ message: "User or committee not found" });
    }

    // Fetch messages only from the user's committee and include sender and conversation data
    const pendingMessages = await prisma.message.findMany({
      where: {
        isViaEB: true,
        sender: {
          committee: user.committee, // Filter messages by sender's committee
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true, // Include the sender's username
            committee: true, // Include the sender's committee for verification
          },
        },
        conversation: {
          select: {
            id: true, // Include conversation ID
            participantIds: true, // Include participant IDs
          },
        },
      },
    });

    // Construct response payload to show sender and receiver usernames with the message body
    const formattedMessages = [];

    for (const message of pendingMessages) {
      const receiverId = message.conversation.participantIds.find(
        (id) => id !== message.sender.id
      );

      const receiver = receiverId
        ? await prisma.user.findUnique({
            where: { id: receiverId },
            select: {
              id: true,
              username: true,
            },
          })
        : null;

      formattedMessages.push({
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        sender: {
          id: message.sender.id,
          username: message.sender.username,
        },
        receiver: receiver
          ? {
              id: receiver.id,
              username: receiver.username,
            }
          : null,
          status: message.status,
      });
    }

    // Send the formatted messages
    res.status(200).json(formattedMessages);
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
      include: {
        sender: {
          select: {
            id: true,
            username: true, // Include the sender's username
          },
        },
      },
    });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in getMessageFromId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
