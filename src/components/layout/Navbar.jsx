import RackLink from '../common/RackLink.jsx';
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
          <RackLink
            nav
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            {label}
          </RackLink>
        ))}
      </nav>
    </header>
  );
}
