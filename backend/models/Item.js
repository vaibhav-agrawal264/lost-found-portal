const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String
  },

  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },

  location: {
    type: String
  },

  imageUrl: {
    type: String
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["open", "active", "resolved"],
    default: "open"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

});

module.exports = mongoose.model("Item", ItemSchema);