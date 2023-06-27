import { Router } from "express"
import axios from "axios"

import authRouter from "./auth.router"
import userRouter from "./user.router"
import linkRouter from "./link.router"

import Link from "../models/link"
import User from "../models/user"

import { isLoggedIn } from "../middleware"

const rootRouter = Router()

// Home route
rootRouter.get("/", (req, res) => {
    // Redirect the user if logged in
    if (req.session.user) return res.redirect("/u/home")

    // Display landing page
    res.render("index")
})

// Handle auth routes
rootRouter.use("/a", authRouter)

// Handle user routes
rootRouter.use("/u", isLoggedIn, userRouter)

// Handle link routes
rootRouter.use("/l", isLoggedIn, linkRouter)

// Redirect short links
rootRouter.get("/:alias", async (req, res) => {
    const alias = req.params.alias

    // Detect if the `hit` came from a click or a scan
    const type = "scan" in req.query ? "scan" : "click"
    
    // Get the requested link from the db
    const link = await Link.findOne({ alias }).exec()

    if (!link) return res.render("invalidAlias", { alias })

    // Redirect to the url immediately before performing analytics
    res.redirect(link.url)

    // Grab user associated with link 
    // and increase the total number of hits
    const user = await User.findById(link.createdBy).exec()
    user.totalHits += 1
    await user.save()


    // Grab the IP address and referrer from the request
    const ip = req.ip
    const referrer = req.headers.referer

    // Get info of the user based on their IP
    const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=2321`)
    
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
export default rootRouter