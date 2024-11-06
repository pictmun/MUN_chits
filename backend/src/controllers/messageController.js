import prisma from "../db/prisma.js";
import { MessageStatus } from "@prisma/client";
export const sendMessage = async (req, res) => {
  try {
    const { message, isViaEB } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Message body is required" });
    }
    const reciever = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!reciever) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    // Find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });
    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: [senderId, receiverId],
        },
      });
      //   Add conversation to sender and receiver
      await prisma.user.update({
        where: {
          id: receiverId,
        },
        data: {
          conversationIds: {
            push: conversation.id,
          },
        },
      });

      await prisma.user.update({
        where: {
          id: senderId,
        },
        data: {
          conversationIds: {
            push: conversation.id,
          },
        },
      });
    }

    // Create a new message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        senderId,
        conversationId: conversation.id,
        isViaEB,
        status: isViaEB ? MessageStatus.PENDING : MessageStatus.APPROVED, // Only approve automatically if not via EB
      },
    });
    // Socket notification

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;
    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatId],
        },
      },
      include: {
        messages: {
          where: {
            status: "APPROVED",
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!conversation) return res.status(200).json([]);
    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserForSidebar = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
        role: {
          in: ["DELEGATE"],
        },
      },
      select: {
        id: true,
        username: true,
        portfolio: true,
        committee: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUserForSidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
