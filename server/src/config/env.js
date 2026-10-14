import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fastor',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 5),
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioVerifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || '',
  otpDevReturnCode: process.env.OTP_DEV_RETURN_CODE === 'true',
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('PORT must be a valid TCP port.');
}
if (!Number.isFinite(env.otpTtlMinutes) || env.otpTtlMinutes < 1 || env.otpTtlMinutes > 15) {
  throw new Error('OTP_TTL_MINUTES must be between 1 and 15.');
}
if (!Number.isInteger(env.otpMaxAttempts) || env.otpMaxAttempts < 1 || env.otpMaxAttempts > 10) {
  throw new Error('OTP_MAX_ATTEMPTS must be between 1 and 10.');
}
if (env.nodeEnv === 'production') {
  if (env.jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production.');
  if (!env.mongoUri || /localhost|127\.0\.0\.1/.test(env.mongoUri)) throw new Error('Configure a remote production MONGODB_URI.');
  if (!env.twilioAccountSid || !env.twilioAuthToken || !env.twilioVerifyServiceSid) throw new Error('Twilio Verify credentials are required in production.');
  if (env.otpDevReturnCode) throw new Error('OTP_DEV_RETURN_CODE must be disabled in production.');
  if (env.clientOrigin.split(',').some(origin => !/^https:\/\//i.test(origin.trim()))) throw new Error('CLIENT_ORIGIN must contain HTTPS origins in production.');
}
