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
  const { score, status } = req.body;

  try {
    const updatedMessage = await prisma.message.update({
      where: { id: messageId, isViaEB: true },
      data: { status: status, score },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
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
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!findConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    let socketPayload = {};
    if (findConversation.messages.length == 1) {
      socketPayload = {
        id: findConversation.id,
        messages: findConversation.messages,
        participants: findConversation.participants,
      };
    } else {
      socketPayload = {
        id: updatedMessage.id,
        status: updatedMessage.status,
        score: updatedMessage.score,
        conversationId: updatedMessage.conversationId,
        body: updatedMessage.body,
        createdAt: updatedMessage.createdAt,
        sender: {
          id: updatedMessage.sender.id,
          username: updatedMessage.sender.username,
        },
        isViaEB: updatedMessage.isViaEB,
      };
    }
    // Build the payload for socket events
    // Emit to all relevant parties
    const receiverId = findConversation.participantIds.find(
      (id) => id !== updatedMessage.senderId
    );

    // Emit to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "messageStatusUpdated",
        JSON.stringify(socketPayload)
      );
    }

    // Emit to sender
    // const senderSocketId = getReceiverSocketId(updatedMessage.senderId);
    // if (senderSocketId) {
    //   io.to(senderSocketId).emit(
    //     "messageStatusUpdated",
    //     JSON.stringify(socketPayload)
    //   );
    // }

    // If message is approved, also emit to EB users
    if (status === "APPROVED") {
      // Find all EB users for the same committee
      const ebUsers = await prisma.user.findMany({
        where: {
          role: "EB",
          committee: req.user.committee,
        },
      });

      // Emit to all EB users
      ebUsers.forEach((ebUser) => {
        const ebSocketId = getReceiverSocketId(ebUser.id);
        if (ebSocketId) {
          io.to(ebSocketId).emit(
            "messageStatusUpdated",
            JSON.stringify(socketPayload)
          );
        }
      });
    }

    res.status(200).json({
      message: "Message status updated successfully",
      data: socketPayload,
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

    res.status(200).json({ success: true, conversations: validConversations });
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessageFromId = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the conversation by ID
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

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Format messages to include receiver details
    const formattedMessages = await Promise.all(
      conversation.messages.map(async (message) => {
        const senderId = message.sender.id;

        // Determine receiver ID (participant other than the sender)
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
          },
        });

        return {
          ...message,
          receiver,
          sender: {
            id: senderId,
            username: message.sender.username,
          },
        };
      })
    );

    // Filter out null messages
    const validMessages = formattedMessages.filter(Boolean);

    // Prepare the final formatted conversation
    const formattedConversation = {
      conversationId: conversation.id,
      messages: validMessages,
      createdAt: conversation.messages[0]?.createdAt,
    };

    res
      .status(200)
      .json({ success: true, conversation: formattedConversation });
  } catch (error) {
    console.error("Error in getMessageFromId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
