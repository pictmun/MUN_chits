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
  const { score,status } = req.body;

  try {
    const updatedMessage = await prisma.message.update({
      where: { id: messageId, isViaEB: true },
      data: { status:status, score },
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
    // Fetch conversations with pending messages
    const conversationsWithPendingMessages = await prisma.conversation.findMany(
      {
        where: {
          messages: {
            some: {
              isViaEB: true,
            },
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true, // Include participant's username
            },
          },
          messages: {
            where: {
              isViaEB: true,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  username: true, // Include sender's username
                },
              },
            },
          },
        },
      }
    );

    // Format conversations to include receiver information
    const formattedConversations = await Promise.all(
      conversationsWithPendingMessages.map(async (conversation) => {
        // Determine the sender ID from the first message
        const senderId = conversation.messages[0]?.sender.id;

        // Find the receiver ID from participants
        const receiverId = conversation.participantIds.find(
          (participant) => participant !== senderId
        );

        if (!receiverId) return null; // Skip if receiver ID is not found

        // Fetch receiver details
        const receiver = await prisma.user.findUnique({
          where: { id: receiverId },
          select: {
            id: true,
            username: true,
            portfolio: true,
          },
        });

        // Ensure receiver and portfolio match
        if (!receiver || receiver.portfolio !== req.user.portfolio) {
          return null; // Skip if receiver is invalid or portfolio doesn't match
        }

        // Return formatted conversation
        return {
          conversationId: conversation.id,
          messages: conversation.messages,
          receiver,
          sender: {
            id: senderId,
            username: conversation.messages[0]?.sender.username,
          },
        };
      })
    );

    // Filter out null results
    const validConversations = formattedConversations.filter(Boolean);

    res
      .status(200)
      .json({ success: true, conversations: validConversations });
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessageFromId = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc", // Order messages by creation time (ascending)
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true, // Include the sender's username
              },
            },
          },
        },
      },
    });
  if(!conversation){
    return res.status(404).json({ message: "Conversation not found" });
  }
  const receiverId = conversation.participantIds.find(
    (participant) => participant !==conversation.messages[0].senderId
  )
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: {
      id: true,
      username: true,
    }
  })
  const formatedConversation={
    conversationId: conversation.id,
    messages: conversation.messages,
    receiver,
    sender: {
      id: conversation.messages[0]?.sender.id,
      username: conversation.messages[0]?.sender.username,
    },
    createdAt: conversation.messages[0]?.createdAt
  }
    res.status(200).json({ success: true, conversation: formatedConversation });
  } catch (error) {
    console.error("Error in getMessageFromId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
