---
name: monorepo-patterns
description: Manage multiple packages in one repo with shared code, coordinated builds, and clean dependency boundaries using Turborepo or pnpm workspaces. Use when setting up a monorepo, migrating from multi-repo, or sharing code between apps.
---

# Monorepo Patterns

Comprehensive patterns for monorepo architecture using Turborepo, pnpm workspaces, and best practices for multi-package projects.

## When to Use This Skill

Use this skill when:
- Setting up a new monorepo
- Migrating from multiple repos to monorepo
- Configuring build pipelines for monorepos
- Sharing code between packages
- Managing dependencies across packages
- Optimizing CI/CD for monorepos

## Turborepo Setup

### Installation

```bash
# Create new monorepo
npx create-turbo@latest

# Add to existing project
npm install turbo --save-dev
```

### Project Structure

```
my-monorepo/
├── apps/
│   ├── web/              # Next.js app
│   │   └── package.json
│   ├── api/              # Express/Fastify API
│   │   └── package.json
│   └── mobile/           # React Native
│       └── package.json
├── packages/
│   ├── ui/               # Shared UI components
│   │   └── package.json
│   ├── config/           # Shared configs
│   │   ├── eslint/
│   │   └── typescript/
│   ├── database/         # Database client
│   │   └── package.json
│   └── utils/            # Shared utilities
│       └── package.json
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### Root package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### turbo.json Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### pnpm Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Package Configuration

### Shared UI Package

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx"
  },
  "scripts": {
    "lint": "eslint src/",
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

```typescript
// packages/ui/src/index.ts
export { Button } from './button';
export { Card } from './card';
export type { ButtonProps, CardProps } from './types';
```

### TypeScript Config Package

```json
// packages/config/typescript/package.json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": ["base.json", "nextjs.json", "react-library.json"]
}
```

```json
// packages/config/typescript/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

```json
// packages/config/typescript/nextjs.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  }
}
```

### App Configuration

```json
// apps/web/package.json
{
  "name": "@repo/web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/database": "workspace:*",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*"
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Shared Database Package

```typescript
// packages/database/src/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';
```

```json
// packages/database/package.json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  }
}
```

## Task Filtering

```bash
# Run in specific packages
turbo build --filter=@repo/web
turbo build --filter=@repo/web...   # Include dependencies
turbo build --filter=...@repo/web   # Include dependents

# Filter by directory
turbo build --filter=./apps/*
turbo build --filter=./packages/*

# Filter by changes (for CI)
turbo build --filter=[HEAD^1]
turbo build --filter=[origin/main...HEAD]
```

## Remote Caching

### Vercel Remote Cache

```bash
# Link to Vercel
npx turbo login
npx turbo link

# Or use environment variables
export TURBO_TOKEN=your_token
export TURBO_TEAM=your_team
```

### Self-Hosted Cache

```json
// turbo.json
{
  "remoteCache": {
    "signature": true
  }
}
```

## GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Test
        run: pnpm test

      - name: Lint
        run: pnpm lint
```

### Affected-Only CI

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Build affected packages
        run: pnpm turbo build --filter=[origin/main...HEAD]
```

## Internal Packages Pattern

```typescript
// packages/utils/src/index.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateId(): string {
  return Math.random().toString(36).slice(2);
}
```

```json
// packages/utils/package.json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src/"
  }
}
```

Usage in apps:

```typescript
// apps/web/src/app/page.tsx
import { formatDate, generateId } from '@repo/utils';
import { Button } from '@repo/ui';

export default function Page() {
  return (
    <div>
      <p>Today: {formatDate(new Date())}</p>
      <Button>Click me</Button>
    </div>
  );
}
```

## Environment Variables

### Shared .env handling

```
# .env (root - shared)
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# apps/web/.env.local (app-specific)
NEXT_PUBLIC_API_URL="https://api.example.com"
```

```json
// turbo.json
{
  "globalEnv": ["DATABASE_URL", "REDIS_URL"],
  "pipeline": {
    "build": {
      "env": ["NEXT_PUBLIC_*"]
    }
  }
}
```

## Best Practices

1. **Use workspace protocol** - `workspace:*` for internal deps
2. **Minimize shared deps** - Put most deps in apps
3. **Use consistent versioning** - Same React version everywhere
4. **Cache strategically** - Configure outputs correctly
5. **Filter in CI** - Only build what changed
6. **Shared configs** - ESLint, TypeScript, Prettier

## Common Commands

```bash
# Development
pnpm dev                     # All apps
pnpm dev --filter=@repo/web  # Specific app

# Building
pnpm build
pnpm build --filter=@repo/web...  # With dependencies

# Adding dependencies
pnpm add lodash --filter=@repo/web
pnpm add -D typescript --filter=@repo/ui

# Workspace-wide
pnpm add -w -D turbo
```

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Nx Documentation](https://nx.dev/getting-started/intro)
