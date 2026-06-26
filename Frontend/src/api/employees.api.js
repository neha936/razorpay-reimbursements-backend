import { BASE_URL } from '../utils/constants';

const base = `${BASE_URL}/rest/employees`;

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

// ── Employees API ──────────────────────────────────────────────────────────────

/**
 * Get employees (role-filtered by backend).
 * RM → subordinates, APE → all EMPs & RMs, CFO → all users.
 * @returns {Promise<object[]>}
 */
export async function getEmployees() {
  return apiFetch(base);
}

/**
 * Assign an EMP to an RM.
 * @param {number} employeeId
 * @param {number} managerId
 */
export async function assignEmployee(employeeId, managerId) {
  return apiFetch(`${base}/assign`, {
    method: 'POST',
    body: JSON.stringify({ employeeId, managerId }),
  });
}

/**
 * Remove an EMP from an RM.
 * @param {number} employeeId
 * @param {number} managerId
 */
export async function removeEmployee(employeeId, managerId) {
  return apiFetch(`${base}/assign`, {
    method: 'DELETE',
    body: JSON.stringify({ employeeId, managerId }),
  });
}
