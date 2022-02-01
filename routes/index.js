const express = require('express')
const router = express.Router()
const fetchUser = require("../middleware/FetchUser.js")

router.get('/', fetchUser ,function (req, res) {
	
	res.render('index', { user : req.user });
});


module.exports = router