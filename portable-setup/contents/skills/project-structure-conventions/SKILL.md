---
name: project-structure-conventions
description: File organization, feature folders vs layer folders, and module boundaries. Use when starting a new project, deciding where new code should live, or refactoring a messy codebase structure.
---

# Project Structure Conventions

Organize your codebase for clarity, scalability, and team productivity.

## When to Use This Skill

Use when:
- Starting a new project
- Refactoring a messy codebase
- Onboarding team members
- Deciding where new code should live
- Scaling from small to large project

## Next.js App Router Structure

### Small Project (< 10 routes)
```
project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── api/
│       └── posts/
│           └── route.ts
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── post-card.tsx
├── lib/
│   ├── utils.ts
│   └── db.ts
├── hooks/
│   └── use-media-query.ts
└── types/
    └── index.ts
```

### Medium Project (10-50 routes)
```
project/
├── app/
│   ├── (marketing)/        # Route group - shared layout
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── pricing/
│   │   └── contact/
│   ├── (dashboard)/        # Different layout
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── settings/
│   │   └── projects/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   └── api/
│       ├── auth/
│       ├── users/
│       └── projects/
├── components/
│   ├── ui/                 # Design system primitives
│   ├── layouts/            # Layout components
│   ├── forms/              # Form components
│   └── shared/             # Shared feature components
├── features/               # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   └── types.ts
│   ├── projects/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   └── types.ts
│   └── users/
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   └── queries/
│   ├── auth/
│   └── utils/
├── hooks/
├── stores/
└── types/
```

### Large Project (50+ routes)
```
project/
├── app/                    # Routing only - minimal logic
│   ├── (public)/
│   ├── (authenticated)/
│   │   ├── (workspace)/
│   │   └── (settings)/
│   └── api/
├── modules/                # Feature modules (co-located)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   ├── hooks/
│   │   │   └── use-auth.ts
│   │   ├── actions/
│   │   │   ├── login.ts
│   │   │   └── signup.ts
│   │   ├── lib/
│   │   │   └── session.ts
│   │   ├── types.ts
│   │   └── index.ts        # Public exports
│   ├── billing/
│   ├── projects/
│   ├── teams/
│   └── analytics/
├── packages/               # Shared packages (can extract to npm)
│   ├── ui/                 # Design system
│   │   ├── src/
│   │   └── package.json
│   ├── utils/
│   └── config/
├── infrastructure/         # Cross-cutting concerns
│   ├── database/
│   ├── email/
│   ├── storage/
│   └── monitoring/
└── types/                  # Shared types
```

## Feature Module Pattern

### Co-located Feature Structure
```
features/projects/
├── components/
│   ├── project-card.tsx
│   ├── project-list.tsx
│   ├── project-form.tsx
│   └── project-settings.tsx
├── hooks/
│   ├── use-project.ts
│   ├── use-projects.ts
│   └── use-project-mutations.ts
├── actions/
│   ├── create-project.ts
│   ├── update-project.ts
│   └── delete-project.ts
├── lib/
│   ├── queries.ts
│   └── validations.ts
├── types.ts
└── index.ts                # Barrel file - public API
```

### Barrel File (index.ts)
```typescript
// features/projects/index.ts
// Only export what other modules need

// Components
export { ProjectCard } from './components/project-card';
export { ProjectList } from './components/project-list';
export { ProjectForm } from './components/project-form';

// Hooks
export { useProject, useProjects } from './hooks';

// Actions
export { createProject, updateProject, deleteProject } from './actions';

// Types
export type { Project, CreateProjectInput, UpdateProjectInput } from './types';
```

## Naming Conventions

### Files
```
# Components - PascalCase or kebab-case
Button.tsx          ← PascalCase
user-profile.tsx    ← kebab-case (preferred for Next.js)

# Hooks - camelCase with 'use' prefix
useAuth.ts
use-media-query.ts

# Utilities - camelCase or kebab-case
formatDate.ts
string-utils.ts

# Types - camelCase or kebab-case
user.types.ts
api-responses.ts

# Constants - camelCase or SCREAMING_SNAKE_CASE
config.ts
API_ENDPOINTS.ts

# Server Actions - kebab-case with verb
create-user.ts
update-settings.ts
```

### Components
```typescript
// Component file: user-profile.tsx
export function UserProfile() { }  // Named export, PascalCase

// Or for pages: page.tsx
export default function ProfilePage() { }  // Default export for pages

// Component with props type
interface UserProfileProps {
  userId: string;
  showAvatar?: boolean;
}

export function UserProfile({ userId, showAvatar = true }: UserProfileProps) { }
```

### Hooks
```typescript
// Hook file: use-user.ts
export function useUser(userId: string) {
  // Always returns object for forward compatibility
  return { user, isLoading, error };
}

// Multiple hooks in one file: hooks.ts or use-project.ts
export function useProject(id: string) { }
export function useProjects(filters?: ProjectFilters) { }
export function useProjectMutations() { }
```

### Types
```typescript
// types.ts or types/user.ts

// Entity types - noun
export interface User { }
export interface Project { }

// Input types - EntityInput or CreateEntity/UpdateEntity
export interface CreateUserInput { }
export interface UpdateUserInput { }
export type UserInput = CreateUserInput | UpdateUserInput;

// Response types - EntityResponse or with purpose
export interface UserResponse { }
export interface PaginatedResponse<T> { }

// Props types - ComponentNameProps
export interface UserCardProps { }
export interface ButtonProps { }

// State types - EntityState or FeatureState
export interface AuthState { }
export interface UIState { }
```

## Import Organization

### Import Order
```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 2. Third-party libraries
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

// 3. Internal modules (absolute imports)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { formatDate } from '@/lib/utils';

// 4. Relative imports (same feature/module)
import { ProjectCard } from './project-card';
import type { Project } from './types';

// 5. Types (if separate)
import type { User } from '@/types';

// 6. Styles (if any)
import styles from './styles.module.css';
```

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/features/*": ["features/*"],
      "@/types/*": ["types/*"],
      "@/hooks/*": ["hooks/*"]
    }
  }
}
```

## Common Directories

### `/lib` - Utilities and Services
```
lib/
├── utils/
│   ├── format.ts        # formatDate, formatCurrency, etc.
│   ├── string.ts        # slugify, truncate, etc.
│   └── index.ts
├── db/
│   ├── client.ts        # Database client
│   ├── schema.ts        # Database schema
│   └── migrations/
├── auth/
│   ├── session.ts
│   └── permissions.ts
├── email/
│   ├── client.ts
│   └── templates/
└── api/
    └── client.ts        # API client for external services
```

### `/components/ui` - Design System
```
components/ui/
├── button.tsx
├── button.test.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── textarea.tsx
├── toast.tsx
├── tooltip.tsx
└── index.ts             # Re-export all
```

### `/hooks` - Shared Hooks
```
hooks/
├── use-debounce.ts
├── use-local-storage.ts
├── use-media-query.ts
├── use-on-click-outside.ts
├── use-intersection-observer.ts
└── index.ts
```

### `/stores` - Global State (Zustand)
```
stores/
├── ui-store.ts          # Theme, sidebar, modals
├── auth-store.ts        # Auth state (if not using context)
└── index.ts
```

## Route Organization

### Route Groups
```
app/
├── (marketing)/         # Public pages
│   ├── layout.tsx       # Marketing layout
│   ├── page.tsx         # Home
│   ├── about/
│   ├── pricing/
│   └── blog/
├── (auth)/              # Auth pages (different layout)
│   ├── layout.tsx       # Minimal layout
│   ├── login/
│   ├── signup/
│   └── forgot-password/
├── (dashboard)/         # Authenticated pages
│   ├── layout.tsx       # Dashboard layout
│   ├── page.tsx         # Dashboard home
│   ├── projects/
│   │   ├── page.tsx     # List
│   │   ├── new/
│   │   │   └── page.tsx # Create
│   │   └── [id]/
│   │       ├── page.tsx # View/Edit
│   │       └── settings/
│   └── settings/
└── api/
    └── [...route]/      # API routes
```

### Private Folders
```
app/
├── dashboard/
│   ├── _components/     # Not a route, just organization
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   ├── _lib/            # Dashboard-specific utilities
│   │   └── helpers.ts
│   └── page.tsx
```

## Module Boundaries

### What Stays Together
```
✅ Co-locate when:
- Used by single feature
- Changes together
- Same domain concept

features/billing/
├── components/         # Billing UI
├── hooks/             # Billing data fetching
├── actions/           # Billing mutations
├── lib/               # Billing utilities
└── types.ts           # Billing types
```

### What Stays Separate
```
✅ Separate when:
- Reused across features
- Infrastructure concern
- Could be extracted to package

lib/
├── stripe/            # Payment infrastructure
├── email/             # Email service
└── utils/             # Generic utilities

components/ui/         # Design system (reused everywhere)
```

## Decision Guide

```
Where does this code belong?

Is it a UI primitive (button, input, card)?
├─ Yes → components/ui/
└─ No ↓

Is it used by only one feature?
├─ Yes → features/[feature]/
│         └─ components/, hooks/, actions/, lib/
└─ No ↓

Is it infrastructure (db, email, storage)?
├─ Yes → lib/[service]/ or infrastructure/
└─ No ↓

Is it a shared utility?
├─ Yes → lib/utils/
└─ No ↓

Is it a shared React hook?
├─ Yes → hooks/
└─ No ↓

Is it a shared type?
├─ Yes → types/ (if used across features)
│       or feature/types.ts (if feature-specific)
└─ No → Ask yourself again what it is
```

## Anti-Patterns

```typescript
// ❌ Deeply nested folders
src/components/features/dashboard/widgets/charts/bar/variants/horizontal.tsx

// ✅ Flatter structure
features/dashboard/components/horizontal-bar-chart.tsx

// ❌ Unclear naming
components/Card2.tsx
components/NewButton.tsx
hooks/useStuff.ts

// ✅ Descriptive naming
components/project-card.tsx
components/submit-button.tsx
hooks/use-project-mutations.ts

// ❌ Circular dependencies
features/users imports from features/projects
features/projects imports from features/users

// ✅ Extract shared code
features/users → lib/shared
features/projects → lib/shared
```
