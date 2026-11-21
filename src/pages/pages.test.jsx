import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router';
import { describe, expect, test, vi } from 'vitest';

// No network in page tests.
vi.mock('../hooks/useServiceStatus.js', () => ({ useServiceStatus: () => ({ summary: null, error: null }) }));
vi.mock('../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));
// Reduced motion: transitions resolve instantly, so history logic is testable without animation frames.
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: () => true }));

const { default: App } = await import('../App.jsx');
const { ServicesView } = await import('./Services.jsx');
const { default: Projects } = await import('./Projects.jsx');
const { default: Contact } = await import('./Contact.jsx');
const { ABOUT_SUBTITLE } = await import('../data/about.js');
const { LIVE_SERVICES } = await import('../data/services.js');

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('routes', () => {
  test.each([
    ['/about', 'About Jozef Waldhauser'],
    ['/projects', 'Projects'],
    ['/services', 'Links/Services'],
    ['/contact', 'Contact Me'],
    ['/links', 'Links/Services'],
    ['/nope', 'Unit not found'],
  ])('%s shows "%s"', (path, heading) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  test('home is the rack without navbar', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: /Open About/ })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument();
  });
});

describe('Navigation history', () => {
  function BackButton() {
    const navigate = useNavigate();
    return (
      <button type="button" onClick={() => navigate(-1)}>
        test-back
      </button>
    );
  }

  test('hop: rack auto-opens next and replaces history', async () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <App />
        <BackButton />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Contact' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Contact Me' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'test-back' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  });
});

describe('Services', () => {
  const renderServices = (summary = null) =>
    render(
      <MemoryRouter>
        <ServicesView summary={summary} />
      </MemoryRouter>,
    );

  test('services: both flows in order', () => {
    renderServices();
    const release = screen.getByRole('heading', { name: 'How a release ships' }).closest('section');
    const steps = within(release).getAllByRole('listitem').map((li) => li.textContent);
    ['Run workflow', 'GitHub Actions runner', 'Harbor', 'git commit', 'ArgoCD'].forEach((title, i) => expect(steps[i]).toMatch(new RegExp(`^${title}`)));
    const visitor = screen.getByRole('heading', { name: 'What a visitor hits' }).closest('section');
    expect(within(visitor).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      expect.stringMatching(/^Cloudflare/),
      expect.stringMatching(/^Traefik/),
      expect.stringMatching(/^k3s · 2 nodes/),
    ]);
  });

  test('services: every live link present', () => {
    renderServices();
    for (const { href } of LIVE_SERVICES) {
      const link = document.querySelector(`a[href="${href}"]`);
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('services: LEDs only where a monitor exists', () => {
    renderServices({ monitors: [{ id: 10, status: 'down' }] });
    expect(screen.getByRole('img', { name: 'ERPNext: off' })).toBeInTheDocument();
    const rene = screen.getByRole('link', { name: /rrautodoprava\.sk/ }).closest('li');
    expect(within(rene).queryByRole('img')).toBeNull();
  });

  test('services: links only to the public allow-list, no IP addresses', () => {
    const { container } = renderServices();
    const allowed = new Set([...LIVE_SERVICES.map((s) => new URL(s.href).host), 'github.com', 'www.linkedin.com', 'www.youtube.com']);
    for (const a of container.querySelectorAll('a[href^="http"]')) {
      expect(allowed).toContain(new URL(a.href).host);
    }
    expect(container.textContent).not.toMatch(/\b\d{1,3}(\.\d{1,3}){3}\b/);
  });
});

describe('Projects', () => {
  const renderProjects = () =>
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

  test('projects: day job first, then the three curated cards', () => {
    renderProjects();
    const dayJob = screen.getByRole('heading', { name: 'Day job' });
    const cards = screen.getAllByRole('article');
    expect(dayJob.compareDocumentPosition(cards[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText('Swissgrid · eSett · TenneT')).toBeInTheDocument();
    expect(cards).toHaveLength(3);
    expect(cards.map((c) => c.querySelector('h3').textContent)).toEqual(['waldhauser.sk', 'biot-shutter', 'rrautodoprava.sk']);
  });

  test('projects: dropped repos are gone', () => {
    renderProjects();
    expect(
      screen.queryByText(/beer-sniper|applications-waldoserver|ansible-deployment-strategies|computation-module|deployment-react-api/),
    ).toBeNull();
  });

  test('projects: every card has the same five rows, so they line up in the grid', () => {
    renderProjects();
    for (const card of screen.getAllByRole('article')) {
      expect(card.children).toHaveLength(5); // header, description, hard part, stack, links
    }
    // rrautodoprava.sk has no hard part: its row is an empty, hidden placeholder.
    const rene = screen.getAllByRole('article')[2];
    expect(rene.children[2]).toBeEmptyDOMElement();
    expect(rene.children[2]).toHaveAttribute('aria-hidden', 'true');
  });

  test('projects: rrautodoprava.sk lists GitHub first, the live site below it', () => {
    renderProjects();
    const rene = screen.getAllByRole('article')[2];
    expect([...rene.querySelectorAll('a')].map((a) => a.textContent)).toEqual(['View on GitHub →', 'Open the site →']);
  });

  test('projects: links', () => {
    renderProjects();
    for (const href of ['https://rrautodoprava.sk', 'https://github.com/Jozefwl/rene-website', 'https://github.com/Jozefwl/biot-shutter']) {
      const link = document.querySelector(`a[href="${href}"]`);
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(screen.getByRole('link', { name: 'More on GitHub' })).toHaveAttribute('href', 'https://github.com/Jozefwl');
  });
});

describe('About', () => {
  const renderAbout = () => renderAt('/about');

  test('about: subtitle and three story sections', () => {
    renderAbout();
    expect(screen.getByText(ABOUT_SUBTITLE.en)).toBeInTheDocument();
    for (const name of ['How it started', 'Where it went', 'In my free time', "Let's connect"]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
  });

  test('about: thesis and thingiverse links', () => {
    renderAbout();
    expect(screen.getByRole('link', { name: 'Read it on theses.cz' })).toHaveAttribute('href', 'https://theses.cz/id/kcpm3j/?lang=en');
    expect(screen.getByRole('link', { name: "It's on Thingiverse" })).toHaveAttribute('href', 'https://www.thingiverse.com/thing:7402283');
  });

  test('about: prose, not bullet lists', () => {
    renderAbout();
    expect(within(screen.getByRole('main')).queryAllByRole('listitem')).toHaveLength(0);
  });

  test('about: facts survive', () => {
    renderAbout();
    for (const fact of [/about 4 W/, /Panasonic Toughbook CF-19/, /Swissgrid, eSett and TenneT/, /edge of your city/]) {
      expect(screen.getByText(fact)).toBeInTheDocument();
    }
  });
});

describe('Contact', () => {
  test('submit builds the mailto link', async () => {
    const onSend = vi.fn();
    render(
      <MemoryRouter>
        <Contact onSend={onSend} />
      </MemoryRouter>,
    );
    await userEvent.type(screen.getByLabelText('Name:'), 'Jo');
    await userEvent.type(screen.getByLabelText('Message:'), 'Hi');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSend).toHaveBeenCalledWith(expect.stringContaining('Name:%20Jo%0A%0AMessage:%0AHi'));
  });

  test('empty form does not send', async () => {
    const onSend = vi.fn();
    render(
      <MemoryRouter>
        <Contact onSend={onSend} />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSend).not.toHaveBeenCalled();
  });
});
