const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const { body, validationResult } = require("express-validator");
const passport = require("passport");



router.get("/login",  (req, res) => {
	if (req.isUnauthenticated()){
  		res.render("auth/login",{user:req.user});
	}
	else{
		return res.redirect("/")
	}
});
router.get("/register", (req, res) => {
	
	if(req.isUnauthenticated()){

  res.render("auth/register");
	}
	else{
		return res.redirect("/")
	}
});

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("auth/register", { error: errors });
    }
    // @ts-ignore
    User.register(
      new User({ username: username ,email:email}),
       password ,
      (err, account) => {
        if (err) {
			console.log(err,account)
          return res.render("auth/register", {
            info: "Sorry. That username already exists. Try again.",
			
          });
        }

        passport.authenticate("local")(req, res, () => {
          res.redirect("/");
        });
      }
    );
  }
);


router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));
//logout
router.post('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
