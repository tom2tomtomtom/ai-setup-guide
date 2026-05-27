---
name: environment-variables
description: Manage secrets and configuration safely across dev, staging, and production environments. Use when setting up API keys, validating env vars at startup, or configuring Docker and cloud deployments.
---

# Environment Variables Patterns

Comprehensive patterns for managing environment variables securely across different environments.

## When to Use This Skill

Use this skill when:
- Setting up project configuration
- Managing secrets securely
- Configuring different environments
- Validating environment variables
- Working with Docker/containers
- Deploying to cloud platforms

## Basic Setup with dotenv

### Installation

```bash
npm install dotenv
```

### Project Structure

```
project/
├── .env                  # Local development (git ignored)
├── .env.example          # Template (committed)
├── .env.local            # Local overrides (git ignored)
├── .env.development      # Development defaults
├── .env.production       # Production defaults
└── .env.test             # Test environment
```

### Loading Environment Variables

```typescript
// Load at application start
import 'dotenv/config';

// Or manually
import dotenv from 'dotenv';
dotenv.config();

// Load specific file
dotenv.config({ path: '.env.local' });
```

## Type-Safe Environment Variables with Zod

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Server-side only
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  API_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Public (available client-side in Next.js)
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
});

// Validate and export
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

// Type export for use elsewhere
export type Env = z.infer<typeof envSchema>;
```

### Usage

```typescript
import { env } from '@/lib/env';

// Type-safe access
const dbUrl = env.DATABASE_URL;
const port = env.PORT; // number, not string
const isDev = env.NODE_ENV === 'development';
```

## Next.js Environment Variables

### Built-in Support

```bash
# .env.local (git ignored, highest priority)
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET=my-super-secret-key

# Public variables (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

### Environment-Specific Files

```
.env                # Default, loaded in all environments
.env.local          # Local overrides (not in CI)
.env.development    # Development only
.env.production     # Production only
.env.test           # Test only
```

**Priority (highest first):**
1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (not in test)
4. `.env.$(NODE_ENV)`
5. `.env`

### Next.js Validation

```typescript
// next.config.js
const { z } = require('zod');

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
});

try {
  envSchema.parse(process.env);
} catch (err) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```

## T3 Env (Recommended for Next.js)

### Installation

```bash
npm install @t3-oss/env-nextjs zod
```

### Configuration

```typescript
// env.mjs
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

### Usage

```typescript
import { env } from '@/env.mjs';

// Server component
const db = new Database(env.DATABASE_URL);

// Client component (only client vars available)
const apiUrl = env.NEXT_PUBLIC_API_URL;
```

## Docker Environment Variables

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/app
    env_file:
      - .env.production

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-app}
```

### Dockerfile

```dockerfile
FROM node:20-alpine

# Build-time args
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Don't bake secrets into the image!
# Pass at runtime instead

WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build

CMD ["npm", "start"]
```

### Runtime Secrets

```yaml
# docker-compose.yml
services:
  app:
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true  # From docker secret create
```

## Cloud Platform Patterns

### Vercel

```bash
# Add via CLI
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Pull to local
vercel env pull .env.local
```

### Railway

```bash
# Add via CLI
railway variables set DATABASE_URL=xxx

# Reference other services
railway variables set REDIS_URL='${{Redis.REDIS_URL}}'
```

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
env:
  NODE_ENV: production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_API_URL: ${{ vars.NEXT_PUBLIC_API_URL }}
        run: npm run build
```

## Secret Rotation Pattern

```typescript
// lib/secrets.ts
interface Secret {
  current: string;
  previous?: string;
  rotatedAt?: Date;
}

export function parseRotatableSecret(envVar: string): Secret {
  const value = process.env[envVar];

  if (!value) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }

  // Support format: "current_secret|previous_secret"
  const [current, previous] = value.split('|');

  return {
    current: current.trim(),
    previous: previous?.trim(),
  };
}

// Usage: Verify with current, fall back to previous
export async function verifyToken(token: string) {
  const { current, previous } = parseRotatableSecret('JWT_SECRET');

  try {
    return jwt.verify(token, current);
  } catch {
    if (previous) {
      return jwt.verify(token, previous);
    }
    throw new Error('Invalid token');
  }
}
```

## .env.example Template

```bash
# .env.example
# Copy this file to .env.local and fill in the values

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
AUTH_SECRET= # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# External Services
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
RESEND_API_KEY=re_xxx

# Public (exposed to browser)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=MyApp
```

## Validation Script

```typescript
// scripts/check-env.ts
import { config } from 'dotenv';
import { z } from 'zod';

config();

const requiredVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'AUTH_SECRET',
  'STRIPE_SECRET_KEY',
];

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

```json
// package.json
{
  "scripts": {
    "check-env": "tsx scripts/check-env.ts",
    "predev": "npm run check-env",
    "prebuild": "npm run check-env"
  }
}
```

## Best Practices

1. **Never commit secrets** - Use `.gitignore` for `.env.local`
2. **Provide .env.example** - Document all required variables
3. **Validate at startup** - Fail fast if variables are missing
4. **Use type-safe access** - Zod or t3-env for validation
5. **Separate by environment** - Different values for dev/prod
6. **Prefix public vars** - `NEXT_PUBLIC_` for client exposure
7. **Rotate secrets** - Support multiple values during rotation

## Security Tips

- Never log environment variables
- Don't include in error messages
- Use secrets managers for production
- Rotate credentials regularly
- Limit scope (production vs development keys)

## Resources

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [T3 Env Documentation](https://env.t3.gg)
- [12 Factor App Config](https://12factor.net/config)
