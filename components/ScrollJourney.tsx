import { motion, useScroll, useReducedMotion } from 'framer-motion';

interface JourneyLink { id: string; label: string }

export default function ScrollJourney({ links, active, label }: { links: JourneyLink[]; active: string; label: string }) {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  return (
    <>
      {!reducedMotion && <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />}
      <nav className={`chapter-nav ${['research', 'contact'].includes(active) ? 'on-dark-chapter' : ''}`} aria-label={label}>
        {links.map((link, index) => (
          <a href={`#${link.id}`} key={link.id} aria-label={link.label} aria-current={active === link.id ? 'location' : undefined}>
            <span className="chapter-nav-label">{link.label}</span>
            <span className="chapter-nav-number mono" aria-hidden="true">{String(index).padStart(2, '0')}</span>
            <span className="chapter-nav-mark" aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  );
}
