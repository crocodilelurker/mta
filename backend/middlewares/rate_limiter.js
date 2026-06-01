// rate limiter 
import dotenv from "dotenv";
dotenv.config({});
import { rateLimit } from "express-rate-limit";
import { Redis } from "@upstash/redis";
import { RedisStore } from "rate-limit-redis";
const upstashRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
const defaultLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 50,
    store: new RedisStore({
        sendCommand: async (...args) => {
            const command = args.flat();
            return await upstashRedis.exec(command);
        }
    }),
    message: {
        status: "error",
        message: " Too Many requests blocked by default limiter "
    },
    standardHeaders: true,
    legacyHeaders: false
})

export {
    defaultLimiter,
    upstashRedis
}