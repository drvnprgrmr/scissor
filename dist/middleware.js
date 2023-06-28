"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLoggedIn(req, res, next) {
    if (!req.session.user)
        return res.render("notLoggedIn");
    next();
}
exports.default = isLoggedIn;
