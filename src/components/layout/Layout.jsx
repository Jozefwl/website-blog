import { Outlet } from 'react-router';
import Navbar from './Navbar.jsx';
import CookieNotice from './CookieNotice.jsx';
import styles from './Layout.module.css';

// Page shell: navbar (except on the rack homepage), page content, cookie notice.
export default function Layout({ showNavbar = true }) {
  return (
    <>
      {showNavbar && <Navbar />}
      <main className={showNavbar ? styles.page : styles.bare}>
        <Outlet />
      </main>
      <CookieNotice />
    </>
  );
}
