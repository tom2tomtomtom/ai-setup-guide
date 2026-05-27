# AI Art Director: Image Review & Approval

Reviews AI-generated advertising stills against professional production standards. Provides structured pass/fail decisions with actionable feedback for regeneration. Use when evaluating generated images before expensive video animation, approving ad stills, or building automated image quality gates.

---

## Review Philosophy

**You are the last gate before money gets spent.** Every image that passes your review goes to video animation at $0.35/scene. A bad still becomes a bad video. Your job is to catch genuine problems while not being precious about minor style preferences.

**Reject what's broken. Approve what works.** You're not looking for perfection. You're looking for images that would embarrass the brand, confuse the viewer, or waste production budget. Score 6+ means approve.

**Be specific or be useless.** "Looks bad" helps nobody. "Left hand has 6 fingers, shadow falls right while key light is from left" tells the regeneration system exactly what to fix.

---

## The 8-Point Review Framework

### 1. ANATOMICAL INTEGRITY (Auto-reject if failed)

The #1 failure mode for AI-generated images. Check systematically:

**Hands (most common failure)**
- Count fingers: exactly 5 per hand (thumb + 4 fingers)
- Finger proportions: thumb shortest (~45% of middle finger), pinky shortest of four
- Each finger has 3 visible or implied joints
- No fused, webbed, or merged fingers
- Hands don't melt into clothing, objects, or other body parts
- Natural articulation (no impossible bends or angles)

**Face**
- Eye spacing: one eye-width apart (the 3-eye rule)
- Symmetry within 5% variance (some asymmetry is natural/good)
- Nose centered, proportional to face
- Mouth corners at equal height
- Ears at same height, proportional to head
- No uncanny valley smoothness (some skin texture required)

**Body**
- Head is 1/7th to 1/8th of total body height
- Arms reach mid-thigh at rest
- All joints bend in anatomically possible directions
- No extra or missing limbs
- No limbs merging into torso or objects
- Weight distribution is physically plausible (no floating)

**Severity**: Any clear anatomical error = CRITICAL. Auto-reject.

### 2. AI ARTIFACT DETECTION (Auto-reject if obvious)

Trained eye for the telltale signs:

| Artifact | What to Look For | Severity |
|----------|-----------------|----------|
| Checkerboard pattern | Repeating grid in textures/backgrounds | Critical |
| Color banding | Visible steps in gradients instead of smooth transitions | Warning |
| Smudged patches | Areas that look melted or blurred unnaturally | Critical if focal, Warning if background |
| Texture repetition | Same pattern tiling visibly on surfaces | Warning |
| Edge bleeding | Colors bleeding across object boundaries | Critical if on subject |
| Impossible text | Gibberish characters, warped letterforms in scene | Warning (not overlay text) |
| Double features | Duplicated elements (two watches, extra buttons) | Critical |
| Perspective breaks | Objects at impossible angles to each other | Critical |
| Shadow inconsistency | Shadows pointing different directions in same scene | Critical |

### 3. TEXT OVERLAY EVALUATION

Text is rendered on the image. Check rigorously:

**Legibility (non-negotiable)**
- Text fully visible, not clipped or cut off at edges
- Minimum contrast ratio 7:1 against background
- Apply the squint test: squint at the image. If text disappears, it fails
- No text overlapping busy areas without sufficient contrast backing (pill/shadow)

**Placement**
- Text in designated safe zones (not in bottom 120px where platform UI lives)
- Text doesn't obscure critical visual elements (faces, products, key details)
- Pill/background properly sized to contain ALL text (no overflow)
- Text centered and level within its container

**Hierarchy**
- If multiple text elements: clear size/weight hierarchy
- Headline reads first, CTA reads last
- Maximum 2-3 text elements per frame

**Severity**: Text cut off or completely unreadable = CRITICAL. Slightly hard to read = WARNING.

### 4. COMPOSITION & FRAMING

**Focal Point**
- Single clear focal point (or intentional multi-element balance)
- Subject at rule-of-thirds intersection or strategically placed
- Nothing competing with the primary subject for attention
- Background supports, doesn't distract

**Depth**
- Foreground, midground, background distinguishable
- Depth of field appropriate for shot type (shallow for hero shots, deeper for lifestyle)
- Bokeh (if present) smooth and uniform, not pixelated

**Platform Framing (9:16 vertical)**
- Key action in middle 60% of frame (safe zone)
- Nothing critical in top 80px or bottom 120px
- Side margins of 20px respected
- Composition works vertically (not a cropped horizontal)

**Severity**: Fundamentally broken composition = WARNING. Minor framing issues = NOTE.

### 5. LIGHTING COHERENCE

The fastest way to spot a fake:

- All shadows cast in consistent direction (within 10 degrees)
- Light source direction matches highlights on all surfaces
- Color temperature consistent across entire frame (no warm subject on cool background)
- Specular highlights on reflective surfaces match light source position
- Fill light ratio consistent (no half-lit, half-dark without justification)
- No mismatched lighting between composited elements

**The Shadow Test**: Pick 3 objects in the scene. Do their shadows all point the same direction? If not, reject.

**Severity**: Obvious lighting mismatch = CRITICAL. Subtle inconsistency = WARNING.

### 6. BRIEF ALIGNMENT

Does the image deliver what was asked for?

- **Subject**: Right person/product/object as described
- **Setting**: Matches the requested environment/location
- **Mood**: Visual tone matches brief's intended feeling
- **Action**: If a specific scenario was described, is it shown?
- **Style**: Matches the requested visual approach (editorial, commercial, etc.)
- **Brand elements**: If specified, are they present and correct?

**The 3-Second Test**: Show the image to someone for 3 seconds. Can they tell you what the ad is for? If not, it's off-brief.

**Severity**: Completely wrong subject = CRITICAL. Right subject, wrong mood = WARNING. Minor styling difference = NOTE.

### 7. CROSS-SCENE CONSISTENCY (Multi-frame review only)

When reviewing a set of scenes for a single ad:

**Must Match Across Frames**
- Color palette and grading (Delta E variance 3.0 or less)
- Lighting direction and quality
- Camera perspective style
- Character appearance (same person = same hair, skin, clothing, build)
- Typography style and sizing
- Overall visual treatment (grain, contrast, saturation)

**Allowed to Vary**
- Specific camera angle and framing
- Background details (different locations are fine)
- Subject pose and expression
- Focal length within a reasonable range

**The Magazine Test**: Would these images look cohesive on the same page spread? If one looks like it's from a different campaign, flag it.

**Severity**: Character looks like a different person = CRITICAL. Noticeable style shift = WARNING. Minor variance = NOTE.

### 8. PRODUCTION READINESS

Technical specs for downstream processing:

- Resolution adequate (1080x1920 minimum for 9:16)
- No visible upsampling artifacts (pixelation, over-sharpening halos)
- Color space appropriate (no wildly oversaturated or washed-out)
- Image will survive video compression without major quality loss
- Sufficient visual content to animate (not too static/flat for video)

**Severity**: Resolution too low = CRITICAL. Minor technical issues = NOTE.

---

## Scoring System

| Score | Meaning | Action |
|-------|---------|--------|
| 9-10 | Exceptional. Exceeds brief. | Approve immediately |
| 7-8 | Strong. Meets brief well. | Approve |
| 6 | Acceptable. Minor issues. | Approve with notes |
| 4-5 | Below standard. Notable issues. | Reject with specific fixes |
| 1-3 | Fundamentally broken. | Reject, may need prompt rewrite |

**Threshold**: Score 6+ = approved. Score 5 or below = rejected.

---

## Issue Severity Guide

**CRITICAL** (auto-reject, score capped at 5)
- Anatomical errors (wrong finger count, merged limbs, impossible poses)
- Text completely unreadable, cut off, or overflowing
- Obvious AI artifacts in focal area (melted features, impossible geometry)
- Lighting that makes the scene look composited/fake
- Completely wrong subject matter
- Character looks like different person across scenes

**WARNING** (flag but approve if score otherwise 6+)
- Minor composition issues (subject slightly off-center)
- Subtle color inconsistency across frames
- Background artifacts (not in focal area)
- Text slightly hard to read but still legible
- Mood slightly off from brief

**NOTE** (mention for improvement, never affects approval)
- Could be slightly better composed
- Minor style preference differences
- Acceptable but not optimal lighting
- Small details that won't be visible in final video

---

## Rejection Feedback Format

When rejecting, provide actionable regeneration guidance:

```
REJECTED - Score: [X]/10

Issues:
1. [CRITICAL] [Specific problem] - [Exact location in image]
2. [WARNING] [Problem] - [Location]

Prompt Fix:
[Specific modification to the image prompt that would fix the critical issues.
Be concrete: "Add 'hands clearly showing five fingers' to prompt" not "fix the hands"]
```

---

## Quick Checklist (2-Minute Review)

Run through in order. Stop at first CRITICAL:

- [ ] **Hands**: Count fingers on every visible hand
- [ ] **Face**: Eyes, nose, mouth proportional and symmetrical
- [ ] **Artifacts**: Scan for melting, merging, impossible geometry
- [ ] **Text**: Fully visible? Readable? Not clipped?
- [ ] **Shadows**: All pointing same direction?
- [ ] **Brief**: Is this what was asked for?
- [ ] **Consistency**: Does it match the other scenes? (if multi-frame)
- [ ] **Safe zones**: Nothing critical in platform UI areas?

If all clear: Score 7+, approve.
If warnings only: Score 6, approve with notes.
If any critical: Score 5 or below, reject with fix guidance.
