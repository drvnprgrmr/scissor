const express = require("express")

const User = require("../models/user")

const authRouter = express.Router()


// Handle both signin and signup GET requests
authRouter.get("/sign(in|up)", (req, res) => {
    // Check if user is already signed in
    if (req.session.user) return res.redirect("/home")

    res.render(`auth${req.path}`)
})

authRouter.post("/signup", async (req, res) => {
    //TODO: Add client side validation for alphanumeric username
    const { username, email, password } = req.body

    // Create new user with given details
    const user = new User({ username, email, password })

    
    try {
        await user.validate()
    } catch (err) {
        console.error(err)
        //TODO: Perform validation
    }

    await user.save()

    // Create a session of the user
    req.session.user = {
        username: user.username,
        id: user.id,
        email: user.email
    }

    res.redirect("/home")

})


// Signin the user
authRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) return res.status(404).send("Sorry that user does not exist")
    console.log(password, await user.validatePassword(password))
    if (! await user.validatePassword(password)) return res.status(401).send("Wrong password")

    // Create a session of the user
    req.session.user = {
        username: user.username,
        id: user.id,
        email: user.email
    }

    res.redirect("/home")
})



// Logout a user
authRouter.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = authRouter