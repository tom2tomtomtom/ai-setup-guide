---
name: image-optimization
description: Image optimization patterns with Next.js Image, Sharp, and modern formats. Use when implementing responsive images with Next.js Image, processing uploads with Sharp on the server, or converting images to WebP/AVIF.
---

# Image Optimization Patterns

Comprehensive patterns for optimizing images in web applications using Next.js Image, Sharp, and modern formats.

## When to Use This Skill

Use this skill when:
- Optimizing images for web performance
- Implementing responsive images
- Converting to modern formats (WebP, AVIF)
- Lazy loading images
- Handling user-uploaded images
- Building image galleries

## Next.js Image Component

### Basic Usage

```tsx
import Image from 'next/image';

// Local image (automatically optimized)
import heroImage from '@/public/hero.jpg';

export function Hero() {
  return (
    <Image
      src={heroImage}
      alt="Hero image"
      priority // Load immediately (above fold)
      placeholder="blur" // Built-in blur placeholder
    />
  );
}

// Remote image
export function Avatar({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="User avatar"
      width={48}
      height={48}
      className="rounded-full"
    />
  );
}
```

### Responsive Images

```tsx
// Fill container
<div className="relative h-64 w-full">
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>

// Responsive with sizes
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-auto"
/>
```

### Remote Image Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Output formats
    formats: ['image/avif', 'image/webp'],
    // Device sizes for srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
```

### Blur Placeholder for Remote Images

```tsx
// Generate blur data URL
import { getPlaiceholder } from 'plaiceholder';

async function getImageWithBlur(src: string) {
  const buffer = await fetch(src).then((res) => res.arrayBuffer());
  const { base64 } = await getPlaiceholder(Buffer.from(buffer));
  return base64;
}

// Usage in component
export async function ProductImage({ src }: { src: string }) {
  const blurDataURL = await getImageWithBlur(src);

  return (
    <Image
      src={src}
      alt="Product"
      width={400}
      height={400}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
}
```

## Sharp (Server-Side Processing)

### Installation

```bash
npm install sharp
```

### Basic Operations

```typescript
import sharp from 'sharp';

// Resize
await sharp('input.jpg')
  .resize(800, 600)
  .toFile('output.jpg');

// Resize with options
await sharp('input.jpg')
  .resize({
    width: 800,
    height: 600,
    fit: 'cover',      // cover, contain, fill, inside, outside
    position: 'center', // or 'top', 'bottom', 'left', 'right', 'attention'
  })
  .toFile('output.jpg');

// Convert format
await sharp('input.jpg')
  .webp({ quality: 80 })
  .toFile('output.webp');

await sharp('input.jpg')
  .avif({ quality: 65 })
  .toFile('output.avif');

// Multiple outputs
const image = sharp('input.jpg');

await Promise.all([
  image.clone().resize(800).webp().toFile('large.webp'),
  image.clone().resize(400).webp().toFile('medium.webp'),
  image.clone().resize(200).webp().toFile('small.webp'),
]);
```

### Image Processing Pipeline

```typescript
import sharp from 'sharp';

interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
}

export async function processImage(
  input: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
  } = {}
): Promise<ProcessedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 80,
    format = 'webp',
  } = options;

  let pipeline = sharp(input)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .rotate(); // Auto-rotate based on EXIF

  // Apply format
  switch (format) {
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    default:
      pipeline = pipeline.webp({ quality });
  }

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    format: info.format,
    width: info.width,
    height: info.height,
  };
}
```

### Generate Thumbnails

```typescript
import sharp from 'sharp';

const SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1280, height: 960 },
};

export async function generateThumbnails(input: Buffer) {
  const image = sharp(input);
  const results: Record<string, Buffer> = {};

  await Promise.all(
    Object.entries(SIZES).map(async ([name, size]) => {
      results[name] = await image
        .clone()
        .resize({
          width: size.width,
          height: size.height,
          fit: 'cover',
        })
        .webp({ quality: 80 })
        .toBuffer();
    })
  );

  return results;
}
```

## Upload & Storage Pattern

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate image
  const metadata = await sharp(buffer).metadata();
  if (!metadata.format || !['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
    return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
  }

  // Process image
  const processed = await sharp(buffer)
    .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // Generate thumbnail
  const thumbnail = await sharp(buffer)
    .resize({ width: 300, height: 300, fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  // Upload to S3
  const id = crypto.randomUUID();
  const mainKey = `images/${id}.webp`;
  const thumbKey = `images/${id}-thumb.webp`;

  await Promise.all([
    s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: mainKey,
      Body: processed,
      ContentType: 'image/webp',
    })),
    s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: thumbKey,
      Body: thumbnail,
      ContentType: 'image/webp',
    })),
  ]);

  return NextResponse.json({
    url: `${process.env.CDN_URL}/${mainKey}`,
    thumbnail: `${process.env.CDN_URL}/${thumbKey}`,
  });
}
```

## Cloudinary Integration

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(buffer: Buffer, folder: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}

// URL transformations
export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  crop?: string;
}) {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });
}
```

## Image Gallery Component

```tsx
// components/ImageGallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelectedIndex(null)}
          >
            ×
          </button>
          <Image
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            width={images[selectedIndex].width}
            height={images[selectedIndex].height}
            className="max-h-[90vh] w-auto"
            priority
          />
        </div>
      )}
    </>
  );
}
```

## Lazy Loading Pattern

```tsx
// Native lazy loading (for simple cases)
<img
  src="/image.jpg"
  alt="Description"
  loading="lazy"
  decoding="async"
/>

// Intersection Observer (for custom behavior)
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function LazyImage({ src, alt, ...props }: ImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Image src={src} alt={alt} {...props} />
      ) : (
        <div className="bg-gray-200 animate-pulse" style={{ aspectRatio: props.width / props.height }} />
      )}
    </div>
  );
}
```

## Best Practices

1. **Use modern formats** - WebP/AVIF for 25-50% smaller files
2. **Implement responsive images** - Serve appropriate sizes
3. **Lazy load below fold** - Use loading="lazy" or Next.js
4. **Set explicit dimensions** - Prevent layout shift
5. **Use CDN** - Serve from edge locations
6. **Compress appropriately** - 80-85% quality for photos

## Image Size Guidelines

| Use Case | Max Width | Quality |
|----------|-----------|---------|
| Hero/Banner | 1920px | 85% |
| Product | 800px | 85% |
| Thumbnail | 300px | 80% |
| Avatar | 128px | 80% |
| Icon | 64px | 90% |

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Sharp Documentation](https://sharp.pixelplumbing.com)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
