# Tasks: Party-Level Quarterly Data Updates

**Input**: Design documents from `/specs/002-party-quarterly-data/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No separate automated test suite was explicitly requested in the specification. This task list therefore uses JavaScript syntax checks, the maintainer data validation script, CI validation-gate checks, and quickstart manual scenarios as the primary verification path.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency on incomplete sibling tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Static site pages live at repository root: `index.html`, `history.html`, `about.html`
- Shared browser logic lives under `assets/js/`
- Canonical source data lives in `data/energy-data.json`
- Maintainer validation tooling lives in `scripts/` and `package.json`
- Feature contracts and validation guidance live under `specs/002-party-quarterly-data/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare repository tooling and maintainer workflow entries for party-level data updates

- [X] T001 Create the party-level data validation script scaffold in `scripts/check-energy-data.mjs`
- [X] T002 [P] Add a reusable maintainer validation command for `scripts/check-energy-data.mjs` in `package.json`
- [X] T003 [P] Update the quarterly update workflow overview and tooling prerequisites in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data-contract and aggregation infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Update the canonical schema for producing-party catalog entries, quarter `partyRecords`, and lifecycle fields in `specs/002-party-quarterly-data/contracts/energy-data.schema.json`
- [X] T005 [P] Implement shared JSON validation for duplicate `partyId` values, negative kWh values, invalid timestamps, and lifecycle window mismatches in `scripts/check-energy-data.mjs`
- [X] T006 [P] Refactor aggregation helpers to derive quarter, year, cumulative, and last-updated values from nested `partyRecords` in `assets/js/data-loader.js`
- [X] T007 Implement explicit FR-013 pipeline gating by creating separate `validate-data` and `deploy` jobs with `needs` dependency in `.github/workflows/deploy-pages.yml`
- [X] T008 Update maintainer publication guarantees and pre-push validation steps in `specs/002-party-quarterly-data/contracts/publishing-contract.md` and `README.md`

**Checkpoint**: Schema, validation, derived-total infrastructure, and CI deployment gate are ready for story implementation

---

## Phase 3: User Story 1 - Record Party Quarterly Values (Priority: P1) 🎯 MVP

**Goal**: Let maintainers store produced and consumed energy per producing party for each quarter with a stable party catalog and preserved history

**Independent Test**: Edit one quarter in `data/energy-data.json`, add or update one party entry, run the maintainer validation command, and confirm each producing party remains uniquely identifiable with produced and consumed values saved for that quarter.

### Implementation for User Story 1

- [X] T009 [US1] Migrate the canonical dataset to a global producing-party catalog plus per-quarter `partyRecords` entries in `data/energy-data.json`
- [X] T010 [P] [US1] Add helper accessors for party catalog lookup, active-party filtering, and quarter-to-party record normalization in `assets/js/data-loader.js`
- [X] T011 [P] [US1] Document party-level quarter editing, fix-forward correction, and add/remove lifecycle steps in `README.md`
- [X] T012 [US1] Update the maintainer validation walkthrough for party-level record entry in `specs/002-party-quarterly-data/quickstart.md`

**Checkpoint**: User Story 1 is complete when party-level quarter data can be entered, updated, and preserved independently of aggregate rendering changes

---

## Phase 4: User Story 2 - Preserve Dynamic Quarter and Year Totals (Priority: P1)

**Goal**: Keep public quarter and year totals fully derived from party-level records without manual summary fields

**Independent Test**: Change one party value in `data/energy-data.json`, reload `index.html` and `history.html`, and verify the affected quarter total and year total match the sum of the updated party-level data.

### Implementation for User Story 2

- [X] T013 [US2] Replace direct quarter summary usage with party-derived totals and derived last-updated logic in `assets/js/data-loader.js`
- [X] T014 [P] [US2] Update homepage metric rendering and reporting-period messaging to use derived party totals in `assets/js/app.js` and `index.html`
- [X] T015 [P] [US2] Update historical quarter/year selection, comparison series, and empty-state behavior to use derived party totals in `assets/js/app.js`, `assets/js/charts.js`, and `history.html`
- [X] T016 [US2] Remove obsolete manual-total assumptions from the canonical dataset and maintainer guidance in `data/energy-data.json` and `README.md`

**Checkpoint**: User Story 2 is complete when public quarter and year totals stay correct after party-level edits and no manual aggregate fields are required

---

## Phase 5: User Story 3 - Handle Incomplete or Invalid Party Data Safely (Priority: P2)

**Goal**: Detect invalid party-level maintenance data predictably while allowing incomplete quarter data to publish with correct partial totals

**Independent Test**: Introduce a negative value, a duplicate `partyId`, and a missing party entry in local data, then confirm the validation command flags the invalid cases while the runtime aggregation still sums only available valid records.

### Implementation for User Story 3

- [X] T017 [US3] Extend `scripts/check-energy-data.mjs` to report negative values, duplicate quarter party entries, orphaned `partyId` references, and invalid lifecycle transitions in `data/energy-data.json`
- [X] T018 [P] [US3] Make runtime aggregation resilient to missing party entries while preserving correct totals and last-updated output in `assets/js/data-loader.js`
- [X] T019 [P] [US3] Update maintainer troubleshooting and fix-forward guidance for invalid or incomplete party data in `README.md` and `specs/002-party-quarterly-data/contracts/publishing-contract.md`
- [X] T020 [US3] Add quickstart validation steps for duplicate IDs, negative values, missing party data, add/remove lifecycle checks, and CI-blocked publish verification in `specs/002-party-quarterly-data/quickstart.md`

**Checkpoint**: User Story 3 is complete when maintainers have a repeatable validation flow and missing party records do not corrupt published totals

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements across data, docs, and validation flow

- [X] T021 [P] Review German public copy and empty-state messaging affected by derived party totals in `index.html`, `history.html`, and `assets/js/app.js`
- [ ] T022 [P] Run JavaScript syntax validation, `npm run check:data`, and CI validation-gate sanity checks, then record evidence in `specs/002-party-quarterly-data/quickstart.md`: one failed workflow run URL/log excerpt caused by intentionally invalid test data and one subsequent passed workflow run URL/log excerpt after fix-forward correction
- [X] T023 Update the final maintainer checklist and example update flow for party lifecycle changes in `README.md` and `specs/002-party-quarterly-data/quickstart.md`
- [X] T024 [P] Align CI-gate rationale wording across planning artifacts in `specs/002-party-quarterly-data/plan.md`, `specs/002-party-quarterly-data/research.md`, and `specs/002-party-quarterly-data/contracts/publishing-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and uses the migrated party-level data shape from User Story 1 for end-to-end verification
- **User Story 3 (Phase 5)**: Depends on Foundational completion and is strongest after User Story 1 data migration exists
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately after Foundational - primary MVP slice
- **User Story 2 (P1)**: Can begin after Foundational, but final verification depends on the canonical party-level dataset from User Story 1
- **User Story 3 (P2)**: Can begin after Foundational, with best validation after User Stories 1 and 2 are in place

### Within Each User Story

- Data contract and validation rules before broad data migration
- Data migration before public-page verification
- Runtime derivation helpers before page rendering updates
- Documentation and quickstart updates before final validation sign-off

### Parallel Opportunities

- `T002` and `T003` can run in parallel after `T001`
- `T005` and `T006` can run in parallel after `T004`
- In User Story 1, `T010` and `T011` can run in parallel after `T009`
- In User Story 2, `T014` and `T015` can run in parallel after `T013`
- In User Story 3, `T018` and `T019` can run in parallel after `T017`
- `T021` and `T022` can run in parallel during Polish
- `T023` and `T024` can run in parallel during Polish

---

## Parallel Example: User Story 1

```text
Task: "T010 [P] [US1] Add helper accessors for party catalog lookup, active-party filtering, and quarter-to-party record normalization in assets/js/data-loader.js"
Task: "T011 [P] [US1] Document party-level quarter editing, fix-forward correction, and add/remove lifecycle steps in README.md"
```

## Parallel Example: User Story 2

```text
Task: "T014 [P] [US2] Update homepage metric rendering and reporting-period messaging to use derived party totals in assets/js/app.js and index.html"
Task: "T015 [P] [US2] Update historical quarter/year selection, comparison series, and empty-state behavior to use derived party totals in assets/js/app.js, assets/js/charts.js, and history.html"
```

## Parallel Example: User Story 3

```text
Task: "T018 [P] [US3] Make runtime aggregation resilient to missing party entries while preserving correct totals and last-updated output in assets/js/data-loader.js"
Task: "T019 [P] [US3] Update maintainer troubleshooting and fix-forward guidance for invalid or incomplete party data in README.md and specs/002-party-quarterly-data/contracts/publishing-contract.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run the maintainer validation command and confirm one quarter can carry multiple producing-party records with preserved history
5. Proceed to public aggregate rendering only after the party-level dataset is stable

### Incremental Delivery

1. Complete Setup + Foundational -> validation and derived-total infrastructure ready
2. Add User Story 1 -> validate party-level data entry independently -> commit/demo MVP
3. Add User Story 2 -> validate public quarter/year totals independently -> commit/demo
4. Add User Story 3 -> validate invalid-data handling independently -> commit/demo
5. Finish with cross-cutting copy, quickstart, and validation cleanup

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 data migration and maintainer docs
   - Developer B: User Story 2 public aggregation and page rendering
   - Developer C: User Story 3 validation and troubleshooting flow
3. Team finishes with shared polish and quickstart validation

---

## Notes

- [P] tasks target different files or independent documentation/code surfaces
- Story labels preserve traceability from `spec.md` to implementation work
- The MVP scope is User Story 1 because it establishes the canonical party-level source data required by the remaining stories
- Validation must stay aligned with the constitution requirement for independently testable user stories
- FR-013 is explicitly covered by `T007` and `T020` through workflow-job gating and blocked-deployment validation steps