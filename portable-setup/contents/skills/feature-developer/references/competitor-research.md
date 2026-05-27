# Competitor Research Methodology

## Goal

Produce insight, not just data. A list of competitor features tells you what exists. A Perceptual Map tells you where the market has gaps. A SWOT tells you which gaps are exploitable.

---

## Step 1: Classify the App

From the codebase scan, name the category:

- Project management tool
- SaaS dashboard / admin panel
- E-commerce / marketplace
- Developer tool / API product
- Booking / scheduling
- Analytics / reporting
- Content publishing
- Finance / invoicing

If unclear, read the README, landing page copy, or `<title>` tag.

---

## Step 2: Find 2-3 Direct Competitors

Search: `"best [category] tools 2025"` and `"[category] app alternatives"`.

**Direct competitors** = same problem, same audience. Don't compare a niche B2B tool to a mass-market consumer app.

Good sources:
- Product Hunt category pages
- G2 / Capterra category listings
- "X alternatives to [known tool]" articles

---

## Step 3: Extract Feature Coverage

For each competitor, scan:
- Landing page features section
- Pricing page tiers (what's gated reveals what they value)
- Help docs / changelog (recent additions = market direction)

Build two lists:

**Table stakes** — every serious player has this; missing it = deal-breaker
**Differentiators** — one or two players have this; users switch or stay because of it

---

## Step 4: Perceptual Map

Choose two axes that meaningfully divide the market for this app category. Examples:

| Category | Axis A | Axis B |
|----------|--------|--------|
| Project mgmt | Simple ↔ Powerful | Solo ↔ Team |
| Analytics | Real-time ↔ Batch | Consumer ↔ Enterprise |
| Finance | Manual ↔ Automated | Freelancer ↔ Business |

Plot each competitor on the map (text description is fine, no image needed):

```
                    POWERFUL
                       |
  Competitor B   ------+------   Competitor A
                       |
  [This App?]    ------+------
                       |
                    SIMPLE
            SOLO ------|------- TEAM
```

**The insight you're looking for:** unoccupied quadrants or positions that have strong demand but no obvious winner. That's where differentiated features live.

---

## Step 5: SWOT per Competitor

For each competitor, complete quickly:

**Strengths** — what do their positive reviews consistently praise?
**Weaknesses** — what do their negative reviews consistently complain about?
**Opportunities** — unmet needs users mention that the competitor hasn't shipped
**Threats** — what table stakes do they have that this app lacks?

The Weaknesses and Opportunities columns feed directly into Phase 2 gap analysis.

---

## Step 6: Value Proposition Synthesis

After mapping and SWOT, answer:

1. **What does every competitor do well?** (table stakes — must match)
2. **What does no competitor do well?** (unoccupied market space — opportunity)
3. **Where do users consistently express frustration?** (review-mining validates this)
4. **What's the refined value proposition for the new feature?** (1 sentence)

---

## Research Shortcuts

**When a pricing page is more useful than a features page:**
- Features behind higher tiers reveal what power users actually want
- Free tier limits reveal the core loop the product is optimised for

**When you find a good competitor implementation:**
- Note *what makes it work*, not just that it exists
- "Linear's issue search works because it filters across assignee, label, and status simultaneously without leaving keyboard context" is useful
- "Linear has search" is not useful

**When web search results are thin:**
- Check the competitor's GitHub repo stars and recent commits (activity signal)
- Check their Twitter/X product account (what they promote = what's resonating)
- Check their job postings (engineering roles signal investment areas)
