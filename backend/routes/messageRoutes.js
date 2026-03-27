const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { sendMessage, getMessages, getUnreadCount, markAsRead } = require("../controllers/messageController");

router.post("/", authMiddleware, sendMessage);

router.get("/unread/count", authMiddleware, getUnreadCount);

router.put("/mark-read/:conversationId", authMiddleware, markAsRead);

router.get("/:conversationId", authMiddleware, getMessages);

module.exports = router;