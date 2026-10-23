import ChassisBox from './ChassisBox.jsx';
import styles from './Rack.module.css';

// Static (non-clickable) rack device: faceplate with mounting ears, plus a 3D body.
export default function RackPanel({ size = 1, children, className = '' }) {
  return (
    <div className={`${styles.slot} ${styles[`u${size}`]}`}>
      <div className={styles.drawer}>
        <ChassisBox />
        <div className={`${styles.faceplate} ${className}`}>
          <span className={styles.ear} aria-hidden="true" />
          <div className={styles.body}>{children}</div>
          <span className={styles.ear} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
