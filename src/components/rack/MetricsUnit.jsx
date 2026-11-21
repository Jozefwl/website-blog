import { useMetrics } from '../../hooks/useMetrics.js';
import { useLang } from '../../i18n/LanguageContext.jsx';
import Gauge from './Gauge.jsx';
import styles from './MetricsUnit.module.css';

// Pure view, so it can be tested without network.
export function MetricsView({ nodes, error }) {
  const { t } = useLang();
  if (error) return <p className={styles.state}>{t('rack.metricsError', { error })}</p>;
  if (!nodes) return <p className={styles.state}>{t('rack.metricsLoading')}</p>;
  if (!nodes.length) return <p className={styles.state}>{t('rack.metricsEmpty')}</p>;

  return (
    <div className={styles.grid}>
      {nodes.map((node) => (
        <div key={node.instance} className={styles.node}>
          <h4 className={styles.name}>{node.name}</h4>
          <div className={styles.gauges}>
            <Gauge value={node.cpu ?? 0} color="blue" label={node.cpuLabel} />
            <Gauge value={node.memory ?? 0} color="green" label={node.memLabel} />
          </div>
        </div>
      ))}
    </div>
  );
}

// 2U monitoring unit in the rack: live cluster CPU/RAM.
export default function MetricsUnit() {
  const { nodes, error } = useMetrics();
  const { t } = useLang();
  return (
    <div className={styles.panel}>
      <span className={styles.title}>{t('rack.metricsTitle')}</span>
      <MetricsView nodes={nodes} error={error} />
    </div>
  );
}
