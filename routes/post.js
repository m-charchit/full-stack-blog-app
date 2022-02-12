const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser");
const User = require("../models/users");
const Post = require("../models/posts");

router.get("/u/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  return res.render("posts/post", { post: post });
});

router.get("/write", FetchUser, async (req, res) => {
  return res.render("posts/write");
});

router.get("/edit/:id", FetchUser, async (req, res) => {
  try {
    const userPost = await Post.find({ id: req.params.id, user: req.user.id });
    if (userPost) {
      return res.render("posts/write", { post: userPost });
    }
    return res.redirect("write");
  } catch (error) {
    // @ts-ignore
    req.flash("error", "Oops! Error occured!");
    return res.render("posts/write");
  }
});

router.post("/edit/:id", FetchUser, async (req, res) => {
  try {
    const findNote = await Post.findById(req.params.id);
    if (findNote.user.toString() !== req.user.id) {
      // @ts-ignore
      req.flash("danger", "Not allowrd");
      return res.redirect(`u/${findNote.id}`);
    }
    const note = await Post.findOneAndUpdate(
      { id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    return res.redirect(`u/${findNote.id}`);
  } catch (error) {
    // @ts-ignore
    req.flash("danger", "Error occured!");
    return res.redirect(`edit/${req.params.id}`);
  }
});

router.post("/write", FetchUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    // @ts-ignore
    const post = await Post({
      title,
      content,
      user: req.user,
    }).save();
    if (post) {
      return res.redirect(`u/${post.id}`);
    }
  } catch (error) {
    // @ts-ignore
    req.flash("danger", "Your post was unable to publish");
    return res.redirect("write");
  }
});

module.exports = router;
