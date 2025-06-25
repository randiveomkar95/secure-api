// middlewares/errorHandler.js
const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  console.error('ERROR 💥:', err);

  // Fallbacks
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    status: err.status || 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
