import { createChipStore } from './chips.js';

// JozefPay: the (fictional) payment gateway behind the casino's "Add funds" button.
// The "bank account" is play money too, kept in the visitor's browser next to the chips.
export const BANK_START = 100000;

export const createBank = (storage) => createChipStore(storage, { start: BANK_START, key: 'jozefpay.bank' });

// Gateways are slow. This one is slow on purpose: 1 to 5 seconds.
export const gatewayDelay = (rng) => 1000 + Math.floor(rng() * 4001);

// Whole euros only; anything else is not a valid amount.
export function parseAmount(raw) {
  const text = String(raw).trim();
  return /^\d+$/.test(text) && Number(text) > 0 ? Number(text) : NaN;
}

// English: €100,000.00. Slovak: 100 000,00 € (no-break spaces, so the amount never wraps).
export function formatMoney(n, lang = 'en') {
  const [whole, cents] = n.toFixed(2).split('.');
  if (lang === 'sk') return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')},${cents}\u00a0€`;
  return `€${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${cents}`;
}
