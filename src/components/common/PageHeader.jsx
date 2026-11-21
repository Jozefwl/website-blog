import { HEADER_VT_NAME } from '../../lib/transitions.js';
import AnimatedText from './AnimatedText.jsx';
import styles from './PageHeader.module.css';

// Page title styled like a rack unit's label strip. It is the morph target of the clicked faceplate.
export default function PageHeader({ tag, title, subtitle }) {
  return (
    <header className={styles.header} style={{ viewTransitionName: HEADER_VT_NAME }}>
      {tag && <span className={styles.tag}>{tag}</span>}
      <AnimatedText text={title} />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
