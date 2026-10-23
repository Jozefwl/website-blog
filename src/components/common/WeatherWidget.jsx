import { useState } from 'react';
import styles from './WeatherWidget.module.css';

// Meteoblue widgets (same URLs as the old site). Iframes load only after "Expand Weather".
const QUERY =
  'geoloc=fixed&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=0&humidity=0&precipitation=1&precipitationprobability=1&spot=1&pressure=0&layout=light';

const PLACES = [
  {
    name: 'Snina',
    widget: `https://www.meteoblue.com/sk/po%C4%8Dasie/widget/daily/snina_slovensko_723559?${QUERY}`,
    link: 'https://www.meteoblue.com/sk/po%C4%8Dasie/t%C3%BD%C5%žde%C5%ň/snina_slovensko_723559?utm_source=daily_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget',
  },
  {
    name: 'Prešov',
    widget: `https://www.meteoblue.com/sk/po%C4%8Dasie/widget/daily/pre%c5%a1ov_slovensko_723819?${QUERY}`,
    link: 'https://www.meteoblue.com/sk/po%C4%8Dasie/t%C3%BD%C5%žde%C5%ň/pre%c5%a1ov_slovensko_723819?utm_source=daily_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget',
  },
  {
    name: 'Praha',
    widget: `https://www.meteoblue.com/sk/po%C4%8Dasie/widget/daily/praha_%C4%8Desk%C3%A1-republika_3067696?${QUERY}`,
    link: 'https://www.meteoblue.com/sk/po%C4%8Dasie/t%C3%BD%C5%BEde%C5%88/praha_%C4%8Desk%C3%A1-republika_3067696?utm_source=daily_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget',
  },
];

export default function WeatherWidget() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.wrapper}>
      <button type="button" className={styles.button} onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        {expanded ? 'Collapse Weather' : 'Expand Weather'}
      </button>
      {expanded && (
        <div className={styles.widgets}>
          {PLACES.map((place) => (
            <div key={place.name} className={styles.widget}>
              <iframe
                title={`Weather in ${place.name}`}
                src={place.widget}
                sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                className={styles.frame}
              />
              <a href={place.link} target="_blank" rel="noopener" className={styles.credit}>
                meteoblue
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
