"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const link_1 = __importDefault(require("../models/link"));
const user_1 = __importDefault(require("../models/user"));
const userRouter = (0, express_1.Router)();
// Get home page
userRouter.get("/home", async (req, res) => {
    const { username, id } = req.session.user;
    // Grab logged in user
    const user = await user_1.default.findById(id).lean().exec();
    // Get the user's number of links and total hits generated
    const totalLinks = user.links.length;
    const totalHits = user.totalHits;
    // Send data back to the user
    res.render("user/home", { username, totalLinks, totalHits });
});
// Get account page
userRouter.get("/account", async (req, res) => {
    const { username } = req.session.user;
    res.render("user/account", { username });
});
// Update account 
userRouter.patch("/", async (req, res) => {
    let err;
    const { id } = req.session.user;
    const { username, password, passwordNew, passwordRepeat } = req.body;
    const user = await user_1.default.findById(id).exec();
    // Update user 
    // @ts-ignore
    if (await user.validatePassword(password)) {
        user.username = username;
        if (passwordNew && passwordNew === passwordRepeat) {
            user.password = passwordNew;
        }
        else if (passwordNew !== passwordRepeat)
            err = "Passwords do not match";
        if (!err) {
            await user.save();
            if (user.username !== username)
                req.session.user.username = username;
        }
    }
    else
        err = "Wrong password";
    res.send(err);
});
// Delete account 
userRouter.delete("/", async (req, res) => {
    const { id } = req.session.user;
    const { password } = req.body;
    const user = await user_1.default.findById(id).exec();
    // @ts-ignore
    if (await user.validatePassword(password)) {
        // Delete links associated with user
        await Promise.all(user.links.map((linkId) => {
            return link_1.default.findByIdAndDelete(linkId).exec();
        }));
        // Delete user
        await user.deleteOne();
        // Clear session
        req.session.destroy((err) => {
            if (err)
                console.error(err);
        });
        res.end();
    }
    else
        res.send("Wrong password");
});
exports.default = userRouter;
