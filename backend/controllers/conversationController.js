const Conversation = require("../models/Conversation");
const Item = require("../models/Item");

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
      .populate("participants", "name email");

    res.json(conversations);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};