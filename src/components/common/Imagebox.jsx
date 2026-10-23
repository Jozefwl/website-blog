import { useEffect, useState } from 'react';
import styles from './Imagebox.module.css';

// Slideshow: cross-fades to the next slide every `intervalMs`, loops forever.
export default function Imagebox({ slides, intervalMs = 4500 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  const current = slides[index];

  return (
    <figure className={styles.box}>
      <div className={styles.frame}>
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={i === index ? slide.alt : ''}
            aria-hidden={i !== index}
            className={i === index ? `${styles.image} ${styles.visible}` : styles.image}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>
      {current?.caption && <figcaption className={styles.caption}>{current.caption}</figcaption>}
    </figure>
  );
}
