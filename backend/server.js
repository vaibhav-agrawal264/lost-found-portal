const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* Middleware */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

/* Routes */
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

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

/* Create HTTP Server */
const server = http.createServer(app);

/* Socket.IO Setup */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

/* Socket Events */
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  /* Join conversation room */
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  /* Send message */
  socket.on("sendMessage", (data) => {

    /*
      data example:
      {
        conversationId,
        sender,
        text
      }
    */

    io.to(data.conversationId).emit("receiveMessage", data);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* Start Server */
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});