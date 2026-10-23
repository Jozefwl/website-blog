// Projects page. Descriptions copied from github.com/Jozefwl (2026-10-23).
// TODO(Jozef): pick the final list and add LinkedIn projects (source: 'linkedin').
const GITHUB = 'https://github.com/Jozefwl';

export const PROJECTS = [
  {
    name: 'biot-shutter',
    description:
      'IoT, Backend and Frontend for an application which uses ESP32 & Hardwario Core module to control blinds using a stepper motor with a lightsensor and timed opening/closing capabilities.',
    tech: ['JavaScript', 'ESP32', 'Hardwario'],
    repo: `${GITHUB}/biot-shutter`,
    source: 'github',
  },
  {
    name: 'applications-waldoserver',
    description: 'This repository contains deployment yamls and documentation for my server cluster.',
    tech: ['YAML', 'Server cluster'],
    repo: `${GITHUB}/applications-waldoserver`,
    source: 'github',
  },
  {
    name: 'computation-module',
    description: 'Computation module to read auditlogs from a MongoDB collection, calculate metrics to serve at an endpoint.',
    tech: ['Python', 'MongoDB'],
    repo: `${GITHUB}/computation-module`,
    source: 'github',
  },
  {
    name: 'ansible-deployment-strategies',
    description: 'This repository contains automations used to evaluate different deployment strategies.',
    tech: ['Ansible'],
    repo: `${GITHUB}/ansible-deployment-strategies`,
    source: 'github',
  },
  {
    name: 'backend-metrics',
    description: 'prometheus metrics backend',
    tech: ['JavaScript', 'Prometheus'],
    repo: `${GITHUB}/backend-metrics`,
    source: 'github',
  },
  {
    name: 'deployment-react-api',
    description:
      'This script is a Flask web application written in Python, designed to handle HTTP POST requests for deploying server updates and checking server status, with password-based access control.',
    tech: ['Python', 'Flask'],
    repo: `${GITHUB}/deployment-react-api`,
    source: 'github',
  },
  {
    name: 'beer-sniper',
    description: 'Python game about shooting beer cans.',
    tech: ['Python'],
    repo: `${GITHUB}/beer-sniper`,
    source: 'github',
  },
  {
    name: 'website-blog',
    description: 'This website: a server-rack homepage with live Uptime Kuma status LEDs, built with Vite and React.',
    tech: ['React', 'Vite', 'Express'],
    repo: `${GITHUB}/website-blog`,
    source: 'github',
  },
];
