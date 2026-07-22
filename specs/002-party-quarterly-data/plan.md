# Implementation Plan: Party-Level Quarterly Data Updates

**Branch**: `[002-party-quarterly-data]` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-party-quarterly-data/spec.md`

## Summary

Extend the canonical quarterly data model so each producing party has explicit
per-quarter produced and consumed values, while preserving runtime-calculated
quarter and year totals for public pages. The change remains static-site-first:
maintainers update repository JSON data, push to `main`, and public metrics are
derived dynamically from party-level records during page rendering.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022), JSON

**Primary Dependencies**: No runtime framework dependencies; GitHub Pages deploy
workflow via GitHub Actions

**Storage**: Version-controlled JSON file at `data/energy-data.json`

**Testing**: Combined local and CI validation: maintainer pre-push data checks,
automated `validate-data` pipeline job (`npm run check:data`) that must pass
before deploy, browser quickstart checks, accessibility scan, and PageSpeed
checks on deployed pages

**Target Platform**: GitHub Pages for public hosting; evergreen desktop/mobile
browsers

**Project Type**: Static web application

**Performance Goals**: Preserve PageSpeed score >=95 for primary pages after
party-level aggregation changes

**Constraints**: Public website content remains German; repository documentation
must remain English; totals must be dynamically derived; no backend/admin area;
maintainer workflow remains push-to-main with fix-forward corrections; deploy
job MUST be gated by successful CI data validation

**Scale/Scope**: Community-level site with party-level quarterly records for a
small number of producing parties (currently 3), growing over time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase-0 gate evaluation:

- **I. Spec-Driven Delivery**: PASS
  - Work is rooted in `spec.md` for feature `002-party-quarterly-data`.
- **II. Traceable Requirements**: PASS
  - FR/SC mappings are explicit for party-level data and dynamic totals.
- **III. Testable by Default**: PASS
  - Independent tests defined for maintainer data entry and visitor-visible
    aggregate correctness.
- **IV. Incremental, Reversible Change**: PASS
  - Data-model evolution and renderer updates are additive and reversible.
- **V. Simplicity and Operational Clarity**: PASS
  - Static JSON + runtime aggregation avoids introducing backend complexity.

Post-Phase-1 re-check:

- PASS: `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`
  retain clear traceability, maintain static-site simplicity, and preserve
  English documentation with German public UI requirements.

## Project Structure

### Documentation (this feature)

```text
specs/002-party-quarterly-data/
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

**Structure Decision**: Continue the single static-site repository structure and
evolve only `data/energy-data.json` schema plus JavaScript derivation helpers.
No additional runtime services or project splits are required.

## Complexity Tracking

No constitution violations identified. No complexity exceptions required.
