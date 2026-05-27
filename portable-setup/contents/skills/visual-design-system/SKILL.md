---
name: visual-design-system
description: Apply concrete spacing scales (4/8/16/32px), type hierarchies (size, weight, line-height combos), color contrast rules, and visual weight balancing to UI components; use when reviewing UI quality or making layout/typography decisions
---

# Visual Design System

Systematic guide for making good visual design decisions. Covers spacing, typography, hierarchy, and color with practical rules that create polished, professional interfaces.

---

## When to Use This Skill

Use when:
- Making spacing decisions (padding, margins, gaps)
- Setting up typography scales
- Reviewing UI for visual consistency
- Building component libraries
- Deciding visual hierarchy
- Improving perceived quality of an interface
- Converting designs to code
- Code reviewing UI implementations

---

## Core Principles

### Quality is in the Details
The difference between amateur and professional UI is rarely one big thing—it's hundreds of small things done consistently. Spacing that follows a system. Typography that has rhythm. Colors used with purpose.

### Consistency Creates Trust
When visual patterns are predictable, users can focus on content rather than decoding the interface. Inconsistency signals carelessness and erodes trust.

### Space is Intentional
White space is not "empty"—it's a design element. More space around an element increases its perceived importance. Crowded interfaces feel cheap; breathing room feels premium.

---

## The 8-Point Grid System

The 8pt grid is the industry standard for spacing. Use multiples of 8px for all spacing decisions.

### Why 8 Works

1. **Divisible** - 8 divides evenly into common screen widths
2. **Scalable** - Works on all device densities (1x, 1.5x, 2x, 3x)
3. **Human** - Creates visible rhythm without being rigid
4. **Industry standard** - Used by Material Design, iOS, and most design systems

### The Spacing Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `space-1` | 4px | Tight: icon-to-label gap, inline elements |
| `space-2` | 8px | Small: related items, compact lists |
| `space-3` | 12px | Medium-small: form field spacing |
| `space-4` | 16px | Default: standard component padding |
| `space-5` | 20px | Medium: comfortable breathing room |
| `space-6` | 24px | Large: section dividers, card padding |
| `space-8` | 32px | XL: major section separation |
| `space-10` | 40px | 2XL: page section gaps |
| `space-12` | 48px | 3XL: hero section padding |
| `space-16` | 64px | 4XL: major layout divisions |

### Applying the Scale

```
Component padding:    16px (space-4) - 24px (space-6)
Gap between siblings: 8px (space-2) - 16px (space-4)
Section margins:      32px (space-8) - 64px (space-16)
```

**Tailwind mapping:**
```
space-1 = p-1 (4px)
space-2 = p-2 (8px)
space-4 = p-4 (16px)
space-6 = p-6 (24px)
space-8 = p-8 (32px)
```

---

## The Internal-External Spacing Rule

**Internal spacing (padding) should be less than or equal to external spacing (margin/gap).**

This creates clear visual grouping based on Gestalt's Law of Proximity.

### The Rule

```
Padding within component ≤ Gap between components
```

### Visual Example

```
Good:
┌─────────────────┐
│                 │  16px padding inside
│    Card A       │
│                 │
└─────────────────┘
         ↕ 24px gap
┌─────────────────┐
│                 │
│    Card B       │
│                 │
└─────────────────┘

Bad:
┌─────────────────┐
│                 │  32px padding inside
│    Card A       │
│                 │
└─────────────────┘
  ↕ 8px gap (too tight - cards don't feel separate)
┌─────────────────┐
│                 │
│    Card B       │
│                 │
└─────────────────┘
```

### Practical Application

| Component | Internal (padding) | External (gap) |
|-----------|-------------------|----------------|
| Button | 8-12px vertical, 16-24px horizontal | 8-16px between buttons |
| Card | 16-24px | 16-32px between cards |
| Form field | 12-16px | 16-24px between fields |
| Section | 24-48px | 48-80px between sections |
| List item | 8-16px | 0-8px between items |

---

## Typography System

### The Type Scale

Use a modular scale for harmonious sizing. Common ratios:

| Ratio | Name | Good For |
|-------|------|----------|
| 1.125 | Major Second | Dense UIs, data-heavy apps |
| 1.200 | Minor Third | Balanced, readable interfaces |
| 1.250 | Major Third | Marketing, editorial (Recommended) |
| 1.333 | Perfect Fourth | Bold, dramatic headlines |

### Recommended Scale (1.25 ratio)

| Name | Size | Line Height | Use |
|------|------|-------------|-----|
| `text-xs` | 12px | 16px (1.33) | Labels, captions, metadata |
| `text-sm` | 14px | 20px (1.43) | Secondary text, descriptions |
| `text-base` | 16px | 24px (1.5) | Body text (default) |
| `text-lg` | 18px | 28px (1.56) | Lead paragraphs |
| `text-xl` | 20px | 28px (1.4) | Card titles, H4 |
| `text-2xl` | 24px | 32px (1.33) | Section headers, H3 |
| `text-3xl` | 30px | 36px (1.2) | Page titles, H2 |
| `text-4xl` | 36px | 40px (1.11) | Hero headers, H1 |
| `text-5xl` | 48px | 48px (1.0) | Display text |

### Line Height Rules

```
Headings:   1.1 - 1.3 (tighter)
Body text:  1.4 - 1.6 (comfortable)
Small text: 1.4 - 1.5 (legible)
```

**Why:** Large text needs less line height—the letters themselves provide rhythm. Small text needs more space between lines to prevent blurring.

### Font Weight Hierarchy

| Weight | Value | Use |
|--------|-------|-----|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Emphasis, labels, UI text |
| Semibold | 600 | Subheadings, buttons |
| Bold | 700 | Headings, strong emphasis |

**Rule:** Use weight to create hierarchy, not just size. A 16px semibold stands out from 16px regular.

### Readable Line Length

```
Optimal:  45-75 characters per line
Target:   65 characters (about 600px for 16px text)
Maximum:  90 characters
```

**Implementation:**
```css
.prose { max-width: 65ch; }
/* or */
.prose { max-width: 600px; }
```

---

## Visual Hierarchy

Hierarchy guides the eye. Create it with these tools (in order of impact):

### 1. Size Hierarchy
Larger = more important. But don't overdo it—2-3 distinct sizes usually suffice.

```
Good:  36px → 24px → 16px (clear steps)
Bad:   36px → 32px → 28px → 24px (too subtle)
```

### 2. Weight Hierarchy
Heavier = more important. More subtle than size but equally effective.

```
Heading:     font-bold (700)
Subheading:  font-semibold (600)
Body:        font-normal (400)
Secondary:   font-normal (400) + lighter color
```

### 3. Color Hierarchy
Higher contrast = more important.

```
Primary text:   gray-900 / #111
Secondary text: gray-600 / #666
Tertiary text:  gray-400 / #999
```

### 4. Space Hierarchy
More space around = more important.

```
Hero section:    64-96px padding
Content section: 32-48px padding
Component:       16-24px padding
```

### One Focal Point Per View

Every screen should have ONE primary action or message. If everything is emphasized, nothing is.

```
Good:
- One primary button ("Sign Up")
- One main headline
- Clear visual path

Bad:
- Multiple competing CTAs
- Several things demanding attention
- User doesn't know where to look
```

---

## White Space Principles

### More Space = More Premium

Generous spacing signals:
- Confidence (we don't need to cram everything in)
- Quality (we value the user's visual comfort)
- Organization (elements have room to breathe)

### Section Spacing Formula

```
Space between sections > Space within sections > Component padding
```

Example:
```
Between page sections:  64px
Between cards:          24px
Inside cards:           16px
```

### Breathing Room Guidelines

| Context | Minimum Space |
|---------|---------------|
| Text from container edge | 16px |
| Between paragraphs | 16-24px |
| Between sections | 48-80px |
| Around primary CTA | 24-32px |
| Header height | 64-80px |

### The Squint Test

Squint at your interface. You should see:
- Clear content blocks separated by space
- Obvious hierarchy (bigger things matter more)
- One area that draws the eye first

If it looks like a wall of content, add more space.

---

## Color Guidelines

### Limited Palette

```
Primary:    1 brand color (buttons, links, accents)
Secondary:  1 supporting color (optional)
Neutral:    5-7 shades of gray (text, backgrounds, borders)
Semantic:   Success/Error/Warning (green/red/amber)
```

### Contrast Requirements (WCAG)

| Use Case | Minimum Ratio |
|----------|---------------|
| Body text | 4.5:1 |
| Large text (18px+ or 14px bold) | 3:1 |
| UI components | 3:1 |
| Non-essential decoration | No requirement |

**Quick reference:**
- `gray-900` on white = ~17:1 (excellent)
- `gray-700` on white = ~8:1 (good)
- `gray-500` on white = ~4.5:1 (minimum for text)
- `gray-400` on white = ~3:1 (only for large text/icons)

### Semantic Color Usage

Use color consistently to communicate meaning:

```
Blue:    Interactive elements, links, primary actions
Green:   Success, positive, completion
Red:     Error, destructive, danger
Amber:   Warning, attention needed
Gray:    Neutral, disabled, secondary
```

---

## Component Spacing Reference

### Buttons

```
Small:   py-1.5 px-3 (6px 12px)   text-sm
Medium:  py-2 px-4   (8px 16px)   text-sm
Large:   py-3 px-6   (12px 24px)  text-base

Min touch target: 44px height for mobile
Gap between buttons: 8-16px
```

### Cards

```
Padding:     16-24px
Gap between: 16-24px
Border radius: 8-12px
```

### Forms

```
Label margin-bottom: 4-8px
Field padding: 10-14px vertical, 12-16px horizontal
Field height: 40-48px
Gap between fields: 16-24px
Section gap: 32px
```

### Lists

```
Item padding: 12-16px vertical
Gap between items: 0-8px (or use borders)
Indent for nested: 16-24px
```

### Headers/Navigation

```
Height: 56-80px
Horizontal padding: 16-24px
Nav item gap: 16-32px
Logo-to-nav gap: 32-48px
```

### Tables

```
Cell padding: 12-16px
Header: slightly more padding, background color
Row height: 48-56px minimum
```

---

## Decision Framework

### Spacing Decision Tree

```
Is it inside a component?
  → Use padding (16-24px typical)

Is it between related items?
  → Use small gap (8-16px)

Is it between unrelated items?
  → Use large gap (24-48px)

Is it between major sections?
  → Use section spacing (48-80px)
```

### "When to Use What" Quick Reference

| Decision | Guideline |
|----------|-----------|
| Padding or margin? | Padding for component internals, margin/gap for between |
| Tight or loose? | Tight for related items, loose for distinct groups |
| Border or space? | Space for visual separation, border for explicit division |
| Size or weight? | Size for major hierarchy, weight for subtle emphasis |
| Color or gray? | Color for interactive/important, gray for secondary |

---

## Common Mistakes & Fixes

### Mistake 1: Inconsistent Spacing

```
Bad:
- Card A has 20px padding
- Card B has 24px padding
- Card C has 16px padding

Fix:
- All cards use 24px padding
- Follow the 8pt scale
```

### Mistake 2: External < Internal

```
Bad:
┌──────────────────────┐
│     32px padding     │
└──────────────────────┘
     ↕ 8px gap (too tight)
┌──────────────────────┐
│     32px padding     │
└──────────────────────┘

Fix: Gap should be ≥ padding
- Keep 32px padding
- Increase gap to 32-48px
```

### Mistake 3: Wall of Text

```
Bad:
All text is 16px regular gray-700
No headings, no emphasis, no breaks

Fix:
- Add headings (larger, bolder)
- Add spacing between sections
- Use weight for emphasis
- Use color for hierarchy
```

### Mistake 4: Too Many Sizes

```
Bad:
36px, 32px, 28px, 24px, 22px, 20px, 18px, 16px, 14px, 12px

Fix:
36px, 24px, 18px, 16px, 14px, 12px (skip sizes for clear steps)
```

### Mistake 5: Cramped Touch Targets

```
Bad:
24px button height on mobile

Fix:
Minimum 44px touch target (48px recommended)
```

### Mistake 6: Random Colors

```
Bad:
Links are blue, some purple, some teal
Success sometimes green, sometimes blue

Fix:
- Links: always blue-600
- Success: always green-600
- Establish and document color usage
```

---

## Quick Reference Tables

### Spacing Scale (8pt Grid)

| Name | px | rem | Tailwind |
|------|-----|-----|----------|
| 1 | 4 | 0.25 | 1 |
| 2 | 8 | 0.5 | 2 |
| 3 | 12 | 0.75 | 3 |
| 4 | 16 | 1.0 | 4 |
| 5 | 20 | 1.25 | 5 |
| 6 | 24 | 1.5 | 6 |
| 8 | 32 | 2.0 | 8 |
| 10 | 40 | 2.5 | 10 |
| 12 | 48 | 3.0 | 12 |
| 16 | 64 | 4.0 | 16 |

### Type Scale (1.25 ratio)

| Size | px | Line Height | Tailwind |
|------|-----|-------------|----------|
| xs | 12 | 16px | text-xs |
| sm | 14 | 20px | text-sm |
| base | 16 | 24px | text-base |
| lg | 18 | 28px | text-lg |
| xl | 20 | 28px | text-xl |
| 2xl | 24 | 32px | text-2xl |
| 3xl | 30 | 36px | text-3xl |
| 4xl | 36 | 40px | text-4xl |

### Common Component Patterns

```css
/* Card */
.card {
  padding: 24px;        /* space-6 */
  border-radius: 8px;
  gap: 16px;            /* internal gap */
}

/* Button */
.btn {
  padding: 8px 16px;    /* space-2 space-4 */
  border-radius: 6px;
  font-weight: 500;
}

/* Input */
.input {
  padding: 10px 14px;
  height: 40px;
  border-radius: 6px;
}

/* Section */
.section {
  padding: 64px 0;      /* space-16 */
  gap: 48px;            /* space-12 between content */
}
```

---

## The Quality Checklist

Before shipping, verify:

- [ ] All spacing follows the 8pt grid
- [ ] Internal ≤ External spacing rule is followed
- [ ] Typography uses consistent scale
- [ ] Hierarchy is clear (squint test passes)
- [ ] Touch targets are 44px+ on mobile
- [ ] Text contrast meets WCAG 4.5:1
- [ ] Colors are used consistently
- [ ] One clear focal point per screen
- [ ] White space feels intentional, not cramped

---

## Resources

### Tools
- [Contrast checker](https://webaim.org/resources/contrastchecker/)
- [Type scale calculator](https://type-scale.com/)
- [8pt grid in Figma](https://www.figma.com/blog/everything-you-need-to-know-about-layout-grids-in-figma/)

### Further Reading
- [Space in Design Systems](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62)
- [The 8-Point Grid](https://spec.fm/specifics/8-pt-grid)
- [Gestalt Principles](https://www.interaction-design.org/literature/topics/gestalt-principles)
