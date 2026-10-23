import styles from './Infobox.module.css';

// Card with a title and a list of paragraphs.
export default function Infobox({ title, content }) {
  return (
    <section className={styles.box}>
      <h2 className={styles.title}>{title}</h2>
      {content.map((paragraph, index) => (
        <p key={index} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </section>
  );
}
