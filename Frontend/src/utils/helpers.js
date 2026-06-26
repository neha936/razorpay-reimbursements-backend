// ── helpers.js ─────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string to "DD MMM YYYY"
 * e.g. "2026-06-24T09:00:00.000Z" → "24 Jun 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a number as Indian currency.
 * e.g. 4500 → "₹4,500.00"
 */
export function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

/**
 * Map a status string to CSS class suffix used in StatusBadge.
 * Returns: "success" | "danger" | "warning"
 */
export function statusVariant(status) {
  switch (status?.toUpperCase()) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'danger';
    case 'PENDING':  return 'warning';
    default:         return 'warning';
  }
}

/**
 * Get the initial letter(s) of a name for use in avatar.
 * e.g. "John Doe" → "JD"
 */
export function getInitials(name = '') {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Returns a human-readable role label.
 */
export function roleLabel(role) {
  const map = {
    EMP: 'Employee',
    RM:  'Reporting Manager',
    APE: 'Account & Payroll',
    CFO: 'CFO',
  };
  return map[role] || role;
}

/**
 * Capitalises the first letter of a string.
 */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
