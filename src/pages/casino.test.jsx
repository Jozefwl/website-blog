import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { act, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createRng } from '../lib/casino/rng.js';
import { slotPayout, spinReels } from '../lib/casino/slots.js';
import { createDeck, dealerPlay, isBlackjack, settle, shuffle } from '../lib/casino/blackjack.js';
import { roulettePayout, spinWheel } from '../lib/casino/roulette.js';

afterEach(() => {
  motionState.reduce = true;
  vi.useRealTimers();
});

vi.mock('../hooks/useServiceStatus.js', () => ({ useServiceStatus: () => ({ summary: null, error: null }) }));
vi.mock('../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));
const motionState = vi.hoisted(() => ({ reduce: true }));
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: () => motionState.reduce }));

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

  // Opens JozefPay and waits out its (fake) loading time.
  function openGateway() {
    fireEvent.click(screen.getByRole('button', { name: 'Add funds' }));
    act(() => vi.advanceTimersByTime(10000));
    return screen.getByRole('dialog', { name: /JozefPay/ });
  }

  test('Add funds is always there, even with chips left', () => {
    renderCasino({ storage: fakeStorage() });
    expect(screen.getByRole('button', { name: 'Add funds' })).toBeInTheDocument();
  });

  test('JozefPay loads for a while before showing the form', () => {
    vi.useFakeTimers();
    renderCasino({ storage: fakeStorage() });
    fireEvent.click(screen.getByRole('button', { name: 'Add funds' }));
    const dialog = screen.getByRole('dialog', { name: /JozefPay/ });
    expect(within(dialog).getByRole('status')).toHaveTextContent(/connecting/i);
    expect(within(dialog).queryByLabelText('Amount')).toBeNull();
    act(() => vi.advanceTimersByTime(4999));
    expect(within(dialog).queryByLabelText('Amount')).toBeNull(); // never faster than 5 s
    act(() => vi.advanceTimersByTime(5001));
    expect(within(dialog).getByRole('heading', { name: 'Add funds' })).toBeInTheDocument();
    expect(within(dialog).getByText('€100,000.00')).toBeInTheDocument();
  });

  test('paying: processing 5-10 s, then a checkmark for 1 s, then it closes', () => {
    vi.useFakeTimers();
    const storage = fakeStorage();
    renderCasino({ storage, gatewayRng: () => 0.999999 }); // slowest gateway: every wait is exactly 10 s
    const dialog = openGateway();
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '5000' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Pay/ }));

    expect(within(dialog).getByRole('status')).toHaveTextContent(/processing transaction/i);
    act(() => vi.advanceTimersByTime(4999));
    expect(chips()).toBe(1000); // nothing moves while processing
    expect(within(dialog).getByRole('status')).toHaveTextContent(/processing transaction/i);

    act(() => vi.advanceTimersByTime(5001));
    expect(within(dialog).getByRole('status')).toHaveTextContent(/payment successful/i);
    expect(within(dialog).getByTestId('checkmark')).toBeInTheDocument();
    expect(chips()).toBe(6000);
    expect(storage.getItem('jozefpay.bank')).toBe('95000');

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(chips()).toBe(6000);
  });

  test('a payment in progress cannot be closed halfway', () => {
    vi.useFakeTimers();
    renderCasino({ storage: fakeStorage() });
    const dialog = openGateway();
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '300' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Pay/ }));
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeDisabled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(11000));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(chips()).toBe(1300);
  });

  test('more than the bank holds: red insufficient balance, cannot pay', () => {
    vi.useFakeTimers();
    renderCasino({ storage: fakeStorage() });
    const dialog = openGateway();
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '100001' } });
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Insufficient balance');
    expect(within(dialog).getByRole('button', { name: /^Pay/ })).toBeDisabled();
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '100000' } });
    expect(within(dialog).queryByRole('alert')).toBeNull();
    expect(within(dialog).getByRole('button', { name: /^Pay/ })).toBeEnabled();
  });

  test('cancel and Escape close JozefPay without paying', () => {
    vi.useFakeTimers();
    renderCasino({ storage: fakeStorage() });
    let dialog = openGateway();
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '500' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    dialog = openGateway();
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(chips()).toBe(1000);
  });

  test('the gateway carries the small-print disclaimer', () => {
    vi.useFakeTimers();
    renderCasino({ storage: fakeStorage() });
    expect(openGateway()).toHaveTextContent(/fictional/i);
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

  test('slots: the legend shows every payout', () => {
    renderCasino({ storage: fakeStorage() });
    const legend = screen.getByRole('table', { name: 'Payouts' });
    for (const text of ['10000x', '100x', '50x', '20x', '10x']) expect(legend).toHaveTextContent(text);
    expect(legend).toHaveTextContent(/jackpot/i);
  });

  test('slots with motion: reels spin, then the win is paid', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    const reels = spinReels(createRng(11));
    renderCasino({ rng: createRng(11), storage: fakeStorage() });
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.getByRole('button', { name: 'Spinning…' })).toBeDisabled();
    expect(chips()).toBe(990);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole('button', { name: 'Spin' })).toBeEnabled();
    expect(chips()).toBe(990 + slotPayout(reels, 10));
  });

  test('roulette with motion: the ball ends in the winning pocket', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    const result = spinWheel(createRng(5));
    renderCasino({ rng: createRng(5), storage: fakeStorage() });
    fireEvent.click(screen.getByRole('button', { name: 'Roulette' }));
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.getByRole('button', { name: 'Spinning…' })).toBeDisabled();
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByTestId('ball')).toHaveAttribute('data-pocket', String(result));
    expect(chips()).toBe(1000 - 10 + roulettePayout({ type: 'red' }, result, 10));
  });
});
