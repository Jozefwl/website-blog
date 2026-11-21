import DayJobPanel from '../components/common/DayJobPanel.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import ProjectCard from '../components/common/ProjectCard.jsx';
import Socials from '../components/layout/Socials.jsx';
import { DAY_JOB, PROJECTS } from '../data/projects.js';
import styles from './Page.module.css';

export default function Projects({ projects = PROJECTS, job = DAY_JOB }) {
  return (
    <>
      <PageHeader tag="U2" title="Projects" subtitle="Things I built, broke and fixed." />
      <DayJobPanel job={job} />
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <p className={styles.note}>
        <a href="https://github.com/Jozefwl" target="_blank" rel="noopener noreferrer">
          More on GitHub
        </a>
      </p>
      <Socials />
    </>
  );
}
