---
name: nextjs-react-debugging
description: "Framework-specific debugging for Next.js App Router and React. Covers hydration mismatches (6 common causes), server/client boundary errors, the 4 Next.js caches and stale data debugging, Suspense/error boundary issues, server action debugging, build vs dev differences, middleware debugging, and CSS/Tailwind in Next.js. Use when: (1) Hydration errors appear, (2) 'Cannot use X in Server Component', (3) Data is stale/cached, (4) Server actions don't work, (5) Build fails but dev works, (6) Middleware redirect loops, (7) Suspense fallback stuck"
---

# Next.js & React Debugging

Framework-specific debugging guide for Next.js App Router and React failure modes. This skill covers problems unique to the framework — hydration, server/client boundaries, caching, and server actions.

**Related skills**: Use `ui-feature-debugging` for general UI symptom diagnosis. Use `browser-devtools-for-ui-debugging` for DevTools techniques. Use `next-js-app-router` for building correctly (this skill is for when things break).

---

## Table of Contents

1. [Hydration Debugging](#1-hydration-debugging)
2. [Server/Client Boundary Errors](#2-serverclient-boundary-errors)
3. [Caching & Stale Data](#3-caching--stale-data)
4. [Suspense & Error Boundaries](#4-suspense--error-boundaries)
5. [Server Action Debugging](#5-server-action-debugging)
6. [Build vs Dev Differences](#6-build-vs-dev-differences)
7. [Middleware Debugging](#7-middleware-debugging)
8. [CSS & Tailwind in Next.js](#8-css--tailwind-in-nextjs)
9. [Quick Reference Table](#9-quick-reference-table)

---

## 1. Hydration Debugging

Hydration errors occur when the server-rendered HTML doesn't match what React expects on the client. The error message typically says: **"Hydration failed because the initial UI does not match what was rendered on the server."**

### The 6 Common Causes

#### 1. Browser-Only APIs Used During Render

```tsx
// ❌ window/document don't exist on the server
export default function Component() {
  const width = window.innerWidth; // Crashes on server, or different on client
  return <div>{width > 768 ? 'Desktop' : 'Mobile'}</div>;
}

// ✅ Use useEffect for browser APIs
export default function Component() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  return <div>{width > 768 ? 'Desktop' : 'Mobile'}</div>;
}

// ✅ Or use dynamic import with ssr: false
const BrowserOnlyComponent = dynamic(() => import('./BrowserOnly'), {
  ssr: false,
});
```

#### 2. Date/Time and Timezone Differences

```tsx
// ❌ Server renders with server timezone, client with user timezone
export default function Component() {
  return <span>{new Date().toLocaleString()}</span>;
  // Server: "2/7/2026, 3:00:00 PM" (UTC)
  // Client: "2/7/2026, 10:00:00 AM" (EST) → MISMATCH
}

// ✅ Render dates only on client
export default function Component() {
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    setDate(new Date().toLocaleString());
  }, []);
  return <span>{date || 'Loading...'}</span>;
}

// ✅ Or use suppressHydrationWarning for timestamps
<time suppressHydrationWarning>{new Date().toISOString()}</time>
```

#### 3. Browser Extensions Injecting DOM Nodes

```
Symptom: Hydration error only on YOUR machine, not in CI or other browsers
Cause: Browser extensions (Grammarly, ad blockers, password managers) inject
       <span>, <div>, or <style> elements into the page

Diagnosis:
  1. Test in Incognito mode (extensions disabled)
  2. If it works in Incognito → extension is the cause
  3. Nothing to fix in your code — but you can:
     - Use suppressHydrationWarning on affected elements
     - Ignore if only happening locally with extensions
```

#### 4. Auth-Conditional Rendering

```tsx
// ❌ Server has no session → renders logged-out state
// Client has session → renders logged-in state → MISMATCH
export default function Nav() {
  const { user } = useAuth();
  return user ? <UserMenu /> : <LoginButton />;
}

// ✅ Use loading state to avoid mismatch
export default function Nav() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <NavSkeleton />;
  return user ? <UserMenu /> : <LoginButton />;
}

// ✅ Or render auth-dependent content only on client
'use client';
export default function Nav() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <NavSkeleton />;
  // Now safe to render auth-dependent content
}
```

#### 5. HTML Nesting Violations

```tsx
// ❌ Invalid HTML nesting — browser fixes it, React doesn't expect the fix
<p><div>This is invalid</div></p>     // <div> can't be inside <p>
<a href="/"><a href="/">Nested link</a></a>  // Links can't nest
<table><div>Row</div></table>          // Must use <tr>/<td>

// The browser auto-corrects invalid nesting, creating a DOM that
// doesn't match what React rendered on the server

// ✅ Fix the HTML structure
<div><div>This is valid</div></div>
<div><a href="/">Single link</a></div>
<table><tbody><tr><td>Row</td></tr></tbody></table>
```

#### 6. Random/Non-Deterministic Values

```tsx
// ❌ Different value on server vs client
export default function Component() {
  const id = Math.random().toString(36); // Different each render!
  return <div id={id}>Content</div>;
}

// ✅ Use useId for unique IDs
import { useId } from 'react';
export default function Component() {
  const id = useId(); // Deterministic, same on server and client
  return <div id={id}>Content</div>;
}
```

### Hydration Debugging Steps

```
1. Read the error message carefully
   → It often tells you what the mismatch is:
     "Expected server HTML to contain a matching <div> in <p>"
     "Text content did not match. Server: 'X' Client: 'Y'"

2. Check: does the error disappear in Incognito?
   YES → Browser extension is the cause.
   NO  → Continue.

3. Check: is the component using browser APIs (window, document, localStorage)?
   YES → Move to useEffect or dynamic import with ssr:false.
   NO  → Continue.

4. Check: is the component rendering dates, random values, or user-specific data?
   YES → Use useEffect for client-only rendering, or suppressHydrationWarning.
   NO  → Continue.

5. Check: is there invalid HTML nesting?
   → View Page Source → compare with client DOM in Elements panel.
   → Look for <div> inside <p>, nested <a>, etc.

6. Nuclear option: suppressHydrationWarning
   → Only for leaf elements where mismatch is expected (timestamps, etc.)
   → Do NOT use broadly — it hides real bugs.
```

---

## 2. Server/Client Boundary Errors

### "Cannot use X in Server Component"

```
Error: You're importing a component that needs useState/useEffect/onClick.
It only works in a Client Component but none of its parents are marked with
"use client", so they're Server Components by default.
```

**Fix**: Add `'use client'` directive at the top of the file that uses client features:

```tsx
// ❌ Server component (default) trying to use client features
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0); // Error!
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ Mark as client component
'use client';
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**What requires `'use client'`**:
- `useState`, `useEffect`, `useRef`, `useContext`, any React hooks
- Event handlers: `onClick`, `onChange`, `onSubmit`
- Browser APIs: `window`, `document`, `localStorage`
- Class components with lifecycle methods
- Libraries that use any of the above

### Async Client Component Error

```tsx
// ❌ Client components CANNOT be async
'use client';
export default async function Dashboard() {
  const data = await fetchData(); // Error!
  return <div>{data.title}</div>;
}
// Error: "async/await is not yet supported in Client Components"

// ✅ Fetch data in a Server Component parent, pass as props
// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData();
  return <Dashboard data={data} />;
}

// Dashboard.tsx (Client Component)
'use client';
export default function Dashboard({ data }) {
  // Use hooks, event handlers, etc. with pre-fetched data
  return <div>{data.title}</div>;
}

// ✅ Or fetch client-side with useEffect / TanStack Query
'use client';
export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  if (!data) return <Loading />;
  return <div>{data.title}</div>;
}
```

### Serialization Errors

```
Error: Only plain objects, and a few built-ins, can be passed to Client Components
from Server Components. Classes or null prototypes are not supported.
```

```tsx
// ❌ Can't pass functions, classes, or Date objects as props to client components
// Server Component
export default function Page() {
  return <ClientComponent
    onClick={() => {}} // ❌ Functions can't be serialized
    date={new Date()}   // ❌ Date objects can't be serialized
    regex={/test/}      // ❌ RegExp can't be serialized
  />;
}

// ✅ Pass serializable data, handle the rest on the client
export default function Page() {
  return <ClientComponent
    dateString={new Date().toISOString()} // ✅ String
    pattern="test"                         // ✅ String
  />;
}

// Client component creates functions and complex objects locally
'use client';
export function ClientComponent({ dateString, pattern }) {
  const date = new Date(dateString);
  const regex = new RegExp(pattern);
  const handleClick = () => { /* ... */ };
  // ...
}
```

### The Boundary Rules

```
Server Component (default)         Client Component ('use client')
─────────────────────────          ─────────────────────────────
✅ async/await                     ❌ async/await in component body
✅ Direct database queries         ✅ useState, useEffect, hooks
✅ Access filesystem               ✅ Event handlers (onClick, etc.)
✅ Server-only secrets             ✅ Browser APIs
✅ Import server-only modules      ✅ Third-party client libraries
❌ useState, useEffect, hooks      ❌ Direct database queries
❌ Event handlers                  ❌ Server-only secrets
❌ Browser APIs                    ❌ Import server-only modules

IMPORTANT: A Client Component CAN render Server Components passed as children:

// ✅ This works — Server Component passed as children
<ClientLayout>
  <ServerComponent />  {/* This stays a server component! */}
</ClientLayout>

// ❌ This doesn't work — importing Server Component in Client Component
'use client';
import ServerComponent from './ServerComponent';
// ServerComponent becomes a Client Component when imported here
```

### Splitting Patterns

```tsx
// Pattern: Keep server logic in server components, extract interactivity

// page.tsx — Server Component (fetches data)
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id); // Server-side fetch
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} /> {/* Client component */}
    </div>
  );
}

// AddToCartButton.tsx — Client Component (handles interaction)
'use client';
export function AddToCartButton({ productId }: { productId: string }) {
  const [adding, setAdding] = useState(false);
  const handleClick = async () => {
    setAdding(true);
    await addToCart(productId);
    setAdding(false);
  };
  return <button onClick={handleClick} disabled={adding}>Add to Cart</button>;
}
```

---

## 3. Caching & Stale Data

### The 4 Next.js Caches (For Debugging, Not Building)

When your data is stale, one of these caches is holding old data:

```
Cache Layer            Where It Lives    What It Caches              How to Bust It
─────────────────────  ────────────────  ─────────────────────────   ─────────────────────
1. Request Memoization Server (per req)  Duplicate fetch() in one    Automatic (per request)
                                         request lifecycle
2. Data Cache          Server (durable)  fetch() responses across    revalidateTag(),
                                         requests                    revalidatePath(),
                                                                     { cache: 'no-store' }
3. Full Route Cache    Server (durable)  Rendered HTML + RSC         revalidatePath(),
                                         payload for static routes   { dynamic: 'force-dynamic' }
4. Router Cache        Client (session)  RSC payload for visited     router.refresh(),
                                         routes in browser session   revalidatePath() from SA
```

### "My Data Is Stale" Decision Tree

```
Is the stale data on a page you've visited before in this session?
├── YES → Likely Router Cache (client-side)
│   Fix: router.refresh() or revalidatePath() in a Server Action
│
└── NO → Is this a static page (no dynamic functions)?
    ├── YES → Likely Full Route Cache
    │   Fix: revalidatePath('/the-page') or add { dynamic: 'force-dynamic' }
    │
    └── NO → Is the stale data from a fetch() call?
        ├── YES → Likely Data Cache
        │   Fix: fetch(url, { next: { revalidate: 0 } }) or { cache: 'no-store' }
        │   Or: revalidateTag('tag-name') in Server Action after mutation
        │
        └── NO → Check if the data is computed/transformed and memoized
            Fix: Check useMemo dependencies, or server-side memoization
```

### Debugging Specific Cache Issues

**Data Cache — fetch results are stale**:
```tsx
// Check: is your fetch cached?
const res = await fetch('https://api.example.com/data');
// ⚠️  VERSION MATTERS:
// Next.js 13-14: fetch results ARE cached by default (Data Cache)
// Next.js 15+:   fetch is NO LONGER cached by default (cache: 'no-store' is default)
// Check your Next.js version in package.json to know the default behavior

// To confirm it's a cache issue:
const res = await fetch('https://api.example.com/data', {
  cache: 'no-store' // Bypasses Data Cache entirely
});
// If data is now fresh → it was the Data Cache

// Proper fix: use revalidation
// Option A: Time-based
const res = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 } // Revalidate every 60 seconds
});

// Option B: On-demand (after mutations)
// In your Server Action:
import { revalidateTag } from 'next/cache';
async function updateData() {
  'use server';
  await db.update(...);
  revalidateTag('data'); // Invalidate cache
}
// In your fetch:
const res = await fetch('https://api.example.com/data', {
  next: { tags: ['data'] }
});
```

**Router Cache — navigating back shows old data**:
```tsx
// The client caches visited routes for 30s (dynamic) or 5min (static)
// After a mutation, the user navigates back and sees old data

// Fix: Call revalidatePath in your Server Action
import { revalidatePath } from 'next/cache';
async function deleteItem(id: string) {
  'use server';
  await db.delete(id);
  revalidatePath('/items'); // Clears both server and client cache for this path
}

// Or force a client-side refresh
'use client';
import { useRouter } from 'next/navigation';
const router = useRouter();
router.refresh(); // Clears Router Cache and refetches from server
```

**Full Route Cache — static page never updates**:
```tsx
// Static routes are fully rendered at build time and cached
// Check: does your page use any dynamic functions?
//   cookies(), headers(), searchParams, unstable_noStore()

// If NO dynamic functions → page is STATIC and cached at build time
// Fix: Add dynamism or revalidation

// Option A: Force dynamic rendering
export const dynamic = 'force-dynamic';

// Option B: Revalidate on a schedule
export const revalidate = 60; // ISR: revalidate every 60 seconds

// Option C: Revalidate on demand
// Call revalidatePath('/this-page') from a Server Action after mutations
```

---

## 4. Suspense & Error Boundaries

### Suspense Fallback Stuck Showing

```
Symptom: Loading spinner/skeleton shows forever

Causes:
1. The async operation inside never resolves
   → Check Network tab: is a request pending/hanging?
   → Check server logs: is there an error thrown but caught?

2. The promise rejects instead of resolving
   → Suspense shows fallback until promise resolves
   → If promise rejects, it's an ERROR, not a loading state
   → You need an error.tsx to catch it

3. Nested Suspense — wrong boundary catches it
   → Inner Suspense shows its fallback
   → But the data promise is thrown above the inner boundary
```

**Debugging**:
```
1. Add console.log to the async function:
   console.log('Starting fetch...');
   const data = await fetchData();
   console.log('Fetch complete:', data); // Does this ever log?

2. Check Network tab:
   - Is the request pending (spinner in status column)?
   - Did the request fail? (check for red status)

3. Wrap in try/catch temporarily:
   try {
     const data = await fetchData();
     return <Component data={data} />;
   } catch (e) {
     console.error('CAUGHT:', e); // See the actual error
     throw e; // Re-throw for error boundary
   }
```

### error.tsx Not Catching

```
CRITICAL: error.tsx catches errors in the same segment's page.tsx,
but NOT in the same segment's layout.tsx.

app/
  dashboard/
    layout.tsx     ← Errors here are NOT caught by error.tsx below
    page.tsx       ← Errors here ARE caught by error.tsx below
    error.tsx      ← Catches page.tsx errors only

To catch layout errors, error.tsx must be ONE LEVEL UP:
app/
  error.tsx        ← This catches dashboard/layout.tsx errors
  dashboard/
    layout.tsx
    page.tsx
    error.tsx      ← This catches dashboard/page.tsx errors
```

**error.tsx requirements**:
```tsx
// error.tsx MUST be a Client Component
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error
  console.error('Error boundary caught:', error);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### loading.tsx Not Showing

```
Symptom: No loading UI appears during navigation

Causes:
1. loading.tsx is in the wrong directory
   → It must be in the SAME directory as page.tsx it covers
   → app/dashboard/loading.tsx covers app/dashboard/page.tsx

2. Page is not async / doesn't trigger Suspense
   → loading.tsx works by wrapping page.tsx in <Suspense>
   → If page.tsx is synchronous, loading never shows

3. Data fetching is in layout.tsx, not page.tsx
   → loading.tsx wraps page.tsx, not layout.tsx
   → Layout data fetching doesn't trigger the loading fallback

4. Soft navigation (Link) vs hard navigation
   → loading.tsx shows during client-side navigation (Link component)
   → Full page loads show the browser's own loading indicator
```

### not-found.tsx and `notFound()` Issues

```tsx
// notFound() triggers the nearest not-found.tsx boundary

// ❌ Custom 404 not rendering
// Cause 1: not-found.tsx is in wrong location
app/
  not-found.tsx          // ← Handles root-level 404s
  dashboard/
    not-found.tsx        // ← Handles /dashboard/* 404s
    [id]/
      page.tsx           // notFound() here uses dashboard/not-found.tsx

// Cause 2: notFound() called but page still shows content
// Make sure notFound() is called BEFORE the return statement
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) {
    notFound(); // This throws — code below doesn't run
  }
  return <div>{item.title}</div>;
}

// Cause 3: not-found.tsx must be a valid React component
// It gets no props (unlike error.tsx which gets error + reset)
export default function NotFound() {
  return <div>Page not found</div>;
}

// Cause 4: Dynamic 404 for API routes — use NextResponse
// app/api/items/[id]/route.ts
export async function GET(request: Request, { params }) {
  const item = await getItem(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}
```

### Route Handler (API Route) Debugging

```tsx
// app/api/items/route.ts

// ❌ GET handler returning stale data
// GET route handlers are CACHED by default in Next.js 13-14
// (Same version caveat as fetch — Next.js 15 changed defaults)
export async function GET() {
  const items = await db.items.findMany(); // May be cached!
  return NextResponse.json(items);
}

// ✅ Opt out of caching for dynamic data
export const dynamic = 'force-dynamic';
// or
export const revalidate = 0;

// ❌ POST handler: request body not parsed
export async function POST(request: Request) {
  const body = request.body; // ← This is a ReadableStream, not JSON!
}

// ✅ Parse the body correctly
export async function POST(request: Request) {
  const body = await request.json();    // For JSON body
  // const formData = await request.formData(); // For form data
  // const text = await request.text();         // For plain text
}

// ❌ Route handler returns HTML instead of JSON
export async function GET() {
  return new Response(data); // No content-type header!
}

// ✅ Use NextResponse.json() for JSON APIs
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json(data); // Sets content-type: application/json
}

// ❌ Route handler not found (404)
// Check: file must be named route.ts (not route.tsx, not handler.ts)
// Check: file must export named functions (GET, POST, PUT, DELETE, PATCH)
// Check: route.ts and page.tsx CANNOT coexist in the same directory
```

---

## 5. Server Action Debugging

### Missing `'use server'`

```tsx
// ❌ Function looks like a server action but isn't
async function createItem(formData: FormData) {
  // This runs on the CLIENT — no server access!
  const db = await getDb(); // Will fail on client
}

// ✅ Add 'use server' directive
async function createItem(formData: FormData) {
  'use server';
  const db = await getDb(); // Runs on server
}

// Or at file level:
// actions.ts
'use server';

export async function createItem(formData: FormData) {
  // All functions in this file are server actions
}
```

### Form `action=` vs `onSubmit`

```tsx
// ✅ Server Actions work with form action attribute
<form action={createItem}>
  <input name="title" />
  <button type="submit">Create</button>
</form>

// ❌ Server Actions don't work with onSubmit
<form onSubmit={createItem}> {/* This is client-side! */}

// ✅ If you need client-side logic BEFORE the server action:
'use client';
function Form() {
  const handleSubmit = async (formData: FormData) => {
    // Client-side validation first
    if (!formData.get('title')) return alert('Title required');
    // Then call server action
    await createItem(formData);
  };
  return <form action={handleSubmit}>...</form>;
}
```

### Revalidation Not Firing After Server Action

```tsx
// ❌ Data updates but page doesn't refresh
async function deleteItem(id: string) {
  'use server';
  await db.items.delete(id);
  // Page still shows the deleted item!
}

// ✅ Revalidate after mutation
import { revalidatePath } from 'next/cache';
async function deleteItem(id: string) {
  'use server';
  await db.items.delete(id);
  revalidatePath('/items'); // NOW the page refreshes
}

// ✅ For more targeted revalidation:
import { revalidateTag } from 'next/cache';
async function deleteItem(id: string) {
  'use server';
  await db.items.delete(id);
  revalidateTag('items'); // Revalidates all fetches tagged 'items'
}
```

### useActionState for Return Values

```tsx
// Problem: How to get data BACK from a Server Action?
// Server Actions called via form action= don't return values to the client

// ✅ Use useActionState (React 19) / useFormState (older)
'use client';
import { useActionState } from 'react';

function Form() {
  const [state, formAction, isPending] = useActionState(createItem, null);

  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-500">Created!</p>}
    </form>
  );
}

// Server Action returns state
async function createItem(prevState: any, formData: FormData) {
  'use server';
  try {
    await db.items.create({ title: formData.get('title') as string });
    revalidatePath('/items');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to create item' };
  }
}
```

### Server Action Error: "Cannot find module"

```
This usually means:
1. The server action file doesn't have 'use server' at the top
2. The function isn't exported
3. The import path is wrong

Check:
  - File starts with 'use server'; (as first line, with quotes and semicolon)
  - Function is exported: export async function myAction()
  - Import path is correct: import { myAction } from '@/app/actions';
```

---

## 6. Build vs Dev Differences

### TypeScript Strict Mode

```
Dev: TypeScript errors are warnings (page still renders)
Build: TypeScript errors FAIL the build

Fix: Run `npm run build` locally before deploying
Common issues:
  - Implicit 'any' parameters
  - Unused variables/imports
  - Missing return types on async functions
  - Type assertions that are wrong
```

### Case-Sensitive Imports

```
Mac filesystem: case-INSENSITIVE (development)
Linux filesystem: case-SENSITIVE (production/CI)

// This works on Mac but fails on Linux:
import { Button } from './button';  // File is actually ./Button.tsx

Fix: Match the EXACT case of the filename
Lint: eslint-plugin-import can catch this
```

### Environment Variables

```
CRITICAL: Client-side env vars MUST start with NEXT_PUBLIC_

Server-only (available in Server Components, API routes, server actions):
  DATABASE_URL=...
  API_SECRET=...

Client + Server (available everywhere, including browser):
  NEXT_PUBLIC_API_URL=...
  NEXT_PUBLIC_STRIPE_KEY=...

Common bug:
  .env: API_URL=https://api.example.com
  Client code: process.env.API_URL → undefined in browser!
  Fix: Rename to NEXT_PUBLIC_API_URL

Check what's available:
  Server: console.log(process.env.MY_VAR) in a server component
  Client: console.log(process.env.NEXT_PUBLIC_MY_VAR) in a client component
```

### Async Params and SearchParams (Next.js 15+)

```tsx
// ❌ Next.js 15 changed params/searchParams to be async — this breaks:
export default function Page({ params, searchParams }) {
  const { id } = params;              // Error in Next.js 15!
  const { q } = searchParams;         // Error in Next.js 15!
}

// ✅ Next.js 15+: await params and searchParams
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const { q } = await searchParams;
}

// Also applies to:
// - generateMetadata({ params }) → await params
// - layout.tsx({ params }) → await params
// - route.ts handlers({ params }) → await params

// Error message you'll see:
// "params should be awaited before using its properties"
// or runtime error accessing .id on a Promise object
```

### Build Locally Before Deploy

```bash
# This catches 90% of "works in dev, fails in production" issues
npm run build

# Common build-only failures:
# - TypeScript errors (strict mode)
# - Missing dependencies (dev vs prod deps)
# - Case-sensitive import paths
# - Dynamic imports that break static analysis
# - Environment variables not available at build time
# - Tailwind classes purged (see Section 8)
# - Async params/searchParams not awaited (Next.js 15+)
```

---

## 7. Middleware Debugging

### Middleware Not Running

```tsx
// middleware.ts must be at the PROJECT ROOT (next to package.json)
// NOT in src/ (unless you have the src directory configured)

// ❌ Wrong location
src/middleware.ts       // Won't run unless using src/ directory
app/middleware.ts       // Won't run — wrong location

// ✅ Correct locations
middleware.ts           // Project root (default)
src/middleware.ts       // Only if using src/ directory structure
```

**Matcher config issues**:
```tsx
// middleware.ts
export const config = {
  matcher: [
    // ❌ This pattern might not match what you expect
    '/dashboard',        // Only matches exactly /dashboard, NOT /dashboard/settings

    // ✅ Match all paths under /dashboard
    '/dashboard/:path*',

    // ✅ Match everything except static files and API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Debugging: Add a console.log to confirm middleware runs
export function middleware(request: NextRequest) {
  console.log('MIDDLEWARE:', request.nextUrl.pathname);
  // This logs to the SERVER terminal, not browser console
}
```

### Redirect Loops

```
Symptom: ERR_TOO_MANY_REDIRECTS

Common pattern:
  1. User hits /dashboard
  2. Middleware: not authenticated → redirect to /login
  3. User hits /login
  4. Middleware: already authenticated → redirect to /dashboard
  5. GOTO 1 → infinite loop

Fix: Check public routes BEFORE auth check:
```

```tsx
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Check public routes FIRST — no auth check needed
  const publicPaths = ['/login', '/signup', '/forgot-password', '/api/auth'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next(); // Don't redirect, don't check auth
  }

  // Now check auth for protected routes
  const token = request.cookies.get('session');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### Cookie Handling in Middleware

```tsx
// Reading cookies
const token = request.cookies.get('session-token');
// token = { name: 'session-token', value: '...' } or undefined

// Setting cookies on response
const response = NextResponse.next();
response.cookies.set('visited', 'true', {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 1 day
});
return response;

// Common mistake: modifying request cookies doesn't persist
// You must set cookies on the RESPONSE object
```

### Middleware Debugging Tips

```
1. Middleware logs go to the SERVER terminal, not browser console
   → Look at the terminal running `npm run dev`

2. Middleware runs on EVERY matched request, including:
   → Page navigations
   → API route calls
   → Static file requests (unless excluded by matcher)
   → Prefetch requests from <Link>

3. Middleware runs on the Edge Runtime (limited Node.js APIs)
   → No fs, no child_process, no full Node.js
   → Limited to Web APIs (fetch, Request, Response, crypto)

4. To skip middleware for certain paths:
   → Use the matcher config (most efficient)
   → Or check pathname at start of middleware function
```

---

## 8. CSS & Tailwind in Next.js

### Dynamic Class Purging

```tsx
// ❌ Dynamic class names get PURGED in production
// Tailwind scans files at BUILD TIME for class names
// It can't detect dynamically constructed classes
const color = 'red';
<div className={`text-${color}-500`}>  // "text-red-500" not in source → purged!

// ✅ Use complete class names
const colorClasses = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
};
<div className={colorClasses[color]}>  // Full class name in source → kept!

// ✅ Or use safelist in tailwind.config
module.exports = {
  safelist: [
    'text-red-500',
    'text-blue-500',
    { pattern: /bg-(red|blue|green)-(100|500|900)/ },
  ],
};
```

### Content Config

```js
// tailwind.config.js — make sure all file paths are covered
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // ❌ Missing path = classes in those files get purged
    // Common miss: shared UI library, imported components
  ],
};

// If using a component library from node_modules:
content: [
  // ...
  './node_modules/@myorg/ui/**/*.{js,ts,jsx,tsx}',
],
```

### CSS Import Order

```tsx
// Next.js App Router: CSS imports in layout.tsx apply to all child routes
// Order matters — later imports override earlier ones

// app/layout.tsx
import '@/styles/globals.css';      // Base styles (Tailwind directives)
import '@/styles/design-system.css'; // Design tokens
// Component-level styles are scoped by CSS modules

// ❌ Problem: Tailwind utility classes overridden by component CSS
// Fix: Ensure @tailwind utilities is LAST in globals.css:
// @tailwind base;
// @tailwind components;
// @tailwind utilities;  ← Must be last to override component styles
```

### Responsive Mobile-First Gotchas

```tsx
// Tailwind is MOBILE-FIRST
// Unprefixed classes apply to ALL screen sizes
// Prefixed classes apply at that breakpoint AND ABOVE

// sm: = 640px and UP (not "small screens"!)
// md: = 768px and UP
// lg: = 1024px and UP

// ❌ Wrong mental model: "sm means small screens"
<div className="block sm:hidden">  // Visible below 640px, HIDDEN at 640px+
// This means: show on mobile, hide on tablet+

// ❌ Common mistake: desktop-first thinking
<div className="flex sm:block md:flex">
// Confusing! Start from mobile and add breakpoints up:

// ✅ Mobile-first thinking:
<div className="block md:flex">  // Stack on mobile, flex on desktop
<div className="text-sm md:text-base lg:text-lg">  // Size scales up
<div className="p-4 md:p-6 lg:p-8">  // Padding scales up
```

### Server Component CSS Limitations

```
Server Components support:
  ✅ Tailwind classes (className="...")
  ✅ CSS Modules (import styles from './page.module.css')
  ✅ Global CSS (imported in layout.tsx)

Server Components do NOT support:
  ❌ CSS-in-JS (styled-components, emotion) at runtime
  ❌ Inline styles with dynamic values from state

If you need CSS-in-JS → mark the component as 'use client'
```

---

## 9. Quick Reference Table

| Symptom | Check First | Check Second | Check Third |
|---------|-------------|-------------|-------------|
| Hydration mismatch | Browser APIs in render? | Date/time values? | HTML nesting valid? |
| "Cannot use X in Server Component" | Missing `'use client'`? | Function imported wrong? | Using hooks in server code? |
| "async/await not supported in Client" | Remove async from client component | Fetch in server parent, pass as props | Use useEffect for client fetch |
| Data is stale | `fetch` cache option? (check Next.js version!) | `revalidatePath` called? | Router Cache (client)? |
| Server Action does nothing | `'use server'` directive? | Using `action=` not `onSubmit`? | Is function exported? |
| Build fails, dev works | `npm run build` locally | Case-sensitive imports? | Env vars set? |
| `params` is a Promise | Next.js 15+: `await params` | Update type to `Promise<...>` | Check generateMetadata too |
| Middleware doesn't run | File in project root? | Matcher config correct? | Console.log (server terminal)? |
| Redirect loop | Public routes checked first? | Auth check ordering? | Cookie domain correct? |
| Suspense stuck on loading | Promise resolving? | Network request pending? | Error thrown but no error.tsx? |
| error.tsx doesn't catch | Error in layout (not page)? | error.tsx one level up? | Is it `'use client'`? |
| Custom 404 not showing | not-found.tsx in right dir? | `notFound()` before return? | Valid component export? |
| Route handler 404 | File named `route.ts`? | Exports GET/POST? | No page.tsx in same dir? |
| CSS classes missing in prod | Dynamic class names? | Content config paths? | Safelist needed? |
| Blank page | Console errors? | View Page Source has HTML? | Error boundary missing? |
| "Module not found" (server action) | `'use server'` at top of file? | Function exported? | Import path correct? |
| Cookie not set | Set on response (not request)? | Domain/path correct? | SameSite/Secure flags? |
| `useSearchParams` error | Wrapped in `<Suspense>`? | In client component? | Dynamic route segment? |

### When to Escalate to Related Skills

- **General UI symptom (button, form, data)** → `ui-feature-debugging`
- **Need DevTools help** → `browser-devtools-for-ui-debugging`
- **Auth/session issue** → `supabase-auth-debugging`
- **Building new features correctly** → `next-js-app-router`
- **Production ops/infra** → `production-debugging-playbook`
