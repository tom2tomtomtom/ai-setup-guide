---
description: "Remove, replace, or swap image backgrounds with transparent, solid color, blur, or AI-generated environments. Use when preparing product cutouts for compositing, cleaning up distracting backgrounds, or swapping studio backdrops for lifestyle settings."
---

# /remove-bg

Remove or replace image backgrounds.

## What this does
Isolates the foreground subject of an image by removing its background. You can leave it transparent, replace it with a solid color, or generate an entirely new background from a text description. Great for product photography, headshots, and asset preparation.

## When to use
- Preparing product images for e-commerce or catalog placement
- Creating cutouts for compositing into other scenes
- Replacing a distracting or off-brand background with something cleaner
- Generating transparent PNGs for use in design tools
- Swapping a studio backdrop for a lifestyle or environmental setting

## How to use
Share:
- The path to the image
- What you want the background replaced with:
  - `transparent` — removes the background entirely (PNG output)
  - `white`, `black`, or any color hex (`#FF5500`) — solid color fill
  - `blur` — blurs the existing background for a depth-of-field effect
  - A text description — generates a new background from your description

## Example
```
/remove-bg ~/product.png --replace transparent
```

```
/remove-bg ~/headshot.jpg --replace "#F5F5F5"
```

```
/remove-bg ~/product.png --replace "clean white studio with soft shadow beneath the product"
```

```
/remove-bg ~/model-photo.jpg --replace "sun-drenched Italian terrace overlooking the Mediterranean"
```

## What you'll get
1. **Processed image** — Output image saved to disk with the background removed or replaced
2. **Mask quality notes** — Assessment of edge quality and any areas that may need manual touch-up
3. **Placement suggestions** — Recommendations for how to use the cutout or where the new background works best
4. **Format details** — Output format (PNG for transparency, JPG for solid backgrounds) and file specs
