---
name: app-assessment
description: "Comprehensive assessment of any app or feature against its stated purpose. Evaluates whether it delivers on its goals, identifies gaps, and produces a prioritized improvement roadmap. Covers 8 dimensions: purpose alignment, UX flow, content quality, technical health, edge cases, accessibility, performance signals, and competitive context. Use when: (1) You've built a feature and want to know if it's actually good, (2) You're reviewing an app before launch, (3) Something feels off but you can't pinpoint it, (4) You want a structured quality audit, (5) Stakeholders ask 'is this ready?'"
---

# App Assessment

A systematic framework for evaluating whether an app or feature is living up to its purpose — and producing a concrete, prioritized list of what to fix.

## When to Use This Skill

- You've just built or shipped a feature and want an honest evaluation
- Pre-launch quality gate — "is this ready for users?"
- Something feels off but you can't articulate what
- Periodic health check on an existing product
- Preparing a roadmap of improvements with clear priorities
- Stakeholder asks "how good is this?" and you need a structured answer

## Core Philosophy

**Purpose is the only yardstick that matters.** Every app exists to solve a problem for a specific user. A beautiful app that doesn't solve the problem is a failure. An ugly app that nails the problem is a success (for now). Always start by understanding the stated purpose, then measure everything against it.

**Assessment is not criticism — it's diagnosis.** The goal is not to list everything wrong. It's to identify the gaps between *intent* and *reality*, rank them by impact, and produce a clear path forward. Every finding should answer: "What did we intend? What actually happens? How much does the gap matter?"

**Users don't read your code — they experience your choices.** Technical quality matters, but only insofar as it manifests in the user experience. A perfectly architected feature that confuses users is worse than a scrappy feature that delights them. Always evaluate from the outside in.

**The 80/20 of app quality:**
- 80% of user frustration comes from 20% of the issues
- The first 30 seconds determine whether someone stays
- Empty states, error states, and edge cases reveal true quality
- What the app *doesn't* do matters as much as what it does

---

## Assessment Process

### Phase 1: Establish the Baseline

Before evaluating anything, answer these questions by reading the codebase, README, or asking the user:

```markdown
## Purpose Statement
- **What problem does this solve?** [one sentence]
- **Who is the primary user?** [role, context, skill level]
- **What does success look like?** [observable user outcome]
- **What are the top 3 user tasks?** [the critical paths]
- **What's the current stage?** [prototype / MVP / production / mature]
```

This baseline frames every subsequent evaluation. A prototype gets graded differently than a production app. An internal tool gets different UX expectations than a consumer product.

### Phase 2: Evaluate Across 8 Dimensions

Work through each dimension. Not all dimensions apply equally to every app — weight them based on the purpose statement.

---

## Dimension 1: Purpose Alignment

*Does the app actually do what it claims to do?*

This is the most important dimension. Everything else is secondary if the core purpose isn't met.

**Evaluation checklist:**
- [ ] Can a user complete the primary task within 3 clicks/interactions?
- [ ] Does the landing state clearly communicate what this app does?
- [ ] Are the top 3 user tasks achievable without documentation?
- [ ] Does the information architecture match the user's mental model?
- [ ] Is there a clear "happy path" that most users would follow?
- [ ] Does the app solve the *whole* problem or just part of it?

**What to look for in code:**
```bash
# Find the main entry points and routes
Glob: **/app/**/page.tsx
Glob: **/pages/**/*.tsx

# Find the core data model — does it match the domain?
Grep: "interface|type.*=.*{" in types files

# Check what the app actually renders on first load
Read: app/page.tsx or the main layout
```

**Scoring:**
- **Strong:** User can achieve primary goal intuitively. Purpose is immediately clear.
- **Adequate:** Purpose is achievable but requires some figuring out. Minor friction.
- **Weak:** Purpose is unclear, primary task is buried, or key functionality is missing.

---

## Dimension 2: User Experience Flow

*Is the journey from entry to outcome smooth?*

**Evaluation checklist:**
- [ ] First-time experience: what does a new user see? Is there onboarding?
- [ ] Navigation: can users always tell where they are and how to get back?
- [ ] Feedback: does every action produce visible feedback (loading, success, error)?
- [ ] Progressive disclosure: is complexity revealed gradually or dumped upfront?
- [ ] Dead ends: are there any states where the user is stuck with no clear next step?
- [ ] Cognitive load: how many decisions does the user face at any given point?
- [ ] Mobile: does it work on small screens? (if applicable)

**Key signals of good flow:**
```markdown
- Entry → Value in under 30 seconds
- No modal asking for config before showing any value
- Loading states that communicate progress, not just spin
- Error messages that tell users what to DO, not what went WRONG
- "Empty states" that guide users toward their first action
```

**Key signals of broken flow:**
```markdown
- User lands on blank page with no guidance
- Settings required before any functionality works
- Actions that produce no visible result
- Navigation that requires browser back button
- Forms that lose data on error
```

**What to look for in code:**
```bash
# Find loading and error states
Grep: "isLoading|loading|Loader|Spinner|skeleton" in components
Grep: "error|Error|catch|fallback" in components

# Find empty states
Grep: "empty|no results|nothing|get started" in components

# Find navigation structure
Grep: "href=|Link|useRouter|useNavigate" in components
```

---

## Dimension 3: Content & Copy Quality

*Does the text guide, clarify, and build confidence?*

**Evaluation checklist:**
- [ ] Headlines and labels: clear and specific, not generic ("Dashboard", "Settings")
- [ ] Microcopy: button labels say what they do ("Save Changes" not "Submit")
- [ ] Error messages: actionable, not technical ("Check your API key" not "401 Unauthorized")
- [ ] Tone consistency: same voice throughout (not formal in one place, casual in another)
- [ ] Terminology: consistent naming (don't call it "project" in one place and "workspace" in another)
- [ ] Help text: present where users need it, absent where they don't

**Bad vs Good examples:**

```markdown
Button labels:
  Submit → Save Changes
  OK → Got It
  Cancel → Discard Changes

Error messages:
  Error 500 → Something went wrong. Try refreshing the page.
  Invalid input → Enter a valid email address (e.g., name@company.com)
  Unauthorized → Your session expired. Please sign in again.

Empty states:
  No data → You haven't created any projects yet. Start your first one.
  No results → No matches for "xyz". Try a broader search.
```

---

## Dimension 4: Technical Health

*Is the code sound enough to support the user experience?*

**Evaluation checklist:**
- [ ] Build passes without errors or warnings
- [ ] No TypeScript `any` types masking real issues
- [ ] API calls have error handling (not just happy path)
- [ ] No hardcoded secrets, API keys, or credentials in source
- [ ] Environment variables are used for configuration
- [ ] Data validation exists at system boundaries (API routes, form inputs)
- [ ] No obvious N+1 queries or unbounded data fetching
- [ ] Dependencies are reasonably current (no critical security vulnerabilities)

**What to look for in code:**
```bash
# Check for build health
Run: npm run build (or equivalent)

# Find potential security issues
Grep: "apiKey|api_key|secret|password|token" in source (not .env)
Grep: "dangerouslySetInnerHTML|eval\(|innerHTML" in components

# Find missing error handling
Grep: "\.then\(" without ".catch"
Grep: "async.*=>" without "try" nearby

# Check for TypeScript health
Grep: ": any" across source files

# Find TODO/FIXME/HACK markers
Grep: "TODO|FIXME|HACK|XXX|TEMP" across source files
```

---

## Dimension 5: Edge Cases & Resilience

*What happens when things go wrong or get weird?*

This dimension separates polished products from prototypes. Most developers test the happy path. Edge cases reveal true quality.

**Evaluation checklist:**
- [ ] What happens with no data? (empty database, first-time user)
- [ ] What happens with too much data? (1000+ items, long text, huge files)
- [ ] What happens with bad data? (malformed input, missing fields)
- [ ] What happens offline or with slow network?
- [ ] What happens when the API returns an error?
- [ ] What happens with rapid repeated actions? (double-click submit, spam enter)
- [ ] What happens with special characters in input? (emoji, unicode, HTML)
- [ ] What happens when the user navigates away mid-action?
- [ ] What happens on page refresh during a multi-step flow?

**What to look for in code:**
```bash
# Find form validation
Grep: "required|validate|schema|zod|yup" in form-related files

# Find rate limiting or debounce
Grep: "debounce|throttle|disabled.*Loading|preventDefault" in components

# Find data boundary checks
Grep: "\.length|\.slice|limit|max|min|clamp" in data-handling code

# Find optimistic updates or offline handling
Grep: "optimistic|offline|retry|cache" across source
```

---

## Dimension 6: Accessibility

*Can everyone use this?*

**Evaluation checklist:**
- [ ] Keyboard navigation: can all interactive elements be reached via Tab?
- [ ] Focus management: is focus visible and logical?
- [ ] Screen reader support: do images have alt text? Do icons have aria-labels?
- [ ] Color contrast: is text readable against its background?
- [ ] Touch targets: are buttons at least 44x44px on mobile?
- [ ] Semantic HTML: are headings, lists, and landmarks used correctly?
- [ ] No information conveyed by color alone

**What to look for in code:**
```bash
# Check for aria attributes
Grep: "aria-|role=" in components

# Check for alt text
Grep: "<img|<Image" without nearby "alt="

# Check for keyboard handlers
Grep: "onKeyDown|onKeyPress|onKeyUp|tabIndex" in components

# Check for semantic HTML
Grep: "<button|<a |<nav|<main|<header|<footer|<section" in components
# vs non-semantic clickable divs:
Grep: "onClick.*div|onClick.*span" in components
```

---

## Dimension 7: Performance Signals

*Does it feel fast?*

You can't run Lighthouse from a code review, but you can spot performance issues in code.

**Evaluation checklist:**
- [ ] Images are optimized (next/image, srcset, or explicit width/height)
- [ ] No blocking data fetches on initial render (suspense, streaming, or SWR)
- [ ] Large lists are virtualized (or at least paginated)
- [ ] Bundle size is reasonable (no full lodash import, no moment.js)
- [ ] Animations use transform/opacity (not width/height/top/left)
- [ ] No unnecessary re-renders (stable keys, memoized callbacks where needed)

**What to look for in code:**
```bash
# Check image handling
Grep: "<img |<Image " in components — are they optimized?

# Check for heavy imports
Grep: "import.*from 'lodash'|import.*from 'moment'" (should be lodash-es or date-fns)

# Check for data fetching strategy
Grep: "useEffect.*fetch|useSWR|useQuery|getServerSideProps|loader" in pages/components

# Check for virtualization on lists
Grep: "virtualize|virtual|react-window|react-virtual|tanstack.*virtual" across source
```

---

## Dimension 8: Competitive Context

*How does this compare to what users expect?*

Users don't evaluate your app in isolation. They compare it to every other app they've used. This dimension is about understanding the bar.

**Evaluation checklist:**
- [ ] Does this match or exceed the UX quality users expect from similar tools?
- [ ] Are there obvious features that "every app like this has" that are missing?
- [ ] Is there a unique angle or value prop that competitors don't have?
- [ ] Would a user coming from a competitor feel at home or confused?

**Common "table stakes" features by app type:**

| App Type | Users Expect |
|----------|-------------|
| Chat/messaging | Real-time, message persistence, typing indicators |
| Dashboard | Filtering, date ranges, export, responsive |
| Form/wizard | Progress indicator, save draft, validation inline |
| Content browser | Search, sort, filter, favorites/bookmarks |
| Tool/utility | Keyboard shortcuts, settings persistence, undo |

---

## Phase 3: Produce the Assessment Report

After evaluating all dimensions, produce a structured report:

```markdown
# App Assessment: [App/Feature Name]

## Purpose Statement
[1-2 sentences summarizing what this app does and for whom]

## Overall Verdict: [Strong / Adequate / Needs Work]
[2-3 sentence summary of the key finding]

## Scorecard

| Dimension | Rating | Key Finding |
|-----------|--------|-------------|
| Purpose Alignment | Strong/Adequate/Weak | [one sentence] |
| UX Flow | Strong/Adequate/Weak | [one sentence] |
| Content & Copy | Strong/Adequate/Weak | [one sentence] |
| Technical Health | Strong/Adequate/Weak | [one sentence] |
| Edge Cases | Strong/Adequate/Weak | [one sentence] |
| Accessibility | Strong/Adequate/Weak | [one sentence] |
| Performance | Strong/Adequate/Weak | [one sentence] |
| Competitive Context | Strong/Adequate/Weak | [one sentence] |

## What's Working Well
[3-5 bullet points of genuine strengths — be specific]

## Priority Improvements

### P0: Must Fix (blocking core purpose)
[Issues that prevent the app from fulfilling its primary purpose]

### P1: Should Fix (significant friction)
[Issues that noticeably degrade the experience]

### P2: Nice to Have (polish)
[Issues that would elevate from good to great]

## Recommended Next Steps
[3-5 specific, actionable items in priority order]
```

---

## Severity Classification

Use this framework to prioritize findings consistently:

| Severity | Definition | Examples |
|----------|-----------|----------|
| **P0 — Blocker** | Prevents core purpose from being achieved | Feature doesn't work, data loss, security hole, app crashes |
| **P1 — Major** | Significant friction or confusion on primary paths | Confusing flow, missing feedback, broken on mobile, poor error handling |
| **P2 — Minor** | Noticeable but doesn't block the user | Inconsistent copy, missing empty state, no keyboard shortcuts |
| **P3 — Polish** | Would elevate quality but absence isn't felt | Animation refinement, advanced features, micro-interactions |

**Severity tiebreakers:**
- How many users hit this? (all users > some users > edge case)
- How often? (every session > sometimes > rarely)
- Can the user work around it? (no workaround > awkward workaround > easy workaround)

---

## Running the Assessment

### For a Full App Assessment:

1. **Read the README, landing page, or ask the user** to establish the purpose statement
2. **Walk the primary user journey** by reading the main pages/components in order
3. **Run the build** to check technical health baseline
4. **Evaluate each dimension** using the checklists above
5. **Search for patterns** using the grep/glob queries in each dimension
6. **Produce the report** using the template in Phase 3
7. **Prioritize findings** using the severity classification

### For a Single Feature Assessment:

1. **Identify the feature's purpose** — what user problem does it solve?
2. **Read the feature code** — component, API route, data model
3. **Walk the happy path** — does it achieve the purpose?
4. **Check edge cases** — empty state, error state, loading state, boundary values
5. **Evaluate dimensions 1-5** (skip 6-8 unless specifically relevant)
6. **Produce a condensed report** focusing on purpose alignment and gaps

### Quick Assessment (5 minutes):

If you need a fast take, focus on these three questions:
1. **Can a new user figure out what to do within 30 seconds?**
2. **Does the happy path work without friction?**
3. **What happens when something goes wrong?**

These three questions catch 80% of issues.

---

## Anti-Patterns in Assessment

**Don't do these:**

- **Assessing code without understanding purpose.** Beautiful code that solves the wrong problem is still a failure. Always establish purpose first.
- **Listing every issue with equal weight.** A missing favicon and a broken login are not the same severity. Always prioritize.
- **Comparing to an ideal that doesn't match the stage.** A prototype doesn't need perfect accessibility. A production app does. Match expectations to stage.
- **Only finding problems.** A useful assessment also identifies what's working well. This validates good decisions and builds trust.
- **Suggesting rewrites when fixes suffice.** "Rewrite this component" is almost never the right recommendation. "Add error handling to this fetch call" is actionable.
- **Evaluating aesthetics as UX.** "I don't like the color" is not a UX finding. "The primary action button doesn't stand out from secondary actions" is.
