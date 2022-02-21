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
  var lastPage = Math.abs(Math.ceil(totalDocs / postNo) - 1);
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
  res.render("user/password",{error:[]});
});

router.post(
  "/change_password",
  body("password").not().isEmpty(),
  body("newPassword").isLength({ min: 5 }),
  body("password2").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords don't match");
    }
    return true;
  }),
  FetchUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        
        return res.render("user/password", { error: errors.array() });
      }
      if (req.body.password) {
        // @ts-ignore

          const user = await User.findById(req.user.id);
          await user.changePassword(req.body.password,req.body.newPassword);
      // @ts-ignore
          req.flash("success","Password changed succesfully!")
          


      }
    } catch (error) {
      if (error.name == "IncorrectPasswordError"){
        // @ts-ignore
        req.flash("danger", "Incorrect Password!");  
      }
      else{
        // @ts-ignore
        req.flash("danger", "Some Error occured!");
      }
    }
    return res.render("user/password",{error:[]});
  }
);

router.post(
  "/setting",
  body("name", "The field cannot be empty and should be 6 character long")
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
        
        return res.render("user/setting", { error: errors.array() });
      }
      if (req.body.password) {
        // @ts-ignore
        const authenticate = User.authenticate();
        authenticate(req.user.username, req.body.password,async (err, result) => {
          if (err) {
            console.log(err)
            
              // @ts-ignore
            req.flash("danger", "Error occured!");
            
            return res.render("user/setting",{error:[]})
          }
          if (result) {
            const { name, email, about } = req.body;
            await User.findByIdAndUpdate(
              req.user.id,
              { $set: { name,email, about } },
              { new: true }
              );
            // @ts-ignore
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
