import { useState, useEffect } from 'react';
import { AppData, Language } from './types';
import Section from './components/Section';
import Hero from './components/Hero';
import BackgroundAnimation from './components/BackgroundAnimation';
import { generateCV } from './services/pdfGenerator';
import {
  Moon, Sun, Globe, Github, Linkedin, GraduationCap,
  Download, ExternalLink, MapPin, Layers, FileText,
  BookOpen, FlaskConical, Activity, Brain, Microscope, ArrowUp, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components defined here to keep file count within limits while maintaining structure ---

const TimelineItemView = ({ item, lang, isLast }: { item: any, lang: Language, isLast: boolean }) => (
  <div className="flex gap-4 relative">
    {/* Line */}
    {!isLast && <div className="absolute left-[11px] top-8 bottom-[-32px] w-0.5 bg-gray-200 dark:bg-gray-700"></div>}
    
    {/* Dot */}
    <div className="relative z-10 mt-1.5 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
    </div>
    
    <div className="pb-12 flex-1">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm font-mono text-primary-600 dark:text-primary-400">{item.year}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === 'education' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
          {item.type === 'education' ? lang === 'en' ? 'Education' : 'Istruzione' : lang === 'en' ? 'Work' : 'Lavoro'}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title[lang]}</h3>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <MapPin size={14} className="shrink-0" />
        <span className="flex-1">{item.institution}</span>
        {item.logos ? (
          <div className="flex gap-2">
            {item.logos.map((logo: string, idx: number) => (
              <img 
                key={idx}
                src={logo} 
                alt={item.institution} 
                className={`h-16 w-16 object-contain opacity-90 dark:opacity-90 ${logo.includes('lunex') ? 'dark:invert' : ''}`}
              />
            ))}
          </div>
        ) : item.logo && (
          <img 
            src={item.logo} 
            alt={item.institution} 
            className="h-16 w-16 object-contain opacity-90 dark:opacity-90"
          />
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
        {item.description[lang]}
      </p>
    </div>
  </div>
);

const ProjectCard = ({ project, lang, ui }: { project: any, lang: Language, ui: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
  >
    <div className="h-64 overflow-hidden relative">
      <img 
        src={project.imageUrl} 
        alt={project.title[lang]} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        {project.category}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
        {project.title[lang]}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
        {project.description[lang]}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map((tech: string) => (
          <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {project.link && (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline"
          >
            {ui.viewProject[lang]} <ExternalLink size={14} className="ml-1" />
          </a>
        )}
        {project.playStoreLink && (
          <a 
            href={project.playStoreLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            Play Store
          </a>
        )}
        {project.appStoreLink && (
          <a 
            href={project.appStoreLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 dark:bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            App Store
          </a>
        )}
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
          >
            <Github size={16} className="mr-1" /> GitHub
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

const PaperItem = ({ paper }: { paper: any }) => (
  <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 mb-2">
            {paper.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    #{tag}
                </span>
            ))}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
          {paper.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
          {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ', et al.' : ''}
        </p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-500 italic">
          {paper.venue}, {paper.year}
        </p>
      </div>
      <div className="flex flex-wrap md:flex-col gap-2 md:shrink-0">
          {paper.doi && (
            <a 
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              <ExternalLink size={16} className="mr-2" />
              DOI
            </a>
          )}
          {paper.pdfLink && (
            <a 
              href={paper.pdfLink} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              <FileText size={16} className="mr-2" />
              PDF
            </a>
          )}
          {paper.githubUrl && (
            <a 
              href={paper.githubUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              <Github size={16} className="mr-2" />
              Code
            </a>
          )}
      </div>
    </div>
  </div>
);

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Data
  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then((d: AppData) => setData(d))
      .catch(err => console.error("Failed to load content:", err));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'it' : 'en');

  // Loading state
  if (!data) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );
  }

  // Nav links (shared between desktop and mobile menu)
  const navLinks = [
    { id: 'about',        label: data.ui.about[lang] },
    { id: 'news',         label: data.ui.news[lang] },
    { id: 'research',     label: data.ui.research[lang] },
    { id: 'history',      label: data.ui.history[lang] },
    { id: 'projects',     label: data.ui.projects[lang] },
    { id: 'publications', label: data.ui.papers[lang] },
  ];

  // Filter Logic
  const categories = ['all', ...Array.from(new Set(data.projects.map(p => p.category)))];
  const filteredProjects = filter === 'all' 
    ? data.projects 
    : data.projects.filter(p => p.category === filter);

  // Icon mapping
  const getIcon = (name: string) => {
    switch (name) {
      case 'Github': return <Github size={20} />;
      case 'Linkedin': return <Linkedin size={20} />;
      case 'GraduationCap': return <GraduationCap size={20} />;
      case 'BookOpen': return <BookOpen size={20} />;
      case 'FlaskConical': return <FlaskConical size={20} />;
      default: return <ExternalLink size={20} />;
    }
  };

  const getResearchIcon = (name: string) => {
    switch (name) {
      case 'Activity': return <Activity size={28} />;
      case 'Brain': return <Brain size={28} />;
      case 'Microscope': return <Microscope size={28} />;
      default: return <Activity size={28} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 relative">
      <BackgroundAnimation darkMode={darkMode} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className={`font-semibold text-lg tracking-tight text-gray-900 dark:text-white transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
            Cesare Davide Pace
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-mono text-sm">
              <Globe size={18} />
              {lang.toUpperCase()}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        <Hero data={data} lang={lang} />

        <Section id="about" title={data.ui.about[lang]} className="bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm rounded-3xl my-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="max-w-3xl">
            {data.profile.about[lang].split('\n\n').map((para, i) => (
              <p key={i} className={`text-lg text-gray-700 dark:text-gray-300 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={`mailto:${data.profile.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                ✉ {data.profile.email}
              </a>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                📍 {data.profile.location}
              </span>
            </div>
          </div>
        </Section>

        <Section id="news" title={data.ui.news[lang]} className="bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm rounded-3xl my-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <ul className="space-y-3 max-w-3xl">
            {data.news.map((item, i) => (
              <li key={i} className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                <span className="font-mono text-sm text-primary-600 dark:text-primary-400 shrink-0 pt-0.5 w-20">{item.date}</span>
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.link ? 'bg-primary-500' : 'bg-gray-400 dark:bg-gray-600'}`} />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 hover:underline">
                        {item[lang]}
                      </a>
                    ) : item[lang]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="research" title={data.ui.research[lang]} className="bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm rounded-3xl my-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl italic">{data.research.tagline[lang]}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.research.areas.map((area, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-gray-50 dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-shadow cursor-default">
                <div className="text-primary-500 mb-4">{getResearchIcon(area.icon)}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{area.title[lang]}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{area.description[lang]}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="history" title={data.ui.history[lang]} className="bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm rounded-3xl my-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="max-w-3xl">
                {data.history.map((item, index) => (
                    <TimelineItemView 
                        key={item.id} 
                        item={item} 
                        lang={lang} 
                        isLast={index === data.history.length - 1} 
                    />
                ))}
            </div>
        </Section>

        <Section id="projects" title={data.ui.projects[lang]}>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                            filter === cat 
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                            : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {cat === 'all' ? data.ui.all[lang] : cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                ))}
            </div>
            
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence>
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} lang={lang} ui={data.ui} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </Section>

        <Section id="publications" title={data.ui.papers[lang]}>
            <div className="w-full">
              {[...new Set(data.publications.map(p => p.year))].sort((a, b) => b - a).map(year => (
                <div key={year} className="mb-10 last:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{year}</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {data.publications.filter(p => p.year === year).map(paper => (
                      <PaperItem key={paper.id} paper={paper} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </Section>

        {/* Scroll-to-top */}
        <AnimatePresence>
          {scrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 z-50 p-3 bg-primary-500 text-white rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Footer & Contact */}
        <footer className="bg-white/90 dark:bg-dark-card/90 border-t border-gray-100 dark:border-gray-800 py-20 px-6 mt-20 backdrop-blur">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Let's Connect</h2>
                    <div className="flex gap-4 justify-center md:justify-start">
                        {data.profile.socials.map(social => (
                            <a
                                key={social.network}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                title={social.network}
                                aria-label={social.network}
                                className="group relative p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:scale-110 transition-all"
                            >
                                {getIcon(social.iconName)}
                                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-gray-900 dark:bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                  {social.network}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => generateCV(data, lang, 'short')}
                        className="flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Download size={18} className="mr-2" />
                        {data.ui.downloadCvShort[lang]}
                    </button>
                    <button 
                         onClick={() => generateCV(data, lang, 'long')}
                         className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Layers size={18} className="mr-2" />
                        {data.ui.downloadCvLong[lang]}
                    </button>
                </div>
            </div>
            
            <div className="text-center mt-16 text-sm text-gray-400 dark:text-gray-600">
                © {new Date().getFullYear()} {data.profile.name}. Built with React & Tailwind.
            </div>
        </footer>
      </main>
    </div>
  );
}
