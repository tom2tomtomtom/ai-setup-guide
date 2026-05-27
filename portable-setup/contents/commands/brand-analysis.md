---
name: brand-analysis
description: Map a brand's strategic fit with live cultural trends using Right to Play scoring (GREEN/YELLOW/RED) across social platforms. Use when evaluating which cultural conversations a brand can credibly join, when planning always-on content strategy, or when a brand wants to identify white space opportunities in their category.
---

# Brand Analysis — Strategic Fit & Right to Play

Analyze a brand's strategic fit with current cultural trends. Maps opportunities to a Right to Play framework (GREEN/YELLOW/RED) based on brand values, pillars, and positioning.

## Workflow

1. **Get brand input** from the user:
   - **Required:** Brand name
   - **Optional:** Path to a brand strategy YAML file
   - **Optional:** Specific topics or categories to focus on

2. **Generate brand context:**
   - Auto-detect category from the 25-category taxonomy in SKILL.md
   - Generate brand values, pillars, tone, and target audience
   - If strategy YAML provided, load scoring_rules and reference_examples for calibration

3. **Abbreviated three-layer collection** (lighter than /culture-scan):

   Run Apify MCP scrapers with smaller result sets:
   - **Layer 1 (Direct):** 10 results per platform — brand mentions
   - **Layer 2 (Category):** 10 results per platform — category keywords (top 3 keywords only)
   - **Layer 3 (Trending):** 10 results per platform — general trending

   Platforms: TikTok + Instagram + Twitter/X (skip Reddit unless specifically requested)

4. **Score for brand alignment:**
   - Calculate full Creative Opportunity Score for each result (per SKILL.md)
   - Weight Brand Alignment dimension more heavily for this report (30% instead of 22%)
   - Apply strategy YAML scoring_rules if provided:
     - must_have_one: filter out content that doesn't match any criterion
     - bonus_points: add +5 per match
     - automatic_reject: force SKIP tier
   - Classify Right to Play: GREEN (80-100) / YELLOW (50-79) / RED (0-49)

5. **Generate an interactive HTML dashboard** using the dashboard template in SKILL.md:
   - Save to `~/{brand}-brand-analysis/index.html`
   - Use Tailwind CSS + Chart.js (CDN, single file)
   - Include:
     - Hero header with brand name, category, values, pillars
     - Stat cards: GREEN count, YELLOW count, RED count, avg alignment score
     - **GREEN section:** Right-to-Play cards with score, why it fits, execution idea, link to post
     - **YELLOW section:** Conditional fit cards with risk notes, how to frame
     - **RED section:** Weak fit cards with why to avoid
     - Radar chart: top opportunity score breakdown (6 dimensions)
     - Doughnut chart: GREEN/YELLOW/RED distribution
     - Brand positioning insights: strongest territories, white space, risk zones
     - If strategy YAML reference_examples were provided, comparison section
   - After generating, open in browser: `open ~/{brand}-brand-analysis/index.html`

## Error Handling

- If Apify MCP is not connected, inform the user and offer analysis based on Claude's own cultural knowledge
- If a scraper fails, continue with available platforms
- Without a strategy YAML, results are still useful but less precise — note this in the report

## Examples

- `/brand-analysis` → prompts for brand name
- `/brand-analysis Bunnings` → Bunnings brand fit analysis
- `/brand-analysis Nike --strategy ~/brand-strategies/nike.yaml` → enhanced with strategy file
- `/brand-analysis "Origin Energy" --focus "sustainability, renewable energy"` → focused analysis
