---
name: culture-wire-intelligence
description: Analyze cultural trends with creative opportunity scoring, tension detection, brand alignment assessment, and interactive HTML dashboard generation. Use when running a culture scan for a brand, scoring content for creative opportunities, or detecting cultural tensions and battlegrounds across social platforms.
---

# Culture-Wire Intelligence — Social Media & Cultural Trend Analysis

Expert knowledge for analyzing social media trends, cultural tensions, brand alignment, and creative opportunities across platforms. Encodes the full culture-wire strategic analysis framework so Claude acts as the cultural intelligence analyst.

## Activation

This skill activates when the conversation involves:
- Social media trend analysis or research
- Hashtag strategy or research
- Content performance metrics and benchmarking
- Competitor/profile analysis on social platforms
- What's trending on TikTok, Instagram, Twitter/X, YouTube, Facebook, or Reddit
- Cultural tension or battleground analysis
- Brand alignment / right-to-play assessment
- Creative opportunity scoring
- Culture scans or cultural intelligence reports

---

## Platform-Specific Knowledge

### TikTok
- **Engagement rate formula:** (likes + comments + shares) / views x 100
- **Good engagement rate:** 3-9% is average, >10% is excellent
- **Video performance window:** Most views come within the first 48 hours; the algorithm re-surfaces content in waves
- **Key metrics:** Views, likes, comments, shares, saves, watch time, completion rate
- **Trending signals:** Sound usage velocity, hashtag view acceleration, effect adoption rate
- **Content lifecycle:** 2-7 days for trending content; sounds can trend for 2-4 weeks

### Instagram
- **Engagement rate formula:** (likes + comments + saves + shares) / followers x 100
- **Good engagement rate:** 1-3% is average for accounts >10K followers, >6% is excellent
- **Reels vs Feed:** Reels get 2-3x more reach than feed posts; algorithm favors Reels for discovery
- **Key metrics:** Reach, impressions, likes, comments, saves, shares, profile visits
- **Trending signals:** Reels audio trending indicator, hashtag recent post velocity, explore page inclusion

### Twitter/X
- **Engagement rate formula:** (likes + retweets + replies + clicks) / impressions x 100
- **Good engagement rate:** 0.5-1% is average, >3% is excellent
- **Virality threshold:** Content that gets rapid retweets within the first hour signals to the algorithm
- **Key metrics:** Impressions, likes, retweets, quote tweets, replies, bookmarks, link clicks
- **Trending signals:** Trending topics list, rapid engagement acceleration, quote tweet volume

### YouTube
- **Engagement rate formula:** (likes + comments) / views x 100
- **Good engagement rate:** 2-5% is average, >8% is excellent
- **Key metrics:** Views, watch time, likes, comments, shares, subscribers gained, CTR, average view duration
- **Trending signals:** Trending tab inclusion, rapid view velocity, high CTR + retention combo
- **Shorts vs Long-form:** Shorts get higher view counts but lower watch time; long-form drives more subscribers

### Facebook
- **Engagement rate formula:** (reactions + comments + shares) / reach x 100
- **Good engagement rate:** 0.5-1% is average for pages, >2% is excellent
- **Key metrics:** Reach, reactions, comments, shares, link clicks, video views (3-second and 1-minute)
- **Trending signals:** Share velocity, comment thread depth, cross-posting to groups

### Reddit (Free — no API cost)
- **Collection method:** `curl -s -H "User-Agent: $REDDIT_USER_AGENT" "https://www.reddit.com/r/{subreddit}/hot.json?limit=50"`
- **Key metrics:** Upvote ratio, comment count, award count, crosspost count
- **Good engagement:** >90% upvote ratio + >100 comments = culturally resonant
- **Trending signals:** Rapid upvote velocity, cross-subreddit posting, high comment-to-upvote ratio
- **Useful subreddits for Australian trends:** r/australia, r/melbourne, r/sydney, r/AusFinance, r/CasualAustralia

### Engagement Rate Benchmarks by Follower Count
| Followers | TikTok | Instagram | Twitter/X | YouTube |
|-----------|--------|-----------|-----------|---------|
| <1K       | 10-15% | 5-10%     | 2-5%      | 5-10%   |
| 1K-10K    | 8-12%  | 3-6%      | 1-3%      | 4-8%    |
| 10K-100K  | 5-9%   | 2-4%      | 0.5-2%    | 3-6%    |
| 100K-1M   | 3-7%   | 1-3%      | 0.3-1%    | 2-5%    |
| >1M       | 2-5%   | 0.5-2%    | 0.1-0.5%  | 1-3%    |

### Red Flags in Data
- **Engagement-to-follower ratio too high:** Possible engagement pods or bot activity
- **Views massively exceed followers:** Could be paid promotion or algorithm boost (not organic trend)
- **Comments are generic/repetitive:** Bot activity or engagement group behavior
- **Sudden follower spikes without content:** Purchased followers

---

## Creative Opportunity Scoring (0-100)

Score every piece of collected content for creative opportunity potential. This is the core scoring engine from culture-wire.

### 6 Weighted Dimensions

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| Cultural Relevance | 22% | Engagement volume, conversation depth, opportunity signals |
| Brand Alignment | 22% | Match to brand values, pillars, and keywords |
| Authenticity Potential | 18% | Community-driven, educational, empowerment signals vs commercial |
| Virality Potential | 18% | Total engagement velocity, share ratio, existing virality score |
| Geo-Relevance | 12% | Australian content signals (domains, locations, cultural markers) |
| Risk Level | 8% (inverse) | Lower risk = higher score |

**Formula:** `total = cultural*0.22 + brand*0.22 + authenticity*0.18 + virality*0.18 + geo*0.12 + (100-risk)*0.08`

### Opportunity Signal Keywords (boost cultural relevance)
| Category | Keywords |
|----------|----------|
| Community | community, together, united, collective, movement |
| Creativity | creative, art, design, expression, innovation |
| Celebration | celebrate, honor, recognize, appreciate, proud |
| Empowerment | empower, inspire, motivate, enable, support |
| Education | learn, teach, education, awareness, inform |
| Humor | funny, humor, lol, hilarious, comedy, meme |
| Nostalgia | nostalgia, remember, throwback, classic, iconic |
| Transformation | transform, change, evolve, grow, improve |

### Risk Signal Keywords (increase risk score)
| Category | Weight | Keywords |
|----------|--------|----------|
| High Risk | +30 per match | tragedy, disaster, death, violence, scandal |
| Political | +20 per match | politics, politician, election, government, policy |
| Divisive | +15 per match | controversial, divided, backlash, outrage, cancel |
| Sensitive | +10 per match | trauma, pain, suffering, victim, crisis |

### Opportunity Tiers
| Tier | Score Range | Action |
|------|-------------|--------|
| STRIKE ZONE | 80-100 | High-value — go for it. Strong potential for authentic participation |
| OPPORTUNITY | 65-79 | Good potential — consider alignment with brand strategy |
| MONITOR | 50-64 | Worth watching — not ready to act yet |
| SKIP | 0-49 | Low priority — focus on higher-value opportunities |

### Scoring Modifiers
- **Australian content boost:** Content with geo-relevance >= 50 gets a 1.35x multiplier on total score
- **Influencer content boost:** Content from tracked influencers gets a 1.5x multiplier
- **Commercial penalty:** Content with ad/sponsored/promotion/sale/buy now keywords gets -20 on authenticity

---

## Cultural Tension Analysis

Identifies cultural debates, battlegrounds, and brand positioning risks. When multiple perspectives clash on a topic, that's a cultural tension — brands must navigate carefully.

### 8 Tension Categories with Signal Keywords
| Category | Battleground Name | Signal Keywords |
|----------|-------------------|----------------|
| debate | Public Debate & Controversy | debate, controversy, divided, backlash, outrage |
| values | Values & Ethics | values, ethics, morals, principles, stance |
| change | Cultural Change & Evolution | change, shift, evolution, movement, revolution |
| identity | Identity & Representation | identity, representation, diversity, inclusion |
| sustainability | Climate & Sustainability | climate, sustainability, environment, green |
| economic | Economic Inequality | inequality, cost of living, affordability, wealth gap |
| technology | Technology & Privacy | ai, privacy, automation, tech ethics |
| authenticity | Authenticity & Credibility | authentic, genuine, performative, virtue signal |

### Opposing Viewpoint Detection
Content containing BOTH sides of these pairs signals active tension:
- support / oppose
- love / hate
- embrace / reject
- progressive / traditional
- new / old
- change / preserve

### Tension Scoring (0-10)
- Each matched tension category adds +2
- Active opposition (both sides detected) adds +3
- Minimum threshold: 2 tension signals OR clear opposition to flag as tension

### Battleground Identification
A **battleground** forms when 2+ tensions cluster around the same category. Severity (1-10) is calculated from:
- Tension count (more = higher severity)
- Average tension score
- Platform diversity (same tension on 3+ platforms = broad cultural significance)

### Strategic Guidance for Battlegrounds
- **Severity 7-10:** HIGH — requires careful brand positioning, avoid unless brand has authentic stake
- **Severity 4-6:** MODERATE — opportunity exists but needs strategic framing
- **Severity 1-3:** LOW — safe to engage with awareness
- **Multi-platform battlegrounds** (3+ platforms) indicate broad cultural significance

---

## Brand Strategy & Right to Play

Generate brand context dynamically from any brand name. No hardcoded brand profiles.

### Brand Context Model
When analyzing for a brand, generate or accept these fields:
- **brand_name:** The brand being analyzed
- **category:** Auto-detect from 25-category taxonomy (see below)
- **brand_values:** Generated from category (e.g., athletic → performance, innovation, athlete empowerment)
- **pillars:** Core brand pillars (e.g., athletic → performance, community, wellness)
- **tone:** Communication style (e.g., athletic → motivational, energetic, empowering)
- **keywords:** Category-specific search terms
- **target_audience:** Who the brand serves
- **risk_tolerance:** low / moderate / high

### Category-to-Values Mapping
| Category | Values | Pillars | Tone |
|----------|--------|---------|------|
| athletic | performance, innovation, athlete empowerment | performance, community, wellness | motivational, energetic, empowering |
| tech | innovation, design, user experience | innovation, simplicity, reliability | innovative, simple, forward-thinking |
| beverage | quality, health, taste | health, taste, energy | fresh, energetic, healthy |
| automotive | performance, safety, innovation | innovation, sustainability, performance | premium, innovative, confident |
| retail | value, accessibility, customer service | value, accessibility, community | friendly, helpful, accessible |
| home_improvement | empowerment, accessibility, quality | empowerment, community, accessibility | helpful, empowering, practical |
| fashion | style, quality, self-expression | style, quality, sustainability | stylish, confident, expressive |
| beauty | confidence, quality, self-care | confidence, wellness, quality | confident, caring, inspiring |
| food | quality, taste, experience | quality, experience, community | passionate, authentic, welcoming |

### Right to Play Classification
Score brand alignment with each opportunity and classify:
| Level | Score | Meaning |
|-------|-------|---------|
| GREEN | 80-100 | Strong right to play — brand has authentic connection |
| YELLOW | 50-79 | Conditional — needs careful strategic framing |
| RED | 0-49 | Weak right to play — risk of appearing opportunistic |

### Brand Strategy YAML (Optional Enhanced Input)
Users can provide a brand strategy YAML file for deeper analysis. Key sections:
- **brand_info:** name, category, campaign_name, campaign_period (REQUIRED)
- **brand_positioning:** core_territories, brand_truths, brand_voice
- **target_audience:** primary segments with focus, motivation, pain_points
- **campaign_context:** timing_insights, cultural_moments, barriers
- **scoring_rules:** must_have_one criteria, bonus_points, automatic_reject (HIGHEST VALUE)
- **risk_profile:** tolerance level, sensitive_topics
- **reference_examples:** strong_fits and weak_fits with scores (calibrates scoring)

When a strategy YAML is provided, use its scoring_rules to override default scoring:
- **must_have_one:** Opportunity must match at least one criterion
- **bonus_points:** Each match adds +5 to score
- **automatic_reject:** Any match = SKIP tier regardless of score

---

## Three-Layer Collection Framework

Structure all social media collection using three concentric layers. This is the core collection strategy.

### Layer 1 — Direct (Brand Mentions)
- Brand name and common variants (e.g., "bunnings", "bunnings warehouse")
- Owned hashtags (e.g., #bunnings, #bunningswarehouse)
- **Purpose:** Find content directly about/mentioning the brand
- **Typical results:** 10-30 posts per platform

### Layer 2 — Category (Lifestyle/Cultural Context)
- Category keywords from the 25-category taxonomy
- AI-generated lifestyle terms relevant to the brand (10-15 keywords)
- Example for Bunnings: "DIY", "gardening", "home improvement", "BBQ", "outdoor living"
- **Purpose:** Find culturally adjacent content the brand could participate in
- **Typical results:** 20-50 posts per platform

### Layer 3 — Trending (Opportunity Discovery)
- General trending/viral content: "fyp", "viral", "trending", "foryou", "foryoupage"
- Platform-specific trending endpoints
- Reddit hot/rising posts from relevant subreddits
- **Purpose:** Discover emerging trends the brand could ride
- **Typical results:** 50 posts per platform

### Cross-Platform Convergence
When the same topic/theme appears on 2+ platforms simultaneously, it's a **convergence signal** — higher cultural significance, stronger opportunity. Always flag cross-platform convergence in reports.

### Collection Priority
1. Run all three layers across TikTok, Instagram, Twitter/X via Apify MCP
2. Supplement with Reddit (free curl) for additional cultural signal
3. Score ALL collected content using Creative Opportunity Scoring
4. Present results organized by tier (STRIKE ZONE first)

---

## 25-Category Taxonomy

Use this taxonomy to auto-detect brand category and generate relevant Layer 2 search keywords.

### Consumer & Lifestyle
| Category | Keywords |
|----------|----------|
| Food & Beverage | food trends, viral recipes, culinary trends, dining experiences, chef culture, foodie culture, beverage trends, cafe culture |
| Retail | retail trends, shopping trends, consumer behaviour, store experience, retail innovation, e-commerce trends |
| Fashion | fashion trends, style culture, streetwear, sustainable fashion, fashion influencers, beauty culture |
| Home & Lifestyle | home decor trends, interior design, lifestyle trends, home renovation, home improvement, property trends |
| Parenting & Family | parenting tips, family life, kids activities, parenting trends, family culture, child development |
| Pets & Animals | pet trends, dog lovers, cat culture, pet care, pet adoption, animal welfare, pet influencers |

### Travel & Transport
| Category | Keywords |
|----------|----------|
| Travel & Outdoors | travel trends, holiday destinations, adventure travel, tourism trends, outdoor adventures, camping trends, eco tourism |
| Automotive | car trends, automotive news, electric vehicles, car culture, driving trends, automotive technology |

### Technology & Digital
| Category | Keywords |
|----------|----------|
| Technology & Apps | tech news, app trends, ai innovation, new gadgets, startup trends, digital culture, artificial intelligence news |
| Dating & Relationships | dating trends, relationship advice, dating apps, modern dating, dating culture, couple goals |
| Gaming | gaming trends, video games, esports, gaming culture, game releases, streaming games |

### Health & Wellbeing
| Category | Keywords |
|----------|----------|
| Health & Wellbeing | health trends, wellness culture, healthy living, medical news, nutrition trends, preventive health |
| Fitness | fitness trends, workout culture, gym trends, exercise tips, athletic performance, fitness challenges |
| Mental Health | mental health awareness, mindfulness, self care, anxiety support, therapy culture, stress management |

### Purpose & Sustainability
| Category | Keywords |
|----------|----------|
| Sustainability & Environment | sustainability trends, environment news, climate action, eco friendly, green living, renewable energy, environmental activism |
| Energy & Utilities | energy trends, renewable energy, solar power, energy efficiency, green energy, energy innovation |

### Sports & Entertainment
| Category | Keywords |
|----------|----------|
| Sports | sports news, athlete culture, match highlights, major league sports, AFL trends, NRL news, cricket culture, olympics |
| Entertainment & Culture | entertainment news, pop culture trends, trending movies, viral entertainment, celebrity news, streaming releases, cultural moments |
| Arts | art trends, creative culture, visual arts, gallery exhibitions, artistic expression, design trends |
| Music | music trends, new releases, viral songs, music industry, concert culture, festival trends |

### Business & Government
| Category | Keywords |
|----------|----------|
| Government & Policy | government news, policy updates, public sector, political trends, legislation news, civic engagement |
| Business & Finance | business trends, finance news, economic trends, corporate culture, market trends, entrepreneurship |

### Social & Reactive
| Category | Keywords |
|----------|----------|
| News & Current Affairs | breaking news, current affairs, trending news, news updates, headlines, news commentary |
| Trends & Memes | viral trends, meme culture, internet trends, social media trends, viral content, TikTok trends, viral videos |

---

## Australian Cultural Intelligence

Apply Australian content weighting for relevance to Australian brands and audiences.

### Geo-Relevance Scoring (0-100)
| Signal | Points |
|--------|--------|
| Australian domain (`.au`, `abc.net.au`, `sbs.com.au`, etc.) | +40 |
| Australian location mentioned (Sydney, Melbourne, Brisbane, etc.) | +10-30 (10 per mention, max 30) |
| Australian cultural signals (aussie, mate, footy, bunnings, etc.) | +5-20 (5 per signal, max 20) |
| Creator location is Australia | +10 |

### Australian Domain List
Generic: `.au`, `.com.au`
News/Media: `abc.net.au`, `sbs.com.au`, `news.com.au`, `smh.com.au`, `theaustralian.com.au`, `afr.com`, `theage.com.au`, `heraldsun.com.au`, `dailytelegraph.com.au`, `couriermail.com.au`, `perthnow.com.au`, `9news.com.au`, `7news.com.au`
Industry: `mumbrella.com.au`, `adnews.com.au`, `bandt.com.au`
Lifestyle: `pedestrian.tv`, `junkee.com`, `mamamia.com.au`, `broadsheet.com.au`, `urbanlist.com`

### Australian Locations
States/Territories: NSW, VIC, QLD, WA, SA, TAS, NT, ACT
Cities: Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Gold Coast, Newcastle, Wollongong, Hobart, Darwin

### Australian Cultural Signals
Slang: straya, aussie, mate, arvo, servo, brekky, bottlo, thongs, esky, ute, tradie, struth, crikey, bonza, ripper
Brands: maccas, bunnings, woolies, coles, aldi australia
Culture: footy, AFL, NRL, sausage sizzle, snag, barbie, goon, centrelink, medicare, anzac

### Geo-Boost Multiplier
Content with geo-relevance score >= 50 (strongly Australian) gets a **1.35x multiplier** on its total opportunity score.

---

## Trend Analysis Framework

### Identifying Trends
1. **Volume spike:** Sudden increase in posts/mentions around a topic (>200% of baseline)
2. **Engagement anomaly:** Content about a topic getting significantly higher engagement than usual
3. **Cross-platform convergence:** Same topic trending on 2+ platforms simultaneously
4. **Creator adoption:** Mid-tier creators (10K-500K followers) starting to create content on a topic
5. **Sound/audio virality:** (TikTok/Instagram) A sound being used in rapidly increasing numbers of videos

### Trend Lifecycle Stages
1. **Emerging (Days 1-3):** Early adopters, <1000 posts, high engagement per post
2. **Growing (Days 3-7):** Mid-tier creator adoption, exponential post growth, mainstream hashtags form
3. **Peaking (Days 7-14):** Maximum visibility, brand participation, mainstream media coverage
4. **Declining (Days 14-30):** Post volume plateaus, engagement drops, audience fatigue
5. **Saturated (30+ days):** Oversaturated, low engagement, only evergreen content performs

### Content Pattern Recognition
- **Format trends:** What content format (video length, style, structure) performs best
- **Hook patterns:** Common opening hooks in top-performing content
- **Audio trends:** Trending sounds, voiceover styles, music choices
- **Visual trends:** Color palettes, editing styles, text overlay patterns
- **Narrative trends:** Storytelling structures, POV formats, challenge formats

### Influencer Tier Classification
| Tier | Followers | Characteristics |
|------|-----------|----------------|
| Nano | 1K-10K | Highest engagement rates, niche authority, authentic voice |
| Micro | 10K-100K | Strong engagement, category expertise, community trust |
| Mid-tier | 100K-500K | Trend indicator — when they adopt, it's growing |
| Macro | 500K-1M | Broad reach, mainstream validation |
| Mega | >1M | Mass awareness, lower engagement rates, celebrity status |

---

## Output Format Templates

### Culture Intelligence Report (for /culture-scan)

```
# Culture Intelligence Report: {Brand Name}
**Category:** {auto-detected category}
**Date:** {date}
**Sources:** {platforms scraped} | **Content analyzed:** {count}

---

## Executive Summary
{2-3 sentence overview of key findings, top opportunity, biggest risk}

---

## STRIKE ZONE (Score 80-100) — Act Now
| # | Content | Platform | Score | Brand Bridge | Campaign Concept |
|---|---------|----------|-------|--------------|------------------|
| 1 | {title} | {platform} | {score} | {how brand connects} | {creative idea} |

## OPPORTUNITY (Score 65-79) — Consider
| # | Content | Platform | Score | Brand Bridge | Why It Works |
|---|---------|----------|-------|--------------|--------------|

## MONITOR (Score 50-64) — Watch
| # | Content | Platform | Score | Notes |
|---|---------|----------|-------|-------|

---

## Cultural Battlegrounds
### {Battleground Name} — Severity: {X}/10
- **Tension:** {description}
- **Platforms:** {where it's active}
- **Brand position:** DO {recommendation} / DON'T {warning}

---

## Cross-Platform Convergence
{Topics appearing on 2+ platforms simultaneously — these are the strongest cultural signals}

---

## Recommended Actions
1. **Immediate (this week):** {STRIKE ZONE actions}
2. **Short-term (2-4 weeks):** {OPPORTUNITY actions}
3. **Watch list:** {MONITOR items to track}

---

## Risk Zones
{Content/topics to avoid, with reasoning}
```

### Brand Alignment Report (for /brand-analysis)

```
# Brand Alignment Report: {Brand Name}
**Category:** {category} | **Risk Tolerance:** {level}
**Values:** {brand values} | **Pillars:** {brand pillars}

---

## Right to Play Map

### GREEN — Strong Fit (Score 80-100)
| Opportunity | Score | Why It Fits | Execution Idea |
|-------------|-------|-------------|----------------|

### YELLOW — Conditional Fit (Score 50-79)
| Opportunity | Score | Risk | How to Frame It |
|-------------|-------|------|-----------------|

### RED — Weak Fit (Score 0-49)
| Opportunity | Score | Why to Avoid |
|-------------|-------|--------------|

---

## Brand Positioning Insights
- **Strongest territories:** {where brand has most right to play}
- **White space:** {opportunities competitors aren't owning}
- **Risk zones:** {topics to avoid}
```

### Battleground Report (for /cultural-tensions)

```
# Cultural Battleground Report
**Topic/Category:** {input}
**Date:** {date} | **Content analyzed:** {count}

---

## Active Battlegrounds (by severity)

### 1. {Battleground Name} — Severity: {X}/10
- **Category:** {tension category}
- **Tensions detected:** {count}
- **Platforms:** {list}
- **Key opposing views:** {side A} vs {side B}
- **Example content:** {top tension examples}

### Strategic Guidance
| DO | DON'T |
|----|-------|
| {safe actions} | {risky actions} |

---

## Tension Heatmap
| Category | Severity | Platforms | Trend |
|----------|----------|-----------|-------|
| {category} | {1-10} | {platforms} | Rising/Stable/Falling |
```

---

## Apify Actor Usage Guide

When using the Apify MCP tools, follow these patterns:

### Running an Actor
Use the MCP `apify` tools to:
1. Search for the right actor if the pre-loaded ones don't fit the use case
2. Check the actor's input schema to understand required/optional parameters
3. Run the actor with appropriate input configuration
4. Wait for the run to complete and fetch the dataset

### Common Actor Input Patterns
- **Hashtag search:** `{ "hashtags": ["fitness", "gym"], "resultsPerPage": 50 }`
- **Profile scrape:** `{ "profiles": ["https://www.tiktok.com/@username"], "resultsPerPage": 100 }`
- **Keyword search:** `{ "searchQueries": ["AI tools"], "resultsPerPage": 50 }`
- **Trending discovery:** `{ "mode": "trending", "resultsPerPage": 50 }`

### Rate Limits & Best Practices
- Start with smaller result counts (20-50) for quick analysis, increase if needed
- Cache results when doing multi-platform analysis to avoid redundant scrapes
- If an actor fails, try an alternative actor for the same platform
- Check actor pricing — some actors charge per result, others per run

### Reddit Collection (Free)
Reddit does not need Apify. Use curl directly:
```bash
curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/r/{subreddit}/hot.json?limit=50"
curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/r/{subreddit}/rising.json?limit=25"
curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/search.json?q={query}&sort=hot&limit=50"
```
Parse the JSON response: `data.children[].data` contains title, score, num_comments, upvote_ratio, url, subreddit, created_utc.

---

## HTML Dashboard Generation

All culture-wire commands output as **self-contained interactive HTML dashboards**. Save as `index.html` in a named directory (e.g., `~/bunnings-culture-scan/index.html`) and open in browser.

### Tech Stack
- **Tailwind CSS** via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- **Chart.js** via CDN: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
- No other dependencies — single file, fully portable

### Dashboard Shell Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Report Title} — Culture Wire</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        strike: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
                        opportunity: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
                        monitor: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
                        skip: { bg: '#f9fafb', border: '#d1d5db', text: '#6b7280' },
                        green: { light: '#ecfdf5', DEFAULT: '#10b981' },
                        yellow: { light: '#fffbeb', DEFAULT: '#f59e0b' },
                        red: { light: '#fef2f2', DEFAULT: '#ef4444' },
                    }
                }
            }
        }
    </script>
    <style>
        .tier-strike { background: #fef2f2; border-left: 4px solid #ef4444; }
        .tier-opportunity { background: #fffbeb; border-left: 4px solid #f59e0b; }
        .tier-monitor { background: #eff6ff; border-left: 4px solid #3b82f6; }
        .tier-skip { background: #f9fafb; border-left: 4px solid #d1d5db; }
        .rtp-green { background: #ecfdf5; border-left: 4px solid #10b981; }
        .rtp-yellow { background: #fffbeb; border-left: 4px solid #f59e0b; }
        .rtp-red { background: #fef2f2; border-left: 4px solid #ef4444; }
        .severity-high { color: #ef4444; }
        .severity-mid { color: #f59e0b; }
        .severity-low { color: #3b82f6; }
        .card { @apply bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow; }
        .badge { @apply text-xs font-semibold px-2.5 py-0.5 rounded-full; }
        .platform-tiktok { @apply bg-black text-white; }
        .platform-instagram { @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white; }
        .platform-twitter { @apply bg-blue-400 text-white; }
        .platform-reddit { @apply bg-orange-500 text-white; }
        .platform-youtube { @apply bg-red-600 text-white; }
        .tab-active { @apply border-b-2 border-red-500 text-red-600 font-semibold; }
        .tab-inactive { @apply text-gray-500 hover:text-gray-700; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900">
```

### Key Component Patterns

#### Hero Header
```html
<header class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
    <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center gap-3 mb-2">
            <span class="text-xs font-mono bg-red-500/20 text-red-300 px-2 py-1 rounded">CULTURE WIRE</span>
            <span class="text-xs text-gray-400">{date}</span>
        </div>
        <h1 class="text-4xl font-bold mb-2">{Report Title}</h1>
        <p class="text-gray-300 text-lg">{subtitle}</p>
        <div class="flex gap-6 mt-6 text-sm">
            <div><span class="text-gray-400">Brand:</span> <span class="font-semibold">{brand}</span></div>
            <div><span class="text-gray-400">Category:</span> <span class="font-semibold">{category}</span></div>
            <div><span class="text-gray-400">Content Analyzed:</span> <span class="font-semibold">{count}</span></div>
            <div><span class="text-gray-400">Platforms:</span> {platform badges}</div>
        </div>
    </div>
</header>
```

#### Stat Cards Row
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-6 max-w-7xl mx-auto px-6">
    <div class="card text-center">
        <div class="text-3xl font-bold text-red-500">{count}</div>
        <div class="text-sm text-gray-500">STRIKE ZONE</div>
    </div>
    <div class="card text-center">
        <div class="text-3xl font-bold text-amber-500">{count}</div>
        <div class="text-sm text-gray-500">OPPORTUNITIES</div>
    </div>
    <div class="card text-center">
        <div class="text-3xl font-bold text-blue-500">{count}</div>
        <div class="text-sm text-gray-500">MONITOR</div>
    </div>
    <div class="card text-center">
        <div class="text-3xl font-bold text-orange-500">{count}</div>
        <div class="text-sm text-gray-500">BATTLEGROUNDS</div>
    </div>
</div>
```

#### Opportunity Card (clickable, with tier color)
```html
<div class="tier-strike rounded-lg p-5 mb-3">
    <div class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-2">
            <span class="badge platform-tiktok">TikTok</span>
            <span class="text-xs text-gray-500">@{username}</span>
        </div>
        <div class="text-right">
            <span class="text-2xl font-bold text-red-600">{score}</span>
            <span class="text-xs text-gray-500">/100</span>
        </div>
    </div>
    <p class="text-sm font-medium mb-2">{content title/description}</p>
    <div class="flex gap-4 text-xs text-gray-500 mb-3">
        <span>Views: {views}</span>
        <span>Likes: {likes}</span>
        <span>Comments: {comments}</span>
        <span>Shares: {shares}</span>
    </div>
    <div class="bg-white/50 rounded p-3 text-sm">
        <div class="font-semibold text-gray-700 mb-1">Brand Bridge</div>
        <p class="text-gray-600">{how brand connects to this content}</p>
    </div>
    <div class="bg-white/50 rounded p-3 text-sm mt-2">
        <div class="font-semibold text-gray-700 mb-1">Campaign Concept</div>
        <p class="text-gray-600">{creative execution idea}</p>
    </div>
    <a href="{post_url}" target="_blank" class="inline-block mt-3 text-xs font-bold text-red-600 hover:text-red-800">
        View Original Post →
    </a>
</div>
```

#### Battleground Card
```html
<div class="card border-l-4" style="border-color: {severity_color}">
    <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-lg">{Battleground Name}</h3>
        <span class="text-2xl font-bold {severity_class}">{severity}/10</span>
    </div>
    <div class="flex gap-2 mb-3">
        {platform badges for each active platform}
    </div>
    <p class="text-sm text-gray-600 mb-3">{tension description}</p>
    <div class="grid grid-cols-2 gap-3">
        <div class="bg-green-50 rounded p-3">
            <div class="text-xs font-bold text-green-700 mb-1">DO</div>
            <ul class="text-xs text-green-600 space-y-1">{safe actions}</ul>
        </div>
        <div class="bg-red-50 rounded p-3">
            <div class="text-xs font-bold text-red-700 mb-1">DON'T</div>
            <ul class="text-xs text-red-600 space-y-1">{risky actions}</ul>
        </div>
    </div>
</div>
```

#### Right to Play Card (for brand-analysis)
```html
<div class="rtp-green rounded-lg p-5 mb-3">
    <div class="flex justify-between items-center mb-2">
        <span class="badge bg-green-100 text-green-800">GREEN — Right to Play</span>
        <span class="text-xl font-bold text-green-600">{score}/100</span>
    </div>
    <p class="font-medium mb-2">{opportunity title}</p>
    <p class="text-sm text-gray-600 mb-2">{why it fits}</p>
    <div class="bg-white/50 rounded p-3 text-sm">
        <div class="font-semibold mb-1">Execution Idea</div>
        <p class="text-gray-600">{how to activate}</p>
    </div>
</div>
```

#### Score Breakdown Chart
```html
<canvas id="scoreChart" class="w-full" height="300"></canvas>
<script>
new Chart(document.getElementById('scoreChart'), {
    type: 'radar',
    data: {
        labels: ['Cultural Relevance', 'Brand Alignment', 'Authenticity', 'Virality', 'Geo-Relevance', 'Safety (inv. Risk)'],
        datasets: [{
            label: 'Top Opportunity',
            data: [{cultural}, {brand}, {auth}, {viral}, {geo}, {100-risk}],
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.8)',
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        }]
    },
    options: {
        scales: { r: { beginAtZero: true, max: 100 } },
        plugins: { legend: { display: false } }
    }
});
</script>
```

#### Tier Distribution Chart
```html
<canvas id="tierChart" height="200"></canvas>
<script>
new Chart(document.getElementById('tierChart'), {
    type: 'doughnut',
    data: {
        labels: ['STRIKE ZONE', 'OPPORTUNITY', 'MONITOR', 'SKIP'],
        datasets: [{
            data: [{strike_count}, {opp_count}, {monitor_count}, {skip_count}],
            backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#d1d5db'],
        }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
});
</script>
```

#### Platform Distribution Chart
```html
<canvas id="platformChart" height="200"></canvas>
<script>
new Chart(document.getElementById('platformChart'), {
    type: 'bar',
    data: {
        labels: ['TikTok', 'Instagram', 'Twitter/X', 'Reddit'],
        datasets: [{
            label: 'Content Collected',
            data: [{tiktok_count}, {ig_count}, {twitter_count}, {reddit_count}],
            backgroundColor: ['#000000', '#E1306C', '#1DA1F2', '#FF4500'],
        }]
    }
});
</script>
```

#### Tab Navigation (for multi-section dashboards)
```html
<div class="border-b border-gray-200 mb-6">
    <nav class="flex gap-8 max-w-7xl mx-auto px-6">
        <button onclick="showTab('opportunities')" id="tab-opportunities" class="py-3 tab-active">Opportunities</button>
        <button onclick="showTab('battlegrounds')" id="tab-battlegrounds" class="py-3 tab-inactive">Battlegrounds</button>
        <button onclick="showTab('convergence')" id="tab-convergence" class="py-3 tab-inactive">Convergence</button>
        <button onclick="showTab('actions')" id="tab-actions" class="py-3 tab-inactive">Actions</button>
    </nav>
</div>
<script>
function showTab(name) {
    document.querySelectorAll('[data-tab]').forEach(el => el.classList.add('hidden'));
    document.getElementById('panel-' + name).classList.remove('hidden');
    document.querySelectorAll('[id^="tab-"]').forEach(el => {
        el.className = el.id === 'tab-' + name ? 'py-3 tab-active' : 'py-3 tab-inactive';
    });
}
</script>
```

### Number Formatting
Use K/M suffixes for readability:
```javascript
function fmt(n) {
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
    return n.toString();
}
```

### Dashboard Output Location
Save each dashboard as:
```
~/{brand}-culture-scan/index.html        (for /culture-scan)
~/{brand}-brand-analysis/index.html      (for /brand-analysis)
~/{topic}-cultural-tensions/index.html   (for /cultural-tensions)
~/{topic}-reddit-trends/index.html       (for /reddit-trends)
```

After generating, open in browser:
```bash
open ~/{name}/index.html
```

### Platform Badge Helper
```javascript
const platformBadge = (p) => ({
    'tiktok': '<span class="badge platform-tiktok">TikTok</span>',
    'instagram': '<span class="badge platform-instagram">Instagram</span>',
    'twitter': '<span class="badge platform-twitter">Twitter/X</span>',
    'reddit': '<span class="badge platform-reddit">Reddit</span>',
    'youtube': '<span class="badge platform-youtube">YouTube</span>',
}[p.toLowerCase()] || `<span class="badge bg-gray-200 text-gray-700">${p}</span>`);
```

### Platform Post URL Formats

Every post card MUST link to the real post AND show its thumbnail image. Extract URLs, IDs, and image URLs from the scraper response:

| Platform | Post URL Format | Thumbnail Image Field | Fallback Image |
|----------|----------------|----------------------|----------------|
| TikTok | `https://www.tiktok.com/@{username}/video/{video_id}` | `video.cover` or `video.dynamicCover` or `video.originCover` | None — skip image |
| Instagram | `https://www.instagram.com/p/{shortcode}/` | `displayUrl` or `thumbnailSrc` or `imageUrl` | None — skip image |
| Twitter/X | `https://twitter.com/{username}/status/{tweet_id}` | `media[0].media_url_https` or `entities.media[0].media_url_https` | None — skip image |
| Reddit | `https://www.reddit.com{permalink}` | `preview.images[0].source.url` (unescape `&amp;` → `&`) or `thumbnail` (if starts with `http`) | None — skip image |
| YouTube | `https://www.youtube.com/watch?v={video_id}` | `https://img.youtube.com/vi/{video_id}/hqdefault.jpg` | Always works from video ID |

**NEVER generate placeholder or fake IDs/URLs.** All links and images must use real values from the API/scraper response.

### Image Handling CSS

Add this to the dashboard `<style>` block:
```css
.post-thumb {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 0.5rem;
}
.post-thumb-portrait {
    width: 120px;
    min-width: 120px;
    height: 160px;
    object-fit: cover;
    border-radius: 0.5rem;
}
.img-error { display: none; }
```

Add this onerror handler to gracefully hide broken images:
```html
<img ... onerror="this.classList.add('img-error')" />
```

### Post Card Template — With Thumbnail Image

Each scraped post becomes a visual clickable card with thumbnail, content preview, engagement stats, and platform link:

```html
<a href="{REAL_POST_URL}" target="_blank" rel="noopener"
   class="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
    <!-- Thumbnail Image -->
    <img src="{thumbnail_url}" alt="{post_description_short}"
         class="post-thumb" loading="lazy"
         onerror="this.classList.add('img-error')" />
    <div class="p-4">
        <!-- Platform + Author + Score -->
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
                {platform_badge}
                <span class="text-xs text-gray-500 font-medium">@{username}</span>
            </div>
            <span class="text-lg font-bold {tier_color}">{score}<span class="text-xs text-gray-400">/100</span></span>
        </div>
        <!-- Tier Badge -->
        <div class="mb-2">
            <span class="{tier_bg} {tier_text} text-xs font-bold px-2 py-0.5 rounded">{TIER_NAME}</span>
        </div>
        <!-- Content Preview -->
        <p class="text-sm text-gray-700 mb-3 line-clamp-2">{post_description_or_title}</p>
        <!-- Engagement Stats -->
        <div class="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
            <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>{views}</span>
            <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>{likes}</span>
            <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>{comments}</span>
            <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>{shares}</span>
        </div>
        <!-- Brand Bridge (for culture-scan/brand-analysis) -->
        <div class="bg-gray-50 rounded-lg p-3 text-sm mb-2">
            <span class="font-semibold text-gray-700">Brand Bridge:</span>
            <span class="text-gray-600">{how_brand_connects}</span>
        </div>
        <!-- Click CTA -->
        <div class="text-xs font-bold text-red-500 group-hover:text-red-700 transition-colors flex items-center gap-1">
            View on {Platform}
            <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
    </div>
</a>
```

### Compact Card Variant — Side-by-Side Thumbnail (for MONITOR/SKIP tiers)

Use this horizontal layout for lower-tier items to save space:

```html
<a href="{REAL_POST_URL}" target="_blank" rel="noopener"
   class="flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group">
    <!-- Side Thumbnail -->
    <img src="{thumbnail_url}" alt="" class="post-thumb-portrait" loading="lazy"
         onerror="this.style.display='none'" />
    <div class="p-3 flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
            {platform_badge}
            <span class="text-xs text-gray-500">@{username}</span>
            <span class="ml-auto text-sm font-bold {tier_color}">{score}</span>
        </div>
        <p class="text-sm text-gray-800 font-medium mb-1 line-clamp-2">{post_description_or_title}</p>
        <div class="flex gap-3 text-xs text-gray-400">
            <span>{views} views</span>
            <span>{likes} likes</span>
            <span>{comments} comments</span>
        </div>
        <div class="text-xs font-bold text-red-500 mt-2 group-hover:text-red-700">View →</div>
    </div>
</a>
```

### Card Grid Layout

Use a responsive grid — large visual cards for STRIKE ZONE, compact rows for lower tiers:

```html
<!-- STRIKE ZONE — Large visual cards, 2-column -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {strike_zone_cards using full Post Card Template with thumbnail}
</div>

<!-- OPPORTUNITY — Medium cards, 2-column -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {opportunity_cards using full Post Card Template with thumbnail}
</div>

<!-- MONITOR — Compact horizontal cards, single column -->
<div class="space-y-3 mb-8">
    {monitor_cards using Compact Card Variant}
</div>

<!-- SKIP — Compact list, no images -->
<div class="space-y-2">
    {skip_items as simple text rows}
</div>
```

**Tier color mapping for cards:**
```javascript
const tierStyles = {
    'STRIKE ZONE': { bg: 'bg-red-100', text: 'text-red-800', border: 'tier-strike', color: 'text-red-600' },
    'OPPORTUNITY': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'tier-opportunity', color: 'text-amber-600' },
    'MONITOR':     { bg: 'bg-blue-100', text: 'text-blue-800', border: 'tier-monitor', color: 'text-blue-600' },
    'SKIP':        { bg: 'bg-gray-100', text: 'text-gray-600', border: 'tier-skip', color: 'text-gray-400' },
};
```

### Reddit Card — With Image Preview

Reddit JSON returns image previews that need `&amp;` unescaping:

```html
<a href="https://www.reddit.com{permalink}" target="_blank" rel="noopener"
   class="flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
    <!-- Reddit Preview Image (if available) -->
    <img src="{preview_image_url_unescaped}" alt="" class="post-thumb-portrait" loading="lazy"
         onerror="this.style.display='none'" />
    <div class="p-4 flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
            <span class="badge platform-reddit">Reddit</span>
            <span class="text-xs text-gray-500">r/{subreddit}</span>
            <span class="ml-auto text-lg font-bold {tier_color}">{score}</span>
        </div>
        <p class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{post_title}</p>
        <div class="flex gap-4 text-xs text-gray-500 mb-2">
            <span>Score: {score_upvotes}</span>
            <span>Comments: {num_comments}</span>
            <span class="{upvote_color}">Upvote: {upvote_ratio_pct}%</span>
        </div>
        <div class="text-xs font-bold text-orange-500 group-hover:text-orange-700">View on Reddit →</div>
    </div>
</a>
```

**Reddit image unescaping:** The `preview.images[0].source.url` field uses HTML entities. Replace `&amp;` with `&` before using as `src`:
```javascript
function unescapeRedditUrl(url) {
    return url.replace(/&amp;/g, '&');
}
```

### CRITICAL RULES
1. **All data must be real** — never use placeholder content, scores, URLs, or images
2. **All links must work** — use actual post URLs from scraped data, constructed from the URL format table above
3. **All images must be real** — use actual thumbnail URLs from scraper response; use `onerror` handler to gracefully hide broken images
4. **Scores must be calculated** — apply the actual scoring framework, don't make up numbers
5. **Every post card must be clickable** — wrapping `<a>` tag with real URL, `target="_blank"`, opens the actual post on its native platform
6. **Open after generation** — always `open ~/path/index.html` so user sees the result
7. **Mobile-responsive** — use Tailwind responsive classes (grid-cols-1 md:grid-cols-2 etc.)
8. **Show real engagement numbers** — extract views, likes, comments, shares from scraper response, format with K/M suffixes
9. **Show real post content** — use actual post description/title/text from scraper, truncated with `line-clamp`
10. **Lazy load images** — use `loading="lazy"` on all `<img>` tags for performance
11. **Visual hierarchy by tier** — STRIKE ZONE gets large image cards, OPPORTUNITY gets medium cards, MONITOR gets compact horizontal cards, SKIP gets text-only rows
