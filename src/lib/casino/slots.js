import { randomInt } from './rng.js';

// Server-part reels. The rack screw is the jackpot.
export const SLOT_SYMBOLS = ['cpu', 'ram', 'drive', 'led', 'fan', 'screw'];

export const spinReels = (rng) => [0, 1, 2].map(() => SLOT_SYMBOLS[randomInt(rng, SLOT_SYMBOLS.length)]);

// Total credited back for a spin (0 = lost the bet).
export function slotPayout(reels, bet) {
  const [a, b, c] = reels;
  if (a === b && b === c) return a === 'screw' ? bet * 50 : bet * 10;
  if (a === b || b === c || a === c) return bet;
  return 0;
}
