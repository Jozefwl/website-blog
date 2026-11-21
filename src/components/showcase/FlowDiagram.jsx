import styles from './FlowDiagram.module.css';

// A left-to-right chain of boxes (top-to-bottom on phones), drawn as rack hardware.
export default function FlowDiagram({ title, steps }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <ol className={styles.flow}>
        {steps.map((step) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepTitle}>{step.title}</span>
            {step.note && <span className={styles.note}>{step.note}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
