import styles from './Rack.module.css';

// Static (non-clickable) rack faceplate with mounting ears and screws.
export default function RackPanel({ size = 1, children, className = '' }) {
  return (
    <div className={`${styles.faceplate} ${styles[`u${size}`]} ${className}`}>
      <span className={styles.ear} aria-hidden="true" />
      <div className={styles.body}>{children}</div>
      <span className={styles.ear} aria-hidden="true" />
    </div>
  );
}
