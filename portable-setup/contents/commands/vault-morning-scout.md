---
description: Start the day with a comprehensive briefing that reviews yesterday's git activity, scouts for opportunities, and produces prioritized build targets with effort estimates. Use first thing in the morning to know exactly what to build, what revenue actions to take, and what commitments are going stale.
---

# Morning Scout

Comprehensive morning briefing combining vault intelligence with actionable build targets.

## Steps

1. **Load today's context**: Read recent daily notes, check what was worked on yesterday (git logs from active projects)

2. **Run scout**: Launch the scout agent to scan for opportunities, stale commitments, and quick wins

3. **Check calendar context**: Read `~/VAULT_PATH/Business/Time Allocation.md` and any daily notes for today's constraints

4. **Synthesize daily plan**:
   ```
   ## Morning Scout — [date]

   ### Yesterday's Progress
   - [what git logs show was actually done]

   ### Today's Build Targets
   1. **[Highest priority]** — [why, effort estimate, client impact]
   2. **[Second priority]** — [why, effort estimate]
   3. **Quick win** — [something shippable in < 1 hour]

   ### Stale Items (Needs Attention)
   - [overdue commitments]

   ### Revenue Actions
   - [proposals to send, invoices due, blockers to fix]

   ### Vault Updates Needed
   - [notes that need updating based on recent work]
   ```

5. **Create/open today's daily note** and append the plan:
   ```bash
   obsidian daily vault="VAULT_NAME"
   obsidian daily:append content="## Morning Scout\n[paste synthesized plan here]" vault="VAULT_NAME"
   ```

6. **Ask**: "Want me to start building #1, or spec something first?"
