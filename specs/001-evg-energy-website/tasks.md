# Tasks: EVG Erliweg Energy Transparency Website

## Amendment Tasks (2026-08-06)

- [X] T026 Amend Feature 001 contracts and documentation to make `data/site-content.json` canonical for mutable site facts and defer the energy schema to Feature 002.
- [X] T027 Move community, about, and contact facts to `data/site-content.json`; render mutable dates and facts from structured data while retaining stable UI copy in HTML.
- [X] T028 Validate site content and deploy both canonical files.

**Input**: Design documents from `/specs/001-evg-energy-website/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No separate automated test suite was explicitly requested. This task list therefore uses quickstart-based accessibility, performance, participant, viewport-matrix, and direct-push publication verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Public website content lives in the single entry page at repository root: `index.html`
- Shared assets live under `assets/`
- Canonical source data lives under `data/`
- Deployment automation lives under `.github/workflows/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the base static-site structure and minimal project tooling

- [X] T001 Create static site scaffold files `index.html`, `assets/css/styles.css`, `assets/js/app.js`, `assets/js/data-loader.js`, `assets/js/charts.js`, and `data/energy-data.json`
- [X] T002 Initialize minimal development tooling in `package.json`
- [X] T003 [P] Add repository usage, local preview, and quarterly update prerequisites to `README.md`
- [X] T004 [P] Create GitHub Pages repository configuration notes and publish-branch setup instructions in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create canonical community, about, contact, and quarterly seed dataset structure in `data/energy-data.json`
- [X] T006 [P] Implement shared JSON loading, date parsing, aggregation, and `lastUpdated` helpers in `assets/js/data-loader.js`
- [X] T007 [P] Implement global design tokens, responsive layout primitives, dark mode, and WCAG-compliant focus/contrast rules in `assets/css/styles.css`
- [X] T008 [P] Implement shared page bootstrap, German locale formatting, navigation behavior, and theme toggle logic in `assets/js/app.js`
- [X] T009 Create lightweight repository structure for static data updates and local preview support in `README.md` and repository root files
- [X] T010 Implement GitHub Pages publish workflow in `.github/workflows/deploy-pages.yml`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Current and Total Energy Performance (Priority: P1) 🎯 MVP

**Goal**: Deliver a German homepage that clearly shows the latest available quarter, its corresponding year, cumulative totals since 2025-10-01, reporting periods, dynamic producing-party count, and last-updated date

**Independent Test**: Open `index.html` via local preview and verify latest-available-quarter, corresponding-year, cumulative values, reporting-period labels, dynamic producing-party count, and last-updated date render correctly in German on desktop and mobile.

### Implementation for User Story 1

- [X] T011 [US1] Build semantic German homepage structure and metric placeholders in `index.html`
- [X] T012 [P] [US1] Add homepage metric-card, summary, and last-updated presentation styles in `assets/css/styles.css`
- [X] T013 [P] [US1] Implement homepage rendering for latest available quarter, corresponding year, cumulative totals, and reporting-period labels in `assets/js/app.js`
- [X] T014 [US1] Connect homepage rendering to quarterly source data and derived summary helpers (including dynamic producing-party count from active parties in latest quarter) in `assets/js/data-loader.js` and `index.html`
- [X] T015 [US1] Tune homepage accessibility and PageSpeed-critical markup/asset loading in `index.html`, `assets/css/styles.css`, and `assets/js/app.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Historical Quarters and Years (Priority: P2)

**Goal**: Deliver a history view for quarter/year exploration with clear no-data handling and visible last-updated context

**Independent Test**: Open `index.html`, navigate to the history section, switch between available quarters and years, and confirm correct values, reporting periods, no-data handling, and last-updated date are shown in German.

### Implementation for User Story 2

- [X] T016 [US2] Build German history section structure with period selectors, results regions, and empty-state messaging in `index.html`
- [X] T017 [P] [US2] Implement history data derivation, year/quarter selection logic, and last-updated rendering in `assets/js/app.js`
- [X] T018 [P] [US2] Add history table/chart presentation and responsive interaction styling in `assets/css/styles.css` and `assets/js/charts.js`
- [X] T019 [US2] Wire history section to canonical quarterly data and derived summaries in `assets/js/data-loader.js` and `index.html`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - About and Learn More (Priority: P3)

**Goal**: Deliver a German about/contact section with EVG Erliweg context, elektraeigenstrom explanation, official external link, and clear contact details

**Independent Test**: Open `index.html` and verify German static content, external link destination, accessible link labeling, and visible contact details.

### Implementation for User Story 3

- [X] T020 [US3] Create German about/contact content structure and semantic sections in `index.html`
- [X] T021 [P] [US3] Add about/contact layout, external-link, and focus-state styling in `assets/css/styles.css`
- [X] T022 [P] [US3] Render EVG Erliweg, elektraeigenstrom, and contact content from `data/energy-data.json` in `assets/js/app.js`
- [X] T023 [US3] Ensure about/contact semantics, external-link text, and language metadata satisfy WCAG expectations in `index.html` and `assets/js/app.js`

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all be independently functional

---

## Phase 6: User Story 4 - Quarterly Data Update via Repository File (Priority: P4)

**Goal**: Enable maintainers to update quarterly figures in the public repository and publish them by pushing directly to `main`

**Independent Test**: Edit one quarterly record in `data/energy-data.json`, push the change directly to `main`, wait for the GitHub Pages workflow, and verify updated values and last-updated date appear on public pages.

### Implementation for User Story 4

- [X] T024 [US4] Seed realistic quarterly records plus about/contact source content in `data/energy-data.json`
- [X] T025 [P] [US4] Add maintainer instructions for quarterly edits, direct pushes to `main`, fix-forward corrections, and deploy verification in `README.md`
- [X] T026 [US4] Implement the direct-push GitHub Pages publication flow in `.github/workflows/deploy-pages.yml` and `README.md`
- [X] T027 [US4] Ensure home and history sections derive displayed last-updated date from the latest `updatedAt` value in `assets/js/data-loader.js`, `assets/js/app.js`, and `index.html`
- [X] T028 [US4] Finalize default GitHub Pages publishing behavior in `.github/workflows/deploy-pages.yml` and `README.md`

**Checkpoint**: All user stories should now be independently usable, and the maintainer workflow should safely publish data updates

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T029 [P] Add final metadata, browser theming, and page-level SEO polish in `index.html`
- [X] T030 [P] Run cross-page accessibility and performance refinements in `assets/css/styles.css`, `assets/js/app.js`, and `assets/js/charts.js`
- [X] T031 Run end-to-end quickstart validation and update the completion checklist in `specs/001-evg-energy-website/quickstart.md`

---

## Phase 8: User Story 1 Amendment - GitHub Repository Header Action (Priority: P1)

**Goal**: Let visitors open the canonical project repository from an accessible icon-only link immediately left of the dark-mode toggle.

**Independent Test**: Open `index.html` at 390px, 430px, 768px, and 1280px widths in light and dark modes; verify the website title stays left-aligned while the equal-sized GitHub icon link and theme toggle stay right-aligned on the same horizontal level, the link targets `https://github.com/sjohner/evg-erliweg`, has a German accessible name and visible keyboard focus, and causes no overlap or horizontal overflow.

### Implementation for User Story 1 Amendment

- [X] T032 [P] [US1] Add a semantic icon-only anchor targeting `https://github.com/sjohner/evg-erliweg` immediately before `#theme-toggle`, with a German `aria-label` and accessibility-hidden inline GitHub mark, in `index.html`
- [X] T033 [P] [US1] Add repository-link sizing, current-color icon, hover, focus-visible, light/dark theme, and responsive header-action styles that preserve equal 44px targets and keep the left-aligned website title level with the right-aligned action group in `assets/css/components.css` and `assets/css/accessibility.css`
- [X] T034 [US1] Run the desktop/mobile, pointer/keyboard, light/dark, target-URL, control-order, and overflow checks from `specs/001-evg-energy-website/quickstart.md`, then record evidence and mark the GitHub repository header action complete in `specs/001-evg-energy-website/quickstart.md`

**Checkpoint**: The GitHub repository action satisfies FR-025, SC-010, and `specs/001-evg-energy-website/contracts/header-actions-contract.md` independently of energy-data loading and theme-toggle JavaScript.

---

## Phase 9: User Story 1 - First-Time Metric Discovery Validation (Priority: P1)

**Goal**: Produce participant evidence that first-time visitors can find the three primary metric groups within 30 seconds.

**Independent Test**: Run Scenario 1a from `specs/001-evg-energy-website/quickstart.md` with 10 first-time participants and confirm at least 9 identify the latest-quarter, corresponding-year, and all-time totals within 30 seconds.

- [X] T035 [US1] Run the 10-participant metric-discovery protocol for SC-001 and record anonymized completion counts, timing outcome, and pass/fail evidence in `specs/001-evg-energy-website/quickstart.md`

**Checkpoint**: SC-001 has reproducible participant evidence.

---

## Phase 10: User Story 2 - Responsive Flow Validation (Priority: P2)

**Goal**: Verify current-metric and historical-lookup flows at every viewport required by SC-003.

**Independent Test**: Complete both flows at 390px, 430px, 768px, and 1280px with no horizontal overflow, clipped controls, or navigation failure.

- [X] T036 [US2] Run the SC-003 current-metrics and historical-lookup flows at 390px, 430px, 768px, and 1280px, then record per-viewport pass/fail and overflow evidence in `specs/001-evg-energy-website/quickstart.md`

**Checkpoint**: SC-003 has evidence for the complete viewport matrix.

---

## Phase 11: User Story 3 - First-Time Context Discovery Validation (Priority: P3)

**Goal**: Produce participant evidence that first-time visitors can understand the project and find its reference and contact paths without assistance.

**Independent Test**: Run Scenario 4a from `specs/001-evg-energy-website/quickstart.md` with 10 first-time participants and confirm at least 9 complete all three discovery tasks without assistance.

- [X] T037 [US3] Run the 10-participant project, elektraeigenstrom-reference, and contact-discovery protocol for SC-004, then record anonymized completion counts and pass/fail evidence in `specs/001-evg-energy-website/quickstart.md`

**Checkpoint**: SC-004 has reproducible participant evidence.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can proceed in parallel with User Story 1 after shared helpers exist
- **User Story 3 (Phase 5)**: Depends on Foundational completion; can proceed in parallel with User Stories 1 and 2
- **User Story 4 (Phase 6)**: Depends on Foundational completion; full validation references public metric pages from User Stories 1 and 2
- **Polish (Phase 7)**: Depends on all desired user stories being complete
- **User Story 1 Amendment (Phase 8)**: Depends on the existing header and theme-toggle foundation; `T032` and `T033` can run in parallel, and both block `T034`
- **US1 Discovery Validation (Phase 9)**: Depends on the completed homepage and can run independently of Phases 8, 10, and 11
- **US2 Responsive Validation (Phase 10)**: Depends on completed current-metric and history flows; run after `T034` so the header action is included in the viewport matrix
- **US3 Discovery Validation (Phase 11)**: Depends on the completed about/contact experience and can run independently of Phases 8, 9, and 10

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - primary MVP slice
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - shares aggregation and rendering helpers with US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - largely independent of US1/US2 beyond shared layout and language conventions
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - publish-flow proof is strongest once US1/US2 displays exist
- **User Story 1 Amendment (P1)**: Extends the completed US1 header without depending on US2-US4 data or workflows

### Within Each User Story

- Shared page structure before story-specific rendering
- Rendering logic before final quality tuning
- Data connections before final validation of displayed output
- Story complete before moving to lower-priority polish

### Parallel Opportunities

- `T003` and `T004` can run in parallel after `T001`
- `T006`, `T007`, and `T008` can run in parallel in Phase 2
- After Foundational, `T012` and `T013` can run in parallel for US1
- After Foundational, `T017` and `T018` can run in parallel for US2
- After Foundational, `T021` and `T022` can run in parallel for US3
- In US4, `T025` can run in parallel with `T024`
- `T029` and `T030` can run in parallel during Polish
- `T032` and `T033` can run in parallel because they modify separate implementation concerns; both must complete before `T034`
- `T035` and `T037` can be conducted concurrently by separate facilitators, but their shared evidence file must be updated sequentially

---

## Parallel Example: User Story 1

```text
Task: "T012 [P] [US1] Add homepage metric-card, summary, and last-updated presentation styles in assets/css/styles.css"
Task: "T013 [P] [US1] Implement homepage rendering for latest available quarter, corresponding year, cumulative totals, and reporting-period labels in assets/js/app.js"
```

## Parallel Example: User Story 2

```text
Task: "T017 [P] [US2] Implement history data derivation, year/quarter selection logic, and last-updated rendering in assets/js/app.js"
Task: "T018 [P] [US2] Add history table/chart presentation and responsive interaction styling in assets/css/styles.css and assets/js/charts.js"
```

## Parallel Example: User Story 3

```text
Task: "T021 [P] [US3] Add about/contact layout, external-link, and focus-state styling in assets/css/styles.css"
Task: "T022 [P] [US3] Render EVG Erliweg, elektraeigenstrom, and contact content from data/energy-data.json in assets/js/app.js"
```

## Parallel Example: User Story 1 Amendment

```text
Task: "T032 [P] [US1] Add the semantic GitHub repository anchor and inline icon in index.html"
Task: "T033 [P] [US1] Add repository-link interaction and responsive styles in assets/css/components.css and assets/css/accessibility.css"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify homepage metrics, reporting period labels, dark mode, German text, accessibility baseline, and visible last-updated date
5. Demo/deploy MVP if ready

### Incremental Delivery

1. Complete Setup + Foundational -> foundation ready
2. Add User Story 1 -> validate homepage independently -> deploy/demo MVP
3. Add User Story 2 -> validate history independently -> deploy/demo
4. Add User Story 3 -> validate about/contact independently -> deploy/demo
5. Add User Story 4 -> validate maintainer update flow independently -> deploy/demo
6. Finish with cross-cutting accessibility, performance, and quickstart validation
7. Add the User Story 1 repository action -> validate its contract independently -> deploy/demo
8. Complete T035-T037 -> record participant and viewport evidence -> close measurable validation gates

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Developer D or shared rotation: User Story 4 workflow and deployment hardening
4. Team finishes with shared accessibility/performance polish

---

## Notes

- [P] tasks = different files, no blocking dependency on incomplete sibling tasks
- [Story] labels map each task to a specific user story for traceability
- Each user story is designed to be demonstrable with the existing quickstart scenarios
- CI validation is part of implementation because the maintainer workflow depends on safe publication
- Avoid broad rewrites that break the static-site simplicity constraint
- The current MVP implementation scope is T032-T034; T035-T037 are release-evidence gates for SC-001, SC-003, and SC-004
