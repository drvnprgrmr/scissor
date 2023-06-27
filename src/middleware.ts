function isLoggedIn(req, res, next) {
    if (!req.session.user) return res.render("notLoggedIn")
    next()
}



export {
    isLoggedIn
}