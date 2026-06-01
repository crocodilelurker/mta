// rate limiter 
import { rateLimit } from "express-rate-limit";

const defaultLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 50,
    message: {
        status: "error",
        message: " Too Many requests blocked by default limiter "
    },
    standardHeaders: true,
    legacyHeaders: false
})

export {
    defaultLimiter
}