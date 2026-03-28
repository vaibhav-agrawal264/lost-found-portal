const Conversation = require("../models/Conversation");
const Item = require("../models/Item");
const Message = require("../models/Message");

exports.createOrGetConversation = async (req, res) => {

  try {

    const { itemId, ownerId } = req.body;
    const userId = req.user.id;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const canonicalOwnerId = item.user.toString();
    if (ownerId && ownerId.toString() !== canonicalOwnerId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const participants = [canonicalOwnerId, userId].filter(
      (id, idx, arr) => arr.indexOf(id) === idx
    );

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      item: itemId,
      participants: { $all: participants }
    });

    // If not found → create new conversation
    if (!conversation) {

      conversation = new Conversation({
        item: itemId,
        participants
      });

      await conversation.save();

    }

    res.json(conversation);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("item")
      .populate("participants", "name email")
      .lean();

    // Attach unread counts and identifier for the other person
    for (let conv of conversations) {
      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        sender: { $ne: userId },
        readBy: { $ne: userId }
      });
      conv.unreadCount = unreadCount;
      
      const otherPerson = conv.participants.find(p => p._id.toString() !== userId);
      conv.otherUser = otherPerson ? otherPerson.name : "Unknown User";
    }

    // Sort by higher unread count first
    conversations.sort((a, b) => b.unreadCount - a.unreadCount);

    res.json(conversations);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};