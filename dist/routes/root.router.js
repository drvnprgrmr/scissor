"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const auth_router_1 = __importDefault(require("./auth.router"));
const user_router_1 = __importDefault(require("./user.router"));
const link_router_1 = __importDefault(require("./link.router"));
const link_1 = __importDefault(require("../models/link"));
const user_1 = __importDefault(require("../models/user"));
const middleware_1 = __importDefault(require("../middleware"));
const rootRouter = (0, express_1.Router)();
// Home route
rootRouter.get("/", (req, res) => {
    // Redirect the user if logged in
    if (req.session.user)
        return res.redirect("/u/home");
    // Display landing page
    res.render("index");
});
// Handle auth routes
rootRouter.use("/a", auth_router_1.default);
// Handle user routes
rootRouter.use("/u", middleware_1.default, user_router_1.default);
// Handle link routes
rootRouter.use("/l", middleware_1.default, link_router_1.default);
// Redirect short links
rootRouter.get("/:alias", async (req, res) => {
    const alias = req.params.alias;
    // Detect if the `hit` came from a click or a scan
    const type = "scan" in req.query ? "scan" : "click";
    // Get the requested link from the db
    const link = await link_1.default.findOne({ alias }).exec();
    if (!link)
        return res.render("invalidAlias", { alias });
    // Redirect to the url immediately before performing analytics
    res.redirect(link.url);
    // Grab user associated with link 
    // and increase the total number of hits
    const user = await user_1.default.findById(link.createdBy).exec();
    user.totalHits += 1;
    await user.save();
    // Grab the IP address and referrer from the request
    const ip = req.ip;
    const referrer = req.headers.referer;
    // Get info of the user based on their IP
    const { data } = await axios_1.default.get(`http://ip-api.com/json/${ip}?fields=2321`);
    // Push `hit` to the link
    link.hits.push({
        type,
        ip,
        referrer,
        ...data,
    });
    // Save link
    await link.save();
});
// Export the root router
exports.default = rootRouter;
