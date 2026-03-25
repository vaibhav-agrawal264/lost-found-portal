const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.sendMessage = async (req, res) => {

  try {

    const { conversationId, text } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    // Only participants can send into a conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user.id,
      text
    });

    await newMessage.save();

    // Re-fetch with populate so sender.{name,email} is included immediately.
    // This avoids any mismatch between in-memory docs vs serialized JSON.
    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name email");
    res.json(populatedMessage);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};


exports.getMessages = async (req, res) => {

  try {
    if (!req.params.conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    // Only participants can read messages for a conversation
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};