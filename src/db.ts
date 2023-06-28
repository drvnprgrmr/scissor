import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB(uri?: string) {
    await mongoose.connect(
        MONGODB_URI || uri || "mongodb://localhost:27017/scissor",

    ).then(() => {
        console.log("Connected to MongoDB successfully");

    }).catch((reason) => {
        console.log("MongoDB encountered an error");
        console.log(reason);
    })

};

export default connectDB;
