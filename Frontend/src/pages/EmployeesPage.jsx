import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import RoleGuard from '../components/RoleGuard';
import StatusBadge from '../components/StatusBadge';
import { getEmployees } from '../api/employees.api';
import { getSubordinateReimbursements } from '../api/reimbursements.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate, roleLabel } from '../utils/helpers';

export default function EmployeesPage() {
  const { role } = useAuth();
  const [employees, setEmployees]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [selected, setSelected]             = useState(null);   // employee whose reimbursements to drill into
  const [subReimbs, setSubReimbs]           = useState([]);
  const [subLoading, setSubLoading]         = useState(false);
  const [subError, setSubError]             = useState('');

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load employees.');
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  async function handleViewReimbs(emp) {
    setSelected(emp);
    setSubError('');
    setSubReimbs([]);
    setSubLoading(true);
    try {
      const data = await getSubordinateReimbursements(emp.id);
      setSubReimbs(Array.isArray(data) ? data : []);
    } catch (err) {
      setSubError(err.message || 'Failed to load reimbursements.');
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <Layout pageTitle="Employees">
      <RoleGuard allowed={[ROLES.RM, ROLES.APE, ROLES.CFO]}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-subtitle">
              {role === ROLES.RM  && 'Your subordinate employees.'}
              {role === ROLES.APE && 'All employees and reporting managers.'}
              {role === ROLES.CFO && 'All users in the organisation.'}
            </p>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <Loader />
        ) : employees.length === 0 ? (
          <div className="card">
            <EmptyState icon="👥" title="No employees found" message="Nothing to display yet." />
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <span className="card-title">{employees.length} user{employees.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    {role === ROLES.RM && <th>Reimbursements</th>}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="text-muted text-xs">{emp.id}</td>
                      <td style={{ fontWeight: 600 }}>{emp.name}</td>
                      <td className="text-sm">{emp.email}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                        }}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="text-muted text-xs">{formatDate(emp.created_at)}</td>
                      {role === ROLES.RM && (
                        <td>
                          <button
                            id={`view-reimbs-btn-${emp.id}`}
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleViewReimbs(emp)}
                          >
                            📋 View
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Subordinate reimbursement drill-down (RM only) ─────────────────── */}
        {selected && role === ROLES.RM && (
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header">
              <span className="card-title">
                Reimbursements — {selected.name}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setSelected(null); setSubReimbs([]); }}
              >
                ✕ Close
              </button>
            </div>
            <div className="card-body">
              {subError && <Alert type="error" message={subError} />}
              {subLoading ? (
                <Loader />
              ) : subReimbs.length === 0 ? (
                <EmptyState icon="📭" title="No reimbursements" message={`${selected.name} hasn't submitted any requests.`} />
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>RM</th>
                        <th>APE</th>
                        <th>Final</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subReimbs.map((r) => (
                        <tr key={r.id}>
                          <td className="text-muted text-xs">{r.id}</td>
                          <td style={{ fontWeight: 600 }}>{r.title}</td>
                          <td>{formatDate(r.amount)}</td>
                          <td><StatusBadge status={r.rm_status} /></td>
                          <td><StatusBadge status={r.ape_status} /></td>
                          <td><StatusBadge status={r.final_status} /></td>
                          <td className="text-muted text-xs">{formatDate(r.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </RoleGuard>
    </Layout>
  );
}
