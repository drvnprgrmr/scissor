const linkRouter = require("express").Router()
const randomstring = require("randomstring")
const QRCode = require("qrcode")

const User = require("../models/user")
const Link = require("../models/link")


linkRouter.get("/", async (req, res) => {
    // Get the logged in user
    const { id, username } = req.session.user
    const { links } = await User.findById(id).populate("links").lean().exec()

    // Render the page with the links
    res.render("link/index", { username, links })
})

// Get page to create link
linkRouter.get("/create", (req, res) => {
    const { username } = req.session.user
    res.render("link/create", { username })
})

// Create a new link
linkRouter.post("/create", async (req, res) => {
    let { url, description, alias, qr } = req.body

    if (qr === "on") qr = true
    
    // If user didn't create custom alias
    if (!alias) {
        alias = randomstring.generate({
            length: 6,
            charset: "alphabetic",
        })
    }

    // Create a new link
    const link = new Link({ url, description, alias, qr })
    
    
    // Grab logged in user
    const { id } = req.session.user
    const user = await User.findById(id).exec()
    
    // Associate the link with the user
    link.createdBy = id
    
    // Validate link
    try {
        await link.validate()
    } catch (err) {
        console.error(err)
        //TODO: Perform validation
    }

    // Save the link
    await link.save()
    
    // Add link to user's created links
    user.links.push(link.id)

    // Update user
    await user.save()

    res.redirect(link.alias)

})

// Create a QR Code
linkRouter.get("/qr", (req, res) => {
    const text = req.query.text

    // Send QR code of text back
    QRCode.toDataURL(text, (err, url) => {
        if (err) console.error(err)
        
        // Send the data url
        res.send(url)
    })

})

// View details on a link
linkRouter.get("/:alias", async (req, res) => {
    // Get alias from the url
    const alias = req.params.alias

    // Grab logged in user
    const { id, username } = req.session.user
    const user = await User.findById(id).populate("links").lean().exec()

    // Check for the link
    const link = user.links.filter(l => l.alias === alias)[0]

    if (!link) return res.render("link/notFound", { username })

    // Calculate the number of clicks and scans
    let numClicks = 0, numScans = 0
    for (let hit of link.hits) {
        if (hit.type === "click") numClicks++
        else if (hit.type === "scan") numScans++
    }

    res.render("link/analytics", { username, link, numClicks, numScans })
})

// Edit a link
linkRouter.get("/:alias/edit", async (req, res) => {
    res.end()
})

module.exports = linkRouter