import { useEffect, useState } from 'react';
import { STATUS_POLL_MS, STATUS_URL } from '../config.js';
import { fetchStatus } from '../lib/status.js';

// Uptime Kuma summary via the backend's /status route, polled.
// Keeps the last good summary if one poll fails.
export function useServiceStatus({ url = STATUS_URL, intervalMs = STATUS_POLL_MS } = {}) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const data = await fetchStatus(url);
        if (active) {
          setSummary(data);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    poll();
    const id = setInterval(poll, intervalMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [url, intervalMs]);

  return { summary, error };
}
