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
  return res.render("posts/write",{error:[]});
});

router.get("/edit/:id",FetchUser, async (req, res) => {
  try {
    const userPost = await Post.findOne({ _id: req.params.id,user:req.user.id});
    if (userPost.user.toString() !== req.user.id) {
      // @ts-ignore
      
      return res.redirect(`/post/u/${userPost.id}`);
    }
    console.log(userPost)
    if (userPost) {
      return res.render("posts/write", { post: userPost ,error:[],});
    }
    return res.redirect(`/post/u/${req.params.id}`);
  } catch (error) {
    // @ts-ignore
    return res.redirect(`/post/u/${req.params.id}`);

  }
});
router.post("/edit/:id", body("title").isLength({min:15}),body("content").isLength({min:200}), FetchUser, async (req, res) => {
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        
        return res.render("posts/write", { error: errors.array() });
      }
    const findPost = await Post.findById(req.params.id);
    if (findPost.user.toString() !== req.user.id) {
      // @ts-ignore
      
      return res.redirect(`/post/u/${findPost.id}`);
    }
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    return res.redirect(`/post/u/${findPost.id}`);
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
      
      return res.redirect(`/post/u/${findPost.id}`);
    }
    await Post.findOneAndDelete({_id:req.params.id,user:req.user.id})
    return res.redirect("/")
  } catch (error) {
    // @ts-ignore
    return res.redirect(`/post/u/${req.params.id}`);
  }
})

router.post("/write",body("title").isLength({min:15}),body("content").isLength({min:200}), FetchUser, async (req, res) => {
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        
        return res.render("posts/write", { error: errors.array() });
      }
    const { title, content } = req.body;
    // @ts-ignore
    const post = await Post({
      title,
      content,
      user: req.user,
    }).save();
    if (post) {
      return res.redirect(`/post/u/${post.id}`);
    }
  } catch (error) {
    // @ts-ignore
    req.flash("danger", "Your post was unable to publish");
    return res.redirect("write");
  }
});

module.exports = router;