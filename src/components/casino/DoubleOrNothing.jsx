import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './casino.module.css';

// The offer shown under a win: "Double or nothing?  [Yes] [No]".
export default function DoubleOrNothing({ onAccept, onDecline }) {
  const { t } = useLang();
  return (
    <div className={styles.double}>
      <span>{t('casino.double.offer')}</span>
      <button type="button" className={`${styles.button} ${styles.gold}`} onClick={onAccept}>
        {t('casino.double.yes')}
      </button>
      <button type="button" className={styles.button} onClick={onDecline}>
        {t('casino.double.no')}
      </button>
    </div>
  );
}
