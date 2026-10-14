const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');
export class ApiClientError extends Error {
  constructor(message, status = 0, details = undefined) { super(message); this.name = 'ApiClientError'; this.status = status; this.details = details; }
}
export async function apiRequest(path, { method = 'GET', body, token, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method, signal, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiClientError('Could not reach Fastor. Check your connection and try again.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new ApiClientError(payload?.error?.message || 'Something went wrong. Please try again.', response.status, payload?.error?.details);
  return payload.data;
}
export { API_BASE_URL };
