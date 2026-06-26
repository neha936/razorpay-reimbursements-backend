import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import LoginPage               from '../pages/LoginPage';
import RegisterPage            from '../pages/RegisterPage';
import DashboardPage           from '../pages/DashboardPage';
import ReimbursementsPage      from '../pages/ReimbursementsPage';
import CreateReimbursementPage from '../pages/CreateReimbursementPage';
import ApprovalPage            from '../pages/ApprovalPage';
import EmployeesPage           from '../pages/EmployeesPage';
import RoleAssignmentPage      from '../pages/RoleAssignmentPage';
import EmployeeAssignmentPage  from '../pages/EmployeeAssignmentPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public routes ──────────────────────────────────────────── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected routes ───────────────────────────────────────── */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/reimbursements"
            element={<ProtectedRoute><ReimbursementsPage /></ProtectedRoute>}
          />
          <Route
            path="/reimbursements/create"
            element={<ProtectedRoute><CreateReimbursementPage /></ProtectedRoute>}
          />
          <Route
            path="/approvals"
            element={<ProtectedRoute><ApprovalPage /></ProtectedRoute>}
          />
          <Route
            path="/employees"
            element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>}
          />
          <Route
            path="/employees/assign"
            element={<ProtectedRoute><EmployeeAssignmentPage /></ProtectedRoute>}
          />
          <Route
            path="/roles/assign"
            element={<ProtectedRoute><RoleAssignmentPage /></ProtectedRoute>}
          />

          {/* ── Redirects ──────────────────────────────────────────────── */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
