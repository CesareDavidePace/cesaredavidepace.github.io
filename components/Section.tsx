import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface SectionProps {
  id: string;
  number: string;
  label: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export default function Section({ id, number, label, title, aside, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const numberY = useTransform(scrollYProgress, [0, 1], [55, -55]);
  const ruleScale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} id={id} className={`section chapter chapter-${id}`} aria-labelledby={`${id}-heading`}>
      <motion.span className="chapter-watermark" aria-hidden="true" style={reducedMotion ? undefined : { y: numberY }}>
        {number}
      </motion.span>
      <div className="chapter-inner shell">
        <motion.div
          className="chapter-intro"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow"><span>{number}</span>{label}</p>
          <div className="section-heading">
            <h2 id={`${id}-heading`}>{title}</h2>
            {aside}
          </div>
        </motion.div>
        <div className="chapter-body">{children}</div>
        <motion.div className="chapter-rule" aria-hidden="true" style={{ scaleX: reducedMotion ? 1 : ruleScale }} />
      </div>
    </section>
  );
}
