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

  res.render("auth/register",{error:[]});
	}
	else{
		return res.redirect("/")
	}
});

router.post(
  "/register",
  body("username","The field cannot be empty").not().isEmpty(),
  body("email").isEmail(),
  body("password","Length should be 5 or more").isLength({ min: 5 }),
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't match");
    }
    return true;
  }),
  (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.render("auth/register", { error: errors.array() });
    }
    // @ts-ignore
    User.register(
      new User({ username: username ,email:email}),
       password ,
      (err, account) => {
        if (err) {
			console.log(err,account)
          // @ts-ignore
          req.flash("danger","Sorry. That username already exists. Try again.")
          return res.render("auth/register", {error:[]});
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
	res.redirect('/auth/login');
});

module.exports = router;
