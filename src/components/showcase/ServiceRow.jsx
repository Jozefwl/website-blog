import StatusLed from '../rack/StatusLed.jsx';
import styles from './ServiceRow.module.css';

// One live service as a 1U row: LED (only when monitored), name, note.
export default function ServiceRow({ service, status }) {
  const monitored = service.monitorId != null;
  return (
    <li className={styles.row}>
      <span className={styles.ledSlot}>{monitored && <StatusLed status={status ?? 'unknown'} label={service.name} />}</span>
      <a className={styles.name} href={service.href} target="_blank" rel="noopener noreferrer">
        {service.name}
      </a>
      {service.note && <span className={styles.note}>{service.note}</span>}
    </li>
  );
}
