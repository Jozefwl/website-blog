import { fetchJson } from './fetchJson.js';

// Possible LED states. 'unknown' = no data (backend or Uptime Kuma unreachable).
export const STATUSES = ['up', 'down', 'pending', 'maintenance', 'unknown'];

export function fetchStatus(url, options = {}) {
  return fetchJson(url, { ...options, errorMessage: 'Failed to fetch status' });
}

// Turn a rack unit's monitor list into LEDs, using the backend /status summary.
// A monitor missing from the summary (renamed/removed in Uptime Kuma) shows 'unknown'.
export function ledsForUnit(unit, summary) {
  const byId = new Map((summary?.monitors ?? []).map((m) => [m.id, m]));
  return unit.monitors.map(({ id, label }) => {
    const status = byId.get(id)?.status;
    return { id, label, status: STATUSES.includes(status) ? status : 'unknown' };
  });
}
