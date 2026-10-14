import { apiRequest } from './client';
export const createOrder = (token, { cart, address, instructions = '' }) => apiRequest('/orders', {
  method: 'POST', token,
  body: { items: cart.map(item => ({ productId: item.id, quantity: item.qty })), address, instructions, paymentMethod: 'cash' },
});
export const getOrders = token => apiRequest('/orders', { token });
export const getOrder = (token, id) => apiRequest(`/orders/${encodeURIComponent(id)}`, { token });
export const cancelOrder = (token, id) => apiRequest(`/orders/${encodeURIComponent(id)}/cancel`, { method: 'POST', token });
