---
description: Analyze any social media profile for content strategy insights with influencer tier classification and opportunity scoring. Use when evaluating a creator or competitor account, assessing brand partnership fit, or benchmarking engagement against tier averages.
---

# Profile Analysis

Analyze a social media profile or competitor account for content strategy insights, with influencer tier classification and content strategy scoring.

## Workflow

1. **Get the profile** from the user's input. Accept:
   - A username (e.g., `@username`)
   - A profile URL (e.g., `https://www.tiktok.com/@username`)
   - A platform + username combination (e.g., `instagram therock`)

   If no profile is provided, ask the user for the platform and username.

2. **Detect the platform** from the URL or ask the user:
   - `tiktok.com` → TikTok
   - `instagram.com` → Instagram
   - `twitter.com` or `x.com` → Twitter/X
   - `youtube.com` → YouTube
   - `facebook.com` → Facebook

3. **Run the appropriate scraper** via MCP:
   - **TikTok:** `clockworks/tiktok-scraper` with profile mode — scrape user info + recent videos
   - **Instagram:** `apify/instagram-scraper` with profile mode — scrape user info + recent posts
   - **Twitter/X:** `apidojo/tweet-scraper` with user timeline mode — scrape profile + recent tweets
   - **YouTube:** Use `actors` tool to find a YouTube channel scraper — scrape channel info + recent videos
   - **Facebook:** Use `actors` tool to find a Facebook page scraper — scrape page info + recent posts

   Configure to fetch the profile metadata and the last 50-100 posts for analysis.

4. **Classify influencer tier** based on follower count (reference SKILL.md):
   | Tier | Followers | Characteristics |
   |------|-----------|----------------|
   | Nano | 1K-10K | Highest engagement rates, niche authority |
   | Micro | 10K-100K | Strong engagement, category expertise |
   | Mid-tier | 100K-500K | Trend indicator — when they adopt, it's growing |
   | Macro | 500K-1M | Broad reach, mainstream validation |
   | Mega | >1M | Mass awareness, lower engagement rates |

5. **Score content strategy** using opportunity signals from SKILL.md:
   - Analyze top-performing content for opportunity signal keywords (community, creativity, celebration, empowerment, education, humor, nostalgia, transformation)
   - Calculate average opportunity score across recent posts
   - Identify which content categories perform best
   - Assess authenticity vs commercial content ratio

6. **Analyze and present the profile report:**

### Output Format

```
## Profile Analysis: @[username] ([Platform])

### Profile Overview
- **Followers:** X
- **Following:** X
- **Total posts:** X
- **Account created:** [date]
- **Bio:** [bio text]
- **Verified:** Yes/No
- **Influencer Tier:** Nano / Micro / Mid-tier / Macro / Mega

### Engagement Metrics (last 30 posts)
- **Average likes:** X per post
- **Average comments:** X per post
- **Average shares:** X per post
- **Engagement rate:** X% (vs benchmark for their tier: X%)
- **Best performing post:** [link] — X engagement
- **Performance vs tier benchmark:** Above Average / Average / Below Average

### Content Strategy Score
- **Overall opportunity score:** X/100
- **Strongest signal:** {which opportunity category dominates — e.g., humor, community, education}
- **Authenticity ratio:** X% organic vs X% commercial/sponsored
- **Content diversity:** High / Medium / Low

### Posting Patterns
- **Frequency:** X posts per week
- **Most active days:** [days]
- **Most active hours:** [hours]
- **Consistency score:** High/Medium/Low

### Content Analysis
- **Top content formats:** Video (X%), Image (X%), Carousel (X%), Text (X%)
- **Average content length:** X seconds (video) / X words (text)
- **Top hashtags used:** #tag1 (X times), #tag2 (X times)
- **Content themes:** Theme 1, Theme 2, Theme 3
- **Opportunity signals detected:** {community, creativity, humor, etc.}

### Top Performing Content
| # | Post | Date | Likes | Comments | Shares | Eng Rate | Opp Score |
|---|------|------|-------|----------|--------|----------|-----------|
| 1 | ...  | ...  | ...   | ...      | ...    | ...      | ...       |

### Growth & Trajectory
- **Follower growth trend:** Growing / Stable / Declining
- **Engagement trend:** Improving / Stable / Declining
- **Content evolution:** Notable shifts in content strategy

### Competitive Insights
- **Strengths:** What this account does well
- **Opportunities:** Gaps in their content strategy
- **Takeaways:** Lessons to apply to your own strategy

### Collaboration Potential (if analyzing for brand partnership)
- **Right to Play areas:** {topics where this creator has authentic authority}
- **Brand alignment score:** X/100 (if brand context provided)
- **Risk factors:** {any content that could pose brand safety concerns}
```

## Examples

- `/profile-analysis https://www.tiktok.com/@charlidamelio` → full TikTok profile analysis
- `/profile-analysis instagram @natgeo` → Instagram profile analysis
- `/profile-analysis twitter elonmusk` → Twitter/X profile analysis
- `/profile-analysis tiktok @username --brand Bunnings` → profile analysis with brand alignment scoring
