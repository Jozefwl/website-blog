import styles from './Rack.module.css';

// Mounting ear: bent metal flange with a thumbscrew into the rail's middle hole.
export default function RackEar() {
  return (
    <span className={styles.ear} aria-hidden="true">
      <span className={styles.screw} />
    </span>
  );
}
