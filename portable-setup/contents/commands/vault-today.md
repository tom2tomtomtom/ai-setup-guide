---
name: vault-today
description: Build a prioritized daily plan by reading recent daily notes, active projects, inbox items, and business commitments. Use when you need to decide what matters most right now, clear decision fatigue about priorities, or create a focused plan from the noise of open tasks and projects.
---

# Today — What Should I Focus On?

Read the vault and help me figure out what matters most today.

## Instructions

1. **Read recent daily notes**: Check `~/VAULT_PATH/Daily Notes/` for the last 3-5 entries. Look at what was worked on, what's stuck, and what was planned.

2. **Read active project notes**: Scan `~/VAULT_PATH/Projects/` and `~/VAULT_PATH/AIDEN/` for anything marked as active or in-progress.

3. **Read business context**: Check `~/VAULT_PATH/Business/Redbaez.md` and client notes for any time-sensitive commitments.

4. **Check inbox**: Read `~/VAULT_PATH/Inbox/` for anything that needs attention.

5. **Synthesize into a plan**:

   ### Top Priority
   The one thing that would make today a win.

   ### Should Also Do
   2-3 things that matter but aren't the main event.

   ### Can Wait
   Things that are on the radar but don't need attention today.

   ### Blockers to Resolve
   Anything that's stuck from previous days.

   ### Quick Wins
   Small tasks that can be knocked out in < 15 minutes.

6. **Create today's daily note** using the Obsidian CLI:
   ```bash
   obsidian daily vault="VAULT_NAME"
   ```
   This creates and opens the daily note using the vault's template automatically.

7. **Append the plan** to today's daily note:
   ```bash
   obsidian daily:append content="## Today's Plan\n- Top: [priority]\n- Also: [items]\n- Quick wins: [items]" vault="VAULT_NAME"
   ```

$ARGUMENTS
