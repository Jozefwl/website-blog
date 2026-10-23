import styles from './Socials.module.css';

const SOCIALS = [
  { href: 'https://www.linkedin.com/in/jozef-waldhauser-337779220/', logo: '/logo/linkedin.png', name: 'LinkedIn', className: 'linkedin' },
  { href: 'https://www.youtube.com/channel/UCpAI1PeZgrrca3H8JqOdMBQ', logo: '/logo/youtube.png', name: 'YouTube', className: 'youtube' },
  { href: 'https://github.com/Jozefwl', logo: '/logo/github.png', name: 'GitHub', className: 'github' },
];

export default function Socials() {
  return (
    <div className={styles.bar}>
      {SOCIALS.map(({ href, logo, name, className }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles[className]}`}>
          <img className={styles.logo} src={logo} alt={name} />
        </a>
      ))}
    </div>
  );
}
