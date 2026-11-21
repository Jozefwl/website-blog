import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { colorOf, roulettePayout, spinWheel } from '../../lib/casino/roulette.js';
import BetField, { toBet } from './BetField.jsx';
import RouletteWheel from './RouletteWheel.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';

const WHEEL_MS = 5000;
import styles from './casino.module.css';

const BET_TYPES = ['red', 'black', 'odd', 'even', 'low', 'high', 'number'];

// European wheel: a number pays 35:1, outside bets pay 1:1, zero loses every outside bet.
export default function Roulette({ chips, rng, onChange }) {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  const [bet, setBet] = useState('10');
  const [spin, setSpin] = useState(null);
  const [settled, setSettled] = useState(true);
  const pending = useRef(null);
  const [type, setType] = useState('red');
  const [number, setNumber] = useState('17');
  const [last, setLast] = useState(null);
  const [message, setMessage] = useState({ key: 'casino.roulette.intro' });
  const amount = toBet(bet);
  const pick = number.trim() === '' ? NaN : Number(number); // an empty field is not "0"
  const numberOk = type !== 'number' || (Number.isInteger(pick) && pick >= 0 && pick <= 36);

  // Leaving mid-spin still pays out what the ball was going to land on.
  useEffect(
    () => () => {
      if (!pending.current) return;
      clearTimeout(pending.current.timer);
      chips.give(pending.current.won);
    },
    [chips],
  );

  function settle(result, won) {
    pending.current = null;
    chips.give(won);
    setLast(result);
    setSettled(true);
    setMessage(won > 0 ? { key: 'casino.plusChips', vars: { count: won } } : { key: 'casino.roulette.lose' });
    onChange();
  }

  function play() {
    if (!settled || !numberOk || !chips.take(amount)) return;
    const result = spinWheel(rng);
    const won = roulettePayout({ type, value: pick }, result, amount);
    onChange();
    setSpin({ result, durationMs: reduceMotion ? 0 : WHEEL_MS });
    if (reduceMotion) {
      settle(result, won);
      return;
    }
    setSettled(false);
    setMessage({ key: 'casino.roulette.noMoreBets' });
    pending.current = { won, timer: setTimeout(() => settle(result, won), WHEEL_MS) };
  }

  return (
    <section className={styles.panel} aria-labelledby="roulette-title">
      <h2 id="roulette-title" className={styles.title}>
        {t('casino.roulette.title')}
      </h2>
      <RouletteWheel spin={spin} settled={settled} label={t('casino.roulette.wheel')} />
      <p aria-live="polite">
        {t('casino.roulette.lastSpin')}{' '}
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
          {t('casino.roulette.betOn')}
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {BET_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`casino.roulette.types.${type}`)}
              </option>
            ))}
          </select>
        </label>
        {type === 'number' && (
          <label className={styles.field}>
            {t('casino.roulette.number')}
            <input type="number" min="0" max="36" step="1" value={number} onChange={(e) => setNumber(e.target.value)} />
          </label>
        )}
        <button type="button" className={styles.button} onClick={play} disabled={!settled || !numberOk || !chips.canBet(amount)}>
          {t(settled ? 'casino.slots.spin' : 'casino.slots.spinning')}
        </button>
      </div>
      <p className={styles.lcd}>{t(message.key, message.vars)}</p>
    </section>
  );
}
