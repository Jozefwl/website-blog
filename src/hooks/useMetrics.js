import { useEffect, useState } from 'react';
import { METRICS_URL } from '../config.js';
import { fetchMetrics, normalizeNodes } from '../lib/metrics.js';

// Cluster CPU/RAM from the backend. One request on mount, like the old site.
export function useMetrics(url = METRICS_URL) {
  const [state, setState] = useState({ nodes: null, error: null });

  useEffect(() => {
    let active = true;
    fetchMetrics(url)
      .then((data) => active && setState({ nodes: normalizeNodes(data), error: null }))
      .catch((error) => active && setState({ nodes: null, error: error.message }));
    return () => {
      active = false;
    };
  }, [url]);

  return state;
}
