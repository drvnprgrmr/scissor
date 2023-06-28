"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI;
async function connectDB(uri) {
    await mongoose_1.default.connect(MONGODB_URI || uri || "mongodb://localhost:27017/scissor").then(() => {
        console.log("Connected to MongoDB successfully");
    }).catch((reason) => {
        console.log("MongoDB encountered an error");
        console.log(reason);
    });
}
;
exports.default = connectDB;
