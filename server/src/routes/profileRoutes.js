import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
const router = Router(); router.use(authenticate);
router.get('/', asyncHandler(async (req, res) => res.json({ success: true, data: { id: req.user.id, phone: req.user.phone, name: req.user.name, isVerified: req.user.isVerified } })));
router.patch('/', validate(z.object({ body: z.object({ name: z.string().trim().min(2).max(80) }) })), asyncHandler(async (req, res) => {
  req.user.name = req.validated.body.name; await req.user.save();
  res.json({ success: true, data: { id: req.user.id, phone: req.user.phone, name: req.user.name, isVerified: req.user.isVerified } });
}));
export default router;
