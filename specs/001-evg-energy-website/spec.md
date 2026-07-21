# Feature Specification: EVG Erliweg Energy Transparency Website

**Feature Branch**: `[001-evg-energy-website]`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "Build a public EVG Erliweg website for quarterly, yearly, and cumulative production/consumption transparency, historical browsing, contact/join information, mobile-responsive modern design with dark mode, and simple quarterly admin updates."

## Clarifications

### Session 2026-07-20

- Q: How should quarterly data be updated securely and simply? -> A: Maintainers update a JSON or YAML data file in the private GitHub repository, then build/deploy the site with updated data.
- Q: Should User Story 3 focus on joining criteria or general about information? -> A: Focus on "About and learn more" static text about EVG Erliweg and elektraeigenstrom (with external link), plus clear contact details.
- Q: Which language should the website use? -> A: The website content should be in German.
- Q: What accessibility and performance quality bars should be enforced? -> A: The website should conform to WCAG guidance and achieve Google PageSpeed score >=95.
- Q: Should visitors see when data was last refreshed? -> A: Yes, the website should display the date of the last energy-data update.
- Q: Should energy data updates have an automated data integrity release gate? -> A: No, manual review is sufficient because only a small number of values are updated once per quarter.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Current and Total Energy Performance (Priority: P1)

As a visitor, I want to see current quarter, current year, and all-time production and consumption figures on the main page so I can quickly understand how EVG Erliweg performs.

**Why this priority**: This is the core value of the website and the primary reason visitors will use it.

**Independent Test**: Can be fully tested by opening the homepage and verifying that current quarter, current year, and cumulative metrics since 2025-10-01 are displayed clearly and consistently.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage, **When** energy data exists, **Then** the page shows produced and consumed energy for the current quarter, current year, and the cumulative period starting 2025-10-01.
2. **Given** a visitor opens the homepage on a mobile device, **When** the page renders, **Then** all primary metrics remain readable without horizontal scrolling.
3. **Given** a visitor prefers dark mode, **When** dark mode is enabled, **Then** the same homepage metrics are accessible with sufficient visual contrast.

---

### User Story 2 - Explore Historical Quarters and Years (Priority: P2)

As a visitor, I want to browse past quarters and years so I can compare the community's production and consumption over time.

**Why this priority**: Historical context is explicitly required and strengthens transparency beyond a single snapshot.

**Independent Test**: Can be fully tested by navigating to the history view and selecting multiple prior quarters and years to confirm corresponding values are shown.

**Acceptance Scenarios**:

1. **Given** historical records exist, **When** a visitor selects a past quarter, **Then** the page shows the production and consumption values for that quarter.
2. **Given** historical records exist, **When** a visitor selects a past year, **Then** the page shows the production and consumption values for that year.
3. **Given** no record exists for a selected period, **When** the visitor requests that period, **Then** the site displays a clear no-data message instead of misleading values.

---

### User Story 3 - About and Learn More (Priority: P3)

As a visitor, I want to read concise static information about EVG Erliweg and
elektraeigenstrom, including an official external link and contact details, so I
can better understand the community and how to reach out.

**Why this priority**: Informational context and contact details improve visitor
understanding and trust, while remaining secondary to energy transparency data.

**Independent Test**: Can be fully tested by visiting the about section,
verifying the static EVG and elektraeigenstrom text, validating the external
link target, and confirming contact information is visible.

**Acceptance Scenarios**:

1. **Given** a visitor opens the about section, **When** they read the content,
**Then** they see static explanatory text about EVG Erliweg and
elektraeigenstrom.
2. **Given** a visitor wants official provider context, **When** they select
the external reference, **Then** they are directed to
https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/.
3. **Given** a visitor wants to contact EVG Erliweg, **When** they view the
about/contact area, **Then** they can see clear contact details.

---

### User Story 4 - Update Quarterly Energy Data via Repository Data File (Priority: P4)

As a maintainer, I want to update produced and consumed energy values in a structured data file in the private repository so published figures stay current without a separate admin area.

**Why this priority**: Data maintenance is required for long-term reliability, but is secondary to public visitor consumption of existing data.

**Independent Test**: Can be fully tested by editing one quarterly record in the repository data file, triggering build/deploy, and verifying public pages reflect the new values.

**Acceptance Scenarios**:

1. **Given** a maintainer has repository access, **When** they update the quarterly production and consumption values in the data file and merge the change, **Then** those values become the official record for that quarter.
2. **Given** quarterly values are updated in the data file, **When** the website is built and deployed, **Then** the current and historical summaries reflect the latest merged values.

### Edge Cases

- What happens when no quarterly record has been entered yet for the current quarter?
- How does the system handle invalid data-file updates such as negative energy values or impossible date periods?
- What happens when cumulative totals are requested but one or more historical periods are missing?
- How does the site behave when the external elektraeigenstrom link target is temporarily unavailable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST publish a public website for EVG Erliweg on GitHub Pages.
- **FR-002**: System MUST display produced and consumed energy for the current quarter on the homepage.
- **FR-003**: System MUST display produced and consumed energy for the current calendar year on the homepage.
- **FR-004**: System MUST display cumulative produced and consumed energy totals from 2025-10-01 through the latest available reporting period.
- **FR-005**: System MUST provide a history view allowing visitors to inspect energy production and consumption for past quarters and past years.
- **FR-006**: System MUST provide a mobile-responsive experience where key metrics, navigation, and contact actions are usable on common phone screen sizes.
- **FR-007**: System MUST provide a dark mode option that visitors can enable while preserving readability of all key content.
- **FR-008**: System MUST include an external link to https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/.
- **FR-009**: System MUST provide static about text describing EVG Erliweg and
	the elektraeigenstrom offering.
- **FR-010**: System MUST provide the official external link to
	https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/ within the
	about/learn-more content.
- **FR-011**: System MUST provide clear contact details so visitors can reach
	EVG Erliweg.
- **FR-012**: System MUST store quarterly production and consumption values in a
	structured JSON or YAML data file within the private repository.
- **FR-013**: System MUST preserve previously entered quarterly records so
	historical quarter and year views remain available after new updates.
- **FR-014**: System MUST clearly show the reporting period associated with each
	displayed metric.
- **FR-015**: System MUST support the publication workflow where merged data-file
	changes are included in the next website build/deploy.
- **FR-016**: System MUST dynamically calculate year summaries and cumulative
	totals from quarterly energy period records at runtime, and MUST NOT require
	separately persisted summary totals in the data file.
- **FR-017**: System MUST present all primary website content in German,
	including navigation, headings, explanatory text, labels, and user-facing
	status or validation messages (except proper names, units, and external
	content linked from third-party sites).
- **FR-021**: Project documentation artifacts (including README, planning
	artifacts, contracts, and maintenance instructions) MUST be written in
	English. This language requirement applies to repository documentation only
	and MUST NOT change the German-only requirement for public website content.
- **FR-018**: System MUST conform to Web Content Accessibility Guidelines
	(WCAG) 2.1 Level AA for all primary pages and key user flows.
- **FR-019**: System MUST achieve a Google PageSpeed Insights performance score
	of at least 95 for each primary page in production configuration.
- **FR-020**: System MUST display the date of the most recent energy-data update
	prominently on the homepage and wherever historical energy metrics are shown.

### Key Entities *(include if feature involves data)*

- **EnergyPeriodRecord**: Represents one reporting period with period type (quarter or year), period label, period start, period end, produced energy value, consumed energy value, and last updated timestamp.
- **DerivedYearSummary**: Runtime-calculated year-level aggregation from quarterly records for display only (not persisted in source data).
- **CumulativeSummary**: Runtime-calculated all-time aggregation from 2025-10-01 to latest available period for display only (not persisted in source data).
- **CommunityProfile**: Represents EVG Erliweg profile information including name, location, start date, number of total parties, and number of producing parties.
- **AboutContent**: Represents static public informational text about EVG
	Erliweg and elektraeigenstrom, including the official external link.
- **ContactRequest**: Represents an incoming interest message from a visitor including contact details, message content, and submission timestamp.
- **RepositoryDataUpdate**: Represents a repository change to the quarterly data file including changed period records, maintainer identity, and update timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of sampled visitors can find current quarter, current year, and all-time totals within 30 seconds of landing on the homepage.
- **SC-002**: 100% of manually reviewed quarterly data-file updates merged to the private repository are reflected on public views within one deployment cycle.
- **SC-003**: At least 95% of tested mobile sessions complete key viewing tasks (current metrics and one historical lookup) without layout or navigation failure.
- **SC-004**: At least 90% of test users correctly identify what EVG Erliweg is,
  where to read about elektraeigenstrom, and how to contact the community.
- **SC-005**: 100% of historical records entered remain retrievable by selecting their quarter or year.
- **SC-006**: 100% of user-visible primary interface content on core pages
	(homepage, history, about/contact) is in German.
- **SC-007**: 100% of critical accessibility checks for WCAG 2.1 AA on core
	pages (homepage, history, about/contact) pass before release.
- **SC-008**: Google PageSpeed Insights performance score is >=95 on each core
	page in production configuration.
- **SC-009**: 100% of core pages that present energy metrics display a visible
	"last updated" date that matches the latest update timestamp from source data.

## Assumptions

- EVG Erliweg publishes aggregated community-level values only, not household-level personal data.
- Quarterly reporting periods follow standard calendar quarters for consistency.
- The cumulative baseline date is fixed at 2025-10-01 and is not editable by visitors.
- Maintainers with private repository write access are the authorized updaters of quarterly data.
- Quarterly data changes are manually reviewed before merge rather than enforced through an automated data integrity gate.
- Website publication runs through a build/deploy process after data-file changes are merged.
- Contact requests are expected at low to moderate volume and can be processed asynchronously.
- About/learn-more text will be maintained to stay aligned with current EVG
	Erliweg information and elektraeigenstrom reference details.
- German is the default and required content language for the public website.
- Repository documentation is maintained in English.
- Accessibility conformance target is WCAG 2.1 AA and applies to all primary
	content and interactions.
- Performance score validation is measured with Google PageSpeed Insights
	against the deployed production site.
