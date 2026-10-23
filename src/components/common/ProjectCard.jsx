import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const { name, description, tech = [], repo, link } = project;
  const href = link || repo;

  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      {tech.length > 0 && (
        <ul className={styles.tags} aria-label="Technologies">
          {tech.map((t) => (
            <li key={t} className={styles.tag}>
              {t}
            </li>
          ))}
        </ul>
      )}
      {href && (
        <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
          {repo ? 'View on GitHub →' : 'Open →'}
        </a>
      )}
    </article>
  );
}
