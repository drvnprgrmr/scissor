import { createClient } from "redis";

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT
    }
});

// Log redis errors
redisClient.on("error", err => console.log("Redis Client Error", err))
redisClient.on("connect", () => console.log("Redis connected successfully"))

export default redisClient 