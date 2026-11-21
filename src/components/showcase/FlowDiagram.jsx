import { pick, useLang } from '../../i18n/LanguageContext.jsx';
import styles from './FlowDiagram.module.css';

// A left-to-right chain of boxes (top-to-bottom on phones), drawn as rack hardware.
export default function FlowDiagram({ title, steps }) {
  const { lang } = useLang();
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <ol className={styles.flow}>
        {steps.map((step) => (
          <li key={pick(step.title, 'en')} className={styles.step}>
            <span className={styles.stepTitle}>{pick(step.title, lang)}</span>
            {step.note && <span className={styles.note}>{pick(step.note, lang)}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
