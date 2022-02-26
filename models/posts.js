const mongoose = require("mongoose");
const Post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postImage: {
    url: {
      type: String,
      required: true,
      default: "http://127.0.0.1:3000/images/defaultPost.jpg",
    },
    filename: {
      type: String,
      required: true,
      default: "images/defaultPost.jpg",
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", Post);
