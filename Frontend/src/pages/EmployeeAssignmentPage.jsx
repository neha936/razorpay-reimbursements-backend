import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import RoleGuard from '../components/RoleGuard';
import EmptyState from '../components/EmptyState';
import { getEmployees, assignEmployee, removeEmployee } from '../api/employees.api';
import { ROLES } from '../utils/constants';

export default function EmployeeAssignmentPage() {
  const [employees, setEmployees]   = useState([]);
  const [managers, setManagers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [empId, setEmpId]   = useState('');
  const [mgrId, setMgrId]   = useState('');
  const [action, setAction] = useState('assign'); // 'assign' | 'remove'

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getEmployees();
      const all = Array.isArray(data) ? data : [];
      setEmployees(all.filter((u) => u.role === ROLES.EMP));
      setManagers(all.filter((u) => u.role === ROLES.RM));
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!empId || !mgrId) { setError('Please select both an employee and a manager.'); return; }

    setSubmitting(true);
    try {
      if (action === 'assign') {
        await assignEmployee(Number(empId), Number(mgrId));
        setSuccess('Employee successfully assigned to manager.');
      } else {
        await removeEmployee(Number(empId), Number(mgrId));
        setSuccess('Employee successfully removed from manager.');
      }
      setEmpId('');
      setMgrId('');
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout pageTitle="Employee Assignment">
      <RoleGuard allowed={[ROLES.APE, ROLES.CFO]}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Employee Assignment</h1>
            <p className="page-subtitle">Assign or remove employees from reporting managers.</p>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header">
            <span className="card-title">Manage Assignment</span>
          </div>
          <div className="card-body">
            {error   && <Alert type="error"   message={error}   onDismiss={() => setError('')} />}
            {success && <Alert type="success" message={success} autoDismiss={5000} onDismiss={() => setSuccess('')} />}

            {loading ? <Loader /> : (
              <form onSubmit={handleSubmit}>
                {/* ── Action toggle ─────────────────────────────────────── */}
                <div className="form-group">
                  <label className="form-label">Action</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['assign', 'remove'].map((a) => (
                      <label
                        key={a}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 18px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${action === a ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: action === a ? 'var(--color-primary-light)' : 'var(--color-surface)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <input
                          type="radio"
                          name="action"
                          value={a}
                          checked={action === a}
                          onChange={() => setAction(a)}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        {a === 'assign' ? '🔗 Assign' : '🔓 Remove'}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="assign-emp">Employee (EMP)</label>
                  <select
                    id="assign-emp"
                    className="form-select"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    required
                  >
                    <option value="">— Select employee —</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>{e.name} ({e.email})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="assign-mgr">Reporting Manager (RM)</label>
                  <select
                    id="assign-mgr"
                    className="form-select"
                    value={mgrId}
                    onChange={(e) => setMgrId(e.target.value)}
                    required
                  >
                    <option value="">— Select manager —</option>
                    {managers.length === 0
                      ? <option disabled>No RMs found — assign RM roles first</option>
                      : managers.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                        ))
                    }
                  </select>
                </div>

                <button
                  id="emp-assign-submit-btn"
                  type="submit"
                  className={`btn ${action === 'assign' ? 'btn-primary' : 'btn-danger'}`}
                  disabled={submitting}
                >
                  {submitting ? 'Processing…' : action === 'assign' ? '🔗 Assign' : '🔓 Remove Assignment'}
                </button>
              </form>
            )}
          </div>
        </div>
      </RoleGuard>
    </Layout>
  );
}
