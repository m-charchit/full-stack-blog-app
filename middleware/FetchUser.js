const { redirect } = require("express/lib/response")

const FetchUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    else{
        return res.redirect("/auth/login")
    }
}

module.exports = FetchUser