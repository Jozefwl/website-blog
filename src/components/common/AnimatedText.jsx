import styles from './AnimatedText.module.css';

// Letters pop in one by one (0.1 s apart), like the old site's title.
export default function AnimatedText({ text, as: Tag = 'h1', className = '' }) {
  return (
    <Tag className={`${styles.text} ${className}`} aria-label={text}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className={styles.word} aria-hidden="true">
          {word.split('').map((char, charIndex) => (
            <span key={charIndex} className={styles.letter} style={{ animationDelay: `${charIndex * 0.1}s` }}>
              {char}
            </span>
          ))}
          <span className={styles.space}>{' '}</span>
        </span>
      ))}
    </Tag>
  );
}
