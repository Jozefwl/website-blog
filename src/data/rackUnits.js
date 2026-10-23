// Rack units on the homepage and which Uptime Kuma monitors light their LEDs.
// Monitor IDs come from the "waldhauser-services" status page on monitoring.waldoserver.top.
export const RACK_UNITS = [
  {
    id: 'about',
    title: 'About',
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
    title: 'Projects',
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
    title: 'Services',
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
    title: 'Contact',
    to: '/contact',
    tag: 'U4',
    caption: 'ping jozef',
    monitors: [
      { id: 1, label: 'SK' },
      { id: 3, label: 'TOP' },
    ],
  },
];
