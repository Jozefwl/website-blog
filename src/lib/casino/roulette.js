import { randomInt } from './rng.js';

// European single-zero wheel.
const REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export const spinWheel = (rng) => randomInt(rng, 37);

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
