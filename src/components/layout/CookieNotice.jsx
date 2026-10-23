import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { createConsentStore } from '../../lib/consent.js';
import styles from './CookieNotice.module.css';

function safeLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export default function CookieNotice() {
  const consent = useMemo(() => createConsentStore(safeLocalStorage()), []);
  const [visible, setVisible] = useState(() => !consent.isAccepted());

  if (!visible) return null;

  function close() {
    consent.accept();
    setVisible(false);
  }

  return (
    <div className={styles.notice} role="region" aria-label="Cookie notice">
      <p className={styles.text}>
        <strong>Disclaimer:</strong> This site uses cookies for basic functionality. Meteoblue&apos;s cookies are used by the weather
        widget (when you click Expand Weather), and Cloudflare collects analytics for website statistics (these can be blocked with an
        adblocker).
        <br />
        For implementation details see my GitHub in the <Link to="/contact">Contact page</Link> or{' '}
        <Link to="/services">Services page</Link>.
      </p>
      <button type="button" className={styles.button} onClick={close}>
        Close
      </button>
    </div>
  );
}
