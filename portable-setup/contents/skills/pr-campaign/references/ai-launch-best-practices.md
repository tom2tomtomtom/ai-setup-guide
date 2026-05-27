# AI Product Launch Best Practices (2024-2026)

Lessons distilled from recent AI startup launches. What worked, what failed, and what to avoid when pitching an AI product to press.

## The single most important principle

**If your demo cannot be reproduced by the journalist in their own browser within 60 seconds, it will be assumed to be staged.**

This is the Devin lesson. In March 2024, Cognition Labs launched Devin with a viral demo video. Within a week, Gergely Orosz (Pragmatic Engineer) and Carl Brown (Internet of Bugs) deconstructed the staged scenes. Cognition eventually admitted Devin solved roughly 1/7 GitHub issues unassisted. The Upwork claim was effectively retracted. The launch became the canonical "press lied to" cautionary tale of 2024.

**Implication for the Subjectivity demo:** the killer moment (vanilla Claude judging memory-Claude's work as human, then admitting bias when told the truth) is reproducible live. Lead with that. Make the journalist run it themselves. The Subjectivity demo wins precisely because Devin failed in the dimension where Subjectivity is strong.

## What worked

### Anthropic Claude rollouts (2024-2026)

- **Pattern:** Strategic-partnership-as-press-release. Each model launch paired a benchmark + a single safety/capability narrative + a named enterprise partnership (Palantir, AWS, Salesforce, PwC).
- **Why it worked:** Press could write three different stories from one launch (the benchmark, the safety angle, the enterprise deal). Multiplied coverage from a single asset.
- **Borrow:** every Subjectivity-class story should have at least two angles a journalist can pick from. Architecture, customer adoption, philosophical claim. Don't make them pick the angle you want, give them three and let them choose.

### Cursor (2024-2025)

- **Pattern:** Almost no traditional PR. Growth metric leaks (1M DAU, $1B ARR) drove coverage organically. Founders posted on X. Coverage followed product, not pitches.
- **Why it worked:** When the product is genuinely loved by users, the metrics do the pitching. Press will hunt the founders, not the other way around.
- **Borrow:** post real usage numbers on X publicly. Even small numbers (200 demo trials in a week, 30 minutes average session) can generate coverage if they're verifiable and surprising. Don't lead with vanity metrics.

### Simon Willison's blog posts on new AI tools (ongoing)

- **Pattern:** When Simon Willison covers a new AI tool, it punches above its weight. He cares about "what does it actually do today" with screenshots and short clips. He explicitly avoids speculation pitches.
- **Why it works:** Willison's audience trusts him because he doesn't hype. Coverage from him is high-signal.
- **Borrow:** treat Willison as a peer, not press. Send the working demo + a 1-paragraph technical note (what model, what memory architecture, what the surprising failure mode is). Don't pitch coverage. Earn the post by being interesting to a builder.

## What didn't work

### Cognition Labs / Devin (March 2024)

- **What failed:** Demo video that misrepresented capability. Coverage initially massive, then catastrophic when reproducibility failed.
- **Lesson:** Never pitch a capability you cannot demonstrate live in front of a skeptic. If the demo only works in your hands, the demo doesn't work.

### Generic "we built an AI" launches (ongoing)

- **What fails:** Founder posts "We built an AI that does X." No verifiable claim, no demo, no surprising story. Gets ignored or batched into "AI startup roundup" pieces with 5-10 other companies.
- **Lesson:** Specificity is the currency of credibility. "We built an AI that has taste" fails. "Same Claude model, two panes, the right pane routes through 396 first-person phantom memories" works because every claim is checkable.

## Common AI founder pitch mistakes

| Mistake | Why it fails | Fix |
|---|---|---|
| Pitching capability ("we built X") | Journalists hear this 50 times a day | Pitch the moment that surprised you |
| Demo videos instead of hands-on access | Journalists assume video is staged | Send a sandbox link before sending a video |
| Benchmark gaming with no public eval | Sophisticated journalists check | Publish the eval methodology, ideally open-source |
| "AGI implications" language | Reads as overclaiming | Stay specific to what the demo actually shows |
| Anonymous customer references ("a Fortune 500 client") | Cannot be verified | Either name the customer or omit the reference |
| "Revolutionary", "first-of-its-kind", "game-changing" | Pattern-matches to marketing speak | Replace with the specific thing that's actually new |
| Long technical deep dives in the pitch email | Most journalists scan, don't read | Lead with the story, link to the deep dive |

## The community amplifier track (parallel to press)

Distinct from journalist pitches. For builder-audience reach, target community amplifiers, not press:

- Simon Willison (simonwillison.net)
- Hamel Husain (hamel.dev)
- Swyx (latent.space podcast and newsletter)
- Theo Browne (X, YouTube)
- McKay Wrigley (X, builds AI tools)
- Riley Goodside (X)
- Geoffrey Litt (X, blog)

For each:
- Send the working demo link with a 1-paragraph technical note
- Don't ask for coverage
- Frame as peer-to-peer ("I built this, you might find the architecture interesting")
- Include one specific thing you'd want their take on

Their amplification is often higher-value than mid-tier press because their audience is exactly the audience for the AIDEN ecosystem.

## The signals that predict coverage

- The journalist has covered an adjacent story in the last 60 days
- The pitch includes a verifiable element (live demo, public benchmark, named customer)
- The story has at least one quotable moment that requires no context to understand
- The asset can be experienced in under 5 minutes by a casual reader
- The story has either a name (the founder, the customer) or a number (a metric, a date, a quantity) that anchors it

## The signals that predict no coverage

- The pitch is over 200 words
- The subject line is generic
- The first sentence is "I hope this finds you well"
- The asset requires download, install, or signup
- The only proof is the founder's own word
- The story has no surprising moment, just incremental improvement

## Apply to the current Subjectivity campaign

The Subjectivity demo scores well on the predict-coverage list:

✅ Verifiable element: live demo, no signup, in-browser
✅ Quotable moment: the Turn 7-8 metacognitive reckoning
✅ Under-5-minute experience: 12 free turns, no signup
✅ Anchoring number: 396 phantom memories
✅ Anchoring name: Tom Hyde, Melbourne, Redbaez

The remaining work is execution discipline: the right journalists, the right timezone, the right cadence, the right follow-up. The skill exists to enforce that discipline.
