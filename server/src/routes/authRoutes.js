import { Router } from 'express';
import { requestCode, verifyCode, validateRequestOtp, validateVerifyOtp } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const router = Router();
router.post('/otp/request', validateRequestOtp, requestCode);
router.post('/otp/verify', validateVerifyOtp, verifyCode);
router.get('/me', authenticate, asyncHandler(async (req, res) => res.json({ success: true, data: { id: req.user.id, phone: req.user.phone, name: req.user.name, isVerified: req.user.isVerified } })));
export default router;
