# Research: Party-Level Quarterly Data Updates

## Decision 1: Canonical data shape for party-level quarterly values
- Decision: Store per-quarter `partyRecords` arrays under each quarterly record,
  where each entry contains a stable party identifier plus `producedKwh` and
  `consumedKwh`.
- Rationale: Keeps all source truth in one place and allows dynamic aggregation
  without duplicated summary fields.
- Alternatives considered:
  - Separate top-level party table keyed by quarter: rejected due to more
    complex joins at runtime.
  - Keep only pre-computed quarter totals: rejected because it does not satisfy
    party-level update requirement.

## Decision 2: Dynamic aggregation remains runtime-only
- Decision: Continue calculating quarter and year totals dynamically in
  JavaScript from party-level data.
- Rationale: Preserves existing architecture and avoids manual summary drift.
- Alternatives considered:
  - Persist quarter/year totals in JSON: rejected as redundant and error-prone.
  - Compute totals in a backend API: rejected as out of scope for static site.

## Decision 3: Party identity strategy
- Decision: Use stable `partyId` and `partyLabel` fields for each producing
  party record.
- Rationale: Enables reliable updates, duplicate detection, and readable UI
  context during maintenance.
- Alternatives considered:
  - Label-only identity: rejected because label edits can break matching.
  - Numeric positional index only: rejected because it is fragile over time.

## Decision 4: Handling missing party records
- Decision: Totals are calculated from available party entries; missing party
  data is allowed temporarily and corrected via fix-forward updates.
- Rationale: Aligns with single-maintainer push workflow and avoids blocked
  publication.
- Alternatives considered:
  - Hard-fail publication when any party record is missing: rejected as too
    strict for operational model.

## Decision 5: Invalid data handling policy
- Decision: Treat negative values and duplicate `partyId` entries in the same
  quarter as invalid maintenance data, enforce pre-push local checks, and block
  deployment with a mandatory CI validation gate until data is corrected.
- Rationale: Protects aggregate correctness while preserving low-friction
  maintenance flow with a safety net that prevents invalid publication.
- Alternatives considered:
  - Accept negatives and clamp at runtime: rejected due to hidden data issues.
  - Rely only on manual maintainer review without CI validation: rejected
    because invalid data could still be published.

## Decision 6: Documentation and language boundaries
- Decision: Keep repository docs for this feature in English; keep public
  website content in German.
- Rationale: Matches constitution engineering standards and existing FR-017
  style requirement for visitor-facing content.
- Alternatives considered:
  - German-only docs and UI: rejected by repository documentation policy.

## Decision 7: Party lifecycle (add/remove) with history preservation
- Decision: Support dynamic producing-party lifecycle by allowing parties to be
  added for future quarters and marked inactive for future quarters, while
  preserving all historical quarter party records.
- Rationale: Meets maintainer flexibility requirement without rewriting
  published history.
- Alternatives considered:
  - Hard delete party history on removal: rejected because it breaks historical
    transparency.
  - Disallow party set changes after initial setup: rejected because it blocks
    normal community evolution.

## Clarification Resolution Summary
All technical and operational uncertainties for this feature are resolved. No
`NEEDS CLARIFICATION` markers remain.
