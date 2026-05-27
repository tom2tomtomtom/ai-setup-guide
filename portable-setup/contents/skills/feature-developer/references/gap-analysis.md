# Gap Analysis Framework

## Goal

Find the gaps worth building. Not all gaps are equal — a gap that blocks users is more urgent than a gap that would delight them.

---

## The Four Gap Types

### 1. Missing Table Stakes

Features every serious competitor has. Users expect these before they evaluate anything else.

**Signals:**
- Every competitor has it
- Users mention it in reviews as "basic expectation"
- Absence creates immediate friction (can't complete a core workflow)

**Examples:** search, CSV export, pagination, password reset, delete confirmation

**Priority:** High — fix these before building differentiators.

---

### 2. Flow Dead Ends

Implied next steps that have no implementation. The tech stack sets up a journey the app doesn't complete.

**Pattern:** "You can do X, but you can't do the obvious next thing after X."

**How to find them:** Walk every primary user flow in the codebase. At each action, ask: "What would a user naturally want to do next?" If there's no path to that, it's a dead end.

**Common examples:**
- Auth exists → no password reset, no "change email", no session management
- Payments exist → no billing history, no invoice download, no plan upgrade/downgrade
- Items can be created → can't be bulk-deleted, exported, or archived
- Search exists → no filter, sort, or empty-state guidance
- Notifications are implied → no notification preferences or read/unread state

**Priority:** High — dead ends create user frustration because the need is real and the expectation is set.

---

### 3. Dated Patterns

UX patterns the market has moved past. These don't block users but make the app feel old.

**Signals:**
- Full-page reloads where competitors do in-place edits
- Modal forms where competitors do inline editing
- Separate "edit mode" where competitors do direct manipulation
- No optimistic UI updates (everything feels slow)
- Empty states that just say "No items found" vs. contextual guidance

**How to find them:** Compare interaction patterns in the app to 2-3 competitors. Where does the app require more clicks or page loads for the same action?

**Priority:** Medium — real impact on retention and perception, but not blocking.

---

### 4. Implied but Absent

Features the tech stack makes trivial but haven't been built. Low-effort, high-value.

**How to find them:**
- Look at installed packages that aren't fully used
- Identify data that's collected but not surfaced (e.g., `createdAt` timestamps never shown as "activity")
- Find schema fields that exist but aren't in the UI
- Look for `TODO` comments

**Examples:**
- Timestamps stored but no activity log shown
- User roles defined but no role management UI
- Tags/categories in schema but no filter by tag
- Email sending configured but no "resend confirmation" button

**Priority:** Medium-High — low effort, often high user value.

---

## Scoring Formula

Rank each gap with a simple score:

```
Priority Score = (User Pain × Market Prevalence) ÷ Effort

User Pain:     1 (mild annoyance) → 3 (blocks core workflow)
Market Prevalence: 1 (niche feature) → 3 (table stakes)
Effort:        1 (< 1 hour) → 3 (multi-day)
```

**Examples:**
- No password reset: (3 × 3) ÷ 1 = 9 — build immediately
- No dark mode: (1 × 2) ÷ 1 = 2 — low priority
- Bulk delete: (2 × 3) ÷ 2 = 3 — medium priority

---

## The Audit Checklist

Run through these for any app:

**Core flows:**
- [ ] Can a new user complete the primary action without help?
- [ ] Can a user undo the last destructive action?
- [ ] Are there empty states with guidance (not just "No items")?
- [ ] Do all forms have clear error messages?

**Data management:**
- [ ] Can users search their data?
- [ ] Can users sort and filter?
- [ ] Can users export their data?
- [ ] Can users bulk-select and act on multiple items?

**Account management:**
- [ ] Can users change their email?
- [ ] Can users change/reset their password?
- [ ] Can users delete their account?
- [ ] Is session management visible (active sessions, logout all)?

**Notifications:**
- [ ] Are users notified of important events?
- [ ] Can they control what they're notified about?

**Admin / power user:**
- [ ] Is there activity history?
- [ ] Are there keyboard shortcuts for common actions?
- [ ] Is there a way to get help or contact support?
