import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Language, StoryItem } from '../types';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

// Logos are pre-sized WebP files (a few KB each); the originals stay in public/assets.
const ORGS = {
  unicas: { src: '/assets/unicas.webp', name: 'Università degli Studi di Cassino e del Lazio Meridionale', width: 192, height: 192 },
  lunex: { src: '/assets/lunex.webp', name: 'LUNEX University', width: 480, height: 156 },
} as const;

function Orgs({ item }: { item: StoryItem }) {
  if (!item.orgs?.length) return null;
  return (
    <ul className="orgs">
      {item.orgs.map(key => { const org = ORGS[key]; return <li key={key} className={`org-${key}`}><img src={org.src} alt={org.name} width={org.width} height={org.height} loading="lazy" decoding="async" /></li>; })}
    </ul>
  );
}

function formatDate(date: string, lang: Language, withYear: boolean) {
  const [y, m, d] = date.split('-').map(Number);
  if (!m) return withYear ? String(y) : '';
  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  return new Intl.DateTimeFormat(locale, { day: d ? 'numeric' : undefined, month: 'long', year: withYear ? 'numeric' : undefined, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

function Links({ item, lang }: { item: StoryItem; lang: Language }) {
  if (!item.link && !item.linkedin) return null;
  return (
    <p className="moment-links">
      {item.link && <a href={item.link} {...external}>{lang === 'en' ? 'Read' : 'Leggi'}<ArrowUpRight size={16} aria-hidden="true" /></a>}
      {item.linkedin && <a href={item.linkedin} {...external}>LinkedIn<ArrowUpRight size={16} aria-hidden="true" /></a>}
    </p>
  );
}

export default function Story({ items, lang }: { items: StoryItem[]; lang: Language }) {
  const moments = items.filter(item => !item.finale);
  const finale = items.find(item => item.finale);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const finaleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    refs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [moments.length]);

  useEffect(() => {
    const el = finaleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const year = moments[active]?.date.slice(0, 4);

  return (
    <>
      <section id="story" className="story" data-tone="light" aria-labelledby="story-heading">
        <h2 id="story-heading" className="section-title">{lang === 'en' ? 'The story.' : 'La storia.'}</h2>
        <div className="story-grid">
          <div className="story-year" aria-hidden="true"><span key={year}>{year}</span></div>
          <ol className="story-list">
            {moments.map((item, i) => (
              <li key={item.id} ref={el => { refs.current[i] = el; }} data-index={i} className={`moment${i === active ? ' is-active' : ''}`}>
                <div className="moment-row">
                <div className="moment-text">
                <time dateTime={item.date}>
                  <span className="moment-year">{item.date.slice(0, 4)}</span>
                  {item.date.length > 4 && <span className="moment-month">{formatDate(item.date, lang, false)}</span>}
                </time>
                <h3>{item.title[lang]}</h3>
                {item.detail && <p className="moment-detail">{item.detail[lang]}</p>}
                </div>
                <Orgs item={item} />
                </div>
                {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" />}
                <Links item={item} lang={lang} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      {finale && (
        <section ref={finaleRef} className="finale" aria-labelledby="finale-heading">
          <time dateTime={finale.date}>{formatDate(finale.date, lang, true)}</time>
          <h2 id="finale-heading">{finale.title[lang]}</h2>
          {finale.detail && <p>{finale.detail[lang]}</p>}
          <Orgs item={finale} />
          {finale.image && <img src={finale.image} alt="" loading="lazy" decoding="async" />}
          <Links item={finale} lang={lang} />
        </section>
      )}
    </>
  );
}
