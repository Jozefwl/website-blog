import AnimatedText from '../components/common/AnimatedText.jsx';
import WeatherWidget from '../components/common/WeatherWidget.jsx';
import Rack from '../components/rack/Rack.jsx';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <AnimatedText text="waldhauser.sk" />
      <p className={styles.hint}>Jozef Waldhauser's personal website.</p>
      <Rack />
      <WeatherWidget />
    </div>
  );
}
