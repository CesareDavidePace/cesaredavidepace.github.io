import { useRef } from 'react';
import { ArrowDown, Download } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { AppData, Language } from '../types';

interface HeroProps {
  data: AppData;
  lang: Language;
  onDownload: () => void;
  pdfBusy: boolean;
}

export default function Hero({ data, lang, onDownload, pdfBusy }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section ref={ref} id="home" className="hero chapter" aria-labelledby="hero-heading">
      <div className="shell">
        <motion.div className="hero-content" style={reducedMotion ? undefined : { y, opacity, scale }}>
          <motion.h1 id="hero-heading" initial={reducedMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{data.profile.name}</motion.h1>
          <p className="hero-role">{data.profile.role[lang]}</p>
          <p className="hero-description">{data.profile.tagline[lang]}</p>
          <div className="hero-actions">
            <a href="#research" className="button button-primary">{lang === 'en' ? 'Explore my research' : 'Esplora la mia ricerca'}<ArrowDown size={18} /></a>
            <button className="text-link" onClick={onDownload} disabled={pdfBusy}>
              {pdfBusy ? lang === 'en' ? 'Preparing PDF…' : 'Preparazione PDF…' : lang === 'en' ? 'Download CV' : 'Scarica il CV'}
              <Download size={17} />
            </button>
          </div>
        </motion.div>
        <a href="#about" className="hero-scroll-cue"><span className="scroll-cue-line" aria-hidden="true" /><span className="mono">{lang === 'en' ? 'Scroll to discover' : 'Scorri per scoprire'}</span><ArrowDown size={16} /></a>
      </div>
    </section>
  );
}
