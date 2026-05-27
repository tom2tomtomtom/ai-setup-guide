# Portable Setup Bundle

A packaged version of Tom Hyde's Claude Code environment, ready to clone onto your machine in about 10 minutes.

This is the "skip the climb, copy my exact setup" path for ambitious readers. Use it if you want to skip months of trial and error and start from a battle-tested configuration.

## What's in this folder

The full bundle lives directly in `contents/`:

```
contents/
├── agents/     (8 review agents)
├── commands/   (57 slash commands)
└── skills/     (95 skills)
```

Plus a template `CLAUDE.md.template` at this folder's root.

## What's included

- **8 review agents**: `art-director`, `biz-ceo`, `biz-cfo`, `biz-cmo`, `biz-cpo`, `biz-cro`, `biz-analyst`, `strategist`. Use these for multi-perspective critique of products, copy, and strategy.
- **57 slash commands**: the `/build`, `/spec`, `/execute`, `/analyze` workflow plus 22 vault commands, the creative pipeline (`/brain-chat`, `/creative-strategy`, `/full-campaign`, `/culture-scan`), image and video commands, and operator shortcuts (`/setup`, `/help`, `/plan`).
- **88 skills**: the working library minus proprietary, client-specific, and plugin-managed items. Covers vault operations, creative strategy, coding workflows, framework patterns, design systems, deployment, debugging, and meta-tools.

## Plugin-managed skills (install separately)

Some skills in Tom's setup are managed by official Anthropic plugins, not shipped as standalone files. Install these plugins to add them to your environment:

- **`caveman` plugin**: adds `caveman`, `caveman-commit`, `caveman-review`, `compress` (ultra-compressed reviews, commits, and memory file compression)
- **`supabase` plugin**: adds `supabase` and `supabase-postgres-best-practices` (official Supabase agent skills)
- **`stripe` plugin**: adds `stripe-best-practices`, `stripe-projects`, `upgrade-stripe` (official Stripe integration skills)

Install via your Claude Code plugin marketplace or with `claude plugins install <plugin-name>`. Tom's reference list of weekly-used skills (see the main `README.md`) assumes these are installed.
- **Template `CLAUDE.md`**: fill-in-the-blanks starter for your own vault root.

## Excluded (and why)

The following skills were removed from the public bundle because they reference proprietary work, specific clients, or have personal credentials embedded:

- **AIDEN-specific**: `aiden-auth-debug`, `aiden-design-system`, `aiden-pptx`
- **Client-specific**: `lego-brand-guidelines`, `lego-brand-check`, `monigle-pptx`, `vscope-writer`, `streem-to-tracker`, `altshift-reverse-brief`, `clio-build`
- **Redbaez personal products**: `redbaez-warm-design-system`, `deal-review`, `brief-sharpener`, `teaching-brain`, `phantom-brain`
- **Has personal API keys**: `facebook-marketing-api`
- **Calls proprietary endpoints**: `brain-chat` (hardcoded to Tom's AIDEN Brain V2 API)

If you adapt this setup, build your own equivalents for any of these you actually need.

## Installation

1. Complete the **Quickstart** in the main `README.md` at the repo root (install Node.js and Claude Code).
2. Copy the contents of `contents/` into your Claude Code config:
   ```bash
   mkdir -p ~/.claude/agents ~/.claude/commands ~/.claude/skills
   cp -r contents/agents/*    ~/.claude/agents/
   cp -r contents/commands/*  ~/.claude/commands/
   cp -r contents/skills/*    ~/.claude/skills/
   ```
3. Copy the CLAUDE.md template into your vault root and fill it in:
   ```bash
   cp CLAUDE.md.template ~/your-vault/CLAUDE.md
   # then edit with your name, business, voice rules, never-dos
   ```
4. Launch a fresh shell, run `claude`, and the new commands and skills are available immediately.

## What you'll have after this

A Claude Code environment matching Tom's working stack, minus the personal and client-specific items. From there you'll add your own CLAUDE.md, your own vault, and your own skills as you climb the levels in the main guide.

## Caveats

- **This is a snapshot, not a maintained product.** Skills and commands evolve. Use it as a starting state, not a final state.
- **Your CLAUDE.md is yours.** The template gives you the structure but the content has to be your real voice, business, and never-dos.
- **You still need to learn the underlying concepts.** The bundle gives you configuration, not the mental model. Read the main guide alongside using it.
- **Some skills reference Tom's vault structure** (e.g. paths like `~/VAULT_PATH/Business/Mother London Engagement.md`). These are illustrative. Adapt the paths and client names to your own vault during setup.
