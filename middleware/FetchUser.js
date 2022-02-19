const FetchUser = (req, res, next) => {
    console.log(req.user,"sss")
    if (req.isAuthenticated()) {
        console.log(req.user,"ss")
        return next()
    }
    else{
        req.flash("danger","Please login to continue")
        return res.redirect("/auth/login")
    }
}

module.exports = FetchUser