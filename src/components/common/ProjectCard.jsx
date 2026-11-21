import RackLink from './RackLink.jsx';
import styles from './ProjectCard.module.css';

// One project: what it is, why, the hard part, the stack, and where to look.
// Always exactly five rows (missing ones render as empty placeholders) so that the cards
// can share the grid's rows (subgrid) and every section lines up across the row of cards.
export default function ProjectCard({ project }) {
  const { name, context, description, hardPart, stack, links = [] } = project;
  const empty = (className) => <p className={className} aria-hidden="true" />;

  return (
    <article className={styles.card}>
      <header>
        <h3 className={styles.name}>{name}</h3>
        {context && <p className={styles.context}>{context}</p>}
      </header>
      <p className={styles.description}>{description}</p>
      {hardPart ? (
        <p className={styles.detail}>
          <span className={styles.label}>Hard part:</span> {hardPart}
        </p>
      ) : (
        empty(styles.detail)
      )}
      {stack ? (
        <p className={styles.detail}>
          <span className={styles.label}>Stack:</span> {stack}
        </p>
      ) : (
        empty(styles.detail)
      )}
      {links.length > 0 ? (
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
      ) : (
        empty(styles.links)
      )}
    </article>
  );
}
