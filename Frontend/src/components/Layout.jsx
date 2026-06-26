import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Layout — the authenticated app shell.
 * Wraps every protected page with sidebar + navbar.
 *
 * @param {string}   pageTitle  shown in the top navbar
 * @param {ReactNode} children
 */
export default function Layout({ pageTitle, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Navbar pageTitle={pageTitle} />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
