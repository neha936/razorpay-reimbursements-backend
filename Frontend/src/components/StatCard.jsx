/**
 * StatCard — dashboard summary card.
 *
 * @param {string} icon     emoji
 * @param {string} label    stat label
 * @param {string|number} value  stat value
 * @param {string} [accent]  CSS color for the icon background tint
 */
export default function StatCard({ icon, label, value, accent = 'var(--color-primary)' }) {
  return (
    <div
      className="card"
      style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--radius-md)',
          background: `${accent}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: '1.625rem',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            marginTop: '3px',
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
