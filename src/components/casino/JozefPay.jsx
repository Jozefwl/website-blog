import { useEffect, useRef, useState } from 'react';
import { formatMoney, gatewayDelay, parseAmount } from '../../lib/casino/gateway.js';
import styles from './JozefPay.module.css';

// JozefPay: a fake card-payment page that pops up over the casino. Corporate white, navy and
// gold, like a real checkout, but it only ever asks for an amount and only moves play money
// from the browser-stored "bank" into chips.
// Steps: connecting (5-10 s) -> form -> processing (5-10 s) -> checkmark (1 s) -> closes.
// The money moves when the checkmark appears; while it is processing the window can't be closed.
const SUCCESS_MS = 1000;

export default function JozefPay({ bank, chips, onPaid, onClose, delayRng = Math.random }) {
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
          <span className={styles.secure}>Secure checkout</span>
          <button type="button" className={styles.close} onClick={close} disabled={busy} aria-label="Close">
            ×
          </button>
        </header>
        <div className={styles.stripe} aria-hidden="true" />

        {step === 'connecting' && (
          <div className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.loadingTitle}>Connecting to JozefPay…</p>
            <p className={styles.muted}>Please do not close or refresh this window.</p>
          </div>
        )}
        {step === 'processing' && (
          <div className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.loadingTitle}>Processing transaction…</p>
            <p className={styles.muted}>
              Paying {formatMoney(amount)} to waldhauser.sk Casino. Please do not close or refresh this window.
            </p>
          </div>
        )}
        {step === 'done' && (
          <div className={styles.loading} role="status">
            <svg className={styles.check} viewBox="0 0 52 52" aria-hidden="true" data-testid="checkmark">
              <circle className={styles.checkCircle} cx="26" cy="26" r="24" />
              <path className={styles.checkTick} d="M14 27 l8 8 l16 -17" />
            </svg>
            <p className={styles.loadingTitle}>Payment successful</p>
            <p className={styles.muted}>{formatMoney(amount)} added as chips.</p>
          </div>
        )}
        {step === 'form' && (
          <form className={styles.body} onSubmit={pay}>
            <h2 className={styles.title}>Add funds</h2>
            <dl className={styles.summary}>
              <dt>Merchant</dt>
              <dd>waldhauser.sk Casino</dd>
              <dt>Account</dt>
              <dd>JozefPay Personal ••• 4242</dd>
              <dt>Available balance</dt>
              <dd className={styles.balance}>{formatMoney(balance)}</dd>
            </dl>

            <div className={styles.field}>
              <label htmlFor="jozefpay-amount">Amount</label>
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
                Insufficient balance
              </p>
            )}
            <p className={styles.muted}>1 € = 1 chip. Whole euros only.</p>

            <div className={styles.actions}>
              <button type="button" className={styles.secondary} onClick={close}>
                Cancel
              </button>
              <button type="submit" className={styles.primary} disabled={!canPay}>
                Pay {canPay ? formatMoney(amount) : ''}
              </button>
            </div>
          </form>
        )}

        <footer className={styles.disclaimer}>
          <p>
            JozefPay is a fictional payment service for the waldhauser.sk casino. No real money, card or personal data is
            used, and balances exist only in this browser. By selecting Pay you authorise JozefPay to transfer the amount
            shown from your JozefPay account to the merchant. Transfers are final and cannot be reversed. JozefPay is not a
            bank and is not regulated by anyone, least of all a central bank.
          </p>
          <p>© 2026 JozefPay · Terms · Privacy · Help</p>
        </footer>
      </div>
    </div>
  );
}
