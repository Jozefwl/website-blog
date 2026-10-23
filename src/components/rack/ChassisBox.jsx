import styles from './Rack.module.css';

// The 3D body of a server behind its faceplate: top, bottom and side panels
// that extend back into the rack. Only seen when the server slides out.
export default function ChassisBox({ label }) {
  return (
    <span className={styles.chassis} aria-hidden="true">
      <span className={`${styles.face} ${styles.chassisTop}`}>
        {label && <span className={styles.sticker}>{label}</span>}
      </span>
      <span className={`${styles.face} ${styles.chassisBottom}`} />
      <span className={`${styles.face} ${styles.chassisLeft}`} />
      <span className={`${styles.face} ${styles.chassisRight}`} />
      <span className={`${styles.face} ${styles.chassisBack}`} />
    </span>
  );
}
