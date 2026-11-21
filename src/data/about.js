// About page copy, written from Jozef's own answers. Facts must not change.
// Every text is { en, sk }. A paragraph is a list of parts: plain strings, or { text, href } for a link.
export const ABOUT_SUBTITLE = {
  en: "Server operator · engineering student · keeps up with whatever's new in tech",
  sk: 'Server operátor · študent inžinierstva · sledujem novinky v technológiách',
};

export const ABOUT_SECTIONS = [
  {
    title: { en: 'How it started', sk: 'Ako to začalo' },
    paragraphs: {
      en: [
        ['I got into servers at SPŠ Snina. I had free time at school, so I bought a VPS and put my first website on nginx.'],
        [
          'I also hosted from an EeePC. It had an Intel Atom and drew about 4 W. I had no public IP, so it reached the internet through a Cloudflare Tunnel, which worked fine.',
        ],
        ["What I really wanted was a public IP, so I could host game servers for my friends."],
        [
          "Then came the Toughbook. I bought a Panasonic Toughbook CF-19 for school because I knew it wouldn't break. It also switches itself on as soon as it gets power, which is exactly what you want from a server. So it became one.",
        ],
      ],
      sk: [
        [
          'K serverom som sa dostal na SPŠ Snina. V škole som mal voľný čas, tak som si kúpil VPS a spustil na ňom svoju prvú stránku na nginx.',
        ],
        [
          'Hostoval som aj z EeePC. Mal Intel Atom a spotrebu elektriny okolo 4 W. Verejnú IP som nemal, takže bol na internet sprístupnený cez Cloudflare Tunnel, čo fungovalo bez problémov.',
        ],
        [
          'To, čo som naozaj chcel, bola verejná IP, aby som mohol hostovať herné servery pre kamarátov.',
        ],
        [
          'Potom prišiel Toughbook. Panasonic Toughbook CF-19 som si kúpil do školy, lebo som vedel, že ho nikto nerozbije. Navyše sa sám zapne, hneď ako sa zapojí do napájania, čo je presne to, čo od servera chcete. Tak sa jedným stal.',
        ],
      ],
    },
  },
  {
    title: { en: 'Where it went', sk: 'Kam to viedlo' },
    paragraphs: {
      en: [
        [
          "At work I worked with Kubernetes, and I learn best by doing things myself, so I built my own single-node cluster. That cluster became the basis of my bachelor's thesis at Unicorn University. The thesis compares deployment strategies (Recreate, Ramped, Blue/Green, Canary, A/B testing, Shadow) by how each one affects the tenants sharing a Kubernetes cluster. ",
          { text: 'Read it on theses.cz', href: 'https://theses.cz/id/kcpm3j/?lang=en' },
          '. Later I added a second node.',
        ],
        ['ArgoCD went the same way. I saw it at work, installed it at home, and built my own GitHub Actions pipelines.'],
        [
          "I started out in SLS support. Today I'm a Configuration Manager at Unicorn Systems, where I help manage and deploy the Unicorn Enterprise Platform and work on projects for Swissgrid, eSett and TenneT. I'm also studying for an engineering degree.",
        ],
        ['Most of what I know I learned this way: see it at work, then run it at home until it makes sense.'],
      ],
      sk: [
        [
          'V práci som robil s Kubernetes, a keďže sa najlepšie učím tak, že si veci sám vyskúšam, postavil som si vlastný single-node cluster. Z neho sa stal základ mojej bakalárskej práce na Unicorn University. Práca porovnáva deployment stratégie (Recreate, Ramped, Blue/Green, Canary, A/B testovanie, Shadow) podľa toho, ako každá z nich ovplyvňuje tenantov, ktorí zdieľajú jeden Kubernetes cluster. ',
          { text: 'Prečítajte si ju na theses.cz', href: 'https://theses.cz/id/kcpm3j/' },
          '. Neskôr som pridal druhý node.',
        ],
        [
          'S ArgoCD to bolo rovnaké. Videl som ho v práci, nainštaloval si ho doma a postavil si vlastné GitHub Actions pipeliny.',
        ],
        [
          'Začínal som na SLS podpore. Dnes pracujem ako Configuration Manager v Unicorn Systems, kde pomáham spravovať a nasadzovať Unicorn Enterprise Platform a pracujem na projektoch pre Swissgrid, eSett a TenneT. Popritom študujem na inžiniersky titul.',
        ],
        ['Väčšinu toho, čo viem, som sa naučil takto: videl som to v práci a potom to doma vyskúšal, pokiaľ som tomu neporozumel.'],
      ],
    },
  },
  {
    title: { en: 'In my free time', sk: 'Vo voľnom čase' },
    paragraphs: {
      en: [
        [
          "I do 3D modelling. My latest project was a logo: I recreated a logo in Fusion 360 for a friend's old hi-fi and printed it on an Ender 3. The Ender only prints one colour at a time, so I swapped filament mid-print. ",
          { text: "It's on Thingiverse", href: 'https://www.thingiverse.com/thing:7402283' },
          '.',
        ],
        ["I like to go on hikes. Here's a tip: go to an edge of your city and explore the forest there. The photos below are from some of mine."],
        ["Slovak is my native language. I've spoken English my whole life, know a little bit of German and OK Russian."],
      ],
      sk: [
        [
          'Venujem sa 3D modelovaniu. Môj posledný projekt bol logo: vo Fusion 360 som nanovo vytvoril logo pre kamarátov starý hi-fi a vytlačil ho na Enderi 3. Ender tlačí iba jednofarebne, tak som počas tlače menil filament. ',
          { text: 'Je na Thingiverse', href: 'https://www.thingiverse.com/thing:7402283' },
          '.',
        ],
        ['Rád chodím na túry. Tip: choďte na kraj svojho mesta a preskúmajte les. Fotky nižšie sú z niektorých mojich túr.'],
        ['Slovenčina je môj materinský jazyk. Po anglicky hovorím celý život, trochu viem po nemecky a dobre po rusky.'],
      ],
    },
  },
];
