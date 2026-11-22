import { randomInt } from './rng.js';

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];

export const createDeck = () => SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));

// Fisher-Yates on a copy.
export function shuffle(cards, rng) {
  const out = [...cards];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = randomInt(rng, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const cardValue = (rank) => (rank === 'A' ? 1 : ['J', 'Q', 'K'].includes(rank) ? 10 : Number(rank));

// Aces count 11 when that does not bust the hand ("soft").
export function handValue(cards) {
  const hard = cards.reduce((sum, c) => sum + cardValue(c.rank), 0);
  const hasAce = cards.some((c) => c.rank === 'A');
  return hasAce && hard + 10 <= 21 ? { total: hard + 10, soft: true } : { total: hard, soft: false };
}

export const isBlackjack = (cards) => cards.length === 2 && handValue(cards).total === 21;

// Dealer draws below 17 and stands on every 17, soft included.
export function dealerPlay(hand, deck) {
  let h = [...hand];
  let d = [...deck];
  while (handValue(h).total < 17 && d.length > 0) {
    h = [...h, d[0]];
    d = d.slice(1);
  }
  return { hand: h, deck: d };
}

// Two ten-value cards (10, J, Q, K) = 20 can be split into two hands, one ten each.
export const canSplit = (cards) => cards.length === 2 && cards.every((c) => cardValue(c.rank) === 10);

// Total credited back for the round (0 = lost the bet, bet = push).
// A 21 on a split hand is not a blackjack: it pays like a normal win.
export function settle(player, dealer, bet, { split = false } = {}) {
  const p = handValue(player).total;
  const d = handValue(dealer).total;
  const playerBj = !split && isBlackjack(player);
  const dealerBj = isBlackjack(dealer);
  if (p > 21) return 0;
  if (playerBj && dealerBj) return bet;
  if (playerBj) return bet * 2.5;
  if (dealerBj) return 0;
  if (d > 21 || p > d) return bet * 2;
  if (p === d) return bet;
  return 0;
}
