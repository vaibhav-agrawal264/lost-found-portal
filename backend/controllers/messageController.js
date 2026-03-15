const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {

  try {

    const { conversationId, text } = req.body;

    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user.id,
      text
    });

    await newMessage.save();

    res.json(newMessage);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};


exports.getMessages = async (req, res) => {

  try {

    const messages = await Message.find({
      conversation: req.params.conversationId
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};