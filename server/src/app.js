import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
const app = express();
app.disable('x-powered-by');
if (env.nodeEnv === 'production') app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.clientOrigin.split(',').map(x => x.trim()), credentials: false }));
app.use(express.json({ limit: '32kb' }));
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many verification requests. Try again later.' } },
});
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many code requests. Try again later.' } },
});
app.use('/api/auth/otp', otpLimiter);
app.use('/api/auth/otp/request', otpRequestLimiter);
app.get('/api/health', (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ success: databaseReady, data: { status: databaseReady ? 'ok' : 'degraded', service: 'fastor-api', database: databaseReady ? 'connected' : 'disconnected', timestamp: new Date().toISOString() } });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use(notFound); app.use(errorHandler);
export default app;
