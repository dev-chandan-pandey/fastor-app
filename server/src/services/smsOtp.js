import twilio from 'twilio';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
const configured = Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioVerifyServiceSid);
const client = configured ? twilio(env.twilioAccountSid, env.twilioAuthToken) : null;
export async function requestOtp(phone) {
  if (configured) {
    await client.verify.v2.services(env.twilioVerifyServiceSid).verifications.create({ to: phone, channel: 'sms' });
    return { provider: 'twilio' };
  }
  if (env.nodeEnv === 'production' || !env.otpDevReturnCode) throw new ApiError(503, 'SMS verification is not configured. Please contact support.');
  return { provider: 'development', code: String(Math.floor(100000 + Math.random() * 900000)) };
}
export async function verifyOtp(phone, code, devCode) {
  if (configured) {
    const result = await client.verify.v2.services(env.twilioVerifyServiceSid).verificationChecks.create({ to: phone, code });
    return result.status === 'approved';
  }
  return env.nodeEnv !== 'production' && env.otpDevReturnCode && Boolean(devCode) && code === devCode;
}
