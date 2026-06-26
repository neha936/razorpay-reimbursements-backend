import { BASE_URL } from '../utils/constants';

const base = `${BASE_URL}/rest/reimbursements`;

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

// ── Reimbursements API ────────────────────────────────────────────────────────

/**
 * Create a new reimbursement. EMP only.
 * @param {string} title
 * @param {string} description
 * @param {number} amount
 */
export async function createReimbursement(title, description, amount) {
  return apiFetch(base, {
    method: 'POST',
    body: JSON.stringify({ title, description, amount }),
  });
}

/**
 * Get reimbursements (role-filtered by backend).
 * @returns {Promise<object[]>}
 */
export async function getReimbursements() {
  return apiFetch(base);
}

/**
 * Approve or reject a reimbursement. RM / APE / CFO.
 * @param {number} reimbursementId
 * @param {'APPROVED'|'REJECTED'} action
 */
export async function approveReimbursement(reimbursementId, action) {
  return apiFetch(base, {
    method: 'PATCH',
    body: JSON.stringify({ reimbursementId, action }),
  });
}

/**
 * Get all reimbursements for a specific subordinate employee. RM only.
 * @param {number} userId
 * @returns {Promise<object[]>}
 */
export async function getSubordinateReimbursements(userId) {
  return apiFetch(`${base}/${userId}`);
}
