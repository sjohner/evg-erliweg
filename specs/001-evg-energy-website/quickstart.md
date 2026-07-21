# Quickstart: EVG Erliweg Energy Transparency Website

## Purpose
Validate the feature end-to-end for local development and deployment readiness.

## Prerequisites
- Repository access with ability to run local static files.
- Modern browser (desktop + mobile viewport testing).
- Access to publish workflow permissions for GitHub Pages.

## Artifact References
- Plan: `plan.md`
- Data model: `data-model.md`
- Data schema contract: `contracts/energy-data.schema.json`
- Publishing contract: `contracts/publishing-contract.md`

## Setup
1. Open the repository root.
2. Ensure the canonical data file exists at `data/energy-data.json` and contains the expected community and quarterly data.
3. Serve static files locally with one of:
   - `python -m http.server 8080`
   - `npx serve .`
4. Open the local URL in browser.

## Validation Scenarios

### Scenario 1: Homepage current + cumulative metrics
1. Open homepage.
2. Confirm visible values for:
   - current quarter produced/consumed kWh
   - current year produced/consumed kWh
   - cumulative totals since 2025-10-01
3. Confirm reporting period labels are shown.

Expected outcome:
- All three metric groups render with valid numbers and clear period labels.

### Scenario 2: History navigation
1. Open history view/page.
2. Select at least one prior quarter and one prior year.
3. Confirm values match expected records.

Expected outcome:
- Correct historical values are shown; missing periods display a clear no-data message.

### Scenario 3: Dark mode + responsive behavior
1. Enable dark mode toggle.
2. Verify key cards, charts, links, and text remain readable.
3. Test common mobile viewport widths (e.g., 390px and 430px).

Expected outcome:
- No horizontal scrolling for primary content; contrast remains acceptable in dark mode.

### Scenario 4: About and contact content
1. Open about/contact section.
2. Confirm static EVG Erliweg and elektraeigenstrom explanation text is present.
3. Confirm external terms link points to:
   - `https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/`
4. Confirm contact channel is available and actionable.

Expected outcome:
- Visitors can understand EVG Erliweg context and start a contact action.

### Scenario 6: German-language content validation
1. Open homepage, history page, and about/contact page.
2. Confirm navigation labels, section headings, descriptive copy, and
   user-facing messages are in German.
3. Confirm only proper names, measurement units, and third-party linked content
   remain non-German where appropriate.

Expected outcome:
- Primary website content is consistently presented in German.

### Scenario 7: WCAG conformance validation
1. Run accessibility checks on homepage, history page, and about/contact page
   using browser accessibility tooling and keyboard-only navigation.
2. Verify semantic heading structure, alternative text, focus visibility,
   color contrast, and form/link accessibility expectations.
3. Confirm no blocking issues remain for WCAG 2.1 AA criteria in core flows.

Expected outcome:
- Core pages and key interactions meet WCAG 2.1 AA release criteria.

### Scenario 8: PageSpeed performance validation
1. Run Google PageSpeed Insights against deployed homepage, history page, and
   about/contact page.
2. Record performance score for each page.
3. Verify each page score is >=95.

Expected outcome:
- All primary pages achieve PageSpeed performance score >=95.

### Scenario 9: Last-updated date validation
1. Open homepage and history page after deployment.
2. Confirm a visible "last updated" date is shown near energy metrics.
3. Compare displayed date against the latest `updatedAt` value in
    `data/energy-data.json`.

Expected outcome:
- Displayed "last updated" date is present and matches the latest source-data
   update timestamp.

### Scenario 5: Quarterly data update publication
1. Update one quarterly record in `data/energy-data.json`.
2. Push the change to `main`.
3. Wait for the publish workflow to complete.
4. Re-open site after deployment.

Expected outcome:
- Updated values appear in homepage and history views within one deployment cycle.
- Updated data appears after deployment through the normal push-to-main workflow.

## Completion Checklist
- [X] Homepage metrics validated
- [X] History lookup validated
- [X] Dark mode and mobile validated
- [X] About/contact validated
- [X] Data update publish flow validated
- [X] German-language content validated
- [X] WCAG 2.1 AA validation completed
- [X] PageSpeed >=95 validated for all primary pages
- [X] Last-updated date display validated

## Validation Notes (2026-07-21)
- Validated locally via `http://localhost:4173` with browser snapshots for homepage, history, and about flows.
- Mobile viewport check executed at 390px width on all primary pages with no horizontal overflow.
- WCAG contrast findings on `eyebrow`/`site-subtitle` were fixed by increasing muted text contrast token in `assets/css/styles.css` and revalidated.
- PageSpeed verification completed with reported score 100.
- Data update publish flow validated with the simplified process: update energy data and push directly to `main`; number corrections follow a fix-forward push if needed.
