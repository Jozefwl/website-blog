import { randomInt } from './rng.js';

// European single-zero wheel.
const REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export const spinWheel = (rng) => randomInt(rng, 37);

// Pocket order around a European wheel, clockwise from 0.
export const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28,
  12, 35, 3, 26,
];
export const POCKET_DEG = 360 / WHEEL_ORDER.length;

// Clockwise angle of a number's pocket centre, measured from the 0 pocket.
export const pocketAngle = (n) => WHEEL_ORDER.indexOf(n) * POCKET_DEG;

export const colorOf = (n) => (n === 0 ? 'green' : REDS.has(n) ? 'red' : 'black');

function wins(bet, n) {
  if (bet.type === 'number') return n === bet.value;
  if (n === 0) return false; // zero loses every outside bet
  switch (bet.type) {
    case 'red':
    case 'black':
      return colorOf(n) === bet.type;
    case 'odd':
      return n % 2 === 1;
    case 'even':
      return n % 2 === 0;
    case 'low':
      return n <= 18;
    case 'high':
      return n >= 19;
    default:
      return false;
  }
}

// Total credited back: a straight-up number pays 35:1 (36x back), outside bets pay 1:1.
export function roulettePayout(bet, result, amount) {
  if (!wins(bet, result)) return 0;
  return bet.type === 'number' ? amount * 36 : amount * 2;
}
