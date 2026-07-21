# Publishing Contract

## Purpose
Define the contract between repository data updates and public website publication.

## Inputs
- Canonical data file: `data/energy-data.json`
- Data schema: `contracts/energy-data.schema.json`

## Publication Preconditions
1. Maintainer updates `data/energy-data.json` and pushes directly to `main`.
2. The pushed repository state is published through the configured GitHub Pages workflow.

## Publication Trigger
- A push to `main` containing changes to site/data files.

## Guaranteed Outputs
1. Homepage presents:
   - Current quarter produced/consumed kWh
   - Current year produced/consumed kWh
   - Cumulative produced/consumed kWh since `community.startDate`
   - Visible "last updated" date derived from latest quarterly record update
2. History view presents quarter and year records derived from quarterly source data.
   - Visible "last updated" date for the currently displayed energy dataset
3. About section presents EVG Erliweg and elektraeigenstrom summary text plus
   the external terms URL.
4. Contact section presents active contact channel.

## Failure Behavior
- If a published data issue is discovered, maintainers correct it in a follow-up
   repository change (fix forward) and republish through the normal workflow.

## Versioning
- Schema and contract changes must be tracked in version control with an explicit rationale in pull request notes.
