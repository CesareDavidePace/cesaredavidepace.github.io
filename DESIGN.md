# Research in motion

## Direction

A personal research portfolio told through seven spacious chapters. The opening remains quiet: name, role, one sentence, two actions. Motion accompanies the reading order. Cobalt connects the research identity to navigation and interaction; full-width changes in background distinguish chapters.

## Chapter sequence

| Chapter | Presentation | Main action |
| --- | --- | --- |
| 00 · Introduction | Large name, concise research focus, generous space | Explore research or download the CV |
| 01 · About | Personal statement beside dated updates | Read updates or make contact |
| 02 · Research | Cobalt background, three numbered research areas | Understand the research focus |
| 03 · Publications | Two papers per page, year selection, direct source links | Read a paper or browse the archive |
| 04 · Projects | One project at a time, prominent image or workflow diagram | Open the project, repository, or app listing |
| 05 · Experience | Compact timeline with expandable descriptions | Explore a role or download the full CV |
| 06 · Contact | Dark background, oversized invitation, direct links | Email or visit a professional profile |

All existing publications and projects remain accessible. The new research projects lead the project sequence, followed by the existing applied work. Filters return to the first matching item, and previous/next controls stop at their respective boundaries.

## Layout

- Chapters fill at least the available screen below navigation. A measured header height accounts for typography, viewport changes, and enlarged text.
- Content stays in document flow. Chapters can grow when text, mobile layouts, or expanded descriptions require more space.
- Native scroll snapping aligns desktop chapters. Mobile uses proximity snapping. Scrolling is never intercepted with wheel or touch handlers, and there are no nested content scrollers.
- Wide screens include a seven-step chapter navigator. On smaller screens, the existing navigation provides the same destinations.
- The opening is intentionally free of competing cards, counters, or large decorative diagrams.

## Motion

| Element | Behavior | Timing |
| --- | --- | --- |
| Main name | Small upward entrance | 800 ms |
| Chapter titles and content | Fade and rise once when entering view | 650 ms |
| Research areas | Staggered entrances | 100 ms between areas |
| Hero | Slight upward movement and scale reduction while leaving | Linked to scroll |
| Chapter numerals | Slow vertical parallax | Linked to chapter position |
| Chapter rules | Draw from left to right | Linked to chapter position |
| Reading progress | Thin line at the top of the page | Linked to document progress |
| Project or publication change | Short upward fade | 400–450 ms |

There are no indefinitely looping decorative animations. Reduced-motion preferences disable animated transforms and scroll snapping. Focused content is immediately visible even if its entrance has not run.

## Content provenance

The research additions are summaries of the public README files, verified on 5 September 2026:

- https://github.com/CesareDavidePace/poseidon
- https://github.com/CesareDavidePace/pose2landmarks-benchmark

Each entry links directly to its repository. The workflow diagrams describe inputs and outputs; no generated results, performance claims, star counts, or invented project screenshots are used.
