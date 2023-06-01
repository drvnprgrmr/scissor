const express = require("express")
const User = require("../models/user")

const authRouter = express.Router()

authRouter.get("/signup", (req, res) => {
    //TODO: Check if user is already signed in
    res.render("auth/signup")
})

authRouter.post("/signup", async (req, res) => {
    //TODO: Add client side validation for alphanumeric username
    const { username, email, password } = req.body

    const user = new User({ username, email, password })

    
    try {
        await user.validate()
    } catch (err) {
        console.error()
        //TODO: Perform validation
    }

    await user.save()

    res.render("home", { username })

})


module.exports = authRouter