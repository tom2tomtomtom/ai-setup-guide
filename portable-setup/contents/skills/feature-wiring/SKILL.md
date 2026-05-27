---
name: feature-wiring
description: Connect all the layers when building a feature end-to-end, from UI through state, API, and database. Use when a form needs to write to the backend, you are unsure where logic belongs, or loading/error states need coordination across layers.
---

# Feature Wiring

Wire complete features end-to-end. Each recipe shows the full chain from UI to database and back — the "glue" between layers.

## When to Use This Skill

Use when:
- Building a new feature that spans UI, state, API, and database
- Connecting a form to a server action that writes to Supabase
- Wiring list/detail pages with filters, pagination, and caching
- Adding real-time updates to an existing feature
- Coordinating loading, error, and optimistic states across layers
- Unsure where logic belongs (client vs server, cache vs URL, action vs API route)

Cross-references: For deep dives into individual layers, see `form-handling-patterns`, `data-fetching-patterns`, `state-management-patterns`, `supabase-patterns`, `next-js-app-router`, `error-handling-patterns`.

---

# PART I: Feature Recipes

## 1. CRUD Feature

Full create/read/update/delete with optimistic updates.

### Data Flow
```
┌─────────┐    ┌──────────┐    ┌───────────────┐    ┌──────────┐
│  Form   │───▶│  Server  │───▶│   Supabase    │───▶│  Cache   │
│  (RHF)  │    │  Action  │    │   (DB+RLS)    │    │ (TQuery) │
│         │◀───│          │◀───│               │◀───│          │
└─────────┘    └──────────┘    └───────────────┘    └──────────┘
     ▲                                                    │
     └────────────────────────────────────────────────────┘
                    revalidate / invalidate
```

### File Structure
```
features/todos/
├── schemas.ts          # Zod schemas (single source of truth)
├── actions.ts          # Server actions
├── queries.ts          # TanStack Query hooks
├── components/
│   ├── todo-form.tsx   # Create/edit form
│   └── todo-list.tsx   # List with optimistic updates
└── types.ts            # Derived types
```

### Type Flow: DB → Zod → Form → Action → Cache

```typescript
// schemas.ts — Single source of truth for validation
import { z } from 'zod';
import type { Database } from '@/types/database';

// DB row type (generated)
type TodoRow = Database['public']['Tables']['todos']['Row'];
type TodoInsert = Database['public']['Tables']['todos']['Insert'];

// Zod schema for validation (used on both client AND server)
export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().nullable(),
});

export type TodoFormData = z.infer<typeof todoSchema>;
```

### Server Action

```typescript
// actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { todoSchema, type TodoFormData } from './schemas';
import { revalidatePath } from 'next/cache';

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createTodo(formData: TodoFormData): Promise<ActionResult<{ id: string }>> {
  // Always validate on server — never trust client
  const parsed = todoSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('todos')
    .insert({ ...parsed.data, user_id: user.id })
    .select('id')
    .single();

  if (error) return { success: false, error: 'Failed to create todo' };

  revalidatePath('/todos');
  return { success: true, data: { id: data.id } };
}

export async function updateTodo(
  id: string,
  formData: TodoFormData
): Promise<ActionResult> {
  const parsed = todoSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('todos')
    .update(parsed.data)
    .eq('id', id);

  if (error) return { success: false, error: 'Failed to update todo' };

  revalidatePath('/todos');
  return { success: true, data: undefined };
}

export async function deleteTodo(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) return { success: false, error: 'Failed to delete todo' };

  revalidatePath('/todos');
  return { success: true, data: undefined };
}
```

### TanStack Query Hooks with Optimistic Updates

```typescript
// queries.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { createTodo, updateTodo, deleteTodo } from './actions';
import type { TodoFormData } from './schemas';
import { toast } from 'sonner';

const todoKeys = {
  all: ['todos'] as const,
  list: (filters: Record<string, unknown>) => [...todoKeys.all, 'list', filters] as const,
  detail: (id: string) => [...todoKeys.all, 'detail', id] as const,
};

export function useTodos(filters: { priority?: string } = {}) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from('todos').select('*').order('created_at', { ascending: false });
      if (filters.priority) query = query.eq('priority', filters.priority);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoFormData) => createTodo(data),
    onMutate: async (newTodo) => {
      // Cancel outgoing fetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: todoKeys.all });

      // Snapshot for rollback
      const previous = queryClient.getQueryData(todoKeys.list({}));

      // Optimistic insert
      queryClient.setQueryData(todoKeys.list({}), (old: any[] = []) => [
        { ...newTodo, id: 'temp-' + Date.now(), created_at: new Date().toISOString() },
        ...old,
      ]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(todoKeys.list({}), context.previous);
      }
      toast.error('Failed to create todo');
    },
    onSettled: () => {
      // Always refetch after mutation to get server truth
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
    onSuccess: (result) => {
      if (result.success) toast.success('Todo created');
      else toast.error(result.error);
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.all });
      const previous = queryClient.getQueryData(todoKeys.list({}));
      queryClient.setQueryData(todoKeys.list({}), (old: any[] = []) =>
        old.filter((t) => t.id !== id)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(todoKeys.list({}), context.previous);
      toast.error('Failed to delete');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
```

### Form Component

```typescript
// components/todo-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, type TodoFormData } from '../schemas';
import { useCreateTodo } from '../queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TodoForm({ onSuccess }: { onSuccess?: () => void }) {
  const createTodo = useCreateTodo();
  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: { title: '', priority: 'medium', due_date: null },
  });

  async function onSubmit(data: TodoFormData) {
    const result = await createTodo.mutateAsync(data);
    if (result.success) {
      form.reset();
      onSuccess?.();
    } else if (result.fieldErrors) {
      // Map server field errors back to form
      Object.entries(result.fieldErrors).forEach(([field, messages]) => {
        form.setError(field as keyof TodoFormData, { message: messages[0] });
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register('title')} placeholder="What needs to be done?" />
      {form.formState.errors.title && (
        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
      )}
      <Button type="submit" disabled={createTodo.isPending}>
        {createTodo.isPending ? 'Adding...' : 'Add Todo'}
      </Button>
    </form>
  );
}
```

### Common Mistakes

```typescript
// ❌ Wrong: Using client Supabase in server action
import { createClient } from '@/lib/supabase/client'; // WRONG — this is the browser client
// ✅ Right: Use server client in server actions
import { createClient } from '@/lib/supabase/server';

// ❌ Wrong: Forgetting to invalidate cache after mutation
onSettled: () => { /* nothing */ }
// ✅ Right: Always invalidate to sync with server
onSettled: () => queryClient.invalidateQueries({ queryKey: todoKeys.all })

// ❌ Wrong: Trusting client-only validation
export async function createTodo(data: TodoFormData) {
  // Directly using data without server-side validation
  await supabase.from('todos').insert(data);
}
// ✅ Right: Always validate on server
const parsed = todoSchema.safeParse(data);
if (!parsed.success) return { success: false, error: 'Validation failed' };

// ❌ Wrong: Not canceling queries before optimistic update
onMutate: async (newTodo) => {
  // Stale refetch can overwrite optimistic data
  queryClient.setQueryData(key, ...);
}
// ✅ Right: Cancel first, then update
onMutate: async (newTodo) => {
  await queryClient.cancelQueries({ queryKey: todoKeys.all });
  queryClient.setQueryData(key, ...);
}
```

---

## 2. List + Detail with Filters

URL-driven filterable list with server-prefetched detail pages.

### Data Flow
```
┌───────────┐    ┌────────────────┐    ┌───────────┐    ┌──────────┐
│  URL      │───▶│  useSearch     │───▶│  TanStack  │───▶│  List    │
│  Params   │    │  Params        │    │  Query     │    │  UI      │
└───────────┘    └────────────────┘    └───────────┘    └──────────┘
     ▲                                                       │
     │                click item                             │
     │           ┌──────────────────────────────────────────┘
     │           ▼
     │    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
     │    │  /items/[id] │───▶│  Prefetch    │───▶│  Detail  │
     │    │  page.tsx    │    │  (server)    │    │  UI      │
     │    └──────────────┘    └──────────────┘    └──────────┘
     │                                                  │
     └──────────────── back (filters preserved) ────────┘
```

### File Structure
```
app/projects/
├── page.tsx                # List page (server component)
├── project-list.tsx        # Client list component
├── project-filters.tsx     # Filter controls
├── [id]/
│   └── page.tsx            # Detail page (server prefetch)
lib/projects/
├── queries.ts              # TanStack Query hooks
└── schemas.ts              # Filter + form schemas
```

### URL as Source of Truth

```typescript
// project-filters.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export function ProjectFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build new URL preserving other params
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page'); // Reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Search..."
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => updateParam('q', e.target.value || null)}
      />
      <Select
        value={searchParams.get('status') ?? 'all'}
        onValueChange={(v) => updateParam('status', v === 'all' ? null : v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

### Query with URL-Driven Filters

```typescript
// queries.ts
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Filters = { q?: string; status?: string; page?: number };

function parseFilters(params: URLSearchParams): Filters {
  return {
    q: params.get('q') ?? undefined,
    status: params.get('status') ?? undefined,
    page: Number(params.get('page') ?? 1),
  };
}

const PAGE_SIZE = 20;

export function useProjects() {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  return useQuery({
    queryKey: ['projects', 'list', filters],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(
          ((filters.page ?? 1) - 1) * PAGE_SIZE,
          (filters.page ?? 1) * PAGE_SIZE - 1
        );

      if (filters.q) query = query.ilike('name', `%${filters.q}%`);
      if (filters.status) query = query.eq('status', filters.status);

      const { data, error, count } = await query;
      if (error) throw error;
      return { items: data, total: count ?? 0, pageSize: PAGE_SIZE };
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_members(*, profiles(*))')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
```

### Detail Page with Server Prefetch

```typescript
// app/projects/[id]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/server';
import { ProjectDetail } from './project-detail';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Prefetch on server — client picks up from cache instantly
  await queryClient.prefetchQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_members(*, profiles(*))')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetail id={id} />
    </HydrationBoundary>
  );
}
```

### List Page with Suspense Boundary

```typescript
// app/projects/page.tsx
import { Suspense } from 'react';
import { ProjectFilters } from './project-filters';
import { ProjectList } from './project-list';

// Wrapper component — useSearchParams needs Suspense
export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ProjectFilters />
      </Suspense>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  );
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}
```

### Common Mistakes

```typescript
// ❌ Wrong: Storing filters in useState (lost on navigation)
const [status, setStatus] = useState('active');
// ✅ Right: URL is source of truth — shareable, back-button works
const status = searchParams.get('status');

// ❌ Wrong: Not resetting page on filter change
updateParam('status', 'active'); // Still on page 5 with different results
// ✅ Right: Reset pagination
params.delete('page');

// ❌ Wrong: useSearchParams without Suspense boundary
export default function Page() {
  return <ProjectFilters />; // Build error for static generation
}
// ✅ Right: Wrap in Suspense
export default function Page() {
  return <Suspense><ProjectFilters /></Suspense>;
}
```

---

## 3. Real-Time Feature

Live updates via Supabase Realtime with optimistic UI.

### Data Flow
```
┌──────────┐  mutation   ┌───────────┐  insert   ┌──────────────┐
│  Client  │────────────▶│  Server   │──────────▶│   Supabase   │
│  A       │             │  Action   │           │   Database   │
└──────────┘             └───────────┘           └──────┬───────┘
                                                        │
                              postgres_changes event    │
                    ┌───────────────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│  Supabase Realtime Channel                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Client A │  │ Client B │  │ Client C │  ← all receive    │
│  └──────────┘  └──────────┘  └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼  invalidateQueries
            ┌──────────────┐
            │  Fresh data  │
            │  from cache  │
            └──────────────┘
```

### Realtime Hook with TanStack Query Integration

```typescript
// hooks/use-realtime-query.ts
'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Table = 'messages' | 'todos' | 'projects';

export function useRealtimeInvalidation(table: Table, queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          // Invalidate to refetch — simpler and safer than manual cache manipulation
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryClient]); // queryKey intentionally excluded — use stable reference
}
```

### Chat Feature with Presence

```typescript
// features/chat/use-chat.ts
'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { sendMessage } from './actions';
import { useRealtimeInvalidation } from '@/hooks/use-realtime-query';

export function useChat(roomId: string) {
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Fetch messages
  const messages = useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(name, avatar_url)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Auto-invalidate on realtime changes
  useRealtimeInvalidation('messages', ['messages', roomId]);

  // Presence tracking
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`room:${roomId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat().map((p: any) => p.user_id);
        setOnlineUsers([...new Set(users)]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) await channel.track({ user_id: user.id });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  // Send with optimistic insert
  const send = useMutation({
    mutationFn: (content: string) => sendMessage(roomId, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ['messages', roomId] });
      const previous = queryClient.getQueryData(['messages', roomId]);

      queryClient.setQueryData(['messages', roomId], (old: any[] = []) => [
        ...old,
        { id: `temp-${Date.now()}`, content, created_at: new Date().toISOString(), _optimistic: true },
      ]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['messages', roomId], context.previous);
    },
    // No onSettled invalidation — realtime handles it
  });

  return { messages, send, onlineUsers };
}
```

### Common Mistakes

```typescript
// ❌ Wrong: Manually inserting into cache on realtime event (duplicates, stale data)
.on('postgres_changes', { event: 'INSERT' }, (payload) => {
  queryClient.setQueryData(['messages'], (old) => [...old, payload.new]);
})
// ✅ Right: Invalidate and let TanStack Query refetch
.on('postgres_changes', { event: '*' }, () => {
  queryClient.invalidateQueries({ queryKey: ['messages'] });
})

// ❌ Wrong: Forgetting to clean up channel
useEffect(() => {
  const channel = supabase.channel('room').on(...).subscribe();
  // No cleanup — memory leak, duplicate subscriptions
}, []);
// ✅ Right: Always remove channel
useEffect(() => {
  const channel = supabase.channel('room').on(...).subscribe();
  return () => { supabase.removeChannel(channel); };
}, []);

// ❌ Wrong: Both optimistic update AND realtime invalidation causing flash
// The optimistic insert shows, then realtime triggers refetch, data appears twice briefly
// ✅ Right: Mark optimistic items and skip realtime invalidation during pending mutation
// Or: don't use optimistic updates if realtime is fast enough
```

---

## 4. Auth-Gated Feature

Full auth chain from middleware to RLS.

### Data Flow
```
┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌─────────┐
│ Request  │───▶│ Middleware  │───▶│ Server       │───▶│ Client  │
│          │    │ (redirect  │    │ Component    │    │ Component│
│          │    │  if !auth)  │    │ (getUser)    │    │ (session │
│          │    └────────────┘    └──────────────┘    │  context)│
│          │                           │              └────┬────┘
│          │                           ▼                   │
│          │                     ┌──────────┐              │
│          │                     │ Supabase │◀─────────────┘
│          │                     │ (RLS     │  queries use session
│          │                     │  enforced)│
│          │                     └──────────┘
└──────────┘
```

### Middleware Layer

```typescript
// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const publicRoutes = ['/login', '/signup', '/auth/callback', '/public'];

export async function middleware(request: NextRequest) {
  // Check public routes BEFORE calling getUser (avoids unnecessary auth calls)
  const isPublic = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  if (isPublic) return NextResponse.next();

  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)'],
};
```

### Server Component Auth

```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch user-specific data (RLS ensures they only see their own)
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  // Pass user and initial data to client component
  return <DashboardClient user={user} initialProjects={projects ?? []} />;
}
```

### Client Session Context

```typescript
// providers/session-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type SessionContext = { user: User | null; isLoading: boolean };

const SessionCtx = createContext<SessionContext>({ user: null, isLoading: true });

export function SessionProvider({ user: initialUser, children }: { user: User | null; children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { setUser(session?.user ?? null); }
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionCtx.Provider value={{ user, isLoading }}>
      {children}
    </SessionCtx.Provider>
  );
}

export const useSession = () => useContext(SessionCtx);
```

### Conditional Rendering Without Hydration Mismatch

```typescript
// components/auth-gate.tsx
'use client';

import { useSession } from '@/providers/session-provider';

// ✅ Safe — initial render matches server because we pass user from server component
export function AuthGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { user, isLoading } = useSession();

  if (isLoading) return null; // Or skeleton
  if (!user) return fallback ?? null;
  return <>{children}</>;
}

// ❌ Hydration mismatch — checking auth on client that server didn't know about
export function BrokenAuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // This runs only on client — server rendered without user check
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);
  if (!user) return null; // Server rendered children, client removes them → mismatch
  return <>{children}</>;
}
```

### API Route Auth Pattern

```typescript
// app/api/projects/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  // RLS policy on projects table enforces user_id = auth.uid()
  // So even if someone sends a different user_id, RLS blocks it
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
```

---

## 5. Optimistic UI Pattern

Instant feedback with server confirmation and rollback.

### Like Button

```typescript
// components/like-button.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '@/features/likes/actions';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LikeButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const { data: liked = false } = useQuery({
    queryKey: ['likes', postId],
    queryFn: async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      return (count ?? 0) > 0;
    },
  });

  const toggle = useMutation({
    mutationFn: () => toggleLike(postId),
    // Instant toggle
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['likes', postId] });
      const previous = queryClient.getQueryData<boolean>(['likes', postId]);
      queryClient.setQueryData(['likes', postId], !previous);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['likes', postId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', postId] });
    },
  });

  return (
    <button
      onClick={() => toggle.mutate()}
      disabled={toggle.isPending}
      className="flex items-center gap-1"
    >
      <Heart className={cn('h-5 w-5', liked && 'fill-red-500 text-red-500')} />
    </button>
  );
}
```

### Optimistic Delete with Undo Toast

```typescript
// components/item-list.tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem } from '@/features/items/actions';
import { toast } from 'sonner';

export function useOptimisticDelete(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<any[]>(queryKey);

      // Remove from list immediately
      queryClient.setQueryData(queryKey, (old: any[] = []) =>
        old.filter((item) => item.id !== id)
      );

      // Show undo toast
      toast('Item deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            // Restore previous data
            queryClient.setQueryData(queryKey, previous);
            // Cancel the mutation (needs custom logic in your action)
          },
        },
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Failed to delete');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
```

### Toggle with Debounced Save

```typescript
// Useful for toggles that fire rapidly (e.g., checkboxes in a list)
import { useRef } from 'react';

export function useDebouncedToggle(
  queryKey: readonly unknown[],
  toggleFn: (id: string, value: boolean) => Promise<ActionResult>
) {
  const queryClient = useQueryClient();
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) => {
      // Clear previous debounce for this item
      const existing = timeouts.current.get(id);
      if (existing) clearTimeout(existing);

      return new Promise<ActionResult>((resolve) => {
        const timeout = setTimeout(async () => {
          const result = await toggleFn(id, value);
          resolve(result);
        }, 500);
        timeouts.current.set(id, timeout);
      });
    },
    onMutate: async ({ id, value }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any[] = []) =>
        old.map((item) => (item.id === id ? { ...item, completed: value } : item))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
  });
}
```

---

## 6. Create/Edit Modal

Shared form in a dialog for both creating and editing records.

### Data Flow
```
┌────────┐  open(null)   ┌──────────┐   submit   ┌──────────────┐
│ "New"  │──────────────▶│  Dialog   │───────────▶│ createAction │
│ button │               │  + Form   │            └──────────────┘
└────────┘               │           │
                         │  prefill  │
┌────────┐  open(item)   │  if edit  │   submit   ┌──────────────┐
│ "Edit" │──────────────▶│           │───────────▶│ updateAction │
│ button │               └──────────┘            └──────────────┘
└────────┘                    │
                              │ onSuccess
                              ▼
                     close + invalidateQueries
```

### Modal Component

```typescript
// components/project-modal.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectSchema, type ProjectFormData } from '@/features/projects/schemas';
import { createProject, updateProject } from '@/features/projects/actions';
import { toast } from 'sonner';

type Project = { id: string; name: string; description: string };

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null; // null = create mode, object = edit mode
}

export function ProjectModal({ open, onOpenChange, project }: ProjectModalProps) {
  const isEdit = !!project;
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', description: '' },
  });

  // Reset form when modal opens with different data
  useEffect(() => {
    if (open) {
      form.reset(project ?? { name: '', description: '' });
    }
  }, [open, project]);

  const mutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      isEdit ? updateProject(project!.id, data) : createProject(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        onOpenChange(false);
        toast.success(isEdit ? 'Project updated' : 'Project created');
      } else {
        toast.error(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, msgs]) => {
            form.setError(field as keyof ProjectFormData, { message: msgs[0] });
          });
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...form.register('description')} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Using the Modal

```typescript
// page-level usage
'use client';

import { useState } from 'react';
import { ProjectModal } from '@/components/project-modal';

type Project = { id: string; name: string; description: string };

export function ProjectsPage() {
  const [modalState, setModalState] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  });

  const openCreate = () => setModalState({ open: true, project: null });
  const openEdit = (p: Project) => setModalState({ open: true, project: p });
  const close = () => setModalState({ open: false, project: null });

  return (
    <>
      <Button onClick={openCreate}>New Project</Button>
      {/* In list items: */}
      {/* <Button onClick={() => openEdit(project)}>Edit</Button> */}
      <ProjectModal
        open={modalState.open}
        onOpenChange={(open) => { if (!open) close(); }}
        project={modalState.project}
      />
    </>
  );
}
```

### Common Mistakes

```typescript
// ❌ Wrong: Not resetting form when switching between create/edit
// Opens edit for Project A, closes, opens create — form still has Project A data
// ✅ Right: Reset in useEffect tied to open + project

// ❌ Wrong: Closing modal before mutation succeeds
form.handleSubmit(async (data) => {
  onOpenChange(false); // Closes before we know if it worked
  await mutation.mutateAsync(data);
})
// ✅ Right: Close in onSuccess callback

// ❌ Wrong: Separate CreateModal and EditModal components (code duplication)
// ✅ Right: Single modal, mode determined by whether project prop is passed
```

---

## 7. Multi-Step Wizard

Form wizard with per-step validation and persistent state.

### Data Flow
```
┌────────┐    ┌────────┐    ┌────────┐    ┌──────────┐
│ Step 1 │───▶│ Step 2 │───▶│ Step 3 │───▶│  Review  │
│ Basics │    │ Details│    │ Config │    │ + Submit │
└────────┘    └────────┘    └────────┘    └──────────┘
     │             │             │              │
     ▼             ▼             ▼              ▼
┌──────────────────────────────────────────────────────┐
│           Zustand Store (persisted)                  │
│  { step1Data, step2Data, step3Data, currentStep }    │
└──────────────────────────────────────────────────────┘
```

### Zustand Store for Wizard State

```typescript
// features/onboarding/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Step1Data { name: string; email: string }
interface Step2Data { company: string; role: string; teamSize: string }
interface Step3Data { plan: 'free' | 'pro' | 'enterprise'; notifications: boolean }

interface WizardStore {
  currentStep: number;
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  setStep: (step: number) => void;
  setStep1: (data: Step1Data) => void;
  setStep2: (data: Step2Data) => void;
  setStep3: (data: Step3Data) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      step1: null,
      step2: null,
      step3: null,
      setStep: (step) => set({ currentStep: step }),
      setStep1: (data) => set({ step1: data, currentStep: 2 }),
      setStep2: (data) => set({ step2: data, currentStep: 3 }),
      setStep3: (data) => set({ step3: data, currentStep: 4 }),
      reset: () => set({ currentStep: 1, step1: null, step2: null, step3: null }),
    }),
    { name: 'onboarding-wizard' } // localStorage key
  )
);
```

### Per-Step Schemas

```typescript
// features/onboarding/schemas.ts
import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export const step2Schema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  teamSize: z.enum(['1-5', '6-20', '21-100', '100+']),
});

export const step3Schema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise']),
  notifications: z.boolean(),
});

// Combined schema for final server-side validation
export const onboardingSchema = step1Schema.merge(step2Schema).merge(step3Schema);
export type OnboardingData = z.infer<typeof onboardingSchema>;
```

### Wizard Container with URL-Based Steps

```typescript
// features/onboarding/wizard.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useWizardStore } from './store';
import { Step1Form } from './steps/step1';
import { Step2Form } from './steps/step2';
import { Step3Form } from './steps/step3';
import { ReviewStep } from './steps/review';

const STEPS = [
  { label: 'Basics', component: Step1Form },
  { label: 'Details', component: Step2Form },
  { label: 'Plan', component: Step3Form },
  { label: 'Review', component: ReviewStep },
];

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStep = Number(searchParams.get('step') ?? 1);
  const { currentStep } = useWizardStore();

  // URL step can't exceed completed steps (prevent skipping)
  const step = Math.min(urlStep, currentStep);
  const StepComponent = STEPS[step - 1]?.component ?? Step1Form;

  const goToStep = (s: number) => {
    router.push(`/onboarding?step=${s}`);
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => i + 1 <= currentStep && goToStep(i + 1)}
            className={`flex-1 h-2 rounded ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`}
            disabled={i + 1 > currentStep}
          />
        ))}
      </div>

      <StepComponent onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />
    </div>
  );
}
```

### Step Component

```typescript
// features/onboarding/steps/step1.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../schemas';
import { useWizardStore } from '../store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Step1Form({ onNext }: { onNext: () => void }) {
  const { step1, setStep1 } = useWizardStore();

  const form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: step1 ?? { name: '', email: '' },
  });

  function onSubmit(data: { name: string; email: string }) {
    setStep1(data); // Saves to Zustand (persisted)
    onNext();       // Navigate to next step
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register('name')} placeholder="Your name" />
      <Input {...form.register('email')} placeholder="Email" />
      <Button type="submit">Next</Button>
    </form>
  );
}
```

---

## 8. Bulk Operations

Select multiple items, confirm, process in batch.

### Data Flow
```
┌──────────┐  select   ┌───────────┐  confirm   ┌─────────────┐
│  List    │──────────▶│ Selection │───────────▶│  Confirm    │
│  Items   │           │ State     │            │  Dialog     │
│  [☐][☐]  │           │ Set<id>   │            └──────┬──────┘
└──────────┘           └───────────┘                   │
                                                       ▼
                       ┌───────────────────────────────────────┐
                       │  Batch Processor                      │
                       │  ┌───┐ ┌───┐ ┌───┐ ┌───┐            │
                       │  │ ✓ │ │ ✓ │ │ ✗ │ │ … │ → progress │
                       │  └───┘ └───┘ └───┘ └───┘            │
                       └───────────────────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │ Results Summary  │
                              │ 8 success, 1 fail│
                              └──────────────────┘
```

### Selection Hook

```typescript
// hooks/use-selection.ts
'use client';

import { useState, useCallback, useMemo } from 'react';

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === items.length) return new Set();
      return new Set(items.map((i) => i.id));
    });
  }, [items]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.id)),
    [items, selected]
  );

  return {
    selected,
    selectedItems,
    selectedCount: selected.size,
    isAllSelected: selected.size === items.length && items.length > 0,
    isIndeterminate: selected.size > 0 && selected.size < items.length,
    toggle,
    toggleAll,
    clear,
  };
}
```

### Batch Processor

```typescript
// features/items/use-bulk-action.ts
'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ActionResult } from '@/features/items/actions';

interface BulkProgress {
  total: number;
  completed: number;
  succeeded: number;
  failed: { id: string; error: string }[];
  isRunning: boolean;
}

export function useBulkAction(
  action: (id: string) => Promise<ActionResult>,
  queryKey: readonly unknown[]
) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<BulkProgress>({
    total: 0, completed: 0, succeeded: 0, failed: [], isRunning: false,
  });

  async function execute(ids: string[], concurrency = 3) {
    setProgress({ total: ids.length, completed: 0, succeeded: 0, failed: [], isRunning: true });

    const results: { id: string; error?: string }[] = [];

    // Process in batches for controlled concurrency
    for (let i = 0; i < ids.length; i += concurrency) {
      const batch = ids.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(async (id) => {
          const result = await action(id);
          if (!result.success) throw new Error(result.error);
          return id;
        })
      );

      batchResults.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          results.push({ id: result.value });
        } else {
          results.push({ id: batch[idx], error: result.reason.message });
        }
      });

      setProgress((prev) => ({
        ...prev,
        completed: prev.completed + batch.length,
        succeeded: prev.succeeded + batchResults.filter((r) => r.status === 'fulfilled').length,
        failed: [
          ...prev.failed,
          ...batchResults
            .map((r, idx) => r.status === 'rejected' ? { id: batch[idx], error: r.reason.message } : null)
            .filter(Boolean) as { id: string; error: string }[],
        ],
      }));
    }

    setProgress((prev) => ({ ...prev, isRunning: false }));
    queryClient.invalidateQueries({ queryKey });

    return results;
  }

  return { execute, progress };
}
```

### Bulk Action Bar

```typescript
// components/bulk-action-bar.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClear: () => void;
  progress?: { total: number; completed: number; isRunning: boolean };
}

export function BulkActionBar({ selectedCount, onDelete, onClear, progress }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 mx-auto w-fit rounded-lg border bg-background p-3 shadow-lg flex items-center gap-4">
      <span className="text-sm font-medium">{selectedCount} selected</span>

      {progress?.isRunning ? (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Progress value={(progress.completed / progress.total) * 100} />
          <span className="text-sm text-muted-foreground">
            {progress.completed}/{progress.total}
          </span>
        </div>
      ) : (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {selectedCount} items?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
        </>
      )}
    </div>
  );
}
```

---

# PART II: Cross-Cutting Concerns

## Type Safety Through the Stack

Single source of truth: database schema → generated types → Zod → form → action → cache.

```
Database (Supabase)
    │  npx supabase gen types typescript
    ▼
database.ts (generated — DO NOT EDIT)
    │  type TodoRow = Database['public']['Tables']['todos']['Row']
    ▼
schemas.ts (Zod — validates at runtime)
    │  export const todoSchema = z.object({ ... })
    │  export type TodoFormData = z.infer<typeof todoSchema>
    ▼
Form (RHF uses Zod schema via zodResolver)
    │  useForm<TodoFormData>({ resolver: zodResolver(todoSchema) })
    ▼
Server Action (validates again with same schema)
    │  todoSchema.safeParse(data)
    ▼
Supabase Client (types from database.ts ensure correct columns)
    │  supabase.from('todos').insert(parsed.data) // type-checked
    ▼
TanStack Query Cache (typed via queryFn return type)
    │  useQuery<TodoRow[]>({ queryKey: [...], queryFn: ... })
    ▼
Component (fully typed from cache to render)
```

### Key Rules

```typescript
// ✅ Derive form types from Zod (not manually)
type FormData = z.infer<typeof schema>;

// ✅ Server action accepts the Zod-inferred type, validates again
async function action(data: FormData): Promise<ActionResult> {
  const parsed = schema.safeParse(data); // re-validate
}

// ✅ Query hooks return database row types
function useTodos() {
  return useQuery<TodoRow[]>({ ... });
}

// ❌ Don't create parallel type definitions
interface TodoForm { title: string } // Drifts from schema
type TodoRow = { title: string }     // Drifts from database.ts
```

### Mapping Between Layers

```typescript
// When DB shape ≠ form shape, transform explicitly
const dbRowToFormData = (row: TodoRow): TodoFormData => ({
  title: row.title,
  description: row.description ?? '',
  priority: row.priority as 'low' | 'medium' | 'high',
  due_date: row.due_date,
});

const formDataToInsert = (form: TodoFormData, userId: string): TodoInsert => ({
  ...form,
  user_id: userId,
});
```

---

## Loading State Choreography

Coordinating multiple loading indicators without flicker or confusion.

```typescript
// Pattern: Three loading states serve different purposes
function FeatureComponent() {
  const { data, isFetching, isLoading } = useQuery({ ... });
  //                                       │         │
  //                                       │         └─ First load (no cached data)
  //                                       └─ Background refetch (has stale data)

  const mutation = useMutation({ ... });
  //                mutation.isPending ─── Mutation in flight

  // First load: show skeleton
  if (isLoading) return <Skeleton />;

  return (
    <div>
      {/* Background refetch: subtle indicator, don't replace content */}
      {isFetching && <div className="absolute top-0 left-0 w-full h-0.5 bg-primary animate-pulse" />}

      {/* Content always visible when we have data */}
      <ItemList items={data} />

      {/* Mutation: disable the trigger, show inline spinner */}
      <Button disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
```

### Anti-Patterns

```typescript
// ❌ Wrong: Using isFetching for skeleton (flickers on every refetch)
if (isFetching) return <Skeleton />;
// ✅ Right: Skeleton only on first load
if (isLoading) return <Skeleton />;

// ❌ Wrong: Full-page spinner during mutation
if (mutation.isPending) return <FullPageSpinner />;
// ✅ Right: Disable trigger + inline indicator
<Button disabled={mutation.isPending}>Saving...</Button>

// ❌ Wrong: No loading state at all (user clicks, nothing happens)
<Button onClick={() => mutation.mutate(data)}>Save</Button>
// ✅ Right: Immediate feedback
<Button onClick={() => mutation.mutate(data)} disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</Button>
```

---

## Error Handling Across Layers

Structured errors that flow from database to user-facing messages.

### ActionResult Pattern

```typescript
// Shared type for all server actions
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// Server action
export async function createProject(data: ProjectFormData): Promise<ActionResult<{ id: string }>> {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .insert(parsed.data)
    .select('id')
    .single();

  if (error) {
    // Map DB errors to user messages
    if (error.code === '23505') return { success: false, error: 'Project name already exists' };
    if (error.code === '23503') return { success: false, error: 'Invalid reference' };
    return { success: false, error: 'Something went wrong' };
  }

  return { success: true, data: { id: project.id } };
}
```

### Consuming ActionResult in Components

```typescript
const mutation = useMutation({
  mutationFn: (data: ProjectFormData) => createProject(data),
  onSuccess: (result) => {
    if (result.success) {
      toast.success('Created!');
      router.push(`/projects/${result.data.id}`);
    } else {
      // Field-level errors → form
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, msgs]) => {
          form.setError(field as keyof ProjectFormData, { message: msgs[0] });
        });
      }
      // General error → toast
      toast.error(result.error);
    }
  },
  // Network/unexpected errors
  onError: () => toast.error('Network error. Please try again.'),
});
```

### Error Boundary for Unexpected Failures

```typescript
// For detailed React error boundary patterns, see `error-handling-patterns`

// app/projects/error.tsx — Next.js error boundary
'use client';

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

---

## State Sync Anti-Patterns

Common traps when connecting multiple state sources.

### Duplicate State

```typescript
// ❌ TRAP: Copying server data into local state
function ProjectList() {
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const [localProjects, setLocalProjects] = useState(projects); // DUPLICATE!

  useEffect(() => {
    setLocalProjects(projects); // Sync loop, always one render behind
  }, [projects]);
}

// ✅ FIX: Use query data directly, derive what you need
function ProjectList() {
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const sortedProjects = useMemo(() =>
    [...projects].sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [projects]
  );
}
```

### Race Conditions

```typescript
// ❌ TRAP: Mutations fire without waiting, cache gets confused
async function saveAll(items: Item[]) {
  items.forEach((item) => updateItem(item)); // All fire at once, no await
}

// ✅ FIX: Sequential with progress, or batch endpoint
async function saveAll(items: Item[]) {
  for (const item of items) {
    await updateItem(item);
  }
  queryClient.invalidateQueries({ queryKey: ['items'] }); // Once at end
}
```

### Stale Closure in Optimistic Updates

```typescript
// ❌ TRAP: Optimistic update uses stale data
onMutate: async () => {
  // queryClient.getQueryData might return undefined if cache expired
  const previous = queryClient.getQueryData(['items']);
  queryClient.setQueryData(['items'], (old) => {
    // old is undefined → crash or wrong behavior
    return [...old, newItem];
  });
}

// ✅ FIX: Always handle undefined, provide fallback
onMutate: async () => {
  await queryClient.cancelQueries({ queryKey: ['items'] });
  const previous = queryClient.getQueryData(['items']);
  queryClient.setQueryData(['items'], (old: Item[] = []) => [...old, newItem]);
  return { previous };
}
```

---

# PART III: Quick Reference

## Decision Tree — "Where Does This Logic Go?"

```
Is it auth/security?
  └─ YES → Server (middleware, server action, RLS)

Is it data from the database?
  └─ YES → TanStack Query (cache, background refetch)

Should the URL reflect it? (filters, tabs, pagination)
  └─ YES → URL searchParams

Is it form input state?
  └─ YES → React Hook Form

Is it shared across unrelated components?
  └─ YES → Zustand store

Is it local to one component?
  └─ YES → useState
```

## Wiring Cheat Sheet

### Pattern A: Simple mutation (form → server → cache)
```typescript
// 1. Zod schema
const schema = z.object({ name: z.string().min(1) });
// 2. Server action validates + writes
'use server';
async function create(data) { schema.safeParse(data); supabase.from('x').insert(data); revalidatePath('/x'); }
// 3. useMutation calls action, invalidates cache
useMutation({ mutationFn: create, onSettled: () => queryClient.invalidateQueries({ queryKey: ['x'] }) });
// 4. useForm with zodResolver submits to mutate
```

### Pattern B: Read with filters (URL → query → UI)
```typescript
// 1. Filters from useSearchParams
const filters = { q: searchParams.get('q'), status: searchParams.get('status') };
// 2. useQuery with filters in queryKey
useQuery({ queryKey: ['items', filters], queryFn: () => fetchFiltered(filters) });
// 3. Update URL to change filters
router.push(`${pathname}?${params.toString()}`);
```

### Pattern C: Realtime (subscribe → invalidate → fresh data)
```typescript
// 1. useQuery fetches data
// 2. Supabase channel listens for postgres_changes
// 3. On change → queryClient.invalidateQueries
// 4. TanStack Query auto-refetches
```

### Pattern D: Optimistic (mutate → instant UI → confirm/rollback)
```typescript
// 1. onMutate: cancel queries, snapshot previous, update cache
// 2. onError: restore previous from snapshot
// 3. onSettled: invalidate to get server truth
```
