const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const router = express.Router();

router.get('/profile', (req, res) => {
    res.render("user/profile")
});

router.post("/profile", FetchUser , (res,req)=>{

})
module.exports = router