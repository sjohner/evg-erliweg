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
- Header actions contract: `contracts/header-actions-contract.md`
- Publishing contract: `contracts/publishing-contract.md`

## Setup
1. Open the repository root.
2. Ensure the canonical data file exists at `data/energy-data.json` and contains the expected community and quarterly data.
3. Serve static files locally with one of:
   - `python -m http.server 8080`
   - `npx serve .`
4. Open the local URL in browser.

## Validation Scenarios

### Scenario 1: Homepage latest + cumulative metrics
1. Open homepage.
2. Confirm visible values for:
   - latest available quarter produced/consumed kWh
   - year containing latest available quarter produced/consumed kWh
   - cumulative totals since 2025-10-01
3. Confirm reporting period labels are shown.
4. Confirm "Produzierende Parteien" equals the number of active parties for the latest available quarter.

Expected outcome:
- All three metric groups render with valid numbers and clear period labels.
- The producing-party count matches active-party lifecycle rules for the latest available quarter.

### Scenario 1a: First-time metric discovery
1. Recruit 10 participants who have not previously used the website.
2. Start each participant on the homepage and begin a 30-second timer.
3. Ask each participant to identify the latest-quarter, corresponding-year, and all-time totals without assistance.
4. Record whether each participant identifies all three groups within 30 seconds.

Expected outcome:
- At least 9 of 10 participants complete the task within 30 seconds, satisfying SC-001.

### Scenario 2: History navigation
1. Open the historical section on `index.html`.
2. Confirm the selector (`Ansicht`) appears directly below the heading `Vergleich ueber alle Zeitraeume` inside the same comparison card.
3. Select at least one prior quarter and one prior year.
4. Confirm values match expected records.

Expected outcome:
- Correct historical values are shown; missing periods display a clear no-data message.

### Scenario 3: Dark mode + responsive behavior
1. Enable dark mode toggle.
2. Confirm the theme switcher is icon-only (no visible Hellmodus/Dunkelmodus text).
3. Toggle light/dark mode and verify the icon updates and accessibility label/pressed state remain correct.
4. Verify key cards, charts, links, and text remain readable.
5. At 390px, 430px, 768px, and 1280px viewport widths, complete the current-metrics flow and one historical lookup.
6. Confirm each width has no horizontal overflow, clipped controls, or navigation failure.

Expected outcome:
- No horizontal scrolling for primary content; contrast remains acceptable in dark mode; theme switcher remains accessible as an icon-only control.

### Scenario 3a: GitHub repository header action
1. Open `index.html` at 390px, 430px, 768px, and 1280px widths.
2. Confirm the website title stays left-aligned while the GitHub icon link and dark-mode toggle stay right-aligned together on the same horizontal level.
3. Confirm both actions measure 44 by 44 CSS pixels, with the GitHub icon immediately to the left of the dark-mode toggle and no overlap or horizontal overflow.
4. Inspect the link and confirm it points to the canonical project repository over HTTPS.
5. Navigate through the header using only the keyboard and activate the repository link.
6. Confirm the link has a visible focus indicator, exposes a German accessible name, and the decorative icon is hidden from assistive technology.
7. Repeat the visual and focus checks in light and dark modes.

Expected outcome:
- Pointer and keyboard users can identify and activate the repository link; its placement, 44px target, focus state, accessible name, and theme contrast satisfy `contracts/header-actions-contract.md` without shifting the theme toggle.

### Scenario 4: About and contact content
1. Open about/contact section.
2. Confirm static EVG Erliweg and elektraeigenstrom explanation text is present.
3. Confirm external terms link points to:
   - `https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/`
4. Confirm contact channel is available and actionable.

Expected outcome:
- Visitors can understand EVG Erliweg context and start a contact action.

### Scenario 4a: First-time project and contact discovery
1. Recruit 10 participants who have not previously used the website.
2. Ask each participant, without assistance, to identify what EVG Erliweg is, find the elektraeigenstrom reference, and locate the contact details.
3. Record whether each participant completes all three tasks.

Expected outcome:
- At least 9 of 10 participants complete all three tasks without assistance, satisfying SC-004.

### Scenario 6: German-language content validation
1. Open `index.html` and review home, history, and about/contact sections.
2. Confirm navigation labels, section headings, descriptive copy, and
   user-facing messages are in German.
3. Confirm only proper names, measurement units, and third-party linked content
   remain non-German where appropriate.

Expected outcome:
- Primary website content is consistently presented in German.

### Scenario 7: WCAG conformance validation
1. Run accessibility checks on home, history, and about/contact sections of `index.html`
   using browser accessibility tooling and keyboard-only navigation.
2. Verify semantic heading structure, alternative text, focus visibility,
   color contrast, and form/link accessibility expectations.
3. Confirm no blocking issues remain for WCAG 2.1 AA criteria in core flows.

Expected outcome:
- Core pages and key interactions meet WCAG 2.1 AA release criteria.

### Scenario 8: PageSpeed performance validation
1. Run Google PageSpeed Insights against deployed `index.html`.
2. Record performance score.
3. Verify the score is >=95.

Expected outcome:
- The single-page site achieves PageSpeed performance score >=95.

### Scenario 9: Last-updated date validation
1. Open `index.html` after deployment.
2. Confirm a visible "last updated" date is shown near energy metrics.
3. Compare displayed date against the latest `updatedAt` value in
    `data/energy-data.json`.

Expected outcome:
- Displayed "last updated" dates in home and history sections are present and
   match the latest source-data update timestamp.

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
- [X] Full 390px/430px/768px/1280px responsive matrix validated
- [X] About/contact validated
- [X] Data update publish flow validated
- [X] German-language content validated
- [X] WCAG 2.1 AA validation completed
- [X] PageSpeed >=95 validated for all primary pages
- [X] Last-updated date display validated
- [X] GitHub repository header action validated
- [ ] First-time metric discovery validated with 10 participants
- [ ] First-time project and contact discovery validated with 10 participants

## Validation Notes (2026-07-21)
- Validated locally via `http://localhost:4173` with browser snapshots for homepage, history, and about flows.
- Mobile viewport check executed at 390px width on all primary pages with no horizontal overflow.
- WCAG contrast findings on `eyebrow`/`site-subtitle` were fixed by increasing muted text contrast token in `assets/css/styles.css` and revalidated.
- PageSpeed verification completed with reported score 100.
- Data update publish flow validated with the simplified process: update energy data and push directly to `main`; number corrections follow a fix-forward push if needed.

## Amendment Validation Notes (2026-08-05)
- Browser validation ran locally at `http://localhost:4173` using Playwright at 390px, 430px, 768px, and 1280px.
- At every width in light and dark modes, the repository action used the canonical HTTPS URL, appeared immediately before the theme toggle, exposed the German accessible name `GitHub-Repository des Projekts öffnen`, and rendered its decorative icon with `aria-hidden="true"`.
- Pointer layout and keyboard activation checks passed at every width. The repository action measured 44 by 44 CSS pixels, showed a visible focus outline, did not overlap the theme toggle, and caused no horizontal overflow.
- At every required width, the website title remained left-aligned and vertically centered with the right-aligned 44 by 44 CSS pixel action controls. On mobile, secondary header context was omitted to preserve the single-row layout.
- Current metrics and both year and quarter history lookups passed at every required width. The history selector remained within the viewport and no horizontal overflow occurred.
