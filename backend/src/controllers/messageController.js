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

    // Determine EB user if message is via EB
    let EBId = null;
    if (isViaEB) {
      const EBUser = await prisma.user.findFirst({
        where: { role: "EB", committee: sender.committee },
      });
      if (!EBUser)
        return res
          .status(404)
          .json({ message: "No EB found for this committee" });
      EBId = EBUser.id;
    }

    // Create or fetch conversation
    const conversation = await prisma.conversation.create({
      data: { participantIds: [senderId, receiverId] },
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
    // Prepare the socket payload
    const socketPayload = {
      id: newMessage.id,
      body: newMessage.body,
      senderId: newMessage.senderId,
      conversationId: newMessage.conversationId,
      isViaEB: newMessage.isViaEB,
      status: newMessage.status,
      createdAt: newMessage.createdAt,
      sender: {
        id: newMessage.sender.id,
        username: newMessage.sender.username,
      },
    };

    // Emit the message to the receiver (or EB if via EB)
    const receiverSocketId = getReceiverSocketId(isViaEB ? EBId : receiverId);
    console.log(receiverSocketId,"sent message"); 
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", JSON.stringify(socketPayload));
    }

    res
      .status(201)
      .json({
        message: "Message sent successfully",
        data: socketPayload,
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
  const { message, isViaEB } = req.body;
  const { id: conversationId } = req.params;
  const senderId = req.user.id;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true },
    });

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    // Identify the receiver as the participant who isn't the sender
    const receiverId = conversation.participantIds.find(
      (id) => id !== senderId
    );
    console.log(conversation.participantIds, senderId, receiverId);

    // Ensure receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    // Fetch EB for the committee if the message is via EB
    let EB = null;
    if (isViaEB) {
      EB = await prisma.user.findFirst({
        where: { role: "EB", committee: receiver.committee },
      });
      if (!EB)
        return res
          .status(404)
          .json({ message: "No EB found for this committee" });
    }

    // Create the new message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        senderId,
        conversationId,
        isViaEB,
        status: isViaEB ? MessageStatus.PENDING : MessageStatus.APPROVED,
      },
    });

    // Emit to the appropriate socket (EB or receiver)
    const receiverSocketId = getReceiverSocketId(isViaEB ? EB.id : receiverId);
    if (receiverSocketId)
      io.to(receiverSocketId).emit("newMessage", newMessage);

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
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
        messages: {
          where: {
            NOT: {
              senderId: userId, // Exclude messages sent by the user
            },
            status: "APPROVED", // Only include approved messages
          },
          orderBy: {
            createdAt: "desc", // Order messages by latest first
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

    // Flatten messages across all conversations
    const receivedMessages = conversations.flatMap((conversation) =>
      conversation.messages.map((message) => ({
        ...message,
        conversationId: conversation.id,
      }))
    );

    res.status(200).json({ messages: receivedMessages, success: true });
  } catch (error) {
    console.error("Error fetching received messages:", error);
    res.status(500).json({ message: "Internal server error", error: true });
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
    res.status(200).json({ message, success: true });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal server error", error: true });
  }
}