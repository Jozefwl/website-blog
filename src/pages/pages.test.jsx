import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, test, vi } from 'vitest';

// No network in page tests.
vi.mock('../hooks/useServiceStatus.js', () => ({ useServiceStatus: () => ({ summary: null, error: null }) }));
vi.mock('../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));

const { default: App } = await import('../App.jsx');
const { ServicesView } = await import('./Services.jsx');
const { default: Projects } = await import('./Projects.jsx');
const { default: Contact } = await import('./Contact.jsx');

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

describe('Services', () => {
  test('keeps the five links from the old Links page', () => {
    render(
      <MemoryRouter>
        <ServicesView summary={null} />
      </MemoryRouter>,
    );
    const hrefs = ['https://monitoring.waldoserver.top/status/waldhauser-services', 'https://metrics.waldhauser.sk', 'https://cdn.waldhauser.sk', 'https://erp.waldhauser.sk', 'https://waldoserver.top'];
    for (const href of hrefs) {
      expect(document.querySelector(`a[href="${href}"]`)).not.toBeNull();
    }
  });

  test('a service card shows its live LED', () => {
    render(
      <MemoryRouter>
        <ServicesView summary={{ monitors: [{ id: 10, status: 'down' }] }} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('img', { name: 'ERP: down' })).toBeInTheDocument();
  });
});

describe('Projects', () => {
  test('one card per project, repo link opens safely', () => {
    const projects = [{ name: 'biot-shutter', description: 'd', tech: ['JS'], repo: 'https://github.com/Jozefwl/biot-shutter' }];
    render(<Projects projects={projects} />);
    expect(screen.getAllByRole('article')).toHaveLength(1);
    const link = screen.getByRole('link', { name: 'View on GitHub →' });
    expect(link).toHaveAttribute('href', 'https://github.com/Jozefwl/biot-shutter');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
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
