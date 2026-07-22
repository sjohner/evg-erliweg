# Design System Contract: Component API & Styling Guarantees

**Feature**: GitHub-Inspired Design Modernization (003)

**Date**: 2026-07-22

**Objective**: Define the contracts between the design system and implementation—what styling guarantees each component must provide, what markup patterns are expected, and how components should behave under various conditions.

## Component Contract Overview

All components in this design system must satisfy these contracts to maintain consistency, accessibility, and performance across the website.

### Button Component Contract

**Purpose**: Call-to-action element for user actions (submit, navigate, toggle)

**Markup Requirement**:
```html
<button class="btn btn--primary" aria-label="Descriptive label">
  Action Label
</button>
```

**CSS Classes Required**:
- `.btn` — Base button styles
- `.btn--primary` — Blue accent styling (0969DA)
- `.btn--secondary` — Optional alternative styling (subtle border, no fill)
- `.btn--small` / `.btn--medium` / `.btn--large` — Size variants

**Styling Guarantees**:
- Height: 40px (medium, default)
- Padding: 16px horizontal, 12px vertical
- Border radius: 4px
- Font size: 14px, weight 600
- Cursor: `pointer` on hover
- Focus indicator: 2px blue ring, offset 2px

**Behavior Contract**:
- Hover state: Darker blue background (#0860CA)
- Focus state: Blue focus ring visible
- Disabled state: Gray background (#D1D9E0), cursor `not-allowed`, opacity 0.6
- No animation on click (unless intentional feedback)

**Accessibility Requirements**:
- Keyboard accessible (Tab, Space/Enter to activate)
- ARIA label if icon-only: `aria-label="Close"` for icon buttons
- Focus indicator always visible in all states
- Touch target: Minimum 44px (mobile)

---

### Card Component Contract

**Purpose**: Container for grouped content (data visualization, metadata, content sections)

**Markup Requirement**:
```html
<article class="card">
  <h3 class="card__title">Card Title</h3>
  <p class="card__body">Card content</p>
</article>
```

**CSS Classes Required**:
- `.card` — Base card styles
- `.card__title` — Card heading
- `.card__body` — Card content area

**Styling Guarantees**:
- Background: White (#FFFFFF)
- Border: 1px solid #D1D9E0
- Border radius: 6px
- Padding: 16px (small), 24px (large)
- Shadow: None (default), subtle shadow on hover (0 1px 3px rgba(0,0,0,0.1))

**Hover Behavior**:
- Border color shifts to #C6CED3 (slightly darker)
- Shadow becomes visible (subtle lift effect)
- Transition: 200ms ease-out

**Accessibility Requirements**:
- Proper heading hierarchy inside card (H2, H3, or H4 depending on context)
- Content is semantically marked (`<h3>`, `<p>`, `<ul>`, etc.)
- If card is interactive, `role="button"` with `tabindex="0"` and keyboard handler

---

### Navigation Component Contract

**Purpose**: Sticky header with site navigation, visible on all pages

**Markup Requirement**:
```html
<nav class="navbar" aria-label="Main navigation">
  <a href="/" class="navbar__logo">Logo/Title</a>
  <ul class="navbar__menu">
    <li><a href="/about.html">About</a></li>
    <li><a href="/history.html">History</a></li>
    <li><a href="/data.html">Data</a></li>
  </ul>
</nav>
```

**CSS Classes Required**:
- `.navbar` — Nav container (sticky positioning)
- `.navbar__logo` — Logo/home link
- `.navbar__menu` — Menu list
- `.navbar__item` — Individual menu item
- `.navbar__link` — Navigation link

**Styling Guarantees**:
- Background: White (#FFFFFF)
- Border bottom: 1px #D1D9E0
- Height: 64px (includes padding)
- Position: `fixed` (sticky at top)
- Z-index: 1000 (above page content)

**Link Styling**:
- Default: Text #24292F, no underline
- Hover: Blue accent (#0969DA) with underline
- Focus: Blue focus ring (2px, offset 2px)
- Active (current page): Blue color + underline

**Responsive Breakpoints**:
- Desktop (1024px+): All links visible horizontally
- Tablet (768px–1023px): Links may wrap; navigation stack adjusts
- Mobile (< 768px): Hamburger menu optional (links can be vertical stack if space permits)

**Accessibility Requirements**:
- Keyboard navigation: Tab through all links
- Skip link: Optional "Skip to main content" at very top
- `aria-current="page"` on active link
- `aria-label="Main navigation"` on `<nav>`

---

### Form Elements Contract

**Purpose**: User input components (text fields, checkboxes, radio buttons, select dropdowns)

#### Text Input

**Markup Requirement**:
```html
<label for="input-id">Label Text</label>
<input id="input-id" type="text" class="form-control" placeholder="Hint text" />
```

**Styling Guarantees**:
- Border: 1px #D1D9E0
- Border radius: 4px
- Padding: 8px 12px
- Font size: 16px (prevents iOS zoom on focus)
- Background: White (#FFFFFF)
- Focus: Blue focus ring (2px), border → blue accent

**Placeholder Styling**:
- Color: #57606A (secondary text)
- Font style: Normal (not italic)

**Disabled State**:
- Background: #F6F8FA (light gray)
- Border: #D1D9E0 (unchanged)
- Cursor: `not-allowed`
- Opacity: 0.6

#### Checkbox & Radio

**Markup Requirement**:
```html
<input id="check-id" type="checkbox" class="form-checkbox" />
<label for="check-id">Option label</label>
```

**Sizing**:
- Size: 16px × 16px (meets 44px touch target when including label)
- Border: 2px (when unchecked)
- Border color: #D1D9E0

**Checked State**:
- Background: #0969DA (blue accent)
- Checkmark: White
- Border: 2px #0969DA

**Focus State**:
- Focus ring: 2px blue, offset 2px

---

### Typography Contract

**Purpose**: Ensure consistent text styling across all pages

**Markup Requirements**:
```html
<h1>Page Title</h1>        <!-- 32px desktop, 24px mobile, weight 600 -->
<h2>Section Heading</h2>  <!-- 24px desktop, 20px mobile, weight 600 -->
<p>Paragraph text</p>      <!-- 16px, weight 400, line-height 1.6 -->
<small>Caption</small>     <!-- 12px, secondary color -->
```

**Font Stack Contract**:
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
```

**Size & Line-Height Guarantees**:
- H1: 32px / 1.2 line-height (desktop), 24px (mobile)
- H2: 24px / 1.3 line-height (desktop), 20px (mobile)
- Body: 16px / 1.6 line-height
- Small: 12px / 1.5 line-height

**Color Contract**:
- Primary: #24292F (H1, H2, body text)
- Secondary: #57606A (subtext, labels, metadata)
- Links: #0969DA (default), darken on hover

---

### Responsive Layout Contract

**Purpose**: Ensure layouts adapt correctly across device sizes

**Breakpoint Definitions**:

| Breakpoint | Width | Grid Columns | Gutters | Usage |
|-----------|-------|---|---|---|
| Mobile | < 768px | 1–2 | 16px | Phones |
| Tablet | 768px–1023px | 4 | 24px | Tablets |
| Desktop | ≥ 1024px | 12 | 24px | Desktops |

**Layout Guarantees**:
- No horizontal scrolling at any breakpoint
- Content centered with safe margins on mobile
- Images scale responsively (max-width: 100%)
- Grid gaps remain proportional to device size

**Responsive Typography**:
- H1: Scale down on mobile (32px → 24px)
- H2: Scale down on mobile (24px → 20px)
- Body: Fixed at 16px minimum (prevent mobile zoom)
- Never scale text below 14px on mobile

---

### Accessibility Contract (WCAG AAA)

**Purpose**: Guarantee WCAG AAA compliance across all components

**Color Contrast Guarantees**:
- All text vs. background: 7:1 minimum (normal text)
- Large text: 4.5:1 minimum
- Interactive elements: 9.2:1 (blue accent #0969DA on white)
- All text on light backgrounds uses dark text

**Keyboard Navigation Contract**:
- Tab order: Logical (left→right, top→bottom)
- All interactive elements: Keyboard accessible (Enter/Space for buttons, Tab for navigation)
- Focus indicator: Always visible (2px blue ring, offset 2px minimum)
- Focus outline: Never hidden (even in `:focus-visible`)

**Semantic HTML Contract**:
- Heading hierarchy: H1 (once per page) → H2 → H3 (no skips)
- Form labels: Every input has `<label for="id">` or `aria-label`
- Landmarks: Pages include `<header>`, `<nav>`, `<main>`, `<footer>`
- Lists: Use `<ul>`, `<ol>` for list content (not divs)

**ARIA Contract**:
- Navigation: `aria-label="Main navigation"` on `<nav>`
- Active page: `aria-current="page"` on current link
- Alerts: `role="alert"` on error/status messages
- Live regions: `aria-live="polite"` for async updates
- Icon buttons: `aria-label` for accessibility

**Images & Media**:
- All images: Descriptive alt text (or `alt=""` + `aria-hidden="true"` for decorative)
- Charts/data viz: `<figcaption>` or `aria-describedby` linking to description
- No auto-play media
- No flashing content (> 3 flashes/second)

---

### Performance Contract

**Purpose**: Guarantee performance targets are met

**Bundle Size Limits**:
- CSS: < 50 KB (minified)
- JavaScript: No new scripts (existing logic unmodified)
- Total assets: < 100 KB

**Page Load Targets (Google PageSpeed 100)**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization Guarantees**:
- System font stack (no web fonts, zero network latency)
- Image lazy loading (`loading="lazy"` attribute)
- CSS-only animations (GPU-accelerated)
- No layout shifts on load (images must have intrinsic size or fixed dimensions)

---

### Error & Loading State Contract

**Purpose**: Define consistent styling for asynchronous operations

**Loading State**:
- Visual: Skeleton screen (placeholder boxes, light gray #E1E4E8)
- Animation: Subtle pulse (fade-in/out, 1.5s cycle, max 40% opacity change)
- Screen reader: `aria-busy="true"` or `aria-label="Loading..."`
- Never blocks user interaction (can dismiss or navigate away)

**Error State**:
- Visual: Styled message box with left border (3px, error color)
- Background: Optional light background (very subtle)
- Icon: Optional warning icon (semantic, not decorative)
- Text: Clear, actionable error message (primary text color)
- Recovery: Optional "Retry" button (blue accent)
- Screen reader: `role="alert"` to announce immediately

---

## Validation Checklist

Every implementation must verify:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets 7:1 minimum (WCAG AAA)
- [ ] No horizontal scrolling at any viewport size
- [ ] Images have descriptive alt text or are marked decorative
- [ ] Typography scale respected (no arbitrary sizes)
- [ ] Spacing follows 8px grid system
- [ ] Components use semantic HTML tags
- [ ] Form labels associated with inputs
- [ ] Sticky navigation doesn't obscure content
- [ ] Page load < 2s on 4G (target)
- [ ] No unauthorized animations (check prefers-reduced-motion)

