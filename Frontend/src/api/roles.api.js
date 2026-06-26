import { BASE_URL } from '../utils/constants';

const base = `${BASE_URL}/rest/roles`;

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

// ── Roles API ──────────────────────────────────────────────────────────────────

/**
 * Assign a role to a user. CFO only.
 * @param {number} userId
 * @param {'EMP'|'RM'|'APE'|'CFO'} role
 */
export async function assignRole(userId, role) {
  return apiFetch(`${base}/assign`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
}
