const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser");
const User = require("../models/users");
const Post = require("../models/posts");
const { body, validationResult } = require("express-validator");


router.get("/u/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user");
  console.log(post)
  return res.render("posts/post", { post: post });
});

router.get("/write", FetchUser, async (req, res) => {
  return res.render("posts/write");
});

router.get("/edit/:id",FetchUser, async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (findPost.user.toString() !== req.user.id) {
      // @ts-ignore
      req.flash("danger", "Not allowrd");
      return res.redirect(`u/${findPost.id}`);
    }
    const userPost = await Post.find({ id: req.params.id, user: req.user.id });
    if (userPost) {
      return res.render("posts/write", { post: userPost });
    }
    return res.redirect(`u/${req.params.id}`);
  } catch (error) {
    // @ts-ignore
    req.flash("error", "Oops! Error occured!");
    return res.redirect(`u/${req.params.id}`);

  }
});
router.post("/edit/:id", body("title").isLength({min:15}),body("content").isLength({min:200}), FetchUser, async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (findPost.user.toString() !== req.user.id) {
      // @ts-ignore
      req.flash("danger", "Not allowrd");
      return res.redirect(`u/${findPost.id}`);
    }
    const post = await Post.findOneAndUpdate(
      { id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    return res.redirect(`u/${findPost.id}`);
  } catch (error) {
    // @ts-ignore
    req.flash("danger", "Error occured!");
    return res.redirect(`edit/${req.params.id}`);
  }
});

router.post("/deletePost/:id",async(req,res)=>{
  try {
    
    const findPost = await Post.findById(req.params.id);
    if (findPost.user.toString() !== req.user.id) {
      // @ts-ignore
      req.flash("danger", "Not allowrd");
      return res.redirect(`u/${findPost.id}`);
    }
    await Post.findOneAndDelete({id:req.params.id,user:req.user.id})
    return res.redirect("/")
  } catch (error) {
    // @ts-ignore
    req.flash("danger", "Your post was unable to delete!");
    return res.redirect(`u/${req.params.id}`);
  }
})

router.post("/write",body("title").isLength({min:15}),body("content").isLength({min:200}), FetchUser, async (req, res) => {
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