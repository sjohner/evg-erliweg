# Feature Specification: All-Party EVG Catalog and Producer System Details

**Feature Branch**: `[004-all-party-catalog]`

**Created**: 2026-08-06

**Status**: Draft

**Input**: Issue #3: expand the canonical energy data model from a producing-party catalog to an all-party EVG community catalog with exact-dated membership, effective-dated producer configurations, PV details, and catalog-derived website counts.

## Dependency and Conflict Resolution

Feature 001's `index.html` remains canonical for manually maintained presentation content: German copy, headings, labels, location, total people, about/contact details, accessibility text, and explanatory text. Feature 002's previous `producingPartiesCatalog` contract conflicts with this feature and is amended by this specification: `data/energy-data.json` now owns a single all-party catalog (`partiesCatalog`) for party identity, exact membership dates, and effective producer configuration history. Producer-only quarterly records continue to reference `partyId` values from that catalog.

No `data/site-content.json` or HTML-hosted party data may be introduced. `reportingStartDate` remains structured in `data/energy-data.json`, and cumulative calculations MUST NOT parse HTML.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintain All EVG Parties (Priority: P1)

As a maintainer, I want every EVG household or metering participant represented once in the canonical catalog so that membership and future consumer/producer features have one source of truth.

**Independent Test**: Inspect `data/energy-data.json` and run `npm run check:data`; confirm exactly the ten initial party IDs exist once, each with `joinedOn: 2025-10-01`.

**Acceptance Scenarios**:

1. **Given** the initial catalog is loaded, **When** validation runs, **Then** `erliweg11`, `erliweg13`, `erliweg25`, `erliweg27`, `erliweg29`, `erliweg31`, `erliweg33`, `erliweg35`, `erliweg37`, and `erliweg39` exist exactly once.
2. **Given** a party joined mid-quarter or left mid-quarter, **When** counts or records are validated for that quarter, **Then** the party is considered active when membership overlaps at least one day of the quarter.
3. **Given** a departed party, **When** future data is maintained, **Then** historical catalog and measurement references remain available.

### User Story 2 - Track Effective Producer Configuration (Priority: P1)

As a maintainer, I want producer status and PV system attributes recorded as effective-dated configuration periods so producer changes do not rewrite history.

**Independent Test**: Run `npm run check:data`; confirm active parties resolve to exactly one non-overlapping producer configuration for each existing quarter, producer configs contain PV details, and non-producer configs contain no PV fields.

**Acceptance Scenarios**:

1. **Given** a producing party is active in a quarter, **When** validation resolves its configuration, **Then** exactly one `isProducer: true` configuration applies.
2. **Given** a non-producing party is active in a quarter, **When** validation resolves its configuration, **Then** exactly one `isProducer: false` configuration applies and no PV fields are present.
3. **Given** a party's producer status changes later, **When** a new configuration period is added, **Then** existing historical configurations remain unchanged and periods do not overlap.

### User Story 3 - Preserve Producer Quarterly Measurements and Totals (Priority: P1)

As a visitor, I want existing producer measurements and aggregate totals to remain unchanged after the catalog migration so the public reporting stays stable.

**Independent Test**: Compare existing `partyRecords` values before and after migration and run the website derivation helpers; quarter, year, and cumulative totals match pre-migration sums.

**Acceptance Scenarios**:

1. **Given** existing records for `erliweg27` and `erliweg37`, **When** the catalog is migrated, **Then** their `partyId` references and kWh values are unchanged.
2. **Given** non-producing parties are added to the catalog, **When** quarterly records are inspected, **Then** no consumer or non-producer measurement records are created.
3. **Given** a producer has a temporarily missing quarter record, **When** the producer count is displayed, **Then** the count is derived from the catalog configuration, not the number of records.

### User Story 4 - Derive Website Community Counts (Priority: P2)

As a visitor, I want the latest-quarter total-party and producing-party counts to reflect the canonical catalog so the community summary is not manually duplicated.

**Independent Test**: Load the homepage and verify total-party count equals active catalog memberships for the latest quarter and producing-party count equals active producer configurations for that quarter.

**Acceptance Scenarios**:

1. **Given** latest quarter data exists, **When** the homepage renders, **Then** `Parteien gesamt` is derived from active catalog memberships.
2. **Given** latest quarter data exists, **When** the homepage renders, **Then** `Produzierende Parteien` is derived from active membership plus `isProducer: true` configuration.
3. **Given** a missing producer quarter record, **When** counts are calculated, **Then** the missing measurement does not reduce the producer count.

### Edge Cases

- Mid-quarter `joinedOn` or `leftOn` dates are included when membership overlaps at least one day of the quarter.
- `leftOn` equal to `joinedOn` is valid and counts for overlapping quarters.
- Configuration periods are inclusive through `inactiveAfterQuarterId` when provided.
- Active parties without exactly one configuration for an existing quarter are invalid.
- Producer-specific PV fields on non-producer configurations are invalid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `data/energy-data.json` MUST contain an all-party catalog as the authoritative source for party identity, membership dates, and producer configuration history.
- **FR-002**: The catalog MUST contain exactly the ten specified initial party IDs, without duplicates, all with `joinedOn: 2025-10-01`.
- **FR-003**: Each party MUST have a stable `partyId`, maintainer-facing `partyLabel`, required `joinedOn`, optional `leftOn`, and non-empty producer configuration history.
- **FR-004**: Membership overlap for quarter counts and record validation MUST include a party active on at least one day of the quarter.
- **FR-005**: Producer configuration periods MUST be non-overlapping and resolve exactly one configuration for every active party and existing quarter.
- **FR-006**: Producer configurations with `isProducer: true` MUST include one PV system with positive `peakPowerKwp`, valid `orientation`, and boolean `hasBattery`.
- **FR-007**: Non-producer configurations MUST NOT include PV-specific fields.
- **FR-008**: Quarterly measurements MUST remain producer-only and reference existing catalog parties that are active members and producers for that quarter.
- **FR-009**: Existing quarterly `partyRecords` for `erliweg27` and `erliweg37` MUST retain their `partyId` references and energy values.
- **FR-010**: Quarter, year, and cumulative totals MUST remain dynamically calculated and MUST NOT be persisted manually.
- **FR-011**: Homepage total-party count MUST be derived from active all-party catalog entries for the latest available quarter.
- **FR-012**: Homepage producing-party count MUST be derived from active membership plus effective producer configuration for the latest available quarter, not from measurement record presence.
- **FR-013**: Party catalog and producer system details MUST remain in `data/energy-data.json`, not HTML.
- **FR-014**: Public website content MUST remain German and repository documentation MUST remain English.
- **FR-015**: Validation MUST reject duplicate parties, invalid dates, invalid configuration ranges, missing/extra PV fields, invalid quarterly references, and catalog/count drift.

### Key Entities

- **Party**: One EVG household or metering participant with identity, membership dates, and producer configuration history.
- **ProducerConfiguration**: Quarter-effective configuration stating producer status and, for producers, PV system attributes.
- **PvSystem**: Producer-only system attributes: peak output, orientation, and battery presence.
- **PartyQuarterRecord**: Producer-only quarterly produced and consumed kWh measurement referencing `Party.partyId`.
- **CommunityCounts**: Runtime projection of latest-quarter total active parties and active producing parties.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm run check:data` rejects any missing or duplicate initial party ID and accepts the migrated initial catalog.
- **SC-002**: 100% of existing producer quarter values remain byte-for-byte unchanged during migration.
- **SC-003**: Latest-quarter total-party count equals the active catalog membership count.
- **SC-004**: Latest-quarter producer count equals active producer configurations and is independent from quarter record count.
- **SC-005**: `npm run check:data` and `npm run check:js` pass after migration.

## Assumptions

- The ten initial parties all joined the EVG on 2025-10-01.
- `erliweg27` and `erliweg37` were producers from `2025-Q4`; `erliweg13` remains a party from 2025-10-01 with producer activation from `2026-Q4`.
- Consumer-level quarterly measurements and producer/consumer detail UI remain out of scope.
