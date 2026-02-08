import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const adminRateLimiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests * 10,
  message: { success: false, error: 'Too many requests from this IP' },
  standardHeaders: true,
  legacyHeaders: false
});

export const templateRateLimiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests,
  message: { success: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false
});

export const publicRateLimiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests * 5,
  message: { success: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false
});
