import { useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Language, Publication } from '../types';
import Pager from './Pager';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const PAGE_SIZE = 2;

export default function PublicationsShelf({ publications, lang }: { publications: Publication[]; lang: Language }) {
  const [year, setYear] = useState<number | 'all'>('all');
  const [page, setPage] = useState(0);
  const reducedMotion = useReducedMotion();
  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
  const filtered = [...publications].filter(p => year === 'all' || p.year === year).sort((a, b) => b.year - a.year);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  return (
    <div className="publications-shelf">
      <div className="publication-toolbar">
        <div className="filters" role="group" aria-label={lang === 'en' ? 'Publication year' : 'Anno di pubblicazione'}>
          {(['all', ...years] as const).map(value => <button key={value} aria-pressed={year === value} className={year === value ? 'selected' : ''} onClick={() => { setYear(value); setPage(0); }}>{value === 'all' ? lang === 'en' ? 'All years' : 'Tutti gli anni' : value}</button>)}
        </div>
        <p className="mono" role="status">{filtered.length ? currentPage * PAGE_SIZE + 1 : 0}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} / {filtered.length}</p>
      </div>
      <motion.div id="publication-stage" className="publication-stage" key={`${year}-${currentPage}`} initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}>
        {visible.map(paper => {
          const url = paper.doi ? `https://doi.org/${paper.doi}` : paper.pdfLink;
          return <article className="paper" key={paper.id}>
            <span className="paper-year mono">{paper.year}</span>
            <div className="paper-content">
              <p className="paper-venue mono">{paper.venue}</p>
              <h3>{url ? <a href={url} {...external}>{paper.title}<ArrowUpRight size={20} /></a> : paper.title}</h3>
              <p className="authors">{paper.authors.map((author, i) => <span key={`${author}-${i}`}>{i > 0 && ', '}{['Cesare Davide Pace', 'C.D. Pace'].includes(author) ? <strong>{author}</strong> : author}</span>)}</p>
              <ul className="paper-tags">{paper.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            </div>
            {(url || paper.githubUrl) && <div className="paper-links">
              {url && <a href={url} {...external} aria-label={`${lang === 'en' ? 'Read paper' : 'Leggi il paper'}: ${paper.title}`}>{paper.doi ? 'DOI' : 'Preprint'}<ArrowUpRight size={16} /></a>}
              {paper.pdfLink && paper.doi && <a href={paper.pdfLink} {...external}>PDF<ArrowUpRight size={16} /></a>}
              {paper.githubUrl && <a href={paper.githubUrl} {...external} aria-label={`${lang === 'en' ? 'View code' : 'Vedi il codice'}: ${paper.title}`}><Github size={16} />{lang === 'en' ? 'Code' : 'Codice'}</a>}
            </div>}
          </article>;
        })}
      </motion.div>
      <div className="showcase-footer"><p className="mono">{lang === 'en' ? 'Publications & preprints' : 'Pubblicazioni e preprint'}</p><Pager page={currentPage} count={pageCount} onChange={setPage} lang={lang} label={lang === 'en' ? 'Browse publications' : 'Sfoglia le pubblicazioni'} controls="publication-stage" /></div>
    </div>
  );
}
