const userRouter = require("express").Router()

const User = require("../models/user")

userRouter.get("/home", async (req, res) => {
    const { username } = req.session.user

    // Grab logged in user
    const { id } = req.session.user
    const user = await User.findById(id).lean().exec()

    // Get the user's number of links and total hits generated
    const totalLinks = user.links.length
    const totalHits = user.totalHits

    // Send data back to the user
    res.render("user/home", { username, totalLinks, totalHits })
})


module.exports = userRouter