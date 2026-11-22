import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { flipCoin } from '../../lib/casino/coin.js';
import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './CoinFlip.module.css';

const FLIP_MS = 2200;

// Five-point star polygon around (cx, cy).
function star(cx, cy, r) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
  return star(100 + 83 * Math.cos(a), 100 + 83 * Math.sin(a), 6);
});

// Shared bimetal blank: silver outer ring, gold centre, milled edge.
function Blank({ id, children }) {
  return (
    <svg viewBox="0 0 200 200" className={styles.faceSvg}>
      <defs>
        <radialGradient id={`silver-${id}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#f4f5f7" />
          <stop offset="55%" stopColor="#c3c7cd" />
          <stop offset="100%" stopColor="#868c95" />
        </radialGradient>
        <radialGradient id={`gold-${id}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fbe7a6" />
          <stop offset="55%" stopColor="#d8ad4a" />
          <stop offset="100%" stopColor="#9c7420" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill={`url(#silver-${id})`} stroke="#6f757d" strokeWidth="2" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#7d838c" strokeWidth="2" strokeDasharray="1.5 2.5" />
      {STARS.map((points, i) => (
        <polygon key={i} points={points} fill="#8e949c" />
      ))}
      <circle cx="100" cy="100" r="66" fill={`url(#gold-${id})`} stroke="#8a6a1f" strokeWidth="2" />
      {children}
    </svg>
  );
}

// Heads: a double cross on three hills, like the Slovak national side.
function Heads() {
  return (
    <Blank id="heads">
      <g fill="#8a6a1f">
        <rect x="96" y="52" width="8" height="58" rx="1" />
        <rect x="84" y="62" width="32" height="7" rx="1" />
        <rect x="78" y="78" width="44" height="8" rx="1" />
        <path d="M60 128 Q74 104 88 120 Q100 98 112 120 Q126 104 140 128 Z" />
      </g>
      <path id="heads-arc" d="M48 100 A52 52 0 0 0 152 100" fill="none" />
      <text fontSize="11" fontWeight="700" letterSpacing="2" fill="#7a5c18" fontFamily="Arial, sans-serif">
        <textPath href="#heads-arc" startOffset="50%" textAnchor="middle">
          SLOVENSKO
        </textPath>
      </text>
    </Blank>
  );
}

// Tails: the value side, a big 2 and EURO.
function Tails() {
  return (
    <Blank id="tails">
      <text x="100" y="118" textAnchor="middle" fontSize="70" fontWeight="800" fill="#8a6a1f" fontFamily="Arial, sans-serif">
        2
      </text>
      <text x="100" y="140" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="3" fill="#7a5c18" fontFamily="Arial, sans-serif">
        EURO
      </text>
    </Blank>
  );
}

// Double or nothing: pick heads or tails, the 2 € coin flips, and the win doubles or goes.
// `onSettle(won)` is called once, when the result is shown.
export default function CoinFlip({ amount, rng, onSettle, onClose }) {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  const [step, setStep] = useState('pick'); // pick | flipping | done
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState(null);
  const dialogRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();
    return () => clearTimeout(timer.current);
  }, []);

  function reveal(side, picked) {
    setStep('done');
    onSettle(side === picked);
  }

  function pick(side) {
    const landed = flipCoin(rng);
    setChoice(side);
    setResult(landed);
    if (reduceMotion) {
      reveal(landed, side);
      return;
    }
    setStep('flipping');
    timer.current = setTimeout(() => reveal(landed, side), FLIP_MS);
  }

  const close = () => step !== 'flipping' && onClose();
  const sideName = (side) => t(`casino.double.${side}`).toLowerCase();
  const won = step === 'done' && result === choice;

  let status = t('casino.double.pick');
  if (step === 'flipping') status = t('casino.double.flipping');
  if (step === 'done') {
    status = t(won ? 'casino.double.won' : 'casino.double.lost', { side: sideName(result), amount });
  }

  // Rest on the side that came up; while flipping spin 5 turns (+ half a turn for tails).
  const endDeg = result === 'tails' ? 180 : 0;

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coinflip-title"
        tabIndex={-1}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      >
        <h2 id="coinflip-title" className={styles.title}>
          {t('casino.double.title')}
        </h2>
        <p className={styles.stake}>{t('casino.double.stake', { amount })}</p>

        <div className={styles.stage}>
          <div
            className={`${styles.coin} ${step === 'flipping' ? styles.flipping : ''}`}
            style={{ '--end': `${1800 + endDeg}deg`, transform: step === 'flipping' ? undefined : `rotateY(${endDeg}deg)` }}
            role="img"
            aria-label={t('casino.double.coin')}
          >
            <span className={styles.face}>
              <Heads />
            </span>
            <span className={`${styles.face} ${styles.back}`}>
              <Tails />
            </span>
          </div>
        </div>

        <p className={`${styles.status} ${step === 'done' ? (won ? styles.win : styles.lose) : ''}`} role="status">
          {status}
        </p>

        <div className={styles.actions}>
          {step === 'pick' && (
            <>
              <button type="button" className={styles.choice} onClick={() => pick('heads')}>
                {t('casino.double.heads')}
              </button>
              <button type="button" className={styles.choice} onClick={() => pick('tails')}>
                {t('casino.double.tails')}
              </button>
            </>
          )}
          {step !== 'flipping' && (
            <button type="button" className={styles.close} onClick={close}>
              {t('casino.double.close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
