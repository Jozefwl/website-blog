import AnimatedText from './AnimatedText.jsx';
import styles from './PageHeader.module.css';

// Page title styled like a rack unit's label strip.
export default function PageHeader({ tag, title, subtitle }) {
  return (
    <header className={styles.header}>
      {tag && <span className={styles.tag}>{tag}</span>}
      <AnimatedText text={title} />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
