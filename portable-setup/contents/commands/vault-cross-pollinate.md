---
name: vault-cross-pollinate
description: Find unexpected connections between projects by smashing together ideas from different vault domains. Use when you feel stuck creatively, want to discover hidden product opportunities, or need fresh angles on existing work by combining unrelated concepts.
---

# Cross-Pollinate — Force New Connections

Read the Obsidian vault at `~/VAULT_PATH/` and deliberately smash together ideas from different domains to generate new possibilities.

## Instructions

1. **Read** notes from at least 3 different folders — mix projects, concepts, business, and tech stack notes. Use the Obsidian CLI to explore connections:
   ```bash
   obsidian backlinks file="Note Name" vault="VAULT_NAME"
   obsidian tags vault="VAULT_NAME"
   ```

2. **Generate 5+ unexpected combinations**, each following this format:

   ### [Concept A] + [Concept B] = ?
   - **The mashup**: What happens if you apply the core idea from A to the domain of B?
   - **Why it's interesting**: What problem would this solve? Who would benefit?
   - **Feasibility**: Quick gut check — is this a weekend hack or a 6-month project?
   - **Next step**: One concrete action to explore this

3. **Prioritize surprising combinations**, not obvious ones. Some seed ideas:
   - What if [[Phantom System]] personas were used outside of advertising? (e.g., in trading, in user research, in product design)
   - What if [[Culture Wire]]'s trend detection was applied to a client's internal communications?
   - What if [[AIDEN Pitch]]'s 7-step workflow was adapted for non-advertising use cases?
   - What if the [[Apex Trader]] ML approach was applied to client health scoring?
   - What would a mashup of [[Refer-ify]] and [[AIDEN Platform]] look like?

4. **If asked**, create notes for the best ideas in `~/VAULT_PATH/Ideas/`. Open each in Obsidian after creating:
   ```bash
   obsidian open file="New Idea" vault="VAULT_NAME"
   ```

$ARGUMENTS
