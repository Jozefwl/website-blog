// About page copy, written from Jozef's own answers. Facts must not change.
// Every text is { en, sk }. A paragraph is a list of parts: plain strings, or { text, href } for a link.
export const ABOUT_SUBTITLE = {
  en: "Server operator · engineering student · keeps up with whatever's new in tech",
  sk: 'Správca serverov · študent inžinierstva · sledujem všetko nové v technológiách',
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
        ["What I really wanted was a public IP, so I could host game servers for my friends. Once I had one, that's what I did."],
        [
          "Then came the Toughbook. I bought a Panasonic Toughbook CF-19 for school because I knew it wouldn't break. It also switches itself on as soon as it gets power, which is exactly what you want from a server. So it became one.",
        ],
      ],
      sk: [
        [
          'K serverom som sa dostal na SPŠ Snina. V škole som mal voľný čas, tak som si kúpil VPS a spustil na ňom svoju prvú webstránku na nginx-e.',
        ],
        [
          'Hostoval som aj z EeePC. Mal procesor Intel Atom a bral okolo 4 W. Verejnú IP adresu som nemal, takže sa na internet dostal cez Cloudflare Tunnel, čo fungovalo bez problémov.',
        ],
        [
          'To, čo som naozaj chcel, bola verejná IP adresa, aby som mohol hostovať herné servery pre kamarátov. Keď som ju mal, presne to som robil.',
        ],
        [
          'Potom prišiel Toughbook. Panasonic Toughbook CF-19 som si kúpil do školy, lebo som vedel, že sa nepokazí. Navyše sa sám zapne, hneď ako dostane prúd, čo je presne to, čo od servera chcete. Tak sa ním stal.',
        ],
      ],
    },
  },
  {
    title: { en: 'Where it went', sk: 'Kam to viedlo' },
    paragraphs: {
      en: [
        [
          "At work I ran into Kubernetes, and I learn best by running things myself, so I built my own single-node cluster. That cluster became the basis of my bachelor's thesis at Unicorn University. The thesis compares deployment strategies (Recreate, Ramped, Blue/Green, Canary, A/B testing, Shadow) by how each one affects the tenants sharing a Kubernetes cluster. ",
          { text: 'Read it on theses.cz', href: 'https://theses.cz/id/kcpm3j/?lang=en' },
          '. Later I added a second laptop to host more.',
        ],
        ['ArgoCD went the same way. I saw it at work, installed it at home, and built my own GitHub Actions pipelines for this website.'],
        [
          "I started out in SLS support. Today I'm a Configuration Manager at Unicorn Systems, where I help manage and deploy the Unicorn Enterprise Platform and work on projects for Swissgrid, eSett and TenneT. I'm also studying for an engineering degree.",
        ],
        ['Most of what I know I learned this way: see it at work, then run it at home until it makes sense.'],
      ],
      sk: [
        [
          'V práci som narazil na Kubernetes, a keďže sa najlepšie učím tak, že veci sám prevádzkujem, postavil som si vlastný jednouzlový cluster. Ten sa stal základom mojej bakalárskej práce na Unicorn University. Práca porovnáva stratégie nasadzovania (Recreate, Ramped, Blue/Green, Canary, A/B testovanie, Shadow) podľa toho, ako každá z nich ovplyvňuje tenantov, ktorí zdieľajú jeden Kubernetes cluster. ',
          { text: 'Prečítajte si ju na theses.cz', href: 'https://theses.cz/id/kcpm3j/' },
          '. Neskôr som pridal druhý notebook, aby som mohol hostovať viac.',
        ],
        [
          'S ArgoCD to bolo rovnaké. Videl som ho v práci, nainštaloval si ho doma a postavil vlastné GitHub Actions pipeliny pre tento web.',
        ],
        [
          'Začínal som na podpore SLS. Dnes pracujem ako Configuration Manager v Unicorn Systems, kde pomáham spravovať a nasadzovať Unicorn Enterprise Platform a pracujem na projektoch pre Swissgrid, eSett a TenneT. Popri tom študujem na inžinierskom stupni.',
        ],
        ['Väčšinu toho, čo viem, som sa naučil takto: vidieť to v práci a potom to doma prevádzkovať, kým tomu nerozumiem.'],
      ],
    },
  },
  {
    title: { en: 'Off the clock', sk: 'Vo voľnom čase' },
    paragraphs: {
      en: [
        [
          "I do 3D modelling. My latest project is a logo: I recreated the Rosita logo in Fusion 360 for a friend's old hi-fi and printed it on an Ender 3. The Ender only prints one colour at a time, so I swapped filament mid-print to get more than one. ",
          { text: "It's on Thingiverse", href: 'https://www.thingiverse.com/thing:7402283' },
          '.',
        ],
        ["I like to go on hikes. Here's a tip: go to the edge of your city and explore the forest there. The photos below are from some of mine."],
        ["Slovak is my native language. I've spoken English my whole life, and I have a bit of German and OK Russian."],
      ],
      sk: [
        [
          'Venujem sa 3D modelovaniu. Môj posledný projekt je logo: vo Fusion 360 som znovu vytvoril logo Rosita pre kamarátov starý hi-fi a vytlačil ho na Enderi 3. Ender tlačí naraz len jednu farbu, preto som počas tlače menil filament, aby som dostal viac farieb. ',
          { text: 'Je na Thingiverse', href: 'https://www.thingiverse.com/thing:7402283' },
          '.',
        ],
        ['Rád chodím na túry. Tip: choďte na okraj svojho mesta a preskúmajte tamojší les. Fotky nižšie sú z niektorých mojich túr.'],
        ['Slovenčina je môj materinský jazyk. Po anglicky hovorím celý život, trochu viem po nemecky a obstojne po rusky.'],
      ],
    },
  },
];
