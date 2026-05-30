const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment.'
  }
});

module.exports = rateLimiter;
