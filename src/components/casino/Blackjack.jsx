import { useState } from 'react';
import { canSplit, createDeck, dealerPlay, handValue, isBlackjack, settle, shuffle } from '../../lib/casino/blackjack.js';
import BetField, { toBet } from './BetField.jsx';
import DoubleOrNothing from './DoubleOrNothing.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './casino.module.css';

function Hand({ label, cards, hideHole = false, active = false, outcome }) {
  const { t } = useLang();
  return (
    <div className={active ? styles.activeHand : undefined}>
      <span className={styles.field}>
        {label}
        {!hideHole && cards.length > 0 && ` (${handValue(cards).total})`}
        {outcome && ` · ${outcome}`}
      </span>
      <div className={styles.hand}>
        {cards.map((c, i) =>
          hideHole && i === 1 ? (
            <span key={i} className={`${styles.card} ${styles.hidden}`} aria-label={t('casino.blackjack.hiddenCard')}>
              ??
            </span>
          ) : (
            <span key={i} className={`${styles.card} ${c.suit === '♥' || c.suit === '♦' ? styles.red : ''}`}>
              {c.rank}
              {c.suit}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

const done = (cards) => handValue(cards).total >= 21; // bust or 21 stands by itself

// One player against the dealer. Dealer stands on all 17s, blackjack pays 3:2 (rounded down).
// Two ten-value cards (= 20) can be split into two hands, each with its own bet; a 21 on a
// split hand is not a blackjack. `deckFactory` lets tests stack the deck.
export default function Blackjack({
  chips,
  rng,
  onChange,
  onWin = () => {},
  onRoundStart = () => {},
  offer,
  onAcceptOffer,
  onDeclineOffer,
  deckFactory,
}) {
  const { t } = useLang();
  const [bet, setBet] = useState('10');
  // phase: bet | play | done. hands: [{ cards, stake, outcome? }], active: index of the hand in play.
  const [round, setRound] = useState({ phase: 'bet', hands: [], active: 0, dealer: [], deck: [], split: false });
  const [message, setMessage] = useState({ key: 'casino.blackjack.intro' });
  const amount = toBet(bet);

  function finish(hands, dealerStart, deck, split) {
    // The dealer only draws if at least one hand is still alive.
    const alive = hands.some((h) => handValue(h.cards).total <= 21);
    const dealer = alive && !(hands.length === 1 && isBlackjack(hands[0].cards)) ? dealerPlay(dealerStart, deck).hand : dealerStart;
    let back = 0;
    let staked = 0;
    const settled = hands.map((h) => {
      const credit = Math.floor(settle(h.cards, dealer, h.stake, { split }));
      back += credit;
      staked += h.stake;
      const outcome = credit > h.stake ? 'handWon' : credit === h.stake ? 'handPush' : 'handLost';
      return { ...h, outcome };
    });
    chips.give(back);
    setRound({ phase: 'done', hands: settled, active: -1, dealer, deck, split });
    const profit = back - staked;
    setMessage(
      profit > 0
        ? { key: 'casino.blackjack.win', vars: { amount: profit } }
        : { key: profit === 0 ? 'casino.blackjack.push' : 'casino.blackjack.lose' },
    );
    onChange();
    onWin(profit);
  }

  // Move to the next hand that still needs a decision, or let the dealer play.
  function advance(hands, from, dealer, deck, split) {
    const next = hands.findIndex((h, i) => i > from && !done(h.cards));
    if (next === -1) finish(hands, dealer, deck, split);
    else setRound({ phase: 'play', hands, active: next, dealer, deck, split });
  }

  function deal() {
    if (!chips.take(amount)) return;
    onRoundStart();
    const deck = deckFactory ? deckFactory() : shuffle(createDeck(), rng);
    const player = [deck[0], deck[2]];
    const dealer = [deck[1], deck[3]];
    const rest = deck.slice(4);
    const hands = [{ cards: player, stake: amount }];
    onChange();
    if (isBlackjack(player) || isBlackjack(dealer)) {
      finish(hands, dealer, rest, false);
      return;
    }
    setRound({ phase: 'play', hands, active: 0, dealer, deck: rest, split: false });
    setMessage({ key: 'casino.blackjack.prompt' });
  }

  function hit() {
    const { hands, active, deck, dealer, split } = round;
    const updated = hands.map((h, i) => (i === active ? { ...h, cards: [...h.cards, deck[0]] } : h));
    const rest = deck.slice(1);
    if (done(updated[active].cards)) advance(updated, active, dealer, rest, split);
    else setRound({ ...round, hands: updated, deck: rest });
  }

  function stand() {
    advance(round.hands, round.active, round.dealer, round.deck, round.split);
  }

  function split() {
    const [{ cards, stake }] = round.hands;
    if (!chips.take(stake)) return;
    const { deck } = round;
    const hands = [
      { cards: [cards[0], deck[0]], stake },
      { cards: [cards[1], deck[1]], stake },
    ];
    onChange();
    // A hand that hits 21 straight away stands by itself.
    advance(hands, -1, round.dealer, deck.slice(2), true);
  }

  const playing = round.phase === 'play';
  const canSplitNow =
    playing && round.hands.length === 1 && canSplit(round.hands[0].cards) && chips.canBet(round.hands[0].stake);
  const handLabel = (i) =>
    round.hands.length > 1 ? t('casino.blackjack.hand', { n: i + 1 }) : t('casino.blackjack.you');

  return (
    <section className={styles.panel} aria-labelledby="bj-title">
      <h2 id="bj-title" className={styles.title}>
        {t('casino.blackjack.title')}
      </h2>
      {round.phase !== 'bet' && (
        <>
          <Hand label={t('casino.blackjack.dealer')} cards={round.dealer} hideHole={playing} />
          {round.hands.map((h, i) => (
            <Hand
              key={i}
              label={handLabel(i)}
              cards={h.cards}
              active={playing && round.hands.length > 1 && i === round.active}
              outcome={round.hands.length > 1 && h.outcome ? t(`casino.blackjack.${h.outcome}`) : undefined}
            />
          ))}
        </>
      )}
      <div className={styles.controls}>
        {playing ? (
          <>
            <button type="button" className={styles.button} onClick={hit}>
              {t('casino.blackjack.hit')}
            </button>
            <button type="button" className={styles.button} onClick={stand}>
              {t('casino.blackjack.stand')}
            </button>
            {canSplitNow && (
              <button type="button" className={styles.button} onClick={split}>
                {t('casino.blackjack.split')}
              </button>
            )}
          </>
        ) : (
          <>
            <BetField value={bet} onChange={setBet} />
            <button type="button" className={styles.button} onClick={deal} disabled={!chips.canBet(amount)}>
              {t('casino.blackjack.deal')}
            </button>
          </>
        )}
      </div>
      <p className={styles.lcd} aria-live="polite">
        {t(message.key, message.vars)}
      </p>
      {offer && <DoubleOrNothing onAccept={onAcceptOffer} onDecline={onDeclineOffer} />}
    </section>
  );
}
