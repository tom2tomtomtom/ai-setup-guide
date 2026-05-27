---
description: "Animate a still image into video with AI-generated motion, camera movement, and native audio via Veo 3.1. Use when turning hero images into social content, adding motion to product shots, or bringing mood boards to life for presentations."
---

# /image-to-video

Animate a still image into video with AI-generated motion.

## What this does
Takes a static image and brings it to life using Veo 3.1 video generation. You describe the motion you want — camera movement, element animation, atmospheric changes — and it generates a video with native audio. Supports portrait (9:16) and landscape (16:9) output.

## When to use
- Want to turn a hero image or key visual into an animated asset
- Creating social content from existing photography or illustrations
- Adding subtle motion to campaign imagery for digital placements
- Generating video ads from static product shots
- Bringing mood boards or concept art to life for client presentations

## How to use
Share:
- The path to the source image
- A description of the motion and animation you want
- Duration: 4, 6, or 8 seconds (default: 4)
- Aspect ratio if different from the source image

Note: Video generation typically takes 1-6 minutes depending on duration and complexity.

## Example
```
/image-to-video ~/hero.png "slow cinematic zoom, clouds drift across the sky, light shifts from cool to warm" --duration 8
```

```
/image-to-video ~/product-shot.png "gentle 360-degree rotation, studio lighting sweeps across the surface" --duration 6
```

```
/image-to-video ~/landscape.jpg "parallax depth effect, foreground flowers sway gently, birds cross the sky in the distance" --duration 4
```

## What you'll get
1. **Generated video** — MP4 file saved to disk with file path, including native audio
2. **Motion breakdown** — Description of what's moving and how the animation was interpreted
3. **Art direction notes** — How the motion supports or shifts the mood of the original image
4. **Loop assessment** — Whether the video loops cleanly, with suggestions for seamless looping if needed
5. **Platform recommendations** — Best placements for the video (stories, feed, web banner, etc.)
