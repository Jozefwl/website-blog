import RackLink from './RackLink.jsx';
import styles from './ProjectCard.module.css';

// One project: what it is, why, the hard part, the stack, and where to look.
export default function ProjectCard({ project }) {
  const { name, context, description, hardPart, stack, links = [] } = project;

  return (
    <article className={styles.card}>
      <header>
        <h3 className={styles.name}>{name}</h3>
        {context && <p className={styles.context}>{context}</p>}
      </header>
      <p className={styles.description}>{description}</p>
      {hardPart && (
        <p className={styles.detail}>
          <span className={styles.label}>Hard part:</span> {hardPart}
        </p>
      )}
      {stack && (
        <p className={styles.detail}>
          <span className={styles.label}>Stack:</span> {stack}
        </p>
      )}
      {links.length > 0 && (
        <p className={styles.links}>
          {links.map(({ label, href, internal }) =>
            internal ? (
              <RackLink key={href} className={styles.link} to={href}>
                {label} →
              </RackLink>
            ) : (
              <a key={href} className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
                {label} →
              </a>
            ),
          )}
        </p>
      )}
    </article>
  );
}
