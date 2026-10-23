import { useNow } from '../../hooks/useNow.js';
import { isoWeek } from '../../lib/isoWeek.js';
import styles from './LcdClock.module.css';

// Pure display: week / date / time in UTC (same text as the old home page infobox).
export function LcdDisplay({ now }) {
  const [date, time] = now.toISOString().split('T');
  return (
    <div className={styles.lcd} aria-live="off">
      <p className={styles.line}>{`It is week ${isoWeek(now)} of the year ${now.getFullYear()}.`}</p>
      <p className={styles.line}>{`Date: ${date}`}</p>
      <p className={styles.line}>{`Time: ${time}`}</p>
    </div>
  );
}

// Top 1U panel of the rack: a live LCD refreshed every 50 ms.
export default function LcdClock() {
  const now = useNow(50);
  return (
    <div className={styles.panel}>
      <span className={styles.title}>MAIN SERVER RACK</span>
      <LcdDisplay now={now} />
    </div>
  );
}
