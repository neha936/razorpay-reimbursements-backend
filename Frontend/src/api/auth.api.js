import { BASE_URL } from '../utils/constants';

const base = `${BASE_URL}/rest/onboardings`;

// ── Shared fetch helper ────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Request failed');
  return json.data;
}

// ── Auth API ───────────────────────────────────────────────────────────────────

/**
 * Register a new user (EMP only).
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} created user
 */
export async function registerUser(name, email, password) {
  return apiFetch(`${base}/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Login with email & password. Backend sets httpOnly cookie.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} logged-in user { id, name, email, role }
 */
export async function loginUser(email, password) {
  return apiFetch(`${base}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Logout — clears the httpOnly cookie on the backend.
 */
export async function logoutUser() {
  return apiFetch(`${base}/logout`, { method: 'POST' });
}
