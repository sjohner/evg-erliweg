# Data Model: EVG Erliweg Energy Transparency Website

## Amendment: Site Content Source (2026-08-06)

`index.html` is the canonical manually maintained source for `community`, `about`, and `contact` presentation content. `data/energy-data.json` remains the canonical structured source for energy-domain entities, including `reportingStartDate` for cumulative calculations.

## 1. CommunityProfile
- Purpose: Stores stable identity/context displayed to visitors.
- Fields:
  - `name` (string, required): Community name, e.g. "EVG Erliweg".
  - `city` (string, required): Community location, e.g. "Fraubrunnen".
  - `country` (string, required): Country, e.g. "Switzerland".
  - `totalParties` (integer, required, >= 1).
  - `totalPeople` (integer, required, >= `totalParties`).

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

## 4b. ProducingPartiesSummary (Runtime Projection)
- Persistence: Not stored in repository data file.
- Purpose: View-model projection of active producing-party count for the latest available quarter shown to visitors.
- Fields:
  - `latestQuarterId` (string, required): Quarter id used as reference for active-party evaluation.
  - `activeProducingParties` (integer, required, >= 0): Count of active parties in `ProducingPartyCatalog` for `latestQuarterId`.

## 4c. HeaderRepositoryAction (Static UI Configuration)
- Persistence: Not stored in the energy data file.
- Purpose: Describes the header action that lets visitors inspect the project source.
- Fields:
  - `repositoryUrl` (absolute HTTPS URL, required): `https://github.com/sjohner/evg-erliweg`.
  - `accessibleLabel` (string, required): German label identifying the repository destination.
  - `position` (constant, required): Immediately before the theme-toggle control.
  - `responsiveAlignment` (constant, required): Right-aligned with the theme toggle on the same horizontal level as the left-aligned website title.
  - `targetSize` (constant, required): 44 by 44 CSS pixels, equal to the theme-toggle target.
  - `secondaryContextPolicy` (constant, required): The header eyebrow and subtitle may be omitted at constrained mobile widths while the website title remains visible.
  - `icon` (constant, required): GitHub mark rendered decoratively and hidden from assistive technology.

## 5. ReportingStartDate
- Persistence: Stored in `data/energy-data.json`.
- Purpose: Canonical lower bound for cumulative totals.
- Fields:
  - `reportingStartDate` (date string, required): Baseline date used by runtime cumulative calculations.

## 6. AboutContent
- Persistence: Canonical manual HTML content in `index.html`.
- Purpose: Public about/learn-more information and external reference.

## 7. ContactChannel
- Persistence: Canonical manual HTML content in `index.html`.
- Purpose: Publicly displayed means for interested users to contact EVG.

## Relationships
- `ReportingStartDate.reportingStartDate` defines the lower bound for `CumulativeSummary.fromDate`.
- `EnergyPeriodRecord` collection is the source for both `DerivedYearSummary` and `CumulativeSummary`.
- `EnergyPeriodRecord.updatedAt` values are the source for `LastUpdatedSummary`.
- `ProducingPartiesSummary` is derived from party lifecycle metadata evaluated against the latest available quarter.
- `HeaderRepositoryAction` is independent of energy data and adjacent to the theme-toggle control in the header action group.
- `AboutContent` and `ContactChannel` are independent content entities rendered
  alongside metrics.

## Persistence Model
- Persisted source entities in `data/energy-data.json`:
  - `ReportingStartDate`
  - `EnergyPeriodRecord` collection
  - `ProducingPartiesCatalog` (defined by Feature 002)
- Persisted manual presentation entities in `index.html`:
  - `CommunityProfile`
  - `AboutContent`
  - `ContactChannel`
- Non-persisted runtime projections:
  - `DerivedYearSummary`
  - `CumulativeSummary`
  - `LastUpdatedSummary`
  - `ProducingPartiesSummary`
  - `HeaderRepositoryAction`

## Validation Rules
- No duplicate quarterly `id` values.
- Quarter sequence must not overlap by date range.
- `producedKwh` and `consumedKwh` must be non-negative finite numbers.
- `startDate`/`endDate` must be valid ISO dates.
- `CommunityProfile.totalPeople >= CommunityProfile.totalParties` (manual HTML maintenance rule).

## State Transitions

### RepositoryDataUpdate lifecycle
1. `Draft` -> Maintainer edits `data/energy-data.json` locally.
2. `Committed` -> Maintainer commits the quarterly update.
3. `Pushed` -> Maintainer pushes the commit directly to `main`.
4. `Published` -> GitHub Pages deploy completes and the site serves the new metrics.

Corrections follow the same lifecycle as a new fix-forward commit.
