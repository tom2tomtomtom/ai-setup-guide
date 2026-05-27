---
name: file-upload-patterns
description: File upload patterns including presigned URLs, cloud storage (S3, R2, UploadThing), validation, and progress tracking. Use when implementing file uploads with S3/R2 presigned URLs, building drag-and-drop upload UIs, or handling multipart uploads for large files.
version: 1.0.0
tags: [file-upload, s3, cloudflare-r2, uploadthing, storage]
---

# File Upload Patterns

Production-ready patterns for file uploads in modern web applications.

## Client-Side Validation & Preview

### File Validation Utilities

```typescript
// lib/upload/validation.ts
export interface FileValidationOptions {
  maxSize?: number; // bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const defaultOptions: FileValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};

export function validateFile(
  file: File,
  options: FileValidationOptions = defaultOptions
): ValidationResult {
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    const maxMB = Math.round(options.maxSize / 1024 / 1024);
    return { valid: false, error: `File size exceeds ${maxMB}MB limit` };
  }

  // Check MIME type
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed: ${options.allowedTypes.join(", ")}`,
    };
  }

  // Check extension
  if (options.allowedExtensions) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !options.allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File extension .${ext} is not allowed`,
      };
    }
  }

  return { valid: true };
}

export async function validateImage(
  file: File,
  options: FileValidationOptions = {}
): Promise<ValidationResult> {
  // Basic validation first
  const basicResult = validateFile(file, options);
  if (!basicResult.valid) return basicResult;

  // Image dimension validation
  if (
    options.minWidth ||
    options.minHeight ||
    options.maxWidth ||
    options.maxHeight
  ) {
    const dimensions = await getImageDimensions(file);

    if (options.minWidth && dimensions.width < options.minWidth) {
      return {
        valid: false,
        error: `Image width must be at least ${options.minWidth}px`,
      };
    }

    if (options.minHeight && dimensions.height < options.minHeight) {
      return {
        valid: false,
        error: `Image height must be at least ${options.minHeight}px`,
      };
    }

    if (options.maxWidth && dimensions.width > options.maxWidth) {
      return {
        valid: false,
        error: `Image width must be at most ${options.maxWidth}px`,
      };
    }

    if (options.maxHeight && dimensions.height > options.maxHeight) {
      return {
        valid: false,
        error: `Image height must be at most ${options.maxHeight}px`,
      };
    }
  }

  return { valid: true };
}

function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```

### File Preview Component

```typescript
"use client";

import { useState, useCallback } from "react";
import { X, Upload, File as FileIcon, Image as ImageIcon } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const isImage = file.type.startsWith("image/");

  // Generate preview for images
  useState(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  });

  return (
    <div className="relative flex items-center gap-3 rounded-lg border p-3">
      {isImage && preview ? (
        <img
          src={preview}
          alt={file.name}
          className="h-16 w-16 rounded object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
          <FileIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{file.name}</p>
        <p className="text-sm text-gray-500">
          {formatFileSize(file.size)}
        </p>
      </div>

      <button
        onClick={onRemove}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
```

### Drag and Drop Zone

```typescript
"use client";

import { useState, useCallback, useRef } from "react";
import { Upload } from "lucide-react";

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
}

export function Dropzone({
  onFiles,
  accept,
  multiple = false,
  maxFiles = 10,
  disabled = false,
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      if (files.length > 0) {
        onFiles(files);
      }
    },
    [disabled, maxFiles, onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).slice(0, maxFiles);
      if (files.length > 0) {
        onFiles(files);
      }
      // Reset input
      e.target.value = "";
    },
    [maxFiles, onFiles]
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-lg border-2 border-dashed p-8
        transition-colors
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-gray-400"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className={`h-10 w-10 ${isDragActive ? "text-blue-500" : "text-gray-400"}`} />
        <p className="text-sm font-medium">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-xs text-gray-500">or click to browse</p>
      </div>
    </div>
  );
}
```

## Presigned URL Uploads (S3/R2)

### Server-Side Presigned URL Generation

```typescript
// app/api/upload/presign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import { z } from "zod";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// For Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const requestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string(),
  size: z.number().max(50 * 1024 * 1024), // 50MB max
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validated = requestSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid request", details: validated.error.issues },
      { status: 400 }
    );
  }

  const { filename, contentType, size } = validated.data;

  // Validate content type
  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json(
      { error: `File type ${contentType} not allowed` },
      { status: 400 }
    );
  }

  // Generate unique key
  const extension = filename.split(".").pop();
  const key = `uploads/${session.user.id}/${nanoid()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
    Metadata: {
      userId: session.user.id,
      originalName: filename,
    },
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  });

  // Public URL after upload
  const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({
    uploadUrl,
    key,
    publicUrl,
  });
}
```

### Client-Side Upload with Progress

```typescript
// lib/upload/presigned.ts
interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (url: string) => void;
  onError?: (error: Error) => void;
}

export async function uploadWithPresignedUrl(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const { onProgress, onComplete, onError } = options;

  try {
    // Get presigned URL from our API
    const response = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get upload URL");
    }

    const { uploadUrl, publicUrl } = await response.json();

    // Upload directly to S3/R2
    await uploadToStorage(file, uploadUrl, onProgress);

    onComplete?.(publicUrl);
    return publicUrl;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Upload failed");
    onError?.(err);
    throw err;
  }
}

function uploadToStorage(
  file: File,
  url: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

// Batch upload with concurrency control
export async function uploadMultiple(
  files: File[],
  options: UploadOptions & { concurrency?: number } = {}
): Promise<string[]> {
  const { concurrency = 3, ...uploadOptions } = options;
  const results: string[] = [];
  const queue = [...files];

  const workers = Array(Math.min(concurrency, files.length))
    .fill(null)
    .map(async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (file) {
          const url = await uploadWithPresignedUrl(file, uploadOptions);
          results.push(url);
        }
      }
    });

  await Promise.all(workers);
  return results;
}
```

### Upload Component with Progress

```typescript
"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "./Dropzone";
import { FilePreview } from "./FilePreview";
import { uploadWithPresignedUrl } from "@/lib/upload/presigned";
import { validateFile } from "@/lib/upload/validation";

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
  url?: string;
}

export function FileUpload({ onUpload, maxFiles = 5 }: FileUploadProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    // Validate files
    const validatedFiles = newFiles
      .map((file) => {
        const result = validateFile(file, {
          maxSize: 10 * 1024 * 1024,
          allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        });
        return { file, error: result.error };
      })
      .slice(0, maxFiles);

    setFiles(validatedFiles.map(({ file, error }) => ({
      file,
      progress: 0,
      error,
    })));

    // Upload valid files
    setIsUploading(true);
    const urls: string[] = [];

    for (let i = 0; i < validatedFiles.length; i++) {
      const { file, error } = validatedFiles[i];
      if (error) continue;

      try {
        const url = await uploadWithPresignedUrl(file, {
          onProgress: (progress) => {
            setFiles((prev) =>
              prev.map((f, idx) =>
                idx === i ? { ...f, progress: progress.percentage } : f
              )
            );
          },
        });

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, progress: 100, url } : f
          )
        );

        urls.push(url);
      } catch (err) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, error: err instanceof Error ? err.message : "Upload failed" }
              : f
          )
        );
      }
    }

    setIsUploading(false);

    if (urls.length > 0) {
      onUpload(urls);
    }
  }, [maxFiles, onUpload]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Dropzone
        onFiles={handleFiles}
        accept="image/*"
        multiple
        maxFiles={maxFiles}
        disabled={isUploading}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, index) => (
            <div key={index} className="relative">
              <FilePreview file={item.file} onRemove={() => removeFile(index)} />

              {/* Progress bar */}
              {!item.error && item.progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded">
                  <div
                    className="h-full bg-blue-500 rounded transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}

              {/* Error message */}
              {item.error && (
                <p className="mt-1 text-sm text-red-500">{item.error}</p>
              )}

              {/* Success indicator */}
              {item.url && (
                <p className="mt-1 text-sm text-green-500">✓ Uploaded</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## UploadThing Integration

### Setup

```bash
pnpm add uploadthing @uploadthing/react
```

### Server Configuration

```typescript
// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);

      // Save to database
      await db.file.create({
        data: {
          userId: metadata.userId,
          url: file.url,
          name: file.name,
          size: file.size,
        },
      });

      return { url: file.url };
    }),

  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    "application/msword": { maxFileSize: "16MB" },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user avatar
      await db.user.update({
        where: { id: metadata.userId },
        data: { avatar: file.url },
      });

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

### Client Components

```typescript
// components/UploadButton.tsx
"use client";

import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function ImageUploadButton({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onUpload(res[0].url);
        }
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
        alert("Upload failed");
      }}
      appearance={{
        button: "bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2",
        container: "w-full",
        allowedContent: "text-gray-500 text-sm",
      }}
    />
  );
}

export function ImageUploadDropzone({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  return (
    <UploadDropzone<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        const urls = res?.map((r) => r.url).filter(Boolean) || [];
        if (urls.length > 0) {
          onUpload(urls);
        }
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
      }}
      appearance={{
        container: "border-2 border-dashed rounded-lg p-8",
        uploadIcon: "text-gray-400",
        label: "text-gray-600",
        allowedContent: "text-gray-400 text-sm",
      }}
    />
  );
}
```

## Multipart Uploads for Large Files

### Server Configuration

```typescript
// app/api/upload/multipart/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET!;

// Start multipart upload
export async function POST(req: NextRequest) {
  const { filename, contentType, partCount } = await req.json();

  const key = `uploads/${Date.now()}-${filename}`;

  // Create multipart upload
  const createCommand = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const { UploadId } = await s3.send(createCommand);

  // Generate presigned URLs for each part
  const partUrls = await Promise.all(
    Array.from({ length: partCount }, async (_, i) => {
      const partNumber = i + 1;
      const command = new UploadPartCommand({
        Bucket: BUCKET,
        Key: key,
        UploadId,
        PartNumber: partNumber,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return { partNumber, url };
    })
  );

  return NextResponse.json({
    uploadId: UploadId,
    key,
    partUrls,
  });
}

// Complete multipart upload
export async function PUT(req: NextRequest) {
  const { uploadId, key, parts } = await req.json();

  const command = new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.map((part: { partNumber: number; etag: string }) => ({
        PartNumber: part.partNumber,
        ETag: part.etag,
      })),
    },
  });

  await s3.send(command);

  const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({ url: publicUrl });
}

// Abort multipart upload
export async function DELETE(req: NextRequest) {
  const { uploadId, key } = await req.json();

  const command = new AbortMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
  });

  await s3.send(command);

  return NextResponse.json({ success: true });
}
```

### Client Multipart Upload

```typescript
// lib/upload/multipart.ts
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk

interface MultipartUploadOptions {
  onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void;
  onComplete?: (url: string) => void;
  onError?: (error: Error) => void;
}

export async function uploadLargeFile(
  file: File,
  options: MultipartUploadOptions = {}
): Promise<string> {
  const { onProgress, onComplete, onError } = options;

  try {
    const partCount = Math.ceil(file.size / CHUNK_SIZE);

    // Initiate multipart upload
    const initResponse = await fetch("/api/upload/multipart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        partCount,
      }),
    });

    if (!initResponse.ok) {
      throw new Error("Failed to initiate upload");
    }

    const { uploadId, key, partUrls } = await initResponse.json();

    // Upload parts in parallel (with concurrency limit)
    const uploadedParts: { partNumber: number; etag: string }[] = [];
    let totalUploaded = 0;

    const uploadPart = async (partNumber: number, url: string) => {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const response = await fetch(url, {
        method: "PUT",
        body: chunk,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload part ${partNumber}`);
      }

      const etag = response.headers.get("ETag")?.replace(/"/g, "") || "";

      totalUploaded += chunk.size;
      onProgress?.({
        loaded: totalUploaded,
        total: file.size,
        percentage: Math.round((totalUploaded / file.size) * 100),
      });

      return { partNumber, etag };
    };

    // Upload with concurrency of 3
    const concurrency = 3;
    for (let i = 0; i < partUrls.length; i += concurrency) {
      const batch = partUrls.slice(i, i + concurrency);
      const results = await Promise.all(
        batch.map(({ partNumber, url }: { partNumber: number; url: string }) =>
          uploadPart(partNumber, url)
        )
      );
      uploadedParts.push(...results);
    }

    // Complete multipart upload
    const completeResponse = await fetch("/api/upload/multipart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        key,
        parts: uploadedParts.sort((a, b) => a.partNumber - b.partNumber),
      }),
    });

    if (!completeResponse.ok) {
      throw new Error("Failed to complete upload");
    }

    const { url } = await completeResponse.json();
    onComplete?.(url);
    return url;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Upload failed");
    onError?.(err);
    throw err;
  }
}
```

## Image Optimization on Upload

### Server-Side Processing

```typescript
// app/api/upload/image/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET!;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = nanoid();

  // Process and create multiple sizes
  const sizes = [
    { name: "thumbnail", width: 150, height: 150, fit: "cover" as const },
    { name: "medium", width: 600, height: 600, fit: "inside" as const },
    { name: "large", width: 1200, height: 1200, fit: "inside" as const },
  ];

  const results: Record<string, string> = {};

  for (const size of sizes) {
    const processed = await sharp(buffer)
      .resize(size.width, size.height, { fit: size.fit })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `images/${session.user.id}/${id}-${size.name}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: processed,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000",
      })
    );

    results[size.name] = `https://${BUCKET}.s3.amazonaws.com/${key}`;
  }

  // Also save original (optimized)
  const original = await sharp(buffer)
    .webp({ quality: 85 })
    .toBuffer();

  const originalKey = `images/${session.user.id}/${id}-original.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: originalKey,
      Body: original,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000",
    })
  );

  results.original = `https://${BUCKET}.s3.amazonaws.com/${originalKey}`;

  return NextResponse.json({ urls: results });
}
```

## Security Best Practices

```typescript
// lib/upload/security.ts
import { headers } from "next/headers";

// Validate file signature (magic bytes)
const FILE_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
};

export async function validateFileSignature(
  file: File,
  expectedType: string
): Promise<boolean> {
  const signatures = FILE_SIGNATURES[expectedType];
  if (!signatures) return true; // Unknown type, skip validation

  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return signatures.some((signature) =>
    signature.every((byte, i) => bytes[i] === byte)
  );
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace special chars
    .replace(/_{2,}/g, "_") // Replace multiple underscores
    .slice(0, 100); // Limit length
}

// Rate limiting for uploads
const uploadCounts = new Map<string, { count: number; resetAt: number }>();

export function checkUploadRateLimit(
  userId: string,
  limit = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = uploadCounts.get(userId);

  if (!record || record.resetAt < now) {
    uploadCounts.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Virus scanning integration (ClamAV example)
export async function scanFile(buffer: Buffer): Promise<boolean> {
  // In production, use a service like VirusTotal or ClamAV
  // This is a placeholder
  return true;
}
```
