import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../utils/constants';

export default function Sidebar() {
  const { user, role } = useAuth();

  // Filter nav items to those allowed for current role
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">💼</div>
        <div>
          <div className="sidebar-brand-name">Reimburse</div>
          <div className="sidebar-brand-sub">Management Tool</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="nav-section-label">Menu</div>
        {visibleItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-link-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34, height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #818cf8, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(199,210,254,0.7)' }}>{role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
