import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import StatusLed from './StatusLed.jsx';
import ChassisBox from './ChassisBox.jsx';
import styles from './Rack.module.css';

const OPEN_DURATION_S = 0.7;
// How far the server slides out of the rack (px, along the Z axis toward the viewer).
const SLIDE_OUT_PX = 160;
// Safety net: navigate even if the animation-complete callback never fires.
const FALLBACK_MS = 1000;

const drawer = {
  closed: { z: 0 },
  open: { z: SLIDE_OUT_PX },
};

// A clickable rack server. Click -> it slides out on its rails -> navigate to its page.
export default function RackUnit({ unit, leds }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const navigated = useRef(false);

  function go() {
    if (navigated.current) return;
    navigated.current = true;
    navigate(unit.to);
  }

  useEffect(() => {
    if (!opening) return undefined;
    const id = setTimeout(go, FALLBACK_MS);
    return () => clearTimeout(id);
  }, [opening]); // `go` only reads a ref and unit.to

  function open(event) {
    event.preventDefault();
    if (opening || navigated.current) return;
    if (reduceMotion) {
      go();
      return;
    }
    setOpening(true);
  }

  function onKeyDown(event) {
    // Links react to Enter by default; Space should work too, like a button.
    if (event.key === ' ') open(event);
  }

  const downCount = leds.filter((l) => l.status === 'down').length;

  return (
    <div className={`${styles.slot} ${styles.u1}`} data-opening={opening || undefined}>
      <motion.div
        className={styles.drawer}
        variants={drawer}
        initial="closed"
        animate={opening ? 'open' : 'closed'}
        transition={{ duration: OPEN_DURATION_S, ease: [0.25, 0.1, 0.2, 1] }}
        onAnimationComplete={(name) => name === 'open' && go()}
      >
        {/* Inner wrapper lifts the server a little on hover (CSS), separate from the slide (Motion). */}
        <div className={styles.hoverLift}>
          <ChassisBox label={unit.title} />
          <Link
            to={unit.to}
            onClick={open}
            onKeyDown={onKeyDown}
            className={`${styles.faceplate} ${styles.clickable}`}
            aria-label={`Open ${unit.title}${downCount ? ` (${downCount} service down)` : ''}`}
            data-opening={opening || undefined}
          >
            <span className={styles.ear} aria-hidden="true" />
            <span className={styles.body}>
              <span className={styles.tag}>{unit.tag}</span>
              <span className={styles.label}>
                <span className={styles.unitTitle}>{unit.title}</span>
                <span className={styles.caption}>$ {unit.caption}</span>
              </span>
              <span className={styles.vents} aria-hidden="true" />
              <span className={styles.leds}>
                {leds.map((led) => (
                  <span key={led.id} className={styles.ledCell}>
                    <StatusLed status={led.status} label={led.label} />
                    <span className={styles.ledLabel} aria-hidden="true">
                      {led.label}
                    </span>
                  </span>
                ))}
              </span>
              <span className={styles.handle} aria-hidden="true" />
            </span>
            <span className={styles.ear} aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
