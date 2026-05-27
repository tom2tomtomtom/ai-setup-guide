---
name: multi-tenant-saas
description: Implements multi-tenant SaaS patterns with Supabase RLS, org-scoped data isolation, shared SSO gateway, and per-tenant Stripe billing. Use when building platforms with multiple organizations, cross-app auth, or tenant-isolated data.
---

# Multi-Tenant SaaS Patterns

Production patterns for building multi-tenant platforms on Supabase (PostgreSQL + Auth) and Next.js. Designed for the AIDEN Platform architecture: multiple apps sharing SSO via a Gateway, with tenant data isolated through Row Level Security.

---

## When to Use This Skill

- Adding a new table to a multi-tenant database (needs `org_id` + RLS)
- Building cross-app authentication with shared sessions
- Designing org-scoped API routes with tenant validation
- Setting up per-org Stripe billing and subscription scoping
- Writing migrations that preserve RLS integrity
- Preventing cross-tenant data leaks in queries
- Adding app-specific permissions within a shared user base
- Testing tenant isolation policies

---

## Core Principle

**Every row belongs to an org. Every query proves it.**

Multi-tenancy fails silently. A missing `WHERE org_id = ?` clause doesn't throw errors -- it returns other tenants' data. RLS is the safety net that catches what application code misses.

---

## 1. Database Design

### Tenant-Scoped Tables

Every table that stores tenant data MUST have `org_id` as a non-nullable column with an RLS policy.

```sql
-- BAD: No tenant scoping
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- GOOD: Tenant-scoped with org_id
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for every tenant-scoped table
CREATE INDEX idx_projects_org_id ON projects(org_id);
```

### The Orgs Table (Tenant Root)

```sql
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,  -- URL-safe identifier
  stripe_customer_id TEXT,     -- Stripe customer per org
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Membership: links users to orgs with roles
CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

CREATE INDEX idx_org_members_user_id ON org_members(user_id);
CREATE INDEX idx_org_members_org_id ON org_members(org_id);
```

### Shared Reference Tables (No `org_id`)

Some tables are platform-wide and should NOT be tenant-scoped:

```sql
-- Shared reference data — no org_id, no RLS needed
CREATE TABLE plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  limits JSONB DEFAULT '{}',
  UNIQUE(plan, feature_key)
);

-- Platform-level config
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  rollout_pct INTEGER DEFAULT 0,
  org_ids UUID[] DEFAULT '{}' -- Empty = all orgs, populated = only these orgs
);
```

### Decision Tree: Does This Table Need `org_id`?

```
Does this table store user-generated data?
├── YES → Add org_id + RLS
├── NO → Is it per-user config (preferences, API keys)?
│   ├── YES → Add user_id + RLS (may also need org_id)
│   └── NO → Is it platform reference data?
│       ├── YES → No org_id, public READ policy or no RLS
│       └── NO → Is it billing/subscription data?
│           ├── YES → Add org_id + RLS
│           └── NO → Ask yourself again — if in doubt, add org_id
```

---

## 2. Row Level Security (RLS)

### RLS Policy Templates

**Enable RLS on every tenant-scoped table. No exceptions.**

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- Force RLS even for table owners (prevents bypassing via service role in app code)
ALTER TABLE projects FORCE ROW LEVEL SECURITY;
```

#### Helper Function: Get User's Orgs

```sql
-- Returns all org_ids the current user belongs to
CREATE OR REPLACE FUNCTION auth.user_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM org_members WHERE user_id = auth.uid()
$$;

-- Returns the user's role in a specific org
CREATE OR REPLACE FUNCTION auth.user_org_role(target_org_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM org_members
  WHERE user_id = auth.uid() AND org_id = target_org_id
  LIMIT 1
$$;
```

#### Standard CRUD Policies

```sql
-- SELECT: Users see only their org's data
CREATE POLICY "select_own_org" ON projects
  FOR SELECT USING (
    org_id IN (SELECT auth.user_org_ids())
  );

-- INSERT: Users can only insert into their own orgs
CREATE POLICY "insert_own_org" ON projects
  FOR INSERT WITH CHECK (
    org_id IN (SELECT auth.user_org_ids())
  );

-- UPDATE: Members can update, viewers cannot
CREATE POLICY "update_own_org" ON projects
  FOR UPDATE USING (
    org_id IN (SELECT auth.user_org_ids())
    AND auth.user_org_role(org_id) IN ('owner', 'admin', 'member')
  );

-- DELETE: Only owners and admins can delete
CREATE POLICY "delete_own_org" ON projects
  FOR DELETE USING (
    org_id IN (SELECT auth.user_org_ids())
    AND auth.user_org_role(org_id) IN ('owner', 'admin')
  );
```

#### Role-Based Policy Pattern

```sql
-- Pattern: Different access levels by org role
CREATE POLICY "role_based_access" ON sensitive_reports
  FOR SELECT USING (
    CASE auth.user_org_role(org_id)
      WHEN 'owner' THEN true           -- Sees everything
      WHEN 'admin' THEN true           -- Sees everything
      WHEN 'member' THEN NOT is_draft  -- Members see published only
      WHEN 'viewer' THEN NOT is_draft AND NOT is_internal
      ELSE false
    END
  );
```

#### Org Members Table Self-Referencing Policy

```sql
-- Users can see members of orgs they belong to
CREATE POLICY "see_org_members" ON org_members
  FOR SELECT USING (
    org_id IN (SELECT auth.user_org_ids())
  );

-- Only admins/owners can add members
CREATE POLICY "add_org_members" ON org_members
  FOR INSERT WITH CHECK (
    auth.user_org_role(org_id) IN ('owner', 'admin')
  );

-- Only owners can change roles
CREATE POLICY "update_roles" ON org_members
  FOR UPDATE USING (
    auth.user_org_role(org_id) = 'owner'
  );

-- Owners can remove members, members can remove themselves
CREATE POLICY "remove_members" ON org_members
  FOR DELETE USING (
    auth.user_org_role(org_id) = 'owner'
    OR user_id = auth.uid()
  );
```

### Common RLS Mistakes

```sql
-- BAD: Using auth.uid() directly without org scoping
CREATE POLICY "bad_policy" ON projects
  FOR SELECT USING (created_by = auth.uid());
-- Problem: User creates project in Org A, moves to Org B, still sees Org A data

-- GOOD: Always scope through org membership
CREATE POLICY "good_policy" ON projects
  FOR SELECT USING (org_id IN (SELECT auth.user_org_ids()));

-- BAD: Forgetting RLS on junction tables
CREATE TABLE project_tags (
  project_id UUID REFERENCES projects(id),
  tag_id UUID REFERENCES tags(id)
);
-- Problem: No RLS means anyone can read/write project_tags

-- GOOD: RLS on junction tables too
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_project_tags" ON project_tags
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE org_id IN (SELECT auth.user_org_ids())
    )
  );
```

### When to Bypass RLS

Use `service_role` key (bypasses RLS) ONLY for:
- Webhook handlers (Stripe, external services) where there is no authenticated user
- Admin operations triggered by platform operators
- Background jobs and cron tasks
- Cross-org aggregation for platform analytics

```typescript
// NEVER use service_role in client-facing code
// BAD:
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
// This bypasses ALL RLS — any query returns ALL tenants' data

// GOOD: Use anon key + user JWT for all client-facing operations
const supabase = createServerClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  cookies: () => cookieStore,
});

// ONLY use service_role in server-side webhook handlers
// app/api/webhooks/stripe/route.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // OK here — webhook, no user context
);
```

---

## 3. Shared Authentication (SSO Gateway)

### Architecture: Gateway JWT Pattern

For multi-app platforms (like AIDEN), a single Gateway app handles Supabase Auth. All other apps verify a Gateway-signed JWT.

```
User logs in at gateway.yourplatform.com
  → Gateway calls supabase.auth.signInWithOAuth({ provider: 'google' })
  → On success, Gateway signs a custom JWT with org context
  → Sets cookie on .yourplatform.com domain
  → All apps on *.yourplatform.com read this cookie
```

#### Gateway: Sign JWT with Org Context

```typescript
// gateway/lib/auth/sign-session.ts
import jwt from 'jsonwebtoken';

interface SessionPayload {
  sub: string;          // user_id
  email: string;
  org_id: string;       // current active org
  org_role: string;     // role in current org
  org_ids: string[];    // all orgs user belongs to
}

export function signGatewayJWT(payload: SessionPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
    issuer: 'aiden-gateway',
  });
}

// After successful Supabase auth:
export async function createSession(supabaseUser: User) {
  const { data: memberships } = await supabaseAdmin
    .from('org_members')
    .select('org_id, role')
    .eq('user_id', supabaseUser.id);

  const primaryOrg = memberships?.[0];

  const token = signGatewayJWT({
    sub: supabaseUser.id,
    email: supabaseUser.email!,
    org_id: primaryOrg?.org_id,
    org_role: primaryOrg?.role,
    org_ids: memberships?.map(m => m.org_id) || [],
  });

  // Set cookie on parent domain so all subdomains can read it
  cookies().set('gw-session', token, {
    domain: '.yourplatform.com',  // Note the leading dot
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
```

#### Child Apps: Verify Gateway JWT

```typescript
// shared/lib/auth/verify-session.ts
import jwt from 'jsonwebtoken';

export interface GatewaySession {
  sub: string;
  email: string;
  org_id: string;
  org_role: string;
  org_ids: string[];
}

export function verifyGatewayJWT(token: string): GatewaySession | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      issuer: 'aiden-gateway',
    });
    return payload as GatewaySession;
  } catch {
    return null;
  }
}
```

#### Middleware: Inject Tenant Context

```typescript
// middleware.ts (child app)
import { NextRequest, NextResponse } from 'next/server';
import { verifyGatewayJWT } from '@/lib/auth/verify-session';

const PUBLIC_PATHS = ['/api/webhooks', '/api/health', '/_next'];

export function middleware(request: NextRequest) {
  // Skip public paths
  if (PUBLIC_PATHS.some(p => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('gw-session')?.value;
  if (!token) {
    return NextResponse.redirect(
      `${process.env.GATEWAY_URL}/auth/login?redirect=${encodeURIComponent(request.url)}`
    );
  }

  const session = verifyGatewayJWT(token);
  if (!session) {
    // Expired or invalid — redirect to Gateway to refresh
    return NextResponse.redirect(
      `${process.env.GATEWAY_URL}/auth/login?redirect=${encodeURIComponent(request.url)}`
    );
  }

  // Inject tenant context into request headers for API routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', session.sub);
  response.headers.set('x-org-id', session.org_id);
  response.headers.set('x-org-role', session.org_role);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Cross-App Session Sharing Checklist

```
[ ] All apps deployed on subdomains of same parent domain
[ ] Cookie set with domain=".yourplatform.com" (leading dot)
[ ] JWT_SECRET env var identical across all apps
[ ] Gateway URL configured in every child app
[ ] Redirect-after-login preserves original destination
[ ] Session refresh: child apps redirect to Gateway /auth/refresh
[ ] Logout: Gateway clears cookie + revokes Supabase session
```

---

## 4. API Patterns

### Route-Level Tenant Validation

```typescript
// lib/auth/get-tenant.ts
import { headers } from 'next/headers';

export interface TenantContext {
  userId: string;
  orgId: string;
  orgRole: string;
}

export async function getTenantContext(): Promise<TenantContext> {
  const h = await headers();
  const userId = h.get('x-user-id');
  const orgId = h.get('x-org-id');
  const orgRole = h.get('x-org-role');

  if (!userId || !orgId) {
    throw new Error('Missing tenant context — middleware should have caught this');
  }

  return { userId, orgId, orgRole: orgRole || 'member' };
}
```

#### Using Tenant Context in API Routes

```typescript
// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { getTenantContext } from '@/lib/auth/get-tenant';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const { orgId } = await getTenantContext();
  const supabase = await createServerClient();

  // RLS handles scoping, but explicit filter is defense-in-depth
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('org_id', orgId)  // Belt AND suspenders
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { orgId, userId } = await getTenantContext();
  const body = await request.json();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...body,
      org_id: orgId,      // ALWAYS set from server context, never from client
      created_by: userId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

### Preventing Cross-Tenant Data Leaks

```typescript
// BAD: Trusting client-supplied org_id
export async function POST(request: Request) {
  const { orgId, name } = await request.json(); // orgId from client!
  await supabase.from('projects').insert({ org_id: orgId, name });
}

// GOOD: org_id always comes from verified session
export async function POST(request: Request) {
  const { orgId } = await getTenantContext(); // From verified JWT
  const { name } = await request.json();      // Only data fields from client
  await supabase.from('projects').insert({ org_id: orgId, name });
}

// BAD: Fetching by ID without tenant check
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)    // Any user could guess another org's project ID
    .single();
  return NextResponse.json(data);
}

// GOOD: Always include org_id in the query
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { orgId } = await getTenantContext();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('org_id', orgId)   // Defense-in-depth with RLS
    .single();

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
```

### Org Switching

```typescript
// app/api/auth/switch-org/route.ts
export async function POST(request: Request) {
  const { userId } = await getTenantContext();
  const { orgId: targetOrgId } = await request.json();

  // Verify user is a member of the target org
  const { data: membership } = await supabaseAdmin
    .from('org_members')
    .select('role')
    .eq('user_id', userId)
    .eq('org_id', targetOrgId)
    .single();

  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this org' }, { status: 403 });
  }

  // Re-sign JWT with new active org
  const newToken = signGatewayJWT({
    sub: userId,
    email: session.email,
    org_id: targetOrgId,
    org_role: membership.role,
    org_ids: session.org_ids,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set('gw-session', newToken, {
    domain: '.yourplatform.com',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
```

---

## 5. Multi-Product Architecture

### Shared User Table, App-Specific Permissions

```sql
-- Users come from Supabase auth.users (shared across all apps)
-- Org membership is shared across all apps
-- App-specific permissions are scoped

CREATE TABLE app_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app TEXT NOT NULL CHECK (app IN ('creative-agent', 'pressure-test', 'studio', 'chat', 'gateway')),
  permissions JSONB NOT NULL DEFAULT '{}',
  -- Example: {"can_create_campaigns": true, "max_projects": 10}
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id, app)
);

ALTER TABLE app_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_own_permissions" ON app_permissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_manage_permissions" ON app_permissions
  FOR ALL USING (
    auth.user_org_role(org_id) IN ('owner', 'admin')
  );
```

### Feature Flags Per Tenant

```typescript
// lib/features/check-feature.ts
import { createServerClient } from '@/lib/supabase/server';

export async function hasFeature(orgId: string, featureKey: string): Promise<boolean> {
  const supabase = await createServerClient();

  // Check org plan features
  const { data: org } = await supabase
    .from('orgs')
    .select('plan')
    .eq('id', orgId)
    .single();

  if (!org) return false;

  const { data: feature } = await supabase
    .from('plan_features')
    .select('enabled, limits')
    .eq('plan', org.plan)
    .eq('feature_key', featureKey)
    .single();

  if (feature?.enabled) return true;

  // Check org-specific feature flag overrides
  const { data: flag } = await supabase
    .from('feature_flags')
    .select('enabled, org_ids')
    .eq('key', featureKey)
    .single();

  if (!flag) return false;
  if (flag.org_ids?.length === 0) return flag.enabled; // Global flag
  return flag.org_ids?.includes(orgId) ?? false;         // Org-specific
}

// Usage in API route:
export async function POST(request: Request) {
  const { orgId } = await getTenantContext();

  if (!await hasFeature(orgId, 'ai_campaigns')) {
    return NextResponse.json(
      { error: 'Upgrade to Pro to access AI campaigns' },
      { status: 403 }
    );
  }
  // ... proceed
}
```

---

## 6. Billing Per Tenant (Stripe)

### One Stripe Customer Per Org

```typescript
// lib/stripe/create-customer.ts
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function getOrCreateStripeCustomer(orgId: string) {
  const { data: org } = await supabaseAdmin
    .from('orgs')
    .select('id, name, stripe_customer_id')
    .eq('id', orgId)
    .single();

  if (org?.stripe_customer_id) {
    return org.stripe_customer_id;
  }

  // Create Stripe customer linked to org
  const customer = await stripe.customers.create({
    name: org!.name,
    metadata: { org_id: orgId },
  });

  // Store the mapping
  await supabaseAdmin
    .from('orgs')
    .update({ stripe_customer_id: customer.id })
    .eq('id', orgId);

  return customer.id;
}
```

### Subscription Scoped to Org

```typescript
// app/api/billing/checkout/route.ts
export async function POST(request: Request) {
  const { orgId, orgRole } = await getTenantContext();

  // Only owners/admins can manage billing
  if (!['owner', 'admin'].includes(orgRole)) {
    return NextResponse.json({ error: 'Only admins can manage billing' }, { status: 403 });
  }

  const customerId = await getOrCreateStripeCustomer(orgId);
  const { priceId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing`,
    metadata: { org_id: orgId },
    subscription_data: {
      metadata: { org_id: orgId },
    },
  });

  return NextResponse.json({ url: session.url });
}
```

### Webhook: Sync Plan to Org

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orgId = session.metadata?.org_id;
      if (orgId) {
        await supabaseAdmin
          .from('orgs')
          .update({ plan: 'pro', stripe_customer_id: session.customer as string })
          .eq('id', orgId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const orgId = subscription.metadata?.org_id;
      const status = subscription.status;

      if (orgId) {
        const plan = status === 'active' ? 'pro' : 'free';
        await supabaseAdmin
          .from('orgs')
          .update({ plan })
          .eq('id', orgId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const orgId = subscription.metadata?.org_id;
      if (orgId) {
        await supabaseAdmin
          .from('orgs')
          .update({ plan: 'free' })
          .eq('id', orgId);
      }
      break;
    }
  }

  return new Response('OK', { status: 200 });
}
```

### Usage Tracking Per Tenant

```sql
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,            -- 'api_calls', 'ai_tokens', 'storage_bytes'
  quantity BIGINT NOT NULL DEFAULT 1,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  period_start DATE NOT NULL DEFAULT date_trunc('month', now())::date
);

ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_own_usage" ON usage_records
  FOR SELECT USING (org_id IN (SELECT auth.user_org_ids()));

-- Aggregation view for billing dashboard
CREATE OR REPLACE VIEW org_usage_summary AS
SELECT
  org_id,
  metric,
  period_start,
  SUM(quantity) as total
FROM usage_records
WHERE period_start = date_trunc('month', now())::date
GROUP BY org_id, metric, period_start;
```

```typescript
// lib/usage/track.ts
export async function trackUsage(orgId: string, metric: string, quantity = 1) {
  await supabaseAdmin.from('usage_records').insert({
    org_id: orgId,
    metric,
    quantity,
    period_start: new Date().toISOString().slice(0, 7) + '-01', // First of month
  });
}

// Enforce limits
export async function checkUsageLimit(orgId: string, metric: string): Promise<boolean> {
  const { data: org } = await supabaseAdmin
    .from('orgs')
    .select('plan')
    .eq('id', orgId)
    .single();

  const { data: feature } = await supabaseAdmin
    .from('plan_features')
    .select('limits')
    .eq('plan', org!.plan)
    .eq('feature_key', metric)
    .single();

  const limit = feature?.limits?.monthly_max;
  if (!limit) return true; // No limit defined

  const { data: usage } = await supabaseAdmin
    .from('org_usage_summary')
    .select('total')
    .eq('org_id', orgId)
    .eq('metric', metric)
    .single();

  return (usage?.total ?? 0) < limit;
}
```

---

## 7. Migration Patterns

### Migration Template: New Tenant-Scoped Table

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_campaigns.sql

-- 1. Create the table with org_id
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes (always index org_id)
CREATE INDEX idx_campaigns_org_id ON campaigns(org_id);
CREATE INDEX idx_campaigns_status ON campaigns(org_id, status);

-- 3. Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "select_campaigns" ON campaigns
  FOR SELECT USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "insert_campaigns" ON campaigns
  FOR INSERT WITH CHECK (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "update_campaigns" ON campaigns
  FOR UPDATE USING (
    org_id IN (SELECT auth.user_org_ids())
    AND auth.user_org_role(org_id) IN ('owner', 'admin', 'member')
  );

CREATE POLICY "delete_campaigns" ON campaigns
  FOR DELETE USING (
    org_id IN (SELECT auth.user_org_ids())
    AND auth.user_org_role(org_id) IN ('owner', 'admin')
  );

-- 5. Updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
```

### Migration Checklist

```
For every new table:
[ ] Has org_id column (unless shared reference table)
[ ] org_id is NOT NULL with REFERENCES orgs(id) ON DELETE CASCADE
[ ] org_id has an index
[ ] RLS is enabled (ALTER TABLE ... ENABLE ROW LEVEL SECURITY)
[ ] SELECT policy exists
[ ] INSERT policy exists with WITH CHECK
[ ] UPDATE policy exists (check role requirements)
[ ] DELETE policy exists (usually admin/owner only)
[ ] updated_at trigger if table has updated_at column
[ ] Junction tables also have RLS
```

---

## 8. Testing

### Testing RLS Policies

```typescript
// __tests__/rls/projects.test.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('projects RLS', () => {
  let orgA: string;
  let orgB: string;
  let userA: string;
  let userB: string;

  beforeAll(async () => {
    // Create test orgs
    const { data: oA } = await supabaseAdmin.from('orgs').insert({ name: 'Org A', slug: 'org-a' }).select().single();
    const { data: oB } = await supabaseAdmin.from('orgs').insert({ name: 'Org B', slug: 'org-b' }).select().single();
    orgA = oA!.id;
    orgB = oB!.id;

    // Create test users via Supabase Auth admin API
    const { data: uA } = await supabaseAdmin.auth.admin.createUser({
      email: 'usera@test.com', password: 'test1234', email_confirm: true
    });
    const { data: uB } = await supabaseAdmin.auth.admin.createUser({
      email: 'userb@test.com', password: 'test1234', email_confirm: true
    });
    userA = uA.user!.id;
    userB = uB.user!.id;

    // Assign memberships
    await supabaseAdmin.from('org_members').insert([
      { org_id: orgA, user_id: userA, role: 'owner' },
      { org_id: orgB, user_id: userB, role: 'owner' },
    ]);

    // Seed data
    await supabaseAdmin.from('projects').insert([
      { org_id: orgA, name: 'Project A1' },
      { org_id: orgA, name: 'Project A2' },
      { org_id: orgB, name: 'Project B1' },
    ]);
  });

  it('User A cannot see Org B projects', async () => {
    // Sign in as User A
    const { data: session } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink', email: 'usera@test.com'
    });

    const userClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    await userClient.auth.signInWithPassword({
      email: 'usera@test.com', password: 'test1234'
    });

    const { data: projects } = await userClient.from('projects').select('*');

    // Should only see Org A projects
    expect(projects).toHaveLength(2);
    expect(projects!.every(p => p.org_id === orgA)).toBe(true);
  });

  it('User A cannot insert into Org B', async () => {
    const userClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    await userClient.auth.signInWithPassword({
      email: 'usera@test.com', password: 'test1234'
    });

    const { error } = await userClient.from('projects').insert({
      org_id: orgB, name: 'Sneaky Project'
    });

    expect(error).not.toBeNull();
    expect(error!.code).toBe('42501'); // RLS violation
  });

  it('User A cannot update Org B projects', async () => {
    const userClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    await userClient.auth.signInWithPassword({
      email: 'usera@test.com', password: 'test1234'
    });

    const { data } = await userClient
      .from('projects')
      .update({ name: 'Hacked' })
      .eq('org_id', orgB);

    // RLS silently returns 0 rows updated (not an error)
    expect(data).toEqual([]);
  });

  afterAll(async () => {
    // Clean up test data
    await supabaseAdmin.from('org_members').delete().in('org_id', [orgA, orgB]);
    await supabaseAdmin.from('projects').delete().in('org_id', [orgA, orgB]);
    await supabaseAdmin.from('orgs').delete().in('id', [orgA, orgB]);
    await supabaseAdmin.auth.admin.deleteUser(userA);
    await supabaseAdmin.auth.admin.deleteUser(userB);
  });
});
```

### Cross-Tenant Leak Detection Script

```sql
-- Run this periodically to find tables missing RLS
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('schema_migrations', 'plan_features', 'feature_flags') -- Known shared tables
  AND rowsecurity = false
ORDER BY tablename;
-- Any results here are potential security holes

-- Find tables with org_id but no RLS policies
SELECT t.tablename
FROM pg_tables t
JOIN information_schema.columns c
  ON c.table_name = t.tablename AND c.column_name = 'org_id'
LEFT JOIN pg_policies p
  ON p.tablename = t.tablename
WHERE t.schemaname = 'public'
  AND p.policyname IS NULL;
-- These tables have org_id but NO policies — data is exposed
```

### Multi-Tenant Test Fixtures

```typescript
// test/fixtures/tenant.ts
export async function createTestTenant(name: string) {
  const { data: org } = await supabaseAdmin
    .from('orgs')
    .insert({ name, slug: name.toLowerCase().replace(/\s/g, '-') })
    .select()
    .single();

  const { data: userData } = await supabaseAdmin.auth.admin.createUser({
    email: `owner@${org!.slug}.test`,
    password: 'test1234',
    email_confirm: true,
  });

  await supabaseAdmin.from('org_members').insert({
    org_id: org!.id,
    user_id: userData.user!.id,
    role: 'owner',
  });

  return {
    org: org!,
    owner: userData.user!,
    async asUser() {
      const client = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );
      await client.auth.signInWithPassword({
        email: `owner@${org!.slug}.test`,
        password: 'test1234',
      });
      return client;
    },
    async cleanup() {
      await supabaseAdmin.from('org_members').delete().eq('org_id', org!.id);
      await supabaseAdmin.from('orgs').delete().eq('id', org!.id);
      await supabaseAdmin.auth.admin.deleteUser(userData.user!.id);
    },
  };
}

// Usage:
// const tenantA = await createTestTenant('Acme Corp');
// const tenantB = await createTestTenant('Globex Inc');
// const clientA = await tenantA.asUser();
// const clientB = await tenantB.asUser();
// ... run cross-tenant tests ...
// await tenantA.cleanup();
// await tenantB.cleanup();
```

---

## Quick Reference

### New Table Checklist

| Step | SQL |
|------|-----|
| Add `org_id` | `org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE` |
| Index it | `CREATE INDEX idx_<table>_org_id ON <table>(org_id)` |
| Enable RLS | `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY` |
| SELECT policy | `FOR SELECT USING (org_id IN (SELECT auth.user_org_ids()))` |
| INSERT policy | `FOR INSERT WITH CHECK (org_id IN (SELECT auth.user_org_ids()))` |
| UPDATE policy | `FOR UPDATE USING (... AND role IN ('owner','admin','member'))` |
| DELETE policy | `FOR DELETE USING (... AND role IN ('owner','admin'))` |

### Key Rules

| Rule | Why |
|------|-----|
| Never trust client-supplied `org_id` | Attacker can send any UUID |
| Always add `org_id` filter even with RLS | Defense-in-depth |
| Use `anon` key for user requests | Respects RLS |
| Use `service_role` only for webhooks/cron | Bypasses ALL RLS |
| Cookie domain starts with `.` | Required for subdomain sharing |
| `JWT_SECRET` must match across all apps | Or child apps reject tokens |
| Test RLS with real user sessions | Service role bypasses RLS, so testing with it proves nothing |

### service_role vs anon Key Decision

```
Is there an authenticated user making this request?
├── YES → Use anon key + user's JWT (RLS active)
└── NO → Who is calling?
    ├── Stripe webhook → service_role (no user context)
    ├── Cron job → service_role
    ├── Admin panel → service_role with explicit org_id filters
    └── Background worker → service_role with explicit org_id filters
```
