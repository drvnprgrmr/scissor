import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

import express from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";

import RedisSessionStore from "connect-redis";
import LimitSessionStore from "rate-limit-redis";

import router from "./routes/root.router";
import connectDB from "./db";
import redisClient from "./redis";

// Check if we're in a production environment or not
const isProd = process.env.NODE_ENV?.match(/production/i);
// Set the port number
const port = process.env.PORT || 8080;

(async () => {
    // Connect to redis
    await redisClient.connect();

    // Connect to MongoDB
    await connectDB();
})();

// Create redis session store
const sessionStore = new RedisSessionStore({
    client: redisClient,
    prefix: "scissor-sessions:",
});

// Create rate limit store
const limitStore = new LimitSessionStore({
    prefix: "scissor-ratelimit:",
    sendCommand: (...args) => redisClient.sendCommand(args),
});



// Create express app
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.set("trust proxy", true);

// Set security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                // Allow scripts from this source
                scriptSrc: ["'self'", "https://unpkg.com"],
            },
        },
    })
);

// Compress responses
app.use(compression());

// Process submitted forms
app.use(express.urlencoded({ extended: false }));

// Initialize sessions
app.use(
    session({
        name: "sessionID",
        store: sessionStore,
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        rolling: true, // Reset maxAge on update
        cookie: {
            maxAge: 7 * 86400000, // 7 days
            secure: isProd ? true : false,
        },
    })
);

// Add rate limiting based on the IP
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 150,
        standardHeaders: true,
        legacyHeaders: false,
        store: limitStore,
    })
);

// Serve static assets
app.use(express.static("public"));

// Use the apps routes
app.use(router);

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).render("404");
    next();
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        message: "An error occured. Oops!",
        error: err.message,
    });
});


app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`);
});
