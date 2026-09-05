import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowUp, Download, Menu, X, Moon, Sun, Mail, Loader2 } from 'lucide-react';
import type { AppData, Language } from './types';
import content from './public/data.json';
import Hero from './components/Hero';
import Section from './components/Section';
import Reveal from './components/Reveal';
import ScrollJourney from './components/ScrollJourney';
import ProjectsShowcase from './components/ProjectsShowcase';
import PublicationsShelf from './components/PublicationsShelf';
import { MotionConfig } from 'framer-motion';
import './index.css';
import './chapters.css';

const data: AppData = content as AppData;
const sectionIds = ['about', 'research', 'publications', 'projects', 'history', 'contact'];
const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const labels = {
  en: { about: 'About', research: 'Research', publications: 'Publications', projects: 'Projects', history: 'Experience', contact: 'Contact', news: 'Latest updates', all: 'All projects', web: 'Web', mobile: 'Mobile', 'deep-learning': 'AI & vision', vision: 'Vision', biomechanics: 'Biomechanics', system: 'Systems', selected: 'From research to practice.', papers: 'Ideas, tested and shared.', journey: 'Learning. Building. Exploring.', researchTitle: 'Understanding movement.\nMaking it meaningful.', aboutTitle: 'A researcher’s curiosity.\nAn engineer’s approach.', connect: 'Let’s start a conversation.', contactBody: 'Interested in human movement, computer vision, or building something together? Get in touch.', cv: 'Download CV', shortCv: 'Short CV', longCv: 'Extended CV', view: 'Visit project', read: 'Read paper', code: 'View code', skip: 'Skip to content', theme: 'Switch to dark theme', light: 'Switch to light theme', menu: 'Open navigation', close: 'Close navigation', top: 'Back to top', loading: 'Preparing PDF…', failed: 'Could not create the PDF. Please try again.', count: 'projects', education: 'Education', work: 'Research experience', overview: 'A little about me', focus: 'Research focus', publicationsLabel: 'Publications & preprints', projectsLabel: 'Selected projects', historyLabel: 'Education & experience', elsewhere: 'Elsewhere', copyright: 'Research & engineering', present: 'Present' },
  it: { about: 'Chi sono', research: 'Ricerca', publications: 'Pubblicazioni', projects: 'Progetti', history: 'Percorso', contact: 'Contatti', news: 'Ultime novità', all: 'Tutti i progetti', web: 'Web', mobile: 'Mobile', 'deep-learning': 'AI e visione', vision: 'Visione', biomechanics: 'Biomeccanica', system: 'Sistemi', selected: 'Dalla ricerca alla pratica.', papers: 'Idee, verificate e condivise.', journey: 'Imparare. Costruire. Esplorare.', researchTitle: 'Comprendere il movimento.\nDargli significato.', aboutTitle: 'La curiosità di un ricercatore.\nL’approccio di un ingegnere.', connect: 'Parliamone insieme.', contactBody: 'Ti occupi di movimento umano, computer vision o hai un progetto da sviluppare insieme? Scrivimi.', cv: 'Scarica il CV', shortCv: 'CV breve', longCv: 'CV completo', view: 'Visita il progetto', read: 'Leggi il paper', code: 'Vedi il codice', skip: 'Vai al contenuto', theme: 'Attiva il tema scuro', light: 'Attiva il tema chiaro', menu: 'Apri la navigazione', close: 'Chiudi la navigazione', top: 'Torna all’inizio', loading: 'Preparazione PDF…', failed: 'Impossibile creare il PDF. Riprova.', count: 'progetti', education: 'Formazione', work: 'Esperienza di ricerca', overview: 'Qualcosa su di me', focus: 'Ambiti di ricerca', publicationsLabel: 'Pubblicazioni e preprint', projectsLabel: 'Progetti selezionati', historyLabel: 'Formazione ed esperienza', elsewhere: 'Altri profili', copyright: 'Ricerca e sviluppo', present: 'Presente' },
};

function readPreference(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function savePreference(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* Preferences are optional in restricted browsers. */ } }

export default function App() {
  const [lang, setLang] = useState<Language>(() => readPreference('portfolio-language') === 'it' ? 'it' : 'en');
  const [darkMode, setDarkMode] = useState(() => { const saved = readPreference('portfolio-theme'); return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; });
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const headerInner = useRef<HTMLDivElement>(null);
  const t = labels[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    savePreference('portfolio-language', lang);
    savePreference('portfolio-theme', darkMode ? 'dark' : 'light');
  }, [lang, darkMode]);

  useEffect(() => {
    const header = headerInner.current;
    if (!header) return;
    const measure = () => document.documentElement.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height) + 1}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--header-height'); };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > window.innerHeight * 0.6);
      const boundary = window.innerHeight * 0.4;
      let current = 'home';
      sectionIds.forEach(id => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= boundary) current = id; });
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    const onResize = () => { if (window.innerWidth > 1000) setMenuOpen(false); };
    window.addEventListener('keydown', close);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', onResize); };
  }, [menuOpen]);

  const downloadCV = async (type: 'short' | 'long') => {
    if (pdfBusy) return;
    setPdfBusy(true); setPdfError(false);
    try { const { generateCV } = await import('./services/pdfGenerator'); generateCV(data, lang, type); }
    catch { setPdfError(true); }
    finally { setPdfBusy(false); }
  };
  const scholar = data.profile.socials.find(social => social.network === 'Scholar');

  return <MotionConfig reducedMotion="user">
    <a href="#main" className="skip-link">{t.skip}</a>
    <header className="site-header">
      <div ref={headerInner} className="header-inner shell">
        <a className="wordmark" href="#home" aria-label={`${data.profile.name} — Home`} onClick={() => setMenuOpen(false)}>cdp<span>.</span></a>
        <nav className="desktop-nav" aria-label={lang === 'en' ? 'Main navigation' : 'Navigazione principale'}>
          {sectionIds.slice(0, 5).map(id => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{t[id as keyof typeof t]}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language-button" onClick={() => setLang(lang === 'en' ? 'it' : 'en')} aria-label={lang === 'en' ? 'Passa all’italiano' : 'Switch to English'}><span className={lang === 'en' ? 'selected' : ''}>EN</span><span className="language-divider">/</span><span className={lang === 'it' ? 'selected' : ''}>IT</span></button>
          <button className="icon-button" onClick={() => setDarkMode(value => !value)} aria-label={darkMode ? t.light : t.theme}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <a href="#contact" className="header-contact">{t.contact}<ArrowUpRight size={16} /></a>
          <button ref={menuButton} className="icon-button menu-button" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" hidden={!menuOpen} aria-label={lang === 'en' ? 'Mobile navigation' : 'Navigazione mobile'}>{sectionIds.map((id, i) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)} aria-current={active === id ? 'location' : undefined}><span className="mono">0{i + 1}</span>{t[id as keyof typeof t]}<ArrowUpRight size={18} /></a>)}</nav>
    </header>

    <ScrollJourney active={active} label={lang === 'en' ? 'Page chapters' : 'Capitoli della pagina'} links={[{ id: 'home', label: 'Home' }, ...sectionIds.map(id => ({ id, label: t[id as keyof typeof t] }))]} />
    <main id="main">
      <Hero data={data} lang={lang} onDownload={() => downloadCV('short')} pdfBusy={pdfBusy} />
        <Section id="about" number="01" label={t.overview} title={t.aboutTitle}>
          <div className="about-grid">
            <Reveal className="about-copy">{data.profile.about[lang].split('\n\n').map((paragraph, i) => <p key={i} className={i === 0 ? 'lead' : ''}>{paragraph}</p>)}<a className="text-link" href={`mailto:${data.profile.email}`}>{data.profile.email}<ArrowUpRight size={18} /></a></Reveal>
            <Reveal delay={0.12}><aside className="news-panel" id="news"><h3><span className="status-dot" />{t.news}</h3><ul>{data.news.map(item => <li key={item.date}><time className="mono" dateTime={item.date}>{new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${item.date}-01T00:00:00Z`))}</time>{item.link ? <a href={item.link} {...external}>{item[lang]}<ArrowUpRight size={16} /></a> : <p>{item[lang]}</p>}</li>)}</ul></aside></Reveal>
          </div>
        </Section>
        <Section id="research" number="02" label={t.focus} title={t.researchTitle}>
          <div className="research-grid">{data.research.areas.map((area, i) => <Reveal key={area.icon} delay={i * 0.1}><article className="research-card"><span className="research-index mono">R / 0{i + 1}</span><h3>{area.title[lang]}</h3><p>{area.description[lang]}</p><span className="research-rule" aria-hidden="true" /></article></Reveal>)}</div>
        </Section>
        <Section id="publications" number="03" label={t.publicationsLabel} title={t.papers} aside={scholar && <a className="text-link" href={scholar.url} {...external}>Google Scholar<ArrowUpRight size={18} /></a>}>
          <Reveal><PublicationsShelf publications={data.publications} lang={lang} /></Reveal>
        </Section>
        <Section id="projects" number="04" label={t.projectsLabel} title={t.selected}>
          <Reveal><ProjectsShowcase projects={data.projects} lang={lang} /></Reveal>
        </Section>
        <Section id="history" number="05" label={t.historyLabel} title={t.journey} aside={<button className="text-link" disabled={pdfBusy} onClick={() => downloadCV('long')}>{pdfBusy ? t.loading : t.longCv}<Download size={17} /></button>}>
          <Reveal><ol className="timeline">{data.history.map(item => <li key={item.id}><div className="timeline-date mono">{item.year.replace('Present', t.present)}<span>{item.type === 'education' ? t.education : t.work}</span></div><div className="timeline-body"><h3>{item.title[lang]}</h3><p className="institution">{item.institution}</p><details className="timeline-details"><summary>{lang === 'en' ? 'More about this experience' : 'Dettagli del percorso'}</summary><p>{item.description[lang]}</p></details></div><div className="institution-logos">{(item.logos ?? (item.logo ? [item.logo] : [])).map(logo => <img key={logo} src={logo} alt={logo.includes('lunex') ? 'LUNEX University' : 'UNICAS'} loading="lazy" width="56" height="56" />)}</div></li>)}</ol></Reveal>
        </Section>
      <footer id="contact" className="contact-section chapter" aria-labelledby="contact-heading">
        <Reveal className="shell"><p className="eyebrow"><span>06</span>{t.contact}</p><div className="contact-heading"><h2 id="contact-heading">{t.connect}</h2><a className="contact-arrow" href={`mailto:${data.profile.email}`} aria-label={lang === 'en' ? 'Send an email' : 'Invia un’email'}><ArrowUpRight /></a></div><div className="contact-grid"><div><p>{t.contactBody}</p><a className="email-link" href={`mailto:${data.profile.email}`}><Mail size={20} />{data.profile.email}</a></div><div className="cv-actions"><button onClick={() => downloadCV('short')} disabled={pdfBusy} className="button button-white">{pdfBusy ? <Loader2 className="spin" size={18} /> : <Download size={18} />}{t.shortCv}<span>PDF</span></button><button onClick={() => downloadCV('long')} disabled={pdfBusy} className="button button-outline">{t.longCv}<ArrowDown size={18} /></button></div></div><div className="social-row"><span className="mono">{t.elsewhere}</span>{data.profile.socials.map(social => <a key={social.network} href={social.url} {...external}>{social.network}<ArrowUpRight size={15} /></a>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} {data.profile.name}</span><span>{t.copyright}</span><a href="#home">{t.top}<ArrowUp size={15} /></a></div></Reveal>
      </footer>
    </main>
    {pdfError && <div className="error-toast" role="alert">{t.failed}<button className="icon-button" onClick={() => setPdfError(false)} aria-label={lang === 'en' ? 'Dismiss' : 'Chiudi'}><X size={18} /></button></div>}
    {scrolled && <a href="#home" className="back-to-top" aria-label={t.top}><ArrowUp size={20} /></a>}
  </MotionConfig>;
}
