---
name: webhook-patterns
description: Implements webhook receivers for Stripe, Supabase, and n8n in Next.js API routes with signature verification, idempotency, and error handling. Use when wiring payment events, database triggers, or automation webhooks into your app.
---

# Webhook Patterns for Next.js + Supabase + Stripe + n8n

Stack: Next.js App Router, Supabase, Stripe, n8n. Deployed on Vercel/Railway.

---

## Route Handler Foundation

Every webhook route follows this skeleton. No exceptions.

```typescript
// app/api/webhooks/[provider]/route.ts
import { NextRequest, NextResponse } from "next/server";

// CRITICAL: Disable body parsing — Stripe needs the raw body
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Never edge for webhooks — need crypto, buffer

export async function POST(req: NextRequest) {
  // 1. Read raw body ONCE (can only be consumed once)
  const rawBody = await req.text();

  // 2. Verify signature
  // 3. Parse event
  // 4. Check idempotency
  // 5. Handle event
  // 6. Return 200 quickly — do heavy work async

  return NextResponse.json({ received: true }, { status: 200 });
}

// BLOCK everything except POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
```

### Bad vs Good: Route Configuration

```typescript
// BAD: Will cache webhook responses, miss events
export async function POST(req: NextRequest) {
  const body = await req.json(); // Stripe sig verification will fail — json() consumes and parses
  // ...
}

// GOOD: Raw body preserved, no caching
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // Preserves raw bytes for signature verification
  const event = JSON.parse(rawBody); // Parse separately after verification
  // ...
}
```

---

## 1. Stripe Webhooks

### Signature Verification

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await handleStripeEvent(event);
  } catch (err) {
    console.error(`Failed to handle ${event.type}:`, err);
    // Return 200 anyway to prevent Stripe retries for business logic errors
    // Only return 4xx/5xx if you WANT Stripe to retry
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
```

### Event Handler Pattern

```typescript
async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  if (!userId) throw new Error("No user_id in session metadata");

  const { error } = await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      status: "active",
      plan: session.metadata?.plan ?? "pro",
      current_period_end: new Date(
        (session as any).current_period_end * 1000
      ).toISOString(),
    }, { onConflict: "user_id" });

  if (error) throw error;
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      plan: subscription.items.data[0]?.price?.lookup_key ?? "pro",
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      plan: "free",
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Look up user by Stripe customer ID
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (sub) {
    await supabase
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("user_id", sub.user_id);

    // TODO: Send email notification via Resend/n8n
  }
}
```

### Stripe Webhook Checklist

- [ ] `STRIPE_WEBHOOK_SECRET` set in env (starts with `whsec_`)
- [ ] Raw body read with `req.text()`, NOT `req.json()`
- [ ] `constructEvent` called with raw body + signature + secret
- [ ] `dynamic = "force-dynamic"` exported
- [ ] `runtime = "nodejs"` (not edge)
- [ ] Always pass `metadata.user_id` when creating Checkout Sessions
- [ ] Return 200 for handled events (even partial failures) to avoid infinite retries
- [ ] Return 500 only when you want Stripe to retry delivery
- [ ] Handle both test mode (`evt_test_`) and live mode events
- [ ] Use separate webhook secrets for test vs live

---

## 2. Supabase Webhooks

### Database Webhooks via pg_net

Supabase database webhooks fire HTTP requests when rows change. Configure in Dashboard > Database > Webhooks.

```sql
-- Enable pg_net extension (Dashboard > Extensions)
create extension if not exists pg_net;

-- Example: fire webhook on new user profile
create or replace function notify_new_profile()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://your-app.vercel.app/api/webhooks/supabase',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.webhook_secret')
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'profiles',
      'record', row_to_json(NEW),
      'old_record', null
    )
  );
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on profiles
  for each row execute function notify_new_profile();
```

### Supabase Webhook Receiver

```typescript
// app/api/webhooks/supabase/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify shared secret (bearer token approach)
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || !timingSafeEqual(token, WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    type: "INSERT" | "UPDATE" | "DELETE";
    table: string;
    record: Record<string, any>;
    old_record: Record<string, any> | null;
  };

  try {
    switch (payload.table) {
      case "profiles":
        await handleProfileChange(payload);
        break;
      case "submissions":
        await handleSubmissionChange(payload);
        break;
      default:
        console.log(`Unhandled table webhook: ${payload.table}`);
    }
  } catch (err) {
    console.error("Supabase webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Timing-safe comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

### Supabase Edge Function as Webhook Target

When you need to keep webhook processing inside Supabase (lower latency, same network):

```typescript
// supabase/functions/on-user-created/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("WEBHOOK_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Process the webhook payload
  // ...

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Supabase Webhook Checklist

- [ ] `pg_net` extension enabled
- [ ] Shared secret stored in Supabase vault or as database setting
- [ ] Webhook URL uses HTTPS
- [ ] Timing-safe comparison for secret verification
- [ ] Trigger function uses `security definer` (runs with owner privileges)
- [ ] Payload includes table name and operation type for routing
- [ ] Consider Edge Functions for intra-Supabase processing

---

## 3. n8n Webhooks

### Receiving Webhooks FROM n8n

n8n sends data to your app when a workflow completes or reaches a webhook node.

```typescript
// app/api/webhooks/n8n/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Option A: Header-based auth (configure in n8n HTTP Request node)
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || !timingSafeEqual(secret, N8N_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  try {
    await handleN8nEvent(payload);
  } catch (err) {
    console.error("n8n webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleN8nEvent(payload: any) {
  const { event, data } = payload;

  switch (event) {
    case "content.generated":
      // n8n AI workflow completed, store result
      await supabase
        .from("generated_content")
        .insert({ content: data.content, prompt: data.prompt });
      break;

    case "email.sent":
      // n8n sent an email, log it
      await supabase
        .from("email_log")
        .insert({ recipient: data.to, template: data.template, sent_at: new Date().toISOString() });
      break;

    default:
      console.log("Unknown n8n event:", event);
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

### Sending Webhooks TO n8n

Trigger n8n workflows from your app by hitting n8n's webhook trigger URL.

```typescript
// lib/n8n.ts
const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL!; // e.g., https://n8n.railway.internal

export async function triggerN8nWorkflow(
  workflowPath: string,
  data: Record<string, any>
) {
  const url = `${N8N_BASE_URL}/webhook/${workflowPath}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n trigger failed (${response.status}): ${text}`);
  }

  return response.json();
}

// Usage in a Server Action or API route:
// await triggerN8nWorkflow("send-welcome-email", { email: user.email, name: user.name });
// await triggerN8nWorkflow("generate-summary", { documentId: "abc123" });
```

### n8n Webhook Authentication Options

| Method | n8n Config | App Config | Security Level |
|--------|-----------|------------|----------------|
| Header auth | HTTP Request node > Header Auth | Check `x-webhook-secret` header | Good |
| Basic auth | Webhook node > Basic Auth | Check Authorization header | Moderate |
| Query param | Append `?token=xxx` to URL | Check `searchParams.get("token")` | Weak (logged in URLs) |
| HMAC signature | Custom Function node to sign body | Verify HMAC-SHA256 | Best |

### HMAC Signature Verification for n8n (Best Security)

```typescript
// Configure n8n Function node to sign the request body:
// const crypto = require('crypto');
// const hmac = crypto.createHmac('sha256', $env.WEBHOOK_SECRET);
// hmac.update(JSON.stringify($input.all()));
// $input.first().json.signature = hmac.digest('hex');

function verifyN8nHmac(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}
```

### n8n Webhook Checklist

- [ ] Webhook secret shared between n8n and your app via env vars
- [ ] Use Railway private networking for n8n-to-app calls when both on Railway
- [ ] n8n webhook trigger set to "Respond immediately" for fire-and-forget
- [ ] Error workflow configured in n8n to catch failures
- [ ] Use HMAC signatures over header tokens when possible
- [ ] Never put secrets in query parameters

---

## 4. Security

### Replay Protection

Prevent replayed webhook requests by checking timestamps.

```typescript
function isReplayAttack(timestamp: number, toleranceSeconds = 300): boolean {
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - timestamp) > toleranceSeconds;
}

// Stripe includes timestamp in signature header
// Format: t=1614556828,v1=abc123...
function extractStripeTimestamp(signatureHeader: string): number {
  const parts = signatureHeader.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  return tPart ? parseInt(tPart.split("=")[1], 10) : 0;
}
```

### Idempotency

Webhooks can be delivered more than once. Always deduplicate.

```typescript
// lib/idempotency.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function isProcessed(eventId: string): Promise<boolean> {
  const { data } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("event_id", eventId)
    .single();

  return !!data;
}

export async function markProcessed(
  eventId: string,
  provider: string,
  eventType: string
): Promise<void> {
  await supabase.from("webhook_events").insert({
    event_id: eventId,
    provider,
    event_type: eventType,
    processed_at: new Date().toISOString(),
  });
}
```

```sql
-- Migration: create webhook_events table
create table webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique not null,
  provider text not null, -- 'stripe', 'supabase', 'n8n'
  event_type text not null,
  processed_at timestamptz not null default now(),
  payload jsonb -- optional: store for debugging
);

create index idx_webhook_events_event_id on webhook_events(event_id);

-- Auto-cleanup old events (keep 30 days)
create or replace function cleanup_old_webhook_events()
returns void as $$
begin
  delete from webhook_events where processed_at < now() - interval '30 days';
end;
$$ language plpgsql;
```

### Using Idempotency in a Webhook Handler

```typescript
export async function POST(req: NextRequest) {
  // ... signature verification ...

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  // Deduplicate using Stripe's event ID
  if (await isProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await handleStripeEvent(event);
  await markProcessed(event.id, "stripe", event.type);

  return NextResponse.json({ received: true });
}
```

### Security Checklist

- [ ] Timing-safe comparison for ALL secret checks (never use `===`)
- [ ] Replay protection with timestamp tolerance (5 min default)
- [ ] Idempotency via `webhook_events` table with unique event IDs
- [ ] Raw body used for signature verification (before JSON parsing)
- [ ] Secrets in environment variables, never hardcoded
- [ ] HTTPS only (Vercel handles this; Railway needs proxy config)
- [ ] Rate limiting on webhook endpoints (Vercel's built-in or custom middleware)
- [ ] Log failed verification attempts for monitoring

---

## 5. Error Handling and Observability

### Failed Webhook Logging

```typescript
// lib/webhook-logger.ts
export async function logWebhookFailure(
  provider: string,
  eventType: string,
  eventId: string,
  error: Error,
  payload: any
) {
  console.error(`[WEBHOOK_FAIL] ${provider}/${eventType} (${eventId}):`, error.message);

  await supabase.from("webhook_failures").insert({
    provider,
    event_type: eventType,
    event_id: eventId,
    error_message: error.message,
    error_stack: error.stack,
    payload,
    failed_at: new Date().toISOString(),
    retry_count: 0,
    resolved: false,
  });
}
```

```sql
create table webhook_failures (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  event_id text not null,
  error_message text not null,
  error_stack text,
  payload jsonb,
  failed_at timestamptz not null default now(),
  retry_count int default 0,
  resolved boolean default false,
  resolved_at timestamptz
);
```

### Retry Strategy

```typescript
// Return 500 to let the provider retry (Stripe retries for up to 3 days)
// Return 200 to acknowledge and handle retries yourself

// For self-managed retries:
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unreachable");
}
```

### Complete Webhook Route with Full Error Handling

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isProcessed, markProcessed } from "@/lib/idempotency";
import { logWebhookFailure } from "@/lib/webhook-logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // 1. Verify signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[STRIPE] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Idempotency check
  if (await isProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // 3. Handle event
  try {
    await handleStripeEvent(event);
    await markProcessed(event.id, "stripe", event.type);
  } catch (err) {
    await logWebhookFailure("stripe", event.type, event.id, err as Error, event.data.object);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
```

---

## 6. Testing

### Stripe CLI Webhook Forwarding

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# The CLI prints a webhook signing secret (whsec_...) — use this as
# STRIPE_WEBHOOK_SECRET in .env.local for local development

# Trigger specific events for testing
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed
```

### Manual Webhook Testing Script

```typescript
// scripts/test-webhook.ts
// Run with: npx tsx scripts/test-webhook.ts

const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:3000/api/webhooks/n8n";
const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || "test-secret";

async function testWebhook() {
  const payload = {
    event: "content.generated",
    data: {
      content: "Test generated content",
      prompt: "Test prompt",
    },
  };

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": WEBHOOK_SECRET,
    },
    body: JSON.stringify(payload),
  });

  console.log("Status:", response.status);
  console.log("Body:", await response.json());
}

testWebhook().catch(console.error);
```

### Testing Checklist

- [ ] Stripe CLI installed and forwarding to `localhost:3000`
- [ ] Local `.env.local` has the CLI's `whsec_` signing secret
- [ ] Triggered each event type manually at least once
- [ ] Verified idempotency by sending same event twice
- [ ] Tested with invalid/missing signature (expect 400)
- [ ] Tested with expired timestamp (expect rejection)
- [ ] Checked `webhook_events` and `webhook_failures` tables after tests
- [ ] n8n test webhook node used for end-to-end testing

---

## 7. Environment Variables Reference

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...           # From Stripe Dashboard or CLI
SUPABASE_WEBHOOK_SECRET=your-random-secret # Generate with: openssl rand -hex 32
N8N_WEBHOOK_SECRET=your-random-secret      # Shared with n8n instance
N8N_WEBHOOK_URL=https://n8n.yourapp.railway.internal  # Railway private networking
```

---

## 8. Deployment Notes

### Vercel

- Webhook routes work out of the box with Vercel Serverless Functions
- Set `runtime = "nodejs"` (not edge) for crypto operations
- Maximum execution time: 10s on Hobby, 60s on Pro. Keep handlers fast.
- Set environment variables in Vercel Dashboard for each environment

### Railway

- When n8n and your app are both on Railway, use private networking (`*.railway.internal`) for webhook calls between them
- No cold start penalty on Railway (always-on containers)
- Set `RAILWAY_PUBLIC_DOMAIN` for external webhook URLs

### Webhook URL Registration

| Provider | Where to register | URL pattern |
|----------|------------------|-------------|
| Stripe | Dashboard > Developers > Webhooks | `https://yourapp.vercel.app/api/webhooks/stripe` |
| Supabase | Database trigger / Edge Function | `https://yourapp.vercel.app/api/webhooks/supabase` |
| n8n | HTTP Request node / Webhook node | `https://yourapp.vercel.app/api/webhooks/n8n` |

---

## Quick Copy Templates

### New Stripe Webhook Route

```bash
mkdir -p src/app/api/webhooks/stripe && cat > src/app/api/webhooks/stripe/route.ts << 'TEMPLATE'
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // TODO: Add idempotency check
  // TODO: Add event handlers

  console.log(`Stripe event: ${event.type}`);
  return NextResponse.json({ received: true });
}
TEMPLATE
```

### New Generic Webhook Route (n8n / Supabase)

```bash
mkdir -p src/app/api/webhooks/n8n && cat > src/app/api/webhooks/n8n/route.ts << 'TEMPLATE'
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET!;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || !timingSafeEqual(secret, WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  // TODO: Add event handlers

  console.log("Webhook received:", payload);
  return NextResponse.json({ received: true });
}
TEMPLATE
```
