const Conversation = require("../models/Conversation");

exports.createOrGetConversation = async (req, res) => {

  try {

    const { itemId, ownerId } = req.body;
    const userId = req.user.id;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      item: itemId,
      participants: { $all: [ownerId, userId] }
    });

    // If not found → create new conversation
    if (!conversation) {

      conversation = new Conversation({
        item: itemId,
        participants: [ownerId, userId]
      });

      await conversation.save();

    }

    res.json(conversation);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};