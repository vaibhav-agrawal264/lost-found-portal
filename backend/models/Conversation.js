const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({

  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Conversation", ConversationSchema);