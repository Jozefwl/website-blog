import { createChipStore } from './chips.js';

// JozefPay: the (fictional) payment gateway behind the casino's "Add funds" button.
// The "bank account" is play money too, kept in the visitor's browser next to the chips.
export const BANK_START = 100000;

export const createBank = (storage) => createChipStore(storage, { start: BANK_START, key: 'jozefpay.bank' });

// Gateways are slow. This one is slow on purpose: 5 to 10 seconds.
export const gatewayDelay = (rng) => 5000 + Math.floor(rng() * 5001);

// Whole euros only; anything else is not a valid amount.
export function parseAmount(raw) {
  const text = String(raw).trim();
  return /^\d+$/.test(text) && Number(text) > 0 ? Number(text) : NaN;
}

export const formatMoney = (n) => `€${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
