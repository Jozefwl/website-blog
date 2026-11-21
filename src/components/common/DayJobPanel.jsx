import { useLang } from '../../i18n/LanguageContext.jsx';
import styles from './DayJobPanel.module.css';

// The day job, styled as the featured server at the top of the Projects page.
export default function DayJobPanel({ job }) {
  const { t } = useLang();
  return (
    <section className={styles.panel} aria-labelledby="day-job">
      <span className={styles.tag} aria-hidden="true">
        U0
      </span>
      <h2 id="day-job" className={styles.title}>
        {t('projects.dayJob')}
      </h2>
      <p className={styles.role}>
        {t('projects.roleAt', { role: job.role, company: job.company })}
      </p>
      <p className={styles.platform}>{job.platform}</p>
      <p className={styles.clients}>{job.clients.join(' · ')}</p>
      <a className={styles.link} href={job.linkedin} target="_blank" rel="noopener noreferrer">
        {t('projects.linkedin')}
      </a>
    </section>
  );
}
