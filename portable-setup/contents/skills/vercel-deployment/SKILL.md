---
name: vercel-deployment
description: Deploys applications to Vercel with CLI, environment configuration, preview deployments, and production releases; use when deploying Next.js, React, or any frontend to Vercel
---

# Vercel Deployment

Comprehensive guide for deploying applications to Vercel with CLI commands, environment configuration, GitHub integration, and production best practices.

## When to Use This Skill

Use this skill when:
- Deploying applications to Vercel platform
- Setting up CI/CD with Vercel and GitHub Actions
- Configuring environment variables and secrets
- Managing preview and production deployments
- Setting up custom domains and SSL
- Configuring monorepo deployments
- Implementing deployment protection

## CLI Installation

```bash
# Install globally via npm
npm install -g vercel

# Or via pnpm
pnpm add -g vercel

# Login to Vercel
vercel login
```

## Basic Deployment Commands

### Deploy to Preview

```bash
# Deploy current directory
vercel

# Deploy specific path
vercel ./my-app

# Capture deployment URL
vercel > deployment-url.txt
```

### Deploy to Production

```bash
# Deploy directly to production
vercel --prod

# Deploy with specific target
vercel deploy --target=production
```

### Staged Deployments

```bash
# Deploy to production without domain assignment (for review)
vercel --prod --skip-domain

# Promote staged deployment to production
vercel promote [deployment-id-or-url]
```

## Project Setup

### Initialize New Project

```bash
# Create new project interactively
vercel

# Create empty project
vercel project add

# Link existing directory to project
vercel link
```

### Link to Existing Project

```bash
vercel
# ? Set up and deploy "~/web/my-project"? [Y/n] y
# ? Which scope do you want to deploy to? My Team
# ? Link to existing project? [y/N] y
# ? What's the name of your existing project? my-project
```

## Environment Variables

### Set Variables via CLI

```bash
# Add environment variable
vercel env add MY_API_KEY

# Add to specific environment
vercel env add MY_KEY production
vercel env add MY_KEY preview
vercel env add MY_KEY development

# Pull environment variables locally
vercel env pull
vercel env pull .env.local

# Pull from specific environment
vercel pull --environment=preview
vercel pull --environment=production
```

### Environment-Specific Configuration

```bash
# Production variables
vercel env add DATABASE_URL production

# Preview variables (for PR deployments)
vercel env add DATABASE_URL preview

# Development (for local dev with `vercel dev`)
vercel env add DATABASE_URL development
```

## vercel.json Configuration

### Basic Configuration

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### Redirects and Rewrites

```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

### Headers Configuration

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "no-store" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### Functions Configuration

```json
{
  "functions": {
    "api/heavy-task.ts": {
      "memory": 1024,
      "maxDuration": 60
    },
    "api/**/*.ts": {
      "memory": 512,
      "maxDuration": 30
    }
  }
}
```

## GitHub Actions Integration

### Basic Deploy Workflow

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

### Production Deploy Workflow

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Production Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Deploy Without Project Linking

```bash
# Use environment variables instead of linking
VERCEL_ORG_ID=team_xxx VERCEL_PROJECT_ID=prj_xxx vercel deploy
```

## Custom Domains

### Add Domain via CLI

```bash
# Add domain to project
vercel domains add example.com

# List domains
vercel domains ls

# Remove domain
vercel domains rm example.com
```

### DNS Configuration

```bash
# Inspect domain DNS
vercel domains inspect example.com

# Verify domain ownership
vercel domains verify example.com
```

## Monorepo Configuration

### Root vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd ../.. && npm run build:web",
  "installCommand": "cd ../.. && npm install",
  "framework": "nextjs"
}
```

### Per-App Configuration

Set root directory in Vercel Dashboard or via CLI:

```bash
# Deploy specific app from monorepo
vercel --cwd apps/web
```

### Turborepo Integration

```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=web",
  "installCommand": "npm install"
}
```

## Preview Deployments

### Branch-Based Previews

Vercel automatically creates preview deployments for:
- Pull requests
- Non-production branches

### Preview URL Pattern

```
https://<project>-<unique-hash>-<team>.vercel.app
https://<project>-git-<branch>-<team>.vercel.app
```

### Deployment Protection

```json
{
  "deploymentProtection": {
    "system": "vercel-authentication"
  }
}
```

## Deployment Retention

### Configure via CLI

```bash
# View retention policy
vercel list my-project --policy errored=6m

# Set retention policies in project settings
```

### Retention Configuration

```json
{
  "deploymentExpiration": {
    "expirationDays": 30,
    "expirationDaysProduction": 90,
    "expirationDaysCanceled": 7,
    "expirationDaysErrored": 14,
    "deploymentsToKeep": 5
  }
}
```

## Edge and Serverless Functions

### Edge Function

```typescript
// api/edge-function.ts
export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  return new Response('Hello from the Edge!');
}
```

### Serverless Function

```typescript
// api/serverless.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Hello from Serverless!' });
}
```

## Cron Jobs

### Configure Cron in vercel.json

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-task",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/hourly-check",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Cron Handler

```typescript
// api/cron/daily-task.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  // Your cron logic
  await performDailyTask();

  res.status(200).json({ success: true });
}
```

> **Note:** Cron jobs only run on production deployments, not previews.

## Debugging

### View Logs

```bash
# Stream logs
vercel logs <deployment-url>

# View build logs
vercel inspect <deployment-url>
```

### Local Development

```bash
# Run with Vercel environment
vercel dev

# Run with specific port
vercel dev --listen 3001
```

## Common CLI Commands Reference

```bash
# Project Management
vercel                    # Deploy
vercel --prod             # Deploy to production
vercel link               # Link to project
vercel unlink             # Unlink project

# Environment
vercel env add            # Add variable
vercel env rm             # Remove variable
vercel env pull           # Pull to local .env
vercel pull               # Pull project settings + env

# Domains
vercel domains add        # Add domain
vercel domains ls         # List domains
vercel domains rm         # Remove domain

# Deployments
vercel ls                 # List deployments
vercel inspect            # Inspect deployment
vercel logs               # View logs
vercel rollback           # Rollback to previous

# Development
vercel dev                # Local development
vercel build              # Build locally
```

## Best Practices

### Environment Variables
1. **Never commit secrets** - Use Vercel's environment variable system
2. **Use different values per environment** - Production, Preview, Development
3. **Pull locally** - Use `vercel env pull` for local development

### Deployments
1. **Use preview deployments** - Test PRs before merging
2. **Enable deployment protection** - Require authentication for previews
3. **Set up deployment notifications** - Slack/Discord webhooks

### Performance
1. **Enable caching** - Use Vercel's edge caching
2. **Optimize images** - Use Next.js Image or Vercel's image optimization
3. **Use Edge Functions** - For low-latency operations

### Security
1. **Use HTTPS only** - Automatic with Vercel
2. **Set security headers** - CSP, X-Frame-Options, etc.
3. **Protect sensitive routes** - Use middleware for auth

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Templates](https://vercel.com/templates)
