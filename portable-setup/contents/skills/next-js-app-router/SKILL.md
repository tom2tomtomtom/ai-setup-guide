---
name: next-js-app-router
description: Implements Next.js App Router patterns with server components, data fetching, caching strategies, and metadata API; use when building Next.js 13+ applications
---

# Next.js App Router

Comprehensive guide for building applications with Next.js App Router (Next.js 13+), covering server and client components, data fetching patterns, caching strategies, routing conventions, and production best practices.

## When to Use This Skill

Use when:
- Building new Next.js applications with App Router
- Migrating from Pages Router to App Router
- Implementing server-side rendering and streaming
- Optimizing data fetching and caching
- Managing metadata and SEO
- Handling loading and error states
- Implementing parallel or intercepting routes
- Debugging App Router caching issues
- Understanding server vs client component boundaries

## Core Concepts

### Server Components vs Client Components

**Server Components (default):**
- Render on the server only
- Can directly access backend resources (databases, APIs)
- Cannot use React hooks (useState, useEffect, etc.)
- Cannot use browser APIs
- Reduce client-side JavaScript bundle
- Better for SEO and initial page load

**Client Components:**
- Marked with `'use client'` directive
- Can use React hooks and browser APIs
- Run on both server (SSR) and client (hydration)
- Required for interactivity
- Increase bundle size

### Component Decision Tree

```
Does it need interactivity (onClick, onChange, etc.)? 
  → YES: Client Component

Does it use React hooks (useState, useEffect, etc.)?
  → YES: Client Component

Does it use browser APIs (window, localStorage, etc.)?
  → YES: Client Component

Does it need to access backend directly (database, filesystem)?
  → YES: Server Component

Does it just display data?
  → Server Component (default, better performance)
```

## File Structure & Routing

### App Directory Structure

```
app/
├── layout.tsx              # Root layout (required)
├── page.tsx                # Home page (/)
├── loading.tsx             # Loading UI
├── error.tsx               # Error UI
├── not-found.tsx           # 404 page
├── globals.css             # Global styles
│
├── blog/
│   ├── layout.tsx          # Blog layout
│   ├── page.tsx            # /blog
│   ├── [slug]/
│   │   └── page.tsx        # /blog/post-slug
│   └── loading.tsx         # Blog loading state
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx            # /dashboard
│   ├── settings/
│   │   └── page.tsx        # /dashboard/settings
│   └── @analytics/         # Parallel route
│       └── page.tsx
│
└── api/
    └── users/
        └── route.ts        # API route /api/users
```

### File Conventions

**Special Files:**
- `layout.tsx` - Shared UI that wraps pages
- `page.tsx` - Unique UI for a route (makes route publicly accessible)
- `loading.tsx` - Loading UI (automatic Suspense boundary)
- `error.tsx` - Error UI (automatic Error boundary)
- `not-found.tsx` - 404 UI
- `template.tsx` - Similar to layout but re-renders on navigation
- `route.ts` - API endpoints (Route Handlers)

**Metadata Files:**
- `opengraph-image.tsx` - OG image
- `icon.tsx` - Favicon
- `sitemap.ts` - Sitemap
- `robots.ts` - Robots.txt

### Dynamic Routes

**Single dynamic segment:**
```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return <h1>Post: {params.slug}</h1>
}
```

**Catch-all segments:**
```typescript
// app/shop/[...slug]/page.tsx
// Matches: /shop/a, /shop/a/b, /shop/a/b/c

export default function ShopPage({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  return <div>Path: {params.slug.join('/')}</div>
}
```

**Optional catch-all:**
```typescript
// app/shop/[[...slug]]/page.tsx
// Matches: /shop, /shop/a, /shop/a/b

export default function ShopPage({ 
  params 
}: { 
  params: { slug?: string[] } 
}) {
  return <div>Path: {params.slug?.join('/') || 'home'}</div>
}
```

## Server Components

### Data Fetching in Server Components

**Direct database access:**
```typescript
// app/posts/page.tsx
import { db } from '@/lib/db'

export default async function PostsPage() {
  // This runs on the server only
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

**Fetch with caching:**
```typescript
// app/blog/[slug]/page.tsx
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    // Cache for 1 hour
    next: { revalidate: 3600 }
  })
  
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

**Parallel data fetching:**
```typescript
// Fetch multiple data sources in parallel
async function getPostData(slug: string) {
  // These run in parallel
  const [post, author, comments] = await Promise.all([
    fetch(`/api/posts/${slug}`).then(r => r.json()),
    fetch(`/api/authors/${slug}`).then(r => r.json()),
    fetch(`/api/comments/${slug}`).then(r => r.json())
  ])
  
  return { post, author, comments }
}

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { post, author, comments } = await getPostData(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <AuthorCard author={author} />
      <Comments comments={comments} />
    </article>
  )
}
```

### Streaming with Suspense

**Progressive rendering:**
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

async function SlowComponent() {
  // Simulate slow data fetch
  await new Promise(resolve => setTimeout(resolve, 3000))
  const data = await fetchSlowData()
  return <div>{data}</div>
}

async function FastComponent() {
  const data = await fetchFastData()
  return <div>{data}</div>
}

export default function Dashboard() {
  return (
    <div>
      {/* Shows immediately */}
      <h1>Dashboard</h1>
      
      {/* Shows fast */}
      <Suspense fallback={<div>Loading fast data...</div>}>
        <FastComponent />
      </Suspense>
      
      {/* Shows when ready, doesn't block page */}
      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
```

**Loading states:**
```typescript
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  )
}
```

## Client Components

### When to Use Client Components

**Interactive UI:**
```typescript
// app/components/Counter.tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Browser APIs:**
```typescript
// app/components/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    // Access localStorage (browser API)
    const saved = localStorage.getItem('theme') as 'light' | 'dark'
    if (saved) setTheme(saved)
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

**Event listeners:**
```typescript
// app/components/ScrollProgress.tsx
'use client'

import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress((scrolled / height) * 100)
    }
    
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])
  
  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-blue-500 transition-all"
      style={{ width: `${progress}%` }}
    />
  )
}
```

### Composition Pattern

**Server component with client children:**
```typescript
// app/posts/page.tsx (Server Component)
import ClientSearch from './ClientSearch'
import { db } from '@/lib/db'

export default async function PostsPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  // Server-side data fetching
  const posts = await db.post.findMany({
    where: searchParams.q ? {
      title: { contains: searchParams.q }
    } : undefined
  })
  
  return (
    <div>
      {/* Client component for interactivity */}
      <ClientSearch />
      
      {/* Server component for data display */}
      <div className="grid gap-4">
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
          </article>
        ))}
      </div>
    </div>
  )
}
```

```typescript
// app/posts/ClientSearch.tsx (Client Component)
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ClientSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/posts?q=${query}`)
  }
  
  return (
    <form onSubmit={handleSearch}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
      />
      <button type="submit">Search</button>
    </form>
  )
}
```

## Data Fetching Patterns

### Fetch Options

**Force cache (default):**
```typescript
// Cached indefinitely
fetch('https://api.example.com/data', {
  cache: 'force-cache'
})
```

**No caching:**
```typescript
// Fresh data on every request
fetch('https://api.example.com/data', {
  cache: 'no-store'
})
```

**Revalidate after time:**
```typescript
// Revalidate every 60 seconds
fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
})
```

**Tagged cache (for on-demand revalidation):**
```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  })
  return res.json()
}

// Later, revalidate from anywhere:
// revalidateTag('posts')
```

### Server Actions

**Form handling:**
```typescript
// app/posts/new/page.tsx
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

async function createPost(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  await db.post.create({
    data: { title, content }
  })
  
  revalidatePath('/posts')
  redirect('/posts')
}

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

**Progressive enhancement:**
```typescript
// app/posts/DeleteButton.tsx
'use client'

import { useTransition } from 'react'
import { deletePost } from './actions'

export default function DeleteButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition()
  
  return (
    <button
      onClick={() => startTransition(() => deletePost(postId))}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

```typescript
// app/posts/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function deletePost(postId: string) {
  await db.post.delete({
    where: { id: postId }
  })
  
  revalidatePath('/posts')
}
```

### Route Handlers

**GET endpoint:**
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get('limit') || '10'
  
  const posts = await db.post.findMany({
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(posts)
}

// Force dynamic (no caching)
export const dynamic = 'force-dynamic'
```

**POST endpoint:**
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content
      }
    })
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
```

**Dynamic route handler:**
```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db.post.findUnique({
    where: { id: params.id }
  })
  
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(post)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.post.delete({
    where: { id: params.id }
  })
  
  return NextResponse.json({ success: true })
}
```

## Caching Strategies

### Understanding Next.js Caching

**Four caching mechanisms:**

1. **Request Memoization** - Deduplicates requests in a single render
2. **Data Cache** - Persists fetch results across requests
3. **Full Route Cache** - Caches rendered routes at build time
4. **Router Cache** - Client-side cache of route segments

### Cache Control

**Opt out of caching:**
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {
  // Always fresh data
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  })
  
  return <div>{/* ... */}</div>
}
```

**Time-based revalidation:**
```typescript
// Revalidate every 60 seconds
export const revalidate = 60

export default async function Posts() {
  const posts = await fetch('https://api.example.com/posts')
  return <div>{/* ... */}</div>
}
```

**On-demand revalidation:**
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  // Revalidate specific path
  revalidatePath('/posts')
  
  // Or revalidate by tag
  revalidateTag('posts')
  
  return NextResponse.json({ revalidated: true })
}
```

**Cache busting:**
```typescript
// Force fresh data in a server component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store',
    // Or use cache tags for granular control
    next: { tags: ['data'] }
  })
  return res.json()
}
```

**Immediate cache expiration with updateTag (Server Actions only):**
```typescript
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })

  // Immediately expire cache (no stale-while-revalidate)
  updateTag('posts')
  updateTag(`post-${post.id}`)

  redirect(`/posts/${post.id}`)
}
```

**Refresh client router from Server Action:**
```typescript
'use server'

import { refresh } from 'next/cache'

export async function updatePost(formData: FormData) {
  await db.post.update({
    where: { id: formData.get('id') },
    data: { title: formData.get('title') }
  })

  // Refresh UI without full page reload
  refresh()
}
```

### The `use cache` Directive

Cache entire pages, layouts, or individual functions:

**Cache a page:**
```typescript
'use cache'

async function Users() {
  const users = await fetch('/api/users')
  // process users
}

export default async function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

**Cache a layout:**
```typescript
'use cache'

export default async function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

**Cache a function with cacheLife:**
```typescript
import { cacheLife } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheLife('hours')

  return await db.query('SELECT * FROM products')
}

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}
```

**Pass Server Actions through cached components:**
```typescript
// Page component
export default async function Page() {
  const performUpdate = async () => {
    'use server'
    await db.update(...)
  }

  return <CachedComponent performUpdate={performUpdate} />
}

// Cached component - don't call the action, just pass it through
async function CachedComponent({
  performUpdate,
}: {
  performUpdate: () => Promise<void>
}) {
  'use cache'
  return <ClientComponent action={performUpdate} />
}
```

## Layouts & Templates

### Root Layout

```typescript
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My App',
  description: 'App description'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>{/* Navigation */}</nav>
        <main>{children}</main>
        <footer>{/* Footer */}</footer>
      </body>
    </html>
  )
}
```

### Nested Layouts

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside className="w-64">
        {/* Sidebar */}
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
```

### Templates (Re-render on Navigation)

```typescript
// app/template.tsx
'use client'

import { useEffect } from 'react'

export default function Template({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // Runs on every route change
    console.log('Route changed')
  }, [])
  
  return <div>{children}</div>
}
```

## Metadata & SEO

### Static Metadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Post',
  description: 'Read our latest blog post',
  openGraph: {
    title: 'Blog Post',
    description: 'Read our latest blog post',
    images: ['/og-image.png'],
  }
}

export default function BlogPost() {
  return <article>{/* ... */}</article>
}
```

### Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(res => res.json())
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    }
  }
}

export default function BlogPost({ params }: Props) {
  return <article>{/* ... */}</article>
}
```

### JSON-LD Structured Data

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug)
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    image: post.coverImage,
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* ... */}</article>
    </>
  )
}
```

### Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  const postUrls = posts.map((post: any) => ({
    url: `https://mysite.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: 'https://mysite.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://mysite.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postUrls,
  ]
}
```

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to service (Sentry, etc.)
    console.error(error)
  }, [error])
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Not Found

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return <article>{post.title}</article>
}
```

```typescript
// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>Could not find the requested blog post.</p>
    </div>
  )
}
```

### Global Not Found

```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Could not find the requested page.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

## Navigation

### Link Component

```typescript
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

### Programmatic Navigation

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Login logic...
    router.push('/dashboard')
    // Or: router.replace('/dashboard') - no back history
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

### Shallow Routing (Update URL Without Navigation)

Update URL query parameters without triggering a full navigation:

```typescript
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    urlSearchParams.set('sort', sortOrder)
    window.history.pushState(null, '', `?${urlSearchParams.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

### Route Groups

```typescript
// Organize routes without affecting URL
app/
├── (marketing)/
│   ├── layout.tsx         # Marketing layout
│   ├── page.tsx           # /
│   └── about/
│       └── page.tsx       # /about
│
└── (shop)/
    ├── layout.tsx         # Shop layout
    ├── products/
    │   └── page.tsx       # /products
    └── cart/
        └── page.tsx       # /cart
```

### Parallel Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div>
      <div>{children}</div>
      <div className="grid grid-cols-2 gap-4">
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    </div>
  )
}
```

```
app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx
└── @team/
    └── page.tsx
```

### Intercepting Routes

```typescript
// app/photos/layout.tsx (Photo gallery with modal)
app/
├── photos/
│   ├── [id]/
│   │   └── page.tsx       # /photos/123 (full page)
│   └── (..)photos/
│       └── [id]/
│           └── page.tsx   # Modal when clicked from feed
└── feed/
    └── page.tsx
```

## Advanced Patterns

### Optimistic Updates

```typescript
'use client'

import { useOptimistic } from 'react'
import { addTodo } from './actions'

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )
  
  return (
    <div>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      
      <form
        action={async (formData) => {
          const text = formData.get('text') as string
          addOptimisticTodo({ id: Date.now(), text, done: false })
          await addTodo(text)
        }}
      >
        <input name="text" />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
```

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add custom header
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'value')
  
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

### Static Generation with Dynamic Paths

```typescript
// app/blog/[slug]/page.tsx

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

// Incremental Static Regeneration
export const revalidate = 3600 // Revalidate every hour

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug)
  return <article>{post.title}</article>
}
```

### Partial Prerendering (Experimental)

```typescript
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
}

// app/products/page.tsx
import { Suspense } from 'react'

export default function Products() {
  return (
    <div>
      {/* Static shell */}
      <h1>Products</h1>
      
      {/* Dynamic content with Suspense */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  )
}
```

## Common Mistakes & Solutions

### ❌ Using Client Component for Everything

```typescript
// ❌ Wrong: Client component at top level
'use client'

export default function Page() {
  return (
    <div>
      <StaticContent />
      <InteractiveButton />
    </div>
  )
}
```

```typescript
// ✅ Correct: Server component with client child
export default function Page() {
  return (
    <div>
      <StaticContent />  {/* Server component */}
      <InteractiveButton />  {/* Client component */}
    </div>
  )
}
```

### ❌ Importing Server-Only Code in Client Components

```typescript
// ❌ Wrong: Importing database in client component
'use client'

import { db } from '@/lib/db'  // Error!

export default function Component() {
  // Can't use db here
}
```

```typescript
// ✅ Correct: Use Server Actions
'use client'

import { getData } from './actions'

export default function Component() {
  const handleClick = async () => {
    const data = await getData()  // Server Action
  }
}
```

### ❌ Not Handling Loading States

```typescript
// ❌ Wrong: No loading state
export default async function Page() {
  const data = await slowFetch()  // Blocks entire page
  return <div>{data}</div>
}
```

```typescript
// ✅ Correct: Use Suspense
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  )
}
```

### ❌ Over-caching

```typescript
// ❌ Wrong: Cached user-specific data
export default async function Dashboard() {
  const user = await fetch('/api/user')  // Cached for all users!
  return <div>{user.name}</div>
}
```

```typescript
// ✅ Correct: Opt out for user-specific data
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const user = await fetch('/api/user', { cache: 'no-store' })
  return <div>{user.name}</div>
}
```

### ❌ Missing Error Boundaries

```typescript
// ❌ Wrong: No error handling
export default async function Page() {
  const data = await riskyFetch()  // What if it fails?
  return <div>{data}</div>
}
```

```typescript
// ✅ Correct: Add error.tsx
// app/error.tsx
'use client'

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image'

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority  // Load immediately
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### Script Optimization

```typescript
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/analytics.js"
        strategy="afterInteractive"  // Load after page is interactive
      />
      
      <Script
        src="https://example.com/widget.js"
        strategy="lazyOnload"  // Load when browser is idle
      />
    </>
  )
}
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})

# Analyze bundle
ANALYZE=true npm run build
```

## Production Configuration

### Environment Variables

```bash
# .env.local (not committed)
DATABASE_URL=postgresql://...
API_KEY=secret123

# .env (committed, safe defaults)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```typescript
// app/page.tsx
export default function Page() {
  // ✅ Public vars (starts with NEXT_PUBLIC_)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  // ❌ Server-only vars (never exposed to client)
  // const dbUrl = process.env.DATABASE_URL  // Only in Server Components/Actions
}
```

### Next.js Config

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Image domains
  images: {
    domains: ['example.com', 'cdn.example.com'],
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
  
  // Rewrites (proxy)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Testing

### Unit Testing Components

```typescript
// __tests__/Component.test.tsx
import { render, screen } from '@testing-library/react'
import Component from '@/app/components/Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Testing Server Components

```typescript
// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock

describe('Page', () => {
  it('fetches and displays data', async () => {
    const Component = await Page()
    render(Component)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
```

## Migration from Pages Router

### Route Mapping

```
Pages Router          →  App Router
/pages/index.tsx      →  /app/page.tsx
/pages/blog.tsx       →  /app/blog/page.tsx
/pages/blog/[slug].tsx → /app/blog/[slug]/page.tsx
/pages/_app.tsx       →  /app/layout.tsx
/pages/_document.tsx  →  /app/layout.tsx
/pages/404.tsx        →  /app/not-found.tsx
/pages/api/hello.ts   →  /app/api/hello/route.ts
```

### Data Fetching Migration

```typescript
// Pages Router (old)
export async function getServerSideProps() {
  const data = await fetch('...')
  return { props: { data } }
}

export default function Page({ data }) {
  return <div>{data}</div>
}
```

```typescript
// App Router (new)
export default async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}
```

## Quick Reference

### File Conventions
- `page.tsx` - Route page
- `layout.tsx` - Shared layout
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI
- `route.ts` - API endpoint

### Component Types
- Server Component (default) - No `'use client'`
- Client Component - Has `'use client'`

### Data Fetching
- Server Component - `async/await` directly
- Client Component - `useEffect` + state
- Route Handler - API endpoints
- Server Action - `'use server'` functions

### Caching
- `cache: 'force-cache'` - Cache indefinitely
- `cache: 'no-store'` - No caching
- `next: { revalidate: 60 }` - Time-based
- `next: { tags: ['tag'] }` - Tag-based

### Route Segment Config
- `dynamic = 'force-dynamic'` - Opt out of caching
- `revalidate = 60` - ISR every 60 seconds
- `runtime = 'edge'` - Use Edge Runtime

### Metadata
- Static - `export const metadata`
- Dynamic - `export async function generateMetadata()`

### Navigation
- `<Link>` - Client-side navigation
- `useRouter()` - Programmatic navigation
- `redirect()` - Server-side redirect