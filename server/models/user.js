const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notifications: [
    {
      type: String,
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
      read: {
        type: Boolean,
        default: false,
      },
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
