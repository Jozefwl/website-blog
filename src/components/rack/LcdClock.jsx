import { useNow } from '../../hooks/useNow.js';
import { isoWeek } from '../../lib/isoWeek.js';
import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './LcdClock.module.css';

// Pure display: week / date / time in UTC (same text as the old home page infobox).
export function LcdDisplay({ now }) {
  const { t } = useLang();
  const [date, time] = now.toISOString().split('T');
  return (
    <div className={styles.lcd} aria-live="off">
      <p className={styles.line}>{t('rack.week', { week: isoWeek(now), year: now.getFullYear() })}</p>
      <p className={styles.line}>{t('rack.date', { date })}</p>
      <p className={styles.line}>{t('rack.time', { time })}</p>
    </div>
  );
}

// Top 1U panel of the rack: a live LCD refreshed every 50 ms.
export default function LcdClock() {
  const now = useNow(50);
  const { t } = useLang();
  return (
    <div className={styles.panel}>
      <span className={styles.title}>{t('rack.lcdTitle')}</span>
      <LcdDisplay now={now} />
    </div>
  );
}
