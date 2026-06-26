import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api/auth.api';

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ───────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { id, name, email, role }
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // On mount: try to restore user from sessionStorage (in-memory only, no JWT stored)
  useEffect(() => {
    const stored = sessionStorage.getItem('rmt_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setAuthReady(true);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  async function login(email, password) {
    setLoading(true);
    try {
      const data = await loginUser(email, password);   // sets httpOnly cookie
      setUser(data);
      sessionStorage.setItem('rmt_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────────
  async function logout() {
    try {
      await logoutUser();                             // clears httpOnly cookie
    } catch { /* best-effort */ }
    setUser(null);
    sessionStorage.removeItem('rmt_user');
  }

  // ── Role helpers ─────────────────────────────────────────────────────────────
  const role    = user?.role || null;
  const isEMP   = role === 'EMP';
  const isRM    = role === 'RM';
  const isAPE   = role === 'APE';
  const isCFO   = role === 'CFO';
  const isAdmin = isRM || isAPE || isCFO;

  return (
    <AuthContext.Provider
      value={{ user, loading, authReady, login, logout, role, isEMP, isRM, isAPE, isCFO, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
