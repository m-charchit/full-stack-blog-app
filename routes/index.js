const express = require('express')
const router = express.Router()
const fetchUser = require("../middleware/FetchUser.js")

router.get('/', fetchUser ,function (req, res) {
	console.log(req.user)
	res.render('index', { user : req.user });
});


module.exports = router