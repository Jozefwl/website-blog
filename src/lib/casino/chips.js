// Play-money chip balance shared by all casino games, kept in the visitor's browser.
// Storage can be missing, blocked (throws) or hold junk; the balance then lives in memory.
export function createChipStore(storage, { start = 1000, key = 'casino.chips' } = {}) {
  let balance = read();

  function read() {
    try {
      const raw = storage?.getItem(key);
      if (raw == null || !/^\d+$/.test(raw)) return start;
      return Number(raw);
    } catch {
      return start;
    }
  }

  function write() {
    try {
      storage?.setItem(key, String(balance));
    } catch {
      // Blocked storage: keep playing in memory.
    }
  }

  const canBet = (amount) => Number.isInteger(amount) && amount > 0 && amount <= balance;

  return {
    get: () => balance,
    canBet,
    take(amount) {
      if (!canBet(amount)) return false;
      balance -= amount;
      write();
      return true;
    },
    give(amount) {
      if (!Number.isInteger(amount) || amount <= 0) return;
      balance += amount;
      write();
    },
  };
}
