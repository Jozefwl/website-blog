import styles from './Gauge.module.css';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Circular percentage gauge (replaces react-circular-progressbar).
export default function Gauge({ value, color, label }) {
  const safe = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, safe));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <figure className={styles.gauge}>
      <svg viewBox="0 0 100 100" className={styles.svg} role="img" aria-label={`${label} ${safe.toFixed(2)}%`}>
        <circle cx="50" cy="50" r={RADIUS} className={styles.trail} />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className={styles.path}
          stroke={color}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" className={styles.value}>
          {`${safe.toFixed(2)}%`}
        </text>
      </svg>
      <figcaption className={styles.label}>{label}</figcaption>
    </figure>
  );
}
