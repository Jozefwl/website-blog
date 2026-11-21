import PageHeader from '../components/common/PageHeader.jsx';
import Socials from '../components/layout/Socials.jsx';
import FlowDiagram from '../components/showcase/FlowDiagram.jsx';
import ServiceRow from '../components/showcase/ServiceRow.jsx';
import { LIVE_SERVICES, RELEASE_FLOW, VISITOR_FLOW } from '../data/services.js';
import { useServiceStatus } from '../hooks/useServiceStatus.js';
import styles from './Services.module.css';

// Pure view (testable without network). `summary` = backend /status response or null.
export function ServicesView({ summary }) {
  const statusById = new Map((summary?.monitors ?? []).map((m) => [m.id, m.status]));

  return (
    <>
      <PageHeader tag="U3" title="Links/Services" subtitle="What runs on my own hardware, and how it gets there." />

      <FlowDiagram title="How a release ships" steps={RELEASE_FLOW} />
      <FlowDiagram title="What a visitor hits" steps={VISITOR_FLOW} />

      <section className={styles.section}>
        <h2 className={styles.title}>Live</h2>
        <ul className={styles.rows}>
          {LIVE_SERVICES.map((service) => (
            <ServiceRow key={service.href} service={service} status={statusById.get(service.monitorId)} />
          ))}
        </ul>
      </section>

      <Socials />
    </>
  );
}

export default function Services() {
  const { summary } = useServiceStatus();
  return <ServicesView summary={summary} />;
}
