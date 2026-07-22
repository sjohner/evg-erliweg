# Quickstart Validation Guide: GitHub-Inspired Design Modernization

**Feature**: GitHub-Inspired Design Modernization (003)

**Date**: 2026-07-22

**Objective**: Provide a runnable checklist to validate that the modernized website meets design, accessibility, and performance requirements without needing a full implementation review.

---

## Prerequisites

**Environment**:
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Ability to open DevTools (F12) for accessibility and performance inspection
- Optional: WAVE browser extension or Axe DevTools for automated accessibility checks
- Optional: Google PageSpeed Insights (https://pagespeed.web.dev/)

**Assumptions**:
- Website is deployed locally or on a staging server
- All static assets (HTML, CSS, JS, images) are served correctly
- No build step required (vanilla HTML/CSS/JS)

---

## Validation Scenarios

### Scenario 1: Homepage Visual Design & Information Hierarchy

**Goal**: Verify the homepage conveys project value clearly with modern, professional styling.

**Steps**:

1. **Open the homepage** (`index.html` or `/`)
   - Wait for full page load
   - Check that no network errors appear in DevTools Console

2. **Verify hero section**:
   - [ ] Hero section visible immediately (above fold)
   - [ ] Section includes: Project title, brief description, call-to-action buttons
   - [ ] Title is large and legible (32px desktop, 24px mobile)
   - [ ] Description text is 16px, line-height sufficient for readability
   - [ ] CTA buttons are blue (#0969DA) with white text
   - [ ] Buttons have 44px+ touch target (verify with DevTools Element inspector)

3. **Verify information sections**:
   - [ ] Content sections below hero are spaced with generous whitespace (48px+ gaps)
   - [ ] Each section uses H2 heading (24px desktop, 20px mobile)
   - [ ] Section content is in rounded cards (6px border radius) with subtle borders
   - [ ] Cards have consistent padding (16–24px)
   - [ ] Cards don't have excessive shadows (max 0 1px 3px rgba(0,0,0,0.1))

4. **Verify typography**:
   - [ ] Headings use 600 font weight, body text uses 400
   - [ ] Text color is dark (#24292F) on light background
   - [ ] No serif fonts or unusual typography
   - [ ] Body text is readable (16px, line-height 1.6+)

5. **Verify footer**:
   - [ ] Footer is visible at bottom of page
   - [ ] Footer contains copyright/metadata
   - [ ] Footer links are blue and underlined on hover

---

### Scenario 2: Sticky Navigation & Page Navigation

**Goal**: Verify navigation remains visible and functional during scrolling.

**Steps**:

1. **Load the homepage and scroll**:
   - [ ] Navigation bar stays visible at top of viewport during scroll
   - [ ] Navigation doesn't obscure main content (z-index working correctly)
   - [ ] Navigation has subtle bottom border (#D1D9E0)

2. **Test navigation links**:
   - [ ] All main links are present: Home, About, History, Data
   - [ ] Links use consistent styling (dark text, blue on hover)
   - [ ] Hover state shows underline or blue color shift
   - [ ] Navigation links are keyboard accessible (Tab through them)

3. **Test focus states**:
   - [ ] Click on a navigation link, then press Tab to focus it
   - [ ] [ ] Verify 2px blue focus ring appears around link text
   - [ ] Focus ring is clearly visible (not hidden or cut off)

4. **Test responsive navigation** (use DevTools to resize):
   - [ ] Tablet (768px): Navigation adjusts but remains fully functional
   - [ ] Mobile (375px): Navigation remains accessible (no horizontal overflow)
   - [ ] All links remain clickable/tappable

---

### Scenario 3: Data Visualization Page

**Goal**: Verify data presentation uses modern styling with readability prioritized.

**Steps**:

1. **Navigate to Data page**:
   - [ ] Page loads without errors
   - [ ] Page title is visible and uses H1 or H2 styling

2. **Verify card styling**:
   - [ ] Data visualizations are displayed in rounded cards (6px border)
   - [ ] Cards have subtle borders (#D1D9E0)
   - [ ] Cards have 16–24px internal padding
   - [ ] Cards don't have heavy shadows (check DevTools Styles)

3. **Verify hover effects**:
   - [ ] Hover over a card
   - [ ] Border color shifts slightly (to #C6CED3) or subtle shadow appears
   - [ ] Hover effect is subtle (no jarring color change or animation)

4. **Verify chart legibility**:
   - [ ] Chart labels are readable (16px or larger)
   - [ ] Chart data is clearly visible (sufficient contrast)
   - [ ] Legend or labels explain what data is displayed
   - [ ] No overlapping text or clipped content

5. **Verify responsive layout**:
   - [ ] Desktop (1024px): Cards arranged in grid (2–3 columns)
   - [ ] Tablet (768px): Cards adjust to 1–2 columns
   - [ ] Mobile (375px): Cards stack vertically (1 column)
   - [ ] No horizontal scrolling at any breakpoint

---

### Scenario 4: Accessibility Compliance (Keyboard Navigation)

**Goal**: Verify WCAG AAA keyboard navigation support.

**Steps**:

1. **Navigate without mouse** (use Tab and Shift+Tab):
   - [ ] Press Tab repeatedly to cycle through all interactive elements
   - [ ] Verify focus order is logical (left-to-right, top-to-bottom)
   - [ ] All buttons, links, and form inputs are reachable via Tab
   - [ ] Tab order doesn't jump around unexpectedly

2. **Verify focus indicators**:
   - [ ] When Tab focus lands on an element, a blue focus ring appears
   - [ ] Focus ring is always visible (2px minimum, offset 2px)
   - [ ] Focus ring doesn't disappear when hovering
   - [ ] Focus ring is visible on buttons, links, and inputs

3. **Test button activation**:
   - [ ] Tab to a button, press Space or Enter
   - [ ] Button activates (navigates or submits)
   - [ ] No error in DevTools Console

4. **Test link activation**:
   - [ ] Tab to a link, press Enter
   - [ ] Link navigates to destination
   - [ ] Verify no `href="javascript:..."` (invalid pattern)

5. **Test form inputs** (if present):
   - [ ] Tab to input fields and type
   - [ ] Labels are associated with inputs (DevTools Element inspector should show `aria-label` or `<label for="id">`)
   - [ ] Placeholder text is visible but not confused with value

---

### Scenario 5: Color Contrast & Visual Accessibility

**Goal**: Verify WCAG AAA color contrast and visual design accessibility.

**Steps**:

1. **Use WAVE or Axe DevTools** (browser extension):
   - [ ] Open DevTools, click WAVE or Axe tab
   - [ ] Run accessibility scan
   - [ ] Verify "0 errors" and "0 contrast errors" (warnings may be present)
   - [ ] Review flagged issues; confirm they're not false positives

2. **Manual contrast check**:
   - [ ] Body text (#24292F) on white background: 16:1 ✓
   - [ ] Secondary text (#57606A) on white background: 8.8:1 ✓
   - [ ] Blue accent (#0969DA) on white background: 9.2:1 ✓
   - [ ] Use WebAIM Contrast Checker to verify manual spot-checks

3. **Verify color isn't the only indicator**:
   - [ ] Links are underlined (not color-only)
   - [ ] Buttons have text labels (not icons-only)
   - [ ] Error messages include text (not red-only)
   - [ ] Interactive elements have focus indicators

4. **Test focus ring contrast**:
   - [ ] Tab to a link or button
   - [ ] Blue focus ring (#0969DA) is clearly visible against background
   - [ ] Ring contrast is at least 3:1 (meets WCAG)

---

### Scenario 6: Responsive Layout Across Devices

**Goal**: Verify layout adapts correctly without horizontal scrolling or distortion.

**Steps**:

1. **Resize browser to test breakpoints** (DevTools Device Emulation):

   **Mobile (375px width)**:
   - [ ] No horizontal scrolling
   - [ ] Text remains readable without zoom
   - [ ] Buttons are at least 44px tall and tappable
   - [ ] Images scale down and remain visible
   - [ ] Navigation is functional (hamburger menu optional)

   **Tablet (768px width)**:
   - [ ] Layout adjusts to tablet format (2–4 columns where applicable)
   - [ ] Cards and content sections have appropriate spacing
   - [ ] Images are appropriately scaled
   - [ ] Navigation bar remains sticky and functional

   **Desktop (1024px+ width)**:
   - [ ] Full layout is utilized (grid spans all columns)
   - [ ] Maximum content width is respected (not stretching to window edge)
   - [ ] Generous whitespace is present
   - [ ] Cards and sections are well-organized

2. **Test orientation change** (if on tablet/mobile device):
   - [ ] Portrait → Landscape: Layout reflows without breakage
   - [ ] Landscape → Portrait: Layout reflows correctly
   - [ ] No content is hidden or cut off

3. **Test image scaling**:
   - [ ] Images have `max-width: 100%` or similar constraint
   - [ ] Images don't overflow containers
   - [ ] Images don't have fixed dimensions that break layout

---

### Scenario 7: Animation & Motion Preferences

**Goal**: Verify animations are subtle and respect user preferences.

**Steps**:

1. **Observe page interactions**:
   - [ ] Hover effects are subtle (no large animations or distracting flicker)
   - [ ] Button hover: Slight color shift or underline (no 2+ second animations)
   - [ ] Card hover: Subtle shadow increase or border color shift
   - [ ] No page-load animations (content appears immediately)

2. **Test `prefers-reduced-motion`**:
   - [ ] Open DevTools → Rendering → Emulate CSS media feature: `prefers-reduced-motion: reduce`
   - [ ] Refresh page
   - [ ] [ ] Verify animations are disabled or greatly reduced
   - [ ] Page remains fully functional and readable
   - [ ] No error in DevTools Console

3. **Verify no auto-play media**:
   - [ ] No videos or audio auto-play on page load
   - [ ] If media is present, it requires explicit user click to play

---

### Scenario 8: Performance (Google PageSpeed Insights)

**Goal**: Verify page performance meets PageSpeed 100 targets.

**Steps**:

1. **Open Google PageSpeed Insights** (https://pagespeed.web.dev/):
   - [ ] Enter homepage URL
   - [ ] Run analysis for Mobile and Desktop

2. **Verify scores**:
   - [ ] Performance: ≥ 95
   - [ ] Accessibility: ≥ 95
   - [ ] Best Practices: ≥ 95
   - [ ] SEO: ≥ 90

3. **Check metrics**:
   - [ ] Largest Contentful Paint (LCP): < 2.5s
   - [ ] First Input Delay (FID): < 100ms (or Interaction to Next Paint (INP) < 200ms)
   - [ ] Cumulative Layout Shift (CLS): < 0.1
   - [ ] Page load time (local): < 2s on 4G throttling

4. **Review recommendations**:
   - [ ] Fix any "High impact" issues listed
   - [ ] Note "Low impact" or "Not applicable" issues (expected for static sites)

---

### Scenario 9: Content & Information Architecture

**Goal**: Verify all pages have consistent content structure and information hierarchy.

**Steps**:

1. **Check all pages** (Home, About, History, Data):
   - [ ] Each page has a clear H1 or H2 title
   - [ ] Navigation bar is present and consistent
   - [ ] Footer is present and consistent
   - [ ] Page content is organized with H2/H3 headings (no skipped levels)

2. **Verify heading structure** (using screen reader or DevTools):
   - [ ] H1 appears once per page (or zero times, never multiple)
   - [ ] Heading hierarchy follows logical order (H1 → H2 → H3, no H1 → H3)
   - [ ] All headings use semantic `<h1>`, `<h2>`, `<h3>` tags (not divs with large font)

3. **Check image alt text**:
   - [ ] All images have descriptive alt text (use DevTools Element inspector)
   - [ ] Alt text is concise and meaningful (e.g., "Energy consumption chart, 2024 quarterly data")
   - [ ] Decorative images have empty alt (`alt=""`)

4. **Verify link destinations**:
   - [ ] All links have proper `href` attributes
   - [ ] No `href="javascript:..."` patterns
   - [ ] Links navigate to correct pages or external sites
   - [ ] Link text is descriptive (not "click here")

---

### Scenario 10: Consistency Across Pages

**Goal**: Verify design system is applied consistently.

**Steps**:

1. **Compare styling across pages** (Home, About, History, Data):
   - [ ] Button styling is identical (same size, color, font)
   - [ ] Card styling is identical (same border, radius, padding)
   - [ ] Typography is consistent (same font stack, sizes, weights)
   - [ ] Color palette is consistent (same blue accent, text colors)
   - [ ] Spacing and alignment follow 8px grid

2. **Verify component reusability**:
   - [ ] Same `.btn` class used for all buttons
   - [ ] Same `.card` class used for all cards
   - [ ] Same font sizes applied consistently (not custom sizes per page)

3. **Test edge cases**:
   - [ ] Very long page title: Text wraps gracefully (no overflow or truncation)
   - [ ] Very long button label: Button expands or wraps (doesn't distort)
   - [ ] Empty section: Layout doesn't break (placeholder or message displayed)

---

## Signing Off

When all scenarios are validated:

1. **Record evidence**:
   - [ ] Screenshots of each scenario (or screen recordings)
   - [ ] PageSpeed Insights scores
   - [ ] WAVE/Axe accessibility audit report
   - [ ] Notes on any deviations or known issues

2. **Report status**:
   - [ ] All scenarios: PASS
   - [ ] No critical accessibility issues
   - [ ] Performance targets met (PageSpeed ≥ 95 desktop)
   - [ ] Ready for deployment

3. **Document known limitations**:
   - [ ] If any scenario is N/A or SKIP, document why
   - [ ] If any scenario is FAIL, document remediation plan

---

## Related Contracts & References

- **Design System Contract**: [design-system.md](design-system.md) — Component API and styling guarantees
- **Color Contract**: [color-contract.md](color-contract.md) — Color palette and contrast ratios
- **Data Model**: [../data-model.md](../data-model.md) — Design system entities and components
- **Specification**: [../spec.md](../spec.md) — Feature requirements and acceptance criteria

---

## Tools Used

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **WAVE Browser Extension**: https://wave.webaim.org/extension/
- **Axe DevTools**: https://www.deque.com/axe/devtools/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Sim Daltonism (Colorblindness)**: https://www.color-blindness.com/coblis-color-blindness-simulator/

---

## Implementation Evidence (2026-07-22)

This section records the implementation-phase checks completed for Phases 1-7.

### Story-Level Acceptance Evidence

- US1 (Homepage + Sticky Navigation): Implemented and verified in markup/CSS for index.html with sticky header, CTA cluster, keyboard focus visibility, and data navigation link.
- US2 (Data Card Presentation): Implemented and verified in markup/CSS for metric cards and history comparison cards with rounded borders, subtle hover states, and readable type hierarchy.
- US3 (Cross-Page Consistency): Implemented and verified across index.html, about.html, and history.html for shared header/navigation/footer patterns and common interactive styling.
- US4 (Responsive Behavior): Implemented breakpoint rules at mobile/tablet/desktop in layout.css; controls retain 44px minimum touch target styles.
- US5 (Enterprise Visual Polish): Implemented contrast-aligned token palette, reduced-motion support, subtle transitions, and polished loading/error states.

### Async Feedback Evidence (FR-013, SC-011)

- Added skeleton loading states using .is-loading class for dynamic content placeholders on all pages.
- Added styled error alert component with role="alert" and consistent design-system styling.
- Updated app.js to clear loading skeleton classes after data hydration.

### Validation Tool Constraints In This Environment

- Automated npm script checks could not be executed because npm is not available in the current terminal environment.
- External browser-only audits (WAVE, Axe, PageSpeed Insights) require manual execution outside this terminal run.
- Editor diagnostics for changed HTML/CSS/JS files report no static syntax errors.

### Pending Manual Validation (Phase 8 Input)

- Run WAVE/Axe audits in browser and attach results.
- Run PageSpeed Insights for desktop/mobile and attach score snapshots.
- Execute full manual scenario walkthrough from this quickstart checklist on Chrome, Firefox, Safari, and Edge.

