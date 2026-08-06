# Implementation Plan: EVG Erliweg Energy Transparency Website

**Branch**: `[001-evg-energy-website]` | **Date**: 2026-08-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-evg-energy-website/spec.md`

## Amendment: Content Boundary Decision (2026-08-06)

Split mutable site content from measurements: `data/site-content.json` owns community, about, and contact facts; Feature 002's `data/energy-data.json` owns party-level energy data. This prevents unrelated editorial updates from changing measurement data and gives each source one canonical schema. The loader combines both sources; the deployment and validator require both.

## Summary

Build a static, mobile-responsive EVG Erliweg website hosted on GitHub Pages
that publishes latest-available-quarter/corresponding-year metrics, cumulative totals since 2025-10-01,
and historical quarter/year views. The implementation uses vanilla HTML, CSS,
and JavaScript, with energy data managed in a repository data file and published
through direct pushes to `main` and the GitHub Pages workflow after quarterly
updates. The header also exposes an accessible icon-only link to the public
repository at `https://github.com/sjohner/evg-erliweg` immediately to the left
of the dark-mode toggle. At desktop and mobile widths, the website title stays
left-aligned while both equal-sized actions stay right-aligned on the same row.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022)

**Primary Dependencies**: No runtime framework dependencies; optional GitHub
Pages deployment workflow automation; inline GitHub mark using current color

**Storage**: Version-controlled static JSON data file in the public repository

**Testing**: Static validation checklist; manual browser verification at 390px,
430px, 768px, and 1280px in dark/light themes; first-time participant checks
for SC-001 and SC-004

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
conformance required for primary pages and key flows; repository link must use
semantic anchor markup, a German accessible name, and remain immediately before
the theme toggle at all supported viewport widths; the title and header actions
must remain on one horizontal level, with secondary mobile context omitted when
needed to preserve the layout; publication uses direct
pushes to `main` with fix-forward corrections

**Scale/Scope**: 1 public website, 1 maintainers' data file workflow, initial
community size 10 parties with quarterly records from Q4 2025 onward

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase-0 gate evaluation:

- **I. Spec-Driven Delivery**: PASS
  - `spec.md` exists and is the source of requirements.
- **II. Traceable Requirements**: PASS
  - Plan maps directly to user stories and FR-001 through FR-007 plus FR-009
    through FR-025, including SC-001 through SC-010.
  - The responsive-header amendment traces from User Story 1 scenario 6 and
    FR-025 through SC-010, the header-actions contract, and quickstart scenario 3a.
- **III. Testable by Default**: PASS
  - Independent user-story test paths and validation strategy are defined,
    including title/action alignment checks at 390px, 430px, 768px, and 1280px.
- **IV. Incremental, Reversible Change**: PASS
  - Static-site changes and versioned data-file updates are small and reversible;
    the header amendment is isolated to existing markup and responsive CSS.
- **V. Simplicity and Operational Clarity**: PASS
  - Vanilla stack and static deployment minimize operational complexity.

Post-Phase-1 re-check:

- PASS: `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`
  preserve requirement traceability and keep design decisions simple and
  reversible.
- PASS: The repository link uses existing header and icon-control patterns,
  adds no dependency or persisted data, and is independently reversible.
- PASS: The single-row layout keeps the website title left-aligned and both
  44px actions right-aligned, allowing secondary mobile context to be omitted
  without changing the accessible title or action semantics.
- PASS: Participant and viewport-matrix checks provide evidence for the amended
  measurable success criteria without adding runtime complexity.

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
│   ├── header-actions-contract.md
│   └── publishing-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   ├── accessibility.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   ├── performance.css
│   │   ├── styles.css
│   │   └── variables.css
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
This satisfies the vanilla stack requirement and quarterly update workflow. The
repository action is implemented in `index.html` and reuses shared styles in
`assets/css/components.css` and `assets/css/accessibility.css`; no JavaScript or
data schema change is required.

## Complexity Tracking

No constitution violations identified. No complexity exceptions required.
