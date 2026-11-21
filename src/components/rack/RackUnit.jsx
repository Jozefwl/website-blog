import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { HEADER_VT_NAME, TIMING, activeTransition, isPlainLeftClick, runViewTransition, skipOnNextPress } from '../../lib/transitions.js';
import StatusLed from './StatusLed.jsx';
import ChassisBox from './ChassisBox.jsx';
import RackEar from './RackEar.jsx';
import styles from './Rack.module.css';

// How far the server slides out of the rack (px, along the Z axis toward the viewer).
const SLIDE_OUT_PX = 160;
// Safety net: finish even if an animation-complete callback never fires.
const FALLBACK_EXTRA_MS = 500;
// Drive bays on the front; monitors fill the first bays, the rest are blank caddies.
const DRIVE_BAYS = 8;
const EASE = [0.25, 0.1, 0.2, 1];

const drawer = {
  closed: { z: 0 },
  open: { z: SLIDE_OUT_PX },
};

// A clickable 1U server.
// Click -> it slides out on its rails -> the faceplate morphs into the page header (view transition).
// startOpen: we just came back from this unit's page; start pulled out, then push it in.
// autoOpen: open without a click (second half of a navbar hop); replaces the history entry.
// busyRef: shared by all units so only one can open at a time.
// skipRef: shared; set when the visitor skips a push-in, so the following auto-open skips too.
export default function RackUnit({ unit, leds, startOpen = false, autoOpen = false, fastClose = false, onClosed, busyRef, skipRef }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const localBusy = useRef(false);
  const busy = busyRef ?? localBusy;
  const navigated = useRef(false);
  const closed = useRef(false);
  // closed | opening | parked (pulled out, waiting for the morph) | closing
  const [phase, setPhase] = useState(startOpen && !reduceMotion ? 'parked' : 'closed');
  const [named, setNamed] = useState(startOpen && !reduceMotion);

  function go() {
    if (navigated.current) return;
    navigated.current = true;
    flushSync(() => setNamed(true));
    const transition = runViewTransition(() =>
      flushSync(() => navigate(unit.to, { state: { from: '/' }, replace: autoOpen })),
    );
    skipOnNextPress(transition);
  }

  function open() {
    if (phase === 'opening') {
      go(); // second click skips the slide
      return;
    }
    if (busy.current || navigated.current) return;
    busy.current = true;
    if (reduceMotion) {
      go();
      return;
    }
    setPhase('opening');
  }

  // While the drawer moves: a safety-net timer, and a press anywhere skips to the end.
  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return undefined;
    const opening = phase === 'opening';
    const seconds = opening ? TIMING.slideOutS : fastClose ? TIMING.hopSlideInS : TIMING.slideInS;
    const finish = opening ? go : finishClosing;
    const skip = () => {
      if (!opening && skipRef) skipRef.current = true; // the next drawer opens without sliding too
      finish();
    };
    const id = setTimeout(finish, seconds * 1000 + FALLBACK_EXTRA_MS);
    window.addEventListener('pointerdown', skip, { capture: true, once: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener('pointerdown', skip, { capture: true });
    };
  }, [phase]); // go/finishClosing only read refs and props

  // Coming back: wait for the header -> faceplate morph, then push the drawer in.
  useEffect(() => {
    if (!startOpen) return undefined;
    if (reduceMotion) {
      finishClosing();
      return undefined;
    }
    let cancelled = false;
    activeTransition().then(() => {
      if (cancelled) return;
      setNamed(false);
      setPhase('closing');
    });
    return () => {
      cancelled = true;
    };
  }, []); // runs once on mount

  function finishClosing() {
    if (closed.current) return;
    closed.current = true;
    setPhase('closed');
    onClosed?.();
  }

  // Second half of a navbar hop. Deferred out of the effect so go()'s flushSync is legal.
  useEffect(() => {
    if (!autoOpen) return;
    queueMicrotask(() => {
      if (skipRef?.current) {
        busy.current = true;
        go(); // the visitor already skipped the push-in: skip the slide-out too
      } else {
        open();
      }
    });
  }, [autoOpen]); // open() reads current state

  function onClick(event) {
    // Ctrl/Cmd/Shift/Alt-click: let the browser open a new tab or window.
    if (event.type === 'click' && !isPlainLeftClick(event)) return;
    event.preventDefault();
    open();
  }

  function onKeyDown(event) {
    // Links react to Enter by default; Space should work too, like a button.
    if (event.key === ' ') onClick(event);
  }

  function onAnimationComplete(name) {
    if (name === 'open' && phase === 'opening') go();
    if (name === 'closed' && phase === 'closing') finishClosing();
  }

  const opening = phase === 'opening';
  const target = phase === 'opening' || phase === 'parked' ? 'open' : 'closed';
  const duration = phase === 'closing' ? (fastClose ? TIMING.hopSlideInS : TIMING.slideInS) : TIMING.slideOutS;
  const downCount = leds.filter((l) => l.status === 'down').length;
  const fillers = Math.max(0, DRIVE_BAYS - leds.length);

  return (
    <div className={`${styles.slot} ${styles.u1} ${styles.serverSlot}`} data-opening={opening || undefined}>
      <motion.div
        className={styles.drawer}
        variants={drawer}
        initial={phase === 'parked' ? 'open' : 'closed'}
        animate={target}
        transition={{ duration, ease: EASE }}
        onAnimationComplete={onAnimationComplete}
      >
        {/* Inner wrapper lifts the server a little on hover (CSS), separate from the slide (Motion). */}
        <div className={styles.hoverLift}>
          <ChassisBox label={unit.title} />
          <Link
            to={unit.to}
            onClick={onClick}
            onKeyDown={onKeyDown}
            className={`${styles.faceplate} ${styles.server} ${styles.clickable}`}
            style={named ? { viewTransitionName: HEADER_VT_NAME } : undefined}
            aria-label={`Open ${unit.title}${downCount ? ` (${downCount} service down)` : ''}`}
            data-opening={opening || undefined}
          >
            <RackEar />
            <span className={styles.bezel}>
              <span className={styles.controls} aria-hidden="true">
                <span className={styles.powerButton} />
                <span className={styles.pullTag}>{unit.tag}</span>
              </span>

              <span className={styles.label}>
                <span className={styles.unitTitle}>{unit.title}</span>
                <span className={styles.caption}>$ {unit.caption}</span>
              </span>

              <span className={styles.bays}>
                {leds.map((led) => (
                  <span key={led.id} className={styles.caddy}>
                    <span className={styles.latch} aria-hidden="true" />
                    <span className={styles.bayLabel} aria-hidden="true">
                      {led.label}
                    </span>
                    <StatusLed status={led.status} label={led.label} />
                  </span>
                ))}
                {Array.from({ length: fillers }, (_, i) => (
                  <span key={`blank-${i}`} className={`${styles.caddy} ${styles.caddyBlank}`} aria-hidden="true">
                    <span className={styles.latch} />
                  </span>
                ))}
              </span>

              <span className={styles.grille} aria-hidden="true" />
            </span>
            <RackEar />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
