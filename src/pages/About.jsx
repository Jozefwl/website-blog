import Imagebox from '../components/common/Imagebox.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Prose from '../components/common/Prose.jsx';
import Socials from '../components/layout/Socials.jsx';
import { ABOUT_SECTIONS, ABOUT_SUBTITLE } from '../data/about.js';
import { SLIDES } from '../data/slides.js';
import { pick, useLang } from '../i18n/LanguageContext.jsx';
import pageStyles from './Page.module.css';
import styles from './About.module.css';

export default function About() {
  const { lang, t } = useLang();
  return (
    <>
      <PageHeader tag="U1" title={t('about.title')} subtitle={pick(ABOUT_SUBTITLE, lang)} />

      <div className={pageStyles.stack}>
        {ABOUT_SECTIONS.map((section) => (
          <section key={section.title.en} className={styles.panel}>
            <h2 className={styles.title}>{pick(section.title, lang)}</h2>
            <Prose paragraphs={pick(section.paragraphs, lang)} />
          </section>
        ))}

        <Imagebox slides={SLIDES} />

        <section className={styles.panel}>
          <h2 className={styles.title}>{t('about.connect')}</h2>
          <Socials />
        </section>
      </div>
    </>
  );
}
