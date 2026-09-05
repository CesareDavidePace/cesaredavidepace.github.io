# Cesare Davide Pace — Personal Website

Bilingual academic portfolio for AI, computer vision, and biomechanics, built with React, TypeScript, Vite, and custom CSS.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

The build runs TypeScript checks before generating `dist/`. GitHub Pages deployment remains configured in `.github/workflows/deploy.yml`.

## Content and design

- `public/data.json` is the content source used by the site and PDF downloads. The older root-level `data.json` is not used by the application.
- `App.tsx` contains navigation, bilingual interface copy, experience, and contact details. `ProjectsShowcase.tsx` and `PublicationsShelf.tsx` provide the project and publication browsers.
- `components/Hero.tsx` and `components/Section.tsx` define the introductory layout and section structure.
- `index.css` contains the base theme. `chapters.css` defines full-height chapters, scroll alignment, responsive layouts, and reduced-motion behavior. Styling is bundled locally; no Tailwind CDN is required.
- Language and theme preferences are saved locally when browser storage is available. PDF generation loads only when requested.
- Both short and extended CVs remain available in English and Italian.

The September 2026 redesign takes inspiration from [Brittany Chiang](https://brittanychiang.com/) for content hierarchy, [Lee Robinson](https://leerob.com/) for concise personal presentation, and [Rauno Freiberg](https://rauno.me/) for interaction detail. The resulting design uses cobalt accents, a simple introduction centered on the researcher, typographic research headings, publications browsable by year, and existing project imagery. No source code or artwork was copied from these references.

Existing biographical details, project information, publications, and SEO metadata are retained. Professional updates can be added to `public/data.json` when confirmed.

## Scroll experience

The page is a sequence of seven chapters: introduction, about, research, publications, projects, experience, and contact. Each chapter fills at least the viewport below the measured navigation height. Desktop uses native scroll snapping, with gentler alignment on mobile. Taller content remains in normal document flow and can always be scrolled.

Framer Motion provides entrance transitions, a scroll-linked hero, subtle chapter-number parallax, and reading progress. System reduced-motion preferences disable parallax, entrance movement, smooth scrolling, and snapping. Keyboard focus reveals content immediately. See [DESIGN.md](DESIGN.md) for the visual and interaction specification.

Two research projects were added from their public source repositories, checked on 5 September 2026:

- [Poseidon](https://github.com/CesareDavidePace/poseidon): multi-frame pose estimation using adaptive temporal weighting and feature fusion.
- [pose2landmarks-benchmark](https://github.com/CesareDavidePace/pose2landmarks-benchmark): neural architecture benchmarking for anatomical landmark regression and biomechanical evaluation.

The diagrams summarize the documented workflows; they are not measurements or live model output. No volatile repository metrics are stored.
