---
name: accessibility-patterns
description: Web accessibility patterns including WCAG compliance, ARIA, keyboard navigation, and screen reader support; use when building inclusive applications
---

# Accessibility Patterns

Build applications that work for everyone, regardless of ability.

## When to Use This Skill

Use when:
- Building any user interface
- Implementing interactive components
- Adding forms and inputs
- Creating navigation patterns
- Ensuring WCAG compliance

## Core Principles (POUR)

| Principle | Meaning | Examples |
|-----------|---------|----------|
| **Perceivable** | Users can perceive content | Alt text, captions, contrast |
| **Operable** | Users can interact | Keyboard navigation, time limits |
| **Understandable** | Users can understand | Clear language, predictable behavior |
| **Robust** | Works with assistive tech | Valid HTML, ARIA |

## Semantic HTML

### Use the Right Elements
```typescript
// ❌ Divs for everything
<div onClick={handleClick}>Click me</div>
<div>Welcome to our site</div>
<div>Navigation links</div>

// ✅ Semantic elements
<button onClick={handleClick}>Click me</button>
<h1>Welcome to our site</h1>
<nav>Navigation links</nav>

// Semantic structure
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <section>...</section>
  </article>
  <aside>Related content</aside>
</main>
<footer>...</footer>
```

### Headings Hierarchy
```typescript
// ❌ Skipped levels, chosen for styling
<h1>Page Title</h1>
<h4>Section</h4>  {/* Skipped h2, h3 */}

// ✅ Logical hierarchy
<h1>Page Title</h1>
<h2>Main Section</h2>
<h3>Subsection</h3>
<h2>Another Section</h2>

// Style independently of semantics
<h2 className="text-sm">Small but important heading</h2>
```

## Keyboard Navigation

### Focus Management
```typescript
// ✅ All interactive elements are focusable
<button>Focusable by default</button>
<a href="/page">Focusable by default</a>
<input type="text" /> {/* Focusable by default */}

// For custom interactive elements
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Custom button
</div>

// Remove from tab order (but keep programmatically focusable)
<div tabIndex={-1} ref={modalRef}>Modal content</div>
```

### Focus Visible
```css
/* ❌ Never remove focus outline completely */
*:focus { outline: none; }

/* ✅ Style focus for keyboard users */
*:focus-visible {
  outline: 2px solid #4A90D9;
  outline-offset: 2px;
}

/* Tailwind */
focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
```

### Skip Links
```typescript
// Allow keyboard users to skip navigation
function Layout({ children }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white"
      >
        Skip to main content
      </a>
      <header>
        <nav>{/* Long navigation */}</nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
```

### Keyboard Patterns for Widgets

```typescript
// Tab list - arrow keys to navigate, tab to leave
function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        setActiveIndex((i) => (i + 1) % tabs.length);
        break;
      case 'ArrowLeft':
        setActiveIndex((i) => (i - 1 + tabs.length) % tabs.length);
        break;
      case 'Home':
        setActiveIndex(0);
        break;
      case 'End':
        setActiveIndex(tabs.length - 1);
        break;
    }
  };

  return (
    <div role="tablist" onKeyDown={handleKeyDown}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={index === activeIndex}
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

## ARIA

### When to Use ARIA
```typescript
// Rule 1: Don't use ARIA if native HTML works
// ❌ Unnecessary ARIA
<div role="button" aria-pressed="false">Click</div>

// ✅ Native HTML
<button>Click</button>

// Rule 2: Use ARIA to enhance, not replace
// ✅ ARIA for dynamic content
<div aria-live="polite" aria-atomic="true">
  {message}
</div>

// ✅ ARIA for custom widgets
<div
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls="listbox-id"
>
  ...
</div>
```

### Common ARIA Patterns

```typescript
// Labeling
<button aria-label="Close dialog">×</button>
<input aria-labelledby="label-id" />
<div aria-describedby="hint-id">...</div>

// States
<button aria-pressed={isPressed}>Toggle</button>
<button aria-expanded={isOpen}>Menu</button>
<div aria-hidden={!isVisible}>Hidden content</div>
<input aria-invalid={hasError} />
<div aria-disabled={isDisabled}>...</div>

// Live regions (for dynamic updates)
<div aria-live="polite">
  {/* Announces changes to screen readers */}
  {statusMessage}
</div>

<div aria-live="assertive">
  {/* Interrupts to announce immediately */}
  {errorMessage}
</div>

// Current item
<nav>
  <a href="/" aria-current="page">Home</a>
  <a href="/about">About</a>
</nav>
```

### Modal Dialog
```typescript
function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus inside dialog
  useEffect(() => {
    if (isOpen) {
      const dialog = dialogRef.current;
      const focusableElements = dialog?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      firstElement?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      ref={dialogRef}
    >
      <h2 id="dialog-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

## Forms

### Labels and Instructions
```typescript
// ✅ Proper labeling
<div>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-hint email-error"
  />
  <p id="email-hint" className="text-gray-500">
    We'll never share your email
  </p>
  {error && (
    <p id="email-error" role="alert" className="text-red-500">
      {error}
    </p>
  )}
</div>

// Required fields
<label htmlFor="name">
  Name <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input id="name" required aria-required="true" />
```

### Error Handling
```typescript
function Form() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form aria-describedby={Object.keys(errors).length ? 'error-summary' : undefined}>
      {Object.keys(errors).length > 0 && (
        <div id="error-summary" role="alert" aria-labelledby="error-heading">
          <h2 id="error-heading">Please fix the following errors:</h2>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <a href={`#${field}`}>{error}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>
    </form>
  );
}
```

## Images and Media

### Alt Text
```typescript
// Informative images - describe the content
<img src="/chart.png" alt="Sales increased 25% from January to March" />

// Decorative images - empty alt
<img src="/decoration.svg" alt="" />

// Complex images - longer description
<figure>
  <img
    src="/diagram.png"
    alt="System architecture diagram"
    aria-describedby="diagram-description"
  />
  <figcaption id="diagram-description">
    The system consists of three main components: a React frontend,
    a Node.js API server, and a PostgreSQL database...
  </figcaption>
</figure>

// Icons with buttons
<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>

// Icons with visible text
<button>
  <TrashIcon aria-hidden="true" />
  Delete
</button>
```

### Video and Audio
```typescript
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track kind="captions" src="/captions.vtt" srclang="en" label="English" />
  <track kind="descriptions" src="/descriptions.vtt" srclang="en" label="Audio descriptions" />
</video>

// For audio-only content, provide transcript
<audio controls src="/podcast.mp3" />
<a href="/transcript.html">Read transcript</a>
```

## Color and Contrast

### Minimum Contrast Ratios
```css
/* WCAG AA Requirements */
/* Normal text (< 18px): 4.5:1 */
/* Large text (>= 18px bold or >= 24px): 3:1 */
/* UI components and graphics: 3:1 */

/* ✅ Good contrast */
.text-primary {
  color: #1a1a1a; /* On white: 16:1 */
}

/* ❌ Poor contrast */
.text-light {
  color: #999999; /* On white: 2.8:1 */
}
```

### Don't Rely on Color Alone
```typescript
// ❌ Color only
<span className={isError ? 'text-red-500' : 'text-green-500'}>
  {status}
</span>

// ✅ Color + icon + text
<span className={isError ? 'text-red-500' : 'text-green-500'}>
  {isError ? <XIcon aria-hidden /> : <CheckIcon aria-hidden />}
  {isError ? 'Error: ' : 'Success: '}{status}
</span>
```

## Screen Reader Utilities

### Visually Hidden Content
```css
/* Content visible to screen readers only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show when focused (for skip links) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

```typescript
// Usage
<span className="sr-only">Current page:</span>
<span>Home</span>

<button>
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">Delete item</span>
</button>
```

### Announcing Dynamic Content
```typescript
function LiveRegion() {
  const [message, setMessage] = useState('');

  const announce = (text: string) => {
    setMessage(text);
    // Clear after announcement
    setTimeout(() => setMessage(''), 1000);
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <button onClick={() => {
        addToCart();
        announce('Item added to cart');
      }}>
        Add to Cart
      </button>
    </>
  );
}
```

## Testing Accessibility

### Automated Testing
```typescript
// Jest + jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist
```markdown
## Keyboard Testing
- [ ] Can reach all interactive elements with Tab
- [ ] Focus order is logical
- [ ] Focus is visible
- [ ] Can activate buttons with Enter/Space
- [ ] Can escape from modals
- [ ] No keyboard traps

## Screen Reader Testing
- [ ] Page has meaningful title
- [ ] Headings describe content structure
- [ ] Images have appropriate alt text
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced

## Visual Testing
- [ ] Text has sufficient contrast
- [ ] Content is visible at 200% zoom
- [ ] Layout works at 320px width
- [ ] Focus indicators are visible
- [ ] Information isn't conveyed by color alone

## Motion
- [ ] Animations can be disabled (prefers-reduced-motion)
- [ ] No flashing content (< 3 flashes/second)
```

### Respecting User Preferences
```typescript
// Reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// In Tailwind
motion-safe:animate-bounce
motion-reduce:animate-none
```

## Accessibility Checklist

```markdown
## Structure
- [ ] Semantic HTML used appropriately
- [ ] Heading levels are logical (h1 → h2 → h3)
- [ ] Landmarks used (main, nav, header, footer)
- [ ] Skip links for navigation

## Keyboard
- [ ] All functionality keyboard accessible
- [ ] Focus visible on all elements
- [ ] Focus order is logical
- [ ] No keyboard traps

## Images
- [ ] Informative images have descriptive alt text
- [ ] Decorative images have empty alt=""
- [ ] Complex images have extended descriptions

## Forms
- [ ] All inputs have visible labels
- [ ] Required fields are indicated
- [ ] Error messages are clear and associated
- [ ] Instructions provided where needed

## Color & Contrast
- [ ] Text meets contrast requirements (4.5:1 / 3:1)
- [ ] Information not conveyed by color alone
- [ ] UI components have 3:1 contrast

## Dynamic Content
- [ ] Live regions announce updates
- [ ] Modals trap and manage focus
- [ ] Loading states are announced
```
