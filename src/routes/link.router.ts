import { Router, Request, Response } from "express"

import randomstring from "randomstring"
import QRCode from "qrcode"

import User from "../models/user"
import Link from "../models/link"


const linkRouter = Router()

linkRouter.get("/", async (req: Request, res: Response) => {
    // Get the logged in user
    const { id, username } = req.session.user
    const { links } = await User.findById(id).populate("links").lean().exec()

    // Render the page with the links
    res.render("link/index", { username, links })
})

// Get page to create link
linkRouter.get("/create", (req: Request, res: Response) => {
    const { username } = req.session.user
    res.render("link/create", { username })
})

// Create a new link
linkRouter.post("/create", async (req: Request, res: Response) => {
    let { url, description, alias } = req.body
    
    // If user didn't create custom alias
    if (!alias) {
        alias = randomstring.generate({
            length: 6,
            charset: "alphabetic",
        })
    }

    // Check to see if link exists
    const linkExists = await Link.findOne({ alias }).exec()
    if (linkExists) return res.status(409).send(`Sorry, the alias (${alias}) has already been used`)

    // Create a new link
    const link = new Link({ url, description, alias })
    
    
    // Grab logged in user
    const { id } = req.session.user
    const user = await User.findById(id).exec()
    
    // Associate the link with the user
    link.createdBy = id
    
    // Validate link
    try {
        await link.validate()
    } catch (err) {
        return res.send(err)
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
linkRouter.get("/qr", (req: Request, res: Response) => {
    const text = req.query.text

    // Send QR code of text back
    // @ts-ignore 
    QRCode.toDataURL(text, (err, url) => {
        if (err) console.error(err)
        
        // Send the data url
        res.send(url)
    })

})

// View details on a link
linkRouter.get("/:alias", async (req: Request, res: Response) => {
    // Get alias from the url
    const alias = req.params.alias

    // Grab logged in user
    const { id, username } = req.session.user
    const user = await User.findById(id).populate("links").lean().exec()

    // Check for the link
    // @ts-ignore
    const link = user.links.filter(l => l.alias === alias)[0]

    if (!link) return res.render("link/notFound", { username })

    // Calculate the number of clicks and scans
    let numClicks = 0, numScans = 0
    // @ts-ignore
    for (let hit of link.hits) {
        if (hit.type === "click") numClicks++
        else if (hit.type === "scan") numScans++
    }

    res.render("link/analytics", { username, link, numClicks, numScans })
})



export default linkRouter