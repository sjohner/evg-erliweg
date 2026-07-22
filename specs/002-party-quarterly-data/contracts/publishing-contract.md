# Publishing Contract: Party-Level Quarterly Data

## Purpose
Define the contract between party-level quarterly data updates and public
website publication.

## Inputs
- Canonical data file: `data/energy-data.json`
- Data schema: `contracts/energy-data.schema.json`

## Publication Preconditions
1. Maintainer updates party-level quarter records in `data/energy-data.json`.
2. Maintainer runs local validation (`npm run check:data`) before pushing.
3. Maintainer pushes the change directly to `main`.
4. Data-validation job passes before deployment is allowed.
5. GitHub Pages deploy job publishes the new repository state.

## Publication Trigger
- A push to `main` containing changes to site/data files.

## Guaranteed Outputs
1. Quarter totals shown on public pages equal sum of all producing-party values
   for the quarter.
2. Year totals shown on public pages equal sum of available quarter totals for
   that year.
3. No manual year/quarter summary fields are required in source data.
4. Last-updated date shown on energy pages reflects latest source update.
5. Producing parties can be added or removed for future quarters without
   deleting or changing historical quarter records.

## Failure Behavior
- If a party-level number issue is discovered post-publish, maintainer performs
  a fix-forward correction in `data/energy-data.json` and pushes again.
- If data-validation fails in CI, deployment is blocked; maintainer corrects
   data and pushes again.
- If a quarter is missing one expected party entry, runtime totals still use the
   available valid `partyRecords`; maintainer adds the missing record in a
   follow-up fix-forward update.
- If an orphaned `partyId` or lifecycle-window mismatch is detected, maintainer
   resolves the catalog/quarter reference mismatch before the next publish.

## CI Gate Rationale
- The validation gate is mandatory because publication is push-to-main.
- Blocking deploy on validation failures prevents incorrect public totals and
   preserves historical integrity.

## Versioning
- Contract and schema changes are tracked in version control with explicit
  rationale in change history.
