# Research: EVG Erliweg Energy Transparency Website

## Decision 1: Hosting and publication model
- Decision: Publish as a static site on GitHub Pages, triggered when a maintainer pushes site or data changes directly to `main`.
- Rationale: Matches the requirement to publish on GitHub Pages, supports immutable deployment history, and keeps operations lightweight.
- Alternatives considered:
  - Manual file upload to hosting: rejected due to weaker repeatability.
  - Dynamic backend hosting: rejected as unnecessary complexity for mostly read-only content.

## Decision 2: Data update approach
- Decision: Use a repository-managed JSON data file (`data/energy-data.json`) as the canonical quarterly source.
- Rationale: Aligns with direct data-file updates in the public repository and enables transparent change tracking.
- Alternatives considered:
  - YAML as canonical source: viable, but JSON chosen for native browser compatibility and simpler validation.
  - In-site admin UI: rejected by clarified requirement.

## Decision 3: Simplified quarterly publish flow
- Decision: Keep the quarterly data update process minimal: update
  `data/energy-data.json`, push directly to `main`, and deploy through the
  existing workflow. If a number issue is discovered after publish, fix forward
  with a follow-up push.
- Rationale: Single-maintainer operation makes formal review overhead
  unnecessary; fix-forward keeps operation simple while preserving full git
  history.
- Alternatives considered:
  - Manual review gate before publication: rejected as unnecessary overhead for the
    current team setup.
  - CI schema and semantic validation gate: rejected as unnecessary complexity
    for a small quarterly update process.

## Decision 4: About and contact content
- Decision: Provide clear static about/learn-more content describing EVG Erliweg
  and elektraeigenstrom, plus a static contact channel such as an email or
  external form link without introducing an in-site submission workflow.
- Rationale: Meets FR-009 through FR-011 while preserving static architecture.
- Alternatives considered:
  - Custom server-side contact processing: rejected as out of scope for static-first design.
  - No contact mechanism: rejected because requirement explicitly mandates contact
    path.

## Decision 4a: Contact request scope
- Decision: Treat contact as outbound navigation through `ContactChannel`; do
  not model or persist an in-site `ContactRequest`.
- Rationale: The specification requires visible, actionable contact details but
  defines no message-submission, validation, storage, or processing workflow.
- Alternatives considered:
  - Add a custom contact form and backend: rejected as unsupported scope and
    unnecessary complexity for the static site.

## Decision 5: History and cumulative calculations
- Decision: Compute quarter, year, and cumulative summaries in client-side JavaScript from the canonical quarterly dataset.
- Rationale: Maintains single source of truth and supports deterministic historical views.
- Alternatives considered:
  - Pre-compute all summaries manually in data file: rejected as error-prone and redundant.
  - Backend aggregation API: rejected as unnecessary complexity.

## Decision 6: Visual design strategy
- Decision: Build a modern but simple responsive UI with CSS custom properties, system preference dark mode, and user toggle persistence.
- Rationale: Meets usability goals and dark mode requirement using vanilla CSS/JS.
- Alternatives considered:
  - CSS framework-driven theme system: rejected to satisfy "vanilla as much as possible".

## Decision 7: Website language
- Decision: Use German as the default and required language for all primary
  on-site content.
- Rationale: Matches clarified stakeholder requirement and target audience
  context in Fraubrunnen, Switzerland.
- Alternatives considered:
  - Multilingual first release: rejected to keep implementation simple and
    focused on core transparency features.

## Decision 8: Accessibility standard
- Decision: Treat WCAG 2.1 AA as a release gate for core pages and key user
  interactions.
- Rationale: Satisfies explicit accessibility requirement and reduces usability
  barriers across devices and assistive technologies.
- Alternatives considered:
  - WCAG A-only target: rejected as insufficient quality bar.
  - Post-release accessibility hardening: rejected because accessibility is a
    core acceptance criterion.

## Decision 9: Performance quality gate
- Decision: Enforce Google PageSpeed Insights performance score >=95 for each
  core page in production configuration.
- Rationale: Establishes a measurable, transparent performance target aligned
  with stakeholder expectation.
- Alternatives considered:
  - Lower threshold (>=90): rejected because requirement specifies >=95.
  - Homepage-only threshold: rejected because all primary pages must remain
    consistently performant.

## Decision 10: GitHub repository header action
- Decision: Add a semantic icon-only anchor for the canonical repository URL
  immediately before the theme-toggle button in the existing header actions.
  Use an inline GitHub mark, current theme color, a German accessible name, and
  the existing 44px icon-control and focus-visible patterns. Keep the website
  title left-aligned and the two equal-sized actions right-aligned on one row at
  all supported widths; omit secondary header context on constrained mobile
  widths when needed to preserve that alignment.
- Rationale: A direct anchor works without JavaScript, preserves expected link
  behavior, adds no runtime dependency, and satisfies FR-025 and SC-010 across
  pointer, keyboard, light/dark theme, and responsive use.
- Alternatives considered:
  - Load an icon library: rejected because one icon does not justify a new
    dependency or its performance cost.
  - Use a text label in the header: rejected because the requirement calls for
    an icon and compact placement beside the theme toggle.
  - Stack or center the actions below the title on mobile: rejected because it
    breaks the required left-title/right-actions relationship and increases
    sticky-header height.
  - Open the repository through JavaScript: rejected because native anchor
    semantics are simpler and more accessible.

## Clarification Resolution Summary
All major technical unknowns are resolved with no remaining `NEEDS CLARIFICATION` markers required for planning.
