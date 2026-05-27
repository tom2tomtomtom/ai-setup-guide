---
name: feature-flags
description: Build feature flag systems with LaunchDarkly, Flagsmith, or custom toggles -- SDK setup, percentage rollouts, A/B splits, user targeting rules, and flag lifecycle cleanup; use when shipping features to a subset of users or running gradual releases
---

# Feature Flags Patterns

Comprehensive patterns for implementing feature flags using LaunchDarkly, Flagsmith, and custom solutions.

## When to Use This Skill

Use this skill when:
- Rolling out features gradually
- A/B testing functionality
- Implementing kill switches
- Managing environment-specific features
- Enabling features for specific users
- Testing in production safely

## LaunchDarkly

### Installation

```bash
npm install @launchdarkly/node-server-sdk
npm install @launchdarkly/react-client-sdk  # For React
```

### Server-Side Setup

```typescript
// lib/launchdarkly.ts
import * as LaunchDarkly from '@launchdarkly/node-server-sdk';

let ldClient: LaunchDarkly.LDClient | null = null;

export async function getLDClient(): Promise<LaunchDarkly.LDClient> {
  if (ldClient) return ldClient;

  ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!);
  await ldClient.waitForInitialization();
  return ldClient;
}

export async function getFlag<T>(
  flagKey: string,
  user: LaunchDarkly.LDContext,
  defaultValue: T
): Promise<T> {
  const client = await getLDClient();
  return client.variation(flagKey, user, defaultValue);
}

// User context helper
export function createLDContext(user: {
  id: string;
  email?: string;
  plan?: string;
  country?: string;
}): LaunchDarkly.LDContext {
  return {
    kind: 'user',
    key: user.id,
    email: user.email,
    custom: {
      plan: user.plan,
      country: user.country,
    },
  };
}
```

### Usage in API Routes

```typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFlag, createLDContext } from '@/lib/launchdarkly';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await auth();

  const context = createLDContext({
    id: session?.user?.id || 'anonymous',
    email: session?.user?.email,
    plan: session?.user?.plan,
  });

  const newFeatureEnabled = await getFlag('new-feature', context, false);

  if (newFeatureEnabled) {
    return NextResponse.json({ feature: 'new' });
  }

  return NextResponse.json({ feature: 'old' });
}
```

### React Client-Side

```tsx
// providers/launchdarkly.tsx
'use client';

import { LDProvider } from '@launchdarkly/react-client-sdk';

export function LaunchDarklyProvider({ children }: { children: React.ReactNode }) {
  return (
    <LDProvider
      clientSideID={process.env.NEXT_PUBLIC_LD_CLIENT_ID!}
      context={{
        kind: 'user',
        key: 'anonymous',
      }}
    >
      {children}
    </LDProvider>
  );
}
```

```tsx
// components/FeatureComponent.tsx
'use client';

import { useFlags, useLDClient } from '@launchdarkly/react-client-sdk';

export function FeatureComponent() {
  const flags = useFlags();
  const ldClient = useLDClient();

  // Update context when user logs in
  const handleLogin = async (user: User) => {
    await ldClient?.identify({
      kind: 'user',
      key: user.id,
      email: user.email,
      custom: { plan: user.plan },
    });
  };

  if (flags.newDashboard) {
    return <NewDashboard />;
  }

  return <OldDashboard />;
}
```

## Flagsmith

### Installation

```bash
npm install flagsmith-nodejs  # Server
npm install flagsmith         # Client
```

### Server-Side

```typescript
// lib/flagsmith.ts
import Flagsmith from 'flagsmith-nodejs';

const flagsmith = new Flagsmith({
  environmentKey: process.env.FLAGSMITH_SERVER_KEY!,
});

export async function getFlags(userId?: string) {
  if (userId) {
    return flagsmith.getIdentityFlags(userId);
  }
  return flagsmith.getEnvironmentFlags();
}

export async function hasFeature(
  featureName: string,
  userId?: string
): Promise<boolean> {
  const flags = await getFlags(userId);
  return flags.isFeatureEnabled(featureName);
}

export async function getFeatureValue<T>(
  featureName: string,
  userId?: string
): Promise<T | undefined> {
  const flags = await getFlags(userId);
  return flags.getFeatureValue(featureName) as T;
}
```

### React Client-Side

```tsx
// providers/flagsmith.tsx
'use client';

import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith';

export function FlagsmithClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <FlagsmithProvider
      options={{
        environmentID: process.env.NEXT_PUBLIC_FLAGSMITH_ENV_ID!,
      }}
      flagsmith={flagsmith}
    >
      {children}
    </FlagsmithProvider>
  );
}
```

```tsx
// components/Feature.tsx
'use client';

import { useFlags, useFlagsmith } from 'flagsmith/react';

export function Feature() {
  const flags = useFlags(['new_feature', 'feature_value']);
  const flagsmith = useFlagsmith();

  // Identify user
  const identify = async (userId: string) => {
    await flagsmith.identify(userId);
  };

  if (flags.new_feature.enabled) {
    return <NewFeature config={flags.feature_value.value} />;
  }

  return <OldFeature />;
}
```

## Custom Solution (Database-backed)

### Schema

```typescript
// prisma/schema.prisma
model FeatureFlag {
  id          String   @id @default(cuid())
  key         String   @unique
  name        String
  description String?
  enabled     Boolean  @default(false)
  percentage  Int      @default(100) // Rollout percentage
  rules       Json?    // Targeting rules
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model FeatureFlagOverride {
  id        String   @id @default(cuid())
  flagKey   String
  userId    String
  enabled   Boolean
  createdAt DateTime @default(now())

  @@unique([flagKey, userId])
}
```

### Feature Flag Service

```typescript
// lib/feature-flags.ts
import { prisma } from '@/lib/prisma';

interface User {
  id: string;
  email?: string;
  plan?: string;
  createdAt?: Date;
}

export async function isFeatureEnabled(
  flagKey: string,
  user?: User
): Promise<boolean> {
  // Check for user-specific override first
  if (user) {
    const override = await prisma.featureFlagOverride.findUnique({
      where: {
        flagKey_userId: {
          flagKey,
          userId: user.id,
        },
      },
    });

    if (override) {
      return override.enabled;
    }
  }

  // Get flag configuration
  const flag = await prisma.featureFlag.findUnique({
    where: { key: flagKey },
  });

  if (!flag || !flag.enabled) {
    return false;
  }

  // Check percentage rollout
  if (flag.percentage < 100 && user) {
    const hash = simpleHash(user.id + flagKey);
    const bucket = hash % 100;
    if (bucket >= flag.percentage) {
      return false;
    }
  }

  // Check targeting rules
  if (flag.rules && user) {
    return evaluateRules(flag.rules as Rule[], user);
  }

  return true;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface Rule {
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'gte' | 'lte';
  value: unknown;
}

function evaluateRules(rules: Rule[], user: User): boolean {
  return rules.every((rule) => {
    const userValue = user[rule.field as keyof User];

    switch (rule.operator) {
      case 'equals':
        return userValue === rule.value;
      case 'contains':
        return String(userValue).includes(String(rule.value));
      case 'in':
        return (rule.value as unknown[]).includes(userValue);
      case 'gte':
        return Number(userValue) >= Number(rule.value);
      case 'lte':
        return Number(userValue) <= Number(rule.value);
      default:
        return false;
    }
  });
}
```

### Caching Layer

```typescript
// lib/feature-flags-cached.ts
import { Redis } from '@upstash/redis';
import { isFeatureEnabled as checkFlag } from './feature-flags';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL = 60; // 1 minute

export async function isFeatureEnabled(
  flagKey: string,
  user?: { id: string }
): Promise<boolean> {
  const cacheKey = user
    ? `flag:${flagKey}:${user.id}`
    : `flag:${flagKey}`;

  // Check cache
  const cached = await redis.get<boolean>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Fetch from database
  const enabled = await checkFlag(flagKey, user);

  // Cache result
  await redis.set(cacheKey, enabled, { ex: CACHE_TTL });

  return enabled;
}

// Invalidate cache when flag changes
export async function invalidateFlag(flagKey: string) {
  const keys = await redis.keys(`flag:${flagKey}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
  await redis.del(`flag:${flagKey}`);
}
```

### React Hook

```tsx
// hooks/useFeatureFlag.ts
'use client';

import { useEffect, useState } from 'react';

export function useFeatureFlag(flagKey: string, defaultValue = false) {
  const [enabled, setEnabled] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlag() {
      try {
        const response = await fetch(`/api/flags/${flagKey}`);
        const { enabled } = await response.json();
        setEnabled(enabled);
      } catch (error) {
        console.error('Failed to fetch flag:', error);
        setEnabled(defaultValue);
      } finally {
        setLoading(false);
      }
    }

    checkFlag();
  }, [flagKey, defaultValue]);

  return { enabled, loading };
}

// Usage
function MyComponent() {
  const { enabled, loading } = useFeatureFlag('new-feature');

  if (loading) return <Skeleton />;
  if (!enabled) return <OldFeature />;

  return <NewFeature />;
}
```

## Patterns

### Conditional Rendering

```tsx
// Simple conditional
{flag && <NewFeature />}

// With fallback
{flag ? <NewFeature /> : <OldFeature />}

// Component wrapper
function Feature({ flag, children, fallback }) {
  const { enabled } = useFeatureFlag(flag);
  return enabled ? children : fallback;
}

<Feature flag="new-dashboard" fallback={<OldDashboard />}>
  <NewDashboard />
</Feature>
```

### Server Component Feature Flag

```tsx
// app/page.tsx
import { isFeatureEnabled } from '@/lib/feature-flags';
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();
  const showNewUI = await isFeatureEnabled('new-ui', session?.user);

  if (showNewUI) {
    return <NewUI />;
  }

  return <OldUI />;
}
```

### Kill Switch Pattern

```typescript
// Wrap risky operations
async function processPayment(data: PaymentData) {
  const paymentsEnabled = await isFeatureEnabled('payments-enabled');

  if (!paymentsEnabled) {
    throw new Error('Payments are temporarily disabled');
  }

  return stripe.charges.create(data);
}
```

## Best Practices

1. **Use descriptive keys** - `enable-new-checkout` not `flag1`
2. **Set sensible defaults** - Fail closed (false) for new features
3. **Clean up old flags** - Remove after full rollout
4. **Cache flag values** - Don't hit the service on every request
5. **Log flag evaluations** - Track which flags affect which users
6. **Use percentage rollouts** - Gradually increase traffic

## Environment Variables

```bash
# LaunchDarkly
LAUNCHDARKLY_SDK_KEY=sdk-xxx
NEXT_PUBLIC_LD_CLIENT_ID=xxx

# Flagsmith
FLAGSMITH_SERVER_KEY=ser.xxx
NEXT_PUBLIC_FLAGSMITH_ENV_ID=xxx

# Custom (Redis cache)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

## Resources

- [LaunchDarkly Documentation](https://docs.launchdarkly.com)
- [Flagsmith Documentation](https://docs.flagsmith.com)
- [Feature Flags Best Practices](https://martinfowler.com/articles/feature-toggles.html)
