/**
 * EmptyState — shown when a list or table has no data.
 *
 * @param {string}   icon     emoji or image src
 * @param {string}   title
 * @param {string}   [message]
 * @param {ReactNode} [action]  optional CTA button
 */
export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '3rem', lineHeight: 1 }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      {message && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: 320 }}>
          {message}
        </p>
      )}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}
