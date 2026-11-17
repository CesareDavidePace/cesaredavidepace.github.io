import { useRef, type ReactNode } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Language, Project, Publication } from '../types';
import PoseArt from './PoseArt';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const firstSentence = (text: string) => { const end = text.indexOf('. '); return end === -1 ? text : text.slice(0, end + 1); };

export function Publications({ publications, lang, scholarUrl }: { publications: Publication[]; lang: Language; scholarUrl?: string }) {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  return (
    <section id="publications" className="papers" data-tone="light" aria-labelledby="papers-heading">
      <div className="section-head">
        <h2 id="papers-heading" className="section-title">{lang === 'en' ? 'Publications.' : 'Pubblicazioni.'}</h2>
        {scholarUrl && <a className="quiet-link" href={scholarUrl} {...external}>Google Scholar<ArrowUpRight size={16} aria-hidden="true" /></a>}
      </div>
      <ol className="paper-list">
        {sorted.map((paper, i) => {
          const url = paper.doi ? `https://doi.org/${paper.doi}` : paper.pdfLink;
          return (
            <li key={paper.id} className={i > 0 && sorted[i - 1].year === paper.year ? 'same-year' : undefined}>
              <span className="paper-year">{i > 0 && sorted[i - 1].year === paper.year ? '' : paper.year}</span>
              <div>
                <h3>{url ? <a href={url} {...external}>{paper.title}</a> : paper.title}</h3>
                <p>{paper.venue}{paper.githubUrl && <> <a className="quiet-link" href={paper.githubUrl} {...external}>{lang === 'en' ? 'Code' : 'Codice'}<ArrowUpRight size={14} aria-hidden="true" /></a></>}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** A horizontal, snapping rail of tiles with previous/next buttons. */
export function Rail({ label, title, headingId, lang, children }: { label: string; title?: string; headingId?: string; lang: Language; children: ReactNode }) {
  const rail = useRef<HTMLUListElement>(null);
  const move = (dir: number) => {
    const el = rail.current;
    const tile = el?.querySelector('li');
    if (!el || !tile) return;
    el.scrollBy({ left: dir * (tile.getBoundingClientRect().width + 20), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <div className="project-group">
      <div className={`group-head${title ? '' : ' group-head-bare'}`}>
        {title && <h3 id={headingId}>{title}</h3>}
        <div className="rail-controls">
          <button onClick={() => move(-1)} aria-label={`${label}: ${lang === 'en' ? 'previous' : 'precedente'}`}><ChevronLeft size={22} /></button>
          <button onClick={() => move(1)} aria-label={`${label}: ${lang === 'en' ? 'next' : 'successivo'}`}><ChevronRight size={22} /></button>
        </div>
      </div>
      <ul ref={rail} className="rail" aria-label={label}>{children}</ul>
    </div>
  );
}

function ProjectRail({ id, title, projects, lang }: { id: string; title: string; projects: Project[]; lang: Language }) {
  return (
    <Rail label={title} title={title} headingId={id} lang={lang}>
        {projects.map(project => (
          <li key={project.id} className="tile">
            <div className="tile-media">
              {project.imageUrl
                ? <img src={project.imageUrl} alt="" loading="lazy" decoding="async" />
                : project.art
                  ? <PoseArt variant={project.art} />
                  : <p className="tile-wordmark" aria-hidden="true">{project.shortName || project.title[lang]}</p>}
            </div>
            <div className="tile-body">
              <h4>{project.shortName || project.title[lang]}</h4>
              <p>{firstSentence(project.description[lang])}</p>
              <p className="tile-links">
                {project.githubUrl && <a href={project.githubUrl} {...external}>GitHub<ArrowUpRight size={15} aria-hidden="true" /></a>}
                {project.link && <a href={project.link} {...external}>{lang === 'en' ? 'Visit' : 'Visita'}<ArrowUpRight size={15} aria-hidden="true" /></a>}
                {project.appStoreLink && <a href={project.appStoreLink} {...external}>App Store<ArrowUpRight size={15} aria-hidden="true" /></a>}
                {project.playStoreLink && <a href={project.playStoreLink} {...external}>Google Play<ArrowUpRight size={15} aria-hidden="true" /></a>}
              </p>
            </div>
          </li>
        ))}
    </Rail>
  );
}

export function Projects({ projects, lang }: { projects: Project[]; lang: Language }) {
  const research = projects.filter(p => p.group !== 'software');
  const software = projects.filter(p => p.group === 'software');
  return (
    <section id="projects" className="projects" data-tone="light" aria-labelledby="projects-heading">
      <div className="section-head">
        <h2 id="projects-heading" className="section-title">{lang === 'en' ? 'Projects.' : 'Progetti.'}</h2>
      </div>
      {research.length > 0 && <ProjectRail id="projects-research" title={lang === 'en' ? 'Research' : 'Ricerca'} projects={research} lang={lang} />}
      {software.length > 0 && <ProjectRail id="projects-software" title="Software" projects={software} lang={lang} />}
    </section>
  );
}
