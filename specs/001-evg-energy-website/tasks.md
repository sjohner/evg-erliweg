# Tasks: EVG Erliweg Energy Transparency Website

**Input**: Design documents from `/specs/001-evg-energy-website/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No separate automated test suite was explicitly requested in the specification. This task list therefore prioritizes implementation and quickstart-based accessibility/performance/manual-review verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Static site pages live at repository root: `index.html`, `history.html`, `about.html`
- Shared assets live under `assets/`
- Canonical source data lives under `data/`
- Deployment automation lives under `.github/workflows/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the base static-site structure and minimal project tooling

- [X] T001 Create static site scaffold files `index.html`, `history.html`, `about.html`, `assets/css/styles.css`, `assets/js/app.js`, `assets/js/data-loader.js`, `assets/js/charts.js`, and `data/energy-data.json`
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

**Goal**: Deliver a German homepage that clearly shows current quarter, current year, cumulative totals since 2025-10-01, reporting periods, and last-updated date

**Independent Test**: Open `index.html` via local preview and verify current quarter, current year, cumulative values, reporting-period labels, and last-updated date render correctly in German on desktop and mobile.

### Implementation for User Story 1

- [X] T011 [US1] Build semantic German homepage structure and metric placeholders in `index.html`
- [X] T012 [P] [US1] Add homepage metric-card, summary, and last-updated presentation styles in `assets/css/styles.css`
- [X] T013 [P] [US1] Implement homepage rendering for current quarter, current year, cumulative totals, and reporting-period labels in `assets/js/app.js`
- [X] T014 [US1] Connect homepage rendering to quarterly source data and derived summary helpers in `assets/js/data-loader.js` and `index.html`
- [X] T015 [US1] Tune homepage accessibility and PageSpeed-critical markup/asset loading in `index.html`, `assets/css/styles.css`, and `assets/js/app.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Historical Quarters and Years (Priority: P2)

**Goal**: Deliver a history view for quarter/year exploration with clear no-data handling and visible last-updated context

**Independent Test**: Open `history.html`, switch between available quarters and years, and confirm correct values, reporting periods, no-data handling, and last-updated date are shown in German.

### Implementation for User Story 2

- [X] T016 [US2] Build German history page structure with period selectors, results regions, and empty-state messaging in `history.html`
- [X] T017 [P] [US2] Implement history data derivation, year/quarter selection logic, and last-updated rendering in `assets/js/app.js`
- [X] T018 [P] [US2] Add history table/chart presentation and responsive interaction styling in `assets/css/styles.css` and `assets/js/charts.js`
- [X] T019 [US2] Wire history page to canonical quarterly data and derived summaries in `assets/js/data-loader.js` and `history.html`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - About and Learn More (Priority: P3)

**Goal**: Deliver a German about/contact page with EVG Erliweg context, elektraeigenstrom explanation, official external link, and clear contact details

**Independent Test**: Open `about.html` and verify German static content, external link destination, accessible link labeling, and visible contact details.

### Implementation for User Story 3

- [X] T020 [US3] Create German about/contact page content structure and semantic sections in `about.html`
- [X] T021 [P] [US3] Add about/contact layout, external-link, and focus-state styling in `assets/css/styles.css`
- [X] T022 [P] [US3] Render EVG Erliweg, elektraeigenstrom, and contact content from `data/energy-data.json` in `assets/js/app.js`
- [X] T023 [US3] Ensure about/contact semantics, external-link text, and language metadata satisfy WCAG expectations in `about.html` and `assets/js/app.js`

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all be independently functional

---

## Phase 6: User Story 4 - Quarterly Data Update via Repository File (Priority: P4)

**Goal**: Enable maintainers to update quarterly figures through the private repository and publish them through a simple manual-review + deployment flow

**Independent Test**: Edit one quarterly record in `data/energy-data.json`, manually review the change, publish through the workflow, and verify updated values and last-updated date appear on public pages.

### Implementation for User Story 4

- [X] T024 [US4] Seed realistic quarterly records plus about/contact source content in `data/energy-data.json`
- [X] T025 [P] [US4] Add maintainer instructions for quarterly edits, manual review, and deploy steps in `README.md`
- [X] T026 [US4] Implement the simple reviewed publish flow in `.github/workflows/deploy-pages.yml` and `README.md`
- [X] T027 [US4] Ensure homepage and history pages derive displayed last-updated date from the latest `updatedAt` value in `assets/js/data-loader.js`, `assets/js/app.js`, `index.html`, and `history.html`
- [X] T028 [US4] Finalize default GitHub Pages publishing behavior in `.github/workflows/deploy-pages.yml` and `README.md`

**Checkpoint**: All user stories should now be independently usable, and the maintainer workflow should safely publish data updates

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T029 [P] Add final metadata, browser theming, and page-level SEO polish in `index.html`, `history.html`, and `about.html`
- [ ] T030 [P] Run cross-page accessibility and performance refinements in `assets/css/styles.css`, `assets/js/app.js`, and `assets/js/charts.js`
- [ ] T031 Run end-to-end quickstart validation and update the completion checklist in `specs/001-evg-energy-website/quickstart.md`

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

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - primary MVP slice
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - shares aggregation and rendering helpers with US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - largely independent of US1/US2 beyond shared layout and language conventions
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - publish-flow proof is strongest once US1/US2 displays exist

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

---

## Parallel Example: User Story 1

```text
Task: "T012 [P] [US1] Add homepage metric-card, summary, and last-updated presentation styles in assets/css/styles.css"
Task: "T013 [P] [US1] Implement homepage rendering for current quarter, current year, cumulative totals, and reporting-period labels in assets/js/app.js"
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
