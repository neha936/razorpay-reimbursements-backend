// ── App Constants ──────────────────────────────────────────────────────────────

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://razorpay-reimbursements-backend.onrender.com';

// ── Roles ──────────────────────────────────────────────────────────────────────
export const ROLES = {
  EMP: 'EMP',
  RM:  'RM',
  APE: 'APE',
  CFO: 'CFO',
};

// ── Reimbursement statuses ─────────────────────────────────────────────────────
export const STATUSES = {
  PENDING:  'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// ── Approval actions ───────────────────────────────────────────────────────────
export const ACTIONS = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// ── Valid roles list (for dropdowns) ──────────────────────────────────────────
export const ROLE_OPTIONS = [
  { label: 'Employee (EMP)',           value: ROLES.EMP },
  { label: 'Reporting Manager (RM)',   value: ROLES.RM  },
  { label: 'Account & Payroll (APE)', value: ROLES.APE },
  { label: 'CFO',                      value: ROLES.CFO },
];

// ── Sidebar nav items — filtered in Sidebar.jsx by role ───────────────────────
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '🏠',
    roles: [ROLES.EMP, ROLES.RM, ROLES.APE, ROLES.CFO],
  },
  {
    label: 'My Reimbursements',
    path: '/reimbursements',
    icon: '📋',
    roles: [ROLES.EMP],
  },
  {
    label: 'Create Reimbursement',
    path: '/reimbursements/create',
    icon: '➕',
    roles: [ROLES.EMP],
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: '👥',
    roles: [ROLES.RM, ROLES.APE, ROLES.CFO],
  },
  {
    label: 'Reimbursements',
    path: '/reimbursements',
    icon: '📋',
    roles: [ROLES.RM, ROLES.APE, ROLES.CFO],
  },
  {
    label: 'Approvals',
    path: '/approvals',
    icon: '✅',
    roles: [ROLES.RM, ROLES.APE, ROLES.CFO],
  },
  {
    label: 'Employee Assignment',
    path: '/employees/assign',
    icon: '🔗',
    roles: [ROLES.APE, ROLES.CFO],
  },
  {
    label: 'Role Assignment',
    path: '/roles/assign',
    icon: '🎭',
    roles: [ROLES.CFO],
  },
];
