import { apiRequest } from './client';
export const getProducts = (params = {}) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== false));
  return apiRequest(`/products${query.size ? `?${query}` : ''}`);
};
export const getCategories = () => apiRequest('/products/categories');
