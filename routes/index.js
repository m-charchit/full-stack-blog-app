const express = require('express')
const router = express.Router()
const FetchUser = require("../middleware/FetchUser.js")
const Post = require("../models/posts")

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'charchit.dahiya@gmail.com',
	  pass: 'cvbv bqwo pawa nflr'
	}
  });

router.get('/', FetchUser , async (req, res) => {
	const posts = await Post.find()
	const userPosts = await Post.find({user:req.user.id})
	res.render('index', { user : req.user , posts:posts ,userPosts:userPosts });
});

router.get('/contact', (req, res) => {
	res.render('contact')
});

router.post("/contact",(req,res)=>{
	const {name,email,message} = req.body

	var mailOptions = {
		from: email,
		to: 'charchit.dahiya@gmail.com',
		subject: `Message from ${name} on Super blog`,
		text: message
	  };


	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error)
		  	return res.sendStatus(500)
		} else {
		  	console.log('Email sent: ' + info.response);
		  	return res.sendStatus(200)
		}
	});
	
})

module.exports = router