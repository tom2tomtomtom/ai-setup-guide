---
name: beautiful-ui
description: Make your UI look exceptional by escaping generic template aesthetics with opinionated design taste inspired by Linear and Stripe. Use when you want to make this look better, break out of default shadcn styling, or push a design from "fine" to memorable.
---

# Beautiful UI

The difference between forgettable software and software people love is design taste. This skill is an opinionated design eye — rooted in principles from Linear, Stripe, Rauno Freiberg, Dieter Rams, and Massimo Vignelli — that pushes past safe defaults into interfaces that are beautiful, functional, and memorable.

This is not "make it consistent." This is "make it sing."

---

## When to Use This Skill

Use when:
- Building a new UI from scratch and want it to feel premium, not templated
- Reviewing existing UI that feels "fine but boring"
- Choosing colors, typography, spacing, or motion
- Breaking out of the shadcn/Tailwind default aesthetic
- Making design decisions where the "safe" choice is also the forgettable choice
- Wanting to understand WHY something looks good or bad
- Building a product that competes with Linear, Notion, Arc, or Stripe-tier quality

---

## Tunable Dials

These three parameters let you (or the user) control the creative direction. Adjust per-project or per-component. Defaults are good for most SaaS/product UI.

| Dial | Default | Range | Low (1-3) | Mid (4-6) | High (7-10) |
|------|---------|-------|-----------|-----------|-------------|
| **DESIGN_VARIANCE** | 6 | 1-10 | Symmetric, conventional layouts. Centered heroes, even grids. | Subtle asymmetry, mixed column widths. | Bold asymmetry, broken grids, editorial tension. Centered heroes banned. |
| **MOTION_INTENSITY** | 5 | 1-10 | Transitions only (opacity, color). No spring physics. | Subtle entrance animations, hover feedback, springs on key interactions. | Rich scroll-driven animation, parallax, magnetic hover, staggered entrances everywhere. |
| **VISUAL_DENSITY** | 4 | 1-10 | Maximum whitespace, editorial spacing, one element per viewport. | Balanced content-to-space ratio, comfortable sections. | Data-dense dashboards, tight grids, compact components. |

**How to use:** If a user says "make it more editorial," raise DESIGN_VARIANCE to 8 and lower VISUAL_DENSITY to 2. For a dense dashboard, raise VISUAL_DENSITY to 8 and lower DESIGN_VARIANCE to 3. The dials interact — high variance + high density = chaotic, so keep them balanced.

---

## The 10 Commandments

Before anything else. These are non-negotiable.

1. **Have a point of view.** Opinionated software feels premium. Flexible-everything feels like a template. Decide how your product should be used and design for that opinion.

2. **Earn every element.** If it doesn't help the user accomplish their goal, remove it. Every border, shadow, icon, and animation must justify its existence.

3. **One accent color.** Everything else is grayscale. One strong color used sparingly has 10x more impact than a rainbow palette.

4. **Spacing is the design.** Inconsistent spacing is the #1 tell of amateur work. It's invisible to non-designers but creates a subconscious feeling of "something's off." Use a scale religiously.

5. **Typography IS the interface.** You don't need illustrations or fancy graphics. A well-set type scale with intentional weight, size, and color hierarchy is the entire aesthetic.

6. **Remove borders.** Borders everywhere make UI feel heavy and cheap. Use background color differences and spacing for separation. When borders are necessary, use very low opacity (8-12%).

7. **Generous whitespace signals quality.** Cramped layouts feel cheap. Luxury brands know this. More breathing room than you think you need.

8. **Animation is not decoration.** Every motion must serve a purpose: feedback, spatial orientation, or performance perception. If it doesn't serve one of those, delete it.

9. **Details are the product.** The difference between amateur and professional is hundreds of small things done right. Letter-spacing on headings. Consistent icon sizes. Smooth transitions. These compound.

10. **Design for the squint test.** Squint at your screen. If the hierarchy isn't immediately clear — what's most important, what's secondary, what's tertiary — fix the hierarchy before touching anything else.

---

## Color: Creating Mood, Not Just Matching

### Use OKLCH, Not HSL

HSL lies about perceived brightness. Blue at `hsl(240, 100%, 50%)` looks dramatically darker than yellow at `hsl(60, 100%, 50%)` despite identical lightness values.

OKLCH is perceptually uniform — lightness 0.7 actually looks like 0.7 regardless of hue. Tailwind v4 adopted it. Browser support is 93%+. Use it.

```css
/* OKLCH: predictable, perceptually uniform */
--brand: oklch(0.65 0.25 25);        /* warm red */
--brand-hover: oklch(0.60 0.25 25);  /* darken by reducing L */
--brand-light: oklch(0.90 0.08 25);  /* desaturate + lighten for backgrounds */

/* Dark surface system — each step is an equal perceptual jump */
--surface-0: oklch(0.13 0.01 260);   /* deepest background */
--surface-1: oklch(0.17 0.01 260);   /* card/raised surface */
--surface-2: oklch(0.21 0.01 260);   /* hover/active surface */
--surface-3: oklch(0.25 0.01 260);   /* elevated/overlay */
```

### The Opacity System (Linear's Approach)

Instead of defining 47 specific gray shades:

```css
/* Light mode text hierarchy */
--text-primary: oklch(0.15 0 0);           /* near-black */
--text-secondary: oklch(0.15 0 0 / 0.6);  /* 60% — secondary */
--text-tertiary: oklch(0.15 0 0 / 0.4);   /* 40% — captions, metadata */
--text-disabled: oklch(0.15 0 0 / 0.25);  /* 25% — disabled */

/* Dark mode text hierarchy */
--text-primary: oklch(0.95 0 0);           /* near-white */
--text-secondary: oklch(0.95 0 0 / 0.65); /* 65% */
--text-tertiary: oklch(0.95 0 0 / 0.4);   /* 40% */
--text-disabled: oklch(0.95 0 0 / 0.25);  /* 25% */
```

This automatically adapts to any background and maintains consistent visual weight. It's what Linear does and why their themes feel cohesive regardless of the base color.

### Color Personality Signatures

Your neutral gray is NOT neutral. It carries a mood:

| Tint added to gray | Feeling | Used by |
|---|---|---|
| Blue tint | Trust, technical, calm | Linear, GitHub, Stripe |
| Warm/yellow tint | Friendly, approachable | Notion, Slack |
| Green tint | Natural, fresh, growth | Spotify, Shopify |
| No tint (pure gray) | Stark, editorial, brutalist | Apple, AIDEN |
| Violet tint | Creative, premium, modern | Arc, Figma |

Pick your tint. Apply it to ALL your grays at very low chroma (0.005-0.015 in OKLCH). This is a subtle but powerful differentiation from generic zinc/slate.

```css
/* Blue-tinted neutrals (technical, trustworthy) */
--neutral-50: oklch(0.97 0.005 250);
--neutral-100: oklch(0.93 0.005 250);
--neutral-200: oklch(0.87 0.008 250);
--neutral-300: oklch(0.75 0.008 250);
--neutral-400: oklch(0.60 0.010 250);
--neutral-500: oklch(0.50 0.010 250);
--neutral-600: oklch(0.40 0.010 250);
--neutral-700: oklch(0.30 0.010 250);
--neutral-800: oklch(0.20 0.008 250);
--neutral-900: oklch(0.13 0.008 250);
--neutral-950: oklch(0.08 0.005 250);
```

### Gradient Rules

Gradients should be subtle and purposeful, not flashy:
- Use **analogous hues** (close on the color wheel) — max 30 degrees apart
- Add a **chroma shift**, not just a lightness shift
- Mesh gradients (multiple radial gradients layered) create organic depth that linear gradients can't
- For backgrounds: max 5% opacity on the gradient layer — you should barely notice it

```css
/* Subtle brand gradient — barely there but adds warmth */
.surface-gradient {
  background:
    radial-gradient(ellipse at 20% 50%, oklch(0.65 0.15 25 / 0.04), transparent 50%),
    radial-gradient(ellipse at 80% 20%, oklch(0.65 0.15 45 / 0.03), transparent 50%),
    var(--surface-0);
}
```

---

## Typography: The Entire Aesthetic

### The Single-Family Strategy

Following Vignelli: **one font family**. Hierarchy comes from weight, size, and color — not from stacking fonts.

Amateurs reach for a second font. Professionals get more range from one:

```css
/* System: One family, full hierarchy */
--font-body: 'Inter', system-ui, sans-serif;

/* Weight hierarchy */
--weight-normal: 400;    /* body text */
--weight-medium: 500;    /* emphasis, subheads */
--weight-semibold: 600;  /* section headings */
--weight-bold: 700;      /* page titles, hero text */
```

**When to use a second font:** Only when the contrast is dramatic and intentional — a serif display font for hero headlines paired with a clean sans-serif for everything else. Never two sans-serifs. Never "similar but different."

### Font Choices That Signal Taste (2025-2026)

| Font | Character | Best for |
|---|---|---|
| **Geist** (Vercel) | Modern, friendly, excellent at small sizes | SaaS products, dashboards |
| **Inter** | Workhorse, clean, neutral | Default choice but customize it heavily |
| **Satoshi** | Geometric, distinctive, personality | Marketing sites, headings |
| **Cabinet Grotesk** | Bold, characterful, editorial | Hero text, statements |
| **General Sans** | Variable, flexible, modern | When you need nuanced weight control |
| **Instrument Serif** | Elegant, editorial, contrast | Display headlines paired with sans body |
| **Fraunces** | Wonky, warm, memorable | Brands wanting warmth + distinctiveness |
| **JetBrains Mono** | Technical, precise | Code, data, monospace contexts |

### Type Scale: Ratios That Create Tension

Don't use arbitrary sizes. Use a ratio:

| Ratio | Name | Feeling | Best for |
|---|---|---|---|
| 1.200 | Minor third | Tight, dense, information-heavy | Dashboards, data apps |
| 1.250 | Major third | Balanced, versatile | Most applications |
| 1.333 | Perfect fourth | Open, editorial, dramatic | Marketing, content sites |
| 1.500 | Perfect fifth | Bold, high-contrast | Landing pages, hero sections |

```css
/* Major third scale (1.250) from 16px base */
--text-xs: 0.64rem;    /* 10.24px — labels, badges */
--text-sm: 0.8rem;     /* 12.8px — captions, metadata */
--text-base: 1rem;     /* 16px — body text */
--text-lg: 1.25rem;    /* 20px — subheadings */
--text-xl: 1.563rem;   /* 25px — section heads */
--text-2xl: 1.953rem;  /* 31.25px — page titles */
--text-3xl: 2.441rem;  /* 39px — hero subhead */
--text-4xl: 3.052rem;  /* 48.8px — hero headline */
--text-5xl: 3.815rem;  /* 61px — display */

/* Fluid sizing — adapts to viewport without breakpoints */
--text-hero: clamp(2.5rem, 5vw + 1rem, 4.5rem);
```

### Letter-Spacing: The Invisible Differentiator

This is one of the most common amateur mistakes. Large text needs tighter tracking. ALL-CAPS needs wider tracking.

```css
/* Headlines: tighten tracking */
h1, h2, h3 { letter-spacing: -0.02em; }

/* Hero/display text: tighten more */
.text-hero { letter-spacing: -0.03em; }

/* ALL-CAPS: always widen */
.uppercase { letter-spacing: 0.05em; }

/* Small text / labels: slight widening improves readability */
.text-xs, .text-sm { letter-spacing: 0.01em; }

/* Body text: leave at default (0) */
```

### Line-Height Rules

```css
/* Tight for headings — creates visual density and impact */
h1 { line-height: 1.1; }
h2 { line-height: 1.15; }
h3 { line-height: 1.2; }

/* Comfortable for body — readability */
p, li { line-height: 1.5; }

/* Generous for small text — prevents cramping */
.text-sm { line-height: 1.6; }
```

### Non-Negotiable Type Settings

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1;
}

/* Tabular numbers wherever numbers change */
.tabular-nums,
table td,
[data-timer],
.price,
.stat {
  font-variant-numeric: tabular-nums;
}

/* Prevent iOS zoom on input focus */
input, select, textarea {
  font-size: max(16px, 1rem);
}

/* Optimal line length for readability */
.prose { max-width: 65ch; } /* 45-75ch range, 65 optimal */
```

---

## Spacing: The Skeleton of Quality

### The Scale

Use a 4px base with an 8px primary grid. Every spacing value in your app should come from this scale:

```
4  8  12  16  20  24  32  40  48  64  80  96  128
```

Map to Tailwind:
```
1  2  3   4   5   6   8   10  12  16  20  24  32
```

### The Proximity Principle

Elements that are related must be closer together than elements that are not. This sounds obvious but is violated constantly.

**The Rule:** Internal spacing (padding) should always be less than or equal to external spacing (gap/margin) for grouped elements.

```
WRONG:                          RIGHT:
┌────────────────────┐          ┌────────────────────┐
│                    │          │                    │
│  Label             │          │  Label             │
│                    │          │  Input              │
│  Input             │          │                    │
│                    │          └────────────────────┘
└────────────────────┘                ↕ 24px gap
      ↕ 8px gap                 ┌────────────────────┐
┌────────────────────┐          │                    │
│  Label             │          │  Label             │
│  Input             │          │  Input              │
└────────────────────┘          │                    │
                                └────────────────────┘

Label-to-input: 4-8px (tight, they're related)
Group-to-group: 24-32px (loose, they're separate)
```

### Spacing Creates Hierarchy

```
Component padding:    12-16px (snug, contained)
Card padding:         20-24px (breathing room)
Section padding:      48-64px (generous, structural)
Page margins:         24-48px (depending on breakpoint)

Inline element gap:   8px (icons + text, badge groups)
Form field gap:       16-20px (between label-input pairs)
Card gap:             16-24px (in a grid)
Section gap:          64-96px (between major page sections)
```

### The Whitespace Multiplier

Premium products use more whitespace than you think they need. When in doubt, add more.

| Context | Amateur spacing | Premium spacing |
|---|---|---|
| Section padding | 32px | 64-96px |
| Card padding | 12px | 20-24px |
| Between sections | 40px | 80-128px |
| Hero vertical padding | 60px | 120-160px |
| Between heading and body | 8px | 16-24px |

---

## Layout: Creating Visual Interest

### Editorial Thinking

The most visually interesting layouts borrow from magazine design. Think in viewport-sized "scenes," not infinite scroll.

**Each viewport should have:**
- One clear focal point
- Supporting content at a lower visual priority
- Breathing room (negative space is a design element)

### The 12-Column Grid (Vignelli)

12 columns because 12 divides into 2, 3, 4, and 6 — maximum flexibility:

```css
.grid-editorial {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Content width variations */
.col-narrow { grid-column: 3 / 11; }  /* 8/12 — articles, focused content */
.col-medium { grid-column: 2 / 12; }  /* 10/12 — general content */
.col-wide { grid-column: 1 / -1; }    /* full — hero, images, tables */

/* Asymmetric split — creates tension */
.col-main { grid-column: 1 / 8; }     /* 7/12 — primary content */
.col-aside { grid-column: 9 / 13; }   /* 4/12 — sidebar, annotations */
```

### Breaking the Grid (Intentionally)

Visual tension comes from controlled rule-breaking. Design on a strict grid first, then let ONE element per section escape.

**Techniques:**
- **Full-bleed image** that extends past the content container
- **Oversized headline** that spans more columns than body text
- **Pull quote** positioned asymmetrically
- **One off-grid element per section.** Two is chaos. One is intentional.

```jsx
{/* Content stays in the grid */}
<div className="max-w-3xl mx-auto px-6">
  <h2 className="text-2xl font-semibold tracking-tight">Section Title</h2>
  <p className="text-base text-secondary mt-4 leading-relaxed">Body content...</p>
</div>

{/* Image breaks the grid — extends full width */}
<div className="-mx-6 md:-mx-12 lg:-mx-24 my-16">
  <img className="w-full" src="..." alt="..." />
</div>

{/* Back to the grid */}
<div className="max-w-3xl mx-auto px-6">
  <p>Content continues...</p>
</div>
```

### Contrast as Layout Tool

The fundamental source of visual interest is contrast in ALL its forms:

| Contrast Type | Example | Effect |
|---|---|---|
| **Scale** | 48px headline next to 14px caption | Dramatic hierarchy |
| **Weight** | 300 light text near 700 bold text | Visual tension |
| **Color** | One saturated element in desaturated layout | Focal point |
| **Spacing** | Tight cluster next to generous whitespace | Rhythm |
| **Alignment** | One centered element in left-aligned layout | Emphasis |
| **Density** | Dense data table next to spacious hero | Pacing |

**The rule:** If everything has the same visual weight, nothing has emphasis. Create contrast deliberately.

### Pacing and Rhythm

Alternate between dense and sparse sections:

```
HERO (sparse, generous whitespace)
  ↓
FEATURES (medium density, 3-column grid)
  ↓
TESTIMONIAL (sparse, centered, large text)
  ↓
DETAILS (dense, data-rich, compact)
  ↓
CTA (sparse, focused, generous padding)
```

---

## Motion: Life Without Theater

### The Frequency/Novelty Framework (Rauno Freiberg)

This is the most important principle in UI animation:

| Frequency | Novelty | Animation | Example |
|---|---|---|---|
| **High** | **Low** | **None. Instant.** | Context menus, list additions, tab switches |
| **Medium** | **Medium** | **Subtle, fast (150-200ms)** | Navigation, page transitions, dropdowns |
| **Low** | **High** | **Rich, expressive** | First-time modals, success celebrations, onboarding |

**The deadly sin:** Animating everything. Every dropdown, every hover, every state change. This makes the app feel slow and theatrical. High-frequency actions must be INSTANT.

### Duration Rules

```css
/* Interactions (hover, press, toggle): FAST */
--duration-instant: 100ms;
--duration-fast: 150ms;

/* UI transitions (modals, panels, navigation): MODERATE */
--duration-normal: 200ms;
--duration-moderate: 300ms;

/* Entrances, celebrations, onboarding: EXPRESSIVE */
--duration-slow: 400ms;
--duration-expressive: 600ms;

/* NEVER exceed 600ms for any UI animation */
```

### Spring Physics Over Cubic-Bezier

Real objects don't move in cubic-bezier curves. Springs feel natural because they have physical properties:

```jsx
// Framer Motion — springs by default
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    type: "spring",
    stiffness: 400,   // higher = snappier
    damping: 30,       // higher = less bounce
    mass: 0.8          // lower = faster response
  }}
/>

// Scale values proportional to element size (Rauno's rule)
// Dialogs: scale from 0.95 (large element, subtle scale)
// Buttons: compress to 0.97 (small element, even subtler)
// Tooltips: scale from 0.92 (small, can be more dramatic)
```

### Interruptibility

Animations MUST be interruptible. A user should never feel trapped in a transition.

```jsx
// Framer Motion handles this automatically with layout animations
<motion.div layout transition={{ type: "spring", stiffness: 500, damping: 35 }}>
  {/* User can trigger new state mid-animation — it smoothly redirects */}
</motion.div>
```

### Staggered Entrances

When multiple elements appear, stagger them. But keep total stagger under 300ms — after that it feels like watching a slideshow.

```jsx
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,  // 40ms between each child
      delayChildren: 0.02,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i} variants={item} />)}
</motion.ul>
```

### Hover States That Feel Alive

```jsx
/* Button: subtle scale + shadow lift */
<motion.button
  whileHover={{ y: -1 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
  className="transition-shadow hover:shadow-md"
>

/* Card: gentle lift */
<motion.div
  whileHover={{ y: -2 }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  className="transition-shadow duration-200 hover:shadow-lg"
>

/* Link: NOT scale. Use underline animation or color shift. */
/* Scaling text looks wrong — it blurs subpixel rendering. */
```

### What NOT to Animate

- Text color changes (causes repaint, feels janky)
- Width/height (causes reflow — use transform: scale instead)
- Border-radius changes (expensive, rarely smooth)
- Anything the user triggers more than 5 times per minute

---

## Borders, Shadows, and Depth

### The Border Diet

Borders are the most overused element in UI. Remove them wherever possible.

**Instead of borders, use:**
- **Background color difference** (surface-0 behind surface-1 cards)
- **Spacing** (gap alone creates clear separation)
- **Subtle shadow** (indicates elevation without visual clutter)

**When borders are necessary:**
```css
/* Almost invisible — just enough to define edges */
--border-subtle: 1px solid oklch(0.50 0 0 / 0.08);  /* light mode */
--border-subtle: 1px solid oklch(0.90 0 0 / 0.08);  /* dark mode */

/* Slightly more visible for interactive elements */
--border-default: 1px solid oklch(0.50 0 0 / 0.15);
```

### Layered Shadows

Single `box-shadow` values look flat and harsh. Layer multiple shadows for realistic depth:

```css
/* Elevation 1 — cards, raised surfaces */
--shadow-sm:
  0 1px 2px oklch(0.15 0 0 / 0.04),
  0 1px 3px oklch(0.15 0 0 / 0.06);

/* Elevation 2 — dropdowns, popovers */
--shadow-md:
  0 2px 4px oklch(0.15 0 0 / 0.04),
  0 4px 12px oklch(0.15 0 0 / 0.08);

/* Elevation 3 — modals, dialogs */
--shadow-lg:
  0 4px 8px oklch(0.15 0 0 / 0.04),
  0 8px 24px oklch(0.15 0 0 / 0.10),
  0 24px 48px oklch(0.15 0 0 / 0.06);

/* Elevation 4 — overlay, command palette */
--shadow-xl:
  0 8px 16px oklch(0.15 0 0 / 0.06),
  0 16px 48px oklch(0.15 0 0 / 0.12),
  0 48px 96px oklch(0.15 0 0 / 0.08);
```

### Texture and Grain

A subtle noise texture prevents the "too-clean digital" feel. 2-4% opacity:

```css
/* SVG noise texture overlay */
.surface-textured::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

---

## Escaping the Template Look

### The shadcn Sameness Problem

Most shadcn apps look identical because developers don't customize the defaults. Here's how to break out:

### 1. Change the Border Radius

The 6-8px radius is the biggest shadcn tell. Pick a personality:

| Radius | Feeling | Products |
|---|---|---|
| 0-2px | Sharp, technical, editorial | Linear, Bloomberg, AIDEN |
| 4-6px | Balanced, neutral, professional | GitHub, Notion |
| 8-12px | Soft, friendly, modern | Slack, Discord |
| 14-20px | Playful, warm, consumer | Duolingo, Spotify |
| Full/pill | Bubbly, approachable | Apple, Arc |

**Be consistent.** Don't mix 4px buttons with 16px cards with pill badges. Pick your radius and scale it:

```css
--radius-sm: 4px;     /* inputs, badges */
--radius-md: 6px;     /* buttons, small cards */
--radius-lg: 8px;     /* cards, modals */
--radius-xl: 12px;    /* large panels, sheets */
```

### 2. Tint Your Neutrals

Default zinc/slate is the most recognizable template tell. Add a personality tint (see Color section).

### 3. Customize Component Proportions

Default shadcn components use safe, average proportions. Adjust:

```css
/* Default button: py-2 px-4 (8px 16px) — safe but generic */
/* Technical/dense: py-1.5 px-3 (6px 12px) */
/* Premium/spacious: py-2.5 px-5 (10px 20px) */

/* Taller inputs signal quality */
/* Default: h-10 (40px) */
/* Premium: h-11 or h-12 (44-48px) with text-sm */
```

### 4. Weight Your Buttons Differently

Default buttons have medium contrast. Stand out by making primary buttons heavier:

```jsx
// Generic: same border-radius, standard padding
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">

// Better: distinctive primary with clear visual weight
<button className="bg-foreground text-background px-5 py-2.5 rounded-lg
  font-medium tracking-tight shadow-sm
  hover:shadow-md transition-shadow duration-150">
```

### 5. Add Motion Primitives

Static templates feel lifeless. Add the specific animations from the Motion section — but only where they serve a purpose.

---

## Component Recipes: Beautiful Defaults

### Card That Breathes

```jsx
<div className="group relative rounded-xl bg-surface-1 p-6
  border border-transparent hover:border-neutral-200/10
  transition-all duration-200
  hover:shadow-lg hover:-translate-y-0.5">

  <div className="flex items-start justify-between">
    <div>
      <h3 className="text-base font-semibold tracking-tight text-primary">
        Card Title
      </h3>
      <p className="mt-1.5 text-sm text-secondary leading-relaxed max-w-prose">
        Description text that explains the content clearly.
      </p>
    </div>
    <ChevronRight className="h-4 w-4 text-tertiary opacity-0 group-hover:opacity-100
      transition-opacity duration-200 -translate-x-1 group-hover:translate-x-0" />
  </div>
</div>
```

### Input That Feels Solid

```jsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-primary tracking-tight">
    Email address
  </label>
  <input
    type="email"
    className="h-11 w-full rounded-lg bg-surface-1 px-3.5 text-sm text-primary
      border border-neutral-200/15
      placeholder:text-tertiary
      focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand
      transition-colors duration-150"
    placeholder="you@example.com"
  />
  <p className="text-xs text-tertiary">We'll never share your email.</p>
</div>
```

### Button System

```jsx
/* Primary — maximum visual weight */
<button className="h-10 px-4 rounded-lg bg-foreground text-background
  text-sm font-medium tracking-tight
  hover:opacity-90 active:scale-[0.98]
  transition-all duration-100">
  Primary Action
</button>

/* Secondary — clear but subordinate */
<button className="h-10 px-4 rounded-lg bg-surface-1
  text-sm font-medium text-primary
  border border-neutral-200/15
  hover:bg-surface-2 active:scale-[0.98]
  transition-all duration-100">
  Secondary
</button>

/* Ghost — minimal, for tertiary actions */
<button className="h-10 px-4 rounded-lg
  text-sm font-medium text-secondary
  hover:bg-surface-1 hover:text-primary
  transition-colors duration-100">
  Ghost
</button>

/* Danger — red but not screaming */
<button className="h-10 px-4 rounded-lg bg-red-500/10 text-red-500
  text-sm font-medium
  hover:bg-red-500/15 active:scale-[0.98]
  transition-all duration-100">
  Delete
</button>
```

### Navigation That Knows Its Place

```jsx
<nav className="flex items-center h-14 px-4 border-b border-neutral-200/8">
  {/* Logo — do NOT make it oversized */}
  <div className="flex items-center gap-2 mr-8">
    <Logo className="h-5 w-5" />
    <span className="text-sm font-semibold tracking-tight">Product</span>
  </div>

  {/* Links — subtle until active */}
  <div className="flex items-center gap-1">
    {links.map(link => (
      <a
        key={link.href}
        href={link.href}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm transition-colors duration-100",
          isActive
            ? "text-primary font-medium bg-surface-1"
            : "text-secondary hover:text-primary"
        )}
      >
        {link.label}
      </a>
    ))}
  </div>

  {/* Right side — secondary actions */}
  <div className="ml-auto flex items-center gap-2">
    <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5
      text-[11px] text-tertiary bg-surface-1 rounded border border-neutral-200/10
      font-mono">
      <span className="text-[10px]">&#8984;</span>K
    </kbd>
  </div>
</nav>
```

### Empty State That Delights

```jsx
<div className="flex flex-col items-center justify-center py-24 px-6 text-center">
  {/* Icon — muted, not dominating */}
  <div className="h-12 w-12 rounded-xl bg-surface-1 flex items-center justify-center mb-4">
    <InboxIcon className="h-5 w-5 text-tertiary" />
  </div>

  <h3 className="text-base font-semibold text-primary tracking-tight">
    No messages yet
  </h3>
  <p className="mt-1.5 text-sm text-secondary max-w-sm leading-relaxed">
    When you receive messages, they'll appear here. Start a conversation to get going.
  </p>

  <button className="mt-6 h-9 px-4 rounded-lg bg-foreground text-background
    text-sm font-medium tracking-tight
    hover:opacity-90 transition-opacity">
    New message
  </button>
</div>
```

---

## Dark Mode: Not An Afterthought

### Surface System

Dark mode is not "invert the colors." It's a separate elevation system:

```css
:root[data-theme="dark"] {
  /* Surfaces get LIGHTER as they elevate (opposite of light mode shadows) */
  --surface-0: oklch(0.13 0.01 260);  /* page background */
  --surface-1: oklch(0.17 0.01 260);  /* card, sidebar */
  --surface-2: oklch(0.21 0.01 260);  /* hover, active */
  --surface-3: oklch(0.25 0.01 260);  /* dropdown, dialog */

  /* Text uses higher opacity against dark backgrounds */
  --text-primary: oklch(0.95 0 0);
  --text-secondary: oklch(0.95 0 0 / 0.65);
  --text-tertiary: oklch(0.95 0 0 / 0.4);

  /* Borders become more visible at low opacity */
  --border: oklch(1 0 0 / 0.08);

  /* Brand color often needs lightness adjustment for dark backgrounds */
  --brand: oklch(0.70 0.22 25);  /* slightly lighter than light mode */
}
```

### Dark Mode Shadows

Shadows barely work on dark backgrounds. Use border-light and surface elevation instead:

```css
/* Light mode: shadows create depth */
.card { box-shadow: var(--shadow-sm); }

/* Dark mode: borders + background create depth */
:root[data-theme="dark"] .card {
  box-shadow: none;
  border: 1px solid oklch(1 0 0 / 0.06);
  background: var(--surface-1);
}
```

---

## Responsive: Mobile Is Not Smaller Desktop

### Touch Targets

44px minimum. This is an Apple HIG requirement, not a suggestion.

```css
/* Touch-friendly minimum */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Padding-based approach for text buttons */
.btn-mobile {
  padding: 12px 16px;  /* results in ~44px height with text */
}
```

### Mobile Typography

Don't just scale down. Adjust the relationship:

```css
/* Desktop: large range, dramatic hierarchy */
h1 { font-size: 3rem; }      /* 48px */
body { font-size: 1rem; }     /* 16px */
/* Ratio: 3:1 */

/* Mobile: compressed range, subtler hierarchy */
h1 { font-size: 1.75rem; }   /* 28px */
body { font-size: 1rem; }     /* 16px — SAME as desktop */
/* Ratio: 1.75:1 */
```

### Hover vs Touch

```css
/* Only show hover styles on devices that support hover */
@media (hover: hover) {
  .card:hover { background: var(--surface-2); }
}

/* Touch devices get active/pressed states instead */
@media (hover: none) {
  .card:active { background: var(--surface-2); }
}
```

---

## The Quality Checklist

Before shipping any interface, verify:

### Hierarchy (Squint Test)
- [ ] Squint at the screen — is the most important thing immediately obvious?
- [ ] Are there exactly 3-4 levels of visual hierarchy on each screen?
- [ ] Does every element have a clear "job" (primary, secondary, tertiary, or structural)?

### Typography
- [ ] Headlines have tighter tracking (-0.02em to -0.03em)?
- [ ] ALL-CAPS text has wider tracking (+0.05em)?
- [ ] Body text line-height is 1.5-1.6?
- [ ] Heading line-height is 1.1-1.2?
- [ ] Max line length is 45-75 characters?
- [ ] Font smoothing is antialiased?
- [ ] Numbers in tables/data use tabular-nums?

### Spacing
- [ ] All values come from the spacing scale (no magic numbers)?
- [ ] Related elements are closer together than unrelated elements?
- [ ] Sections have generous padding (64px+)?
- [ ] There's more whitespace than you think you need?

### Color
- [ ] One accent color with grayscale for everything else?
- [ ] Neutrals have a consistent tint (not pure gray)?
- [ ] Text hierarchy uses opacity, not separate color values?
- [ ] Brand color has WCAG AA contrast ratio (4.5:1 for text, 3:1 for large text)?

### Motion
- [ ] High-frequency actions have NO animation?
- [ ] All interaction animations are under 200ms?
- [ ] Animations are interruptible?
- [ ] Spring physics used instead of linear/ease?

### Polish
- [ ] No default shadcn border-radius (customized to match brand)?
- [ ] Borders removed where spacing or background can do the job?
- [ ] Empty states are designed (not just "No data")?
- [ ] Loading states feel fast (skeleton, not spinner)?
- [ ] Error states are helpful (not just red text)?
- [ ] Focus rings are visible and styled?
- [ ] Hover states use `@media (hover: hover)`?

---

## Anti-Pattern Reference

### Designs That Feel Generic

| Problem | Why it happens | Fix |
|---|---|---|
| Everything looks like shadcn | Default config not customized | Change radius, neutrals, proportions, and add motion |
| Flat and lifeless | No elevation system | Add layered shadows and surface hierarchy |
| "Something feels off" | Inconsistent spacing | Audit every value against the spacing scale |
| Nothing stands out | Equal visual weight everywhere | Create contrast: one focal point per section |
| Feels cheap | Too many borders, too little whitespace | Remove borders, add generous padding |
| Feels slow | Everything animates | Remove animation from high-frequency actions |
| Feels dated | Following 2020 trends (heavy glassmorphism, gradient everything) | Use restraint: subtle textures, purposeful color |
| Looks like Bootstrap | Regular grid with no variation | Break the grid with one element per section |
| "It's fine" (worst feedback) | Playing it safe on every decision | Take a stance: pick ONE bold choice per screen |

### The "It's Fine" Trap

The most dangerous feedback is "it looks fine." Fine means forgettable. Fine means nobody will screenshot your app and share it. Fine means you played every decision safe.

Break out with ONE bold choice per screen:
- An unexpectedly large heading
- A single element with high color saturation in an otherwise muted palette
- Dramatic whitespace where others would cram content
- A type treatment that draws the eye (a pull quote, a large number, a single word)

You don't need to be bold everywhere. One confident decision per screen is enough to elevate the entire experience.

---

## AI Tells: Forbidden Patterns

These are the dead giveaways that a UI was generated by AI rather than designed by a human. Catch and fix these before they ship.

### Layout Tells
- **Centered hero with centered subtext and centered CTA** — the most common AI layout. Break symmetry: left-align the hero text, use asymmetric columns, or offset the CTA.
- **3-column equal card grid** — AI's default "features section." Use mixed column widths, a 2-column layout with one large + two stacked small, or a list/table instead.
- **Identical card heights with identical padding** — real designs have visual hierarchy even in grids. Vary card sizes or make one card a "featured" size.
- **Everything centered on every section** — alternate between left-aligned and centered sections. A fully centered page has no visual tension.

### Content Tells
- **"Acme Corp", "John Doe", "Jane Smith"** — generic placeholder names. Use realistic but unique names.
- **Round numbers** — "$100.00", "1,000 users", "99.9% uptime". Real data is messy: "$127.43", "1,847 users", "99.97% uptime".
- **AI copywriting cliches** — "Elevate your workflow", "Seamless integration", "Unleash the power of", "Cutting-edge", "Revolutionize", "Transform your", "Supercharge", "Next-generation". Use concrete, specific language instead.
- **Lorem ipsum** still present anywhere in the final output.
- **Emoji as icons** — use a proper icon library (Lucide, Heroicons, etc.), not emoji characters in UI elements.

### Visual Tells
- **Purple/blue AI gradient** — the "AI product" gradient cliche. Pick a unique brand color.
- **Oversaturated accents** — AI tends to pick eye-burning saturated colors. Keep chroma under 0.20 in OKLCH.
- **No hover states** — AI often generates static layouts with no interactive feedback.
- **Missing empty/error/loading states** — only the "happy path" is designed.
- **Default shadcn styling with zero customization** — unchanged border-radius, default zinc palette, standard component proportions.
- **Glassmorphism everywhere** — one glassmorphic element can be a nice touch. Three is a template.

### Structural Tells
- **No mobile consideration** — desktop-only layouts that break below 768px.
- **`h-screen` instead of `min-h-[100dvh]`** — causes iOS Safari viewport issues.
- **`<div onClick>` instead of `<button>`** — semantic HTML matters for accessibility.
- **Decorative animations on everything** — real products animate sparingly and purposefully.
- **No z-index discipline** — random z-index values (999, 9999) instead of a defined scale.

### The Fix Mindset
When you catch an AI tell, don't just fix the symptom. Ask: "What would a designer with taste do here?" The answer is almost always: remove something, add asymmetry, or make one element bolder while making everything else quieter.

---

## References

- [Rauno Freiberg — Web Interface Guidelines](https://interfaces.rauno.me/)
- [Rauno Freiberg — Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)
- [Linear — How We Redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Karri Saarinen — 10 Rules for Crafting Products](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/)
- [Josh Comeau — Spring Physics in Animation](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)
- [Evil Martians — OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Dieter Rams — 10 Principles of Good Design](https://www.interaction-design.org/literature/article/dieter-rams-10-timeless-commandments-for-good-design)
- [The Vignelli Canon](https://www.rit.edu/vignellicenter/sites/rit.edu.vignellicenter/files/documents/The%20Vignelli%20Canon.pdf)
