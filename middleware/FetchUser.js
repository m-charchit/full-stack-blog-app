const FetchUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    else{
        req.flash("danger","Please login to continue")
        return res.redirect("/auth/login")
    }
}

module.exports = FetchUser