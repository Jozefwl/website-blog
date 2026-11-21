// Services page: how the self-hosted platform works, and what is live on it.
// Public names only: no IPs, internal hostnames or admin URLs.
// monitorId links a row to its Uptime Kuma monitor (rows without one show no LED).
// Translatable texts are { en, sk }; product names stay plain strings.

export const RELEASE_FLOW = [
  { title: { en: 'Run workflow', sk: 'Spustenie workflowu' }, note: { en: 'manual dispatch', sk: 'ručne' } },
  { title: 'GitHub Actions runner', note: { en: 'inside the cluster', sk: 'v clustri' } },
  { title: 'Harbor', note: { en: 'Trivy image scan', sk: 'kontrola obrazu cez Trivy' } },
  { title: 'git commit', note: { en: 'new version', sk: 'nová verzia' } },
  { title: 'ArgoCD', note: { en: 'rolls it out', sk: 'nasadí ju' } },
];

export const VISITOR_FLOW = [
  { title: 'Cloudflare' },
  { title: 'Traefik', note: { en: "Let's Encrypt via cert-manager", sk: "Let's Encrypt cez cert-manager" } },
  {
    title: { en: 'k3s · 2 nodes', sk: 'k3s · 2 uzly' },
    note: { en: 'Rancher · NVIDIA GPU · 2 replicas per site', sk: 'Rancher · NVIDIA GPU · 2 repliky na web' },
  },
];

const DEMO_TENANT = { en: 'demo tenant', sk: 'ukážkový tenant' };

export const LIVE_SERVICES = [
  { name: 'waldhauser.sk', href: 'https://waldhauser.sk', monitorId: 2, note: { en: 'this site', sk: 'tento web' } },
  {
    name: { en: 'Metrics API', sk: 'API s metrikami' },
    href: 'https://metrics.waldhauser.sk',
    monitorId: 9,
    note: { en: 'Prometheus + Uptime Kuma proxy', sk: 'proxy pre Prometheus a Uptime Kuma' },
  },
  // TODO(Jozef): add an Uptime Kuma monitor for rrautodoprava.sk, then set its monitorId here.
  { name: 'rrautodoprava.sk', href: 'https://rrautodoprava.sk', note: { en: 'Astro site', sk: 'web v Astre' } },
  { name: 'ERPNext', href: 'https://erp.waldhauser.sk', monitorId: 10, note: { en: 'landing page', sk: 'úvodná stránka' } },
  { name: 'ERPNext tenant 1', href: 'https://tenant1.erp.waldhauser.sk', monitorId: 11, note: DEMO_TENANT },
  { name: 'ERPNext tenant 2', href: 'https://tenant2.erp.waldhauser.sk', monitorId: 12, note: DEMO_TENANT },
  { name: 'ERPNext tenant 3', href: 'https://tenant3.erp.waldhauser.sk', monitorId: 13, note: DEMO_TENANT },
  { name: 'CDN', href: 'https://cdn.waldhauser.sk', monitorId: 8, note: { en: 'static assets', sk: 'statické súbory' } },
  {
    name: { en: 'Status page', sk: 'Stavová stránka' },
    href: 'https://monitoring.waldoserver.top/status/waldhauser-services',
    note: 'Uptime Kuma',
  },
];
