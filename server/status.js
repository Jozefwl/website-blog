// Uptime Kuma status page -> small summary for the website's rack LEDs.
// Uptime Kuma sends no CORS headers, so the browser cannot call it directly;
// this backend fetches it and the website reads GET /status instead.
const axios = require('axios');

// Uptime Kuma heartbeat status codes.
const STATUS_NAMES = { 0: 'down', 1: 'up', 2: 'pending', 3: 'maintenance' };

function summarizeStatus(page, heartbeat) {
  const heartbeatList = heartbeat?.heartbeatList ?? {};
  const uptimeList = heartbeat?.uptimeList ?? {};
  const monitors = [];

  for (const group of page?.publicGroupList ?? []) {
    for (const monitor of group.monitorList ?? []) {
      const beats = heartbeatList[monitor.id] ?? heartbeatList[String(monitor.id)] ?? [];
      const last = beats[beats.length - 1];
      const uptime = uptimeList[`${monitor.id}_24`];

      monitors.push({
        id: monitor.id,
        name: monitor.name,
        group: group.name,
        type: monitor.type,
        status: STATUS_NAMES[last?.status] ?? 'unknown',
        uptime24h: typeof uptime === 'number' ? uptime : null,
      });
    }
  }

  return { monitors };
}

// Returns a function that fetches + summarizes, cached for `ttlMs`.
// Callers arriving while a request is running share that same request.
function createStatusFetcher({ baseUrl, slug, ttlMs = 30000, http = axios, now = Date.now }) {
  let cached = null;
  let cachedAt = 0;
  let inFlight = null;

  return async function getStatus() {
    if (cached && now() - cachedAt < ttlMs) {
      return cached;
    }
    if (inFlight) {
      return inFlight;
    }

    const options = { timeout: 5000 };
    inFlight = Promise.all([
      http.get(`${baseUrl}/api/status-page/${encodeURIComponent(slug)}`, options),
      http.get(`${baseUrl}/api/status-page/heartbeat/${encodeURIComponent(slug)}`, options),
    ])
      .then(([pageRes, heartbeatRes]) => {
        cached = { ...summarizeStatus(pageRes.data, heartbeatRes.data), updatedAt: new Date(now()).toISOString() };
        cachedAt = now();
        return cached;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  };
}

module.exports = { summarizeStatus, createStatusFetcher, STATUS_NAMES };
