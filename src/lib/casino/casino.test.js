import { describe, expect, test } from 'vitest';
import { createRng } from './rng.js';
import { createChipStore } from './chips.js';
import { SLOT_PAYTABLE, SLOT_SYMBOLS, expectedSlotReturn, slotPayout, spinReels } from './slots.js';
import { createDeck, dealerPlay, handValue, isBlackjack, settle, shuffle } from './blackjack.js';
import { WHEEL_ORDER, colorOf, pocketAngle, roulettePayout, spinWheel } from './roulette.js';
import { ballPosition, planBallPath } from './wheelMotion.js';

const card = (rank, suit = '♠') => ({ rank, suit });
const hand = (...ranks) => ranks.map((r) => card(r));

function fakeStorage(initial) {
  const data = new Map(initial == null ? [] : [['casino.chips', initial]]);
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)), data };
}

describe('rng', () => {
  test('same seed, same sequence, all in [0, 1)', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, a);
    expect(seqA).toEqual(Array.from({ length: 5 }, b));
    for (const v of seqA) expect(v >= 0 && v < 1).toBe(true);
  });
});

describe('chips', () => {
  test('starts at 1000 and takes valid bets only', () => {
    const chips = createChipStore(fakeStorage());
    expect(chips.get()).toBe(1000);
    expect(chips.take(100)).toBe(true);
    expect(chips.get()).toBe(900);
    for (const bad of [0, -5, 1.5, 901, NaN, '10']) {
      expect(chips.take(bad)).toBe(false);
    }
    expect(chips.get()).toBe(900);
  });

  test('give and persist', () => {
    const storage = fakeStorage();
    const chips = createChipStore(storage);
    chips.take(100);
    chips.give(50);
    expect(chips.get()).toBe(950);
    expect(storage.data.get('casino.chips')).toBe('950');
    expect(createChipStore(storage).get()).toBe(950);
  });

  test.each(['abc', '-5', '1.5', ''])('corrupt stored value %j falls back to 1000', (stored) => {
    expect(createChipStore(fakeStorage(stored)).get()).toBe(1000);
  });

  test('throwing or missing storage still works in memory', () => {
    const throwing = {
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
    };
    for (const storage of [throwing, null]) {
      const chips = createChipStore(storage);
      expect(chips.get()).toBe(1000);
      expect(chips.take(10)).toBe(true);
      expect(chips.get()).toBe(990);
    }
  });

  test('addFunds tops up by 1000 and persists', () => {
    const storage = fakeStorage('0');
    const chips = createChipStore(storage);
    expect(chips.canBet(1)).toBe(false);
    chips.addFunds();
    chips.addFunds();
    expect(chips.get()).toBe(2000);
    expect(createChipStore(storage).get()).toBe(2000);
  });
});

describe('slots', () => {
  test.each([
    [['screw', 'screw', 'screw'], 100000], // jackpot 10000x
    [['cpu', 'cpu', 'cpu'], 1000], // 100x
    [['ram', 'ram', 'ram'], 500], // 50x
    [['drive', 'drive', 'drive'], 200], // 20x
    [['fan', 'fan', 'fan'], 100], // 10x
    [['led', 'led', 'led'], 100], // 10x
    [['cpu', 'cpu', 'fan'], 0], // pairs pay nothing
    [['cpu', 'ram', 'fan'], 0],
  ])('%j with bet 10 pays %d', (reels, expected) => {
    expect(slotPayout(reels, 10)).toBe(expected);
  });

  test('the legend lists every winning line with its multiplier', () => {
    expect(SLOT_PAYTABLE.map(({ symbol, multiplier }) => [symbol, multiplier])).toEqual([
      ['screw', 10000],
      ['cpu', 100],
      ['ram', 50],
      ['drive', 20],
      ['fan', 10],
      ['led', 10],
    ]);
  });

  test('spin returns three known symbols', () => {
    const reels = spinReels(createRng(1));
    expect(reels).toHaveLength(3);
    for (const s of reels) expect(SLOT_SYMBOLS).toContain(s);
  });

  test('the screw is rare and the LED is common', () => {
    const rng = createRng(99);
    const counts = Object.fromEntries(SLOT_SYMBOLS.map((s) => [s, 0]));
    for (let i = 0; i < 20000; i += 1) counts[spinReels(rng)[0]] += 1;
    expect(counts.screw / 20000).toBeLessThan(0.04);
    expect(counts.led / 20000).toBeGreaterThan(0.25);
  });

  test('the house keeps an edge (average payback below the bet)', () => {
    expect(expectedSlotReturn()).toBeLessThan(1);
    expect(expectedSlotReturn()).toBeGreaterThan(0.7);
  });
});

describe('blackjack', () => {
  test('a deck has 52 unique cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map((c) => c.rank + c.suit)).size).toBe(52);
  });

  test('shuffle is deterministic per seed and keeps every card', () => {
    const deck = createDeck();
    const a = shuffle(deck, createRng(7));
    expect(a).toEqual(shuffle(deck, createRng(7)));
    expect(a).not.toEqual(deck);
    expect(deck).toEqual(createDeck()); // input untouched
    expect(new Set(a.map((c) => c.rank + c.suit)).size).toBe(52);
  });

  test('hand values', () => {
    expect(handValue(hand('A', 'K'))).toEqual({ total: 21, soft: true });
    expect(handValue(hand('A', 'A', '9')).total).toBe(21);
    expect(handValue(hand('K', 'Q', '5')).total).toBe(25);
    expect(handValue(hand('A', '9', 'K'))).toEqual({ total: 20, soft: false });
    expect(isBlackjack(hand('A', 'Q'))).toBe(true);
    expect(isBlackjack(hand('7', '7', '7'))).toBe(false);
  });

  test('dealer stands on soft 17 and draws below 17', () => {
    const deck = hand('5', '9');
    expect(dealerPlay(hand('A', '6'), deck).hand).toHaveLength(2);
    const drawn = dealerPlay(hand('10', '2'), deck);
    expect(drawn.hand.map((c) => c.rank)).toEqual(['10', '2', '5']);
    expect(drawn.deck.map((c) => c.rank)).toEqual(['9']);
  });

  test.each([
    ['bust', hand('K', 'Q', '5'), hand('10', '7'), 0],
    ['blackjack vs 20', hand('A', 'K'), hand('10', 'Q'), 25],
    ['both blackjack', hand('A', 'K'), hand('A', 'Q'), 10],
    ['20 vs dealer bust', hand('10', 'Q'), hand('10', '6', '9'), 20],
    ['push 18', hand('10', '8'), hand('9', '9'), 10],
    ['17 vs 19', hand('10', '7'), hand('10', '9'), 0],
    ['dealer blackjack vs 21 in three', hand('7', '7', '7'), hand('A', 'K'), 0],
  ])('settle: %s', (_name, player, dealer, expected) => {
    expect(settle(player, dealer, 10)).toBe(expected);
  });
});

describe('roulette', () => {
  test('colours', () => {
    expect(colorOf(0)).toBe('green');
    expect(colorOf(1)).toBe('red');
    expect(colorOf(2)).toBe('black');
    expect(colorOf(36)).toBe('red');
  });

  test.each([
    [{ type: 'number', value: 7 }, 7, 360],
    [{ type: 'number', value: 7 }, 8, 0],
    [{ type: 'red' }, 1, 20],
    [{ type: 'red' }, 0, 0],
    [{ type: 'black' }, 2, 20],
    [{ type: 'odd' }, 0, 0],
    [{ type: 'even' }, 0, 0],
    [{ type: 'even' }, 4, 20],
    [{ type: 'low' }, 18, 20],
    [{ type: 'high' }, 18, 0],
    [{ type: 'high' }, 19, 20],
  ])('%j on %d with 10 pays %d', (bet, result, expected) => {
    expect(roulettePayout(bet, result, 10)).toBe(expected);
  });

  test('wheel lands on 0..36', () => {
    const rng = createRng(3);
    for (let i = 0; i < 50; i += 1) {
      const n = spinWheel(rng);
      expect(Number.isInteger(n) && n >= 0 && n <= 36).toBe(true);
    }
  });
});

describe('roulette wheel layout', () => {
  test('the European wheel holds every number once, starting at 0', () => {
    expect(WHEEL_ORDER).toHaveLength(37);
    expect(new Set(WHEEL_ORDER).size).toBe(37);
    expect([...WHEEL_ORDER].sort((a, b) => a - b)).toEqual(Array.from({ length: 37 }, (_, i) => i));
    expect(WHEEL_ORDER.slice(0, 4)).toEqual([0, 32, 15, 19]);
  });

  test('each number has its pocket angle on the wheel', () => {
    expect(pocketAngle(0)).toBe(0);
    expect(pocketAngle(32)).toBeCloseTo(360 / 37);
    expect(pocketAngle(26)).toBeCloseTo((36 * 360) / 37);
  });
});

describe('roulette ball path', () => {
  const geometry = { track: 86, rest: 64 };
  const relative = (pos) => (((pos.ball - pos.wheel) % 360) + 360) % 360;

  test.each([0, 19, 26, 32])('the ball rolls into pocket %d by itself (no teleport needed)', (result) => {
    const plan = planBallPath({ result, start: { wheel: 40, ball: 300 }, rng: createRng(result + 1), ...geometry });
    const end = ballPosition(plan, 1);
    expect(relative(end)).toBeCloseTo(pocketAngle(result), 6);
    expect(end.r).toBeCloseTo(geometry.rest, 6);
  });

  test('it starts on the outer track where the last spin left it', () => {
    const plan = planBallPath({ result: 7, start: { wheel: 40, ball: 300 }, rng: createRng(2), ...geometry });
    const start = ballPosition(plan, 0);
    expect(start.wheel).toBeCloseTo(40);
    expect(start.ball).toBeCloseTo(300);
    expect(start.r).toBeCloseTo(geometry.track);
  });

  test('once caught it rides with the wheel: the last 15% keeps the pocket', () => {
    const plan = planBallPath({ result: 7, start: { wheel: 0, ball: 0 }, rng: createRng(3), ...geometry });
    for (const t of [0.86, 0.9, 0.95]) expect(relative(ballPosition(plan, t))).toBeCloseTo(pocketAngle(7), 6);
  });

  test('the ball never leaves the wheel, even mid-bounce', () => {
    const plan = planBallPath({ result: 12, start: { wheel: 0, ball: 0 }, rng: createRng(4), ...geometry });
    for (let i = 0; i <= 100; i += 1) {
      const { r } = ballPosition(plan, i / 100);
      expect(r).toBeGreaterThanOrEqual(geometry.rest - 0.001);
      expect(r).toBeLessThanOrEqual(geometry.track + 0.001);
    }
  });
});
