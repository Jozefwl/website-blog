// Projects page: the day job first, then a few projects done properly.
// Texts are Jozef's own; keep the facts as they are. Translatable texts are { en, sk }.
const GITHUB = 'https://github.com/Jozefwl';

const VIEW_ON_GITHUB = { en: 'View on GitHub', sk: 'Zobraziť na GitHube' };

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
    context: { en: 'This site and its metrics backend', sk: 'Tento web a jeho backend s metrikami' },
    description: {
      en: 'I wanted a personal website, so I built one that looks like a server rack, where every page is a server you pull out. The LEDs show live status from my monitoring. It runs on my own Kubernetes cluster. A release is built on a self-hosted GitHub Actions runner and rolled out by ArgoCD.',
      sk: 'Chcel som osobnú webstránku, tak som postavil takú, ktorá vyzerá ako serverový rack a každá stránka je server, ktorý z neho vytiahnete. LEDky ukazujú živý stav z môjho monitoringu. Beží na mojom vlastnom Kubernetes clustri. Novú verziu zostaví self-hosted GitHub Actions runner a nasadí ju ArgoCD.',
    },
    hardPart: {
      en: 'migrating the site from plain HTML to a JavaScript framework.',
      sk: 'migrácia webu z čistého HTML na JavaScriptový framework.',
    },
    stack: {
      en: 'React, Vite, Motion · Express API in front of Prometheus and Uptime Kuma · Docker (Chainguard), Harbor · self-hosted Kubernetes, ArgoCD, GitHub Actions · Cloudflare',
      sk: 'React, Vite, Motion · Express API pred Prometheom a Uptime Kuma · Docker (Chainguard), Harbor · vlastný Kubernetes, ArgoCD, GitHub Actions · Cloudflare',
    },
    links: [
      { label: VIEW_ON_GITHUB, href: `${GITHUB}/website-blog` },
      { label: { en: 'See the infrastructure', sk: 'Pozrieť infraštruktúru' }, href: '/services', internal: true },
    ],
  },
  {
    name: 'biot-shutter',
    context: { en: 'School IoT project, team, 2024', sk: 'Školský IoT projekt, tím, 2024' },
    description: {
      en: 'Smart window blinds, built as a team for our IoT class to show we could make real devices talk to a real web app. Stepper-motor blinds with a light sensor and timed opening, controlled from a web app.',
      sk: 'Inteligentné žalúzie, ktoré sme ako tím postavili na predmet IoT, aby sme ukázali, že vieme prepojiť skutočné zariadenia so skutočnou webovou aplikáciou. Žalúzie s krokovým motorom, svetelným senzorom a časovaným otváraním, ovládané z webovej aplikácie.',
    },
    hardPart: {
      en: 'integrating Node-RED and MQTT with the Hardwario module and the ESP32.',
      sk: 'integrácia Node-RED a MQTT s modulom Hardwario a ESP32.',
    },
    stack: 'ESP32 (Arduino C++), Hardwario Core (C) · MQTT, Node-RED · Express, MongoDB, JWT · React, React-Bootstrap',
    links: [{ label: VIEW_ON_GITHUB, href: `${GITHUB}/biot-shutter` }],
  },
  {
    name: 'rrautodoprava.sk',
    context: { en: "Website for a friend's transport business", sk: 'Web pre kamarátovu dopravnú firmu' },
    description: {
      en: "A quick site for my friend René's van transport business in Humenné. I built a first version with Claude, then reworked it with what I learned about site design at school. It isn't perfect, but it does exactly what he needed: Slovak and English versions, and a quote form that sends straight to WhatsApp or email.",
      sk: 'Rýchly web pre dopravnú firmu môjho kamaráta Reného z Humenného. Prvú verziu som postavil s Claudom a potom som ju prerobil podľa toho, čo som sa o návrhu webov naučil v škole. Nie je dokonalý, ale robí presne to, čo potreboval: slovenskú a anglickú verziu a formulár na cenovú ponuku, ktorý sa odošle priamo cez WhatsApp alebo e-mail.',
    },
    stack: {
      en: "Astro, plain CSS, almost no JavaScript · same hosting setup as my site: Kubernetes, Traefik, Let's Encrypt, ArgoCD",
      sk: "Astro, čisté CSS, takmer žiadny JavaScript · rovnaký hosting ako môj web: Kubernetes, Traefik, Let's Encrypt, ArgoCD",
    },
    links: [
      { label: VIEW_ON_GITHUB, href: `${GITHUB}/rene-website` },
      { label: { en: 'Open the site', sk: 'Otvoriť web' }, href: 'https://rrautodoprava.sk' },
    ],
  },
];
