# UX Quality Bar

What "great UX" actually means — concrete, actionable, testable.

---

## The Core Test

**Can a new user complete the primary action without reading instructions?**

If no, the UX is failing. Everything else is secondary.

---

## The 12 Principles

### 1. Zero-friction happy path

The most common action should require the fewest clicks. Count the steps for the primary user flow. If it's more than 4-5 steps, find what to collapse.

**Bad:** Create account → verify email → fill profile → tutorial → dashboard → create first item
**Good:** Create account → onboarding creates first item alongside signup

---

### 2. Immediate feedback

Every action should have visible acknowledgment within 200ms. Use optimistic updates — show the result immediately, reconcile with server in background.

**Signals of failure:** Buttons that don't visually respond when clicked, forms that go blank after submit, operations with spinners but no success confirmation.

---

### 3. Reversible by default

Destructive actions should be easy to undo. If something can't be undone, warn clearly before — not after.

**Pattern:** Soft deletes (move to trash, restore within 30 days) beat hard deletes. Confirmation dialogs should describe what will happen, not just ask "Are you sure?"

---

### 4. Contextual empty states

Empty states aren't errors — they're first-time user moments. Every empty state should:
- Explain what would appear here
- Give a clear action to get started
- Make the action feel easy (low-stakes, reversible)

**Bad:** "No items found."
**Good:** "You haven't created any projects yet. [Create your first project →]"

---

### 5. Consistent error messages

Errors should explain: what went wrong, why it went wrong, and what to do next.

**Bad:** "Error 422"
**Bad:** "Something went wrong"
**Good:** "This email is already in use. [Sign in instead →] or [Reset your password →]"

---

### 6. Keyboard-first power users

Users who use a product daily will reach for the keyboard. At minimum:
- Tab order makes sense
- Forms submit on Enter
- Escape closes modals
- Common actions have keyboard shortcuts (document them somewhere)

---

### 7. Loading states that communicate progress

Spinners are vague. Where possible, show what's happening:
- "Saving..." not just a spinner
- "Generating report (usually takes 5-10 seconds)..." not just a spinner
- Skeleton screens that match the real content layout

---

### 8. Mobile-first, not mobile-fixed

Design for the smallest viewport first. Test that:
- Primary actions are reachable with one thumb
- Touch targets are at least 44×44px
- Horizontal scroll never appears unexpectedly
- Modals don't overflow the viewport

---

### 9. Sensible defaults

Every form field, setting, and option should default to the choice most users would make. If you need a user to understand a setting before they can use it safely, reconsider whether it should be a setting at all.

---

### 10. Progressive disclosure

Show what users need now. Hide advanced options behind a "Show more" / "Advanced settings" pattern. Don't overwhelm the first-time experience with the full feature set.

---

### 11. Typography does the hierarchy work

Use font weight, size, and color to create visual hierarchy — not borders, backgrounds, and icons. A page where the most important thing isn't immediately obvious has a typography problem.

---

### 12. Consistent language

The same concept should have the same name throughout the product. If the nav says "Projects" but the empty state says "workspaces", users will lose confidence. Audit all labels, buttons, headings, and error messages for terminology consistency.

---

## The Anti-Patterns List

When writing a feature, check against these:

- [ ] No loading state during async operations
- [ ] Destructive actions with no confirmation or undo
- [ ] Empty states that just say "No [thing] found"
- [ ] Error messages that don't explain what to do
- [ ] Forms that reset on error (losing all input)
- [ ] Buttons that don't respond visually to clicks
- [ ] Actions that take >3 seconds with no progress indicator
- [ ] Mobile layouts where the primary CTA is off-screen
- [ ] Different terms for the same concept in different parts of the UI
- [ ] Settings that require reading documentation to understand
