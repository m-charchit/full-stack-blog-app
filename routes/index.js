const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser.js");
const Post = require("../models/posts");
const { body, validationResult } = require("express-validator");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "charchit.dahiya@gmail.com",
    pass: "cvbv bqwo pawa nflr",
  },
});

router.get("/", FetchUser, async (req, res) => {
  const posts = await Post.find();

  res.render("index", { user: req.user, posts: posts });
});

router.get("/contact", (req, res) => {
  	return res.render("contact", { error: [] });
});

router.post(
  "/contact",
  body("name").not().isEmpty(),
  body("email").isEmail(),
  body("message", "Should contain atleast 30 character").isLength({ min: 30 }),
  (req, res) => {
    const { name, email, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.render("contact", { error: errors.array() });
    }
    var mailOptions = {
      from: email,
      to: "charchit.dahiya@gmail.com",
      subject: `Message from ${name} on Super blog`,
      text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
		  // @ts-ignore
		  req.flash("danger","Error occured! Try again later. If error persists , contact creator.")
		  res.redirect("contact")
		  return res.sendStatus(500);
      } else {
		  console.log(info)
		  // @ts-ignore
		  req.flash("success","Message sent successfully!")
		  res.redirect("contact");
		  return res.sendStatus(200)
      }
    });

  }
);

module.exports = router;
