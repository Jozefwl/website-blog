import AnimatedText from '../components/common/AnimatedText.jsx';
import WeatherWidget from '../components/common/WeatherWidget.jsx';
import Rack from '../components/rack/Rack.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useLang();
  return (
    <div className={styles.home}>
      <AnimatedText text="waldhauser.sk" />
      <p className={styles.hint}>{t('home.hint')}</p>
      <Rack />
      <WeatherWidget />
    </div>
  );
}
