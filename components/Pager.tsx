import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Language } from '../types';

interface PagerProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
  lang: Language;
  label: string;
  controls: string;
}

export default function Pager({ page, count, onChange, lang, label, controls }: PagerProps) {
  if (count <= 1) return null;
  return (
    <div className="pager" role="group" aria-label={label}>
      <button className="pager-arrow" disabled={page === 0} onClick={() => onChange(page - 1)} aria-label={lang === 'en' ? 'Previous' : 'Precedente'} aria-controls={controls}>
        <ArrowLeft size={19} />
      </button>
      <div className="pager-pages">
        {Array.from({ length: count }, (_, index) => (
          <button key={index} aria-label={`${lang === 'en' ? 'Page' : 'Pagina'} ${index + 1}`} aria-current={page === index ? 'page' : undefined} aria-controls={controls} onClick={() => onChange(index)}>
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
      <button className="pager-arrow" disabled={page === count - 1} onClick={() => onChange(page + 1)} aria-label={lang === 'en' ? 'Next' : 'Successiva'} aria-controls={controls}>
        <ArrowRight size={19} />
      </button>
    </div>
  );
}
