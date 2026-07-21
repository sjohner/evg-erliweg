<!--
Sync Impact Report
- Version change: template placeholder value -> 1.0.0
- Modified principles:
	- Principle slot 1 -> I. Spec-Driven Delivery
	- Principle slot 2 -> II. Traceable Requirements
	- Principle slot 3 -> III. Testable by Default
	- Principle slot 4 -> IV. Incremental, Reversible Change
	- Principle slot 5 -> V. Simplicity and Operational Clarity
- Added sections:
	- Section slot 2 -> Engineering Standards
	- Section slot 3 -> Workflow and Quality Gates
- Removed sections: None
- Templates requiring updates:
	- ✅ reviewed (no changes required): .specify/templates/plan-template.md
	- ✅ reviewed (no changes required): .specify/templates/spec-template.md
	- ✅ reviewed (no changes required): .specify/templates/tasks-template.md
- Command/runtime guidance requiring updates:
	- ✅ reviewed (no changes required): .github/prompts/speckit.constitution.prompt.md
	- ✅ reviewed (no changes required): .github/agents/speckit.constitution.agent.md
	- ✅ reviewed (no CLAUDE-only drift detected): .github/agents/speckit.*.agent.md
- Follow-up TODOs: None
-->

# evg-erliweg Constitution

## Core Principles

### I. Spec-Driven Delivery
Every non-trivial change MUST begin with an explicit specification artifact and
MUST preserve alignment between specification, implementation plan, and task
breakdown. Work that bypasses this chain is out of policy unless marked as an
emergency fix with documented scope and rollback notes.
Rationale: Explicit intent reduces rework and makes review decisions auditable.

### II. Traceable Requirements
Requirements MUST be testable and traceable from spec to plan to tasks and then
to implementation evidence. Any requirement introduced during implementation MUST
be backfilled into the spec before merge.
Rationale: End-to-end traceability prevents silent scope drift and missing
deliverables.

### III. Testable by Default
Each user story MUST define independent acceptance scenarios. Implementation MUST
include verification evidence proportional to risk: at minimum scenario checks,
and integration or contract tests when interfaces or data contracts change.
Rationale: Independent validation keeps incremental delivery safe and measurable.

### IV. Incremental, Reversible Change
Delivery MUST proceed in small, reviewable increments that can be rolled back
without broad system impact. Tasks SHOULD prefer additive, isolated changes over
large coupled rewrites; exceptions MUST include explicit risk justification.
Rationale: Reversible increments reduce operational risk and speed diagnosis.

### V. Simplicity and Operational Clarity
Design and implementation MUST favor the simplest solution that satisfies current
requirements. New abstractions, dependencies, or layers MUST include a concrete
need statement and observable benefit.
Rationale: Constrained complexity improves maintainability and onboarding speed.

## Engineering Standards

- Project artifacts MUST remain internally consistent:
	- Spec defines outcomes and acceptance criteria.
	- Plan defines technical approach and constitution gates.
	- Tasks define actionable, file-scoped execution steps.
- Placeholders and unresolved tokens MUST NOT remain in finalized governance,
	planning, or execution artifacts.
- Date fields in governance artifacts MUST use ISO format `YYYY-MM-DD`.
- Repository documentation (README, specs, plans, contracts, and operational
	instructions) MUST be written in English. Public website content may use a
	different language when required by the feature specification.

## Workflow and Quality Gates

- Constitution Check is a mandatory gate in planning and MUST be re-evaluated
	after design decisions are captured.
- User stories are the default unit of implementation and validation; each story
	MUST be independently testable.
- Pull request review MUST verify:
	- Requirement traceability.
	- Test evidence for changed behavior.
	- No unresolved governance conflicts.

## Governance

This constitution supersedes local workflow preferences when conflicts arise.
Amendments MUST include: (1) proposed diff, (2) rationale, (3) impacted
templates/commands, and (4) version bump rationale under semantic versioning.

Versioning policy:
- MAJOR: Removing or redefining a core principle in a backward-incompatible way.
- MINOR: Adding a principle/section or materially expanding mandatory guidance.
- PATCH: Clarifications, wording improvements, and non-semantic refinements.

Compliance review expectations:
- Every plan and task generation cycle MUST be checked against this document.
- Violations MUST be resolved before merge or tracked with approved exception
	documentation including owner and expiry date.

**Version**: 1.0.0 | **Ratified**: 2026-07-20 | **Last Amended**: 2026-07-20
