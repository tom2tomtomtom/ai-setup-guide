---
name: background-jobs
description: Wire up background job processing with BullMQ, Inngest, and Trigger.dev. Use when processing tasks asynchronously, scheduling recurring jobs, or building event-driven webhook handlers.
---

# Background Jobs Patterns

Comprehensive patterns for background job processing using BullMQ, Inngest, Trigger.dev, and other job queue systems.

## When to Use This Skill

Use this skill when:
- Processing tasks asynchronously
- Building job queues
- Scheduling recurring tasks
- Handling long-running operations
- Processing webhooks reliably
- Building event-driven systems

## BullMQ (Redis-based)

### Installation

```bash
npm install bullmq ioredis
```

### Basic Setup

```typescript
// lib/queue.ts
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

// Create queue
export const emailQueue = new Queue('emails', { connection });
export const reportQueue = new Queue('reports', { connection });

// Add job
export async function queueEmail(data: { to: string; subject: string; body: string }) {
  return emailQueue.add('send-email', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}
```

### Worker

```typescript
// workers/email.worker.ts
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

const worker = new Worker<EmailJobData>(
  'emails',
  async (job: Job<EmailJobData>) => {
    console.log(`Processing job ${job.id}`);

    const { to, subject, body } = job.data;

    // Update progress
    await job.updateProgress(50);

    // Send email
    await sendEmail(to, subject, body);

    await job.updateProgress(100);

    return { sent: true, to };
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

worker.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed:`, error);
});

worker.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});
```

### Scheduled Jobs

```typescript
// Delayed job
await emailQueue.add('reminder', data, {
  delay: 1000 * 60 * 60 * 24, // 24 hours
});

// Recurring job (cron)
await emailQueue.add(
  'daily-report',
  {},
  {
    repeat: {
      pattern: '0 9 * * *', // Every day at 9am
    },
  }
);

// Remove repeatable job
await emailQueue.removeRepeatable('daily-report', {
  pattern: '0 9 * * *',
});
```

### Job Priorities

```typescript
// High priority (lower number = higher priority)
await queue.add('urgent', data, { priority: 1 });

// Normal priority
await queue.add('normal', data, { priority: 5 });

// Low priority
await queue.add('batch', data, { priority: 10 });
```

## Inngest (Serverless)

### Installation

```bash
npm install inngest
```

### Setup

```typescript
// lib/inngest.ts
import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'my-app' });
```

### Define Functions

```typescript
// inngest/functions.ts
import { inngest } from '@/lib/inngest';

// Simple function
export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email' },
  { event: 'user/created' },
  async ({ event, step }) => {
    const { email, name } = event.data;

    await step.run('send-email', async () => {
      await sendEmail(email, 'Welcome!', `Hello ${name}`);
    });

    return { sent: true };
  }
);

// Multi-step function
export const onboardUser = inngest.createFunction(
  { id: 'onboard-user' },
  { event: 'user/signed-up' },
  async ({ event, step }) => {
    // Step 1: Create profile
    const profile = await step.run('create-profile', async () => {
      return await createUserProfile(event.data.userId);
    });

    // Step 2: Send welcome email
    await step.run('send-welcome', async () => {
      await sendWelcomeEmail(profile.email);
    });

    // Step 3: Wait 1 day then send tips
    await step.sleep('wait-for-tips', '1d');

    await step.run('send-tips', async () => {
      await sendTipsEmail(profile.email);
    });

    return { onboarded: true };
  }
);
```

### Scheduled Functions

```typescript
// Cron-based
export const dailyCleanup = inngest.createFunction(
  { id: 'daily-cleanup' },
  { cron: '0 0 * * *' }, // Midnight daily
  async ({ step }) => {
    await step.run('cleanup-sessions', async () => {
      await cleanupExpiredSessions();
    });

    await step.run('cleanup-temp-files', async () => {
      await cleanupTempFiles();
    });
  }
);
```

### API Route

```typescript
// app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { sendWelcomeEmail, onboardUser, dailyCleanup } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendWelcomeEmail, onboardUser, dailyCleanup],
});
```

### Triggering Events

```typescript
// Send event
await inngest.send({
  name: 'user/created',
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Multiple events
await inngest.send([
  { name: 'user/created', data: { userId: '1' } },
  { name: 'user/created', data: { userId: '2' } },
]);
```

## Trigger.dev

### Installation

```bash
npm install @trigger.dev/sdk @trigger.dev/nextjs
```

### Setup

```typescript
// trigger.ts
import { TriggerClient } from '@trigger.dev/sdk';

export const client = new TriggerClient({
  id: 'my-app',
  apiKey: process.env.TRIGGER_API_KEY!,
  apiUrl: process.env.TRIGGER_API_URL,
});
```

### Define Jobs

```typescript
// jobs/process-image.ts
import { client } from '@/trigger';
import { eventTrigger } from '@trigger.dev/sdk';
import { z } from 'zod';

client.defineJob({
  id: 'process-image',
  name: 'Process Image',
  version: '1.0.0',
  trigger: eventTrigger({
    name: 'image.uploaded',
    schema: z.object({
      imageUrl: z.string().url(),
      userId: z.string(),
    }),
  }),
  run: async (payload, io, ctx) => {
    // Step 1: Download image
    const image = await io.runTask('download', async () => {
      return await downloadImage(payload.imageUrl);
    });

    // Step 2: Resize
    const resized = await io.runTask('resize', async () => {
      return await resizeImage(image, { width: 800 });
    });

    // Step 3: Upload
    const url = await io.runTask('upload', async () => {
      return await uploadToS3(resized);
    });

    // Step 4: Update database
    await io.runTask('update-db', async () => {
      await updateUserImage(payload.userId, url);
    });

    return { processedUrl: url };
  },
});
```

### Scheduled Jobs

```typescript
import { cronTrigger } from '@trigger.dev/sdk';

client.defineJob({
  id: 'daily-report',
  name: 'Generate Daily Report',
  version: '1.0.0',
  trigger: cronTrigger({
    cron: '0 9 * * *', // 9am daily
  }),
  run: async (payload, io) => {
    const report = await io.runTask('generate', async () => {
      return await generateReport();
    });

    await io.runTask('send', async () => {
      await sendReportEmail(report);
    });
  },
});
```

### Triggering Jobs

```typescript
// app/api/upload/route.ts
import { client } from '@/trigger';

export async function POST(request: Request) {
  const { imageUrl, userId } = await request.json();

  await client.sendEvent({
    name: 'image.uploaded',
    payload: { imageUrl, userId },
  });

  return Response.json({ queued: true });
}
```

## Job Patterns

### Retry with Backoff

```typescript
// BullMQ
await queue.add('job', data, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000, // 1s, 2s, 4s, 8s, 16s
  },
});

// Custom backoff
await queue.add('job', data, {
  attempts: 5,
  backoff: {
    type: 'custom',
  },
});

// In worker
const worker = new Worker('queue', processor, {
  settings: {
    backoffStrategy: (attemptsMade) => {
      return Math.min(attemptsMade * 1000, 30000);
    },
  },
});
```

### Rate Limiting

```typescript
// BullMQ rate limiter
const worker = new Worker('queue', processor, {
  limiter: {
    max: 100,      // Max 100 jobs
    duration: 1000, // Per 1 second
  },
});
```

### Job Batching

```typescript
// Process jobs in batches
const jobs = await queue.addBulk([
  { name: 'job1', data: { id: 1 } },
  { name: 'job2', data: { id: 2 } },
  { name: 'job3', data: { id: 3 } },
]);
```

### Dead Letter Queue

```typescript
// Failed jobs go to DLQ after max attempts
const dlqQueue = new Queue('dead-letter');

worker.on('failed', async (job, error) => {
  if (job && job.attemptsMade >= job.opts.attempts!) {
    await dlqQueue.add('failed-job', {
      originalQueue: 'main',
      originalData: job.data,
      error: error.message,
      failedAt: new Date(),
    });
  }
});
```

## Dashboard & Monitoring

### BullMQ Dashboard (Bull Board)

```typescript
// app/api/admin/queues/route.ts
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { emailQueue, reportQueue } from '@/lib/queue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(reportQueue),
  ],
  serverAdapter,
});
```

## Best Practices

1. **Idempotent jobs** - Jobs should be safe to retry
2. **Small payloads** - Store large data externally, pass references
3. **Monitor queues** - Track queue depth, failure rates
4. **Set timeouts** - Prevent jobs from running forever
5. **Use priorities** - Process critical jobs first
6. **Clean up** - Remove completed jobs regularly

## Environment Variables

```bash
# Redis (BullMQ)
REDIS_URL=redis://localhost:6379

# Inngest
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx

# Trigger.dev
TRIGGER_API_KEY=tr_xxx
TRIGGER_API_URL=https://api.trigger.dev
```

## Resources

- [BullMQ Documentation](https://docs.bullmq.io)
- [Inngest Documentation](https://inngest.com/docs)
- [Trigger.dev Documentation](https://trigger.dev/docs)
