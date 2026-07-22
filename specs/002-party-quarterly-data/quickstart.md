# Quickstart: Party-Level Quarterly Data Updates

## Purpose
Validate party-level quarterly data maintenance and dynamic aggregate behavior
end-to-end.

## Prerequisites
- Repository access with permission to push to `main`.
- Ability to run a local static preview or view deployed pages.
- Access to GitHub Actions run status for deployment confirmation.

## Artifact References
- Plan: `plan.md`
- Data model: `data-model.md`
- Data schema contract: `contracts/energy-data.schema.json`
- Publishing contract: `contracts/publishing-contract.md`

## Setup
1. Open the repository root.
2. Open `data/energy-data.json`.
3. Ensure `energy.producingPartiesCatalog` is the authoritative source of
   party identity and lifecycle metadata (`activeFromQuarterId`,
   `inactiveAfterQuarterId`).
4. Ensure quarter records include `partyRecords` entries with per-party
   `producedKwh` and `consumedKwh` values referencing catalog `partyId` values.
5. Run `npm run check:data` locally before pushing.
4. Preview locally (or push and validate on deployed pages).

## Validation Scenarios

### Scenario 1: Party-level quarter update
1. Edit one quarter and update produced/consumed values for at least one party.
2. Save and verify each party entry remains individually identifiable by
   `partyId` and `partyLabel`.

Expected outcome:
- Quarter data stores separate produced and consumed values per producing party.

### Scenario 2: Quarter total correctness
1. Sum the quarter party-level values manually.
2. Open public page where that quarter total appears.

Expected outcome:
- Rendered quarter produced/consumed totals match manual sum.

### Scenario 3: Year total correctness
1. Sum quarter totals for a target year manually.
2. Open yearly comparison view.

Expected outcome:
- Rendered yearly produced/consumed totals match manual sum.

### Scenario 4: Invalid data detection
1. Intentionally prepare an invalid data change locally (negative value or
   duplicate `partyId` in one quarter).
2. Run maintainer sanity check before publishing.

Expected outcome:
- Invalid entries are detected and corrected before publish (or immediately via
  fix-forward if already published).

### Scenario 5: Publish and fix-forward behavior
1. Push a valid party-level update to `main`.
2. Confirm the `validate-data` workflow job succeeds before deploy.
3. Confirm deploy workflow completes and values are visible publicly.
3. If needed, apply a correction and push again.

Expected outcome:
- Published values update within one deploy cycle.
- Fix-forward correction is reflected in the next deploy cycle.

Evidence to capture:
- URL (or run identifier) for one failed `validate-data` workflow job triggered by intentionally invalid test data, plus a short log excerpt showing the validation failure reason.
- URL (or run identifier) for the next passed workflow run after fix-forward correction, plus a short log excerpt showing `check:data` success.

Suggested evidence template:
- Failed run ID/URL: `<to-fill-after-test>`
- Failure log excerpt: `<to-fill-after-test>`
- Passed run ID/URL: `<to-fill-after-test>`
- Success log excerpt: `<to-fill-after-test>`

### Scenario 6: Language policy
1. Review public pages and repository docs touched by this feature.

Expected outcome:
- Public website UI remains German.
- Repository documentation remains English.

### Scenario 7: Add/remove party lifecycle
1. Add one new producing party for a future quarter and publish.
2. Mark one existing party as inactive for future quarters and publish.
3. Verify historical quarters still show unchanged totals and records.

Expected outcome:
- Future quarters reflect the updated party set.
- Historical quarter and year totals remain preserved.

## Example Maintainer Update Flow
1. Add or update catalog entries in `energy.producingPartiesCatalog`.
2. Add or update quarter `partyRecords` values for each active party.
3. Run `npm run check:data` and fix any validation issues.
4. Push to `main` and confirm `validate-data` passes before deploy.
5. Verify `index.html` and `history.html` totals and last-updated date.

## Completion Checklist
- [ ] Party-level quarter records validated
- [ ] Quarter totals verified from party sums
- [ ] Year totals verified from quarter sums
- [ ] Invalid data rules verified
- [ ] Publish + fix-forward workflow verified
- [ ] CI validation-gate evidence captured (one fail + one pass run with short log excerpts)
- [ ] Language policy verified (German UI, English docs)
- [ ] Add/remove party lifecycle verified with preserved history
