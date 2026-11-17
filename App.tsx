import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { AppData, Language } from './types';
import content from './public/data.json';
import Hero from './components/Hero';
import Story from './components/Story';
import Talks from './components/Talks';
import { Projects, Publications } from './components/Work';
import './styles.css';

const data = content as AppData;
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const t = {
  en: { story: 'Story', publications: 'Publications', projects: 'Projects', talks: 'Talks', contact: 'Contact', skip: 'Skip to content', talk: 'Let’s talk.', cv: 'Download CV', fullCv: 'Full CV', preparing: 'Preparing…', failed: 'The CV could not be created. Try again.', dismiss: 'Dismiss', menu: 'Open menu', close: 'Close menu', switch: 'Passa all’italiano' },
  it: { story: 'Storia', publications: 'Pubblicazioni', projects: 'Progetti', talks: 'Interventi', contact: 'Contatti', skip: 'Vai al contenuto', talk: 'Parliamone.', cv: 'Scarica il CV', fullCv: 'CV completo', preparing: 'Preparazione…', failed: 'Non è stato possibile creare il CV. Riprova.', dismiss: 'Chiudi', menu: 'Apri il menu', close: 'Chiudi il menu', switch: 'Switch to English' },
};

function readLanguage(): Language {
  try { const saved = localStorage.getItem('portfolio-language'); if (saved === 'it' || saved === 'en') return saved; } catch { /* storage unavailable */ }
  return navigator.language?.startsWith('it') ? 'it' : 'en';
}

export default function App() {
  const [lang, setLang] = useState<Language>(readLanguage);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [lightBar, setLightBar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const l = t[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('portfolio-language', lang); } catch { /* storage unavailable */ }
  }, [lang]);

  const downloadCV = async (type: 'short' | 'long') => {
    if (pdfBusy) return;
    setPdfBusy(true); setPdfError(false);
    try { const { generateCV } = await import('./services/pdfGenerator'); generateCV(data, lang, type); }
    catch { setPdfError(true); }
    finally { setPdfBusy(false); }
  };
  // The bar follows the tone of the section beneath it.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const under = document.elementFromPoint(window.innerWidth / 2, 60)?.closest('[data-tone]');
      setLightBar(under?.getAttribute('data-tone') === 'light');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 760) setMenuOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [menuOpen]);

  const links = [['story', l.story], ['publications', l.publications], ['projects', l.projects], ['talks', l.talks], ['contact', l.contact]] as const;
  const scholar = data.profile.socials.find(s => s.network === 'Scholar');

  return <>
    <a href="#main" className="skip-link">{l.skip}</a>
    <header className={`bar${lightBar && !menuOpen ? ' bar-light' : ''}`}>
      <a href="#home" className="bar-name">{data.profile.name}</a>
      <nav className="bar-nav" aria-label={lang === 'en' ? 'Sections' : 'Sezioni'}>
        {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>
      <button className="bar-lang" onClick={() => setLang(lang === 'en' ? 'it' : 'en')} aria-label={l.switch}>{lang === 'en' ? 'IT' : 'EN'}</button>
      <button className="bar-menu" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-controls="menu-sheet" aria-label={menuOpen ? l.close : l.menu}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </header>
    <nav id="menu-sheet" className="menu-sheet" hidden={!menuOpen} aria-label={lang === 'en' ? 'Sections' : 'Sezioni'}>
      {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>

    <main id="main">
      <Hero name={data.profile.name} role={data.profile.role[lang]} tagline={data.profile.tagline[lang]} lang={lang} />
      <Story items={data.story} lang={lang} />
      <Publications publications={data.publications} lang={lang} scholarUrl={scholar?.url} />
      <Projects projects={data.projects} lang={lang} />
      <Talks talks={data.talks} lang={lang} />
    </main>

    <footer id="contact" className="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{l.talk}</h2>
      <a className="contact-email" href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
      <div className="contact-actions">
        <button className="pill pill-solid" onClick={() => downloadCV('short')} disabled={pdfBusy}>{pdfBusy ? l.preparing : l.cv}</button>
        <button className="pill" onClick={() => downloadCV('long')} disabled={pdfBusy}>{l.fullCv}</button>
      </div>
      <ul className="contact-socials">
        {data.profile.socials.map(s => <li key={s.network}><a href={s.url} {...external}>{s.network}</a></li>)}
      </ul>
      <p className="contact-fine">© {new Date().getFullYear()} {data.profile.name}</p>
    </footer>

    {pdfError && <div className="toast" role="alert">{l.failed}<button onClick={() => setPdfError(false)} aria-label={l.dismiss}><X size={18} /></button></div>}
  </>;
}
