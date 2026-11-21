import { Link } from 'react-router';
import styles from './Rack.module.css';

// Mounting ear: bent metal flange with a thumbscrew into the rail's middle hole.
// With `to`, the screw is a (deliberately inconspicuous) link: the casino easter egg.
export default function RackEar({ to }) {
  if (!to) {
    return (
      <span className={styles.ear} aria-hidden="true">
        <span className={styles.screw} />
      </span>
    );
  }
  return (
    <span className={styles.ear}>
      <Link to={to} className={`${styles.screw} ${styles.looseScrew}`} aria-label="Loose screw" />
    </span>
  );
}
