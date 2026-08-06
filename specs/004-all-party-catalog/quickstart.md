# Quickstart: All-Party EVG Catalog and Producer System Details

## Purpose
Validate the all-party catalog migration, producer configuration rules, dynamic counts, and unchanged aggregate totals.

## Setup
1. Open the repository root.
2. Confirm `data/energy-data.json` contains `reportingStartDate`, `partiesCatalog`, and `quarterlyRecords`.
3. Confirm `index.html` contains German public content but no party identity, membership, producer, PV, or battery details.
4. Run `npm run check:data`.
5. Run `npm run check:js`.

## Validation Scenarios

### Scenario 1: Initial catalog completeness
1. Inspect `partiesCatalog`.
2. Confirm these IDs exist exactly once: `erliweg11`, `erliweg13`, `erliweg25`, `erliweg27`, `erliweg29`, `erliweg31`, `erliweg33`, `erliweg35`, `erliweg37`, `erliweg39`.
3. Confirm each has `joinedOn: 2025-10-01`.

Expected outcome: `npm run check:data` passes the initial party invariant.

### Scenario 2: Producer configuration validation
1. Inspect each party's `producerConfigurations`.
2. Confirm non-producer entries have no `pvSystem`.
3. Confirm producer entries have positive `peakPowerKwp`, valid orientation, and boolean `hasBattery`.

Expected outcome: every active party resolves to exactly one configuration per existing quarter.

### Scenario 3: Historical measurement preservation
1. Confirm `erliweg27` and `erliweg37` remain in every existing `partyRecords` set with unchanged values.
2. Confirm no non-producer party has a quarterly measurement record.

Expected outcome: Quarter, year, and cumulative totals remain unchanged from the pre-migration producer records.

### Scenario 4: Latest-quarter dynamic counts
1. Identify the latest `quarterlyRecords` entry.
2. Count catalog parties whose membership overlaps that quarter.
3. Count catalog parties whose membership overlaps that quarter and whose resolved configuration is `isProducer: true`.
4. Load the homepage or inspect `getCommunitySummary(data)`.

Expected outcome: `Parteien gesamt` and `Produzierende Parteien` match the catalog-derived counts.

## Completion Evidence

- `npm run check:data`: passed on 2026-08-06 (`Energy data validation passed.`)
- `npm run check:js`: passed on 2026-08-06
- Latest-quarter total-party count: `10` for `2026-Q2`, derived from active `partiesCatalog` memberships
- Latest-quarter producer count: `2` for `2026-Q2`, derived from active producer configurations
- Runtime totals check for `2026-Q2`: produced `9000` kWh, consumed `3604` kWh; cumulative produced `15388.9` kWh, consumed `8414` kWh
