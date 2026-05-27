---
name: data-fetching-patterns
description: Modern data fetching with TanStack Query, SWR, caching strategies, optimistic updates, and loading states. Use when setting up TanStack Query, implementing optimistic updates or infinite scroll, or structuring query keys and cache invalidation.
---

# Data Fetching Patterns

Fetch, cache, and synchronize server data effectively with modern React patterns.

## When to Use This Skill

Use when:
- Setting up data fetching infrastructure
- Implementing caching and background refetching
- Building optimistic UI updates
- Handling loading, error, and empty states
- Coordinating multiple data dependencies

## TanStack Query Setup

### Installation and Configuration
```bash
npm install @tanstack/react-query
```

```typescript
// providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Consider data stale after 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 30 minutes
            gcTime: 30 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Wait longer between retries
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Don't retry mutations by default
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Basic Queries

### Simple Query
```typescript
// hooks/use-users.ts
import { useQuery } from '@tanstack/react-query';

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

// Usage in component
function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!users?.length) return <EmptyState />;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Query with Parameters
```typescript
// hooks/use-user.ts
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('User not found');
      return response.json() as Promise<User>;
    },
    enabled: !!userId, // Don't fetch if no userId
  });
}

// hooks/use-user-posts.ts
export function useUserPosts(userId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: options?.enabled !== false && !!userId,
  });
}
```

### Dependent Queries
```typescript
function UserProfile({ userId }: { userId: string }) {
  // First query
  const { data: user } = useUser(userId);

  // Second query depends on first
  const { data: posts } = useUserPosts(userId, {
    enabled: !!user, // Only fetch posts after user loads
  });

  // Third query depends on user data
  const { data: company } = useQuery({
    queryKey: ['companies', user?.companyId],
    queryFn: () => fetchCompany(user!.companyId),
    enabled: !!user?.companyId,
  });

  return (/* ... */);
}
```

## Query Keys

### Key Structure Best Practices
```typescript
// Use arrays with hierarchical structure
const queryKeys = {
  // All users-related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Posts with user relationship
  posts: {
    all: ['posts'] as const,
    byUser: (userId: string) => [...queryKeys.posts.all, 'user', userId] as const,
    detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
  },
};

// Usage
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => fetchUser(userId),
});

// Invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.users.all }); // All user queries
queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }); // All list queries
```

## Mutations

### Basic Mutation
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateUserInput) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json() as Promise<User>;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage
function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    createUser.mutate(data, {
      onSuccess: (newUser) => {
        toast.success(`Created user ${newUser.name}`);
        router.push(`/users/${newUser.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Optimistic Updates
```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateUserInput) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json() as Promise<User>;
    },

    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', newData.id] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(['users', newData.id]);

      // Optimistically update
      queryClient.setQueryData<User>(['users', newData.id], (old) => ({
        ...old!,
        ...newData,
      }));

      // Return context for rollback
      return { previousUser };
    },

    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['users', newData.id], context.previousUser);
      }
      toast.error('Failed to update user');
    },

    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}
```

### Optimistic List Updates
```typescript
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousUsers = queryClient.getQueryData<User[]>(['users']);

      // Remove from list optimistically
      queryClient.setQueryData<User[]>(['users'], (old) =>
        old?.filter((user) => user.id !== userId)
      );

      return { previousUsers };
    },

    onError: (err, userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

## Infinite Queries

```typescript
export function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/users?offset=${pageParam}&limit=20`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json() as Promise<{
        users: User[];
        nextOffset: number | null;
      }>;
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });
}

// Usage
function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers();

  // Flatten pages
  const users = data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

// With intersection observer for infinite scroll
function InfiniteScrollList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.flatMap((page) =>
        page.users.map((user) => <UserCard key={user.id} user={user} />)
      )}
      <div ref={loadMoreRef} className="h-10" />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
```

## Prefetching

```typescript
// Prefetch on hover
function UserListItem({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const prefetchUser = () => {
    queryClient.prefetchQuery({
      queryKey: ['users', user.id],
      queryFn: () => fetchUser(user.id),
      staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    });
  };

  return (
    <Link href={`/users/${user.id}`} onMouseEnter={prefetchUser}>
      {user.name}
    </Link>
  );
}

// Prefetch on route
// In Next.js loader or page component
export async function loader({ params }: LoaderArgs) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['users', params.id],
    queryFn: () => fetchUser(params.id),
  });

  return { dehydratedState: dehydrate(queryClient) };
}

// Server-side prefetching in Next.js App Router
async function UserPage({ params }: { params: { id: string } }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['users', params.id],
    queryFn: () => fetchUser(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile userId={params.id} />
    </HydrationBoundary>
  );
}
```

## Polling and Real-time

```typescript
// Polling
export function useLiveStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
  });
}

// Conditional polling
export function useOrderStatus(orderId: string) {
  const { data } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => fetchOrder(orderId),
    refetchInterval: (data) => {
      // Stop polling when order is complete
      if (data?.status === 'completed' || data?.status === 'cancelled') {
        return false;
      }
      return 3000; // Poll every 3 seconds while pending
    },
  });

  return data;
}

// WebSocket integration
function useRealtimeQuery<T>(queryKey: QueryKey, subscriptionKey: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getWebSocket();

    const handler = (data: T) => {
      queryClient.setQueryData(queryKey, data);
    };

    socket.on(subscriptionKey, handler);
    return () => socket.off(subscriptionKey, handler);
  }, [queryClient, queryKey, subscriptionKey]);

  return useQuery<T>({
    queryKey,
    queryFn: () => fetch(`/api/${subscriptionKey}`).then((r) => r.json()),
  });
}
```

## Error and Loading States

### Comprehensive Status Handling
```typescript
function DataComponent() {
  const { data, status, error, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  // isLoading = first load (no cached data)
  // isFetching = any fetch (including background)

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  // isSuccess guaranteed here, data is defined
  return (
    <div>
      {/* Show stale indicator during background fetch */}
      {isFetching && <RefreshingIndicator />}
      <DataDisplay data={data} />
    </div>
  );
}
```

### Suspense Mode
```typescript
// Enable suspense
const { data } = useSuspenseQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Usage with Suspense boundary
function App() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <UserList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## TanStack Query v5 Patterns

### Stable Suspense Support
```typescript
import { useSuspenseQuery, useSuspenseInfiniteQuery, useSuspenseQueries } from '@tanstack/react-query';

// useSuspenseQuery - data is guaranteed, no loading/error states needed
function UserProfile({ userId }: { userId: string }) {
  // data is always defined when using useSuspenseQuery
  const { data: user } = useSuspenseQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  });

  // TypeScript knows data is defined - no optional chaining needed
  return <h1>{user.name}</h1>;
}

// Multiple suspense queries in parallel
function Dashboard() {
  const [{ data: users }, { data: stats }] = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['stats'], queryFn: fetchStats },
    ],
  });

  return (
    <div>
      <UserList users={users} />
      <StatsPanel stats={stats} />
    </div>
  );
}

// Suspense infinite query
function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam }) => fetchUsers({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return (
    <div>
      {data.pages.flatMap((page) => page.users.map((user) => (
        <UserCard key={user.id} user={user} />
      )))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
    </div>
  );
}
```

### Prefetching Before Suspense Boundaries
```typescript
import { usePrefetchQuery, usePrefetchInfiniteQuery } from '@tanstack/react-query';

// Prefetch inside component before child suspense boundary
function UserPage({ userId }: { userId: string }) {
  // Prefetch starts immediately, before Suspense boundary is hit
  usePrefetchQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
  });

  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        {/* Posts will already be fetching/cached when this renders */}
        <UserPosts userId={userId} />
      </Suspense>
    </div>
  );
}

// Prefetch on user interaction (hover/focus)
function UserListItem({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['users', user.id],
      queryFn: () => fetchUser(user.id),
      staleTime: 60 * 1000, // Consider fresh for 1 minute
    });
  };

  return (
    <Link
      href={`/users/${user.id}`}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      {user.name}
    </Link>
  );
}
```

### Next.js App Router SSR with Suspense
```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // SSR: avoid refetching immediately on client
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: reuse client across renders
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// app/users/[id]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function UserPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['users', params.id],
    queryFn: () => fetchUser(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile userId={params.id} />
      </Suspense>
    </HydrationBoundary>
  );
}

// Client component using prefetched data
'use client';
function UserProfile({ userId }: { userId: string }) {
  // Data is already hydrated from server, no loading flash
  const { data: user } = useSuspenseQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  });

  return <ProfileCard user={user} />;
}
```

### Streaming with SSR (Experimental)
```typescript
import { experimental_streamedQuery } from '@tanstack/react-query-next-experimental';

// Enable streaming for incremental data loading
export default async function StreamingPage() {
  const queryClient = new QueryClient();

  // Start streaming query - doesn't block page render
  const stream = experimental_streamedQuery(queryClient, {
    queryKey: ['large-dataset'],
    queryFn: fetchLargeDataset,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<DataSkeleton />}>
        <StreamedData />
      </Suspense>
    </HydrationBoundary>
  );
}
```

### Query Options Pattern (v5)
```typescript
import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';

// Define reusable query options with full type safety
const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,
  });

const usersInfiniteOptions = (filters: UserFilters) =>
  infiniteQueryOptions({
    queryKey: ['users', 'infinite', filters],
    queryFn: ({ pageParam }) => fetchUsers({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

// Use anywhere - hooks, prefetching, or direct queryClient calls
function UserProfile({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery(userQueryOptions(userId));
  return <div>{data.name}</div>;
}

// Prefetch with same options
async function prefetchUser(queryClient: QueryClient, userId: string) {
  await queryClient.prefetchQuery(userQueryOptions(userId));
}

// Invalidate with same key structure
function useInvalidateUser() {
  const queryClient = useQueryClient();
  return (userId: string) => {
    queryClient.invalidateQueries(userQueryOptions(userId));
  };
}

### Placeholder Data
```typescript
// Show cached data immediately, fetch fresh in background
const { data } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  placeholderData: (previousData) => previousData, // Keep previous data while fetching
});

// Use cached list item as placeholder for detail
const { data } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  placeholderData: () => {
    return queryClient
      .getQueryData<User[]>(['users'])
      ?.find((user) => user.id === userId);
  },
});
```

## Query Invalidation Strategies

```typescript
const queryClient = useQueryClient();

// Invalidate exact match
queryClient.invalidateQueries({ queryKey: ['users', '123'] });

// Invalidate all queries starting with 'users'
queryClient.invalidateQueries({ queryKey: ['users'] });

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'users' &&
    (query.queryKey[1] as any)?.status === 'active',
});

// Refetch instead of invalidate (force immediate refetch)
queryClient.refetchQueries({ queryKey: ['users'] });

// Remove from cache entirely
queryClient.removeQueries({ queryKey: ['users', '123'] });

// Reset to initial state
queryClient.resetQueries({ queryKey: ['users'] });
```

## API Client Pattern

```typescript
// lib/api-client.ts
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error.code
      );
    }

    return response.json();
  }

  // Users
  getUsers(params?: { status?: string }) {
    const searchParams = new URLSearchParams(params as any);
    return this.request<User[]>(`/users?${searchParams}`);
  }

  getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  createUser(data: CreateUserInput) {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateUser(id: string, data: UpdateUserInput) {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient('/api');

// hooks/use-users.ts
export const useUsers = (params?: { status?: string }) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => api.getUsers(params),
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ['users', id],
    queryFn: () => api.getUser(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
```

## SWR Alternative

```typescript
// Basic SWR usage (lighter alternative to React Query)
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    id ? `/api/users/${id}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate, // For manual revalidation
  };
}

// Global configuration
import { SWRConfig } from 'swr';

function App({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
```
