const express = require("express")

const connectDB = require("./db")

const User = require("./models/user")
const Link = require("./models/link")

const authRouter = require("./routes/auth.router")

const app = express()


app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.urlencoded({ extended: false }))


app.get("/", (req, res) => {
    res.render("index")
})

// Handle auth routes
app.use("/auth", authRouter)


// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).send({
        message: "Sorry, the route you requested does not exist!"
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