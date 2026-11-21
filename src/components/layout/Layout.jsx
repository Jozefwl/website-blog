import { Outlet, useLocation } from 'react-router';
import Navbar from './Navbar.jsx';
import CookieNotice from './CookieNotice.jsx';
import Footer from './Footer.jsx';
import styles from './Layout.module.css';

// Page shell: navbar (except on the rack homepage), page content, cookie notice.
// Content pages fade in on every route change (covers browser back/forward, which can't be
// wrapped in a view transition). The rack page (`bare`) never fades: opacity would flatten its 3D.
export default function Layout({ showNavbar = true }) {
  const { pathname } = useLocation();
  return (
    <>
      {showNavbar && <Navbar />}
      <main key={showNavbar ? pathname : undefined} className={showNavbar ? `${styles.page} ${styles.enter}` : styles.bare}>
        <Outlet />
      </main>
      <Footer />
      <CookieNotice />
    </>
  );
}
