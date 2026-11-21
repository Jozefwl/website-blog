import { LANGUAGES, useLang } from '../../i18n/LanguageContext.jsx';
import styles from './Footer.module.css';

// Site footer on every page: copyright and the EN | SK language switch.
export default function Footer() {
  const { lang, setLang, t } = useLang();
  return (
    <footer className={styles.footer}>
      <span className={styles.rights}>{t('footer.rights', { year: new Date().getFullYear() })}</span>
      <div className={styles.switch} role="group" aria-label={t('footer.language')}>
        {LANGUAGES.map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            className={styles.option}
            aria-pressed={code === lang}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </footer>
  );
}
