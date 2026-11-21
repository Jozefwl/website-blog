// Server-part reels. Cheap parts are common, the rack screw (jackpot) is rare.
// Weights are out of 100 per reel; with this table a spin pays back ~0.89x on average.
export const SLOT_WEIGHTS = { led: 32, fan: 27, drive: 20, ram: 12, cpu: 7, screw: 2 };
export const SLOT_SYMBOLS = Object.keys(SLOT_WEIGHTS);

// Only three of a kind pays. Listed in legend order (best first).
export const SLOT_PAYTABLE = [
  { symbol: 'screw', multiplier: 10000, jackpot: true },
  { symbol: 'cpu', multiplier: 100 },
  { symbol: 'ram', multiplier: 50 },
  { symbol: 'drive', multiplier: 20 },
  { symbol: 'fan', multiplier: 10 },
  { symbol: 'led', multiplier: 10 },
];
const MULTIPLIER = Object.fromEntries(SLOT_PAYTABLE.map((row) => [row.symbol, row.multiplier]));
const TOTAL_WEIGHT = SLOT_SYMBOLS.reduce((sum, s) => sum + SLOT_WEIGHTS[s], 0);

function pickSymbol(rng) {
  let roll = rng() * TOTAL_WEIGHT;
  for (const symbol of SLOT_SYMBOLS) {
    roll -= SLOT_WEIGHTS[symbol];
    if (roll < 0) return symbol;
  }
  return SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1];
}

export const spinReels = (rng) => [pickSymbol(rng), pickSymbol(rng), pickSymbol(rng)];

// Total credited back for a spin (0 = lost the bet).
export function slotPayout([a, b, c], bet) {
  return a === b && b === c ? bet * (MULTIPLIER[a] ?? 0) : 0;
}

// Average amount paid back per chip bet.
export function expectedSlotReturn() {
  return SLOT_SYMBOLS.reduce((sum, s) => sum + (SLOT_WEIGHTS[s] / TOTAL_WEIGHT) ** 3 * (MULTIPLIER[s] ?? 0), 0);
}
