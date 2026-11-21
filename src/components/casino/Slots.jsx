import { useState } from 'react';
import { slotPayout, spinReels } from '../../lib/casino/slots.js';
import BetField, { toBet } from './BetField.jsx';
import styles from './casino.module.css';

const LOOK = {
  cpu: { glyph: '▣', label: 'CPU' },
  ram: { glyph: '▤', label: 'RAM' },
  drive: { glyph: '◫', label: 'DRIVE' },
  led: { glyph: '●', label: 'LED' },
  fan: { glyph: '✻', label: 'FAN' },
  screw: { glyph: '⊕', label: 'SCREW' },
};

export default function Slots({ chips, rng, onChange }) {
  const [bet, setBet] = useState('10');
  const [reels, setReels] = useState(['cpu', 'ram', 'drive']);
  const [spins, setSpins] = useState(0);
  const [message, setMessage] = useState('Three screws pay 50x. Any three of a kind pay 10x. A pair gives your bet back.');
  const amount = toBet(bet);

  function spin() {
    if (!chips.take(amount)) return;
    const result = spinReels(rng);
    const won = slotPayout(result, amount);
    chips.give(won);
    setReels(result);
    setSpins((n) => n + 1);
    setMessage(won > 0 ? `+${won} chips` : 'No match. The house thanks you.');
    onChange();
  }

  return (
    <section className={styles.panel} aria-labelledby="slots-title">
      <h2 id="slots-title" className={styles.title}>
        Slots
      </h2>
      <div key={spins} className={`${styles.reels} ${spins ? styles.spun : ''}`} aria-live="polite">
        {reels.map((symbol, i) => (
          <span key={i} className={styles.reel}>
            <span className={styles.glyph} aria-hidden="true">
              {LOOK[symbol].glyph}
            </span>
            {LOOK[symbol].label}
          </span>
        ))}
      </div>
      <div className={styles.controls}>
        <BetField value={bet} onChange={setBet} />
        <button type="button" className={styles.button} onClick={spin} disabled={!chips.canBet(amount)}>
          Spin
        </button>
      </div>
      <p className={styles.lcd}>{message}</p>
    </section>
  );
}
