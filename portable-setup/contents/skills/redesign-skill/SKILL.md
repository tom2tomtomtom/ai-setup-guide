---
name: redesign-skill
description: Audit-first approach for upgrading existing UI. Use when redesigning, refactoring, or improving an existing interface - scans for typography, color, layout, interactivity, and content issues before making changes.
---

# Redesign Skill

A systematic audit-and-fix skill for upgrading existing projects. Instead of starting over, scan what exists, diagnose the weak points, then fix in priority order.

---

## When to Use This Skill

Use when:
- Redesigning or refreshing an existing interface
- Reviewing a UI that "works but doesn't feel right"
- Upgrading a codebase from generic/templated to polished
- Doing a design quality audit before launch
- Taking over a project from another developer/AI

Do NOT use for greenfield projects (use beautiful-ui instead).

---

## Process: Scan → Diagnose → Fix

### Step 1: Scan

Read the existing code. Don't change anything yet. Look for issues across these categories:

### Step 2: Diagnose

Check each category below. Mark issues found.

### Step 3: Fix (in priority order)

Fix in this exact order. Each step compounds on the previous:

1. **Font swap** — Replace system/default fonts with intentional choices
2. **Color cleanup** — Fix pure blacks, oversaturated accents, inconsistent tints
3. **Hover/focus states** — Add missing interactive feedback
4. **Layout and spacing** — Fix spacing inconsistencies, center bias, container widths
5. **Component replacement** — Swap generic patterns for better alternatives
6. **State coverage** — Add missing empty, loading, error states
7. **Typography polish** — Letter-spacing, line-height, weight hierarchy

---

## Audit Checklist

### Typography

- [ ] **Font choice**: Is it intentional or a system default? Default sans-serif = red flag.
- [ ] **Weight hierarchy**: Are there at least 3 distinct weights creating clear hierarchy (400/500/600 or 400/500/700)?
- [ ] **Orphaned headings**: Any heading sitting alone without supporting content nearby?
- [ ] **Letter-spacing**: Headlines tightened (-0.02em)? ALL-CAPS widened (+0.05em)? Small text slightly widened (+0.01em)?
- [ ] **Line-height**: Headings tight (1.1-1.2)? Body comfortable (1.5-1.6)?
- [ ] **Font smoothing**: `-webkit-font-smoothing: antialiased` applied?
- [ ] **Tabular numbers**: Data/prices using `font-variant-numeric: tabular-nums`?
- [ ] **Line length**: Prose content constrained to 45-75ch?
- [ ] **Size consistency**: Are similar elements using the same text size, or are sizes scattered randomly?

### Color and Surfaces

- [ ] **Pure black ban**: Is `#000000` or `rgb(0,0,0)` used for text? Should be near-black (oklch 0.13-0.15).
- [ ] **Oversaturated accents**: Any accent colors with chroma > 0.25 in OKLCH or saturation > 80% in HSL?
- [ ] **Shadow tinting**: Are shadows using black/gray, or are they tinted to match the surface color?
- [ ] **Dark/light consistency**: Do dark sections and light sections use the same design language, or does quality drop in one mode?
- [ ] **Contrast ratio**: WCAG AA (4.5:1 text, 3:1 large text) met for all text-on-background combinations?
- [ ] **Neutral tint**: Are grays pure or do they carry an intentional tint (blue, warm, violet)?
- [ ] **Accent discipline**: More than 2 saturated colors? Simplify to one accent + grayscale.

### Layout

- [ ] **Center bias**: Is everything centered? Asymmetric layouts create more visual interest.
- [ ] **Card overuse**: More than 3 rows of equal cards in a row? Consider mixed layouts, tables, or list views.
- [ ] **Container constraints**: Is content allowed to stretch too wide (>1280px) or too narrow (<320px)?
- [ ] **Optical alignment**: Icons, text, and elements optically aligned (not just mathematically)?
- [ ] **Whitespace audit**: Is section spacing generous (64px+) or cramped (32px)?
- [ ] **Grid consistency**: Using a consistent column system, or ad-hoc widths everywhere?
- [ ] **Mobile viewport**: Using `min-h-[100dvh]` instead of `h-screen` (iOS Safari fix)?

### Interactivity and States

- [ ] **Hover states**: Does every clickable element have a visible hover state?
- [ ] **Active/pressed**: Do buttons show a pressed state (scale 0.98, darker bg)?
- [ ] **Focus visible**: Are keyboard focus rings styled and visible?
- [ ] **Loading states**: What happens while data loads? Skeleton > spinner.
- [ ] **Empty states**: What shows when there's no data? Designed state > "No results."
- [ ] **Error states**: Are errors helpful and styled, or raw red text?
- [ ] **Disabled states**: Clear visual distinction without just reducing opacity?
- [ ] **Transitions**: Are state changes animated (150-200ms) or instant/jarring?

### Content

- [ ] **Generic names**: Any "John Doe", "Jane Smith", "Acme Corp"? Use realistic placeholder data.
- [ ] **Fake numbers**: Round numbers like "$100.00" or "1,000 users"? Use realistic-looking numbers ($127.43, 1,847 users).
- [ ] **AI cliches**: "Elevate", "Seamless", "Unleash", "Cutting-edge", "Revolutionize" in copy? Replace with specific, concrete language.
- [ ] **Lorem Ipsum**: Any Latin filler text still present?
- [ ] **Placeholder images**: Using unsplash with generic query params? Use specific, curated images.

### Component Patterns

- [ ] **Card alternatives**: Could any card grid be a table, list, or feed instead?
- [ ] **Modal overuse**: Could any modal be an inline expansion, a panel, or a new page?
- [ ] **Avatar shapes**: Consistent shape across the app (circle vs rounded-square)?
- [ ] **Icon consistency**: Same icon library throughout? Consistent stroke width and size?
- [ ] **Button hierarchy**: Clear primary/secondary/ghost distinction? Only one primary per view?

### Code Quality

- [ ] **Semantic HTML**: Using `<button>` not `<div onClick>`, `<nav>` not `<div>`, `<main>` not `<div>`?
- [ ] **Z-index discipline**: Using a defined scale (10, 20, 30, 40, 50) not random values?
- [ ] **Import verification**: Are all imported packages actually installed?
- [ ] **Tailwind version**: Using v3 or v4 syntax correctly? (`@apply` vs CSS variables)
- [ ] **Responsive**: Tested at 320px, 768px, 1024px, 1440px?

### Strategic Omissions (Things People Forget)

- [ ] **Legal links**: Privacy policy, terms, cookie banner in footer?
- [ ] **404 page**: Styled and helpful, not the framework default?
- [ ] **Form validation**: Inline validation with helpful messages?
- [ ] **Skip-to-content**: Accessibility link for keyboard users?
- [ ] **Meta tags**: OG image, description, title set?
- [ ] **Favicon**: Custom, not the framework default?

---

## Fix Priority Order

When you find multiple issues, fix in this order (each builds on the previous):

```
1. Font swap          → Foundation for everything else
2. Color cleanup      → Consistent palette makes spacing issues visible
3. Hover/focus states → Interactive feedback is table stakes
4. Layout + spacing   → Structural improvements
5. Component replace  → Better patterns for common elements
6. State coverage     → Empty, loading, error, disabled
7. Typography polish  → Fine-tuning (tracking, line-height, weight)
```

---

## Key Principle

**Don't redesign what works.** This skill is about targeted upgrades, not rewrites. If a layout works well but the typography is generic, just fix the typography. The audit tells you what's wrong; fix only what the audit surfaces.
