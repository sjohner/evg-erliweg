# Tasks: GitHub-Inspired Design Modernization

Input: Design documents from specs/003-github-design-modernization/
Prerequisites: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

Tests: Validation tasks are included because the specification explicitly requires accessibility and performance verification.

Organization: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Project Initialization)

Purpose: Create and wire the modular CSS structure defined in the implementation plan.

- [X] T001 Create stylesheet modules assets/css/variables.css, assets/css/components.css, assets/css/layout.css, assets/css/accessibility.css, and assets/css/performance.css
- [X] T002 Update assets/css/styles.css to import the modular stylesheets in order: variables, layout, components, accessibility, performance
- [X] T003 Update index.html, about.html, and history.html to keep a single stylesheet entry point pointing to assets/css/styles.css

---

## Phase 2: Foundational (Blocking Prerequisites)

Purpose: Establish shared design tokens, global typography, core layout rules, and baseline accessibility/performance behavior required by all stories.

Critical: No user story work should start until this phase is complete.

- [X] T004 [P] Define color, spacing, radius, and typography tokens in assets/css/variables.css based on specs/003-github-design-modernization/contracts/color-contract.md and specs/003-github-design-modernization/data-model.md
- [X] T005 [P] Implement mobile-first breakpoints and shared container/grid primitives in assets/css/layout.css for 375px, 768px, and 1024px+
- [X] T006 [P] Implement base focus, skip-link, and keyboard-visible states in assets/css/accessibility.css for links, buttons, form controls, and interactive cards
- [X] T007 [P] Implement reduced-motion and lightweight transition defaults in assets/css/performance.css with prefers-reduced-motion handling
- [X] T008 Set global reset/base styles in assets/css/styles.css for body background, text defaults, heading scale, line-height, and link defaults
- [X] T009 Add shared surface, border, and section spacing primitives in assets/css/components.css to support card-based composition across all pages
- [X] T010 Validate foundational conformance against specs/003-github-design-modernization/contracts/design-system.md and record open gaps in specs/003-github-design-modernization/tasks.md

Checkpoint: Foundation ready. User story implementation can begin.

Validation note (2026-07-22): No open foundational contract gaps detected in static review of tokens, layout primitives, accessibility baseline, and reduced-motion handling.

---

## Phase 3: User Story 1 - Browse Updated Homepage with Modern Navigation (Priority: P1) MVP

Goal: Deliver a modern homepage with clear hierarchy and sticky navigation.

Independent Test: From index.html, a user can identify purpose within 5 seconds, navigate with a sticky header, and use keyboard focus states across hero actions and nav links.

- [X] T011 [P] [US1] Update hero information hierarchy and CTA grouping in index.html with semantic heading flow and clear links to history.html and about.html
- [X] T012 [P] [US1] Implement homepage hero layout styles in assets/css/components.css including spacing, copy width, and supporting panel alignment
- [X] T013 [P] [US1] Implement sticky navigation container behavior in assets/css/components.css for .site-header and .site-nav with non-obscuring spacing
- [X] T014 [P] [US1] Implement nav link hover, active, and focus-visible styling in assets/css/components.css and assets/css/accessibility.css
- [X] T015 [US1] Implement primary and secondary CTA button styles in assets/css/components.css aligned with GitHub-inspired blue accents and subtle interactions
- [X] T016 [US1] Ensure header, hero, and CTA behavior remains responsive in index.html and assets/css/layout.css at mobile/tablet/desktop breakpoints
- [X] T017 [US1] Run homepage acceptance checks from specs/003-github-design-modernization/spec.md against index.html and capture pass/fail notes in specs/003-github-design-modernization/quickstart.md

Checkpoint: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - View Data Visualizations with Refined Styling (Priority: P1)

Goal: Present energy data blocks and chart areas in refined, readable card surfaces with subtle hierarchy.

Independent Test: Data sections on index.html and history.html render as rounded, bordered cards with readable type, spacing, and subtle interactive feedback.

- [X] T018 [P] [US2] Standardize metric card styling for index.html sections in assets/css/components.css using rounded corners, subtle borders, and whitespace hierarchy
- [X] T019 [P] [US2] Standardize historical chart card styling for history.html in assets/css/components.css with consistent surface, border, and heading treatment
- [X] T020 [P] [US2] Implement card hover and focus behavior in assets/css/components.css and assets/css/accessibility.css with subtle border/shadow change only
- [X] T021 [P] [US2] Refine metric and legend typography scale in assets/css/styles.css and assets/css/components.css for labels, values, and helper text readability
- [X] T022 [US2] Ensure data sections reflow correctly at breakpoints in assets/css/layout.css with no horizontal overflow on 375px
- [X] T023 [US2] Add lazy-loading and intrinsic sizing attributes where applicable in index.html and history.html for visualization-related media
- [X] T024 [US2] Run data-view acceptance checks from specs/003-github-design-modernization/spec.md against index.html and history.html and log results in specs/003-github-design-modernization/quickstart.md

Checkpoint: US2 is independently functional and testable.

---

## Phase 5: User Story 3 - Navigate Multi-Page Site with Consistent Styling (Priority: P1)

Goal: Apply one consistent visual and interaction system across index.html, about.html, and history.html.

Independent Test: Navigating between all pages preserves shared header/nav/footer styling, typography scale, component behavior, and accent usage.

- [X] T025 [P] [US3] Align shared header and navigation markup consistency across index.html, about.html, and history.html including aria-current and link ordering
- [X] T026 [P] [US3] Align shared footer and end-of-page spacing treatment across index.html, about.html, and history.html in assets/css/components.css
- [X] T027 [P] [US3] Normalize section heading, paragraph, list, and metadata typography across about.html and history.html using assets/css/styles.css
- [X] T028 [P] [US3] Normalize card variants used in about.html and history.html to match metric/history cards in assets/css/components.css
- [X] T029 [US3] Ensure all interactive elements across the three pages share identical focus-visible behavior via assets/css/accessibility.css
- [X] T030 [US3] Run cross-page consistency checks from specs/003-github-design-modernization/spec.md and record outcomes in specs/003-github-design-modernization/quickstart.md

Checkpoint: US3 is independently functional and testable.

---

## Phase 6: User Story 4 - Experience Responsive Design Across Devices (Priority: P2)

Goal: Guarantee polished responsive behavior for mobile, tablet, and desktop.

Independent Test: At 375px, 768px, and 1024px+, all pages render without horizontal scroll, retain readable typography, and keep touch-safe interactive targets.

- [X] T031 [P] [US4] Verify and tune hero, navigation, and metric layouts on index.html at all required breakpoints in assets/css/layout.css
- [X] T032 [P] [US4] Verify and tune form controls, chart area, and history cards on history.html at all required breakpoints in assets/css/layout.css
- [X] T033 [P] [US4] Verify and tune info-card and long-text layouts on about.html at all required breakpoints in assets/css/layout.css
- [X] T034 [US4] Enforce minimum 44px touch targets for relevant controls in assets/css/components.css and assets/css/accessibility.css
- [X] T035 [US4] Execute responsive acceptance checks from specs/003-github-design-modernization/quickstart.md and document final pass/fail notes in specs/003-github-design-modernization/quickstart.md

Checkpoint: US4 is independently functional and testable.

---

## Phase 7: User Story 5 - Build Confidence Through Enterprise-Ready Visual Presentation (Priority: P2)

Goal: Finalize visual polish so the site feels technical, trustworthy, minimal, and enterprise-ready.

Independent Test: Design review confirms no excessive motion/visual effects, consistent spacing and hierarchy, and contract-aligned presentation quality.

- [X] T036 [P] [US5] Audit and remove any non-compliant visual effects in assets/css/styles.css and assets/css/components.css (no heavy gradients, glassmorphism, or excessive animation)
- [X] T037 [P] [US5] Validate contrast usage against specs/003-github-design-modernization/contracts/color-contract.md and adjust tokens/usages in assets/css/variables.css
- [X] T038 [P] [US5] Run keyboard and semantic structure checks for index.html, about.html, and history.html and fix issues in markup and assets/css/accessibility.css
- [X] T039 [US5] Run performance-focused CSS cleanup in assets/css/performance.css and assets/css/styles.css to minimize blocking and unnecessary rules
- [X] T040 [US5] Execute enterprise-presentation acceptance checks from specs/003-github-design-modernization/spec.md and append findings to specs/003-github-design-modernization/quickstart.md

Checkpoint: US5 is independently functional and testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

Purpose: Complete end-to-end validation and release readiness checks.

- [ ] T041 [P] Run full quickstart validation flow from specs/003-github-design-modernization/quickstart.md across index.html, about.html, and history.html
- [ ] T042 [P] Validate implementation coverage against specs/003-github-design-modernization/contracts/design-system.md and specs/003-github-design-modernization/contracts/color-contract.md
- [ ] T043 [P] Perform final browser QA sweep and note issues in specs/003-github-design-modernization/quickstart.md for Chrome, Firefox, Safari, and Edge
- [ ] T044 Produce final readiness summary and unresolved-risk list in specs/003-github-design-modernization/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): no dependencies.
- Phase 2 (Foundational): depends on Phase 1 completion and blocks all user stories.
- Phases 3-7 (User Stories): depend on Phase 2 completion.
- Phase 8 (Polish): depends on completion of all target user stories.

### User Story Dependencies

- US1: can start immediately after foundational completion.
- US2: can start immediately after foundational completion.
- US3: can start immediately after foundational completion.
- US4: can start after foundational completion; recommended after US1-US3 for realistic layout verification.
- US5: can start after foundational completion; recommended after US1-US4 for final polish validation.

### Within Each User Story

- Apply structural markup updates before style refinement.
- Apply style refinement before acceptance checks.
- Complete independent test criteria before moving to next priority.

---

## Parallel Execution Examples Per Story

### US1

Task T012, Task T013, and Task T014 can run in parallel.

### US2

Task T018, Task T019, and Task T021 can run in parallel.

### US3

Task T025, Task T027, and Task T028 can run in parallel.

### US4

Task T031, Task T032, and Task T033 can run in parallel.

### US5

Task T036, Task T037, and Task T038 can run in parallel.

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational work.
3. Implement US1, US2, and US3.
4. Validate each story independently using its acceptance checks.
5. Deliver MVP after US1-US3 pass.

### Incremental Delivery

1. Ship foundation.
2. Ship US1.
3. Ship US2.
4. Ship US3.
5. Ship US4.
6. Ship US5.
7. Run cross-cutting Phase 8 and finalize.

### Format Validation

All executable tasks in this file follow the required checklist format with checkbox, sequential task ID, optional [P], optional [USn], and an explicit file path in the description.


