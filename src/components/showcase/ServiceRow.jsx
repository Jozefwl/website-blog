import { pick, useLang } from '../../i18n/LanguageContext.jsx';
import StatusLed from '../rack/StatusLed.jsx';
import styles from './ServiceRow.module.css';

// One live service as a 1U row: LED (only when monitored), name, note.
export default function ServiceRow({ service, status }) {
  const { lang } = useLang();
  const name = pick(service.name, lang);
  const monitored = service.monitorId != null;
  return (
    <li className={styles.row}>
      <span className={styles.ledSlot}>{monitored && <StatusLed status={status ?? 'unknown'} label={name} />}</span>
      <a className={styles.name} href={service.href} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
      {service.note && <span className={styles.note}>{pick(service.note, lang)}</span>}
    </li>
  );
}
