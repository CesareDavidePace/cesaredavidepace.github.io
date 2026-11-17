import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Language, Talk } from '../types';
import { Rail } from './Work';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

function formatDate(date: string, lang: Language) {
  // Dates may be YYYY-MM when the exact day is not known.
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', { day: d ? 'numeric' : undefined, month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

function TalkTile({ talk, lang }: { talk: Talk; lang: Language }) {
  const [shown, setShown] = useState(0);
  const [portrait, setPortrait] = useState<Record<number, boolean>>({});
  return (
    <li className="tile talk">
      <div className="tile-media">
        <img
          key={talk.images[shown]}
          src={talk.images[shown]}
          alt=""
          loading="lazy"
          decoding="async"
          className={portrait[shown] ? 'is-portrait' : undefined}
          onLoad={e => { const img = e.currentTarget; if (img.naturalHeight > img.naturalWidth * 1.15) setPortrait(p => ({ ...p, [shown]: true })); }}
        />
        {talk.images.length > 1 && (
          <div className="photo-dots" role="group" aria-label={lang === 'en' ? 'Photos' : 'Foto'}>
            {talk.images.map((src, i) => (
              <button key={src} aria-pressed={i === shown} aria-label={`${lang === 'en' ? 'Photo' : 'Foto'} ${i + 1}`} onClick={() => setShown(i)} />
            ))}
          </div>
        )}
      </div>
      <div className="tile-body">
        <p className="talk-meta"><time dateTime={talk.date}>{formatDate(talk.date, lang)}</time>{talk.kind[lang]}</p>
        <h4>{talk.title[lang]}</h4>
        <p className="talk-place">{talk.place[lang]}</p>
        <p>{talk.detail[lang]}</p>
        {(talk.video || talk.linkedin) && (
          <p className="tile-links">
            {talk.video && <a href={talk.video} {...external}>{lang === 'en' ? 'Watch' : 'Guarda'}<ArrowUpRight size={15} aria-hidden="true" /></a>}
            {talk.linkedin && <a href={talk.linkedin} {...external}>LinkedIn<ArrowUpRight size={15} aria-hidden="true" /></a>}
          </p>
        )}
      </div>
    </li>
  );
}

export default function Talks({ talks, lang }: { talks: Talk[]; lang: Language }) {
  if (!talks.length) return null;
  const sorted = [...talks].sort((a, b) => b.date.localeCompare(a.date));
  const title = lang === 'en' ? 'Talks.' : 'Interventi.';
  return (
    <section id="talks" className="talks" data-tone="light" aria-labelledby="talks-heading">
      <div className="section-head">
        <h2 id="talks-heading" className="section-title">{title}</h2>
      </div>
      <Rail label={lang === 'en' ? 'Talks' : 'Interventi'} lang={lang}>
        {sorted.map(talk => <TalkTile key={talk.id} talk={talk} lang={lang} />)}
      </Rail>
    </section>
  );
}
