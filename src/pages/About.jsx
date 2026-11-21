import Imagebox from '../components/common/Imagebox.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Prose from '../components/common/Prose.jsx';
import Socials from '../components/layout/Socials.jsx';
import { ABOUT_SECTIONS, ABOUT_SUBTITLE } from '../data/about.js';
import { SLIDES } from '../data/slides.js';
import pageStyles from './Page.module.css';
import styles from './About.module.css';

export default function About() {
  return (
    <>
      <PageHeader tag="U1" title="About Jozef Waldhauser" subtitle={ABOUT_SUBTITLE} />

      <div className={pageStyles.stack}>
        {ABOUT_SECTIONS.map((section) => (
          <section key={section.title} className={styles.panel}>
            <h2 className={styles.title}>{section.title}</h2>
            <Prose paragraphs={section.paragraphs} />
          </section>
        ))}

        <Imagebox slides={SLIDES} />

        <section className={styles.panel}>
          <h2 className={styles.title}>Let&apos;s connect</h2>
          <Socials />
        </section>
      </div>
    </>
  );
}
