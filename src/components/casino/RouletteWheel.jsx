import { useEffect, useRef } from 'react';
import { POCKET_DEG, WHEEL_ORDER, colorOf, pocketAngle } from '../../lib/casino/roulette.js';
import { ballPosition, planBallPath } from '../../lib/casino/wheelMotion.js';
import styles from './casino.module.css';

const COLORS = { red: '#c0262d', black: '#16181d', green: '#13803c' };
const R_OUTER = 96; // wooden rim
const R_TRACK = 86; // where the ball runs
const R_POCKET_OUT = 78;
const R_POCKET_IN = 56;
const R_BALL_REST = 64; // ball sitting in a pocket

// Angle 0 = top, clockwise (like a clock).
const point = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
};

function wedge(i) {
  const a0 = i * POCKET_DEG - POCKET_DEG / 2;
  const a1 = a0 + POCKET_DEG;
  const [x0, y0] = point(a0, R_POCKET_OUT);
  const [x1, y1] = point(a1, R_POCKET_OUT);
  const [x2, y2] = point(a1, R_POCKET_IN);
  const [x3, y3] = point(a0, R_POCKET_IN);
  return `M${x0},${y0} A${R_POCKET_OUT},${R_POCKET_OUT} 0 0 1 ${x1},${y1} L${x2},${y2} A${R_POCKET_IN},${R_POCKET_IN} 0 0 0 ${x3},${y3}Z`;
}

// The wheel spins clockwise; the ball runs the other way, drops, hops over a few dividers and
// rolls into the winning pocket (see lib/casino/wheelMotion.js). The snap on `settled` is only a
// safety net for dropped frames. `spin` = { result, durationMs } (durationMs 0 = no animation).
export default function RouletteWheel({ spin, settled, label = 'Roulette wheel' }) {
  const wheelRef = useRef(null);
  const ballRef = useRef(null);
  const angles = useRef({ wheel: 0, ball: 0 });
  const final = useRef(null);
  const frame = useRef(0);

  function place(wheelDeg, ballDeg, r) {
    wheelRef.current?.setAttribute('transform', `rotate(${wheelDeg})`);
    const [x, y] = point(ballDeg, r);
    ballRef.current?.setAttribute('cx', x);
    ballRef.current?.setAttribute('cy', y);
  }

  useEffect(() => {
    if (!spin) return undefined;
    const { result, durationMs } = spin;
    const start = angles.current;
    if (!durationMs) {
      final.current = { wheel: start.wheel, ball: start.wheel + pocketAngle(result) };
      return undefined;
    }
    const plan = planBallPath({ result, start, rng: Math.random, track: R_TRACK, rest: R_BALL_REST });
    const end = ballPosition(plan, 1);
    final.current = { wheel: end.wheel % 360, ball: end.ball % 360 };

    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / durationMs);
      const pos = ballPosition(plan, t);
      place(pos.wheel, pos.ball, pos.r);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [spin]);

  useEffect(() => {
    if (!settled || !final.current) return;
    cancelAnimationFrame(frame.current);
    angles.current = final.current;
    place(final.current.wheel, final.current.ball, R_BALL_REST);
  }, [settled, spin]);

  return (
    <svg className={styles.wheel} viewBox="-100 -100 200 200" role="img" aria-label={label}>
      <circle r={R_OUTER} fill="#5a3418" stroke="#2a170a" strokeWidth="3" />
      <circle r={R_TRACK + 6} fill="#20242c" />
      <circle r={R_TRACK - 6} fill="#2b3039" />
      <g ref={wheelRef}>
        {WHEEL_ORDER.map((n, i) => (
          <g key={n}>
            <path d={wedge(i)} fill={COLORS[colorOf(n)]} stroke="#c9a24a" strokeWidth="0.6" />
            <text
              x="0"
              y={-(R_POCKET_OUT - 8)}
              transform={`rotate(${i * POCKET_DEG})`}
              textAnchor="middle"
              fontSize="7"
              fill="#fff"
              fontFamily="var(--font-mono)"
            >
              {n}
            </text>
          </g>
        ))}
        <circle r={R_POCKET_IN} fill="#3a2414" stroke="#c9a24a" strokeWidth="1" />
        <circle r="20" fill="#c9a24a" />
        <path d="M0,-34 L0,34 M-34,0 L34,0" stroke="#c9a24a" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M-5,-99 L5,-99 L0,-88Z" fill="#facc15" />
      <circle
        ref={ballRef}
        data-testid="ball"
        data-pocket={settled && spin ? spin.result : undefined}
        r="4.5"
        cx="0"
        cy={-R_TRACK}
        fill="#f4f4f5"
        stroke="#9ca3af"
        strokeWidth="0.8"
      />
    </svg>
  );
}
