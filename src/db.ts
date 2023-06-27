require("dotenv").config();

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async function (uri) {
    await mongoose.connect(
        MONGODB_URI || uri || "mongodb://localhost:27017/scissor",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ).then(() => {
        console.log("Connected to MongoDB successfully");

    }).catch((reason) => {
        console.log("MongoDB encountered an error");
        console.log(reason);
    })

};

module.exports = connectDB;
