import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true, // Allow cookies
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true, // Allow cookies
  },
});
const userSocketMap = {}; //{userId:socketId}
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  // Sends event to all connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log("user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// Helper function for getting socket id of the message receiver
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
export { io, server, app };
