import { describe, expect, test } from 'vitest';
import { createRng } from './rng.js';
import { createChipStore } from './chips.js';
import { SLOT_SYMBOLS, slotPayout, spinReels } from './slots.js';
import { createDeck, dealerPlay, handValue, isBlackjack, settle, shuffle } from './blackjack.js';
import { colorOf, roulettePayout, spinWheel } from './roulette.js';

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

  test('reboot refills to 1000', () => {
    const chips = createChipStore(fakeStorage('0'));
    expect(chips.get()).toBe(0);
    expect(chips.canBet(1)).toBe(false);
    chips.reboot();
    expect(chips.get()).toBe(1000);
  });
});

describe('slots', () => {
  test.each([
    [['screw', 'screw', 'screw'], 500],
    [['cpu', 'cpu', 'cpu'], 100],
    [['cpu', 'cpu', 'fan'], 10],
    [['fan', 'cpu', 'fan'], 10],
    [['cpu', 'ram', 'fan'], 0],
  ])('%j with bet 10 pays %d', (reels, expected) => {
    expect(slotPayout(reels, 10)).toBe(expected);
  });

  test('spin returns three known symbols', () => {
    const reels = spinReels(createRng(1));
    expect(reels).toHaveLength(3);
    for (const s of reels) expect(SLOT_SYMBOLS).toContain(s);
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
