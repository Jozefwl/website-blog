import { NavLink } from 'react-router';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className={styles.bar}>
      <nav className={styles.nav} aria-label="Main">
        {LINKS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
