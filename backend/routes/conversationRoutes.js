const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createOrGetConversation,getUserConversations } = require("../controllers/conversationController");

router.post("/", authMiddleware, createOrGetConversation);
router.get("/all", authMiddleware, getUserConversations);

module.exports = router;