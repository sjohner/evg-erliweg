# Research: All-Party EVG Catalog and Producer System Details

## Decision 1: Replace producer-only catalog with `partiesCatalog`
- Decision: Use one top-level `partiesCatalog` in `data/energy-data.json` for all parties.
- Rationale: Avoids two authoritative identity sources and satisfies future producer/consumer features.
- Alternatives considered:
  - Keep `producingPartiesCatalog` and add a consumer catalog: rejected because it duplicates identity and membership.
  - Store party data in HTML: rejected by the Feature 001 content boundary.

## Decision 2: Exact membership dates plus quarter-effective producer configs
- Decision: Store `joinedOn`/`leftOn` as ISO dates and `producerConfigurations` as quarter ranges.
- Rationale: Membership can start or end mid-quarter while producer status changes by reporting quarter.
- Alternatives considered:
  - Quarter-only membership: rejected because the issue requires exact dates.
  - Timeless `isProducer`: rejected because it rewrites history on status changes.

## Decision 3: Active membership overlaps at least one day of a quarter
- Decision: A party is active when `joinedOn <= quarter.endDate` and `leftOn` is absent or `leftOn >= quarter.startDate`.
- Rationale: This explicitly handles mid-quarter joins/departures and matches the issue recommendation.
- Alternatives considered:
  - Active only on quarter start: rejected because mid-quarter joins would be excluded.
  - Active only for entire quarter: rejected because mid-quarter departures would erase real membership.

## Decision 4: Producer counts derive from configuration, not records
- Decision: Latest-quarter producer counts count active members whose resolved configuration has `isProducer: true`.
- Rationale: Missing measurement records must not reduce producer count.
- Alternatives considered:
  - Count quarter `partyRecords`: rejected due to temporary missing-record scenario.

## Decision 5: Validation script remains the schema authority
- Decision: Extend `scripts/check-energy-data.mjs` with semantic validation beyond JSON Schema expressiveness.
- Rationale: Existing project uses this script for CI/local checks; custom overlap and count checks need code.
- Alternatives considered:
  - Add a JSON Schema validator dependency: rejected as unnecessary for the small static project.
