# evg-erliweg

Static website for EVG Erliweg on GitHub Pages.

## Project Structure

- `index.html`: Homepage with current metrics, yearly totals, cumulative totals, and last-updated date
- `history.html`: Historical comparison view for available quarters and years
- `about.html`: About and contact information for EVG Erliweg
- `assets/css/styles.css`: Shared styles, responsive layout, and dark mode
- `assets/js/data-loader.js`: Loading and aggregation helpers for energy data
- `assets/js/app.js`: Shared page bootstrap and rendering logic
- `assets/js/charts.js`: Historical comparison chart rendering
- `data/energy-data.json`: Quarterly data plus static about/contact content

## Local Preview

Option 1:

```powershell
python -m http.server 4173
```

Option 2:

```powershell
npx serve .
```

Then open `http://localhost:4173` (or the URL printed by `serve`) in your browser.

## GitHub Pages

- Publishing is handled by `.github/workflows/deploy-pages.yml`
- Default target is the repository's GitHub Pages domain
- The workflow only copies required static site files into the deploy artifact
- Deployment runs on pushes to `main` when relevant website files changed
- A manual run can be started at any time through `workflow_dispatch`

## Quarterly Data Update and Publishing

1. Open `data/energy-data.json` in the private repository.
2. Maintain the global producing-party catalog in `energy.producingPartiesCatalog`:
	- Add new parties with unique `partyId` and `partyLabel`.
	- Use `activeFromQuarterId` and optional `inactiveAfterQuarterId` to control lifecycle without deleting historical records.
3. Update the target quarter in `energy.quarterlyRecords` using `partyRecords` entries (`partyId`, `partyLabel`, `producedKwh`, `consumedKwh`, `updatedAt`).
4. For a new quarter, add a new `energy.quarterlyRecords` entry with unique `id` (`YYYY-QN`), the correct date range, and one `partyRecords` entry per active producing party.
4. Run data validation before pushing:
	- `npm run check:data`
	- This command validates quarter IDs, date ranges, negative values, duplicate IDs, party catalog references, lifecycle windows, and timestamp consistency.
5. Run a quick sanity check before pushing:
	- `producingParties <= totalParties`
	- no negative kWh values in any `partyRecords` entry
	- each `partyId` appears at most once per quarter
	- `updatedAt` uses ISO format and reflects the latest change
	- links and contact details are still valid
6. Push directly to `main`.
7. The GitHub Pages workflow runs `npm run check:data` before deployment and stops publication if validation fails.
8. GitHub Pages publishes the updated site after validation passes.
9. If a number issue is discovered after deploy, correct the data and push a fix-forward update to `main`.

## Visible Effect of a Data Update

- Homepage and history pages display "Letzte Aktualisierung" based on the latest `updatedAt` across quarterly records.
- After deployment, the date shown on `index.html` and `history.html` should match the newest dataset timestamp.
- Quarter and year totals are calculated dynamically from `partyRecords`; maintainers should not add manual quarter/year summary fields.

## Troubleshooting Invalid or Incomplete Party Data

- `npm run check:data` fails with duplicate `partyId` in one quarter:
	- Keep exactly one entry per `partyId` inside the affected quarter's `partyRecords`.
- `npm run check:data` fails with negative values:
	- Replace negative `producedKwh` or `consumedKwh` values with the corrected non-negative values.
- `npm run check:data` fails with unknown `partyId`:
	- Add the missing party to `energy.producingPartiesCatalog` or correct the quarter record to an existing `partyId`.
- `npm run check:data` fails with lifecycle window mismatch:
	- Align the quarter record with the catalog lifecycle (`activeFromQuarterId` and optional `inactiveAfterQuarterId`) or update lifecycle metadata for the intended future-quarter change.
- A quarter is temporarily missing one active party record:
	- Publication can continue with partial totals from available records, then add the missing party entry in a fix-forward update and publish again.

## Technical Guardrails

- Public website UI content is in German.
- Repository documentation (including this README) is in English.
- Vanilla HTML, CSS, and JavaScript stack.
- Dark mode and WCAG 2.1 AA as quality target.
- Metrics are calculated dynamically from `data/energy-data.json`.