import React, { useState, useEffect } from 'react';
import { AppData, Language } from './types';
import Section from './components/Section';
import Hero from './components/Hero';
import BackgroundAnimation from './components/BackgroundAnimation';
import { generateCV } from './services/pdfGenerator';
import { 
  Moon, Sun, Globe, Github, Linkedin, GraduationCap, 
  Download, ExternalLink, Calendar, MapPin, Layers, FileText, Instagram 
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
      <span className="text-sm font-mono text-primary-600 dark:text-primary-400 mb-1 block">{item.year}</span>
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

const PaperItem = ({ paper, ui, lang }: { paper: any, ui: any, lang: Language }) => (
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
      case 'Instagram': return <Instagram size={20} />;
      default: return <ExternalLink size={20} />;
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
            
            <div className="flex items-center gap-4">
                <button onClick={toggleLang} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-mono text-sm">
                    <Globe size={18} />
                    {lang.toUpperCase()}
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
      </nav>

      <main className="pt-16">
        <Hero data={data} lang={lang} />

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
                        {cat === 'all' ? data.ui.all[lang] : cat}
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
            <div className="grid grid-cols-1 gap-4 w-full">
                {data.publications.map(paper => (
                    <PaperItem key={paper.id} paper={paper} ui={data.ui} lang={lang} />
                ))}
            </div>
        </Section>

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
                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:scale-110 transition-all"
                            >
                                {getIcon(social.iconName)}
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
