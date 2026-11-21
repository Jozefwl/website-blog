// Services page: how the self-hosted platform works, and what is live on it.
// Public names only: no IPs, internal hostnames or admin URLs.
// monitorId links a row to its Uptime Kuma monitor (rows without one show no LED).
// Translatable texts are { en, sk }; product names stay plain strings.

export const RELEASE_FLOW = [
  { title: { en: 'Run workflow', sk: 'Spustiť workflow' }, note: { en: 'manual dispatch', sk: 'manuálne spustenie' } },
  { title: 'GitHub Actions runner', note: { en: 'inside the cluster', sk: 'vnútri clustra' } },
  { title: 'Harbor', note: { en: 'Trivy image scan', sk: 'Trivy image scan' } },
  { title: 'git commit', note: { en: 'new version', sk: 'nová verzia' } },
  { title: 'ArgoCD', note: { en: 'rolls it out', sk: 'nasadí ju' } },
];

export const VISITOR_FLOW = [
  { title: 'Cloudflare' },
  { title: 'Traefik', note: { en: "Let's Encrypt via cert-manager", sk: "Let's Encrypt cez cert-manager" } },
  {
    title: { en: 'k3s · 2 nodes', sk: 'k3s · 2 nody' },
    note: { en: 'Rancher · NVIDIA GPU · 2 replicas per site', sk: 'Rancher · NVIDIA GPU · 2 repliky na stránku' },
  },
];

const DEMO_TENANT = { en: 'demo tenant', sk: 'demo tenant' };

export const LIVE_SERVICES = [
  { name: 'waldhauser.sk', href: 'https://waldhauser.sk', monitorId: 2, note: { en: 'this site', sk: 'táto stránka' } },
  {
    name: { en: 'Metrics API', sk: 'Metrics API' },
    href: 'https://metrics.waldhauser.sk',
    monitorId: 9,
    note: { en: 'Prometheus + Uptime Kuma proxy', sk: 'Prometheus + Uptime Kuma proxy' },
  },
  // TODO(Jozef): add an Uptime Kuma monitor for rrautodoprava.sk, then set its monitorId here.
  { name: 'rrautodoprava.sk', href: 'https://rrautodoprava.sk', note: { en: 'Astro site', sk: 'Astro stránka' } },
  { name: 'ERPNext', href: 'https://erp.waldhauser.sk', monitorId: 10, note: { en: 'landing page', sk: 'úvodná stránka' } },
  { name: 'ERPNext tenant 1', href: 'https://tenant1.erp.waldhauser.sk', monitorId: 11, note: DEMO_TENANT },
  { name: 'ERPNext tenant 2', href: 'https://tenant2.erp.waldhauser.sk', monitorId: 12, note: DEMO_TENANT },
  { name: 'ERPNext tenant 3', href: 'https://tenant3.erp.waldhauser.sk', monitorId: 13, note: DEMO_TENANT },
  { name: 'CDN', href: 'https://cdn.waldhauser.sk', monitorId: 8, note: { en: 'static assets', sk: 'statické súbory' } },
  {
    name: { en: 'Status page', sk: 'Status stránka' },
    href: 'https://monitoring.waldoserver.top/status/waldhauser-services',
    note: 'Uptime Kuma',
  },
];
