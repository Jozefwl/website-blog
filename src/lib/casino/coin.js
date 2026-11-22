// Double or nothing: one fair coin flip.
export const COIN_SIDES = ['heads', 'tails'];

export const flipCoin = (rng) => (rng() < 0.5 ? 'heads' : 'tails');
