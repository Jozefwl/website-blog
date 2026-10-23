import { RACK_UNITS } from '../../data/rackUnits.js';
import { useServiceStatus } from '../../hooks/useServiceStatus.js';
import { ledsForUnit } from '../../lib/status.js';
import LcdClock from './LcdClock.jsx';
import MetricsUnit from './MetricsUnit.jsx';
import RackPanel from './RackPanel.jsx';
import RackUnit from './RackUnit.jsx';
import styles from './Rack.module.css';

// 13U cabinet. Sizes follow the 19" rack standard (EIA-310): 1U = 44.45 mm,
// equipment panels 482.6 mm wide; cabinet 600 mm wide like common server racks.
const TOTAL_U = 13;
const U_NUMBERS = Array.from({ length: TOTAL_U }, (_, i) => TOTAL_U - i);

// The homepage server rack, drawn with CSS 3D transforms.
// `summary` can be passed in (tests); otherwise it is polled from the backend.
export function RackView({ summary, statusError }) {
  return (
    <div className={styles.scene}>
      <div className={styles.cabinet}>
        {/* Cabinet shell: back wall (with a power strip), sides, roof, floor. */}
        <span className={`${styles.face} ${styles.cabBack}`} aria-hidden="true">
          <span className={styles.pdu} />
        </span>
        <span className={`${styles.face} ${styles.cabLeft}`} aria-hidden="true" />
        <span className={`${styles.face} ${styles.cabRight}`} aria-hidden="true" />
        <span className={`${styles.face} ${styles.cabTop}`} aria-hidden="true" />
        <span className={`${styles.face} ${styles.cabBottom}`} aria-hidden="true" />

        <div className={styles.header}>
          <span className={styles.brand}>WALDHAUSER.SK</span>
          <span className={styles.statusText} role="status">
            {statusError && !summary ? 'status: offline' : summary ? 'status: live' : 'status: …'}
          </span>
        </div>

        <div className={styles.frame}>
          {/* Side bars of the front frame with printed U numbers. */}
          <span className={`${styles.sideBar} ${styles.sideBarLeft}`} aria-hidden="true">
            {U_NUMBERS.map((n) => (
              <span key={n} className={styles.uNumber}>
                {n}
              </span>
            ))}
          </span>
          <span className={`${styles.sideBar} ${styles.sideBarRight}`} aria-hidden="true">
            {U_NUMBERS.map((n) => (
              <span key={n} className={styles.uNumber}>
                {n}
              </span>
            ))}
          </span>

          {/* Square-hole mounting rails (3 holes per U). */}
          <span className={`${styles.rail} ${styles.railLeft}`} aria-hidden="true" />
          <span className={`${styles.rail} ${styles.railRight}`} aria-hidden="true" />

          <div className={styles.bay}>
            <RackPanel u={1} variant="blank" />
            <RackPanel u={2} variant="console">
              <LcdClock />
            </RackPanel>

            {RACK_UNITS.map((unit) => (
              <RackUnit key={unit.id} unit={unit} leds={ledsForUnit(unit, summary)} />
            ))}

            <RackPanel u={4} variant="appliance">
              <MetricsUnit />
            </RackPanel>
            <RackPanel u={1} variant="blank" />
            <RackPanel u={1} variant="brush" />
          </div>
        </div>

        <div className={styles.plinth}>
          <span className={styles.foot} aria-hidden="true" />
          <span className={styles.serial}>S/N WLD-{new Date().getFullYear()} · v{__APP_VERSION__}</span>
          <span className={styles.foot} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.floorShadow} aria-hidden="true" />
    </div>
  );
}

export default function Rack() {
  const { summary, error } = useServiceStatus();
  return <RackView summary={summary} statusError={error} />;
}
