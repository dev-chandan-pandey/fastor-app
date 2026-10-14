import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  name: { type: String, trim: true, maxlength: 80, default: 'Foodie' },
  isVerified: { type: Boolean, default: false }, isBlocked: { type: Boolean, default: false },
  otpHash: String, devOtpCode: String, otpExpiresAt: Date, otpAttempts: { type: Number, default: 0 }, otpRequestedAt: Date,
}, { timestamps: true, toJSON: { transform(_doc, ret) { delete ret.otpHash; delete ret.devOtpCode; delete ret.otpExpiresAt; delete ret.otpAttempts; delete ret.__v; return ret; } } });
export const User = mongoose.model('User', userSchema);
