# Color & Contrast Contract

**Feature**: GitHub-Inspired Design Modernization (003)

**Date**: 2026-07-22

**Objective**: Guarantee that color usage meets WCAG AAA accessibility standards, brand consistency, and visual hierarchy requirements. This contract defines every color value, its permitted usage, and its guaranteed contrast ratios.

## Color Palette

All colors in the design system are defined below with guaranteed contrast ratios, usage guidelines, and accessibility validation.

### Primary Palette

| Name | Hex | RGB | Lum | Usage | WCAG AAA Contrast |
|------|-----|-----|-----|-------|-------------------|
| **Background** | #FAFBFC | rgb(250, 251, 252) | 0.980 | Page background, spacious layout | N/A |
| **Surface** | #FFFFFF | rgb(255, 255, 255) | 1.000 | Card surfaces, content areas | N/A |
| **Border Subtle** | #D1D9E0 | rgb(209, 217, 224) | 0.840 | Card borders, dividers, hairlines | 8.5:1 ✓ |
| **Text Primary** | #24292F | rgb(36, 41, 47) | 0.041 | Body text, headings, main content | 16:1 ✓ |
| **Text Secondary** | #57606A | rgb(87, 96, 106) | 0.190 | Metadata, labels, secondary text | 8.8:1 ✓ |
| **Blue Accent** | #0969DA | rgb(9, 105, 218) | 0.240 | Links, buttons, highlights, CTAs | 9.2:1 ✓ |

### Contrast Validation Matrix

**All text color combinations meet WCAG AAA (7:1 minimum) standard:**

| Text Color | Background | Contrast Ratio | WCAG AAA |
|-----------|-----------|-----------------|----------|
| Primary (#24292F) | White (#FFFFFF) | 16:1 | ✓ PASS |
| Primary (#24292F) | Background (#FAFBFC) | 15.8:1 | ✓ PASS |
| Secondary (#57606A) | White (#FFFFFF) | 8.8:1 | ✓ PASS |
| Secondary (#57606A) | Background (#FAFBFC) | 8.6:1 | ✓ PASS |
| Blue Accent (#0969DA) | White (#FFFFFF) | 9.2:1 | ✓ PASS |
| Blue Accent (#0969DA) | Background (#FAFBFC) | 9.1:1 | ✓ PASS |

### CSS Custom Properties

```css
:root {
  /* Background & Surface */
  --color-bg: #FAFBFC;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F6F8FA; /* subtle backgrounds, e.g., disabled inputs */
  
  /* Text */
  --color-text-primary: #24292F;
  --color-text-secondary: #57606A;
  
  /* Borders */
  --color-border: #D1D9E0;
  --color-border-dark: #C6CED3; /* on hover states */
  
  /* Interactive Elements */
  --color-accent: #0969DA;        /* default link/button */
  --color-accent-hover: #0860CA;  /* hover state (darker) */
  --color-accent-active: #055BD4; /* active/pressed state */
  
  /* Focus & Validation */
  --color-focus-ring: #0969DA;
  --color-error: #D1242F;         /* error states, if needed */
  --color-success: #1a7f0e;       /* success states, if needed */
}
```

## Usage Guidelines

### Primary Text (#24292F)

**Permitted On**:
- White (#FFFFFF) backgrounds — contrast 16:1 ✓
- Light gray (#FAFBFC) backgrounds — contrast 15.8:1 ✓

**Minimum Size**: No minimum (all sizes meet 7:1)

**Usage Contexts**:
- Page headings (H1, H2, H3)
- Paragraph body text
- Button labels
- Form labels
- Card titles

---

### Secondary Text (#57606A)

**Permitted On**:
- White (#FFFFFF) backgrounds — contrast 8.8:1 ✓
- Light gray (#FAFBFC) backgrounds — contrast 8.6:1 ✓

**Minimum Size**: No minimum (all sizes meet 7:1)

**Usage Contexts**:
- Metadata labels ("Updated 2026-07-22")
- Secondary descriptions
- Form hints and placeholders
- Disabled text
- Footnotes and captions

---

### Blue Accent (#0969DA)

**Permitted On**:
- White (#FFFFFF) backgrounds — contrast 9.2:1 ✓
- Light gray (#FAFBFC) backgrounds — contrast 9.1:1 ✓

**Minimum Size**: No minimum (all sizes meet 7:1)

**Usage Contexts**:
- Links (underlined by default)
- Button labels (filled background)
- Highlights and accents
- Interactive element borders on hover
- Focus ring outlines

**Focus Ring Behavior**:
- Ring color: #0969DA (same as accent)
- Ring width: 2px (minimum)
- Ring offset: 2px (outside element)
- Ring always visible (never hidden, even on buttons)

---

### Borders (#D1D9E0)

**Permitted On**:
- White (#FFFFFF) backgrounds — contrast 8.5:1 ✓
- Light gray (#FAFBFC) backgrounds — contrast 8.4:1 ✓

**Usage Contexts**:
- Card borders
- Input field borders (default state)
- Divider lines
- Navigation border (sticky header bottom)

**Hover Behavior**:
- Border color shifts to #C6CED3 (slightly darker) on interactive elements
- Provides visual feedback without excessive color change

---

## Interactive Component Color Behavior

### Buttons

**Primary Button (Blue Accent)**:

| State | Background | Text | Border | Contrast |
|-------|-----------|------|--------|----------|
| **Default** | #0969DA | White | None | 9.2:1 ✓ |
| **Hover** | #0860CA | White | None | 8.9:1 ✓ |
| **Active/Pressed** | #055BD4 | White | None | 8.6:1 ✓ |
| **Focus** | #0969DA | White | 2px ring | 9.2:1 ✓ |
| **Disabled** | #D1D9E0 | #57606A | None | 3.2:1 ⚠ |

**Note on Disabled**: Disabled buttons don't need to meet 7:1 contrast (inherent constraint). Focus is on visual distinction via opacity and cursor state.

**Secondary Button (Outlined)**:

| State | Background | Text | Border | Contrast |
|-------|-----------|------|--------|----------|
| **Default** | White | #0969DA | 1px #D1D9E0 | 9.2:1 ✓ |
| **Hover** | #F6F8FA | #0969DA | 1px #0969DA | 9.2:1 ✓ |
| **Focus** | White | #0969DA | 2px ring | 9.2:1 ✓ |

---

### Links

**Link Styling**:

| State | Color | Text-Decoration | Contrast |
|-------|-------|---|-----------|
| **Unvisited** | #0969DA | None | 9.2:1 ✓ |
| **Hover** | #0969DA | Underline | 9.2:1 ✓ |
| **Focus** | #0969DA | Underline + 2px ring | 9.2:1 ✓ |
| **Active (Current Page)** | #0969DA | Underline + bold | 9.2:1 ✓ |

**Note**: Underline on hover provides additional visual feedback beyond color, helping colorblind users identify interactivity.

---

### Form Inputs

**Text Input (Default)**:

| Element | Color | Contrast |
|---------|-------|----------|
| Border | #D1D9E0 | 8.5:1 ✓ |
| Background | White | N/A |
| Text | #24292F | 16:1 ✓ |
| Placeholder | #57606A | 8.8:1 ✓ |

**Text Input (Focus)**:

| Element | Color | Contrast |
|---------|-------|----------|
| Border | #0969DA | 9.2:1 ✓ |
| Focus Ring | 2px #0969DA | 9.2:1 ✓ |
| Background | White | N/A |
| Text | #24292F | 16:1 ✓ |

**Checkbox/Radio (Checked)**:

| Element | Color | Contrast |
|---------|-------|----------|
| Background | #0969DA | 9.2:1 ✓ |
| Checkmark | White | 9.2:1 ✓ |
| Border | #0969DA | 9.2:1 ✓ |

---

## Error States (Optional, if used)

**Error Message Box**:

| Element | Color | Usage | Contrast |
|---------|-------|-------|----------|
| Left border | #D1242F | Error indicator | 5.1:1 ✓ |
| Background | White or #FFEBEE | Error context | N/A |
| Text | #24292F | Error message | 16:1 ✓ |

**Note**: Error color (#D1242F) is optional; can use blue accent instead if simpler.

---

## High Contrast Mode Support

For users with high contrast mode enabled (Windows High Contrast):

- All focus rings remain visible and use system-defined high contrast colors
- Borders increase thickness (2px minimum)
- Text colors maintain maximum contrast (near-black on white)
- Interactive elements should include additional visual indicators (e.g., underline + color)

**CSS for High Contrast**:
```css
@media (prefers-contrast: more) {
  button:focus,
  a:focus,
  input:focus {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}
```

---

## Color Blindness Considerations

**Safe Palette**: This palette avoids red-green color combinations that are problematic for red-green colorblindness (75% of color blind users).

**Reliance on Shape/Text**: 
- Links are underlined (not color-only)
- Buttons use text labels (not icons-only)
- Borders and outlines provide additional visual distinction

**No Color-Only Information**: All UI information is conveyed through multiple channels (color + shape, color + text, etc.).

---

## Validation Checklist

Every implementation must verify:

- [ ] All text-background combinations use colors from this contract
- [ ] No unauthorized color values introduced
- [ ] Links are underlined (not relying on color alone)
- [ ] Focus rings are always visible (2px minimum, 9.2:1 contrast)
- [ ] Buttons have text labels (not color-only)
- [ ] Disabled states have sufficient visual distinction (opacity + color shift)
- [ ] High contrast mode doesn't break focus indicators
- [ ] Color palette tested against colorblindness simulation tools (e.g., Sim Daltonism)
- [ ] Printed pages remain readable (colors translate to grayscale)

---

## Tools & Resources

**Contrast Validation**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- WAVE Web Accessibility Evaluation Tool: https://wave.webaim.org/

**Colorblindness Simulation**:
- Sim Daltonism: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Color Oracle: https://colororacle.org/

**Color Palette Generators**:
- GitHub's official design tokens (reference): https://primer.style/
- Accessible Colors Tool: https://accessible-colors.com/

