import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per window
  message: "Too many requests, please try again later."
});

// const LoginLimiter = rateLimit({    // we can have different limiters for different endpoints
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // Limit each IP to 10 requests per window
//   message: "Too many requests, please try again later."
// });

export default limiter;