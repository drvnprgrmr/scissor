const express = require("express")
const session = require("express-session")
const rateLimit = require("express-rate-limit").default
const helmet = require("helmet")
const compression = require("compression")


const router = require("./routes/root.router")
const connectDB = require("./db")

const app = express()

// app.set("env", "production")
app.set("view engine", "ejs")
app.set("views", "views")


// Set security headers
app.use(helmet())

// Compress responses 
app.use(compression())

// Process submitted forms
app.use(express.urlencoded({ extended: false }))

// Initialize sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //TODO Use redis session store
    // cookie: { secure: true } // for production
}))

// Add rate limiting based on the IP
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, 
    legacyHeaders: false,
    //TODO Use redis session store
}))

// Serve static assets
app.use(express.static("public"))

// Use the apps routes
app.use(router)


// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).render("404", { 
        username: req.session.user?.username
    })
    next()
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).send({
        message: "An error occured. Oops!",
        error: err.message
    })
})


const port = process.env.PORT || 8080

app.listen(port, () => {
    connectDB()
    console.log(`App is listening on http://localhost:${port}`)
    
})