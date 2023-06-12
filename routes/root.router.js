const router = require("express").Router()
const axios = require("axios").default

const authRouter = require("./auth.router")
const linkRouter = require("./link.router")

const Link = require("../models/link")

const { isLoggedIn } = require("../middleware")


router.get("/", (req, res) => {
    // Redirect the user if logged in
    if (req.session.user) return res.redirect("/home")

    // Display landing page
    res.render("index")
})

router.get("/home", isLoggedIn, (req, res) => {
    const { username } = req.session.user

    res.render("home", { username })
})

// Handle auth routes
router.use("/auth", authRouter)

// Handle link routes (requiring the user to be logged in)
router.use("/link", isLoggedIn, linkRouter)

// Redirect short links
router.get("/l/:alias", async (req, res) => {
    const alias = req.params.alias

    // Detect if the `hit` came from a click or a scan
    const type = "scan" in req.query ? "scan" : "click"
    
    // Get the requested link from the db
    const link = await Link.findOne({ alias }).exec()

    if (!link) return res.render("invalidAlias", { alias })

    // Redirect to the url immediately before performing analytics
    res.redirect(link.url)

    // Grab the IP address and referrer from the request
    const ip = req.ip
    const referrer = req.headers.referer

    // Get info of the user based on their IP
    const { data } = await axios.get(`http://ip-api.com/json/24.48.0.1?fields=785`)
    
    // Push `hit` to the link
    link.hits.push({
        type,
        ip,
        referrer,
        ...data,
    })

    // Save link
    await link.save()


})

// Export the root router
module.exports = router