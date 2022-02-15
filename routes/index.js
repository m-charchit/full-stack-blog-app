const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser.js");
const Post = require("../models/posts");
const { body, validationResult } = require("express-validator");
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

router.get("/", FetchUser, async (req, res) => {
  // @ts-ignore
  var page = parseInt(req.query.page)
  const postNo = 8
  if (!page || page < 0){
    page = 0
  }
  const totalDocs = await Post.countDocuments()
  var lastPage = Math.ceil(totalDocs/postNo) -1
  if (page>lastPage) page=lastPage
  const posts = await Post.find().skip(page*postNo).limit(postNo);
  res.render("index", {  posts: posts ,page:page, lastPage:lastPage});
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
      html:`${message}\n\n${req.user.username}\n\nusername - http://127.0.0.1:3000/user/profile/${req.user.id}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
		  // @ts-ignore
		  req.flash("danger","Error occured! Try again later. If error persists , contact creator.")
		  return res.redirect("contact")
      } else {
		  console.log(info)
		  // @ts-ignore
		  req.flash("success","Message sent successfully!")
		  return res.redirect("contact");
      }
    });

  }
);

module.exports = router;
