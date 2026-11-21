import { useEffect, useRef, useState } from 'react';
import { formatMoney, gatewayDelay, parseAmount } from '../../lib/casino/gateway.js';
import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './JozefPay.module.css';

// JozefPay: a fake card-payment page that pops up over the casino. Corporate white, navy and
// gold, like a real checkout, but it only ever asks for an amount and only moves play money
// from the browser-stored "bank" into chips.
// Steps: connecting (5-10 s) -> form -> processing (5-10 s) -> checkmark (1 s) -> closes.
// The money moves when the checkmark appears; while it is processing the window can't be closed.
const SUCCESS_MS = 1000;

export default function JozefPay({ bank, chips, onPaid, onClose, delayRng = Math.random }) {
  const { lang, t } = useLang();
  const money = (n) => formatMoney(n, lang);
  const [step, setStep] = useState('connecting'); // connecting | form | processing | done
  const [raw, setRaw] = useState('');
  const dialogRef = useRef(null);
  const amountRef = useRef(null);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    dialogRef.current?.focus();
    later(() => setStep('form'), gatewayDelay(delayRng));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (step === 'form') amountRef.current?.focus();
  }, [step]);

  const busy = step === 'processing' || step === 'done';
  const close = () => {
    if (!busy) onClose();
  };

  const balance = bank.get();
  const amount = parseAmount(raw);
  const insufficient = Number.isInteger(amount) && amount > balance;
  const canPay = Number.isInteger(amount) && !insufficient;

  function pay(event) {
    event.preventDefault();
    if (!canPay) return;
    setStep('processing');
    later(() => {
      if (bank.take(amount)) chips.give(amount);
      onPaid();
      setStep('done');
      later(onClose, SUCCESS_MS);
    }, gatewayDelay(delayRng));
  }

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jozefpay-brand"
        tabIndex={-1}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      >
        <header className={styles.topbar}>
          <span id="jozefpay-brand" className={styles.brand}>
            JozefPay
          </span>
          <span className={styles.secure}>{t('pay.secure')}</span>
          <button type="button" className={styles.close} onClick={close} disabled={busy} aria-label={t('pay.close')}>
            ×
          </button>
        </header>
        <div className={styles.stripe} aria-hidden="true" />

        {step === 'connecting' && (
          <div className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.loadingTitle}>{t('pay.connecting')}</p>
            <p className={styles.muted}>{t('pay.doNotClose')}</p>
          </div>
        )}
        {step === 'processing' && (
          <div className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.loadingTitle}>{t('pay.processing')}</p>
            <p className={styles.muted}>{t('pay.paying', { amount: money(amount) })}</p>
          </div>
        )}
        {step === 'done' && (
          <div className={styles.loading} role="status">
            <svg className={styles.check} viewBox="0 0 52 52" aria-hidden="true" data-testid="checkmark">
              <circle className={styles.checkCircle} cx="26" cy="26" r="24" />
              <path className={styles.checkTick} d="M14 27 l8 8 l16 -17" />
            </svg>
            <p className={styles.loadingTitle}>{t('pay.success')}</p>
            <p className={styles.muted}>{t('pay.added', { amount: money(amount) })}</p>
          </div>
        )}
        {step === 'form' && (
          <form className={styles.body} onSubmit={pay}>
            <h2 className={styles.title}>{t('pay.title')}</h2>
            <dl className={styles.summary}>
              <dt>{t('pay.merchant')}</dt>
              <dd>{t('pay.merchantName')}</dd>
              <dt>{t('pay.account')}</dt>
              <dd>{t('pay.accountName')}</dd>
              <dt>{t('pay.balance')}</dt>
              <dd className={styles.balance}>{money(balance)}</dd>
            </dl>

            <div className={styles.field}>
              <label htmlFor="jozefpay-amount">{t('pay.amount')}</label>
              <span className={styles.inputWrap}>
                <span className={styles.currency} aria-hidden="true">
                  €
                </span>
                <input
                  id="jozefpay-amount"
                  ref={amountRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  aria-invalid={insufficient || undefined}
                />
              </span>
            </div>
            {insufficient && (
              <p className={styles.error} role="alert">
                {t('pay.insufficient')}
              </p>
            )}
            <p className={styles.muted}>{t('pay.rate')}</p>

            <div className={styles.actions}>
              <button type="button" className={styles.secondary} onClick={close}>
                {t('pay.cancel')}
              </button>
              <button type="submit" className={styles.primary} disabled={!canPay}>
                {t('pay.pay')} {canPay ? money(amount) : ''}
              </button>
            </div>
          </form>
        )}

        <footer className={styles.disclaimer}>
          <p>{t('pay.disclaimer')}</p>
          <p>{t('pay.links')}</p>
        </footer>
      </div>
    </div>
  );
}
