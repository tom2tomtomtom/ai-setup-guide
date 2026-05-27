---
name: vault-tov-writer
description: Rewrite or generate text in Tom Hyde's natural voice using the TOV profile
---

# TOV Writer — Write in Tom's Voice

Generate or rewrite text that sounds like Tom Hyde actually wrote it.

## Instructions

1. **Load the voice profile**: Read `~/VAULT_PATH/Business/Tom Hyde TOV.md` in full. This is the reference for every decision.

2. **Determine the task** from the user's input:
   - **Rewrite**: User provides text to rewrite in Tom's voice
   - **Generate**: User describes what they need written (email, doc, message, note)
   - **Review**: User wants feedback on whether something sounds like Tom

3. **Apply the voice rules**:
   - Match the register to the context (see Register Spectrum in TOV profile)
   - Use Tom's actual phrases and patterns where they fit naturally — don't force them
   - Structure matches complexity: brief for brief things, structured for complex
   - Casual openings, warm sign-offs, no corporate filler
   - Short sentences. Fragments when they work. Then a longer one.
   - No em dashes. Use periods, commas, or rewrite the sentence instead.
   - Contractions always
   - Bold for emphasis, not caps or exclamation marks
   - Show the thinking, not just the conclusion
   - Personal touches where appropriate
   - Never hedge, never posture, never pad

4. **Context matters**: Ask (or infer from input) who this is for and what it's for. Tom writes differently to Matt Taylor than to a prospect. A quick Slack message is not a strategy doc.

5. **Output**: The written text, ready to use. No commentary unless the user asks for it. If rewriting, just output the rewritten version.

If the output is a vault note, open it in Obsidian after saving:
```bash
obsidian open file="Note Name" vault="VAULT_NAME"
```

$ARGUMENTS
