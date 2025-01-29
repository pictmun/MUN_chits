import prisma from "../db/prisma.js";
import pkg from "@prisma/client";
import { getReceiverSocketId, io } from "../socket/socket.js";
const { MessageStatus } = pkg;

export const sendMessage = async (req, res) => {
  try {
    const { message, isViaEB } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Message body is required" });
    }

    // Validate receiver
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    // Validate sender
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) return res.status(404).json({ message: "Sender not found" });
    let EBs = [];
    if (isViaEB) {
      EBs = await prisma.user.findMany({
        where: { role: "EB", committee: sender.committee },
      });

      if (!EBs || EBs.length === 0) {
        return res
          .status(404)
          .json({ message: "No EB found for this committee" });
      }
    }

    // Create or fetch conversation
    const conversation = await prisma.conversation.create({
      data: {
        participantIds: [senderId, receiverId],
        participants: { connect: [{ id: senderId }, { id: receiverId }] },
      },
    });

    // Update conversation ID for both users
    await prisma.user.updateMany({
      where: { id: { in: [senderId, receiverId] } },
      data: { conversationIds: { push: conversation.id } },
    });

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        senderId,
        conversationId: conversation.id,
        isViaEB,
        status: isViaEB ? MessageStatus.PENDING : MessageStatus.APPROVED,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    await prisma.conversation.update({
      where: { id: newMessage.conversationId },
      data: {
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
    });
    // Prepare the socket payload
    const socketPayloadDelegate = {
      id: conversation.id,
      messages: [
        {
          id: newMessage.id,
          body: newMessage.body,
          createdAt: newMessage.createdAt,
          sender: {
            id: newMessage.sender.id,
            username: newMessage.sender.username,
          },
          isViaEB: newMessage.isViaEB,
          score: newMessage.score,
        },
      ],
    };
    const socketPayloadEB = {
      conversationId: conversation.id,
      messages: [
        {
          id: newMessage.id,
          body: newMessage.body,
          createdAt: newMessage.createdAt,
          sender: {
            id: newMessage.sender.id,
            username: newMessage.sender.username,
          },
          senderId: newMessage.senderId,
          isViaEB: newMessage.isViaEB,
          score: newMessage.score,
          updatedAt: newMessage.updatedAt,
          status: newMessage.status,
        },
      ],
      sender: {
        id: sender.id,
        username: sender.username,
      },
      receiver: {
        id: receiver.id,
        username: receiver.username,
        portfolio: receiver.portfolio,
      },
    };

    // Emit the message to all EBs if isViaEB
    if (isViaEB) {
      const EBSocketIds = EBs.map((eb) => getReceiverSocketId(eb.id)); // Map only if EBs is an array
      EBSocketIds.forEach((socketId) => {
        if (socketId) {
          io.to(socketId).emit("newMessage", JSON.stringify(socketPayloadEB));
        }
      });
    } else {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "newMessage",
          JSON.stringify(socketPayloadDelegate)
        );
      }
    }
    // Emit the message to the receiver

    res.status(201).json({
      message: "Message sent successfully",
      data: isViaEB ? socketPayloadDelegate : socketPayloadEB,
      success: true,
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
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) return res.status(200).json([]);
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserForSidebar = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const authUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: { not: authUserId },
        role: { in: ["DELEGATE"] },
        committee: req.user.committee,
      },
      select: {
        id: true,
        username: true,
        portfolio: true, // Adjust if portfolio is a relation
        committee: true, // Adjust if committee is a relation
      },
      orderBy: { username: "asc" }, // Optional: Sort users alphabetically
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUserForSidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const replyMessage = async (req, res) => {
  const { message } = req.body;
  const { id: conversationId } = req.params;
  const senderId = req.user.id;

  try {
    // Fetch the conversation and its participants
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
        messages: true, // Include existing messages for context
      },
    });
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    // Identify the receiver as the participant who isn't the sender
    const receiverId = conversation.participantIds.find(
      (id) => id !== senderId
    );
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Fetch EB if the message is via EB
    let EB = null;
    if (conversation.messages[0].isViaEB) {
      EB = await prisma.user.findFirst({
        where: { role: "EB", committee: req.user.committee },
      });
      if (!EB)
        return res
          .status(404)
          .json({ message: "No EB found for this committee" });
    }

    // Create the reply message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        senderId,
        conversationId,
        isViaEB: conversation.messages[0].isViaEB,
        status: conversation.messages[0].isViaEB
          ? MessageStatus.PENDING
          : MessageStatus.APPROVED,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Update the conversation with the new message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
    });
    let messagePayload = {};
    if (conversation.messages[0].isViaEB) {
      messagePayload = {
        id: newMessage.id,
        body: newMessage.body,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        senderId: senderId,
        conversationId: conversationId,
        isViaEB: newMessage.isViaEB,
        status: newMessage.status,
        score: newMessage.score || 0,
        sender: {
          id: senderId,
          username: req.user.username,
        },
        receiver: {
          id: receiverId,
          username: receiver.username,
        },
      };
    } else {
      messagePayload = {
        id: newMessage.id,
        body: newMessage.body,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        senderId: senderId,
        conversationId: conversationId,
        isViaEB: newMessage.isViaEB,
        status: newMessage.status,
        score: newMessage.score || 0,
        sender: {
          id: senderId,
          username: req.user.username,
        },
      };
    }
    // Format the response payload

    // Emit the message to the appropriate socket (EB or receiver)
    const receiverSocketId = getReceiverSocketId(
      conversation.messages[0].isViaEB ? EB.id : receiverId
    );

    const senderSocketId = getReceiverSocketId(senderId);
    // Send real-time socket event for the reply
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reply", JSON.stringify(messagePayload));
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("reply", JSON.stringify(messagePayload));
    }

    // Send the response
    res.status(201).json({
      message: "Message sent successfully",
      data: messagePayload,
      success: true,
    });
  } catch (error) {
    console.error("Error in replying to messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReceivedMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all conversations where the user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          has: userId, // Check if the user is a participant
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true, // Include participant details
          },
        },
        messages: {
          where: {
            NOT: {
              senderId: userId, // Exclude messages sent by the user
            },
            status: "APPROVED", // Only include approved messages
          },
          orderBy: {
            createdAt: "asc", // Order messages by latest first
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

    // Format the conversations for frontend
    const formattedConversations = conversations.map((conversation) => ({
      id: conversation.id,
      participants: conversation.participants.map((participant) => ({
        id: participant.id,
        username: participant.username,
      })),
      messages: conversation.messages.map((message) => ({
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        sender: {
          id: message.sender.id,
          username: message.sender.username,
        },
        isViaEB: message.isViaEB,
        score: message.score,
      })),
    }));
    res
      .status(200)
      .json({ conversations: formattedConversations, success: true });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error", error: true });
  }
};

export const getConversationFromId = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          where: {
            status: "APPROVED",
          },
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
      return res
        .status(404)
        .json({ message: "Conversation not found", success: false });
    }

    // Process messages to include a flag for replies
    const processedMessages = conversation.messages.map((msg) => ({
      ...msg,
      isReply: msg.senderId !== req.user.id, // Flag to indicate if it's a reply
    }));

    res.status(200).json({ messages: processedMessages, success: true });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal server error", error: true });
  }
};

export const getSentConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all conversations where the user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          has: userId, // Check if the user is a participant
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true, // Include participant details
          },
        },
        messages: {
          where: {
            senderId: userId, // Only include messages sent by the user
          },
          orderBy: {
            createdAt: "asc", // Order messages by latest first
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
    const filteredConversations = conversations.filter((conversation) => {
      return conversation.messages.length > 0;
    });
    // Format the conversations for frontend
    const formattedConversations = filteredConversations.map(
      (conversation) => ({
        id: conversation.id,
        participants: conversation.participants.map((participant) => ({
          id: participant.id,
          username: participant.username,
        })),
        messages: conversation.messages.map((message) => ({
          id: message.id,
          body: message.body,
          createdAt: message.createdAt,
          sender: {
            id: message.sender.id,
            username: message.sender.username,
          },
          status: message.status,
        })),
      })
    );
    res
      .status(200)
      .json({ success: true, conversations: formattedConversations });
  } catch (error) {
    console.error("Error in getSentConversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
