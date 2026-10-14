import { env } from '../config/env.js';
export function notFound(req, _res, next) { next(Object.assign(new Error(`Route not found: ${req.method} ${req.originalUrl}`), { statusCode: 404 })); }
export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred.';
  if (err.name === 'ValidationError') { status = 400; message = 'Invalid data.'; }
  if (err.name === 'CastError') { status = 400; message = 'Invalid identifier.'; }
  if (err.code === 11000) { status = 409; message = 'A record with this value already exists.'; }
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, error: { message: status >= 500 && env.nodeEnv === 'production' ? 'Internal server error.' : message, ...(err.details ? { details: err.details } : {}), ...(env.nodeEnv !== 'production' && status >= 500 ? { stack: err.stack } : {}) } });
}
