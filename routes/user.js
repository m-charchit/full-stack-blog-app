const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const router = express.Router();
const Post = require("../models/posts")
const User = require("../models/users")
const { body, validationResult } = require("express-validator");

router.get('/profile/:id', async (req, res) => {
    const userPosts = Post.find({user:req.params.id})
    const user = User.findById(req.params.id)
    res.render("user/profile",{posts:userPosts,user:user})
});

router.get("/setting", FetchUser , (req,res)=>{
    res.render("user/setting",{user:req.user})
})

router.get("/change_password", FetchUser, (req,res) => {
    res.render("user/password")
})

router.post("/change_password",body("password").not().isEmpty(),body("newpassword").isLength({min:5}), FetchUser, (req,res) => {
    try {
        if (req.body.password){
            // @ts-ignore
            User.authenticate(req.body.password, async (err,model,passwordError) => {
                if(passwordError){
                    console.log(err)
                    // @ts-ignore
                    req.flash("danger","Incorrect password!")
                } else if(model) {
                    const user = await User.findById(req.user.id)
                    await user.setPassword(req.body.newpassword).save()
                    // @ts-ignore
                    req.flash("success","Password Changed successfully")     
                }
            })
        }

    } catch (error) {
        // @ts-ignore
        req.flash("danger","Error occured!")
    }
    return res.redirect("change_password")
})
router.post("/setting", body("username","The field cannot be empty and should be 6 character long").not().isEmpty().isLength({min:6}),body("email").isEmail(),body("about").isLength({min:25}), FetchUser, (req,res)=>{
    try {
        if (req.body.password){
            // @ts-ignore
            User.authenticate(req.body.password, async (err,model,passwordError) => {
                if(passwordError){
                    console.log(err)
                    // @ts-ignore
                    req.flash("danger","Incorrect password!")
                } else if(model) {
                    const {username,email,about} = req.body
                    await User.findByIdAndUpdate(req.user.id,{ $set: {username,email,about} },{ new: true })
                }
            })
        }

    } catch (error) {
        // @ts-ignore
        req.flash("danger","Error occured!")
    }
    return res.redirect("setting")
})



module.exports = router