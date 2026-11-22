import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import PageHeader from '../components/common/PageHeader.jsx';
import RackLink from '../components/common/RackLink.jsx';
import Blackjack from '../components/casino/Blackjack.jsx';
import Roulette from '../components/casino/Roulette.jsx';
import Slots from '../components/casino/Slots.jsx';
import JozefPay from '../components/casino/JozefPay.jsx';
import CoinFlip from '../components/casino/CoinFlip.jsx';
import Confetti from '../components/casino/Confetti.jsx';
import { createChipStore } from '../lib/casino/chips.js';
import { createBank } from '../lib/casino/gateway.js';
import casinoStyles from '../components/casino/casino.module.css';
import { useLang } from '../i18n/LanguageContext.jsx';
import styles from './Casino.module.css';

const GAMES = [
  { id: 'slots', Game: Slots },
  { id: 'blackjack', Game: Blackjack },
  { id: 'roulette', Game: Roulette },
];

function safeLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// Hidden page behind the loose screw. Play money only, kept in this browser.
// gatewayRng and blackjackDeck only exist so tests can pin JozefPay's waits and the blackjack deck.
export default function Casino({ rng = Math.random, storage, gatewayRng = Math.random, blackjackDeck }) {
  const { t } = useLang();
  const store = useMemo(() => (storage === undefined ? safeLocalStorage() : storage), [storage]);
  const chips = useMemo(() => createChipStore(store), [store]);
  const bank = useMemo(() => createBank(store), [store]);
  const [paying, setPaying] = useState(false);
  const [balance, setBalance] = useState(() => chips.get());
  const [gameId, setGameId] = useState('slots');
  const refresh = () => setBalance(chips.get());
  const reduceMotion = useReducedMotion();

  // Every win: a confetti burst and one "Double or nothing?" offer for that win's profit.
  const [offer, setOffer] = useState(null); // { amount } shown under the game's result
  const [gamble, setGamble] = useState(null); // { amount } while the coin-flip dialog is open
  const [burst, setBurst] = useState(0);
  const offerId = useRef(0);

  const celebrate = () => setBurst((n) => n + 1);
  const onWin = (profit) => {
    if (profit <= 0) return;
    celebrate();
    offerId.current += 1;
    setOffer({ amount: profit, id: offerId.current });
  };
  const onRoundStart = () => setOffer(null);
  const acceptOffer = () => {
    setGamble(offer);
    setOffer(null);
  };
  const settleGamble = (won) => {
    const { amount } = gamble;
    if (won) {
      chips.give(amount);
      celebrate();
    } else {
      chips.take(Math.min(amount, chips.get()));
    }
    refresh();
  };
  const switchGame = (id) => {
    setOffer(null);
    setGameId(id);
  };

  // Keep the easter egg out of search results.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const { Game } = GAMES.find((g) => g.id === gameId);

  return (
    <>
      <PageHeader tag="U?" title={t('casino.title')} subtitle={t('casino.subtitle')} />

      <div className={styles.bar}>
        <p className={styles.chips} aria-live="polite">
          {t('casino.chips')} <strong data-testid="chips">{balance}</strong>
        </p>
        <button
          type="button"
          className={casinoStyles.button}
          onClick={() => setPaying(true)}
        >
          {t('casino.addFunds')}
        </button>
      </div>

      {paying && (
        <JozefPay
          bank={bank}
          chips={chips}
          onPaid={refresh}
          delayRng={gatewayRng}
          onClose={() => setPaying(false)}
        />
      )}

      <div className={styles.tabs} role="group" aria-label={t('casino.games')}>
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={styles.tab}
            aria-pressed={g.id === gameId}
            onClick={() => switchGame(g.id)}
          >
            {t(`casino.${g.id}.title`)}
          </button>
        ))}
      </div>

      <Game
        chips={chips}
        rng={rng}
        onChange={refresh}
        onWin={onWin}
        onRoundStart={onRoundStart}
        offer={offer}
        onAcceptOffer={acceptOffer}
        onDeclineOffer={() => setOffer(null)}
        deckFactory={blackjackDeck}
      />

      {gamble && <CoinFlip amount={gamble.amount} rng={rng} onSettle={settleGamble} onClose={() => setGamble(null)} />}
      {burst > 0 && !reduceMotion && <Confetti key={burst} />}

      <p className={styles.back}>
        <RackLink to="/">{t('casino.back')}</RackLink>
      </p>
    </>
  );
}
