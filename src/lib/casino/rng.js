// Seeded random numbers in [0, 1) (mulberry32), so games and tests are reproducible.
export function createRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const defaultRng = Math.random;

// Integer in [0, n).
export const randomInt = (rng, n) => Math.floor(rng() * n);
