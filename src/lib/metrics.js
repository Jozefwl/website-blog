import { fetchJson } from './fetchJson.js';

export function fetchMetrics(url, options = {}) {
  return fetchJson(url, { ...options, errorMessage: 'Failed to fetch metrics' });
}

// Backend returns { nodes: [...] }. Older backends returned raw Prometheus
// { cpu: [...], memory: [...] }, so that shape is still supported.
export function normalizeNodes(metrics) {
  if (metrics?.nodes?.length) {
    return metrics.nodes;
  }

  const cpu = metrics?.cpu?.[0];
  const memory = metrics?.memory?.[0];
  if (!cpu) {
    return [];
  }

  return [
    {
      instance: cpu.metric?.instance ?? 'unknown',
      name: 'Server',
      cpu: parseFloat(cpu.value[1]),
      memory: memory ? parseFloat(memory.value[1]) : 0,
      cpuLabel: 'CPU',
      memLabel: 'RAM',
    },
  ];
}
