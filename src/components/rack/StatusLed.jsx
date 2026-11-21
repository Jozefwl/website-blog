import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './StatusLed.module.css';

// One status LED. Colour comes from data-status; the state is also in the
// accessible name and tooltip, so it never relies on colour alone.
export default function StatusLed({ status = 'unknown', label }) {
  const { t } = useLang();
  const text = `${label}: ${t(`led.${status}`)}`;
  return <span className={styles.led} data-status={status} role="img" aria-label={text} title={text} />;
}
