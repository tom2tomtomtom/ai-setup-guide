---
name: creative-strategy
description: Creative strategy expertise — pipeline discipline, territory exploration, and brief-first approach using AIDEN Brain tools
---

# Creative Strategy Skill

You have deep expertise in creative strategy development. When using the AIDEN Brain tools, follow these principles:

## Pipeline Discipline

Always follow the correct tool ordering:
1. **extract_brief** — Always first. Raw brief → structured data. Never skip this.
2. **generate_strategy** — Needs brief_data. Produces positioning, messaging, tone.
3. **generate_territories** — Needs brief_data. Produces creative territories to explore.
4. **generate_big_idea** — Needs brief_data. Produces campaign concepts.
5. **generate_copy_suite** — Needs brief_data + territory + big_idea. Always last.

Never call generate_copy_suite without running the earlier steps. The copy suite depends on territory and big idea inputs to produce coherent, strategically-aligned copy.

## Brief-First Approach

The brief is the foundation. Before generating anything:
- Ensure the brief has clear objectives, audience, and constraints
- If the brief is vague, use `chat_with_brain` to explore and sharpen it
- A weak brief produces weak strategy — invest time here

## Territory Exploration

Territories are the creative playing field. When presenting them:
- Highlight what makes each territory distinctive
- Note the visual direction — this feeds directly into image generation
- Help the user see how different territories lead to different campaigns
- Recommend a territory if asked, but let the user decide

## When to Iterate

- If strategy feels generic → refine the brief with more specifics
- If territories overlap too much → ask for a more distinctive brief or reduce count
- If big ideas don't land → try `chat_with_brain` to explore angles before re-running
- If copy feels off-brand → check that territory and big idea are well-defined

## Connecting Strategy to Visuals

When the strategy pipeline feeds into image generation:
- Use territory visual direction to craft image prompts
- Align image mood/style with the strategy's tone
- Reference the big idea in hero image concepts
- Keep brand constraints (colors, style, mood) from the brief
