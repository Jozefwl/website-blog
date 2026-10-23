import LinkCard from '../components/common/LinkCard.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Socials from '../components/layout/Socials.jsx';
import { ICON_CREDITS, SERVICE_GROUPS } from '../data/services.js';
import { useServiceStatus } from '../hooks/useServiceStatus.js';
import styles from './Page.module.css';

// Pure view (testable without network). `summary` = backend /status response or null.
export function ServicesView({ summary }) {
  const statusById = new Map((summary?.monitors ?? []).map((m) => [m.id, m.status]));

  return (
    <>
      <PageHeader tag="U3" title="Links/Services" />

      {SERVICE_GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.stack}>
            {group.items.map((item) => (
              <LinkCard
                key={item.link}
                {...item}
                status={item.monitorId ? (statusById.get(item.monitorId) ?? 'unknown') : undefined}
              />
            ))}
          </div>
        </section>
      ))}

      <div className={styles.credits}>
        {ICON_CREDITS.map((credit) => (
          <a key={credit.href} href={credit.href} title={credit.title}>
            {credit.text}
          </a>
        ))}
      </div>

      <Socials />
    </>
  );
}

export default function Services() {
  const { summary } = useServiceStatus();
  return <ServicesView summary={summary} />;
}
