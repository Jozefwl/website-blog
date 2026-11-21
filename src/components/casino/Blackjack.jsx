import { useState } from 'react';
import { createDeck, dealerPlay, handValue, isBlackjack, settle, shuffle } from '../../lib/casino/blackjack.js';
import BetField, { toBet } from './BetField.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './casino.module.css';

function Hand({ label, cards, hideHole = false }) {
  const { t } = useLang();
  return (
    <div>
      <span className={styles.field}>
        {label}
        {!hideHole && cards.length > 0 && ` (${handValue(cards).total})`}
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

// One player against the dealer. Dealer stands on all 17s, blackjack pays 3:2 (rounded down).
export default function Blackjack({ chips, rng, onChange }) {
  const { t } = useLang();
  const [bet, setBet] = useState('10');
  const [round, setRound] = useState({ phase: 'bet', player: [], dealer: [], deck: [], stake: 0 });
  const [message, setMessage] = useState({ key: 'casino.blackjack.intro' });
  const amount = toBet(bet);

  function finish(player, dealer, deck, stake) {
    const back = Math.floor(settle(player, dealer, stake));
    chips.give(back);
    setRound({ phase: 'done', player, dealer, deck, stake });
    setMessage(
      back > stake
        ? { key: 'casino.blackjack.win', vars: { amount: back - stake } }
        : { key: back === stake ? 'casino.blackjack.push' : 'casino.blackjack.lose' },
    );
    onChange();
  }

  function deal() {
    if (!chips.take(amount)) return;
    const deck = shuffle(createDeck(), rng);
    const player = [deck[0], deck[2]];
    const dealer = [deck[1], deck[3]];
    const rest = deck.slice(4);
    onChange();
    if (isBlackjack(player) || isBlackjack(dealer)) {
      finish(player, dealer, rest, amount);
      return;
    }
    setRound({ phase: 'play', player, dealer, deck: rest, stake: amount });
    setMessage({ key: 'casino.blackjack.prompt' });
  }

  function hit() {
    const player = [...round.player, round.deck[0]];
    const deck = round.deck.slice(1);
    if (handValue(player).total > 21) finish(player, round.dealer, deck, round.stake);
    else setRound({ ...round, player, deck });
  }

  function stand() {
    const { hand: dealer, deck } = dealerPlay(round.dealer, round.deck);
    finish(round.player, dealer, deck, round.stake);
  }

  const playing = round.phase === 'play';

  return (
    <section className={styles.panel} aria-labelledby="bj-title">
      <h2 id="bj-title" className={styles.title}>
        {t('casino.blackjack.title')}
      </h2>
      {round.phase !== 'bet' && (
        <>
          <Hand label={t('casino.blackjack.dealer')} cards={round.dealer} hideHole={playing} />
          <Hand label={t('casino.blackjack.you')} cards={round.player} />
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
    </section>
  );
}
