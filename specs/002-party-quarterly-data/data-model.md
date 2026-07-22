# Data Model: Party-Level Quarterly Data Updates

## 1. ProducingParty
- Purpose: Identifies a producing party consistently across reporting periods.
- Fields:
  - `partyId` (string, required): Stable identifier (e.g., `p1`, `haus-a`).
  - `partyLabel` (string, required): Human-readable party name for maintainers.
  - `isActive` (boolean, optional, default `true`): Whether the party is active
    for new quarter entries.
  - `activeFromQuarterId` (string, optional): First quarter where party can
    appear (e.g., `2026-Q1`).
  - `inactiveAfterQuarterId` (string, optional): Last quarter where party may
    appear; when set, party is considered removed for future quarters while
    historical records remain preserved.

## 2. PartyQuarterRecord
- Purpose: Stores produced and consumed values for one producing party in one
  quarter.
- Fields:
  - `partyId` (string, required): Reference to `ProducingParty.partyId`.
  - `partyLabel` (string, required): Current display label for maintenance
    readability.
  - `producedKwh` (number, required, >= 0).
  - `consumedKwh` (number, required, >= 0).
  - `updatedAt` (datetime string, required): Last update timestamp for this
    party-level record.

## 3. EnergyQuarterRecord
- Purpose: Quarter-level container for party-level entries and period metadata.
- Fields:
  - `id` (string, required): Quarter key `YYYY-QN`.
  - `year` (integer, required).
  - `quarter` (integer, required, 1..4).
  - `startDate` (date string, required).
  - `endDate` (date string, required).
  - `partyRecords` (array<PartyQuarterRecord>, required).
  - `updatedAt` (datetime string, required): Max timestamp for the quarter
    record for compatibility with existing UI last-updated logic.

## 4. QuarterAggregate (Runtime Projection)
- Persistence: Not stored in source JSON.
- Purpose: Dynamic total for one quarter.
- Fields:
  - `id` (string, required).
  - `producedKwh` (number, required): Sum of `partyRecords[].producedKwh`.
  - `consumedKwh` (number, required): Sum of `partyRecords[].consumedKwh`.

## 5. YearAggregate (Runtime Projection)
- Persistence: Not stored in source JSON.
- Purpose: Dynamic total for one year.
- Fields:
  - `year` (integer, required).
  - `producedKwh` (number, required): Sum of quarter produced totals in year.
  - `consumedKwh` (number, required): Sum of quarter consumed totals in year.

## 6. RepositoryDataUpdate
- Purpose: Captures one fix-forward or routine maintainer update to party-level
  values.
- Fields:
  - `updatedBy` (string, optional): Maintainer identifier from git metadata.
  - `updatedAt` (datetime string, required): Update timestamp.
  - `changedQuarterIds` (array<string>, required): Quarters affected by change.

## Relationships
- `EnergyQuarterRecord.partyRecords[].partyId` references `ProducingParty.partyId`.
- `QuarterAggregate` derives from one `EnergyQuarterRecord`.
- `YearAggregate` derives from all quarter records with matching `year`.
- UI last-updated values derive from max `updatedAt` across quarter-level and
  party-level records.
- Producing-party lifecycle updates affect only future quarter entries and do
  not mutate historical `PartyQuarterRecord` values.

## Validation Rules
- `partyId` MUST be unique within each quarter record.
- `producedKwh` and `consumedKwh` MUST be non-negative finite numbers.
- Quarter date ranges MUST be valid and non-overlapping by quarter identity.
- `updatedAt` MUST be valid ISO datetime values.
- Quarter-level `updatedAt` SHOULD equal or exceed every party record
  `updatedAt` in that quarter.
- Removing a party MUST NOT delete previously recorded `PartyQuarterRecord`
  entries for past quarters.

## State Transitions

### PartyDataUpdate lifecycle
1. `Draft` -> Maintainer edits party-level quarter data in `data/energy-data.json`.
2. `LifecycleUpdated` -> Maintainer may add a new party for future quarters or
  mark an existing party inactive for future quarters while retaining history.
3. `Published` -> Maintainer pushes to `main` and workflow deploys site.
4. `Corrected` -> If needed, maintainer applies fix-forward update and republishes.
