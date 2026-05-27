---
description: "Generate high-quality hero images from a creative brief with art-directed prompts, model selection, and composition review. Use when creating landing page visuals, campaign key art, or pitch deck imagery from scratch."
---

# /generate-hero

Generate hero imagery from a creative brief.

## What this does
Creates a high-quality hero image using Gemini Imagen based on your brief — including subject, style, mood, lighting, and dimensions. Uses art direction skills to craft an optimal prompt and selects the right model for quality vs. speed.

## When to use
- Need a hero image for a landing page, campaign, or presentation
- Want to visualize a creative concept quickly before committing to production
- Generating key visuals for a pitch or mood deck
- Creating placeholder imagery that's better than stock photos

## How to use
Share:
- The subject or scene (what should be in the image)
- Style direction (photography, illustration, 3D render, etc.)
- Mood and tone (energetic, calm, luxurious, playful, etc.)
- Aspect ratio (16:9 for web heroes, 1:1 for social, 9:16 for mobile)
- Any brand constraints (color palette, visual style, things to avoid)

## Example
```
/generate-hero

Subject: Woman trail running at sunrise through Pacific Northwest forest
Style: Editorial lifestyle photography, shallow depth of field
Mood: Energetic but peaceful, golden hour warmth
Aspect ratio: 16:9 for website hero
Brand: Outdoor fitness brand — earthy tones, avoid neon colors
```

## What you'll get
1. **Crafted image prompt** — The optimized prompt sent to Imagen, explained so you can iterate
2. **Generated hero image** — High-quality output saved to disk with file path
3. **Art direction notes** — Composition breakdown, what's working, and refinement suggestions
4. **Variation ideas** — 2-3 alternative directions if you want to explore further
5. **Technical specs** — Dimensions, aspect ratio, and recommended usage contexts

## What's next

After generating, you can:
- `/edit-image [path] [changes]` — modify what was generated (change colors, add elements, adjust lighting)
- `/remove-bg [path]` — extract the subject from its background
- `/resize-suite [path]` — generate all format sizes
- `/image-to-video [path] [motion]` — animate the hero into video
- `/composite [path] [bg-path] [instructions]` — place on a new background
