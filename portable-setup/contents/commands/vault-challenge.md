---
name: vault-challenge
description: Pressure-test thinking by finding contradictions, blind spots, and shifts across the Obsidian vault
---

# Challenge — Pressure Test My Thinking

Read the Obsidian vault at `~/VAULT_PATH/` and find where my thinking is inconsistent, outdated, or has blind spots.

## Instructions

1. **Read broadly** across the vault — AIDEN, Projects, Business, Ideas, Concepts, Architecture. Use the Obsidian CLI to accelerate discovery:
   ```bash
   obsidian search query="keyword" vault="VAULT_NAME"
   obsidian backlinks file="Note Name" vault="VAULT_NAME"
   ```

2. **Look for**:
   - **Contradictions**: Am I saying one thing in one note and something different elsewhere? (e.g., architectural principles that the actual projects violate)
   - **Stale assumptions**: Decisions or patterns documented as current that might be outdated given newer notes
   - **Overconfidence**: Areas where I seem very certain but the evidence in the vault is thin
   - **Underexplored risks**: Projects or business plans where risks aren't documented
   - **Missing perspectives**: Viewpoints or considerations that are absent (e.g., user perspective, competitor analysis, technical debt)
   - **Scope creep signals**: Projects or ideas that keep expanding across multiple notes without clear boundaries

3. **Be direct**: Don't soften the findings. If something looks like a genuine blind spot, say so clearly.

4. **Output format**: For each finding:
   - **The contradiction/blind spot**: What I found
   - **Where**: Specific notes involved
   - **Why it matters**: What could go wrong if this isn't addressed
   - **Suggested resolution**: How to fix or investigate

$ARGUMENTS
