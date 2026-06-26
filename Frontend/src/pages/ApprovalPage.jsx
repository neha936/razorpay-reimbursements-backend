import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import RoleGuard from '../components/RoleGuard';
import { getReimbursements, approveReimbursement } from '../api/reimbursements.api';
import { formatDate, formatCurrency } from '../utils/helpers';
import { ROLES, ACTIONS } from '../utils/constants';

export default function ApprovalPage() {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionLoading, setActLoading] = useState(null); // reimbursement id being processed
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      const data = await getReimbursements();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load reimbursements.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleAction(id, action) {
    setActLoading(id);
    setError('');
    setSuccess('');
    try {
      await approveReimbursement(id, action);
      setSuccess(`Reimbursement #${id} ${action.toLowerCase()} successfully.`);
      await fetchData(); // refresh list
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setActLoading(null);
    }
  }

  return (
    <Layout pageTitle="Approvals">
      <RoleGuard allowed={[ROLES.RM, ROLES.APE, ROLES.CFO]}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Pending Approvals</h1>
            <p className="page-subtitle">
              Review and approve or reject reimbursement requests.
            </p>
          </div>
        </div>

        {error   && <Alert type="error"   message={error}   onDismiss={() => setError('')} />}
        {success && <Alert type="success" message={success} autoDismiss={4000} onDismiss={() => setSuccess('')} />}

        {loading ? (
          <Loader />
        ) : rows.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="🎉"
              title="All caught up!"
              message="There are no pending reimbursements for you to review right now."
            />
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <span className="card-title">{rows.length} pending</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>RM</th>
                    <th>APE</th>
                    <th>CFO</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="text-muted text-xs">{r.id}</td>
                      <td className="text-sm font-medium">{r.employee_name || `#${r.employee_id}`}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.title}</div>
                        {r.description && (
                          <div className="text-muted text-xs" style={{ marginTop: 2, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.description}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(r.amount)}</td>
                      <td><StatusBadge status={r.rm_status} /></td>
                      <td><StatusBadge status={r.ape_status} /></td>
                      <td><StatusBadge status={r.cfo_status} /></td>
                      <td className="text-muted text-xs">{formatDate(r.created_at)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            id={`approve-btn-${r.id}`}
                            className="btn btn-success btn-sm"
                            disabled={actionLoading === r.id}
                            onClick={() => handleAction(r.id, ACTIONS.APPROVED)}
                          >
                            {actionLoading === r.id ? '…' : '✅ Approve'}
                          </button>
                          <button
                            id={`reject-btn-${r.id}`}
                            className="btn btn-danger btn-sm"
                            disabled={actionLoading === r.id}
                            onClick={() => handleAction(r.id, ACTIONS.REJECTED)}
                          >
                            {actionLoading === r.id ? '…' : '❌ Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </RoleGuard>
    </Layout>
  );
}
