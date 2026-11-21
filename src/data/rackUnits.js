// Rack units on the homepage and which Uptime Kuma monitors light their LEDs.
// Each unit's label is the navbar text for its id (src/i18n: nav.<id>).
// Monitor IDs come from the "waldhauser-services" status page on monitoring.waldoserver.top.
export const RACK_UNITS = [
  {
    id: 'about',
    to: '/about',
    tag: 'U1',
    caption: 'whoami',
    monitors: [
      { id: 2, label: 'Web' },
      { id: 9, label: 'API' },
    ],
  },
  {
    id: 'projects',
    to: '/projects',
    tag: 'U2',
    caption: 'git log',
    monitors: [
      { id: 6, label: 'Waldo' },
      { id: 5, label: 'Harbor' },
    ],
  },
  {
    id: 'services',
    to: '/services',
    tag: 'U3',
    caption: 'systemctl status',
    monitors: [
      { id: 8, label: 'CDN' },
      { id: 10, label: 'ERP' },
      { id: 11, label: 'T1' },
      { id: 12, label: 'T2' },
      { id: 13, label: 'T3' },
    ],
  },
  {
    id: 'contact',
    to: '/contact',
    tag: 'U4',
    caption: 'ping jozef',
    monitors: [
      { id: 1, label: 'SK' },
      { id: 3, label: 'TOP' },
    ],
  },
];
