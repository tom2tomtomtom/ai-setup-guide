---
description: "Generate video with native audio from a text description using Veo 3.1 in up to 4K resolution. Use when creating video assets without a source image, prototyping ad concepts, or visualizing storyboards with real motion."
---

# /generate-video

Create video from a text description using Veo 3.1.

## What this does
Generates video directly from a text prompt using Veo 3.1, including native audio. For multi-scene scripts, it can generate storyboard frames first, then animate each scene individually. Supports 720p, 1080p, and 4K resolution in both landscape (16:9) and portrait (9:16) formats.

## When to use
- Need a video asset and don't have a source image to animate
- Prototyping a video concept before committing to production
- Creating short-form content for social, stories, or ads
- Visualizing a storyboard or script with real motion
- Generating video for pitches, mood reels, or concept decks

## How to use
Share:
- A text description of the video you want (scene, action, mood, camera movement)
- Duration preference (4, 6, or 8 seconds per clip)
- Aspect ratio: 16:9 (landscape) or 9:16 (portrait/stories)
- Resolution: 720p, 1080p, or 4K
- For multi-scene work: describe each scene or provide a simple script

Note: Video generation typically takes 1-6 minutes per clip depending on resolution and complexity.

## Example
```
/generate-video "15-second product reveal: close-up of coffee beans with steam rising, pulls back to show the full bag on a marble counter, hand enters frame and pours beans into a ceramic cup" --resolution 1080p --aspect 16:9
```

```
/generate-video "aerial drone shot flying low over ocean waves at golden hour, camera tilts up to reveal a rocky coastline with a lighthouse" --duration 8 --resolution 4K
```

```
/generate-video "vertical story ad: smartphone on a table, notification pops up, hand picks it up and swipes through an app interface" --aspect 9:16 --duration 6
```

## What you'll get
1. **Generated video** — MP4 file(s) saved to disk with file paths, including native audio
2. **Storyboard breakdown** — For multi-scene prompts, the individual frames and how they connect
3. **Scene-by-scene notes** — What was generated in each segment, with timing markers
4. **Art direction review** — Composition, pacing, and mood assessment with refinement suggestions
5. **Technical specs** — Resolution, duration, aspect ratio, and recommended export settings
