const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createOrGetConversation } = require("../controllers/conversationController");

router.post("/", authMiddleware, createOrGetConversation);

module.exports = router;