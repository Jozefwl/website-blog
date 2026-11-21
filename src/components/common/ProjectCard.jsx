import RackLink from './RackLink.jsx';
import { pick, useLang } from '../../i18n/LanguageContext.jsx';
import styles from './ProjectCard.module.css';

// One project: what it is, why, the hard part, the stack, and where to look.
// Always exactly five rows (missing ones render as empty placeholders) so that the cards
// can share the grid's rows (subgrid) and every section lines up across the row of cards.
export default function ProjectCard({ project }) {
  const { lang, t } = useLang();
  const { name, links = [] } = project;
  const [context, description, hardPart, stack] = ['context', 'description', 'hardPart', 'stack'].map((k) => pick(project[k], lang));
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
          <span className={styles.label}>{t('projects.hardPart')}</span> {hardPart}
        </p>
      ) : (
        empty(styles.detail)
      )}
      {stack ? (
        <p className={styles.detail}>
          <span className={styles.label}>{t('projects.stack')}</span> {stack}
        </p>
      ) : (
        empty(styles.detail)
      )}
      {links.length > 0 ? (
        <p className={styles.links}>
          {links.map(({ label, href, internal }) =>
            internal ? (
              <RackLink key={href} className={styles.link} to={href}>
                {pick(label, lang)} →
              </RackLink>
            ) : (
              <a key={href} className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
                {pick(label, lang)} →
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
