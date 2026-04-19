import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Umezidi maombi yaliyoruhusiwa. Tafadhali subiri saa 1 kabla ya kujaribu tena.',
  },
});
