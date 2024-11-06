import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
dotenv.config();

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use(express.json()); //for parsing application/json
app.use(cookieParser()); //for parsing cookies
// Api Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/admin", adminRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
