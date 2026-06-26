import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Shows a loader while auth is being restored from sessionStorage.
 */
export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) return <Loader fullPage message="Checking session…" />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
