const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

router.get("/profile/:id", async (req, res) => {
  // @ts-ignore
  var page = parseInt(req.query.page);
  const postNo = 8;
  if (!page || page < 0) {
    page = 0;
  }
  const totalDocs = await Post.countDocuments();
  var lastPage = Math.ceil(totalDocs / postNo) - 1;
  if (page > lastPage) page = lastPage;
  const posts = await Post.find({ user: req.params.id })
    .skip(page * postNo)
    .limit(postNo);
  const user = await User.findById(req.params.id);
  res.render("user/profile", {
    posts: posts,
    user: user,
    page: page,
    lastPage: lastPage,
  });
});

router.get("/setting", FetchUser, (req, res) => {
  res.render("user/setting",{error:[]});
});

router.get("/change_password", FetchUser, async (req, res) => {
  res.render("user/password");
});

router.post(
  "/change_password",
  body("password").not().isEmpty(),
  body("newpassword").isLength({ min: 5 }),
  FetchUser,
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render("user/password", { error: errors.array() });
      }
      if (req.body.password) {
        // @ts-ignore
        User.authenticate(
          req.body.password,
          async (err, model, passwordError) => {
            if (passwordError) {
              console.log(err);
              // @ts-ignore
              req.flash("danger", "Incorrect password!");
            } else if (model) {
              const user = await User.findById(req.user.id);
              await user.setPassword(req.body.newpassword).save();
              // @ts-ignore
              req.flash("success", "Password Changed successfully");
            }
          }
        );
      }
    } catch (error) {
      // @ts-ignore
      req.flash("danger", "Error occured!");
    }
    return res.redirect("change_password");
  }
);

router.post(
  "/setting",
  body("username", "The field cannot be empty and should be 6 character long")
    .not()
    .isEmpty()
    .isLength({ min: 6 }),
  body("email").isEmail(),
  body("about").isLength({ min: 25 }),
  body("password", "Length should be 5 or more").isLength({ min: 5 }),
  FetchUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render("user/setting", { error: errors.array() });
      }
      if (req.body.password) {
        // @ts-ignore
        const user = User.authenticate(req.body.password);
        // @ts-ignore
        const authenticate = User.authenticate();
        authenticate(req.user.username, req.body.password,async (err, result) => {
          if (err) {
            // @ts-ignore
            req.flash("danger", "Error occured!");
            return res.render("user/setting",{error:[]})
          }
          if (result) {
            const { username, email, about } = req.body;
            await User.findByIdAndUpdate(
              req.user.id,
              { $set: { email, about } },
              { new: true }
            );
            return res.redirect("setting")
        }
        else{
            // @ts-ignore
            req.flash("danger","Invalid Password!")
              return res.render("user/setting",{error:[]})
          }
        });
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      req.flash("danger", "Error occured!");
      return res.render("user/setting",{error:[]});
    }
  }
);

module.exports = router;
