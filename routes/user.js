const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const router = express.Router();

router.get('/profile', (req, res) => {
    res.render("user/profile")
});

router.get("/setting", FetchUser , (req,res)=>{
    res.render("user/setting")
})

router.get("/change_password", FetchUser, (req,res) => {
    res.render("user/password")
})

router.post("/change_password", FetchUser, (req,res) => {
    
})
router.post("/profile/edit", FetchUser, (req,res)=>{
    
})



module.exports = router