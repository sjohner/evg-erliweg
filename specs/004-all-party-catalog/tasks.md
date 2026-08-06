# Tasks: All-Party EVG Catalog and Producer System Details

**Input**: Design documents from `/specs/004-all-party-catalog/`

**Prerequisites**: spec.md, plan.md, research.md, data-model.md

**Tests**: Existing project validation commands: `npm run check:data` and `npm run check:js`, plus manual latest-quarter count derivation review.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Spec and Contract Alignment

- [X] T001 [US1] Create the Feature 004 specification, plan, research, data model, quickstart, tasks, and schema contract under `specs/004-all-party-catalog/`.
- [ ] T002 [P] [US1] Amend Feature 001 artifacts to document catalog-derived total-party and producing-party counts while preserving the HTML content boundary.
- [ ] T003 [P] [US1] Amend Feature 002 artifacts and contracts to replace the obsolete producer-only catalog with the all-party catalog.

## Phase 2: Data Migration

- [ ] T004 [US1] Migrate `data/energy-data.json` from `producingPartiesCatalog` to `partiesCatalog` with the ten specified initial parties and exact membership dates.
- [ ] T005 [US2] Convert producer lifecycle metadata into non-overlapping `producerConfigurations` with producer PV system details and non-producer periods.
- [ ] T006 [US3] Preserve existing producer `partyRecords`, kWh values, timestamps, and derived aggregate behavior without adding non-producer measurement records.

## Phase 3: Runtime and Validation

- [ ] T007 [US2] Extend `assets/js/quarter-utils.js` with membership overlap and producer-configuration resolution helpers.
- [ ] T008 [US4] Update `assets/js/data-loader.js` and `assets/js/app.js` so latest-quarter total-party and producer counts derive from the all-party catalog.
- [ ] T009 [US2] Extend `scripts/check-energy-data.mjs` to validate dates, initial IDs, configuration periods, PV fields, quarterly producer references, and derived count invariants.

## Phase 4: Documentation and Evidence

- [ ] T010 [P] [US1] Update README guidance for maintaining `partiesCatalog`, producer configurations, and dynamic counts.
- [ ] T011 [US4] Replace the interim static total-party HTML value with a runtime placeholder that preserves manually maintained total-people content.
- [ ] T012 [US1] Run `npm run check:data` and `npm run check:js`; record validation evidence in quickstart.

## Dependencies

- Phase 1 must complete before implementation changes.
- T004 blocks T005, T007, T008, and T009.
- T007 blocks T008 and T009.
- T012 runs after all implementation and documentation changes.
