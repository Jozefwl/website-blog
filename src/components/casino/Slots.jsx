import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { SLOT_PAYTABLE, SLOT_SYMBOLS, slotPayout, spinReels } from '../../lib/casino/slots.js';
import BetField, { toBet } from './BetField.jsx';
import styles from './casino.module.css';

export const SYMBOL_LOOK = {
  cpu: { glyph: '▣', label: 'CPU', color: '#4f7cff' },
  ram: { glyph: '▤', label: 'RAM', color: '#22c55e' },
  drive: { glyph: '◫', label: 'DRIVE', color: '#f59e0b' },
  led: { glyph: '●', label: 'LED', color: '#ef4444' },
  fan: { glyph: '✻', label: 'FAN', color: '#22d3ee' },
  screw: { glyph: '⊕', label: 'SCREW', color: '#facc15' },
};

// Reel i stops after REEL_BASE_S + i * REEL_STAGGER_S; the win is paid when the last one stops.
const REEL_BASE_S = 1.1;
const REEL_STAGGER_S = 0.4;
const STRIP_LENGTH = 14;
const SPIN_MS = (REEL_BASE_S + 2 * REEL_STAGGER_S) * 1000 + 100;

function Symbol({ symbol }) {
  const look = SYMBOL_LOOK[symbol];
  return (
    <span className={styles.cell} style={{ '--sym': look.color }}>
      <span className={styles.glyph} aria-hidden="true">
        {look.glyph}
      </span>
      <span className={styles.symLabel}>{look.label}</span>
    </span>
  );
}

// A visual strip that scrolls from the old symbol to the new one. Filler is decoration only,
// so it uses Math.random and never touches the game's RNG.
const makeStrip = (from, to) => [
  from,
  ...Array.from({ length: STRIP_LENGTH - 2 }, () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]),
  to,
];

export default function Slots({ chips, rng, onChange }) {
  const reduceMotion = useReducedMotion();
  const [bet, setBet] = useState('10');
  const [reels, setReels] = useState(['cpu', 'ram', 'drive']);
  const [strips, setStrips] = useState(null);
  const [message, setMessage] = useState('Three of a kind wins. Three screws is the jackpot.');
  const pending = useRef(null);
  const amount = toBet(bet);

  // Leaving mid-spin still pays out what the reels were going to show.
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
    setReels(result);
    setStrips(null);
    setMessage(won > 0 ? `+${won} chips` : 'No match. The house thanks you.');
    onChange();
  }

  function spin() {
    if (strips || !chips.take(amount)) return;
    const result = spinReels(rng);
    const won = slotPayout(result, amount);
    onChange();
    if (reduceMotion) {
      settle(result, won);
      return;
    }
    setStrips(result.map((symbol, i) => makeStrip(reels[i], symbol)));
    setMessage('Spinning…');
    pending.current = { won, timer: setTimeout(() => settle(result, won), SPIN_MS) };
  }

  const spinning = strips !== null;

  return (
    <section className={styles.panel} aria-labelledby="slots-title">
      <h2 id="slots-title" className={styles.title}>
        Slots
      </h2>
      <div className={styles.reels} aria-live="polite" aria-busy={spinning}>
        {reels.map((symbol, i) => (
          <span key={i} className={styles.reel}>
            {spinning ? (
              <span
                className={styles.strip}
                style={{
                  '--steps': STRIP_LENGTH - 1,
                  animationDuration: `${REEL_BASE_S + i * REEL_STAGGER_S}s`,
                }}
              >
                {strips[i].map((s, j) => (
                  <Symbol key={j} symbol={s} />
                ))}
              </span>
            ) : (
              <Symbol symbol={symbol} />
            )}
          </span>
        ))}
      </div>
      <div className={styles.controls}>
        <BetField value={bet} onChange={setBet} />
        <button type="button" className={styles.button} onClick={spin} disabled={spinning || !chips.canBet(amount)}>
          {spinning ? 'Spinning…' : 'Spin'}
        </button>
      </div>
      <p className={styles.lcd}>{message}</p>

      <table className={styles.paytable} aria-label="Payouts">
        <tbody>
          {SLOT_PAYTABLE.map(({ symbol, multiplier, jackpot }) => (
            <tr key={symbol} className={jackpot ? styles.jackpotRow : undefined}>
              <td className={styles.payGlyphs} style={{ '--sym': SYMBOL_LOOK[symbol].color }} aria-label={`3 × ${SYMBOL_LOOK[symbol].label}`}>
                {SYMBOL_LOOK[symbol].glyph.repeat(3)}
              </td>
              <td>{SYMBOL_LOOK[symbol].label}</td>
              <td className={styles.payX}>
                {multiplier}x{jackpot && <span className={styles.jackpotTag}> JACKPOT</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
