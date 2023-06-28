"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + "/../.env" });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const root_router_1 = __importDefault(require("./routes/root.router"));
const db_1 = __importDefault(require("./db"));
const redis_1 = __importDefault(require("./redis"));
// Check if we're in a production environment or not
const isProd = process.env.NODE_ENV?.match(/production/i);
// Set the port number
const port = process.env.PORT || 8080;
(async () => {
    // Connect to redis
    await redis_1.default.connect();
    // Connect to MongoDB
    await (0, db_1.default)();
})();
// Create redis session store
const sessionStore = new connect_redis_1.default({
    client: redis_1.default,
    prefix: "scissor-sessions:",
});
// Create rate limit store
const limitStore = new rate_limit_redis_1.default({
    prefix: "scissor-ratelimit:",
    sendCommand: (...args) => redis_1.default.sendCommand(args),
});
// Create express app
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", __dirname + "/../views");
app.set("trust proxy", true);
// Set security headers
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            // Allow scripts from this source
            scriptSrc: ["'self'", "https://unpkg.com"],
        },
    },
}));
// Compress responses
app.use((0, compression_1.default)());
// Process submitted forms
app.use(express_1.default.urlencoded({ extended: false }));
// Initialize sessions
app.use((0, express_session_1.default)({
    name: "sessionID",
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 7 * 86400000,
        secure: isProd ? true : false,
    },
}));
// Add rate limiting based on the IP
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    store: limitStore,
}));
// Serve static assets
app.use(express_1.default.static("public"));
// Use the apps routes
app.use(root_router_1.default);
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
