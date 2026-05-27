---
description: Generate a buildable spec from a vault idea, commitment, or feature request
argument-hint: [idea-or-feature-name]
---

# Spec It

Generate a concrete, buildable specification from vault context.

What to spec: $ARGUMENTS

1. Search `~/VAULT_PATH/` for all notes related to this topic using the Obsidian CLI:
   ```bash
   obsidian search query="topic" vault="VAULT_NAME"
   obsidian backlinks file="Related Note" vault="VAULT_NAME"
   ```
   Also check Ideas, Projects, Business, Architecture folders.
2. Launch the spec-writer agent with the gathered context
3. Save the spec to `~/VAULT_PATH/Specs/`
4. Update the source note with a link to the spec
5. Open the spec and source note in Obsidian:
   ```bash
   obsidian open file="Spec Name" vault="VAULT_NAME"
   ```
6. Show the spec and ask if I want to build it immediately
