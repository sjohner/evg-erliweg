# Implementation Plan: All-Party EVG Catalog and Producer System Details

**Branch**: `[004-all-party-catalog]` | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-all-party-catalog/spec.md`

## Summary

Migrate the canonical energy contract from a producer-only catalog to an all-party catalog in `data/energy-data.json`, add exact membership dates and effective producer configurations with PV details, preserve producer-only quarterly measurements and derived totals, and derive both community party counts from the catalog for the latest available quarter.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022), JSON

**Primary Dependencies**: No new dependencies

**Storage**: Version-controlled JSON file at `data/energy-data.json`

**Testing**: `npm run check:data`, `npm run check:js`, local derivation checks for latest-quarter counts and totals

**Target Platform**: Static GitHub Pages site in evergreen browsers

**Project Type**: Static web application

**Performance Goals**: Preserve current static-site performance; count derivation operates over a small catalog and existing quarter records

**Constraints**: Keep public UI content German, repository docs English, no `data/site-content.json`, no HTML-hosted party data, no new runtime service, no consumer measurement UI

**Scale/Scope**: Ten initial EVG parties, current producer-only quarterly measurements, future-effective producer configuration periods

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase-0 gate evaluation:

- **I. Spec-Driven Delivery**: PASS
  - This plan follows `specs/004-all-party-catalog/spec.md` and amends conflicting Feature 001/002 artifacts before implementation.
- **II. Traceable Requirements**: PASS
  - Requirements FR-001 through FR-015 map to tasks in `tasks.md`, schema changes, validation, runtime derivation, and README/quickstart evidence.
- **III. Testable by Default**: PASS
  - Each user story defines an independent test; automated checks cover the data contract and JavaScript syntax.
- **IV. Incremental, Reversible Change**: PASS
  - Changes are limited to the energy data contract, shared helper functions, validation, one homepage placeholder, and documentation.
- **V. Simplicity and Operational Clarity**: PASS
  - The solution keeps static JSON plus vanilla JavaScript and adds no dependency or service.

Post-Phase-1 re-check:

- PASS: The design keeps one canonical structured data source, resolves the Feature 002 producer-only conflict explicitly, and preserves Feature 001's HTML content boundary.
- PASS: Membership overlap, configuration resolution, and count derivation use shared helpers for operational clarity.
- PASS: Validation evidence is captured through existing npm scripts, avoiding new tooling.

## Project Structure

### Documentation (this feature)

```text
specs/004-all-party-catalog/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── energy-data.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
.
├── index.html
├── assets/js/quarter-utils.js
├── assets/js/data-loader.js
├── assets/js/app.js
├── data/energy-data.json
├── scripts/check-energy-data.mjs
├── specs/001-evg-energy-website/
├── specs/002-party-quarterly-data/
└── README.md
```

**Structure Decision**: Keep the current single-site structure. Feature 004 owns the current contract details while Feature 001 and 002 receive narrow amendments that point to the all-party catalog.

## Complexity Tracking

No constitution violations identified. No complexity exceptions required.
