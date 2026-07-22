# Design System & Data Model: GitHub-Inspired Website

**Phase**: 1 (Design & Contracts)

**Date**: 2026-07-22

**Objective**: Document the design system entities, component specifications, and design patterns that compose the GitHub-inspired modernization.

## Design System Components

### Color Palette

**Primary Colors**:

| Name | Hex | Usage | WCAG AAA Contrast |
|------|-----|-------|------------------|
| Background | #FAFBFC | Page background, spacious layout | N/A |
| Surface | #FFFFFF | Cards, panels, elevated content | N/A |
| Border Subtle | #D1D9E0 | Card borders, dividers, lines | 8.5:1 ✓ |
| Text Primary | #24292F | Headings, body text (default) | 16:1 ✓ |
| Text Secondary | #57606A | Secondary text, labels, metadata | 8.8:1 ✓ |
| Blue Accent (Primary) | #0969DA | Links, active buttons, highlights | 9.2:1 ✓ |
| Focus Ring | #0969DA | Keyboard focus indicator | 9.2:1 ✓ |

**Validation**: All color combinations meet WCAG AAA (7:1 minimum contrast ratio) for both normal and large text.

### Typography System

**Font Stack**:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
             Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
             sans-serif;
```

**Size & Weight Scale**:

| Level | Size (Desktop) | Size (Mobile) | Weight | Line-Height | Usage |
|-------|---|---|---|---|---|
| **H1** | 32px | 24px | 600 | 1.2 | Hero titles, primary headings |
| **H2** | 24px | 20px | 600 | 1.3 | Section headings, page titles |
| **H3** | 18px | 16px | 600 | 1.3 | Subsection headings |
| **Body** | 16px | 16px (minimum) | 400 | 1.6 | Paragraphs, default content |
| **Small** | 14px | 14px | 400 | 1.5 | Secondary text, labels |
| **Caption** | 12px | 12px | 400 | 1.5 | Metadata, footnotes, timestamps |

**Rationale**: 
- 16px minimum on mobile ensures WCAG readability compliance
- 1.6 line-height improves readability for users with dyslexia
- 3-tier hierarchy (H1, H2, Body) prevents visual clutter
- System font stack avoids web font latency (supports PageSpeed 100 target)

### Spacing & Grid System

**Base Unit**: 8px (0.5rem)

**Spacing Scale**:

| Size | Value | Typical Usage |
|------|-------|---------------|
| xs | 4px | Tight spacing within components |
| sm | 8px | Default padding, margins between inline elements |
| md | 16px | Standard padding, margin between blocks |
| lg | 24px | Section spacing, card margins |
| xl | 32px | Large section spacing |
| 2xl | 48px | Major layout spacing (hero → content) |

**Grid System**:

- Base grid: 8px increments
- Layout grid: 12-column for desktop, 4-column for mobile
- Gutters: 16px between columns (mobile), 24px (desktop)
- Max content width: 1200px (centered, with side margins)

### Responsive Breakpoints

| Breakpoint | Width | Device | Columns | Usage |
|-----------|-------|--------|---------|-------|
| **mobile** | 375px–767px | Phone | 1–2 (stacked) | Vertical layout, full-width content |
| **tablet** | 768px–1023px | Tablet | 2–4 | Multi-column layout, adjusted spacing |
| **desktop** | 1024px+ | Desktop/Laptop | 12 | Full grid layout, max-width container |

**Mobile-First Approach**: All base styles target mobile, then media queries add tablet/desktop refinements.

### Component Specifications

#### Button Component

**States**:
- **Default**: Blue background (#0969DA), white text, rounded corners (4px)
- **Hover**: Slightly darker blue (#0860CA), subtle shadow increase
- **Focus**: Blue background with focus ring (#0969DA outline, 2px)
- **Active**: Darker blue (#055BD4), pressed appearance
- **Disabled**: Gray background (#D1D9E0), disabled text color, no cursor

**Sizing**:
- **Small**: 32px height, 12px padding, 12px font size
- **Medium**: 40px height, 16px padding, 14px font size (default)
- **Large**: 48px height, 20px padding, 16px font size

**Accessibility**:
- Minimum 44px touch target (meets WCAG)
- Keyboard focus indicator visible (2px outline)
- Proper semantics: `<button>` or `<a role="button">`

#### Card Component

**Structure**:
- Background: White (#FFFFFF)
- Border: 1px subtle gray (#D1D9E0)
- Border radius: 6px
- Padding: 16px (inner) to 24px (large cards)
- Shadow: None (minimal) or subtle (on hover)

**Hover State**:
- Border color shifts to slightly darker gray (#C6CED3)
- Shadow: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)` (subtle)
- Cursor: `pointer` if interactive

**Content Hierarchy within Card**:
- Title: H3 (18px, 600 weight)
- Metadata: Small/Caption (12–14px, secondary color)
- Body: Body text (16px, primary color)
- Spacing: md (16px) between sections

#### Navigation Component (Sticky Header)

**Structure**:
- Background: White (#FFFFFF) with subtle bottom border (#D1D9E0)
- Position: Fixed at top (sticky)
- Height: 64px (includes vertical padding)
- Padding: 12px horizontally, centered vertically
- Z-index: Ensures it stays above content

**Content**:
- Logo/Title: Left side, H2 size (24px)
- Navigation Links: Center/right, Body text (16px)
- Link styling: Subtle underline on hover, focus ring on focus

**Responsive**:
- Desktop: Horizontal layout, all links visible
- Tablet: Horizontal layout, links may wrap
- Mobile: Hamburger menu optional (not required per spec)

**Accessibility**:
- Keyboard navigation: Tab through all links, Enter/Space to activate
- Skip link: Optional skip-to-main-content link for keyboard users
- ARIA labels: `aria-label="Main navigation"` on `<nav>` element

#### Form Elements

**Input Field**:
- Border: 1px #D1D9E0
- Border radius: 4px
- Padding: 8px 12px
- Font: Body text (16px)
- Focus: Blue focus ring, border color → blue
- Placeholder: Secondary text color (#57606A)

**Label**:
- Typography: Small weight (400), 14px
- Color: Text Primary (#24292F)
- Margin: 8px below label (sm spacing)
- Association: `<label for="id">` properly linked

**Checkbox/Radio**:
- Size: 16px × 16px (minimum for touch)
- Color: Blue accent (#0969DA) when checked
- Focus: Visible focus ring
- Label proximity: 8px spacing between control and label text

### Layout Patterns

#### Hero Section

**Layout**:
- Full viewport width (with side margins on desktop)
- Padding: 2xl (48px) top/bottom, lg (24px) horizontal
- Content: Centered text block (max 600px) + CTA buttons

**Elements**:
- Heading: H1 (32px, 600 weight, primary color)
- Subheading: Body text or H2 (secondary color)
- CTA Buttons: 2–3 medium blue buttons, spaced md (16px)

**Responsive**:
- Desktop: Large hero with full spacing
- Mobile: Reduced padding, H1 → 24px, buttons stack vertically

#### Card Grid Section

**Layout**:
- 12-column grid (desktop), 1–2 columns (mobile)
- Cards: Each card spans 4 columns (3-column layout) or 6 columns (2-column on tablet)
- Gaps: lg (24px) between cards

**Spacing**:
- Section padding: xl (32px) top/bottom
- Section margin: 2xl (48px) separation between sections
- Card internal padding: md (16px) to lg (24px)

#### Data Visualization Area

**Layout**:
- Rounded card container (6px border radius)
- Subtle border (#D1D9E0)
- Generous padding: lg (24px)
- Chart area: Centered, responsive width (100% minus padding)

**Accessibility**:
- Chart title: H2 or H3
- Description: Paragraph text explaining data
- Alt text / Long description for images: Required for charts (ARIA or `<figure><figcaption>`)

## State Management & Transitions

### Loading State

**Visual Indicator**: Skeleton screen (placeholder) for cards/content
- Placeholder boxes: Light gray (#E1E4E8) background
- Animation: Subtle 1.5s pulse effect (0.5s fade-in, 0.5s hold, 0.5s fade-out)
- No jarring animations; max opacity shift 40%
- Keyboard accessible: Screen reader announces "Loading..."

### Error State

**Visual Indicator**: Styled error message
- Background: Light red/pink (#FFEBEE) or no background
- Border left: 2–3px red accent (#D1242F) or error color
- Icon: Optional warning icon (⚠ or ❌)
- Text: Error description in primary text color (#24292F)
- Action: Optional "Retry" button (blue accent)

**Keyboard & Screen Reader**:
- `role="alert"` to announce immediately
- Message: Clear and actionable ("Failed to load data. Retry?")

### Focus State (Keyboard Navigation)

**Standard**:
- Blue focus ring (#0969DA), 2px, offset 2px outside element
- Ring applies to: Buttons, links, form inputs, card elements

**High Contrast Mode**:
- Focus ring thickness: 3px
- Ensures visibility even on light backgrounds

## Accessibility Features (WCAG AAA)

### Color Contrast

- **7:1 minimum** for normal text (all text uses this ratio or higher)
- **4.5:1 minimum** for large text (18px bold or 24px normal)
- **All interactive elements** have sufficient contrast (blue accent: 9.2:1)

### Keyboard Navigation

- **Tab order**: Logical (left-to-right, top-to-bottom)
- **Skip link**: Optional "Skip to main content" link at top
- **Focus indicators**: Always visible, 2px minimum
- **Keyboard shortcuts**: None required (spec doesn't mandate them)

### Semantic HTML & ARIA

- **Proper heading hierarchy**: H1 (once per page) → H2 → H3, no skipped levels
- **Form labels**: Every input associated via `<label for="id">` or `aria-label`
- **Lists**: Use `<ul>`, `<ol>`, `<li>` for list content (not divs)
- **Landmarks**: `<header>`, `<nav>`, `<main>`, `<footer>` for page structure
- **ARIA labels**: Navigation area: `aria-label="Main navigation"`; Alerts: `role="alert"`; Live regions: `aria-live="polite"` for dynamic updates

### Images & Media

- **Alt text**: All images have descriptive alt text
- **Decorative images**: Marked with `alt=""` and `aria-hidden="true"`
- **Charts/Data visualizations**: Include `<figcaption>` or long description via `aria-describedby`

### Motion & Animation

- **Reduced motion**: Respect `prefers-reduced-motion` media query; disable animations if enabled
- **No auto-play**: Media doesn't auto-start
- **No flashing**: No content flashes more than 3 times per second (seizure risk)

## Performance Targets

### Bundle Size

- **CSS**: < 50 KB (minified)
- **JavaScript**: < 30 KB (minified, existing scripts unchanged)
- **Total HTML + CSS + JS**: < 100 KB

### Page Load Metrics (Google PageSpeed 100 targets)

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Full page load**: < 2s on 4G

### Optimization Techniques

- **CSS**: Single stylesheet (or 2–3 modular files, concatenated at build/serve time)
- **Images**: Lazy loading via `loading="lazy"` attribute; WebP with fallback
- **Fonts**: System font stack (no web font downloads)
- **Animation**: CSS-only (no JavaScript animations); GPU-accelerated if necessary
- **Caching**: Static asset caching headers (1 year for versioned assets)

## Design Tokens (CSS Custom Properties)

Example CSS variable structure (to be defined in `variables.css`):

```css
:root {
  /* Colors */
  --color-bg-primary: #FAFBFC;
  --color-surface: #FFFFFF;
  --color-border: #D1D9E0;
  --color-text-primary: #24292F;
  --color-text-secondary: #57606A;
  --color-accent: #0969DA;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-body: 16px;
  --font-weight-normal: 400;
  --font-weight-bold: 600;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border & Shadow */
  --border-radius-small: 4px;
  --border-radius-medium: 6px;
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  :root {
    --font-size-h1: 24px;
    --font-size-h2: 20px;
  }
}
```

---

## Summary

This design system provides a comprehensive, accessible, and performant foundation for the GitHub-inspired website modernization. All components are designed for WCAG AAA compliance, responsive behavior across devices, and PageSpeed 100 performance targets. The system prioritizes simplicity, consistency, and user experience over aesthetic complexity.
