import { statusVariant } from '../utils/helpers';

/**
 * StatusBadge — coloured pill for PENDING / APPROVED / REJECTED.
 *
 * @param {string} status
 * @param {string} [label] override display text
 */
export default function StatusBadge({ status, label }) {
  const variant = statusVariant(status);

  const variantStyles = {
    success: {
      background: 'var(--color-success-bg)',
      color: 'var(--color-success)',
    },
    danger: {
      background: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
    },
    warning: {
      background: 'var(--color-warning-bg)',
      color: 'var(--color-warning)',
    },
  };

  const dotColors = { success: '#16a34a', danger: '#dc2626', warning: '#d97706' };

  const styles = variantStyles[variant] || variantStyles.warning;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...styles,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: dotColors[variant],
          flexShrink: 0,
        }}
      />
      {label || status}
    </span>
  );
}
