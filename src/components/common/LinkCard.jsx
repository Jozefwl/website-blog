import StatusLed from '../rack/StatusLed.jsx';
import styles from './LinkCard.module.css';

// One service link (icon + name), with an optional live status LED.
export default function LinkCard({ image, text, link, status }) {
  return (
    <a className={styles.card} href={link}>
      <img className={styles.icon} src={image} alt="" />
      <span className={styles.text}>{text}</span>
      {status && <StatusLed status={status} label={text} />}
    </a>
  );
}
