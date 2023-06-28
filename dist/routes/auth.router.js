"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const authRouter = (0, express_1.Router)();
// Handle both signin and signup GET requests
authRouter.get("/sign(in|up)", (req, res) => {
    // Check if user is already signed in
    if (req.session.user)
        return res.redirect("/home");
    res.render(`auth${req.path}`);
});
// Create a new account
authRouter.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    // Create new user with given details
    const user = new user_1.default({ username, email, password });
    // Check if user with that email already exists
    const userExists = await user_1.default.findOne({ email }).exec();
    if (userExists)
        return res.status(409).send("Sorry a user with that email already exists");
    try {
        await user.validate();
    }
    catch (err) {
        return res.send(err);
    }
    await user.save();
    // Create a session of the user
    req.session.user = {
        username: user.username,
        id: user.id,
        email: user.email
    };
    res.redirect("/u/home");
});
// Login to user account
authRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await user_1.default.findOne({ email }).exec();
    // User not found
    if (!user)
        return res.status(404).send("Sorry that user does not exist");
    // Invalid password
    // @ts-ignore
    if (!await user.validatePassword(password))
        return res.status(401).send("Wrong password");
    // Create a session of the user
    req.session.user = {
        username: user.username,
        id: user.id,
        email: user.email
    };
    // Redirect the user to the home page
    res.redirect("/u/home");
});
// Logout a user
authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err)
            console.error(err);
        res.redirect('/');
    });
});
exports.default = authRouter;
