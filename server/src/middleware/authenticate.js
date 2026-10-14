import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
export async function authenticate(req, _res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    if (!token) throw new ApiError(401, 'Please sign in to continue.');
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-otpHash -otpExpiresAt -otpAttempts');
    if (!user || user.isBlocked) throw new ApiError(401, 'Your session is no longer valid. Please sign in again.');
    req.user = user; next();
  } catch (e) { next(e instanceof ApiError ? e : new ApiError(401, 'Your session is invalid or has expired.')); }
}
