---
description: Run a full autonomous pipeline that scouts the vault for opportunities, generates a buildable spec, and executes the build. Use when you want end-to-end hands-off building, have a named feature to ship, or want the system to pick the highest-value thing to build.
argument-hint: [what-to-build or "auto" for scout-driven]
---

# Auto Build

Full autonomous pipeline: scan vault, pick the highest-value opportunity, spec it, build it.

Input: $ARGUMENTS

## If "auto" or no argument:

1. **Scout**: Launch the scout agent to scan `~/VAULT_PATH/` (use `obsidian search` for fast discovery) for the highest-value buildable opportunity
2. **Confirm**: Present the top 3 opportunities and ask which one to build
3. **Spec**: Launch the spec-writer agent to create a buildable spec from the chosen opportunity
4. **Review**: Show me the spec. Ask for approval before building.
5. **Build**: Launch the builder agent to execute the spec
6. **Report**: Show the build report. Ask if I want to commit.

## If a specific thing is named:

1. **Context**: Search the vault for all notes related to the named thing (use `obsidian search query="thing" vault="VAULT_NAME"` + `obsidian backlinks`)
2. **Spec**: Launch the spec-writer agent using vault context
3. **Review**: Show the spec. Ask for approval.
4. **Build**: Launch the builder agent
5. **Report**: Show results

## Safety Rails

- Always pause for approval before building (step 4)
- Never commit or push without explicit permission
- Never modify auth, deployment, or infrastructure without confirmation
- If the builder hits a blocker, report it and ask for direction
- Maximum scope per run: changes touching fewer than 10 files
