---
name: ux-analysis
description: Expert UX analysis for flow, friction, and intuitive design. Understands clunky vs slick, user flows, and how to make interfaces feel effortless. Use when reviewing UI/UX, planning features, or making things less clunky.
---

# UX Analysis Skill

Expert UX analysis focusing on user flow, friction elimination, and intuitive design. Use when reviewing interfaces, planning features, or improving existing experiences.

---

## Core Philosophy

**Great UX is invisible.** Users should accomplish goals without thinking about the interface. Every interaction should feel obvious in hindsight.

### Know Your Tool's Soul

Before designing anything, answer: **What is this tool supposed to make the user feel?**

Then ruthlessly design for that feeling:

| Tool Type | Core Promise | UX Priority |
|-----------|--------------|-------------|
| **Collaboration** | "We're in this together" | Make sharing effortless. Show presence. Reduce "sending" friction. Real-time > async. Never make users wonder "did they see it?" |
| **Automation** | "Set it and forget it" | Minimal clicks. Smart defaults. One-time setup. Invisible execution. Only surface when something needs attention. |
| **Creative** | "I made this" | Inspire confidence. Quick wins early. Low floor, high ceiling. Make output feel polished. Undo everything. Never lose work. |
| **Productivity** | "I'm getting things done" | Speed above all. Keyboard-first. Batch operations. Clear progress. Satisfy the urge to check things off. |
| **Learning** | "I'm growing" | Celebrate progress. Right-sized challenges. Never make them feel stupid. Show how far they've come. |
| **Communication** | "I'm heard and understood" | Instant delivery. Read receipts. Presence indicators. Make silence feel intentional, not broken. |

**The Test:** After using your tool, does the user feel what you promised? If your automation tool feels like work, you failed. If your creative tool makes users feel like imposters, you failed.

Design for the feeling. The features are just how you get there.

### The Three Laws of Intuitive Design
1. **Don't make me think** - If users have to figure it out, it's broken
2. **Don't make me wait** - Perceived speed matters as much as actual speed
3. **Don't make me remember** - The interface should remember for them

---

## Established UX Laws

These laws are backed by decades of research. Ignore them at your peril.

### Fitts's Law (Target Acquisition)
*The time to reach a target depends on its size and distance.*

**Applications:**
- Make clickable targets large (min 44x44px for touch)
- Put frequent actions close to where users already are
- Use screen edges and corners ("magic pixels") - users can't overshoot them
- Primary buttons should be bigger than secondary ones
- Destructive actions (delete) should be small and far from common actions

```
Good: Large "Save" button near form → Fast, confident clicks
Bad:  Tiny "Submit" link at bottom of page → Hunting, misclicks
```

### Hick's Law (Decision Time)
*More choices = more time to decide.*

**Applications:**
- Limit navigation options (5-7 max in main nav)
- Progressive disclosure: show basic options first, advanced later
- Highlight recommended choice in pricing tables
- Break complex decisions into smaller steps
- Use smart defaults to reduce decisions to zero

```
Good: 3 pricing tiers with one highlighted "Most Popular"
Bad:  8 pricing tiers with 47 feature checkboxes each
```

### Miller's Law (Working Memory)
*People can hold 7±2 items in working memory.*

**Applications:**
- Chunk phone numbers: 555-123-4567, not 5551234567
- Group related items visually
- Limit form fields visible at once
- Use steps/progress indicators for long processes
- Don't require users to remember info between screens

### Jakob's Law (Familiarity)
*Users spend most time on OTHER sites. They expect yours to work like those.*

**Applications:**
- Put logo top-left, linking to home
- Shopping cart icon top-right
- Search bar in header
- Underline links (or make them obviously clickable)
- Don't reinvent navigation patterns

```
Good: Standard e-commerce layout users already know
Bad:  "Creative" navigation that requires learning
```

### Law of Proximity (Gestalt)
*Things close together are perceived as related.*

**Applications:**
- Group related form fields
- Space between sections > space within sections
- Labels directly next to their fields
- Action buttons near the content they affect
- Related navigation items clustered

### Law of Similarity (Gestalt)
*Things that look similar are perceived as related.*

**Applications:**
- All clickable elements share visual traits
- Consistent styling for same-function elements
- Different styles for different functions
- Icons in a set should share visual weight

### Serial Position Effect (Memory)
*People remember first and last items best.*

**Applications:**
- Most important nav items first and last
- Key info at start of paragraphs
- CTAs at beginning and end of pages
- Most critical steps at start and end of flows

### Aesthetic-Usability Effect
*Beautiful designs are perceived as more usable (and users forgive more).*

**Applications:**
- Invest in visual polish—it buys you goodwill
- A pretty interface with minor issues beats an ugly "usable" one
- But don't let aesthetics hide real usability problems
- Beauty without function is still a failure

### Von Restorff Effect (Isolation)
*The thing that stands out is remembered.*

**Applications:**
- Make CTAs visually distinct (color, size, space)
- Highlight important information differently
- Use contrast to guide attention
- One focal point per screen

### Tesler's Law (Conservation of Complexity)
*Every system has inherent complexity that cannot be removed—only moved.*

**Applications:**
- Absorb complexity into the system, not the user
- Automate what can be automated
- Smart defaults handle complexity for most users
- Power users can access complexity when needed

```
Good: App figures out timezone from location
Bad:  User selects timezone from 400-item dropdown
```

### Pareto Principle (80/20 Rule)
*80% of outcomes come from 20% of features.*

**Applications:**
- Find and optimize the 20% of features used 80% of time
- Don't give equal weight to all features
- Usage data reveals what actually matters
- Ruthlessly deprioritize the long tail

### Zeigarnik Effect (Incomplete Tasks)
*People remember incomplete tasks better than completed ones.*

**Applications:**
- Progress bars motivate completion
- "Your profile is 60% complete" drives action
- Saved drafts bring users back
- Streaks and incomplete collections engage users

### Peak-End Rule (Memory)
*People judge experiences by their peak moment and ending.*

**Applications:**
- End flows on a high note (success animation, celebration)
- Fix the worst moment in your flow—it defines the memory
- The last interaction matters disproportionately
- Surprise and delight at the end creates lasting positive impression

---

## Nielsen's 10 Usability Heuristics

From Jakob Nielsen at Nielsen Norman Group—the gold standard for decades.

### 1. Visibility of System Status
Keep users informed about what's happening with appropriate feedback.

- Show loading states, progress indicators
- Confirm actions completed ("Saved!")
- Display current state (logged in as, draft mode, etc.)

### 2. Match Between System and Real World
Use language and concepts familiar to users, not system jargon.

- "Shopping cart" not "order aggregation queue"
- "Friends" not "bidirectional social connections"
- Icons that match real-world objects

### 3. User Control and Freedom
Users make mistakes. Provide clearly marked emergency exits.

- Undo/redo everywhere
- Cancel buttons on dialogs
- Easy navigation back
- "Discard changes" option

### 4. Consistency and Standards
Don't make users wonder whether different words, situations, or actions mean the same thing.

- Same action = same result everywhere
- Follow platform conventions
- Internal consistency across your product

### 5. Error Prevention
Better than good error messages is preventing errors in the first place.

- Constraints that prevent invalid input
- Confirmations before destructive actions
- Smart defaults that are usually right
- Disable unavailable actions (don't hide them)

### 6. Recognition Rather Than Recall
Minimize memory load. Show options rather than requiring users to remember them.

- Visible navigation, not hidden menus
- Recently used items
- Search with suggestions
- In-context help

### 7. Flexibility and Efficiency of Use
Cater to both novices and experts.

- Keyboard shortcuts for power users
- Customizable interfaces
- Accelerators hidden from novices
- Multiple ways to accomplish tasks

### 8. Aesthetic and Minimalist Design
Every extra element competes with relevant elements and diminishes visibility.

- Remove unnecessary content
- Prioritize information hierarchy
- White space is not wasted space
- If in doubt, leave it out

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Error messages should be in plain language, indicate the problem, and suggest a solution.

```
Bad:  "Error 500"
Good: "Couldn't save. Check your internet connection and try again."
```

### 10. Help and Documentation
Even though it's better if the system can be used without documentation, it may be necessary.

- Searchable help
- Focused on the user's task
- Concrete steps to follow
- Not too long

---

## Steve Krug's Truths (Don't Make Me Think)

From the most influential usability book ever written.

### Users Don't Read—They Scan
People are on a mission. They scan for relevant words and links, then click.

**Implications:**
- Make pages scannable with clear visual hierarchy
- Use headings, bullets, short paragraphs
- Front-load important words
- Make clickable things obviously clickable

### Users Don't Make Optimal Choices—They Satisfice
Users don't pick the best option. They pick the first reasonable option.

**Implications:**
- Make the right path obviously right
- Put the best option first
- Don't hide good options below bad ones
- Reduce options so "first reasonable" = "best"

### Users Don't Figure Out How Things Work—They Muddle Through
Users don't read manuals or figure out systems. They guess and click.

**Implications:**
- Design for guessing correctly
- Make recovery from wrong guesses easy
- Don't require understanding to succeed
- If users are muddling, your design is working (or failing gracefully)

### Questions Users Should Never Have to Ask
If users are asking these, you've failed:

- "Where am I?"
- "Where do I start?"
- "Where did they put ___?"
- "What's the most important thing here?"
- "Why did they call it that?"
- "Is this clickable?"
- "Where's the ___?" (if it's a common action)

---

## Navigation & Wayfinding

### Never Let Users Get Lost

Users should always know three things:
1. **Where am I?** (Current location)
2. **Where can I go?** (Available actions)
3. **How do I get back?** (Escape routes)

### Persistent Elements (Always Visible)

Some things must never disappear, no matter where users are:

| Element | Why It Persists |
|---------|-----------------|
| **Logo/Home** | Universal escape hatch |
| **Primary navigation** | Users need to switch contexts |
| **Search** | The "I know what I want" shortcut |
| **User menu/Account** | "Am I logged in? Who am I?" |
| **Help access** | Rescue is always one click away |
| **Current context indicator** | "Where am I right now?" |

**The Rule:** If users need it on every page, don't make them hunt for it on any page.

### Keep Navigation Shallow

```
Bad:  Home → Settings → Account → Preferences → Notifications → Email
Good: Home → Settings → Notifications (with tabs for channels)
```

- Maximum 3 levels deep for any action
- If deeper, you need a redesign, not more breadcrumbs
- Flatten with tabs, sidebars, or sections instead of nesting

### Breadcrumbs & Context

Show the path. Always let users jump back to any level:
```
Dashboard > Projects > Apollo > Settings
    ↑          ↑         ↑
 (clickable) (clickable) (clickable)
```

### Help & Tips That Don't Annoy

**Hierarchy of Help:**

1. **Make it obvious** (best) - Design so help isn't needed
2. **Inline hints** - Placeholder text, labels, microcopy
3. **Contextual tooltips** - Hover/focus reveals explanation
4. **Empty state guidance** - "No items yet. Here's how to add one."
5. **First-run spotlights** - One-time callouts for new features
6. **Searchable help** - Cmd+? or help menu
7. **Documentation** (last resort) - For power users and edge cases

**Tips That Work:**

- **Progressive** - Show tips as users encounter features, not all upfront
- **Dismissable** - Always let users say "got it" and move on
- **Contextual** - Tip about export appears near export button
- **One at a time** - Never stack multiple tip popovers
- **Remember dismissal** - Once dismissed, gone forever (unless reset)

**Tips That Annoy:**

- Popups on every visit
- Tutorial modals before users can explore
- Tooltips that block the thing you're trying to click
- "Did you know?" that interrupts flow
- Help that requires reading paragraphs

**The Test:** Can a new user figure it out in 5 seconds? If not, add a hint. If they still can't, redesign it.

---

## UX Analysis Framework

When analyzing any interface or feature, evaluate these dimensions:

### 1. Flow Analysis (The Happy Path)

Ask these questions:
- What is the user trying to accomplish?
- What's the shortest path to that goal?
- How many clicks/taps/steps does it take?
- Can we reduce steps by 50%?

**Red Flags:**
- More than 3 steps for common actions
- Dead ends that require backtracking
- Forced detours (unnecessary confirmations, sign-ups, tutorials)
- Modal dialogs that interrupt flow

**Slick Patterns:**
- One-click actions for frequent tasks
- Smart defaults that anticipate needs
- Inline editing (no separate "edit mode")
- Keyboard shortcuts for power users
- Command palettes (Cmd+K patterns)

### 2. Friction Identification (The Pain Points)

**Types of Friction:**

| Friction Type | Example | Fix |
|--------------|---------|-----|
| Cognitive | Too many choices | Smart defaults, progressive disclosure |
| Physical | Too many clicks | Batch actions, shortcuts |
| Emotional | Uncertainty/fear | Clear feedback, undo support |
| Temporal | Waiting | Optimistic UI, skeleton screens |

**Friction Audit Questions:**
- Where do users pause or hesitate?
- What makes them reach for documentation?
- Where do they make mistakes?
- What do they complain about?
- What workarounds have they created?

### 3. Cognitive Load Assessment

**Keep Working Memory Free:**
- Show, don't tell (visual > text)
- Chunk information (7±2 items max)
- Use recognition over recall (dropdowns > text input)
- Maintain context (breadcrumbs, progress indicators)

**Clunky Signs:**
- Walls of text
- Too many options at once
- Jargon or technical terms
- Inconsistent terminology
- Hidden or buried actions

**Slick Signs:**
- Scannable layouts
- Visual hierarchy that guides the eye
- Contextual help exactly when needed
- Consistent patterns throughout

### 4. Feedback & Communication

**Every Action Needs a Reaction:**
- Immediate acknowledgment (< 100ms)
- Progress indication for longer operations
- Success confirmation
- Clear error messages with solutions

**Feedback Hierarchy:**
```
Instant (< 100ms)    → Button state change, hover effects
Fast (< 1s)          → Loading spinners, progress bars
Slow (> 1s)          → Skeleton screens, background processing with notification
```

**Error Message Formula:**
```
What happened + Why it happened + How to fix it
```

Bad: "Error 500"
Good: "Couldn't save your changes. The server is temporarily unavailable. Your work is saved locally—we'll sync when connection returns."

### 5. Affordances & Signifiers

**Things Should Look Like What They Do:**
- Buttons should look clickable
- Links should look like links
- Draggable items should have grab handles
- Editable fields should look editable

**Test:** Can a new user guess what each element does without clicking it?

### 6. Progressive Disclosure

**Show Only What's Needed, When It's Needed:**

```
Level 1: Essential actions (always visible)
Level 2: Common actions (one click away)
Level 3: Advanced actions (in menus/settings)
Level 4: Rare actions (in documentation)
```

**Implementation Patterns:**
- Expandable sections
- "Show more" / "Advanced options"
- Contextual toolbars
- Right-click menus for power features

---

## The Slick vs Clunky Checklist

### Clunky UX Smells 🚩

- [ ] Requires reading instructions
- [ ] Multiple confirmations for simple actions
- [ ] Data entry that could be automated
- [ ] Forcing users to format input (phone numbers, dates)
- [ ] Empty states with no guidance
- [ ] Errors that don't explain how to fix
- [ ] Loading states that block interaction
- [ ] Logout that loses unsaved work
- [ ] "Are you sure?" for reversible actions
- [ ] Pagination when infinite scroll would work
- [ ] Required fields that aren't marked
- [ ] Forms that clear on error
- [ ] No undo/redo support
- [ ] Tiny click targets
- [ ] Hover-only interactions (mobile-hostile)

### Slick UX Patterns ✨

- [ ] Inline validation as you type
- [ ] Autosave with visual confirmation
- [ ] Undo instead of confirmation dialogs
- [ ] Smart paste (handles multiple formats)
- [ ] Optimistic updates (assume success)
- [ ] Skeleton loading states
- [ ] Empty states that guide next action
- [ ] Bulk actions for lists
- [ ] Keyboard navigation throughout
- [ ] Cmd+K command palette
- [ ] Recently used / frequently used sections
- [ ] Drag and drop where intuitive
- [ ] Copy-to-clipboard with feedback
- [ ] Deep linking to specific states
- [ ] Responsive feedback (haptic, visual, audio)

---

## Flow Design Patterns

### 1. The Pit of Success
Design so the easiest path is the correct path. Make mistakes hard to make.

### 2. Forgiving Inputs
```
Accept: "1234567890", "(123) 456-7890", "123-456-7890"
Store: "1234567890"
Display: "(123) 456-7890"
```

### 3. Sensible Defaults
- Pre-select the most common option
- Remember user's last choice
- Use smart detection (timezone, locale, preferences)

### 4. The Escape Hatch
Always provide a way out:
- Cancel buttons
- Undo functionality
- "Skip for now" options
- Clear "back" navigation

### 5. AI-to-Action (No Copy-Paste)
When AI generates something useful, don't make users copy and paste. Provide direct action buttons.

**Bad:**
```
AI: "Here's your updated bio: 'Senior developer with 10 years...' "
User: [selects text] → [copies] → [finds field] → [pastes]
```

**Good:**
```
AI: "Here's your updated bio:"
"Senior developer with 10 years..."
[Use This] [Edit First] [Try Another]
```

**Patterns:**
- "Use this" button that auto-populates the target field
- "Apply" buttons next to generated code/config
- "Insert" actions that place content at cursor
- "Save to [X]" for generated content
- One-click "Fill form" after AI collects info conversationally

**The Rule:** If the AI generated it and the user approved it, one click should complete the action. The conversation already happened—don't make them do manual labor afterward.

### 6. Progressive Onboarding
Don't front-load tutorials. Teach in context:
- First-time tooltips
- Empty state guidance
- Contextual hints
- Achievement/discovery moments

---

## Mobile-First Thinking

Even for desktop apps, mobile constraints improve UX:

- **Touch targets:** Minimum 44x44px
- **Thumb zones:** Primary actions within easy reach
- **One-handed use:** Consider reachability
- **Offline-first:** Assume connectivity issues
- **Interruption-friendly:** Save state constantly

---

## Performance as UX

| Threshold | Perception | Action |
|-----------|------------|--------|
| 0-100ms | Instant | Direct feedback |
| 100-300ms | Slight delay | Show active state |
| 300-1000ms | Working | Show spinner |
| 1-10s | Waiting | Show progress |
| 10s+ | Broken | Background + notify |

**Tricks for Perceived Speed:**
- Optimistic updates
- Skeleton screens (not spinners)
- Progressive loading (show something fast)
- Preloading likely next actions
- Animations that mask loading

---

## UX Review Template

When reviewing a feature or flow, use this structure:

```markdown
## UX Review: [Feature Name]

### User Goal
What is the user trying to accomplish?

### Current Flow
1. Step one
2. Step two
3. ...

### Friction Points
- Point 1: [Issue] → [Impact] → [Suggestion]
- Point 2: ...

### Quick Wins (< 1 day effort)
- [ ] Win 1
- [ ] Win 2

### Medium Improvements (1-3 days)
- [ ] Improvement 1
- [ ] Improvement 2

### Larger Opportunities (requires design)
- [ ] Opportunity 1
- [ ] Opportunity 2

### Accessibility Concerns
- [ ] Concern 1
- [ ] Concern 2
```

---

## Questions to Ask Users

When you can't observe directly:

1. "Walk me through how you [do X task]"
2. "What's the most annoying part of [workflow]?"
3. "If you had a magic wand, what would you change?"
4. "What workarounds have you created?"
5. "What do you wish you knew when you started?"

---

## Anti-Patterns to Eliminate

### Dark Patterns (Never Do These)
- Trick questions / confusing opt-outs
- Hidden costs
- Forced continuity (hard to cancel)
- Misdirection
- Confirmshaming ("No, I don't want to save money")

### Hostile UX (Fix These)
- Newsletter popups on first visit
- Requiring signup to browse
- Autoplay anything
- Notifications begging to be enabled
- "Download our app" banners

---

## Implementation Priorities

When improving UX, prioritize by impact × frequency:

```
High Frequency + High Friction = FIX IMMEDIATELY
High Frequency + Low Friction = Polish when possible
Low Frequency + High Friction = Add help/documentation
Low Frequency + Low Friction = Ignore
```

---

## The Ultimate Test

Before shipping any feature, ask:

1. **Can my mom use this?** (Simplicity)
2. **Would I use this daily?** (Practicality)
3. **Does this respect the user's time?** (Efficiency)
4. **What's the worst that can happen?** (Error handling)
5. **How does this feel?** (Emotional design)

---

## Usage

Invoke this skill when:
- Reviewing UI/UX designs or mockups
- Planning new features
- Investigating user complaints
- Auditing existing flows
- Making something feel "less clunky"

The goal is always: **Make the complex feel simple, and the simple feel instant.**
