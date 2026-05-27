---
description: "Modify an existing image with natural language edits like color shifts, element swaps, lighting changes, and style adjustments. Use when tweaking a generated image, iterating on a concept, or adjusting mood without starting over."
---

# /edit-image

Modify an existing image with natural language instructions.

## What this does
Takes an image and a text description of your desired changes, then applies the edits using AI-powered image manipulation. An art director reviews the result and suggests further refinements if needed. Supports changing colors, adding or removing elements, style shifts, lighting changes, and more.

## When to use
- Need to tweak a generated or existing image without starting over
- Want to change specific elements — swap a background, adjust lighting, shift colors
- Iterating on a concept by making incremental refinements
- Adjusting mood or tone of an image to better match a brief
- Removing unwanted elements or adding missing details

## How to use
Share:
- The path to the image you want to edit
- A natural language description of the changes you want
- Any constraints (preserve specific elements, maintain brand colors, etc.)

## Example
```
/edit-image ~/hero.png "change the sky to a dramatic sunset with orange and purple"
```

```
/edit-image ~/campaign/product-shot.png "make the lighting warmer and more golden, add soft bokeh to the background"
```

```
/edit-image ~/headphones.png "remove the coffee cup from the table, keep the rest of the scene intact"
```

## What you'll get
1. **Edited image** — Modified version saved to disk with file path
2. **Change summary** — What was modified and how it differs from the original
3. **Art direction review** — Assessment of how the edit affects overall composition and mood
4. **Refinement suggestions** — Follow-up edits that could push the image further
5. **Side-by-side comparison** — Notes on before vs. after to help you evaluate the change
