const express = require("express")
const session = require("express-session")

const router = require("./routes/root.router")
const connectDB = require("./db")

const app = express()

// app.set("env", "production")
app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //TODO Use redis session store
    // cookie: { secure: true } // for production
}))


// Use the apps routes
app.use("/", router)


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