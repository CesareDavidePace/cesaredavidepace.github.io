import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Github } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Language, Project } from '../types';
import Pager from './Pager';

const categoryNames = {
  en: { all: 'All projects', web: 'Web', mobile: 'Mobile', 'deep-learning': 'AI & vision', vision: 'Vision', biomechanics: 'Biomechanics', system: 'Systems' },
  it: { all: 'Tutti i progetti', web: 'Web', mobile: 'Mobile', 'deep-learning': 'AI e visione', vision: 'Visione', biomechanics: 'Biomeccanica', system: 'Sistemi' },
};
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function ProjectsShowcase({ projects, lang }: { projects: Project[]; lang: Language }) {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const reducedMotion = useReducedMotion();
  const categories = ['all', ...new Set(projects.map(project => project.category))];
  const filtered = filter === 'all' ? projects : projects.filter(project => project.category === filter);
  const currentPage = Math.min(page, Math.max(0, filtered.length - 1));
  const project = filtered[currentPage];
  const t = categoryNames[lang];

  return (
    <div className="project-showcase">
      <div className="project-toolbar">
        <div className="filters" role="group" aria-label={lang === 'en' ? 'Filter projects' : 'Filtra i progetti'}>
          {categories.map(category => <button key={category} aria-pressed={filter === category} onClick={() => { setFilter(category); setPage(0); }} className={filter === category ? 'selected' : ''}>{t[category as keyof typeof t] || category}</button>)}
        </div>
        <p className="mono project-count" role="status">{filtered.length} {lang === 'en' ? 'projects' : 'progetti'}</p>
      </div>
      {project && <motion.article
        id="project-stage"
        key={project.id}
        className={`project-stage project-${project.id}`}
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        aria-label={project.title[lang]}
      >
        {project.imageUrl ? <div className="project-image"><span className="project-number mono">{t[project.category]}</span><img src={project.imageUrl} alt={project.title[lang]} loading="lazy" decoding="async" width="800" height="520" /></div> : <figure className="project-diagram">
          <figcaption className="mono"><Github size={17} />{lang === 'en' ? 'Research code' : 'Codice di ricerca'}</figcaption>
          <p className="diagram-title">{project.shortName || project.title[lang]}</p>
          <ol className="diagram-pipeline">{project.pipeline?.map((step, i) => <li key={step.en}><span className="mono">0{i + 1}</span><span>{step[lang]}</span>{i < (project.pipeline?.length ?? 0) - 1 && <ArrowDown size={17} aria-hidden="true" />}</li>)}</ol>
        </figure>}
        <div className="project-copy">
          <p className="eyebrow project-kicker">{String(currentPage + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}<span>{t[project.category]}</span></p>
          <h3>{project.title[lang]}</h3>
          <p>{project.description[lang]}</p>
          <ul className="tags" aria-label={lang === 'en' ? 'Technologies' : 'Tecnologie'}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
          <div className="project-links">
            {project.link && <a href={project.link} {...external}>{lang === 'en' ? 'Visit project' : 'Visita il progetto'}<ArrowUpRight size={18} /></a>}
            {project.githubUrl && <a href={project.githubUrl} {...external}><Github size={18} />GitHub<ArrowUpRight size={18} /></a>}
            {project.playStoreLink && <a href={project.playStoreLink} {...external}>Google Play<ArrowUpRight size={18} /></a>}
            {project.appStoreLink && <a href={project.appStoreLink} {...external}>App Store<ArrowUpRight size={18} /></a>}
          </div>
        </div>
      </motion.article>}
      <div className="showcase-footer">
        <p className="mono" role="status">{project?.title[lang]}</p>
        <Pager page={currentPage} count={filtered.length} onChange={setPage} lang={lang} label={lang === 'en' ? 'Browse projects' : 'Sfoglia i progetti'} controls="project-stage" />
      </div>
    </div>
  );
}
