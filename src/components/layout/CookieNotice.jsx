import { useMemo, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext.jsx';
import RackLink from '../common/RackLink.jsx';
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
  const { t } = useLang();
  const consent = useMemo(() => createConsentStore(safeLocalStorage()), []);
  const [visible, setVisible] = useState(() => !consent.isAccepted());

  if (!visible) return null;

  function close() {
    consent.accept();
    setVisible(false);
  }

  return (
    <div className={styles.notice} role="region" aria-label={t('cookie.label')}>
      <p className={styles.text}>
        <strong>{t('cookie.title')}</strong> {t('cookie.text')}
        <br />
        {t('cookie.details')} <RackLink to="/contact">{t('cookie.contactPage')}</RackLink> {t('cookie.or')}{' '}
        <RackLink to="/services">{t('cookie.servicesPage')}</RackLink>.
      </p>
      <button type="button" className={styles.button} onClick={close}>
        {t('cookie.close')}
      </button>
    </div>
  );
}
