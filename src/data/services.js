// Services page: how the self-hosted platform works, and what is live on it.
// Public names only: no IPs, internal hostnames or admin URLs.
// monitorId links a row to its Uptime Kuma monitor (rows without one show no LED).

export const RELEASE_FLOW = [
  { title: 'Run workflow', note: 'manual dispatch' },
  { title: 'GitHub Actions runner', note: 'inside the cluster' },
  { title: 'Harbor', note: 'Trivy image scan' },
  { title: 'git commit', note: 'new version' },
  { title: 'ArgoCD', note: 'rolls it out' },
];

export const VISITOR_FLOW = [
  { title: 'Cloudflare' },
  { title: 'Traefik', note: "Let's Encrypt via cert-manager" },
  { title: 'k3s · 2 nodes', note: 'Rancher · NVIDIA GPU · 2 replicas per site' },
];

export const LIVE_SERVICES = [
  { name: 'waldhauser.sk', href: 'https://waldhauser.sk', monitorId: 2, note: 'this site' },
  { name: 'Metrics API', href: 'https://metrics.waldhauser.sk', monitorId: 9, note: 'Prometheus + Uptime Kuma proxy' },
  // TODO(Jozef): add an Uptime Kuma monitor for rrautodoprava.sk, then set its monitorId here.
  { name: 'rrautodoprava.sk', href: 'https://rrautodoprava.sk', note: 'Astro site' },
  { name: 'ERPNext', href: 'https://erp.waldhauser.sk', monitorId: 10, note: 'landing page' },
  { name: 'ERPNext tenant 1', href: 'https://tenant1.erp.waldhauser.sk', monitorId: 11, note: 'demo tenant' },
  { name: 'ERPNext tenant 2', href: 'https://tenant2.erp.waldhauser.sk', monitorId: 12, note: 'demo tenant' },
  { name: 'ERPNext tenant 3', href: 'https://tenant3.erp.waldhauser.sk', monitorId: 13, note: 'demo tenant' },
  { name: 'CDN', href: 'https://cdn.waldhauser.sk', monitorId: 8, note: 'static assets' },
  { name: 'Status page', href: 'https://monitoring.waldoserver.top/status/waldhauser-services', note: 'Uptime Kuma' },
];
