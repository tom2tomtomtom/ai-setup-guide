---
description: Analyze hashtag performance across TikTok, Instagram, Twitter/X, YouTube, and Reddit with convergence detection and lifecycle staging. Use when evaluating hashtag opportunities, comparing hashtag reach cross-platform, or assessing whether a hashtag is emerging, peaking, or saturated.
---

# Hashtag Research

Cross-platform hashtag analysis using Apify's social media hashtag research actor, with convergence detection and trend lifecycle assessment.

## Workflow

1. **Get the hashtag(s)** from the user's input. Accept one or more hashtags (with or without the `#` prefix). If no hashtag is provided, ask the user.

2. **Run `apify/social-media-hashtag-research`** via MCP with the hashtag(s). This actor scrapes hashtag data across TikTok, Instagram, Facebook, and YouTube simultaneously.

   Configure the actor input:
   - `hashtags`: Array of hashtags to research (strip `#` prefix if present)
   - Platforms: All supported platforms by default, or filter to specific ones if the user requests

3. **For deeper platform-specific data**, supplement with dedicated scrapers:
   - **TikTok hashtag details:** Use `clockworks/tiktok-scraper` with hashtag search mode
   - **Instagram hashtag posts:** Use `apify/instagram-scraper` with hashtag input
   - **Twitter/X hashtag search:** Use `apidojo/tweet-scraper` with hashtag query
   - **Reddit hashtag/topic search:** `curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/search.json?q={hashtag}&sort=hot&limit=50"`

4. **Detect cross-platform convergence:**
   - If the same hashtag or closely related hashtags are active on 2+ platforms, flag as convergence
   - Convergence = higher cultural significance = stronger signal
   - Compare volume and engagement trends across platforms

5. **Assess trend lifecycle stage** for each hashtag:
   - **Emerging:** Low volume but high engagement per post, recently appeared
   - **Growing:** Exponential post growth, mid-tier creators adopting
   - **Peaking:** Maximum visibility, brands participating, mainstream coverage
   - **Declining:** Volume plateauing, engagement dropping
   - **Saturated:** Oversaturated, low engagement, only evergreen content performs

6. **Score hashtag opportunity** using Creative Opportunity Scoring from SKILL.md:
   - Evaluate top content under each hashtag for opportunity signals
   - Calculate average opportunity score for the hashtag
   - Determine if hashtag is in STRIKE ZONE / OPPORTUNITY / MONITOR / SKIP tier

7. **Present the hashtag research report:**

### Output Format

```
## Hashtag Research: #[hashtag]

### Cross-Platform Convergence
| Platform  | Active? | Post Volume | Avg Engagement | Trend Direction | Lifecycle |
|-----------|---------|-------------|----------------|-----------------|-----------|
| TikTok    | ...     | ...         | ...            | ...             | ...       |
| Instagram | ...     | ...         | ...            | ...             | ...       |
| Twitter/X | ...     | ...         | ...            | ...             | ...       |
| YouTube   | ...     | ...         | ...            | ...             | ...       |
| Facebook  | ...     | ...         | ...            | ...             | ...       |
| Reddit    | ...     | ...         | ...            | ...             | ...       |

**Convergence signal:** {Strong/Moderate/Weak} — active on {X} platforms

### Volume & Growth
- **Total posts (last 7 days):** X
- **Daily average:** X posts/day
- **Growth rate:** +X% week-over-week
- **Peak posting day:** [day]
- **Lifecycle stage:** Emerging / Growing / Peaking / Declining / Saturated

### Opportunity Assessment
- **Opportunity score:** X/100
- **Tier:** STRIKE ZONE / OPPORTUNITY / MONITOR / SKIP
- **Best platform:** {platform with highest engagement}
- **Risk level:** Low / Medium / High

### Related Hashtags
| Hashtag | Co-occurrence Rate | Avg Engagement | Convergence |
|---------|--------------------|----------------|-------------|
| #related1 | X%              | X              | {platforms}  |
| #related2 | X%              | X              | {platforms}  |

### Top Content Using This Hashtag
Top 5 highest-engagement posts across all platforms with links, engagement stats, opportunity score, and content type.

### Recommendations
- **Best platform for this hashtag:** [platform] (highest engagement rate)
- **Optimal posting strategy:** Timing, format, and complementary hashtags
- **Saturation level:** Low/Medium/High — whether the hashtag is worth targeting
- **Brand opportunity:** How a brand could authentically participate
```

## Examples

- `/hashtag-research fitness` → researches #fitness across all platforms
- `/hashtag-research #AIart #generativeart` → compares two hashtags
- `/hashtag-research sustainable fashion tiktok` → TikTok-specific hashtag research
- `/hashtag-research #bunnings` → brand hashtag analysis with convergence detection
