import Imagebox from '../components/common/Imagebox.jsx';
import Infobox from '../components/common/Infobox.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Socials from '../components/layout/Socials.jsx';
import { SLIDES } from '../data/slides.js';
import styles from './Page.module.css';

export default function About() {
  return (
    <>
      <PageHeader tag="U1" title="About Jozef Waldhauser" subtitle={'Self-Proclaimed “IT Guy“ | Student | Tech enjoyer'} />

      <div className={styles.stack}>
        <Imagebox slides={SLIDES} />

        <Infobox
          title="Professional Background"
          content={[
            'I started working as SLS support',
            'Currently employed as an Configuration Manager at Unicorn Systems',
            'I help manage and deploy the Unicorn Enterprise Platform.',
          ]}
        />

        <Infobox
          title="Interests"
          content={[
            'Servers, computers, hardware, audio equipment, 3d printing, 3d modelling, CAD modelling, electronics, soldering, welding, drawing, singing, hikes, airsoft, history.',
            'Native Slovak, spoke English my whole life, tiny bit of German and and OK Russian.',
            'I am currently trying to get better at automation, kubernetes and programming.',
          ]}
        />

        <Infobox title="Let's Connect" content={['Pretty buttons from Town X near you ↓']} />
      </div>

      <Socials />
    </>
  );
}
