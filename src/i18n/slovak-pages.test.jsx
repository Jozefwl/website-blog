import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { LanguageProvider } from './LanguageContext.jsx';

vi.mock('../hooks/useServiceStatus.js', () => ({ useServiceStatus: () => ({ summary: null, error: null }) }));
vi.mock('../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: () => true }));

const { default: App } = await import('../App.jsx');
const { default: Casino } = await import('../pages/Casino.jsx');

const slovak = { getItem: () => 'sk', setItem() {} };
const renderSk = (ui, path = '/') =>
  render(
    <LanguageProvider storage={slovak} languages={['sk']}>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </LanguageProvider>,
  );

afterEach(() => vi.useRealTimers());

describe('the whole site in Slovak', () => {
  test.each([
    ['/about', 'O Jozefovi Waldhauserovi'],
    ['/projects', 'Projekty'],
    ['/services', 'Odkazy/Služby'],
    ['/contact', 'Kontaktujte ma'],
    ['/nope', 'Jednotka nenájdená'],
  ])('%s has the Slovak heading "%s"', (path, heading) => {
    renderSk(<App />, path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Hlavné' })).toHaveTextContent('O mne');
  });

  test('the rack speaks Slovak', () => {
    renderSk(<App />, '/');
    expect(screen.getByRole('link', { name: 'Otvoriť O mne' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voľná skrutka' })).toBeInTheDocument();
    expect(screen.getByText('HLAVNÝ SERVER RACK')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zobraziť počasie' })).toBeInTheDocument();
  });

  test('About, Projects and Services content is Slovak', () => {
    const { unmount } = renderSk(<App />, '/about');
    expect(screen.getByRole('heading', { level: 2, name: 'Ako to začalo' })).toBeInTheDocument();
    expect(screen.getByText(/K serverom som sa dostal na SPŠ Snina/)).toBeInTheDocument();
    unmount();
    renderSk(<App />, '/projects');
    expect(screen.getByRole('heading', { name: 'Zamestnanie' })).toBeInTheDocument();
    expect(screen.getAllByText('Ťažká časť:')).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Zobraziť na GitHube →' })).toHaveLength(3);
  });

  test('the casino and JozefPay speak Slovak', () => {
    vi.useFakeTimers();
    renderSk(<Casino storage={null} gatewayRng={() => 0} />, '/casino');
    expect(screen.getByRole('heading', { level: 1, name: 'Kasíno' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Točiť' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Výplaty' })).toHaveTextContent('SKRUTKA');
    fireEvent.click(screen.getByRole('button', { name: 'Ruleta' }));
    expect(screen.getByLabelText('Stávka na')).toHaveTextContent('Červená');
    fireEvent.click(screen.getByRole('button', { name: 'Blackjack' }));
    expect(screen.getByRole('button', { name: 'Rozdať' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pridať prostriedky' }));
    const dialog = screen.getByRole('dialog', { name: /JozefPay/ });
    expect(within(dialog).getByRole('status')).toHaveTextContent('Pripájanie k JozefPay…');
    act(() => vi.advanceTimersByTime(5000));
    expect(within(dialog).getByText('100 000,00 €')).toBeInTheDocument();
    fireEvent.change(within(dialog).getByLabelText('Suma'), { target: { value: '200000' } });
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Nedostatočný zostatok');
    expect(dialog).toHaveTextContent(/fiktívna platobná služba/);
  });
});
