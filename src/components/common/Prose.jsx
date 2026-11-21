import styles from './Prose.module.css';

// Paragraphs of plain text with inline external links: [['text ', { text, href }, '.'], ...]
export default function Prose({ paragraphs }) {
  return (
    <div className={styles.prose}>
      {paragraphs.map((parts, i) => (
        <p key={i}>
          {parts.map((part, j) =>
            typeof part === 'string' ? (
              part
            ) : (
              <a key={j} href={part.href} target="_blank" rel="noopener noreferrer">
                {part.text}
              </a>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
