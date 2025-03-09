const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    },
    headers: true, // Send rate limit info in response headers
});

module.exports = {limiter};