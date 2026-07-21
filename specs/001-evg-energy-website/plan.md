# Implementation Plan: EVG Erliweg Energy Transparency Website

**Branch**: `[001-evg-energy-website]` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-evg-energy-website/spec.md`

## Summary

Build a static, mobile-responsive EVG Erliweg website hosted on GitHub Pages
that publishes current quarter/year metrics, cumulative totals since 2025-10-01,
and historical quarter/year views. The implementation uses vanilla HTML, CSS,
and JavaScript, with energy data managed in a repository data file and published
through build/deploy automation after quarterly updates.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022)

**Primary Dependencies**: No runtime framework dependencies; optional GitHub
Pages deployment workflow automation

**Storage**: Version-controlled static JSON data file in private repository

**Testing**: Static validation checklist and manual browser verification across
desktop/mobile and dark/light themes

**Target Platform**: Public website on the default GitHub Pages domain,
current evergreen browsers on desktop and mobile

**Project Type**: Static web application

**Performance Goals**: First meaningful content visible within 1 second on
typical mobile 4G; key metric cards visible without interaction on first load;
Google PageSpeed Insights performance score >=95 for each primary page

**Constraints**: Vanilla HTML/CSS/JS as default approach, no separate admin area,
data updated quarterly via repository file change, dark mode support required,
history and cumulative calculations must remain deterministic from source data,
all primary website content must be presented in German, WCAG 2.1 AA
conformance required for primary pages and key flows

**Scale/Scope**: 1 public website, 1 maintainers' data file workflow, initial
community size 10 parties with quarterly records from Q4 2025 onward

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase-0 gate evaluation:

- **I. Spec-Driven Delivery**: PASS
  - `spec.md` exists and is the source of requirements.
- **II. Traceable Requirements**: PASS
  - Plan maps directly to user stories and FR-001..FR-020.
- **III. Testable by Default**: PASS
  - Independent user-story test paths and validation strategy defined.
- **IV. Incremental, Reversible Change**: PASS
  - Static-site changes and versioned data-file updates are small and reversible.
- **V. Simplicity and Operational Clarity**: PASS
  - Vanilla stack and static deployment minimize operational complexity.

Post-Phase-1 re-check:

- PASS: `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`
  preserve requirement traceability and keep design decisions simple and
  reversible.

## Project Structure

### Documentation (this feature)

```text
specs/001-evg-energy-website/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── energy-data.schema.json
│   └── publishing-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── index.html
├── history.html
├── about.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── charts.js
│       └── data-loader.js
├── data/
│   └── energy-data.json
└── .github/
    └── workflows/
        └── deploy-pages.yml
```

**Structure Decision**: Single static website structure at repository root with
data separated under `data/` and deployment automation under `.github/workflows/`.
This satisfies the vanilla stack requirement and quarterly update workflow.

## Complexity Tracking

No constitution violations identified. No complexity exceptions required.
