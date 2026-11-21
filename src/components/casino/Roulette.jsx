import { useState } from 'react';
import { colorOf, roulettePayout, spinWheel } from '../../lib/casino/roulette.js';
import BetField, { toBet } from './BetField.jsx';
import styles from './casino.module.css';

const BET_TYPES = [
  { value: 'red', label: 'Red' },
  { value: 'black', label: 'Black' },
  { value: 'odd', label: 'Odd' },
  { value: 'even', label: 'Even' },
  { value: 'low', label: 'Low (1–18)' },
  { value: 'high', label: 'High (19–36)' },
  { value: 'number', label: 'Single number' },
];

// European wheel: a number pays 35:1, outside bets pay 1:1, zero loses every outside bet.
export default function Roulette({ chips, rng, onChange }) {
  const [bet, setBet] = useState('10');
  const [type, setType] = useState('red');
  const [number, setNumber] = useState('17');
  const [last, setLast] = useState(null);
  const [message, setMessage] = useState('Single zero. Numbers pay 35:1.');
  const amount = toBet(bet);
  const pick = number.trim() === '' ? NaN : Number(number); // an empty field is not "0"
  const numberOk = type !== 'number' || (Number.isInteger(pick) && pick >= 0 && pick <= 36);

  function spin() {
    if (!numberOk || !chips.take(amount)) return;
    const result = spinWheel(rng);
    const won = roulettePayout({ type, value: pick }, result, amount);
    chips.give(won);
    setLast(result);
    setMessage(won > 0 ? `+${won} chips` : 'The ball disagrees.');
    onChange();
  }

  return (
    <section className={styles.panel} aria-labelledby="roulette-title">
      <h2 id="roulette-title" className={styles.title}>
        Roulette
      </h2>
      <p aria-live="polite">
        Last spin:{' '}
        {last == null ? (
          '—'
        ) : (
          <span className={styles.ball} data-color={colorOf(last)}>
            {last}
          </span>
        )}
      </p>
      <div className={styles.controls}>
        <BetField value={bet} onChange={setBet} />
        <label className={styles.field}>
          Bet on
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {BET_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        {type === 'number' && (
          <label className={styles.field}>
            Number
            <input type="number" min="0" max="36" step="1" value={number} onChange={(e) => setNumber(e.target.value)} />
          </label>
        )}
        <button type="button" className={styles.button} onClick={spin} disabled={!numberOk || !chips.canBet(amount)}>
          Spin
        </button>
      </div>
      <p className={styles.lcd}>{message}</p>
    </section>
  );
}
