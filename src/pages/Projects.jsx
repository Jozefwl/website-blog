import PageHeader from '../components/common/PageHeader.jsx';
import ProjectCard from '../components/common/ProjectCard.jsx';
import Socials from '../components/layout/Socials.jsx';
import { PROJECTS } from '../data/projects.js';
import styles from './Page.module.css';

export default function Projects({ projects = PROJECTS }) {
  return (
    <>
      <PageHeader tag="U2" title="Projects" subtitle="Things I built, broke and fixed." />
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <p className={styles.note}>
        More on <a href="https://github.com/Jozefwl" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
      <Socials />
    </>
  );
}
