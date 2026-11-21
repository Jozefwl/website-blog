import styles from './DayJobPanel.module.css';

// The day job, styled as the featured server at the top of the Projects page.
export default function DayJobPanel({ job }) {
  return (
    <section className={styles.panel} aria-labelledby="day-job">
      <span className={styles.tag} aria-hidden="true">
        U0
      </span>
      <h2 id="day-job" className={styles.title}>
        Day job
      </h2>
      <p className={styles.role}>
        {job.role} at {job.company}
      </p>
      <p className={styles.platform}>{job.platform}</p>
      <p className={styles.clients}>{job.clients.join(' · ')}</p>
      <a className={styles.link} href={job.linkedin} target="_blank" rel="noopener noreferrer">
        More on LinkedIn →
      </a>
    </section>
  );
}
