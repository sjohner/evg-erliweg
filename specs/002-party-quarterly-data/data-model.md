# Data Model: Party-Level Quarterly Data Updates

## Amendment: Lifecycle and Ownership (2026-08-06)

`data/energy-data.json` contains `reportingStartDate`, `producingPartiesCatalog`, and `quarterlyRecords`. Each catalog entry requires `partyId`, `partyLabel`, and `activeFromQuarterId`; `inactiveAfterQuarterId` is optional and inclusive. `isActive` is removed because it conflicts with lifecycle boundaries.

## Amendment: All-Party Catalog Contract (2026-08-06)

Feature 004 supersedes the producer-only catalog above. The current `data/energy-data.json` contract contains `reportingStartDate`, `partiesCatalog`, and producer-only `quarterlyRecords`. `partiesCatalog` is authoritative for party identity, exact membership dates (`joinedOn`, optional `leftOn`), and effective producer configuration history.

## 1. ReportingStartDate
- Purpose: Provides the canonical cumulative baseline date for runtime calculations.
- Fields:
  - `reportingStartDate` (date string, required): Lower bound for cumulative totals, e.g. `2025-10-01`.

## 2. Party
- Purpose: Identifies one EVG household or metering participant consistently across reporting periods.
- Fields:
  - `partyId` (string, required): Stable identifier (e.g., `p1`, `haus-a`).
  - `partyLabel` (string, required): Human-readable party name for maintainers.
  - `joinedOn` (date string, required): Exact community join date.
  - `leftOn` (date string, optional): Exact final membership date, inclusive.
  - `producerConfigurations` (array, required): Non-overlapping producer status periods.

## 2a. ProducerConfiguration
- Purpose: Defines producer status and PV details for an effective quarter range.
- Fields:
  - `isProducer` (boolean, required).
  - `activeFromQuarterId` (string, required): First quarter where configuration applies.
  - `inactiveAfterQuarterId` (string, optional): Last quarter where configuration applies, inclusive.
  - `pvSystem` (object, required only when `isProducer` is `true`): `peakPowerKwp` (> 0), `orientation` (`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`, `FLAT`), and `hasBattery` (boolean). Must be absent when `isProducer` is `false`.

## 3. PartyQuarterRecord
- Purpose: Stores produced and consumed values for one producing party in one
  quarter.
- Fields:
  - `partyId` (string, required): Reference to `Party.partyId`.
  - `producedKwh` (number, required, >= 0).
  - `consumedKwh` (number, required, >= 0).
  - `updatedAt` (datetime string, required): Last update timestamp for this
    party-level record.

## 4. EnergyQuarterRecord
- Purpose: Quarter-level container for party-level entries and period metadata.
- Fields:
  - `id` (string, required): Quarter key `YYYY-QN`.
  - `year` (integer, required).
  - `quarter` (integer, required, 1..4).
  - `startDate` (date string, required).
  - `endDate` (date string, required).
  - `partyRecords` (array<PartyQuarterRecord>, required).

## 5. QuarterAggregate (Runtime Projection)
- Persistence: Not stored in source JSON.
- Purpose: Dynamic total for one quarter.
- Fields:
  - `id` (string, required).
  - `producedKwh` (number, required): Sum of `partyRecords[].producedKwh`.
  - `consumedKwh` (number, required): Sum of `partyRecords[].consumedKwh`.

## 6. YearAggregate (Runtime Projection)
- Persistence: Not stored in source JSON.
- Purpose: Dynamic total for one year.
- Fields:
  - `year` (integer, required).
  - `producedKwh` (number, required): Sum of quarter produced totals in year.
  - `consumedKwh` (number, required): Sum of quarter consumed totals in year.

## 7. RepositoryDataUpdate
- Purpose: Captures one fix-forward or routine maintainer update to party-level
  values.
- Fields:
  - `updatedBy` (string, optional): Maintainer identifier from git metadata.
  - `updatedAt` (datetime string, required): Update timestamp.
  - `changedQuarterIds` (array<string>, required): Quarters affected by change.

## Relationships
- `EnergyQuarterRecord.partyRecords[].partyId` references `Party.partyId`.
- Quarter party labels are resolved from `ProducingParty.partyLabel` using
  `partyId` as the single source of truth.
- `QuarterAggregate` derives from one `EnergyQuarterRecord`.
- `YearAggregate` derives from all quarter records with matching `year`.
- UI last-updated values derive from max `updatedAt` across all
  `partyRecords` entries.
- Membership and producer-configuration updates affect only intended effective
  periods and do not mutate historical `PartyQuarterRecord` values.

## Validation Rules
- `reportingStartDate` MUST be a valid date string in YYYY-MM-DD format.
- `partyId` MUST be unique within `partiesCatalog`.
- Initial parties `erliweg11`, `erliweg13`, `erliweg25`, `erliweg27`,
  `erliweg29`, `erliweg31`, `erliweg33`, `erliweg35`, `erliweg37`, and
  `erliweg39` MUST exist with `joinedOn: 2025-10-01`.
- `leftOn`, when present, MUST be on or after `joinedOn`.
- Producer configuration periods MUST NOT overlap and MUST resolve exactly one
  configuration for every active party and existing quarter.
- Producer configurations MUST include valid PV system details; non-producer
  configurations MUST NOT include PV fields.
- Quarterly `partyRecords` MUST reference parties whose membership overlaps the
  quarter and whose resolved configuration is `isProducer: true`.
- `partyId` MUST be unique within each quarter record.
- `producedKwh` and `consumedKwh` MUST be non-negative finite numbers.
- Quarter date ranges MUST be valid and non-overlapping by quarter identity.
- `partyRecords[].updatedAt` MUST be valid ISO datetime values.
- Removing a party MUST NOT delete previously recorded `PartyQuarterRecord`
  entries for past quarters.

## State Transitions

### PartyDataUpdate lifecycle
1. `Draft` -> Maintainer edits party-level quarter data in `data/energy-data.json`.
2. `LifecycleUpdated` -> Maintainer may add a new party for future quarters or
  mark an existing party inactive for future quarters while retaining history.
3. `Published` -> Maintainer pushes to `main` and workflow deploys site.
4. `Corrected` -> If needed, maintainer applies fix-forward update and republishes.
