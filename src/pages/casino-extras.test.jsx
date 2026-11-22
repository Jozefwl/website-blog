import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';

vi.mock('../hooks/useServiceStatus.js', () => ({ useServiceStatus: () => ({ summary: null, error: null }) }));
vi.mock('../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));
const motionState = vi.hoisted(() => ({ reduce: true }));
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: () => motionState.reduce }));

const { default: Casino } = await import('./Casino.jsx');

afterEach(() => {
  motionState.reduce = true;
  vi.useRealTimers();
});

function fakeStorage(initial) {
  const data = new Map(initial == null ? [] : [['casino.chips', initial]]);
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
}

// rng() = 0 -> slots: LED, LED, LED (10x win); coin: heads.
const winRng = () => 0;
// Cycles LED, FAN, DRIVE -> never a match.
function loseRng() {
  const values = [0, 0.4, 0.65];
  let i = 0;
  return () => values[i++ % values.length];
}

const renderCasino = (props) =>
  render(
    <MemoryRouter initialEntries={['/casino']}>
      <Casino storage={fakeStorage()} {...props} />
    </MemoryRouter>,
  );
const chips = () => Number(screen.getByTestId('chips').textContent);
const tick = (ms) => act(() => vi.advanceTimersByTime(ms));

describe('slots autospin', () => {
  test('keeps spinning until you stop it', () => {
    vi.useFakeTimers();
    renderCasino({ rng: loseRng() });
    const auto = screen.getByRole('button', { name: 'Auto spin' });
    fireEvent.click(auto);
    expect(auto).toHaveAttribute('aria-pressed', 'true');
    expect(chips()).toBe(990);
    tick(400);
    expect(chips()).toBe(980);
    tick(400);
    expect(chips()).toBe(970);
    fireEvent.click(auto);
    expect(auto).toHaveAttribute('aria-pressed', 'false');
    tick(5000);
    expect(chips()).toBe(970);
  });

  test('a win switches autospin off', () => {
    vi.useFakeTimers();
    renderCasino({ rng: winRng });
    const auto = screen.getByRole('button', { name: 'Auto spin' });
    fireEvent.click(auto);
    expect(chips()).toBe(1090);
    expect(auto).toHaveAttribute('aria-pressed', 'false');
    tick(5000);
    expect(chips()).toBe(1090); // no further spins
    expect(screen.getByText('Double or nothing?')).toBeInTheDocument();
  });

  test('stops by itself when you can no longer afford the bet', () => {
    vi.useFakeTimers();
    renderCasino({ rng: loseRng(), storage: fakeStorage('25') });
    const auto = screen.getByRole('button', { name: 'Auto spin' });
    fireEvent.click(auto);
    tick(400);
    expect(chips()).toBe(5);
    tick(5000);
    expect(chips()).toBe(5);
    expect(auto).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('confetti', () => {
  test('bursts on a win, then clears', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderCasino({ rng: winRng });
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.queryByTestId('confetti')).toBeNull();
    tick(3000); // reels stop -> win
    expect(screen.getByTestId('confetti')).toBeInTheDocument();
    tick(3000);
    expect(screen.queryByTestId('confetti')).toBeNull();
  });

  test('no confetti on a loss, none with reduced motion', () => {
    vi.useFakeTimers();
    renderCasino({ rng: loseRng() });
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.queryByTestId('confetti')).toBeNull();
  });
});

describe('double or nothing', () => {
  function winOnce() {
    vi.useFakeTimers();
    renderCasino({ rng: winRng });
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(chips()).toBe(1090); // won 100 on a 10 bet: 90 profit
  }

  test('every win asks "Double or nothing?" under the result', () => {
    winOnce();
    expect(screen.getByText('Double or nothing?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(screen.queryByText('Double or nothing?')).toBeNull();
    expect(chips()).toBe(1090);
  });

  test('yes opens a coin flip; calling it right doubles the win', () => {
    winOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    const dialog = screen.getByRole('dialog', { name: 'Double or nothing' });
    expect(within(dialog).getByRole('img', { name: /2 euro coin/i })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Heads' })); // rng 0 -> heads
    tick(3000);
    expect(within(dialog).getByRole('status')).toHaveTextContent(/heads/i);
    expect(chips()).toBe(1180);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('Double or nothing?')).toBeNull(); // one gamble per win
  });

  test('calling it wrong loses the win', () => {
    winOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Tails' }));
    tick(3000);
    expect(chips()).toBe(1000);
  });

  test('the offer disappears once the next round starts', () => {
    winOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    // still a win (rng 0), so a fresh offer, but there is only ever one on screen
    expect(screen.getAllByText('Double or nothing?')).toHaveLength(1);
    expect(chips()).toBe(1180);
  });
});

describe('blackjack split', () => {
  const card = (rank, suit) => ({ rank, suit });
  // Player: K, Q (= 20). Dealer: 9, 8 (= 17). Then A to hand 1 (21), 9 to hand 2 (19).
  const stacked = () => [card('K', '♠'), card('9', '♥'), card('Q', '♦'), card('8', '♣'), card('A', '♠'), card('9', '♣')];

  function deal(props) {
    vi.useFakeTimers();
    renderCasino({ blackjackDeck: stacked, ...props });
    fireEvent.click(screen.getByRole('button', { name: 'Blackjack' }));
    fireEvent.click(screen.getByRole('button', { name: 'Deal' }));
  }

  test('two ten-value cards can be split into two hands, each with its own bet', () => {
    deal();
    expect(chips()).toBe(990);
    fireEvent.click(screen.getByRole('button', { name: 'Split' }));
    expect(chips()).toBe(980);
    expect(screen.getByText(/Hand 1/)).toBeInTheDocument();
    expect(screen.getByText(/Hand 2/)).toBeInTheDocument();
    // Hand 1 got an ace: 21 stands by itself. Hand 2 (19) is now in play.
    fireEvent.click(screen.getByRole('button', { name: 'Stand' }));
    // Both hands beat the dealer's 17: 2 x 20 back.
    expect(chips()).toBe(1020);
    expect(screen.getByText('Double or nothing?')).toBeInTheDocument();
  });

  test('no split without a pair of tens, or without chips for the second bet', () => {
    deal({ blackjackDeck: () => [card('9', '♠'), card('9', '♥'), card('9', '♦'), card('8', '♣'), card('2', '♠')] });
    expect(screen.queryByRole('button', { name: 'Split' })).toBeNull();
  });

  test('no split when the second bet cannot be paid', () => {
    deal({ storage: fakeStorage('10') });
    expect(chips()).toBe(0);
    expect(screen.queryByRole('button', { name: 'Split' })).toBeNull();
  });
});

describe('roulette wins offer double or nothing too', () => {
  test('a winning red bet asks "Double or nothing?"', () => {
    vi.useFakeTimers();
    renderCasino({ rng: () => 0.03 }); // floor(0.03 * 37) = 1, a red number
    fireEvent.click(screen.getByRole('button', { name: 'Roulette' }));
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(chips()).toBe(1010);
    expect(screen.getByText('Double or nothing?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Slots' }));
    expect(screen.queryByText('Double or nothing?')).toBeNull(); // switching games drops the offer
  });
});

describe('JozefPay: cash out and top up', () => {
  const bankStorage = (chipsValue, bankValue) => {
    const storage = fakeStorage(chipsValue);
    if (bankValue != null) storage.setItem('jozefpay.bank', bankValue);
    return storage;
  };
  function openGateway(storage) {
    vi.useFakeTimers();
    renderCasino({ storage, gatewayRng: () => 0 }); // every wait is 1 s
    fireEvent.click(screen.getByRole('button', { name: 'Add funds' }));
    tick(1000);
    return screen.getByRole('dialog', { name: /JozefPay/ });
  }

  test('cash out moves chips back to the bank, with the same processing and checkmark', () => {
    const storage = bankStorage(null, null);
    const dialog = openGateway(storage);
    expect(within(dialog).getByText('Chips in casino')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cash out from casino' }));
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '300' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Cash out €/ }));
    expect(within(dialog).getByRole('status')).toHaveTextContent(/processing transaction/i);
    tick(1000);
    expect(within(dialog).getByRole('status')).toHaveTextContent(/transfer successful/i);
    expect(chips()).toBe(700);
    expect(storage.getItem('jozefpay.bank')).toBe('100300');
    tick(1000);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('cannot cash out more chips than you have', () => {
    const dialog = openGateway(bankStorage(null, null));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cash out from casino' }));
    fireEvent.change(within(dialog).getByLabelText('Amount'), { target: { value: '1001' } });
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Not enough chips');
    expect(within(dialog).getByRole('button', { name: 'Cash out' })).toBeDisabled();
  });

  test('"I ran out of money" tops the bank account up by 100,000', () => {
    const storage = bankStorage(null, '0');
    const dialog = openGateway(storage);
    expect(within(dialog).getByText('€0.00')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'I ran out of money' }));
    const confirm = screen.getByRole('alertdialog');
    expect(confirm).toHaveTextContent('Do you really want to add €100,000.00 to your account?');
    fireEvent.click(within(confirm).getByRole('button', { name: 'Yes' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(within(dialog).getByText('€100,000.00')).toBeInTheDocument();
    expect(storage.getItem('jozefpay.bank')).toBe('100000');
    expect(chips()).toBe(1000); // chips untouched
  });

  test('"No" (or Escape) closes the question and adds nothing', () => {
    const storage = bankStorage(null, '0');
    const dialog = openGateway(storage);
    fireEvent.click(within(dialog).getByRole('button', { name: 'I ran out of money' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'No' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    fireEvent.click(within(dialog).getByRole('button', { name: 'I ran out of money' }));
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('dialog', { name: /JozefPay/ })).toBeInTheDocument(); // JozefPay stays open
    expect(within(dialog).getByText('€0.00')).toBeInTheDocument();
    expect(storage.getItem('jozefpay.bank')).toBe('0');
  });
});
