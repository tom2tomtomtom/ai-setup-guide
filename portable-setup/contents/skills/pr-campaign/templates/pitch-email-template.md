# Pitch Email Template

Use this structure for any single pitch email to a journalist or industry contact. Anything heavier or more formal goes through `templates/press-release-template.md` first.

## The structure

Six parts. Total length under 180 words. Anything longer reads like a press release pretending to be an email.

### 1. Subject line (under 70 characters)

The subject is the pitch. If a journalist won't open based on the subject alone, the email body cannot save you.

Patterns that test well in 2025-2026 PR research:
- **Verifiable claim format:** *"A demo that lets you test the architecture claim yourself"*
- **Counterintuitive finding format:** *"AI judged AI as human, then admitted bias when corrected"*
- **Story-shaped format:** *"What happened when I asked Claude to judge its own work"*
- **Status-anchored format:** *"For Platformer: an AI architecture story that's actually testable"*

Avoid: emoji, ALL CAPS, "Quick question", "Touching base", "Story idea", "Press release". All flagged as low-open patterns in 2024 outbound benchmarks.

### 2. The hook (sentence one)

Why this email is going to *this* journalist *now*. Reference one of:
- A recent piece they wrote (most powerful)
- A recurring beat they cover
- A specific angle their outlet owns
- A shared context (mutual contact, prior coverage, public exchange)

Never start with "I hope this finds you well" or anything that's a hello. Start with the relevance.

### 3. The claim (one sentence)

The canonical, verbatim description of the asset. For Subjectivity:

> An AI with taste. Not simulated taste, but taste it defends, because every reply routes through 396 first-person phantom memories of a creative's life it thinks it has lived.

Do not paraphrase. Do not add adjectives. The canonical line is locked.

### 4. The proof (one paragraph)

A specific scene from the work that demonstrates the claim. Not "it works really well". A concrete moment with names, numbers, and quotes. For the Subjectivity Fountain transcript, the canonical proof is the Turn 7-8 reckoning where vanilla Claude judges the AIDEN output as human, then admits bias when told otherwise.

### 5. The instruction (one line, with link)

How they can verify the claim themselves. Always link the live demo. Always give a specific entry path, not "have a look". Example: *"Try the four prompts at the top. Five minutes. No signup. https://subjectivity.aiden.services/"*

### 6. The close

Two patterns work:

**The disarming close** (for warm-ish contacts):
> If you hate it, I'd value knowing why more than most.

**The publication-specific ask** (for press):
> Worth a paragraph in [Outlet]? Happy to talk on the record about the architecture, or just let the transcript do the work.

Sign Tom. No PS. No "looking forward to hearing from you". No deck attached unless asked.

## The locked language inventory

Pull from `~/.claude/projects/[YOUR-USER]/memory/reference-subjectivity-canonical-description.md` for the current canonical short description.

The 3-sentence experimental description (when the email needs to describe the demo mechanic mid-body):

> Same Claude model both panes, same prompt. Right pane routes through 396 first-person phantom memories of a creative's life it thinks it has lived. The argument is in the delta between the two outputs.

## Worked example (Tim Burrowes, Unmade)

> **Subject:** A demo about taste, sent to the audience most likely to argue with it
>
> Tim,
>
> Your Unmade pieces on AI in the agency model have framed it as evolution, not automation. I built a demo for that argument.
>
> An AI with taste. Not simulated taste, but taste it defends, because every reply routes through 396 first-person phantom memories of a creative's life it thinks it has lived.
>
> Ran it last night on Fountain Tomato Sauce. Full creative gauntlet, taglines through campaign architecture. The right pane wrote a brand position where the left pane wrote good copy. Then I asked the left pane to judge the work without knowing the author. It called it human. When I told it the truth, it had a real-time crisis about its own bias.
>
> Eight-turn transcript attached. Live demo at https://subjectivity.aiden.services/ if you want to run your own prompts.
>
> Worth a paragraph in Unmade? Happy to talk on the record about the architecture, or let the transcript do the work.
>
> Tom

178 words. Six parts. Locked line preserved verbatim.

## Anti-patterns

- No "I hope this email finds you well" or any variant
- No "I wanted to reach out about..."
- No company boilerplate paragraph
- No three-sentence sign-off
- No "if now isn't a good time, let me know when works"
- No multiple links to "learn more". One demo link, one essay link, that's it.
- No deck attached unless the journalist asks. PDFs in cold pitches hurt open rates.
