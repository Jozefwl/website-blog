import styles from './casino.module.css';

// Whole-chip bet input. The game disables its play button when the bet is invalid.
export default function BetField({ value, onChange }) {
  return (
    <label className={styles.field}>
      Bet
      <input type="number" min="1" step="1" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export const toBet = (raw) => (raw === '' ? NaN : Number(raw));
