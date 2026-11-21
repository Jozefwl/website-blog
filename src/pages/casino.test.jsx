import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import { createRng } from '../lib/casino/rng.js';
import { slotPayout, spinReels } from '../lib/casino/slots.js';
import { createDeck, dealerPlay, isBlackjack, settle, shuffle } from '../lib/casino/blackjack.js';
import { roulettePayout, spinWheel } from '../lib/casino/roulette.js';

vi.mock('../hooks/useServiceStatus.js', () => ({ useServiceStatus: () => ({ summary: null, error: null }) }));
vi.mock('../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: () => true }));

const { default: App } = await import('../App.jsx');
const { default: Casino } = await import('./Casino.jsx');
const { default: LoadBoundary } = await import('../components/common/LoadBoundary.jsx');

function fakeStorage(initial) {
  const data = new Map(initial == null ? [] : [['casino.chips', initial]]);
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
}

const renderCasino = (props) =>
  render(
    <MemoryRouter initialEntries={['/casino']}>
      <Casino {...props} />
    </MemoryRouter>,
  );

const chips = () => Number(screen.getByTestId('chips').textContent);

async function setBet(amount) {
  const input = screen.getByLabelText('Bet');
  await userEvent.clear(input);
  await userEvent.type(input, String(amount));
}

describe('Casino', () => {
  test('casino route lazy-loads', async () => {
    render(
      <MemoryRouter initialEntries={['/casino']}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { level: 1, name: 'Casino' })).toBeInTheDocument();
  });

  test('noindex while mounted', () => {
    const { unmount } = renderCasino({ storage: fakeStorage() });
    expect(document.querySelector('meta[name="robots"][content="noindex"]')).not.toBeNull();
    unmount();
    expect(document.querySelector('meta[name="robots"][content="noindex"]')).toBeNull();
  });

  test('slots: bet is taken and payout credited', async () => {
    const reels = spinReels(createRng(11));
    renderCasino({ rng: createRng(11), storage: fakeStorage() });
    await setBet(10);
    await userEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(chips()).toBe(1000 - 10 + slotPayout(reels, 10));
  });

  test('cannot bet more than you have', async () => {
    renderCasino({ storage: fakeStorage('5') });
    await setBet(10);
    expect(screen.getByRole('button', { name: 'Spin' })).toBeDisabled();
  });

  test('cannot bet zero', async () => {
    renderCasino({ storage: fakeStorage() });
    await setBet(0);
    expect(screen.getByRole('button', { name: 'Spin' })).toBeDisabled();
  });

  test('reboot at zero', async () => {
    renderCasino({ storage: fakeStorage('0') });
    await userEvent.click(screen.getByRole('button', { name: 'Reboot' }));
    expect(chips()).toBe(1000);
  });

  test('blackjack: deal, stand settles', async () => {
    const seed = 21;
    const deck = shuffle(createDeck(), createRng(seed));
    const player = [deck[0], deck[2]];
    let dealer = [deck[1], deck[3]];
    if (!isBlackjack(player) && !isBlackjack(dealer)) dealer = dealerPlay(dealer, deck.slice(4)).hand;
    const expected = 1000 - 10 + Math.floor(settle(player, dealer, 10));

    renderCasino({ rng: createRng(seed), storage: fakeStorage() });
    await userEvent.click(screen.getByRole('button', { name: 'Blackjack' }));
    await setBet(10);
    await userEvent.click(screen.getByRole('button', { name: 'Deal' }));
    const stand = screen.queryByRole('button', { name: 'Stand' });
    if (stand) await userEvent.click(stand);
    expect(chips()).toBe(expected);
  });

  test('roulette: an empty number field does not bet on zero', async () => {
    renderCasino({ storage: fakeStorage() });
    await userEvent.click(screen.getByRole('button', { name: 'Roulette' }));
    await userEvent.selectOptions(screen.getByLabelText('Bet on'), 'number');
    await userEvent.clear(screen.getByLabelText('Number'));
    expect(screen.getByRole('button', { name: 'Spin' })).toBeDisabled();
  });

  test('a casino chunk that fails to load shows a reload message, not a blank site', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    function Broken() {
      throw new Error('Failed to fetch dynamically imported module');
    }
    render(
      <LoadBoundary>
        <Broken />
      </LoadBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/couldn't load/i);
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    console.error.mockRestore();
  });

  test('roulette: red bet settles', async () => {
    const result = spinWheel(createRng(5));
    renderCasino({ rng: createRng(5), storage: fakeStorage() });
    await userEvent.click(screen.getByRole('button', { name: 'Roulette' }));
    await setBet(10);
    await userEvent.selectOptions(screen.getByLabelText('Bet on'), 'red');
    await userEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(chips()).toBe(1000 - 10 + roulettePayout({ type: 'red' }, result, 10));
  });
});
