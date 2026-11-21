// Projects page: the day job first, then a few projects done properly.
// Texts are Jozef's own; keep the facts as they are.
const GITHUB = 'https://github.com/Jozefwl';

export const DAY_JOB = {
  role: 'Configuration Manager',
  company: 'Unicorn Systems',
  platform: 'Unicorn Enterprise Platform',
  clients: ['Swissgrid', 'eSett', 'TenneT'],
  linkedin: 'https://www.linkedin.com/in/jozef-waldhauser-337779220/',
};

export const PROJECTS = [
  {
    name: 'waldhauser.sk',
    context: 'This site and its metrics backend',
    description:
      'I wanted a personal website, so I built one that looks like a server rack, where every page is a server you pull out. The LEDs show live status from my monitoring. It runs on my own Kubernetes cluster. A release is built on a self-hosted GitHub Actions runner and rolled out by ArgoCD.',
    hardPart: 'getting ArgoCD and the self-hosted runner to work together.',
    stack:
      'React, Vite, Motion · Express API in front of Prometheus and Uptime Kuma · Docker (Chainguard), Harbor · self-hosted Kubernetes, ArgoCD, GitHub Actions · Cloudflare',
    links: [
      { label: 'View on GitHub', href: `${GITHUB}/website-blog` },
      { label: 'See the infrastructure', href: '/services', internal: true },
    ],
  },
  {
    name: 'biot-shutter',
    context: 'School IoT project, team, 2024',
    description:
      'Smart window blinds, built as a team for our IoT class to show we could make real devices talk to a real web app. Stepper-motor blinds with a light sensor and timed opening, controlled from a web app.',
    hardPart:
      'hosting our own MQTT server, and giving the developers a live camera stream of the mockup shutter so they could debug the hardware from anywhere.',
    stack: 'ESP32 (Arduino C++), Hardwario Core (C) · MQTT, Node-RED · Express, MongoDB, JWT · React, React-Bootstrap',
    links: [{ label: 'View on GitHub', href: `${GITHUB}/biot-shutter` }],
  },
  {
    name: 'rrautodoprava.sk',
    context: "Website for a friend's transport business",
    description:
      "A quick site for my friend René's van transport business in Humenné. I built a first version with Claude, then reworked it with what I learned about site design at school. It isn't perfect, but it does exactly what he needed: Slovak and English versions, and a quote form that sends straight to WhatsApp or email.",
    stack: "Astro, plain CSS, almost no JavaScript · same hosting setup as my site: Kubernetes, Traefik, Let's Encrypt, ArgoCD",
    links: [
      { label: 'Open the site', href: 'https://rrautodoprava.sk' },
      { label: 'View on GitHub', href: `${GITHUB}/rene-website` },
    ],
  },
];
