import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getReimbursements } from '../api/reimbursements.api';
import { formatDate, formatCurrency } from '../utils/helpers';

export default function ReimbursementsPage() {
  const { isEMP } = useAuth();
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getReimbursements();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load reimbursements.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout pageTitle="Reimbursements">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEMP ? 'My Reimbursements' : 'Reimbursements'}
          </h1>
          <p className="page-subtitle">
            {isEMP ? 'All your submitted reimbursement requests.' : 'Role-filtered list of reimbursements.'}
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
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📭"
            title="No reimbursements found"
            message={isEMP ? 'Submit your first request to get started.' : 'Nothing to show right now.'}
            action={isEMP && (
              <Link to="/reimbursements/create" className="btn btn-primary btn-sm">
                ➕ Create Request
              </Link>
            )}
          />
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {rows.length} record{rows.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>RM</th>
                  <th>APE</th>
                  <th>CFO</th>
                  <th>Final</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="text-muted text-xs">{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.title}</div>
                      {r.description && (
                        <div className="text-muted text-xs" style={{ marginTop: 2, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.description}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(r.amount)}</td>
                    <td><StatusBadge status={r.rm_status} /></td>
                    <td><StatusBadge status={r.ape_status} /></td>
                    <td><StatusBadge status={r.cfo_status} /></td>
                    <td><StatusBadge status={r.final_status} /></td>
                    <td className="text-muted text-xs">{formatDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
