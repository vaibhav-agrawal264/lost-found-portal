const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Conversation = require("./models/Conversation");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* Middleware */
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

/* Routes */
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageLimiter, messageRoutes);

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.log("MongoDB connection error:", err);
});

/* Basic Test Route */
app.get("/", (req, res) => {
  res.send("Lost & Found API Running");
});

/* Centralized error handler */
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

/* Create HTTP Server */
const server = http.createServer(app);

/* Socket.IO Setup */
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* Socket Events */
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // Authenticate socket using the JWT cookie already used by REST API.
  // For cross-domain setups, ensure cookie has sameSite="none" and secure=true in production.
  const cookieHeader = socket.handshake.headers.cookie;
  const tokenMatch = cookieHeader ? cookieHeader.match(/(?:^|; )token=([^;]*)/) : null;
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  if (!token) {
    socket.disconnect(true);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    socket.userId = decoded.id;
    socket.join(socket.userId); // Join personal room for notifications
  } catch (err) {
    socket.disconnect(true);
    return;
  }

  /* Join conversation room */
  socket.on("joinConversation", async (conversationId) => {
    try {
      if (!conversationId) return;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId
      });

      if (!conversation) return;

      socket.join(conversationId);
    } catch (err) {
      // Ignore invalid joins
    }
  });

  /* Send message */
  socket.on("sendMessage", async (data) => {

    /*
      data example:
      {
        conversationId,
        sender,
        text
      }
    */

    try {
      if (!data?.conversationId) return;

      const conversation = await Conversation.findOne({
        _id: data.conversationId,
        participants: socket.userId
      });

      if (!conversation) return;

      socket.to(data.conversationId).emit("receiveMessage", data);

      // Emit notification to other participants
      const otherParticipants = conversation.participants.filter(
        p => p.toString() !== socket.userId.toString()
      );
      otherParticipants.forEach(p => {
        socket.to(p.toString()).emit("newMessageNotification", data);
      });
    } catch (err) {
      // Ignore relay failures
    }

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* Start Server */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});