require("dotenv").config()

const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI

const connectDB = function () {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB successfully")
    })
    mongoose.connection.on("error", (err) => {
        console.log("MongoDB encountered an error")
        console.log(err)
    })
}


module.exports = connectDB