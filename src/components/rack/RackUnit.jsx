import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import StatusLed from './StatusLed.jsx';
import ChassisBox from './ChassisBox.jsx';
import RackEar from './RackEar.jsx';
import styles from './Rack.module.css';

const OPEN_DURATION_S = 0.7;
// How far the server slides out of the rack (px, along the Z axis toward the viewer).
const SLIDE_OUT_PX = 160;
// Safety net: navigate even if the animation-complete callback never fires.
const FALLBACK_MS = 1000;
// Drive bays on the front; monitors fill the first bays, the rest are blank caddies.
const DRIVE_BAYS = 8;

const drawer = {
  closed: { z: 0 },
  open: { z: SLIDE_OUT_PX },
};

// A clickable 1U server. Click -> it slides out on its rails -> navigate to its page.
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
  const fillers = Math.max(0, DRIVE_BAYS - leds.length);

  return (
    <div className={`${styles.slot} ${styles.u1} ${styles.serverSlot}`} data-opening={opening || undefined}>
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
            className={`${styles.faceplate} ${styles.server} ${styles.clickable}`}
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
