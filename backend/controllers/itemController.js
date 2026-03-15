const Item = require("../models/Item");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
// Create new item (lost or found)
exports.createItem = async (req, res) => {

  try {

    const { title, description, category, type, location } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const newItem = new Item({
      title,
      description,
      category,
      type,
      location,
      imageUrl,
      user: req.user.id
    });

    await newItem.save();

    res.json({
      message: "Item created successfully",
      item: newItem
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};

// Get all items
exports.getAllItems = async (req, res) => {
  try {

    const items = await Item.find().sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//get item by ID
exports.getItemById = async (req, res) => {

  try {

    const item = await Item.findById(req.params.id);

    res.json(item);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

//Resolve item
exports.resolveItem = async (req, res) => {

  try {

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.status = "resolved";

    await item.save();

    res.json({ message: "Item marked as resolved" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};

//Delete item
exports.deleteItem = async (req, res) => {

  try {

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    /* Find conversations related to this item */

    const conversations = await Conversation.find({ item: item._id });

    const conversationIds = conversations.map(c => c._id);

    /* Delete all messages of those conversations */

    await Message.deleteMany({
      conversation: { $in: conversationIds }
    });

    /* Delete conversations */

    await Conversation.deleteMany({
      item: item._id
    });

    /* Delete item */

    await item.deleteOne();

    res.json({ message: "Item and associated chats deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};