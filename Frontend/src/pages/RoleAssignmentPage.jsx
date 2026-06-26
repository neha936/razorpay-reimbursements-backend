import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import RoleGuard from '../components/RoleGuard';
import EmptyState from '../components/EmptyState';
import { getEmployees } from '../api/employees.api';
import { assignRole } from '../api/roles.api';
import { ROLES, ROLE_OPTIONS } from '../utils/constants';
import { roleLabel } from '../utils/helpers';

export default function RoleAssignmentPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [submitting, setSubmitting]     = useState(false);

  async function fetchEmployees() {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEmployees(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedUser || !selectedRole) { setError('Please select a user and a role.'); return; }

    setSubmitting(true);
    try {
      await assignRole(Number(selectedUser), selectedRole);
      const emp = employees.find((e) => String(e.id) === selectedUser);
      setSuccess(`Role updated to "${roleLabel(selectedRole)}" for ${emp?.name || 'user'}.`);
      setSelectedUser('');
      setSelectedRole('');
      await fetchEmployees(); // refresh list
    } catch (err) {
      setError(err.message || 'Failed to assign role.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout pageTitle="Role Assignment">
      <RoleGuard allowed={[ROLES.CFO]}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Role Assignment</h1>
            <p className="page-subtitle">Assign or change roles for organisation users.</p>
          </div>
        </div>

        {/* ── Assign form ────────────────────────────────────────────────── */}
        <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
          <div className="card-header">
            <span className="card-title">Assign Role</span>
          </div>
          <div className="card-body">
            {error   && <Alert type="error"   message={error}   onDismiss={() => setError('')} />}
            {success && <Alert type="success" message={success} autoDismiss={5000} onDismiss={() => setSuccess('')} />}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="role-assign-user">Select User</label>
                {loading ? (
                  <Loader />
                ) : (
                  <select
                    id="role-assign-user"
                    className="form-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">— Choose a user —</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.email}) — {emp.role}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role-assign-role">Assign Role</label>
                <select
                  id="role-assign-role"
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  <option value="">— Choose a role —</option>
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button
                id="role-assign-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={submitting || loading}
              >
                {submitting ? 'Assigning…' : '🎭 Assign Role'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Users list ─────────────────────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">All Users</span>
          </div>
          {loading ? (
            <div className="card-body"><Loader /></div>
          ) : employees.length === 0 ? (
            <EmptyState icon="👥" title="No users found" />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Current Role</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </RoleGuard>
    </Layout>
  );
}
