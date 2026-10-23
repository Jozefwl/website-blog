// Content from the old Links page. monitorId links a card to its Uptime Kuma monitor.
export const SERVICE_GROUPS = [
  {
    title: '=== waldhauser.sk ===',
    items: [
      // { image: 'https://cdn.waldhauser.sk/icons/planka.png', text: 'Planka', link: 'https://planka.waldhauser.sk' },
      {
        image: 'https://cdn.waldhauser.sk/icons/monitoring.jpg',
        text: 'Monitoring',
        link: 'https://monitoring.waldoserver.top/status/waldhauser-services',
      },
      { image: 'https://cdn.waldhauser.sk/icons/nodejs.png', text: 'Backend', link: 'https://metrics.waldhauser.sk', monitorId: 9 },
      { image: 'https://cdn.waldhauser.sk/icons/cdn.png', text: 'CDN', link: 'https://cdn.waldhauser.sk', monitorId: 8 },
      { image: 'https://cdn.waldhauser.sk/icons/erp.png', text: 'ERP', link: 'https://erp.waldhauser.sk', monitorId: 10 },
    ],
  },
  {
    title: '=== waldoserver.top ===',
    items: [{ image: 'https://cdn.waldhauser.sk/icons/server.png', text: 'Website', link: 'https://waldoserver.top', monitorId: 6 }],
  },
];

export const ICON_CREDITS = [
  { href: 'https://www.flaticon.com/free-icons/server', title: 'server icons', text: 'Server icons created by Freepik - Link' },
  { href: 'https://www.flaticon.com/free-icons/erp', title: 'erp icons', text: 'Erp icons created by Vectorslab - Link' },
];
