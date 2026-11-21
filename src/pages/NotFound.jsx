import { Link } from 'react-router';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusLed from '../components/rack/StatusLed.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import styles from './Page.module.css';

export default function NotFound() {
  const { t } = useLang();
  return (
    <>
      <PageHeader tag="404" title={t('notFound.title')} />
      <p className={styles.note}>
        <StatusLed status="down" label={t('notFound.led')} /> {t('notFound.text')} <Link to="/">{t('notFound.back')}</Link>
      </p>
    </>
  );
}
