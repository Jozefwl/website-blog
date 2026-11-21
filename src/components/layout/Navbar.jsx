import { useLang } from '../../i18n/LanguageContext.jsx';
import RackLink from '../common/RackLink.jsx';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', key: 'home', end: true },
  { to: '/about', key: 'about' },
  { to: '/projects', key: 'projects' },
  { to: '/services', key: 'services' },
  { to: '/contact', key: 'contact' },
];

export default function Navbar() {
  const { t } = useLang();
  return (
    <header className={styles.bar}>
      <nav className={styles.nav} aria-label={t('nav.label')}>
        {LINKS.map(({ to, key, end }) => (
          <RackLink
            nav
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            {t(`nav.${key}`)}
          </RackLink>
        ))}
      </nav>
    </header>
  );
}
