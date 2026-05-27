# Portable Setup Bundle

A packaged version of Tom Hyde's Claude Code environment, ready to clone onto your machine in about 10 minutes.

This is the "skip the climb, copy my exact setup" path for ambitious readers. Use it if you want to skip months of trial and error and start from a battle-tested configuration.

## What's in it

- `settings.json` with 12 enabled plugins, 4 hooks, sensible defaults
- 4 production hook scripts:
  - `block-dangerous`, prevents `rm -rf`, force pushes to main, and other irreversible operations without confirmation
  - `env-leak-guard`, scans for secrets being printed, logged, or committed
  - `check-ts-after-edit`, runs the TypeScript compiler after edits to `.ts` files
  - `post-compact-context`, restores critical context after a session compaction
- 98 skills (personal and client-specific skills excluded for portability)
- 58 slash commands
- 8 review agents (art-director, biz-ceo / cfo / cmo / cpo / cro, biz-analyst, strategist)
- Template `CLAUDE.md` you fill in with your own stack and vault details
- `.mcp.json` with `gws` and `serena` connectors

All paths in the bundle are scrubbed to placeholders. The recipient substitutes their own during setup.

## Excluded from the bundle (and why)

Some skills are excluded because they reference specific clients, AIDEN-proprietary work, or have personal API keys embedded:

- **AIDEN-specific**: `aiden-auth-debug`, `aiden-design-system`, `aiden-pptx`
- **Client-specific**: `lego-brand-guidelines`, `monigle-pptx`, `vscope-writer`, `streem-to-tracker`
- **Redbaez personal products**: `redbaez-warm-design-system`, `deal-review`, `brief-sharpener`, `teaching-brain`
- **Has API keys embedded**: `facebook-marketing-api`

If you adapt this setup, build your own equivalents for any of these you actually need.

## Distribution

**Bundle** (`tommy-claude-bundle.tar.gz`, ~8 MB)
- Drive link: https://drive.google.com/file/d/1fWN0Uu8BGjVoduxY98nYlQuCaNuX3_wG/view?usp=sharing
- File ID: `1fWN0Uu8BGjVoduxY98nYlQuCaNuX3_wG`

**Super prompt** (companion file for the bundle)
- Drive link: https://drive.google.com/file/d/1zhz1kmsDpKF0B_paKnAHlCsW_t9YRCCb/view?usp=sharing
- File ID: `1zhz1kmsDpKF0B_paKnAHlCsW_t9YRCCb`

## Recipient flow

1. Complete the **Quickstart** in the main README first (install Node.js and Claude Code)
2. Save the bundle to `~/Downloads/tommy-claude-bundle.tar.gz`
3. Open a fresh Claude Code session
4. Paste the **super prompt** (downloaded from the Drive link above) as your first message
5. Answer 5 questions: deploy platform, frontend stack, database, vault path, vault name
6. Claude extracts the bundle, scrubs the placeholders to your values, writes the configs
7. Launch a new shell, run `claude`, and the plugins auto-install
8. From here, follow the main guide level by level

## What you'll have after this

A Claude Code environment that matches Tom's, minus the personal and client-specific skills. From there you'll add your own CLAUDE.md, your own vault, and your own skills as you climb the levels.

## Caveats

- **This is a snapshot**, not a maintained product. Skills and plugins evolve. Use it as a starting state, not a final state.
- **Your CLAUDE.md is yours**. The template gives you the structure but the content has to be your real voice, business, and never-dos.
- **You still need to learn the underlying concepts**. The bundle gives you the configuration, not the mental model. Read the main guide alongside using it.
