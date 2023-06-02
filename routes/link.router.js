const express = require("express")
const randomstring = require("randomstring")

const User = require("../models/user")
const Link = require("../models/link")

const linkRouter = express.Router()


linkRouter.get("/create", (req, res) => {
    const { username } = req.session.user
    res.render("link/create", { username })
})


linkRouter.post("/create", async (req, res) => {
    let { url, description, alias } = req.body
    
    // If user didn't create custom alias
    if (!alias) {
        alias = randomstring.generate({
            length: 6,
            charset: "alphabetic",
        })
    }

    // Create a new link
    const link = new Link({ url, description, alias })
    
    try {
        await link.validate()
    } catch (err) {
        console.error(err)
        //TODO: Perform validation
    }

    // Save the link
    await link.save()
    
    // Grab logged in user
    const { id } = req.session.user
    const user = await User.findById(id).exec()

    // Add link to user's created links
    user.links.push(link.id)

    // Update user
    await user.save()

    // Redirect to link detail page
    res.redirect(link.alias)

})



linkRouter.get("/:alias", async (req, res) => {
    // Get alias from the url
    const alias = req.params.alias

    // Grab logged in user
    const { id, username } = req.session.user
    const user = await User.findById(id).populate("links").lean().exec()

    // Check for the link
    const link = user.links.filter(l => l.alias === alias)[0]

    if (!link) return res.render("link/notFound", { username })

    res.render("link/index", { username, link })
})

module.exports = linkRouter