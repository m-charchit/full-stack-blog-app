const express = require('express')
const router = express.Router()
const FetchUser = require("../middleware/FetchUser.js")

router.get('/', FetchUser , (req, res) => {
	
	res.render('index', { user : req.user });
});


router.get('/contact', (req, res) => {
	res.render('contact')
});

module.exports = router