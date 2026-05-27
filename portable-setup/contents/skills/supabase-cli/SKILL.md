---
name: supabase-cli
description: Manages Supabase projects via CLI for type generation, database migrations, local development, edge functions, and schema operations. Use when regenerating TypeScript types, creating migrations, running local Supabase, deploying edge functions, or managing database schema changes.
---

# Supabase CLI Operations

Manage Supabase projects from the command line: type generation, migrations, local dev, edge functions, and database operations. This skill covers CLI workflows, not the Supabase JS client SDK (see `supabase-patterns` for that).

## When to Use This Skill

- Regenerating TypeScript types after schema changes
- Creating or applying database migrations
- Running Supabase locally with `supabase start`
- Deploying or testing edge functions
- Resetting or seeding the local database
- Linking a project to a remote Supabase instance
- Diffing local schema changes into migration files
- Debugging migration or type generation issues

## Core Philosophy

**Types are the contract between your database and your code.** Every schema change must flow through: migrate -> push -> regenerate types -> build. Skip a step and you get runtime errors that TypeScript should have caught.

**Local-first development.** Run Supabase locally, make schema changes, diff them into migrations, push to remote. Never edit production directly.

---

## Project Setup

### Initialize and Link

```bash
# Initialize Supabase in an existing project
supabase init

# Link to remote project (get ref from dashboard URL)
supabase link --project-ref <project-ref>

# Check status
supabase status
```

### Local Development

```bash
# Start local Supabase (Postgres, Auth, Storage, Edge Functions)
supabase start

# Stop local Supabase
supabase stop

# Reset local database (re-runs all migrations + seed)
supabase db reset

# View local dashboard
# Default: http://localhost:54323
```

**Local URLs (defaults):**
| Service | URL |
|---------|-----|
| Studio | http://localhost:54323 |
| API | http://localhost:54321 |
| DB | postgresql://postgres:postgres@localhost:54322/postgres |
| Inbucket (email) | http://localhost:54324 |

---

## Type Generation

**This is the most critical CLI operation.** Types must be regenerated after every schema change.

### Generate Types from Remote

```bash
# Standard command (outputs to src/types/database.ts)
npx supabase gen types typescript --project-id <project-ref> > src/types/database.ts
```

### Generate Types from Local

```bash
# From local running instance
npx supabase gen types typescript --local > src/types/database.ts
```

### AIDEN Project Rules

- **`src/types/database.ts`** is auto-generated. NEVER edit it manually.
- **`src/types/custom.ts`** is for manual type definitions, extensions, and helpers.
- New tables won't appear in types until you regenerate. If you need to use them before regenerating, cast with `(supabase as any)`.
- **Always check `database.ts` for actual FK column names.** Example: `ad_library_tags` uses `ad_id` (not `ad_library_id`).
- **Always `npm run build` after regenerating** to catch any type mismatches.

### Type Generation Pipeline

```bash
# Full pipeline after schema changes
supabase db push                                                    # Push migration to remote
npx supabase gen types typescript --project-id <ref> > src/types/database.ts  # Regen types
npm run build                                                       # Verify no type errors
```

---

## Migrations

### Create Migration from Local Changes

```bash
# Make schema changes locally (via Studio or SQL)
# Then diff to create a migration file
supabase db diff -f <migration-name>

# Creates: supabase/migrations/<timestamp>_<migration-name>.sql
```

### Create Empty Migration

```bash
# Create a blank migration file to write manually
supabase migration new <migration-name>
```

### Apply Migrations

```bash
# Push migrations to remote database
supabase db push

# Push with dry run (see what would change)
supabase db push --dry-run

# Reset local and replay all migrations
supabase db reset
```

### Migration Workflow (End-to-End)

```bash
# 1. Start local Supabase
supabase start

# 2. Make schema changes (via Studio UI or direct SQL)

# 3. Generate migration from diff
supabase db diff -f add-clients-table

# 4. Review the generated SQL
cat supabase/migrations/*_add-clients-table.sql

# 5. Test locally (reset replays all migrations)
supabase db reset

# 6. Push to remote
supabase db push

# 7. Regenerate types
npx supabase gen types typescript --project-id <ref> > src/types/database.ts

# 8. Build to verify
npm run build
```

### Seed Data

```bash
# Edit seed file
# supabase/seed.sql

# Apply seed (runs after migrations on db reset)
supabase db reset
```

**seed.sql example:**
```sql
-- Insert test data
INSERT INTO public.profiles (id, email, full_name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User');
```

---

## Edge Functions

### Create and Deploy

```bash
# Create new edge function
supabase functions new <function-name>
# Creates: supabase/functions/<function-name>/index.ts

# Deploy single function
supabase functions deploy <function-name>

# Deploy all functions
supabase functions deploy

# Test locally
supabase functions serve <function-name>
```

### Set Function Secrets

```bash
# Set secrets for edge functions
supabase secrets set MY_SECRET=value

# List secrets
supabase secrets list

# Unset
supabase secrets unset MY_SECRET
```

### Edge Function Template

```typescript
// supabase/functions/my-function/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { name } = await req.json()

  return new Response(
    JSON.stringify({ message: `Hello ${name}!` }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

---

## Database Operations

### Direct SQL

```bash
# Run SQL against remote database
supabase db execute --sql "SELECT count(*) FROM auth.users"

# Run SQL file
supabase db execute --file ./scripts/fix-data.sql
```

### Dump and Restore

```bash
# Dump remote database schema
supabase db dump -f schema.sql

# Dump with data
supabase db dump -f dump.sql --data-only

# Dump specific schema
supabase db dump -f auth_schema.sql --schema auth
```

### Inspect Database

```bash
# List all tables
supabase db inspect --table-sizes

# Check index usage
supabase db inspect --index-usage

# Check cache hit rate
supabase db inspect --cache-hit
```

---

## Multi-Project Management

```bash
# Link to different projects
supabase link --project-ref <project-ref-a>

# Generate types for specific project (without relinking)
npx supabase gen types typescript --project-id <project-ref-b> > src/types/database.ts
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `supabase init` | Initialize project |
| `supabase link --project-ref <ref>` | Link to remote |
| `supabase start` | Start local instance |
| `supabase stop` | Stop local instance |
| `supabase db diff -f <name>` | Generate migration from changes |
| `supabase db push` | Push migrations to remote |
| `supabase db push --dry-run` | Preview migration push |
| `supabase db reset` | Reset local DB (migrations + seed) |
| `supabase migration new <name>` | Create empty migration |
| `npx supabase gen types typescript --project-id <ref> > src/types/database.ts` | Regenerate types |
| `supabase functions new <name>` | Create edge function |
| `supabase functions deploy <name>` | Deploy edge function |
| `supabase functions serve <name>` | Test function locally |
| `supabase secrets set KEY=value` | Set function secret |
| `supabase status` | Check local status |

## Execution Notes

- Always regenerate types after any schema change. The pipeline is: migrate -> push -> regen types -> build.
- When a table isn't in `database.ts` yet, use `(supabase as any)` as a temporary workaround, but regenerate types as soon as possible.
- Never trust FK column names from memory. Always verify in `database.ts`.
- The `--dry-run` flag on `db push` is your safety net. Use it before pushing to production.
- `supabase db reset` destroys all local data. It's for development only.
- Edge functions use Deno, not Node.js. Imports use URL-based modules.
