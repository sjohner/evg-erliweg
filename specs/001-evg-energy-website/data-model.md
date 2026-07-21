# Data Model: EVG Erliweg Energy Transparency Website

## 1. CommunityProfile
- Purpose: Stores stable identity/context displayed to visitors.
- Fields:
  - `name` (string, required): Community name, e.g. "EVG Erliweg".
  - `city` (string, required): Community location, e.g. "Fraubrunnen".
  - `country` (string, required): Country, e.g. "Switzerland".
  - `startDate` (date string, required): Baseline date for cumulative metrics (`2025-10-01`).
  - `totalParties` (integer, required, >= 1).
  - `producingParties` (integer, required, >= 1 and <= `totalParties`).

## 2. EnergyPeriodRecord
- Purpose: Canonical quarterly source record for production/consumption.
- Fields:
  - `id` (string, required): Unique period key, e.g. `2025-Q4`.
  - `periodType` (enum, required): `quarter`.
  - `year` (integer, required, >= 2025).
  - `quarter` (integer, required, 1..4).
  - `startDate` (date string, required).
  - `endDate` (date string, required, >= `startDate`).
  - `producedKwh` (number, required, >= 0).
  - `consumedKwh` (number, required, >= 0).
  - `updatedAt` (datetime string, required).

## 3. DerivedYearSummary (Runtime Projection)
- Persistence: Not stored in repository data file.
- Purpose: View-model projection calculated from quarterly records at runtime.
- Fields:
  - `year` (integer, required).
  - `producedKwh` (number, required, >= 0).
  - `consumedKwh` (number, required, >= 0).
  - `quartersIncluded` (integer, required, 0..4).

## 4. CumulativeSummary (Runtime Projection)
- Persistence: Not stored in repository data file.
- Purpose: View-model projection for all-time totals from baseline date.
- Fields:
  - `fromDate` (date string, required): Fixed baseline date.
  - `toDate` (date string, required): Latest period end date.
  - `producedKwh` (number, required, >= 0).
  - `consumedKwh` (number, required, >= 0).

## 4a. LastUpdatedSummary (Runtime Projection)
- Persistence: Not stored in repository data file.
- Purpose: View-model projection of latest known energy data update date shown to visitors.
- Fields:
  - `lastUpdatedAt` (datetime string, required): Max `updatedAt` value from `EnergyPeriodRecord` collection.
  - `lastUpdatedDate` (date string, required): Display-friendly date derived from `lastUpdatedAt`.

## 5. AboutContent
- Purpose: Public about/learn-more information and external reference.
- Fields:
  - `summary` (string, required): Human-readable description of EVG Erliweg and
    elektraeigenstrom.
  - `termsUrl` (URL string, required): `https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/`.
  - `lastReviewedAt` (date string, required).

## 6. ContactChannel
- Purpose: Publicly displayed means for interested users to contact EVG.
- Fields:
  - `label` (string, required): e.g. "Contact EVG Erliweg".
  - `type` (enum, required): `email` or `form-link`.
  - `target` (string, required): Email address or external form URL.

## Relationships
- `CommunityProfile.startDate` defines the lower bound for `CumulativeSummary.fromDate`.
- `EnergyPeriodRecord` collection is the source for both `DerivedYearSummary` and `CumulativeSummary`.
- `EnergyPeriodRecord.updatedAt` values are the source for `LastUpdatedSummary`.
- `AboutContent` and `ContactChannel` are independent content entities rendered
  alongside metrics.

## Persistence Model
- Persisted source entities in `data/energy-data.json`:
  - `CommunityProfile`
  - `EnergyPeriodRecord` collection
  - `AboutContent`
  - `ContactChannel`
- Non-persisted runtime projections:
  - `DerivedYearSummary`
  - `CumulativeSummary`
  - `LastUpdatedSummary`

## Validation Rules
- No duplicate quarterly `id` values.
- Quarter sequence must not overlap by date range.
- `producedKwh` and `consumedKwh` must be non-negative finite numbers.
- `startDate`/`endDate` must be valid ISO dates.
- `CommunityProfile.producingParties <= CommunityProfile.totalParties`.

## State Transitions

### RepositoryDataUpdate lifecycle
1. `Draft` -> Maintainer edits `data/energy-data.json` in feature branch.
2. `Reviewed` -> Maintainer or reviewer confirms the changed values are correct.
3. `Merged` -> Change merged to publish branch.
4. `Published` -> GitHub Pages deploy completes and site serves new metrics.
