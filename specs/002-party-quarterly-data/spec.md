# Feature Specification: Party-Level Quarterly Data Updates

**Feature Branch**: `[002-party-quarterly-data]`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "As a maintainer I would like to be able to update data for each producing party individually for each quarter. consumed energy and produced energy per party. The totals per quarter and year should still be calculated dynamically afterwards"

## Clarifications

### Session 2026-07-21

- Q: Which party lifecycle model should be authoritative for add/remove while preserving history? -> A: Use a global producing-party catalog with lifecycle fields (`activeFromQuarterId`, `inactiveAfterQuarterId`), and quarter records reference parties by `partyId`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Party Quarterly Values (Priority: P1)

As a maintainer, I want to store produced and consumed energy per producing party for each quarter so that source data is complete and traceable at party level.

**Why this priority**: Party-level quarterly input is the core functional change and prerequisite for all derived totals.

**Independent Test**: Can be fully tested by entering or updating one quarter with party-level records and confirming each producing party has separate produced and consumed values saved in source data.

**Acceptance Scenarios**:

1. **Given** a maintainer edits quarterly data, **When** they add or update values, **Then** the dataset stores produced and consumed energy for each producing party as separate entries for that quarter.
2. **Given** a quarter contains multiple producing parties, **When** the data is saved, **Then** each party record remains individually identifiable within that quarter.
3. **Given** a party value is corrected later, **When** the maintainer updates that party record and republishes, **Then** the corrected value becomes the official source for subsequent calculations.
4. **Given** the producing-party set changes over time, **When** a party is added or removed, **Then** maintainers can update future quarter party records accordingly without deleting historical quarter entries.

---

### User Story 2 - Preserve Dynamic Quarter and Year Totals (Priority: P1)

As a visitor, I want quarter and year totals to remain correct after party-level input changes so that public reporting stays accurate without manually maintained summary fields.

**Why this priority**: Dynamic aggregate correctness is the business-critical outcome for public transparency.

**Independent Test**: Can be fully tested by changing one party value in a quarter, then verifying quarter and year totals on public views update accordingly after publish.

**Acceptance Scenarios**:

1. **Given** party-level values exist for a quarter, **When** the public site renders quarter totals, **Then** totals equal the sum of all producing-party values for that quarter.
2. **Given** multiple quarters exist in one year, **When** the public site renders year totals, **Then** totals equal the sum of quarter totals for that year.
3. **Given** maintainers only update party-level records, **When** data is published, **Then** quarter and year totals are calculated dynamically and not entered manually.

---

### User Story 3 - Handle Incomplete or Invalid Party Data Safely (Priority: P2)

As a maintainer, I want clear rules for missing or invalid party-level values so that publication remains reliable and data quality issues are resolved predictably.

**Why this priority**: Data quality controls reduce reporting mistakes and simplify fix-forward corrections.

**Independent Test**: Can be fully tested by attempting invalid updates (for example negative values or duplicate party entries for the same quarter) and verifying they are detectable during maintenance checks.

**Acceptance Scenarios**:

1. **Given** a quarter update includes a negative produced or consumed value, **When** the maintainer performs the pre-push check, **Then** the issue is identified and corrected before publish.
2. **Given** the same producing party appears more than once in the same quarter, **When** the maintainer reviews the dataset, **Then** duplicate entries are resolved so each producing party has a single record per quarter.
3. **Given** one producing party has no quarter entry yet, **When** totals are calculated, **Then** only available party records are summed and the missing entry can be added in a later fix-forward update.
4. **Given** invalid party-level data is pushed to `main`, **When** the publish pipeline runs, **Then** data validation fails and deployment is blocked until corrected data is pushed.

### Edge Cases

- What happens when a quarter contains no party records yet for one or more producing parties?
- How does the system handle a quarter where all party-level produced and consumed values are zero?
- What happens when the producing-party list changes over time (party added or removed) between quarters?
- How are duplicate party identifiers in the same quarter detected during maintenance checks?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow maintainers to store produced and consumed energy per producing party for each quarter in the repository data file.
- **FR-002**: System MUST keep party-level records individually identifiable within each quarter.
- **FR-003**: System MUST calculate quarter totals dynamically from party-level records for that quarter.
- **FR-004**: System MUST calculate year totals dynamically from quarterly data and MUST NOT require manually maintained year summary values.
- **FR-005**: System MUST preserve previously recorded party-level quarter data so historical recalculation remains possible after future updates.
- **FR-006**: System MUST support fix-forward corrections by allowing maintainers to update previously recorded party-level values.
- **FR-007**: System MUST treat negative produced or consumed party values as invalid maintenance data.
- **FR-008**: System MUST ensure each producing party appears at most once per quarter in source data.
- **FR-009**: System MUST continue displaying public website content in German.
- **FR-010**: Repository documentation for this feature (maintenance instructions, plans, and contracts) MUST be written in English.
- **FR-011**: System MUST allow maintainers to add new producing parties or mark existing parties as no longer active for future quarters while preserving all historical quarter records and derived totals.
- **FR-012**: System MUST maintain a global producing-party catalog as the authoritative source of party identity and lifecycle metadata (`activeFromQuarterId`, `inactiveAfterQuarterId`), and quarter-level records MUST reference catalog parties via `partyId`.
- **FR-013**: System MUST run an automated data-validation pipeline job before the GitHub Pages deployment job and MUST block deployment when validation fails.

### Key Entities *(include if feature involves data)*

- **ProducingParty**: Represents one producing party with a stable identifier and display label used across quarters.
- **PartyQuarterRecord**: Represents produced and consumed energy for one producing party in one quarter, including `partyId` reference to the global producing-party catalog and update timestamp.
- **QuarterAggregate**: Runtime projection of total produced and consumed energy for one quarter, calculated from all PartyQuarterRecord entries in that quarter.
- **YearAggregate**: Runtime projection of total produced and consumed energy for one year, calculated from all quarter data in that year.
- **RepositoryDataUpdate**: Represents one published data-file change that can add, modify, or correct party-level quarter records.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of published quarter totals match the sum of party-level produced and consumed values for the same quarter.
- **SC-002**: 100% of published year totals match the sum of published quarter totals for that year.
- **SC-004**: 100% of detected invalid entries (negative values or duplicate party entries per quarter) are corrected before or immediately after publication via fix-forward updates.
- **SC-005**: 100% of public website content remains in German while repository documentation remains in English.
- **SC-006**: 100% of historical quarter totals remain unchanged after party lifecycle updates (adding or removing parties for future quarters only).

## Assumptions

- The existing maintainer workflow remains direct push-to-main with fix-forward corrections.
- Quarter and year totals continue to be computed from source data at runtime rather than stored as manual summary fields.
- Producing parties can be represented with stable identifiers in the data file.
- If a party entry is missing for a quarter, totals are calculated from available party records and completed in a later update.
- Public-facing pages continue using German content, while repository documentation for maintainers stays English.
- Party removal is modeled as inactivity for new quarters, not deletion of
	historical quarter records.
- The global producing-party catalog is the authoritative source for party
	identity and lifecycle metadata across all quarters.
