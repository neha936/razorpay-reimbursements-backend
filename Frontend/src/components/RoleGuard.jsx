import { useAuth } from '../context/AuthContext';

/**
 * RoleGuard — renders children only if the current user's role
 * is included in the `allowed` array. Otherwise renders a 403 message.
 *
 * @param {string[]} allowed   array of roles that may access this content
 * @param {ReactNode} children
 * @param {ReactNode} [fallback] custom fallback UI (optional)
 */
export default function RoleGuard({ allowed = [], children, fallback }) {
  const { role } = useAuth();

  if (!allowed.includes(role)) {
    return fallback || (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '3rem' }}>🚫</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 300 }}>
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}
