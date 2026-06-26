import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { getReimbursements } from '../api/reimbursements.api';
import { getEmployees } from '../api/employees.api';
import { ROLES, STATUSES } from '../utils/constants';

export default function DashboardPage() {
  const { user, role, isEMP } = useAuth();
  const [reimbursements, setReimbursements] = useState([]);
  const [employees, setEmployees]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const rData = await getReimbursements();
        setReimbursements(Array.isArray(rData) ? rData : []);

        if (!isEMP) {
          const eData = await getEmployees();
          setEmployees(Array.isArray(eData) ? eData : []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isEMP]);

  // ── Stat calculations ───────────────────────────────────────────────────────
  const pending  = reimbursements.filter((r) => r.final_status === STATUSES.PENDING).length;
  const approved = reimbursements.filter((r) => r.final_status === STATUSES.APPROVED).length;
  const rejected = reimbursements.filter((r) => r.final_status === STATUSES.REJECTED).length;
  const total    = reimbursements.length;

  return (
    <Layout pageTitle="Dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">
            Here&apos;s what&apos;s happening with your reimbursements today.
          </p>
        </div>

        {isEMP && (
          <Link to="/reimbursements/create" className="btn btn-primary">
            ➕ New Request
          </Link>
        )}
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* ── Stats ─────────────────────────────────────────────────────── */}
          <div className="stat-grid">
            <StatCard icon="📋" label="Total"    value={total}    accent="#4f46e5" />
            <StatCard icon="⏳" label="Pending"  value={pending}  accent="#d97706" />
            <StatCard icon="✅" label="Approved" value={approved} accent="#16a34a" />
            <StatCard icon="❌" label="Rejected" value={rejected} accent="#dc2626" />
            {!isEMP && (
              <StatCard icon="👥" label={role === ROLES.CFO ? 'All Users' : 'My Team'} value={employees.length} accent="#06b6d4" />
            )}
          </div>

          {/* ── Quick Actions ───────────────────────────────────────────────── */}
          <div className="card" style={{ marginTop: 8 }}>
            <div className="card-header">
              <span className="card-title">Quick Actions</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {isEMP && (
                  <>
                    <Link to="/reimbursements/create" className="btn btn-primary btn-sm">➕ Create Request</Link>
                    <Link to="/reimbursements"        className="btn btn-secondary btn-sm">📋 My Requests</Link>
                  </>
                )}
                {(role === ROLES.RM || role === ROLES.APE || role === ROLES.CFO) && (
                  <>
                    <Link to="/approvals"       className="btn btn-primary btn-sm">✅ Pending Approvals</Link>
                    <Link to="/reimbursements"  className="btn btn-secondary btn-sm">📋 Reimbursements</Link>
                    <Link to="/employees"       className="btn btn-outline btn-sm">👥 Employees</Link>
                  </>
                )}
                {(role === ROLES.APE || role === ROLES.CFO) && (
                  <Link to="/employees/assign" className="btn btn-outline btn-sm">🔗 Assign Employees</Link>
                )}
                {role === ROLES.CFO && (
                  <Link to="/roles/assign" className="btn btn-outline btn-sm">🎭 Assign Roles</Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
