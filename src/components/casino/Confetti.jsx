import { useEffect, useMemo, useState } from 'react';
import styles from './Confetti.module.css';

const PIECES = 90;
const LIFETIME_MS = 2600;
const COLORS = ['#facc15', '#22c55e', '#4f7cff', '#ef4444', '#22d3ee', '#f59e0b', '#ffffff'];

// One burst of confetti over the whole screen. Mount it with a new `key` for every win;
// it removes itself after ~2.6 s. Purely decorative (hidden from screen readers).
export default function Confetti() {
  const [visible, setVisible] = useState(true);
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 160,
        spin: 360 + Math.random() * 720,
        color: COLORS[i % COLORS.length],
        wide: Math.random() < 0.5,
      })),
    [],
  );

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), LIFETIME_MS);
    return () => clearTimeout(id);
  }, []);

  if (!visible) return null;
  return (
    <div className={styles.layer} aria-hidden="true" data-testid="confetti">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`${styles.piece} ${p.wide ? styles.wide : ''}`}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
