import { apiRequest } from './client';
export const requestOtp = phone => apiRequest('/auth/otp/request', { method: 'POST', body: { phone } });
export const verifyOtp = (phone, code) => apiRequest('/auth/otp/verify', { method: 'POST', body: { phone, code } });
export const getCurrentUser = token => apiRequest('/auth/me', { token });
