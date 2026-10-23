// Backend (server/ folder). Override for local dev with VITE_BACKEND_URL=http://localhost:5000
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://metrics.waldhauser.sk';

export const METRICS_URL = `${BACKEND_URL}/metrics`;
export const STATUS_URL = `${BACKEND_URL}/status`;

// How often the rack LEDs refresh (the backend caches Uptime Kuma for 30 s).
export const STATUS_POLL_MS = 60_000;
