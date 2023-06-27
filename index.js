require("dotenv").config()

const express = require("express")
const session = require("express-session")
const rateLimit = require("express-rate-limit").default
const helmet = require("helmet").default
const compression = require("compression")

const RedisSessionStore = require("connect-redis").default
const RedisLimitStore = require("rate-limit-redis").default

const router = require("./routes/root.router")
const connectDB = require("./db")
const redisClient = require("./redis")

// Create redis session store
let sessionStore = new RedisSessionStore({
    client: redisClient,
    prefix: "scissor-sessions:",
})

// Create rate limit store
const limitStore = new RedisLimitStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
})

const app = express()


app.set("view engine", "ejs")
app.set("views", "views")
app.set("trust proxy", true)


// Set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // Allow scripts from this source
            scriptSrc: ["'self'", "https://unpkg.com"]
        }
    }
}))

// Compress responses 
app.use(compression())

// Process submitted forms
app.use(express.urlencoded({ extended: false }))

// Initialize sessions
app.use(session({
    name: "sessionID",
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,  // Reset maxAge on update
    cookie: {
        maxAge: 7 * 86400000,  // 7 days
        secure: (process.env.NODE_ENV === "production" ? true : false) 
    }
}))

// Add rate limiting based on the IP
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, 
    legacyHeaders: false,
    store: limitStore
}))

// Serve static assets
app.use(express.static("public"))

// Use the apps routes
app.use(router)


// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).render("404")
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
    // Connect to redis
    redisClient.connect()

    // Connect to MongoDB
    connectDB()
    console.log(`App is listening on http://localhost:${port}`)
    
})
