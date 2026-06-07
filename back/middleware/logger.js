/**
 * Middleware de logging simples
 */

const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      console.error('❌', JSON.stringify(log));
    } else {
      console.log('✅', JSON.stringify(log));
    }
  });

  next();
};

module.exports = logger;
