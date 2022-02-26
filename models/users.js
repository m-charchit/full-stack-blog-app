const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const User = new mongoose.Schema({
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
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    url: {
      type: String,
      required: true,
      default: "http://127.0.0.1:3000/images/default.jpg",
    },
    filename: {
      type: String,
      required: true,
      default: "images/default.jpg",
    },
  },
  about: {
    type: String,
    default: "User has not written about him.",
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
