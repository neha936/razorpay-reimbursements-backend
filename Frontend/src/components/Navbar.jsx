import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials, roleLabel } from '../utils/helpers';

export default function Navbar({ pageTitle = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="app-navbar">
      {/* Left: page title */}
      <div className="navbar-left">
        <span className="navbar-title">{pageTitle}</span>
      </div>

      {/* Right: user chip + logout */}
      <div className="navbar-right">
        <div className="user-chip">
          <div className="user-avatar" aria-hidden="true">
            {getInitials(user?.name || '?')}
          </div>
          <div>
            <div className="user-info-name">{user?.name || 'User'}</div>
            <span className="user-info-role">{roleLabel(user?.role)}</span>
          </div>
        </div>

        <button
          id="logout-btn"
          className="btn btn-outline btn-sm"
          onClick={handleLogout}
          aria-label="Log out"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
}
