---
description: "Layer and blend 2-4 images into a single composition with AI-matched lighting, perspective, and style. Use when placing product cutouts on backgrounds, combining elements from separate sources, or building campaign visuals from individual components."
---

# /composite

Layer and combine multiple images into a single composition.

## What this does
Takes 2-4 images and composites them together based on your instructions. Uses AI-powered image blending to match lighting, perspective, and style across layers. Great for placing products on backgrounds, combining elements from different sources, creating collages, or building scenes from separate assets.

## When to use
- Placing a product cutout onto a lifestyle or studio background
- Combining elements from multiple images into one cohesive scene
- Creating collages or mood boards from separate visual assets
- Blending different styles or textures into a unified composition
- Building campaign visuals from separately generated components

## How to use
Share:
- Paths to 2-4 images you want to combine
- Instructions for how they should be composited (placement, scale, blending)
- Any notes on lighting, perspective, or style matching
- Which image should be the base layer vs. foreground elements

## Example
```
/composite ~/product-cutout.png ~/bg.jpg "place the product naturally on the table, matching lighting and perspective"
```

```
/composite ~/model.png ~/gradient-bg.png ~/logo.png "center the model on the gradient background, place the logo in the bottom-right corner at 15% scale with slight transparency"
```

```
/composite ~/landscape.jpg ~/product.png ~/text-overlay.png "product floating in the center of the scene with a soft drop shadow, text overlay positioned in the upper third"
```

## What you'll get
1. **Composited image** — Final combined image saved to disk with file path
2. **Layer breakdown** — How each source image was placed, scaled, and blended
3. **Lighting and style notes** — Assessment of how well the elements match and any visible seams
4. **Refinement suggestions** — Adjustments to improve realism, balance, or visual hierarchy
5. **Export recommendations** — Optimal format and resolution for your intended use case
