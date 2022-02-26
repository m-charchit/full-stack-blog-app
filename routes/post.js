const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser");
const User = require("../models/users");
const Post = require("../models/posts");
const { body, validationResult } = require("express-validator");
const imgFunction = require("./imgFunction");

router.get("/u/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user");

  return res.render("posts/post", { post: post });
});

router.get("/write", FetchUser, async (req, res) => {
  return res.render("posts/write", { error: [] });
});

router.get("/edit/:id", FetchUser, async (req, res) => {
  try {
    const userPost = await Post.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (userPost.user.toString() !== req.user.id) {
      // @ts-ignore

      return res.redirect(`/post/u/${userPost.id}`);
    }

    if (userPost) {
      return res.render("posts/write", { post: userPost, error: [] });
    }
    return res.redirect(`/post/u/${req.params.id}`);
  } catch (error) {
    // @ts-ignore
    return res.redirect(`/post/u/${req.params.id}`);
  }
});
router.post(
  "/edit/:id",
  imgFunction.upload,
  body("title").isLength({ min: 15 }),
  body("content").isLength({ min: 200 }),
  body("file").custom((value, { req }) => {
    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        throw new Error("Only image are allowed!");
      }
      if (req.file.size > 5000000) {
        throw new Error("File is exceeding the max file size of 5 mb.");
      }
    }
    return true;
  }),
  FetchUser,
  async (req, res) => {
    try {
      const findPost = await Post.findById(req.params.id);
      if (findPost.user.toString() !== req.user.id) {
        return res.redirect(`/post/u/${findPost.id}`);
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("posts/write", {
          error: errors.array(),
          post: findPost,
        });
      }

      if (req.file) {
        req.body.postImage = await imgFunction.uploadImg(
          req.file,
          req.user.username,
          findPost.id,
          findPost.postImage
        );
      } else {
        req.body.postImage = findPost.postImage;
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
  }
);

router.post("/deletePost/:id", async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (findPost.user.toString() !== req.user.id) {
      // @ts-ignore

      return res.redirect(`/post/u/${findPost.id}`);
    }
    await imgFunction.deleteImg(findPost.postImage.filename);
    await Post.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    return res.redirect("/");
  } catch (error) {
    // @ts-ignore
    return res.redirect(`/post/u/${req.params.id}`);
  }
});

router.post(
  "/write",
  imgFunction.upload,
  body("title").isLength({ min: 15 }),
  body("content").isLength({ min: 200 }),
  body("file").custom((value, { req }) => {
    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        throw new Error("Only image are allowed!");
      }
      if (req.file.size > 5000000) {
        throw new Error("File is exceeding the max file size of 5 mb.");
      }
    }
    return true;
  }),
  FetchUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("posts/write", { error: errors.array() });
      }
      const { title, content } = req.body;
      let postImage;

      // @ts-ignore
      const post = Post({
        title,
        content,
        user: req.user,
      });

      if (req.file) {
        postImage = await imgFunction.uploadImg(
          req.file,
          req.user.username,
          post.id,
          post.postImage
        );
      } else {
        postImage = post.postImage;
      }
      post.postImage = postImage;
      await post.save();
      if (post) {
        return res.redirect(`/post/u/${post.id}`);
      }
    } catch (error) {
      // @ts-ignore
      req.flash("danger", "Your post was unable to publish");
      return res.redirect("write");
    }
  }
);

module.exports = router;
