const express = require('express')
const router = express.Router()
const User = require("../models/users.js")
const { body, validationResult } = require('express-validator');

router.get("/login",(req,res)=>{
	res.render("login/login")
})
router.get("/register",(req,res)=>{
	res.render("login/register")
})


router.post('/register',
	body("email").isEmail(),
	body("password").isLength({ min: 5 }),
	body('password2').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true
	})

	,(req,res)=>{
	console.log(req.body)
	const {name,email,password,password2} = req.body
	console.log(name,email,password,password2)
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login/register",{error:errors})
    }	

// 	if(!name || !email || !password || !password2) {
//     errors.push({msg : "Please fill in all fields"})
// }
// 	if (!8<name.length < 20){
// 		error.push("Name should be between 8 to 20 characters")
// 	}
// 	if (!8<email.length < 20){
// 		error.push("Name should be between 8 to 20 characters")
// 	}
// 	if (password!=password2){
// 		error.push("Passwords don't match")
// 	}



	
})
router.post('/login',(req,res,next)=>{
  })

//logout
router.post('/logout',(req,res)=>{
 })

module.exports = router	