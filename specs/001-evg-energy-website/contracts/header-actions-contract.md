# Header Actions Contract

## Purpose
Define the observable placement, navigation, responsive, and accessibility behavior of controls in the site header.

## Repository Link
- Element: Semantic anchor targeting `https://github.com/sjohner/evg-erliweg`.
- Position: Immediately before the dark-mode toggle in document and visual order.
- Presentation: Icon-only GitHub mark using the current theme text color; no visible text label.
- Accessible name: A concise German label that identifies the destination as the project's GitHub repository.
- Icon semantics: Decorative and excluded from the accessibility tree.

## Interaction
- The repository action MUST be reachable and activatable with keyboard and pointer input.
- Focus MUST remain visibly indicated using the shared focus-visible treatment.
- The hit target MUST be at least 44 by 44 CSS pixels.
- Native link behavior MUST remain available without JavaScript.

## Responsive And Theme Behavior
- The repository link MUST remain immediately left of the theme toggle at supported desktop and mobile widths.
- The website title MUST remain left-aligned while the two controls remain right-aligned together on the same horizontal level.
- Both controls MUST retain equal 44 by 44 CSS pixel targets; secondary header context MAY be omitted at constrained mobile widths to preserve the single-row layout.
- The two controls MUST NOT overlap, cause horizontal page overflow, or change order.
- The icon and focus indicator MUST remain perceivable in both light and dark modes.

## Failure Boundary
The website provides navigation to the public repository. GitHub and repository availability are external concerns and MUST NOT be simulated or handled by the static site.

## Requirement Traceability
- Acceptance scenarios: User Story 1 scenarios 5 and 6
- Functional requirement: FR-025
- Success criterion: SC-010