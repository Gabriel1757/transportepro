/**
 * Middleware de rate limiting simples
 * Para produção, considerar usar redis + express-rate-limit
 */

const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs = 900000, maxRequests = 100) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: 'Muitas requisições deste IP, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development'
  });
};

// Limiter específico para login (mais restritivo)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login, tente novamente em 15 minutos',
  skipSuccessfulRequests: true
});

// Limiter para API geral
const apiLimiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100)
);

module.exports = {
  createLimiter,
  loginLimiter,
  apiLimiter
};
