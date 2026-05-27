---
name: deal-review
description: "Review active deals from the vault's Deal Tracker, analyze silence periods and risk, and generate chase strategies using C-suite phantom perspectives. Use when: (1) You want to review your pipeline, (2) Check deal health or silence periods, (3) Get chase strategies for stalled deals, (4) Prioritize which deals need action today, (5) Understand revenue at risk."
user_invocable: true
invocation: /deal-review
---

# Deal Review

Analyze your active deal pipeline, flag at-risk deals based on silence periods, and generate specific chase strategies through three C-suite phantom perspectives.

## Invocation

- **`/deal-review`** -- Full pipeline review with all active deals
- **`/deal-review [deal-name]`** -- Deep dive on a specific deal

## Process

### Phase 1: Load Pipeline Context

Read these three vault files to build the full picture:

1. **`~/[your-vault]/Business/Deal Tracker.md`** -- Current deal status, last contact dates, deal values
2. **`~/[your-vault]/Business/BD Pipeline.md`** -- Pipeline stages, relationship context, deal history
3. **`~/[your-vault]/Business/Revenue Forecast - 2026.md`** -- Revenue targets, forecast gaps, quarterly goals

If any file is missing, warn the user and proceed with what is available.

**Build a PipelineContext block from these files:**

```markdown
## PipelineContext

**Total active deals:** [count]
**Total pipeline value:** [sum]
**Revenue target (current quarter):** [from forecast]
**Forecast gap:** [target minus committed revenue]
**Deals reviewed:** [list deal names]
**Review date:** [today's date]
```

### Phase 2: Analyze Each Active Deal

For every active deal found in the Deal Tracker, calculate and assess:

1. **Days since last contact (sent):** Count calendar days from the last outreach you sent
2. **Days since last contact (received):** Count calendar days from the last response received
3. **Chase interval exceeded:** Compare silence period against expected chase cadence. Default intervals if not specified in the tracker:
   - Hot/closing deals: 3 days
   - Warm/active deals: 7 days
   - Cool/early-stage deals: 14 days
4. **Revenue at risk:** The deal value that could be lost if this deal stalls or dies
5. **Relationship temperature:** Assess based on the tone and content of the last interaction:
   - HOT: Active back-and-forth, clear next steps agreed
   - WARM: Positive signals but no concrete commitment
   - COOL: Slow responses, vague language, deferrals
   - COLD: No response to last 2+ attempts

**Assign a risk level to each deal:**

| Risk Level | Criteria |
|------------|----------|
| GREEN | Within chase interval, positive signals, clear next steps |
| AMBER | Chase interval exceeded by 1-7 days, OR vague last response, OR no next steps defined |
| RED | Chase interval exceeded by 7+ days, OR no response to 2+ attempts, OR deal value at risk with no backup |

### Phase 3: Phantom Perspectives (AMBER and RED Deals Only)

For each deal rated AMBER or RED, run it through three phantom perspectives. These are not generic. Each perspective must reference the specific deal, the specific client, and the specific situation.

#### CRO Perspective (Chief Revenue Officer)
- Is this deal actually closeable, or are we chasing a ghost?
- What is the realistic conversion probability (percentage)?
- What is the optimal chase timing right now? (Wait, nudge, escalate, or walk away?)
- What specific objection or blocker is likely stalling this?

#### CEO Perspective (Chief Executive Officer)
- Does this deal matter strategically beyond its revenue value?
- Should we invest more time, or cut losses and reallocate effort?
- Is there a bigger relationship or referral opportunity here worth protecting?
- Would a different approach (partnership, pilot, reduced scope) unlock it?

#### CMO Perspective (Chief Marketing Officer)
- What value-add content, case study, or proof point could restart the conversation?
- Is there a recent industry development or trend we can reference to add urgency?
- What non-salesy touchpoint could warm this back up? (Sharing an article, inviting to an event, introducing to someone)
- What messaging angle have we not tried yet?

### Phase 4: Output

Present the full review in this format:

```markdown
# Deal Pipeline Review
**Date:** [today]
**Active deals:** [count] | **Pipeline value:** [total]
**Quarterly target:** [amount] | **Gap:** [amount]

---

## Deal-by-Deal Analysis

### [Deal Name]
**Client:** [name] | **Value:** [amount] | **Tier:** [tier if known]
**Stage:** [pipeline stage]
**Days silent (sent):** [N] | **Days silent (received):** [N]
**Risk:** [GREEN/AMBER/RED]

[If AMBER or RED, include phantom perspectives:]

**CRO says:** [2-3 sentences, specific to this deal]
**CEO says:** [2-3 sentences, specific to this deal]
**CMO says:** [2-3 sentences, specific to this deal]

**Recommended action:** [Specific action. Not "follow up" but the actual email subject line, opening sentence, or call talking point.]
**Deadline:** [Specific date by which this action must happen]

---

[Repeat for each deal, ordered by risk level: RED first, then AMBER, then GREEN]

---

## Priority Action List

| # | Deal | Risk | Action | Deadline |
|---|------|------|--------|----------|
| 1 | [name] | RED | [specific action] | [date] |
| 2 | [name] | AMBER | [specific action] | [date] |
| ... | | | | |

## Revenue at Risk Summary
- **RED deals total:** [amount]
- **AMBER deals total:** [amount]
- **GREEN deals total:** [amount]
- **Unrecoverable if no action this week:** [amount from RED deals past 14 days silence]
```

## Anti-Patterns

- **No vague advice.** "Follow up with them" is worthless. Write the actual email subject line and opening sentence.
- **No false optimism.** If a deal is dead, say it is dead. Suggest a graceful close-out message instead of another chase.
- **No generic templates.** Every recommended action must reference something specific to that client, their industry, or the last conversation.
- **No skipping the math.** Always calculate days silent and revenue at risk. Gut feelings are supplementary, not primary.
- **No ignoring GREEN deals.** They still get listed, just without phantom analysis. A GREEN deal can slip to AMBER overnight.
