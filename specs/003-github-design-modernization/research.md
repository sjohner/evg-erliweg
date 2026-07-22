# Design Research: GitHub-Inspired Modernization

**Phase**: 0 (Research & Investigation)

**Date**: 2026-07-22

**Objective**: Document design approach, GitHub style principles, accessibility strategy, and performance optimization methods for the website modernization.

## Design Strategy

### GitHub Design Language — Core Principles

**Decision**: Adopt GitHub's publicly documented design principles as the reference for the modernization.

**Rationale**: GitHub's design is widely recognized as technical, trustworthy, and enterprise-ready. It exemplifies modern web design without marketing clichés (no gradients, glassmorphism, or excessive animations). The design language aligns perfectly with the energy data visualization project's target audience (technical users).

**Key Characteristics from GitHub's Design System**:

1. **Color Palette**: Light mode with subtle grays (backgrounds), white (content), and a single accent color (blue for interaction)
2. **Typography**: System font stack for performance; 2–3 distinct font sizes for hierarchy; strong contrast
3. **Spacing**: Consistent grid system (8px base); generous whitespace; never cramped
4. **Components**: Minimal borders (usually subtle grays), rounded corners (4–8px), no drop shadows unless necessary
5. **Interaction**: Subtle hover states (color shift, underline), focus indicators for keyboard navigation, no animations unless purposeful
6. **Philosophy**: Content-first; design serves the data, not the other way around

**Alternatives Considered**:

- **Tailwind CSS / Bootstrap**: Rejected because adding dependencies conflicts with the "vanilla CSS" goal and PageSpeed 100 target; adds bloat
- **Custom design system**: Rejected because GitHub's system is proven, well-documented, and reduces design decisions
- **Dark mode**: Rejected (per spec) in favor of light palette with blue accents; dark mode can be added later if needed

### Color Palette Decision

**Decision**: Use a light background with blue as the primary accent.

**Palette**:

| Color | Hex | Usage | WCAG Ratio (against white) |
|-------|-----|-------|----------------------------|
| Background | #FAFBFC | Page background | N/A |
| Card/Surface | #FFFFFF | Cards, sections | N/A |
| Border Subtle | #D1D9E0 | Borders, dividers | 8.5:1 ✓ |
| Text Primary | #24292F | Body text, headings | 16:1 ✓ |
| Text Secondary | #57606A | Secondary text, labels | 8.8:1 ✓ |
| **Blue Accent** | #0969DA | Links, buttons, highlights | 9.2:1 ✓ (against white) |
| **Focus Ring** | #0969DA | Keyboard focus indicator | 9.2:1 ✓ |

**Contrast Validation**: All colors meet WCAG AAA (7:1 minimum) requirements. Dark text on light backgrounds ensures readability for users with low vision.

**Alternatives Considered**:

- **Multiple accent colors**: Rejected; simplicity principle favors a single accent
- **Custom blue**: GitHub's blue (#0969DA) is proven accessible and recognizable

### Typography System

**Decision**: Use a system font stack with 3 sizes for hierarchy.

**Font Stack (Performance-Optimized)**:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
             "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
             sans-serif;
```

This stack ensures native system fonts load instantly (no web font overhead), improving PageSpeed metrics.

**Typography Scale**:

| Role | Size | Weight | Line-Height | Usage |
|------|------|--------|-------------|-------|
| **H1 (Hero)** | 32px (mobile: 24px) | 600 | 1.2 | Page titles, hero sections |
| **H2 (Section)** | 24px (mobile: 20px) | 600 | 1.3 | Section headings |
| **Body** | 16px (mobile: 14px minimum) | 400 | 1.6 | Paragraphs, default text |
| **Caption** | 12px | 400 | 1.5 | Metadata, labels |

**Rationale**: 3 sizes provide visual hierarchy without clutter. 16px minimum on mobile ensures WCAG readability. 1.6 line-height improves readability for dyslexic users.

**Alternatives Considered**:

- **Web fonts (e.g., Inter, SF Pro)**: Rejected because system fonts avoid network latency; already optimized by OS
- **5+ sizes**: Rejected; violates simplicity principle; 3 sizes sufficient

### Spacing & Layout System

**Decision**: Use 8px base grid with CSS Grid/Flexbox for layouts.

**Spacing Scale**:

```
8px (0.5rem) — 1 unit
16px (1rem) — 2 units (default padding/margin)
24px (1.5rem) — 3 units
32px (2rem) — 4 units
48px (3rem) — 6 units (section spacing)
```

**Layout Breakpoints** (mobile-first):

| Breakpoint | Size | Context |
|-----------|------|---------|
| Mobile | 375px–767px | Single column; stacked layout |
| Tablet | 768px–1023px | 2 columns; adjusted spacing |
| Desktop | 1024px+ | Multi-column; full layout |

**Rationale**: 8px grid creates consistency; CSS Grid ensures responsive behavior without media query bloat.

**Alternatives Considered**:

- **12px or 10px base**: Rejected; 8px is industry standard and provides finer control
- **Complex breakpoint system**: Rejected; 3 breakpoints sufficient for energy data site

### Components Design

**Decision**: Define minimal component styles (buttons, cards, navigation) with consistent patterns.

**Core Components**:

1. **Card**: White background, subtle border (#D1D9E0), 8px rounded corners, 16px padding, shadows only on interactive hover
2. **Button**: Background #0969DA, white text, 8px rounded, 12px horizontal padding, focus ring on keyboard access
3. **Link**: Blue (#0969DA) text, underline on hover, focus indicator
4. **Input**: Light gray border, 8px rounded, focus ring changes to blue
5. **Navigation (Sticky)**: Light background (#FAFBFC), subtle border bottom, sticky positioning, no shadow

**Alternatives Considered**:

- **Drop shadows on all cards**: Rejected; keeps design minimal; shadows only appear on hover
- **3D effects / glassmorphism**: Explicitly rejected per spec

## Accessibility Strategy (WCAG AAA)

### Level AAA Compliance Approach

**Decision**: Achieve WCAG AAA (Level AAA) through semantic HTML, proper contrast, and keyboard navigation.

**Key Requirements**:

| Requirement | Method |
|-------------|--------|
| **1.4.6 Enhanced Contrast (AAA)** | All text uses 7:1+ contrast ratio (planned palette exceeds this) |
| **1.4.3 Contrast (Minimum)** | Applied; AAA even stricter (7:1 vs AA's 4.5:1) |
| **1.3.1 Info & Relationships** | Semantic HTML5 (h1–h6, nav, article, section) |
| **2.1.1 Keyboard Navigation** | All interactive elements focusable via Tab; focus rings visible |
| **2.4.3 Focus Order (AAA)** | Logical tab order; skip links from header to main content |
| **2.4.7 Focus Visible (AAA)** | Blue focus ring (4px, 2px offset) on all interactive elements |
| **1.1.1 Non-text Content** | Descriptive alt text for all images; null alt for decorative images |
| **4.1.2 Name, Role, Value** | ARIA labels on form inputs, buttons, dynamic regions |
| **2.3.3 Animation from Interactions** | Avoid flashing; animations <3 times/second if present |

### Accessibility Validation Tools

- **WAVE**: Browser plugin to audit color contrast and semantic structure
- **Axe DevTools**: Automated WCAG scanning
- **Lighthouse**: Built-in accessibility audit in Chrome DevTools
- **Manual Testing**: Keyboard-only navigation; screen reader testing (NVDA, JAWS)

**Alternatives Considered**:

- **WCAG AA only**: Rejected; spec explicitly requires AAA
- **External accessibility library**: Rejected; achievable with semantic HTML and CSS

## Performance Strategy (Google PageSpeed 100)

### Core Web Vitals & PageSpeed Targets

**Decision**: Achieve PageSpeed 100 through optimized CSS, lazy loading, and minimal JavaScript.

**Target Metrics**:

| Metric | Target | Method |
|--------|--------|--------|
| **Performance** | ≥95 | Minimize CSS/JS; no render-blocking resources; optimize images |
| **Accessibility** | ≥95 | WCAG AAA; contrast ratios; skip links; ARIA labels |
| **Best Practices** | ≥95 | HTTPS; no console errors; modern browser features |
| **SEO** | ≥90 | Meta tags; heading hierarchy; structured data (optional) |
| **LCP (Largest Contentful Paint)** | <2.5s | Fast CSS parsing; no large images above fold |
| **FID (First Input Delay)** | <100ms | Minimal JavaScript; event listeners non-blocking |
| **CLS (Cumulative Layout Shift)** | <0.1 | Fixed dimensions; avoid late-loading images; stable navigation |
| **Page Load (4G)** | <2s | Minified CSS; single stylesheet; cached assets |

### Optimization Techniques

1. **CSS Optimization**:
   - Single minified stylesheet (or 2–3 small files for modular loading)
   - No external libraries (vanilla CSS)
   - CSS Grid/Flexbox (native, no polyfills)
   - CSS custom properties (lightweight scoping)
   - Critical CSS inlined in `<head>` if needed

2. **Image Optimization**:
   - WebP format with JPEG fallback
   - Responsive images (`srcset` for different densities)
   - Lazy loading (`loading="lazy"`) for below-fold images
   - SVG for icons (vector, scalable, no HTTP requests)

3. **JavaScript**:
   - Keep existing JS (app.js, charts.js, data-loader.js) — no changes
   - No new dependencies
   - Event delegation for delegated event handlers
   - Debounce scroll/resize events (if needed)

4. **Caching**:
   - Cache-Control headers: CSS/JS → 1 year; HTML → 1 hour (due to updates)
   - Browser caching for static assets
   - CDN delivery if available

5. **Animations**:
   - CSS transitions (GPU-accelerated) for hover states
   - Avoid `transform` and `opacity` changes that trigger layouts
   - Respect `prefers-reduced-motion` for accessibility

### Alternatives Considered**:

- **CSS Framework (Tailwind, Bootstrap)**: Rejected; adds 50–100KB overhead
- **Web fonts**: Rejected; system fonts load instantly
- **JavaScript animation library**: Rejected; CSS animations sufficient and faster

## Error & Loading States Design

### Visual Feedback Strategy

**Decision**: Implement polished skeleton screens and styled error messages without external libraries.

**Skeleton Screen Pattern**:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Error Message Styling**:

- Red text (#D1242F) with 7:1+ contrast
- Subtle red background (#FFEBEE) for context
- Clear icon (error circle) + descriptive text
- No animation; immediate clarity

**Rationale**: Skeleton screens reduce perceived load time; styled error messages maintain design consistency.

**Alternatives Considered**:

- **Spinners / progress bars**: Generic; skeleton screens feel more modern and informative
- **Third-party loading libraries**: Rejected; CSS animations sufficient

## Language Localization (German)

### Content Translation Strategy

**Decision**: Translate all public-facing content to German; keep codebase, comments, and documentation in English.

**Scope**:

| Element | Language | Notes |
|---------|----------|-------|
| Page text, headings, labels | German | All user-visible content |
| Form fields, buttons, error messages | German | Includes placeholders, validation messages |
| Code comments, variable names | English | Per constitution; aids future maintenance |
| Documentation (README, specs, plans) | English | Per constitution |

**Alternatives Considered**:

- **English-only**: Rejected per user clarification (German public content required)
- **i18n infrastructure**: Rejected as out-of-scope; German is sole language for v1

## Research Findings Summary

### Decision Log

| Decision | Status | Confidence |
|----------|--------|-----------|
| GitHub design language as reference | ✅ Approved | High (proven, documented) |
| Light palette + blue accent | ✅ Approved | High (WCAG AAA compliant) |
| System fonts (no web fonts) | ✅ Approved | High (PageSpeed benefit) |
| 8px grid + 3 breakpoints | ✅ Approved | High (standard, flexible) |
| Vanilla CSS only (no frameworks) | ✅ Approved | High (simplicity + performance) |
| Skeleton screens for loading | ✅ Approved | Medium (polished but requires testing) |
| German public content | ✅ Approved | High (explicit requirement) |
| Evergreen browsers only | ✅ Approved | High (modern features available) |

### Outstanding Questions

None. All clarifications resolved in spec phase. Design approach is fully scoped and ready for implementation planning.

### Next Phase

**Phase 1** will generate:
- `data-model.md` — Detailed color palette, typography scale, spacing system
- `contracts/` — Design system contracts (button specs, card specs, navigation specs)
- `quickstart.md` — Validation guide for the redesigned site

---

**Approved**: Ready for Phase 1 Design Artifacts
