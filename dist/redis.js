"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT
    }
});
// Log redis errors
redisClient.on("error", err => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis connected successfully"));
exports.default = redisClient;
