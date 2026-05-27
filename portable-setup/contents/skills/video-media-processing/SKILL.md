---
name: video-media-processing
description: Video/audio processing with fluent-ffmpeg, Remotion server-side rendering, beat detection with Meyda, and worker queue patterns. Use when trimming/concatenating video, mixing audio into video, or building server-side media processing pipelines.
---

# Video & Media Processing Patterns

Production patterns for server-side video processing using fluent-ffmpeg, Remotion renderer, Meyda beat detection, and Express-based worker queues. Based on the AIDEN EasyPeasyEase worker architecture.

## When to Use This Skill

Use this skill when:
- Trimming, concatenating, or retiming video clips
- Converting image sequences to video
- Rendering compositions with Remotion server-side
- Mixing audio tracks into video (volume, fades, looping, delays)
- Detecting beats/BPM from audio files
- Syncing visual transitions to audio beats
- Building background worker services for media jobs
- Managing memory and temp files during video processing

## Core Dependencies

```json
{
  "@remotion/bundler": "^4.0.396",
  "@remotion/renderer": "^4.0.396",
  "@remotion/media-utils": "^4.0.396",
  "remotion": "^4.0.396",
  "fluent-ffmpeg": "^2.1.3",
  "meyda": "^5.6.3",
  "express": "^4.21.2",
  "zod": "^3.24.0"
}
```

## FFmpeg Patterns (fluent-ffmpeg)

### CRF Encoding Constants

Always define encoding constants centrally. CRF 18-23 is visually lossless for most content. Clamp user-provided values to a safe range.

```typescript
const OUTPUT_FPS = 30;

const VIDEO_CRF = (() => {
  const parsed = Number(process.env.VIDEO_CRF ?? 20);
  if (!Number.isFinite(parsed)) return 20;
  return Math.min(30, Math.max(10, parsed));
})();

const VIDEO_PRESET = process.env.VIDEO_PRESET || "fast";
const AUDIO_SAMPLE_RATE = 48000;
const AUDIO_CHANNEL_LAYOUT = "stereo";
const AUDIO_BITRATE = "192k";
```

### Video Trimming

Trim a video to specific in/out points. Always use `-pix_fmt yuv420p` for browser compatibility.

```typescript
import ffmpeg from "fluent-ffmpeg";

interface TrimPoints {
  inPoint: number;   // Start time in seconds
  outPoint: number;  // End time in seconds
}

async function trimVideo(
  inputPath: string,
  outputPath: string,
  trim: TrimPoints
): Promise<{ duration: number }> {
  const duration = trim.outPoint - trim.inPoint;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(trim.inPoint)
      .setDuration(duration)
      .outputOptions([
        "-c:v", "libx264",
        "-preset", VIDEO_PRESET,
        "-crf", String(VIDEO_CRF),
        "-pix_fmt", "yuv420p",
        "-an",  // Strip audio when not needed
      ])
      .output(outputPath)
      .on("end", () => resolve({ duration }))
      .on("error", (err, stdout, stderr) => {
        console.error(`[trim] FFmpeg error:`, err.message);
        console.error(`[trim] stderr:`, stderr);
        reject(err);
      })
      .run();
  });
}
```

### Video Concatenation (Lossless)

Use the concat demuxer with `-c copy` for frame-perfect, lossless joining. This is always preferred over Remotion for MP4 segment stitching -- it prevents black flashes at segment boundaries.

```typescript
async function concatenateVideos(
  inputPaths: string[],
  outputPath: string
): Promise<void> {
  const tempDir = path.dirname(outputPath);
  const listPath = path.join(tempDir, `concat-list-${Date.now()}.txt`);

  // Create concat list file
  const listContent = inputPaths.map((p) => `file '${p}'`).join("\n");
  fs.writeFileSync(listPath, listContent);

  try {
    const args = [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-c", "copy",          // Bitstream copy -- no re-encoding
      "-movflags", "+faststart",
      outputPath,
    ];

    await runFfmpeg(args, "ffmpeg concat");
  } finally {
    try { fs.unlinkSync(listPath); } catch {}
  }
}
```

**CRITICAL**: Always use FFmpeg concat for MP4 video joining. Remotion's `<Sequence>` compositor introduces timing drift and black flashes at segment boundaries. Reserve Remotion for GIF output or complex compositing.

### Video Metadata (ffprobe)

```typescript
async function getVideoMetadata(
  videoPath: string
): Promise<{ duration: number; fps: number; frameCount: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) { reject(err); return; }

      const videoStream = metadata.streams.find(
        (s) => s.codec_type === "video"
      );
      if (!videoStream) {
        reject(new Error("No video stream found"));
        return;
      }

      const duration = Number(metadata.format.duration) || 0;
      let fps = 30;

      if (videoStream.r_frame_rate) {
        const [num, den] = videoStream.r_frame_rate.split("/").map(Number);
        fps = num / (den || 1);
      }

      const frameCount = Math.ceil(duration * fps);
      resolve({ duration, fps, frameCount });
    });
  });
}
```

### Speed Retiming with setpts Filter

Retime video segments using piecewise linear speed segments derived from a bezier easing curve. This is 5-10x faster than frame extraction because it runs in a single FFmpeg pass with no intermediate I/O.

```typescript
interface SpeedSegment {
  sourceStart: number;   // Source video start time (seconds)
  sourceEnd: number;     // Source video end time (seconds)
  outputStart: number;   // Output video start time (seconds)
  outputEnd: number;     // Output video end time (seconds)
  speed: number;         // speed > 1 = fast, < 1 = slow-mo
}

async function createRetimedVideoWithSetpts(
  inputPath: string,
  outputPath: string,
  sourceDuration: number,
  outputDuration: number,
  speedSegments: SpeedSegment[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Build filter_complex: trim each source range, adjust speed, concat
    const filterParts: string[] = [];
    const segmentLabels: string[] = [];

    for (let i = 0; i < speedSegments.length; i++) {
      const seg = speedSegments[i];
      const label = `seg${i}`;
      segmentLabels.push(`[${label}]`);

      // setpts=(PTS-STARTPTS)/speed: dividing by speed > 1 makes it faster
      filterParts.push(
        `[0:v]trim=start=${seg.sourceStart.toFixed(4)}:end=${seg.sourceEnd.toFixed(4)},` +
        `setpts=(PTS-STARTPTS)/${seg.speed.toFixed(4)}[${label}]`
      );
    }

    // Concat all segments
    const concatInput = segmentLabels.join("");
    filterParts.push(
      `${concatInput}concat=n=${speedSegments.length}:v=1:a=0[outv]`
    );

    const filterComplex = filterParts.join("; ");

    ffmpeg(inputPath)
      .outputOptions([
        "-filter_complex", filterComplex,
        "-map", "[outv]",
        "-c:v", "libx264",
        "-preset", VIDEO_PRESET,
        "-crf", String(VIDEO_CRF),
        "-pix_fmt", "yuv420p",
        "-r", String(OUTPUT_FPS),
        "-an",
      ])
      .output(outputPath)
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`Encoding: ${progress.percent.toFixed(1)}%`);
        }
      })
      .on("end", () => resolve())
      .on("error", (err, stdout, stderr) => {
        console.error(`setpts error:`, err.message);
        console.error(`stderr:`, stderr);
        reject(err);
      })
      .run();
  });
}
```

### Image to Video Clip

Convert a static image to a video clip of specified duration. Include a silent audio track so the clip is concat-compatible with audio-bearing segments.

```typescript
async function imageToVideoClip(
  imagePath: string,
  outputPath: string,
  durationSeconds: number,
  fps: number,
  width: number,
  height: number
): Promise<void> {
  const durationInFrames = Math.max(1, Math.round(durationSeconds * fps));
  const alignedDuration = durationInFrames / fps;

  const args = [
    "-y",
    "-loop", "1",
    "-i", imagePath,
    "-f", "lavfi",
    "-i", `anullsrc=channel_layout=stereo:sample_rate=48000`,
    "-t", alignedDuration.toFixed(6),
    "-frames:v", String(durationInFrames),
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "libx264",
    "-preset", VIDEO_PRESET,
    "-crf", String(VIDEO_CRF),
    "-pix_fmt", "yuv420p",
    "-vf", `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1`,
    "-r", String(fps),
    "-c:a", "aac",
    "-b:a", "192k",
    "-ac", "2",
    "-ar", "48000",
    "-movflags", "+faststart",
    outputPath,
  ];

  await runFfmpeg(args, "ffmpeg image-to-video");
}
```

### Frame Alignment for Concat

When preparing clips for concat, always align durations to exact frame boundaries. Misaligned durations cause audio drift.

```typescript
// Round duration to exact frame boundary
const durationInFrames = Math.max(1, Math.round(durationSeconds * fps));
const alignedDurationSeconds = durationInFrames / fps;
```

## Audio Processing

### Multi-Track Audio Mixing

Mix multiple audio tracks into a video with per-track volume, fades, looping, and start offset.

```typescript
interface AudioTrack {
  id: string;
  audioUrl: string;
  audioPath: string;
  duration: number;
  volume: number;          // 0-1
  fadeInDuration: number;
  fadeOutDuration: number;
  startOffset: number;     // Delay before audio starts (seconds)
  loop: boolean;
}

async function mixAudioTracks(
  videoPath: string,
  outputPath: string,
  audioTracks: AudioTrack[],
  videoDuration: number,
  workDir: string
): Promise<void> {
  if (audioTracks.length === 0) {
    fs.copyFileSync(videoPath, outputPath);
    return;
  }

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg(videoPath);
    const filterParts: string[] = [];
    const audioLabels: string[] = [];

    // Download and add each audio input
    audioTracks.forEach((track, i) => {
      const audioFilePath = path.join(workDir, `audio_${i}.mp3`);
      // (download audio to audioFilePath here)
      cmd.input(audioFilePath);

      const inputIndex = i + 1;  // Video is [0], audio starts at [1]
      let currentLabel = `[${inputIndex}:a]`;
      let nextLabel = `[a${i}]`;
      const filters: string[] = [];

      // Volume
      if (track.volume !== 1.0) {
        filters.push(`volume=${track.volume.toFixed(2)}`);
      }
      // Fade in
      if (track.fadeInDuration > 0) {
        filters.push(`afade=t=in:d=${track.fadeInDuration.toFixed(2)}`);
      }
      // Fade out
      if (track.fadeOutDuration > 0) {
        const effectiveDuration = track.loop ? videoDuration : track.duration;
        const fadeOutStart = Math.max(0, effectiveDuration - track.fadeOutDuration - track.startOffset);
        filters.push(`afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${track.fadeOutDuration.toFixed(2)}`);
      }

      if (filters.length > 0) {
        filterParts.push(`${currentLabel}${filters.join(",")}${nextLabel}`);
        currentLabel = nextLabel;
        nextLabel = `[a${i}f]`;
      }

      // Loop if needed
      if (track.loop && track.duration < videoDuration) {
        const loopCount = Math.ceil(videoDuration / track.duration);
        filterParts.push(
          `${currentLabel}aloop=loop=${loopCount - 1}:size=${Math.floor(track.duration * 44100)}${nextLabel}`
        );
        currentLabel = nextLabel;
        nextLabel = `[a${i}l]`;
      }

      // Delay
      if (track.startOffset > 0) {
        const delayMs = Math.round(track.startOffset * 1000);
        filterParts.push(`${currentLabel}adelay=${delayMs}|${delayMs}${nextLabel}`);
        currentLabel = nextLabel;
        nextLabel = `[a${i}d]`;
      }

      // Trim to video duration
      filterParts.push(`${currentLabel}atrim=0:${videoDuration.toFixed(2)}[a${i}final]`);
      audioLabels.push(`[a${i}final]`);
    });

    // Mix all tracks together
    if (audioLabels.length > 1) {
      filterParts.push(
        `${audioLabels.join("")}amix=inputs=${audioLabels.length}:duration=first:dropout_transition=2[aout]`
      );
    } else {
      filterParts.push(`${audioLabels[0]}acopy[aout]`);
    }

    cmd
      .outputOptions([
        "-filter_complex", filterParts.join("; "),
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",      // Copy video stream (fast)
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err, stdout, stderr) => reject(err))
      .run();
  });
}
```

### Adding Background Audio to Video with Existing Audio

When a video already has audio (e.g., dialogue), use `amix` to blend background music underneath.

```typescript
async function addAudioWithMix(
  videoPath: string,
  backgroundAudioPath: string,
  outputPath: string,
  videoDuration: number,
  volume: number = 1.0,
  fadeIn: number = 0,
  fadeOut: number = 0
): Promise<void> {
  const bgFilters: string[] = [`volume=${volume}`];
  if (fadeIn > 0) bgFilters.push(`afade=t=in:st=0:d=${fadeIn}`);
  if (fadeOut > 0) {
    const fadeOutStart = Math.max(0, videoDuration - fadeOut);
    bgFilters.push(`afade=t=out:st=${fadeOutStart}:d=${fadeOut}`);
  }

  const args = [
    "-y",
    "-i", videoPath,
    "-i", backgroundAudioPath,
    "-filter_complex",
    `[1:a]${bgFilters.join(",")}[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=0[aout]`,
    "-map", "0:v",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    outputPath,
  ];

  await runFfmpeg(args, "ffmpeg add-audio-with-mix");
}
```

### Audio Extraction to PCM (for Analysis)

Decode any audio file to raw PCM float32 samples using FFmpeg. Required for Meyda analysis.

```typescript
async function decodeToPCM(audioPath: string): Promise<Float32Array> {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const execAsync = promisify(exec);

  const rawPath = audioPath.replace(/\.[^.]+$/, ".raw");

  await execAsync(
    `ffmpeg -y -i "${audioPath}" -f f32le -acodec pcm_f32le -ac 1 -ar 44100 "${rawPath}"`
  );

  const rawData = fs.readFileSync(rawPath);
  const samples = new Float32Array(
    rawData.buffer,
    rawData.byteOffset,
    Math.floor(rawData.byteLength / Float32Array.BYTES_PER_ELEMENT)
  );

  fs.unlinkSync(rawPath);  // Cleanup
  return samples;
}
```

### Mixing Dialogue Audio at Specific Timestamps

Position multiple dialogue audio tracks at specific timeline positions using `adelay`.

```typescript
async function mixDialogueAudio(
  inputPath: string,
  dialogueTracks: Array<{ path: string; startTime: number }>,
  outputPath: string,
  hasVideoAudio: boolean = true
): Promise<void> {
  const inputs = ["-y", "-i", inputPath];
  const filterParts: string[] = [];
  const mixInputs: string[] = [];

  if (hasVideoAudio) mixInputs.push("[0:a]");

  for (let i = 0; i < dialogueTracks.length; i++) {
    const track = dialogueTracks[i];
    inputs.push("-i", track.path);
    const delayMs = Math.round(track.startTime * 1000);
    filterParts.push(`[${i + 1}:a]adelay=${delayMs}|${delayMs}[d${i}]`);
    mixInputs.push(`[d${i}]`);
  }

  filterParts.push(
    `${mixInputs.join("")}amix=inputs=${mixInputs.length}:duration=first:dropout_transition=0[aout]`
  );

  const args = [
    ...inputs,
    "-filter_complex", filterParts.join(";"),
    "-map", "0:v",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    outputPath,
  ];

  await runFfmpeg(args, "ffmpeg mix-dialogue-audio");
}
```

## FFmpeg Process Wrapper

Use `child_process.spawn` instead of fluent-ffmpeg when you need direct control over argument order. Cap stderr buffer to prevent memory bloat.

```typescript
import { spawn } from "child_process";

function runFfmpeg(args: string[], label: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 20000) {
        stderr = stderr.slice(-20000);  // Cap at 20KB
      }
    });

    child.on("error", (error) => reject(error));

    child.on("close", (code) => {
      if (code === 0) { resolve(); return; }
      reject(new Error(`${label} failed (exit ${code ?? "unknown"}): ${stderr}`));
    });
  });
}
```

## Remotion Server-Side Rendering

### When to Use Remotion vs FFmpeg

| Use Case | Use Remotion | Use FFmpeg |
|----------|-------------|------------|
| MP4 video joining | No | Yes (`-c copy` concat) |
| GIF generation | Yes (palette optimization) | No |
| Complex React compositions | Yes | No |
| Text overlay compositing | Possible but slow | Yes (ASS subtitles, faster) |
| Image sequence to video | No | Yes (`imageToVideoClip`) |
| Speed retiming | No | Yes (`setpts` filter) |

### Bundle and Render

```typescript
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, RenderMediaOnProgress } from "@remotion/renderer";

const MEDIA_CACHE_SIZE_BYTES = (() => {
  const parsed = Number(process.env.REMOTION_MEDIA_CACHE_SIZE_BYTES ?? 0);
  if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed);
  return 2 * 1024 * 1024 * 1024;  // Default 2GB to prevent compositor crashes
})();

const OFFTHREAD_VIDEO_CACHE_SIZE_BYTES = (() => {
  const parsed = Number(process.env.REMOTION_OFFTHREAD_VIDEO_CACHE_SIZE_BYTES ?? 0);
  if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed);
  return 2 * 1024 * 1024 * 1024;  // Default 2GB
})();

async function renderVideo(compositionProps: Record<string, unknown>): Promise<string> {
  // Bundle the Remotion project
  const entryPoint = path.join(__dirname, "..", "src", "remotion", "index.tsx");
  if (!fs.existsSync(entryPoint)) {
    throw new Error(`Entry point not found: ${entryPoint}`);
  }

  const bundleLocation = await bundle({ entryPoint });

  // Select composition by ID
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "BannerAd",
    inputProps: compositionProps,
  });

  // Render
  const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp4`);

  const onProgress: RenderMediaOnProgress = ({ progress }) => {
    console.log(`Render progress: ${(progress * 100).toFixed(1)}%`);
  };

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    audioCodec: "aac",
    outputLocation: tempOutputPath,
    inputProps: compositionProps,
    onProgress,
    mediaCacheSizeInBytes: MEDIA_CACHE_SIZE_BYTES,
    offthreadVideoCacheSizeInBytes: OFFTHREAD_VIDEO_CACHE_SIZE_BYTES,
    port: 8888,               // Avoid conflicts with default 3000
    timeoutInMilliseconds: 120000,  // 2 min timeout for media loading
  });

  return tempOutputPath;
}
```

### GIF Rendering with Palette Optimization

Remotion renders to MP4 first, then FFmpeg converts to GIF using a two-pass palette approach for quality.

```typescript
async function renderGif(
  bundleLocation: string,
  composition: Awaited<ReturnType<typeof selectComposition>>,
  compositionProps: Record<string, unknown>,
  width: number
): Promise<string> {
  const tempDir = os.tmpdir();
  const tempMp4Path = path.join(tempDir, `temp-${Date.now()}.mp4`);
  const palettePath = path.join(tempDir, `palette-${Date.now()}.png`);
  const outputPath = path.join(tempDir, `output-${Date.now()}.gif`);

  // Step 1: Render to MP4
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    audioCodec: "aac",
    outputLocation: tempMp4Path,
    inputProps: compositionProps,
    mediaCacheSizeInBytes: MEDIA_CACHE_SIZE_BYTES,
    offthreadVideoCacheSizeInBytes: OFFTHREAD_VIDEO_CACHE_SIZE_BYTES,
    port: 8888,
    timeoutInMilliseconds: 120000,
  });

  // Step 2: Generate palette for GIF quality
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const execAsync = promisify(exec);

  await execAsync(
    `ffmpeg -y -i "${tempMp4Path}" -vf "fps=15,scale=${width}:-1:flags=lanczos,palettegen" "${palettePath}"`
  );

  // Step 3: Convert using palette
  await execAsync(
    `ffmpeg -y -i "${tempMp4Path}" -i "${palettePath}" -lavfi "fps=15,scale=${width}:-1:flags=lanczos [x]; [x][1:v] paletteuse" "${outputPath}"`
  );

  // Cleanup intermediates
  try { fs.unlinkSync(tempMp4Path); } catch {}
  try { fs.unlinkSync(palettePath); } catch {}

  return outputPath;
}
```

### Render Asset Server

Chromium (used by Remotion) loads images/videos via HTTP, not `file://`. Serve temp files through an Express endpoint during renders.

```typescript
import { randomUUID } from "crypto";

type RenderAsset = {
  assetId: string;
  jobId: string;
  filePath: string;
  contentType: string;
  createdAtMs: number;
};

const assetsById = new Map<string, RenderAsset>();
const assetIdsByJobId = new Map<string, Set<string>>();
const DEFAULT_TTL_MS = 30 * 60 * 1000;  // 30 minutes

function getRenderAssetsBaseUrl(): string {
  const envBaseUrl = process.env.RENDER_ASSETS_BASE_URL;
  if (envBaseUrl) return envBaseUrl.replace(/\/+$/, "");
  const port = process.env.PORT || "8080";
  return `http://127.0.0.1:${port}`;
}

export function registerRenderAsset(options: {
  jobId: string;
  filePath: string;
  contentType: string;
  ttlMs?: number;
}): { assetId: string; url: string } {
  const assetId = randomUUID();
  const asset: RenderAsset = {
    assetId,
    jobId: options.jobId,
    filePath: options.filePath,
    contentType: options.contentType,
    createdAtMs: Date.now(),
  };

  assetsById.set(assetId, asset);

  const jobAssets = assetIdsByJobId.get(options.jobId) ?? new Set<string>();
  jobAssets.add(assetId);
  assetIdsByJobId.set(options.jobId, jobAssets);

  // Auto-cleanup timer (unref so it doesn't keep Node alive)
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const timer = setTimeout(() => {
    assetsById.delete(assetId);
  }, ttlMs);
  timer.unref?.();

  const url = `${getRenderAssetsBaseUrl()}/__render-assets/${assetId}`;
  return { assetId, url };
}

// Express route (must NOT require auth -- Chromium loads without custom headers)
app.get("/__render-assets/:assetId", (req, res) => {
  const asset = assetsById.get(req.params.assetId);
  if (!asset || !fs.existsSync(asset.filePath)) {
    res.status(404).send("Not found");
    return;
  }

  res.setHeader("Content-Type", asset.contentType);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Accept-Ranges", "bytes");

  // Support range requests (Remotion needs this for video seeking)
  const fileSize = fs.statSync(asset.filePath).size;
  const rangeHeader = req.headers.range;

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    if (!match) {
      res.status(416).setHeader("Content-Range", `bytes */${fileSize}`).end();
      return;
    }
    let start = match[1] ? parseInt(match[1]) : 0;
    let end = match[2] ? parseInt(match[2]) : fileSize - 1;

    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    res.setHeader("Content-Length", String(end - start + 1));
    fs.createReadStream(asset.filePath, { start, end }).pipe(res);
  } else {
    res.setHeader("Content-Length", String(fileSize));
    fs.createReadStream(asset.filePath).pipe(res);
  }
});

// Cleanup all assets for a job after render completes
export function unregisterJobRenderAssets(jobId: string): void {
  const jobAssets = assetIdsByJobId.get(jobId);
  if (!jobAssets) return;
  for (const assetId of jobAssets) assetsById.delete(assetId);
  assetIdsByJobId.delete(jobId);
}
```

## Beat Detection with Meyda

### Audio Analysis Pipeline

Detect BPM, kicks (30-150Hz), onsets (spectral flux), and downbeats from audio files.

```typescript
import Meyda from "meyda";

const SAMPLE_RATE = 44100;
const FFT_SIZE = 2048;
const HOP_SIZE = 512;
const BIN_RESOLUTION = SAMPLE_RATE / FFT_SIZE;  // ~21.5 Hz per bin

// Frequency band for kick detection (30-150Hz)
const KICK_LOW_BIN = Math.floor(30 / BIN_RESOLUTION);   // bin 1
const KICK_HIGH_BIN = Math.ceil(150 / BIN_RESOLUTION);   // bin 7

interface BeatMarker {
  time: number;
  frame?: number;
  intensity: number;        // 0-1 confidence
  type: "downbeat" | "kick" | "onset" | "beat" | "accent";
  quantized?: boolean;
}

interface AudioAnalysis {
  bpm: number;
  beats: BeatMarker[];      // All markers merged and sorted
  kicks: BeatMarker[];      // Low-frequency peaks only
  onsets: BeatMarker[];     // Spectral flux peaks
  duration: number;
  downbeatPhase: number;    // Offset to first beat 1
}
```

### Feature Extraction

```typescript
function extractFeatures(samples: Float32Array) {
  const kickEnergy: number[] = [];
  const spectralFlux: number[] = [];
  const rms: number[] = [];
  let prevSpectrum: number[] | null = null;

  Meyda.bufferSize = FFT_SIZE;
  Meyda.sampleRate = SAMPLE_RATE;

  for (let i = 0; i < samples.length - FFT_SIZE; i += HOP_SIZE) {
    const window = samples.slice(i, i + FFT_SIZE);
    const features = Meyda.extract(["amplitudeSpectrum", "rms"], window);

    if (!features || !features.amplitudeSpectrum) {
      kickEnergy.push(0);
      spectralFlux.push(0);
      rms.push(0);
      continue;
    }

    const spectrum = features.amplitudeSpectrum as Float32Array | number[];

    // Kick energy: sum of squared magnitudes in 30-150Hz range
    let energy = 0;
    for (let bin = KICK_LOW_BIN; bin <= KICK_HIGH_BIN && bin < spectrum.length; bin++) {
      energy += spectrum[bin] * spectrum[bin];
    }
    kickEnergy.push(energy);

    // Spectral flux: sum of positive differences from previous frame
    if (prevSpectrum) {
      let flux = 0;
      for (let j = 0; j < Math.min(prevSpectrum.length, spectrum.length); j++) {
        const diff = spectrum[j] - prevSpectrum[j];
        if (diff > 0) flux += diff;
      }
      spectralFlux.push(flux);
    } else {
      spectralFlux.push(0);
    }

    rms.push((features.rms as number) || 0);
    prevSpectrum = Array.from(spectrum);
  }

  return { kickEnergy, spectralFlux, rms, frameCount: kickEnergy.length };
}
```

### Adaptive Peak Detection

Uses LOCAL statistics for threshold (not global) to handle quiet intros and dynamic range.

```typescript
function detectPeaks(
  signal: number[],
  sensitivity: number,
  minSpacingFrames: number
): { frame: number; strength: number }[] {
  const peaks: { frame: number; strength: number }[] = [];
  const avgWindowSize = Math.floor(SAMPLE_RATE / HOP_SIZE);  // ~86 frames (~1 second)
  const halfWindow = Math.floor(avgWindowSize / 2);

  // Global stats for strength normalization only
  const globalMean = signal.reduce((a, b) => a + b, 0) / signal.length;
  const globalStdDev = Math.sqrt(
    signal.reduce((a, b) => a + (b - globalMean) ** 2, 0) / signal.length
  );

  for (let i = 1; i < signal.length - 1; i++) {
    const windowStart = Math.max(0, i - halfWindow);
    const windowEnd = Math.min(signal.length - 1, i + halfWindow);
    const windowSize = windowEnd - windowStart + 1;

    // LOCAL mean and stdDev for adaptive threshold
    let localMean = 0;
    for (let j = windowStart; j <= windowEnd; j++) localMean += signal[j];
    localMean /= windowSize;

    let localVariance = 0;
    for (let j = windowStart; j <= windowEnd; j++) localVariance += (signal[j] - localMean) ** 2;
    const localStdDev = Math.sqrt(localVariance / windowSize);

    const effectiveStdDev = localStdDev > globalStdDev * 0.1 ? localStdDev : globalStdDev * 0.5;
    const threshold = localMean + effectiveStdDev * sensitivity;

    // Peak: above threshold AND local maximum
    if (signal[i] > threshold && signal[i] > signal[i - 1] && signal[i] > signal[i + 1]) {
      if (peaks.length === 0 || i - peaks[peaks.length - 1].frame >= minSpacingFrames) {
        const strength = Math.min(1, Math.max(0, (signal[i] - globalMean) / (3 * globalStdDev)));
        peaks.push({ frame: i, strength });
      }
    }
  }

  return peaks;
}
```

### BPM Detection via Autocorrelation

```typescript
function detectBPM(onsetFunction: number[]): number {
  const frameRate = SAMPLE_RATE / HOP_SIZE;          // ~86 frames/second
  const minLag = Math.floor((60 / 200) * frameRate); // 200 BPM
  const maxLag = Math.floor((60 / 60) * frameRate);  // 60 BPM

  if (onsetFunction.length < maxLag * 2) return 120; // Fallback

  const acf = new Float32Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < onsetFunction.length - lag; i++) {
      sum += onsetFunction[i] * onsetFunction[i + lag];
    }
    acf[lag] = sum;
  }

  // Find peak with preference for shorter periods (avoids half-tempo)
  let maxVal = 0, bestLag = minLag;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const adjustedVal = acf[lag] * (1 - (lag - minLag) / (maxLag - minLag) * 0.1);
    if (adjustedVal > maxVal) {
      maxVal = adjustedVal;
      bestLag = lag;
    }
  }

  let bpm = 60 / (bestLag / frameRate);
  while (bpm < 60) bpm *= 2;
  while (bpm > 200) bpm /= 2;
  return Math.round(bpm);
}
```

### BPM Grid Quantization

Snap detected events to the nearest position on a BPM grid. Subdivision controls resolution (4 = quarter notes, 8 = eighth, 16 = sixteenth).

```typescript
function quantizeToGrid(
  events: BeatMarker[],
  bpm: number,
  downbeatPhase: number,
  subdivision: number = 16
): BeatMarker[] {
  const beatDuration = 60 / bpm;
  const gridInterval = beatDuration / (subdivision / 4);
  const tolerance = gridInterval / 2;

  return events.map((event) => {
    const relativeTime = event.time - downbeatPhase;
    const gridIndex = Math.round(relativeTime / gridInterval);
    const quantizedTime = downbeatPhase + gridIndex * gridInterval;

    if (Math.abs(event.time - quantizedTime) <= tolerance) {
      return { ...event, time: quantizedTime, quantized: true };
    }
    return { ...event, quantized: false };
  });
}
```

### Syncing Visual Transitions to Beats

Adjust segment durations so transitions land on beat markers (kicks, onsets, or downbeats).

```typescript
function syncSegmentsToBeats(
  segmentCount: number,
  analysis: AudioAnalysis,
  options: {
    alignTo?: "kicks" | "onsets" | "downbeats";
    intensityThreshold?: number;
    minDuration?: number;
  } = {}
): number[] {
  const { alignTo = "kicks", intensityThreshold = 0.5, minDuration = 0.5 } = options;

  let alignmentPoints: BeatMarker[];
  switch (alignTo) {
    case "downbeats":
      alignmentPoints = analysis.kicks.filter((k) => k.type === "downbeat");
      break;
    case "onsets":
      alignmentPoints = analysis.onsets;
      break;
    default:
      alignmentPoints = analysis.kicks;
  }

  const strongEvents = alignmentPoints.filter((e) => e.intensity >= intensityThreshold);

  if (strongEvents.length === 0 || segmentCount === 0) {
    return Array(segmentCount).fill(analysis.duration / segmentCount);
  }

  // Select events evenly distributed across the timeline
  const selectedEvents: number[] = [0];
  const step = Math.floor(strongEvents.length / segmentCount);

  for (let i = 1; i < segmentCount; i++) {
    const eventIdx = Math.min(i * step, strongEvents.length - 1);
    selectedEvents.push(strongEvents[eventIdx].time);
  }
  selectedEvents.push(analysis.duration);

  const durations: number[] = [];
  for (let i = 0; i < segmentCount; i++) {
    durations.push(Math.max(selectedEvents[i + 1] - selectedEvents[i], minDuration));
  }

  return durations;
}
```

## Bezier Easing for Speed Curves

Map normalized output time to normalized source time using a cubic bezier, then convert to piecewise speed segments for FFmpeg.

```typescript
interface EasingCurve {
  p1x: number;  p1y: number;
  p2x: number;  p2y: number;
}

function evaluateBezier(time: number, curve: EasingCurve): number {
  if (time <= 0) return 0;
  if (time >= 1) return 1;

  // Newton-Raphson to solve for t given x, then evaluate y
  const t = solveBezierT(time, curve.p1x, curve.p2x);
  return cubicBezier(t, curve.p1y, curve.p2y);
}

function bezierToSpeedSegments(
  sourceDuration: number,
  outputDuration: number,
  curve: EasingCurve,
  numSegments: number = 60  // More segments = smoother approximation
): SpeedSegment[] {
  const segments: SpeedSegment[] = [];

  for (let i = 0; i < numSegments; i++) {
    const outStartNorm = i / numSegments;
    const outEndNorm = (i + 1) / numSegments;

    const srcStartNorm = evaluateBezier(outStartNorm, curve);
    const srcEndNorm = evaluateBezier(outEndNorm, curve);

    const sourceStart = srcStartNorm * sourceDuration;
    const sourceEnd = srcEndNorm * sourceDuration;
    const outputStart = outStartNorm * outputDuration;
    const outputEnd = outEndNorm * outputDuration;

    // speed = source chunk duration / output chunk duration
    const speed = (sourceEnd - sourceStart) / (outputEnd - outputStart);

    segments.push({ sourceStart, sourceEnd, outputStart, outputEnd, speed });
  }

  return segments;
}
```

## Worker / Queue Patterns

### Express Worker Server

Accept jobs via POST, respond immediately, process in background. Always include global error handlers to prevent crashes.

```typescript
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 8080;
const WORKER_SECRET = process.env.WORKER_SECRET;

// Prevent crashes from killing the process
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

app.use(express.json({ limit: "50mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "media-worker" });
});

// Job endpoint: validate, respond immediately, process async
app.post("/api/process", async (req: Request, res: Response) => {
  // Auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${WORKER_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { jobId, segments, callbackUrl } = req.body;
  if (!jobId || !segments || !callbackUrl) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Respond immediately
  res.json({ status: "accepted", jobId });

  // Process in background with .catch() to prevent unhandled rejections
  try {
    processJobAsync(jobId, segments, callbackUrl).catch((err) => {
      console.error(`[${jobId}] FATAL: Async processing crashed:`, err);
    });
  } catch (syncError) {
    console.error(`[${jobId}] FATAL: Sync error launching job:`, syncError);
  }
});

app.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT}`);
});
```

### Callback Pattern

Report progress and results back to the API server via HTTP callbacks. Always persist to database as a backstop.

```typescript
interface CallbackPayload {
  jobId: string;
  status: "processing" | "completed" | "failed";
  progress?: number;
  outputVideoUrl?: string;
  outputVideoPath?: string;
  error?: string;
}

async function sendCallback(url: string, payload: CallbackPayload): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WORKER_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Callback failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Callback network error:", error);
  } finally {
    // Always persist to DB as backstop (e.g., callback URL unreachable)
    try {
      await persistJobUpdate(payload);
    } catch (persistError) {
      console.error("Failed to persist job update:", persistError);
    }
  }
}
```

### Progress Throttling

Throttle progress callbacks to reduce DB writes during renders.

```typescript
const lastPersistedProgressByJob = new Map<string, number>();

async function persistJobUpdate(payload: CallbackPayload): Promise<void> {
  const { jobId, status, progress } = payload;
  if (!jobId) return;

  // Only persist if progress changed by at least 5%
  if (status === "processing" && typeof progress === "number") {
    const last = lastPersistedProgressByJob.get(jobId);
    if (last !== undefined && progress < 95 && progress - last < 5) {
      return;
    }
    lastPersistedProgressByJob.set(jobId, progress);
  }

  await supabase.from("jobs").update({
    status,
    progress,
    updated_at: new Date().toISOString(),
  }).eq("id", jobId);
}
```

## Memory Management

### Temp File Cleanup Pattern

Track all temp files in a Set, always cleanup in `finally`.

```typescript
async function processJob(request: JobRequest): Promise<void> {
  const tempFilesToCleanup = new Set<string>();

  try {
    // Register every temp file
    const tempPath = path.join(os.tmpdir(), `clip-${Date.now()}.mp4`);
    tempFilesToCleanup.add(tempPath);

    // ... processing ...
  } finally {
    // Always cleanup, even on error
    for (const filePath of tempFilesToCleanup) {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error(`Cleanup failed for ${filePath}:`, cleanupError);
      }
    }
  }
}
```

### Work Directory Pattern

Create a temp directory per job, `rmSync` the whole thing in `finally`.

```typescript
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "media-job-"));

try {
  // All temp files go into workDir
  const inputPath = path.join(workDir, "input.mp4");
  const outputPath = path.join(workDir, "output.mp4");
  // ... processing ...
} finally {
  try {
    fs.rmSync(workDir, { recursive: true, force: true });
  } catch (e) {
    console.error("Failed to cleanup work directory:", e);
  }
}
```

### Sequential Segment Processing with GC Hints

Process segments one at a time and hint for garbage collection between each to avoid OOM.

```typescript
for (let i = 0; i < segments.length; i++) {
  // Log memory before each segment
  const memUsage = process.memoryUsage();
  console.log(
    `Memory: RSS=${Math.round(memUsage.rss / 1024 / 1024)}MB, ` +
    `Heap=${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
  );

  const processed = await processSegment(segments[i], workDir, i);

  // Delete intermediate files immediately after use
  try { fs.unlinkSync(segments[i].inputPath); } catch {}

  // Hint GC (requires --expose-gc flag)
  if (global.gc) global.gc();
}
```

### Remotion Cache Size Configuration

Always set explicit cache sizes for Remotion to prevent compositor crashes. Unset cache sizes default to unlimited, which causes OOM on constrained workers.

```typescript
// Set these env vars or defaults in code:
// REMOTION_MEDIA_CACHE_SIZE_BYTES=2147483648      (2GB)
// REMOTION_OFFTHREAD_VIDEO_CACHE_SIZE_BYTES=2147483648  (2GB)

await renderMedia({
  // ...
  mediaCacheSizeInBytes: 2 * 1024 * 1024 * 1024,
  offthreadVideoCacheSizeInBytes: 2 * 1024 * 1024 * 1024,
});
```

## Error Handling Patterns

### FFmpeg Error Capture

Always capture both stdout and stderr from FFmpeg errors. The error message alone is often insufficient -- stderr contains the actual diagnostic output.

```typescript
ffmpeg(inputPath)
  .output(outputPath)
  .on("error", (err, stdout, stderr) => {
    console.error(`FFmpeg error:`, err.message);
    console.error(`stderr:`, stderr);  // This is where the real info is
    reject(err);
  })
  .run();
```

### Job-Level Error Isolation

Wrap each job in try/catch, always send failure callbacks, and always persist failure state.

```typescript
async function processJobAsync(jobId: string, ...args: unknown[]): Promise<void> {
  try {
    await sendCallback(callbackUrl, { jobId, status: "processing", progress: 0 });
    const result = await processJob(/* ... */);
    await sendCallback(callbackUrl, { jobId, status: "completed", progress: 100, outputVideoUrl: result.url });
  } catch (error) {
    console.error(`Job ${jobId} FAILED:`, error);
    if (error instanceof Error) console.error(`Stack:`, error.stack);

    try {
      await sendCallback(callbackUrl, {
        jobId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (callbackError) {
      console.error(`Failed to send failure callback:`, callbackError);
    }
  }
}
```

### Async Launch Safety

When launching async background work after responding to HTTP, wrap in both try/catch and `.catch()`.

```typescript
// Respond immediately
res.json({ status: "accepted", jobId });

// Launch async -- BOTH try/catch AND .catch()
try {
  processJobAsync(jobId, segments, callbackUrl).catch((err) => {
    console.error(`FATAL: Async processing crashed:`, err);
  });
} catch (syncError) {
  console.error(`FATAL: Sync error launching job:`, syncError);
}
```

## Multi-Pass Video Processing Pipeline

For complex output (e.g., video with subtitles, dialogue, and background music), use a multi-pass approach.

```
Pass 1: Prepare individual clips (trim/retime/image-to-video)
Pass 2: Concatenate all clips (FFmpeg concat, -c copy)
Pass 3: Burn ASS subtitles (if dialogue overlay present)
Pass 4: Mix dialogue audio tracks (adelay positioning)
Pass 5: Add background music (amix with existing audio)
Pass 6: Upload final output
```

Each pass operates on the previous pass's output. Track the "current video path" and swap it forward.

```typescript
let currentVideoPath = concatOutputPath;

if (hasDialogueOverlay) {
  const subtitledPath = path.join(tempDir, `subtitled-${jobId}.mp4`);
  await burnSubtitles(currentVideoPath, assPath, subtitledPath);
  currentVideoPath = subtitledPath;
}

if (dialogueAudioTracks.length > 0) {
  const mixedPath = path.join(tempDir, `mixed-${jobId}.mp4`);
  await mixDialogueAudio(currentVideoPath, dialogueAudioTracks, mixedPath, true);
  currentVideoPath = mixedPath;
}

if (backgroundAudioTrack) {
  await addAudioWithMix(currentVideoPath, bgAudioPath, finalOutputPath, totalDuration, volume, fadeIn, fadeOut);
} else {
  fs.copyFileSync(currentVideoPath, finalOutputPath);
}
```

## Environment Variables

```bash
# FFmpeg encoding
EASYPEASYEASE_VIDEO_CRF=20          # Quality: 10 (best) - 30 (worst)
EASYPEASYEASE_VIDEO_PRESET=fast     # Speed: ultrafast, fast, medium, slow

# Remotion memory limits (bytes)
REMOTION_MEDIA_CACHE_SIZE_BYTES=2147483648
REMOTION_OFFTHREAD_VIDEO_CACHE_SIZE_BYTES=2147483648

# Worker config
PORT=8080
WORKER_SECRET=your-secret-here
RENDER_ASSETS_BASE_URL=http://127.0.0.1:8080

# Storage
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## Key Architecture Decisions

1. **FFmpeg concat over Remotion for MP4**: Remotion's React compositor introduces timing drift at segment boundaries. FFmpeg concat with `-c copy` does bitstream-level joining with zero re-encoding.

2. **setpts filter over frame extraction**: Piecewise speed manipulation via `filter_complex` is 5-10x faster than extracting frames to disk and reassembling.

3. **Silent audio tracks on all clips**: Every clip gets a silent audio stream (`anullsrc`) so they can be concatenated without stream mismatch errors.

4. **Remotion only for GIF**: GIF palette generation requires Remotion's rendering pipeline. MP4 always uses the FFmpeg path.

5. **Local adaptive thresholds for beat detection**: Global thresholds miss beats in quiet intros. Using per-window local statistics ensures beats are detected consistently across dynamic range changes.

6. **Background processing with immediate response**: HTTP endpoints respond immediately with `{ status: "accepted" }` and process asynchronously, reporting progress via callbacks.

7. **Database persistence as backstop**: Every callback also writes directly to the database, so job state is never lost if the callback URL is unreachable.
