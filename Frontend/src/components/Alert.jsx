import { useState, useEffect } from 'react';

/**
 * Alert — inline success / error / info message.
 * Auto-dismisses after `autoDismiss` ms if provided.
 *
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {string}  message
 * @param {number}  [autoDismiss] ms before auto-hide
 * @param {()=>void} [onDismiss]
 */
export default function Alert({ type = 'info', message, autoDismiss, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoDismiss) return;
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDismiss);
    return () => clearTimeout(t);
  }, [autoDismiss, onDismiss]);

  if (!visible || !message) return null;

  const colorMap = {
    success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: '✅' },
    error:   { bg: 'var(--color-danger-bg)',  color: 'var(--color-danger)',  icon: '❌' },
    warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: '⚠️' },
    info:    { bg: 'var(--color-primary-light)', color: 'var(--color-primary)', icon: 'ℹ️' },
  };

  const { bg, color, icon } = colorMap[type] || colorMap.info;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: bg,
        color,
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: '1.4', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, lineHeight: '1.5' }}>{message}</span>
      <button
        onClick={() => { setVisible(false); onDismiss?.(); }}
        aria-label="Dismiss alert"
        style={{
          background: 'none',
          border: 'none',
          color,
          cursor: 'pointer',
          fontSize: '1rem',
          lineHeight: 1,
          padding: '2px',
          opacity: 0.7,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}
