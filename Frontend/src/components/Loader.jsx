// Loader.jsx — Full-page or inline spinner
export default function Loader({ fullPage = false, message = 'Loading...' }) {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '48px 24px',
    ...(fullPage && {
      position: 'fixed',
      inset: 0,
      background: 'rgba(255,255,255,0.85)',
      zIndex: 999,
    }),
  };

  return (
    <div style={style} role="status" aria-label={message}>
      <div className="loader-spinner" />
      <p className="text-muted text-sm">{message}</p>
      <style>{`
        .loader-spinner {
          width: 38px; height: 38px;
          border: 3.5px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
