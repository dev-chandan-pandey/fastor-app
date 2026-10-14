import { apiRequest } from './client';
export const getProfile = token => apiRequest('/profile', { token });
export const updateProfile = (token, name) => apiRequest('/profile', { method: 'PATCH', token, body: { name } });
