import { RACK_UNITS } from '../../data/rackUnits.js';
import { useServiceStatus } from '../../hooks/useServiceStatus.js';
import { ledsForUnit } from '../../lib/status.js';
import LcdClock from './LcdClock.jsx';
import MetricsUnit from './MetricsUnit.jsx';
import RackPanel from './RackPanel.jsx';
import RackUnit from './RackUnit.jsx';
import styles from './Rack.module.css';

// The homepage server rack: LCD on top, 4 clickable units, metrics unit, serial label.
// `summary` can be passed in (tests); otherwise it is polled from the backend.
export function RackView({ summary, statusError }) {
  return (
    <div className={styles.cabinet}>
      <div className={styles.crown}>
        <span className={styles.brand}>WALDHAUSER.SK</span>
        <span className={styles.statusText} role="status">
          {statusError && !summary ? 'status: offline' : summary ? 'status: live' : 'status: …'}
        </span>
      </div>

      <div className={styles.rails}>
        <RackPanel>
          <LcdClock />
        </RackPanel>

        {RACK_UNITS.map((unit) => (
          <RackUnit key={unit.id} unit={unit} leds={ledsForUnit(unit, summary)} />
        ))}

        <RackPanel size={2}>
          <MetricsUnit />
        </RackPanel>

        <div className={styles.blank} aria-hidden="true" />
      </div>

      <div className={styles.plinth}>
        <span className={styles.serial}>S/N WLD-{new Date().getFullYear()} · v{__APP_VERSION__}</span>
      </div>
    </div>
  );
}

export default function Rack() {
  const { summary, error } = useServiceStatus();
  return <RackView summary={summary} statusError={error} />;
}
