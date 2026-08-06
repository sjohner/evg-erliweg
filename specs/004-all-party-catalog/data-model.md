# Data Model: All-Party EVG Catalog and Producer System Details

## 1. ReportingStartDate
- Purpose: Canonical cumulative baseline for runtime calculations.
- Fields:
  - `reportingStartDate` (date string, required, `YYYY-MM-DD`).

## 2. Party
- Purpose: Represents one EVG household or metering participant.
- Fields:
  - `partyId` (string, required): Stable unique identifier.
  - `partyLabel` (string, required): Maintainer-facing label.
  - `joinedOn` (date string, required): Exact community join date.
  - `leftOn` (date string, optional): Exact final membership date; inclusive when present.
  - `producerConfigurations` (array<ProducerConfiguration>, required, non-empty): Effective-dated producer status history.

## 3. ProducerConfiguration
- Purpose: Quarter-effective producer status and system details.
- Fields:
  - `isProducer` (boolean, required).
  - `activeFromQuarterId` (string, required, `YYYY-QN`).
  - `inactiveAfterQuarterId` (string, optional, `YYYY-QN`, inclusive).
  - `pvSystem` (PvSystem, required only when `isProducer` is `true`, absent when false).

## 4. PvSystem
- Purpose: Producer-only PV system attributes.
- Fields:
  - `peakPowerKwp` (number, required, finite and > 0).
  - `orientation` (enum, required): `N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`, `FLAT`.
  - `hasBattery` (boolean, required).

## 5. PartyQuarterRecord
- Purpose: Producer-only measurement for one party in one quarter.
- Fields:
  - `partyId` (string, required): Reference to `Party.partyId`.
  - `producedKwh` (number, required, >= 0).
  - `consumedKwh` (number, required, >= 0).
  - `updatedAt` (datetime string, required).

## 6. EnergyQuarterRecord
- Purpose: Quarter container for producer measurements.
- Fields:
  - `id` (string, required): `YYYY-QN`.
  - `year` (integer, required).
  - `quarter` (integer, required, 1..4).
  - `startDate` (date string, required).
  - `endDate` (date string, required).
  - `partyRecords` (array<PartyQuarterRecord>, required).

## 7. Runtime Projections
- `QuarterAggregate`: Sum of one quarter's `partyRecords`.
- `YearAggregate`: Sum of quarter aggregates for one year.
- `CumulativeSummary`: Sum of quarter aggregates on or after `reportingStartDate`.
- `CommunityCounts`: Latest-quarter active-party and active-producer counts derived from `partiesCatalog`.

## Relationships
- `EnergyQuarterRecord.partyRecords[].partyId` references `Party.partyId`.
- A quarterly record is valid only when the referenced party's membership overlaps the quarter and the resolved producer configuration has `isProducer: true`.
- Party labels for measurements are resolved from `Party.partyLabel` at runtime.
- Counts are derived from catalog membership/configuration and do not depend on measurement record completeness.

## Validation Rules
- `partyId` values are unique across `partiesCatalog`.
- All ten initial IDs exist exactly once and have `joinedOn: 2025-10-01`.
- `joinedOn` and `leftOn` use `YYYY-MM-DD`; `leftOn` is not earlier than `joinedOn`.
- Active membership overlaps a quarter when `joinedOn <= endDate` and `leftOn` is absent or `leftOn >= startDate`.
- Producer configuration periods for a party do not overlap and resolve exactly one configuration for each active party and existing quarter.
- Producer configurations require valid `pvSystem`; non-producer configurations must not contain `pvSystem`.
- Quarterly records reference existing parties that are active members and producers for the quarter.
- Quarter/year/cumulative totals are runtime projections and are not persisted.
