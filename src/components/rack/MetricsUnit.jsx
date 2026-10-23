import { useMetrics } from '../../hooks/useMetrics.js';
import Gauge from './Gauge.jsx';
import styles from './MetricsUnit.module.css';

// Pure view, so it can be tested without network.
export function MetricsView({ nodes, error }) {
  if (error) return <p className={styles.state}>Error: {error}</p>;
  if (!nodes) return <p className={styles.state}>Loading...</p>;
  if (!nodes.length) return <p className={styles.state}>No metrics available</p>;

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
  return (
    <div className={styles.panel}>
      <span className={styles.title}>Cluster metrics:</span>
      <MetricsView nodes={nodes} error={error} />
    </div>
  );
}
