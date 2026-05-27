# Review Mining

## Goal

Find the real frustrations users have with competitors — problems they've articulated, paid money despite, and wished someone would solve. These are high-value feature opportunities: validated by real users, unaddressed by the market.

---

## Where to Mine

**Primary sources:**
- G2: `site:g2.com "[competitor name]" reviews`
- Capterra: `site:capterra.com "[competitor name]" reviews`
- Trustpilot: `site:trustpilot.com "[competitor name]"`

**Secondary sources:**
- Reddit: `site:reddit.com "[competitor name]" OR "[category]" "wish" OR "missing" OR "annoying"`
- Product Hunt comments on the competitor's launch page
- App Store / Google Play reviews (for mobile-adjacent products)
- Hacker News "Ask HN: what do you use for X" threads

---

## What to Search For

Don't just read reviews — search for the negative signal:

**Search operators:**
- `"[competitor]" "wish it had"`
- `"[competitor]" "biggest complaint"`
- `"[competitor]" "frustrating" OR "annoying"`
- `"[competitor]" "switched from" OR "moved away from"`
- `"[competitor]" "missing feature"`

**On G2/Capterra specifically, look for the "What do you dislike?" section.** This is gold — users are explicitly stating what they wanted but didn't get.

---

## Signal vs. Noise

Not all complaints are actionable. Filter by:

**High value:**
- Recurring complaint (mentioned by 3+ independent reviewers = real pattern)
- Workflow-blocking ("I can't do X at all")
- Users say they switched products because of it
- Complaint is specific ("there's no way to bulk-assign issues") not vague ("UX is bad")

**Low value:**
- One-off complaints
- Performance issues (may be infrastructure, not features)
- Price complaints
- Requests that would require a complete product rewrite

---

## Output Format

Return a structured list:

```
Unmet Need: [specific thing users want]
Evidence: "[quote or paraphrase from review]" — [source]
Frequency: [how many reviewers mentioned it]
Gap type: [missing feature / clunky workflow / missing integration]
```

Example:

```
Unmet Need: Bulk status updates on tasks
Evidence: "The biggest pain is having to update each task individually when
a sprint closes. Asana lets you bulk-update but [Competitor] doesn't." — G2 review
Frequency: 4 separate reviewers
Gap type: Missing feature
```

---

## Turning Insights into Proposals

The best Phase 3 proposals combine:

1. A codebase gap (something easy to build given the existing stack)
2. Validated by user review evidence (users actually want this)
3. Unaddressed by competitors (differentiator, not just catch-up)

When all three align, you have a high-confidence proposal. Lead with the review evidence in the pitch — "4 reviewers on G2 said they left [Competitor] specifically because of this" is more persuasive than any feature argument.

---

## When Review Mining Is Limited

If the competitors are too niche or new to have many reviews:

- Check their GitHub Issues for feature requests (public repos often have "feature request" labels)
- Check their Discord / Slack community if public (support channels surface real pain)
- Check Twitter/X for `@[competitor] [problem keyword]` — users often complain publicly
- Fall back to Perceptual Map + SWOT from competitor-research.md as primary signal
