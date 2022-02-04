const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser");

router.get("/u/:id",(req,res)=>{
    res.render("posts/post")
})

router.get('/write', FetchUser, (req, res) => {
    res.render("posts/write")
});

router.get("/edit/:id", FetchUser, (req,res)=>{
    res.render("posts/write")
})

router.post("/edit/:id" ,FetchUser,(req,res)=> {
    res.redirect("/edit/")
})

router.post("/write",FetchUser, (req,res)=>{
    res.redirect("/write")
})

module.exports = router
