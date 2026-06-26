import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import RoleGuard from '../components/RoleGuard';
import { createReimbursement } from '../api/reimbursements.api';
import { ROLES } from '../utils/constants';

export default function CreateReimbursementPage() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ title: '', description: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim()) { setError('Title is required.'); return; }
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);
    try {
      await createReimbursement(form.title.trim(), form.description.trim(), amount);
      setSuccess('Reimbursement request submitted successfully!');
      setTimeout(() => navigate('/reimbursements'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create reimbursement.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout pageTitle="Create Reimbursement">
      <RoleGuard allowed={[ROLES.EMP]}>
        <div className="page-header">
          <div>
            <h1 className="page-title">New Reimbursement Request</h1>
            <p className="page-subtitle">Submit your expense for approval.</p>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 580 }}>
          <div className="card-header">
            <span className="card-title">Request Details</span>
          </div>
          <div className="card-body">
            {error   && <Alert type="error"   message={error}   onDismiss={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reimb-title">Title *</label>
                <input
                  id="reimb-title"
                  name="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flight to Mumbai"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reimb-description">Description</label>
                <textarea
                  id="reimb-description"
                  name="description"
                  className="form-textarea"
                  placeholder="Brief description of the expense…"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reimb-amount">Amount (₹) *</label>
                <input
                  id="reimb-amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  className="form-input"
                  placeholder="e.g. 4500"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  id="create-reimb-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !!success}
                >
                  {loading ? 'Submitting…' : '📤 Submit Request'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/reimbursements')}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </RoleGuard>
    </Layout>
  );
}
