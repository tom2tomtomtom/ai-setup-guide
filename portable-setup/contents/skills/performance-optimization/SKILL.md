---
name: performance-optimization
description: Web performance optimization including Core Web Vitals, bundle analysis, lazy loading, and profiling. Use when Core Web Vitals are poor, bundle size is too large, or pages and interactions feel slow.
---

# Performance Optimization

Make your applications fast with data-driven optimization strategies.

## When to Use This Skill

Use when:
- Core Web Vitals are poor
- Users complain about slowness
- Bundle size is too large
- Pages take too long to load
- Interactions feel laggy

## Core Web Vitals

| Metric | Good | Needs Work | Poor | What It Measures |
|--------|------|------------|------|------------------|
| **LCP** | < 2.5s | 2.5-4s | > 4s | Largest visible content |
| **INP** | < 200ms | 200-500ms | > 500ms | Input responsiveness |
| **CLS** | < 0.1 | 0.1-0.25 | > 0.25 | Visual stability |

## Measuring Performance

### Built-in Tools
```typescript
// Browser Performance API
performance.mark('start');
// ... code
performance.mark('end');
performance.measure('operation', 'start', 'end');

const [measure] = performance.getEntriesByName('operation');
console.log(`Operation took ${measure.duration}ms`);

// Web Vitals library
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

### Performance Monitoring
```typescript
// Report Core Web Vitals
import { onLCP, onINP, onCLS, Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good', 'needs-improvement', 'poor'
    delta: metric.delta,
    id: metric.id,
  });

  // Use sendBeacon for reliability
  navigator.sendBeacon('/api/analytics', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

## Bundle Optimization

### Analyze Bundle Size
```bash
# Next.js bundle analyzer
npm install @next/bundle-analyzer

# Build with analysis
ANALYZE=true npm run build
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});
```

### Code Splitting

```typescript
// Dynamic imports (lazy loading)
import dynamic from 'next/dynamic';

// Component only loads when needed
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Don't render on server if client-only
});

// Route-based splitting (automatic in Next.js)
// Each page is its own chunk

// Conditional loading
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Loading />,
});

function Dashboard({ isAdmin }) {
  return (
    <div>
      <MainContent />
      {isAdmin && <AdminPanel />} {/* Only loaded for admins */}
    </div>
  );
}
```

### Tree Shaking
```typescript
// ✅ Import only what you need
import { format } from 'date-fns';

// ❌ Imports entire library
import * as dateFns from 'date-fns';

// ✅ Named imports from lodash-es
import { debounce } from 'lodash-es';

// ❌ Full lodash import
import _ from 'lodash';
```

### Reduce Dependencies
```typescript
// Before: Multiple dependencies
import moment from 'moment';        // 290KB
import lodash from 'lodash';        // 70KB

// After: Native or lighter alternatives
// Date formatting
new Intl.DateTimeFormat('en-US').format(date);

// Or date-fns (tree-shakeable)
import { format } from 'date-fns';  // ~2KB per function

// Array utilities - just use native
array.filter().map().reduce()
```

## Image Optimization

### Next.js Image Component
```typescript
import Image from 'next/image';

// Automatic optimization
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Load immediately for LCP
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>

// Responsive images
<Image
  src="/photo.jpg"
  alt="Photo"
  sizes="(max-width: 768px) 100vw, 50vw"
  fill
  style={{ objectFit: 'cover' }}
/>
```

### Image Best Practices
```typescript
// Use modern formats
<picture>
  <source srcSet="/image.avif" type="image/avif" />
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Fallback" />
</picture>

// Lazy load off-screen images
<Image
  src="/below-fold.jpg"
  alt="Below fold"
  loading="lazy" // Default in Next.js Image
/>

// Preload critical images
<head>
  <link rel="preload" as="image" href="/hero.webp" />
</head>
```

## JavaScript Performance

### Avoid Main Thread Blocking
```typescript
// ❌ Blocking computation
function processLargeArray(items: Item[]) {
  return items.map(expensiveTransform); // Blocks for 500ms
}

// ✅ Chunked processing
async function processLargeArray(items: Item[]) {
  const chunkSize = 100;
  const results: Result[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    results.push(...chunk.map(expensiveTransform));

    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return results;
}

// ✅ Web Worker for heavy computation
// worker.ts
self.onmessage = (e: MessageEvent<Item[]>) => {
  const results = e.data.map(expensiveTransform);
  self.postMessage(results);
};

// main.ts
const worker = new Worker(new URL('./worker.ts', import.meta.url));
worker.postMessage(items);
worker.onmessage = (e) => setResults(e.data);
```

### Debounce and Throttle
```typescript
import { useMemo, useState, useCallback } from 'react';
import { debounce } from 'lodash-es';

function SearchInput() {
  const [query, setQuery] = useState('');

  // Debounced search - waits for typing to stop
  const debouncedSearch = useMemo(
    () => debounce((q: string) => fetchResults(q), 300),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
}
```

### Memoization
```typescript
import { useMemo, useCallback, memo } from 'react';

// Memoize expensive calculations
function ProductList({ products, filter }: Props) {
  const filteredProducts = useMemo(
    () => products.filter(p => matchesFilter(p, filter)),
    [products, filter]
  );

  return filteredProducts.map(p => <ProductCard key={p.id} product={p} />);
}

// Memoize callbacks for child components
function Parent() {
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);

  return <Child onClick={handleClick} />;
}

// Memoize component to prevent re-renders
const ProductCard = memo(function ProductCard({ product }: Props) {
  return <div>{product.name}</div>;
});
```

## React Performance

### Avoid Unnecessary Re-renders
```typescript
// ❌ Creates new object every render
<Component style={{ color: 'red' }} />

// ✅ Stable reference
const style = { color: 'red' };
<Component style={style} />

// ❌ Creates new array every render
<List items={data.filter(x => x.active)} />

// ✅ Memoized
const activeItems = useMemo(() => data.filter(x => x.active), [data]);
<List items={activeItems} />

// ❌ Inline function creates new reference
<Button onClick={() => handleClick(id)} />

// ✅ Stable callback
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<Button onClick={handleButtonClick} />
```

### Virtualization for Long Lists
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height
    overscan: 5, // Render 5 extra items outside viewport
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ItemRow item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Suspense for Data Loading
```typescript
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  // Suspends while loading
  const { data: user } = useSuspenseQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  });

  return <div>{user.name}</div>;
}

// Wrap with Suspense boundary
function UserPage({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId={userId} />
    </Suspense>
  );
}
```

## Network Optimization

### Preloading and Prefetching
```typescript
// Preload critical resources
<head>
  <link rel="preload" href="/fonts/inter.woff2" as="font" crossOrigin="" />
  <link rel="preload" href="/api/critical-data" as="fetch" crossOrigin="" />
</head>

// Prefetch for likely navigation
<Link href="/dashboard" prefetch>Dashboard</Link>

// DNS prefetch for external domains
<link rel="dns-prefetch" href="//api.stripe.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

### Caching Strategies
```typescript
// next.config.js - Static asset caching
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
};

// API response caching
export async function GET(request: Request) {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

## CSS Performance

### Critical CSS
```typescript
// Next.js handles this automatically with CSS Modules and Tailwind

// For custom critical CSS
<head>
  <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
  <link rel="preload" href="/styles.css" as="style" onLoad="this.rel='stylesheet'" />
</head>
```

### Reduce Layout Shifts (CLS)
```typescript
// ✅ Reserve space for images
<Image
  src="/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
  // Aspect ratio maintained, no shift
/>

// ✅ Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {isLoading ? <Skeleton /> : <Content />}
</div>

// ✅ Font swap to prevent invisible text
@font-face {
  font-family: 'Inter';
  font-display: swap; /* Show fallback immediately */
  src: url('/fonts/inter.woff2') format('woff2');
}

// ✅ Skeleton loaders match content size
function CardSkeleton() {
  return (
    <div className="h-48 w-full animate-pulse bg-gray-200 rounded" />
  );
}
```

## Database Performance

### Query Optimization
```typescript
// ❌ N+1 queries
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// ✅ Single query with include
const posts = await prisma.post.findMany({
  include: { author: true },
});

// ✅ Select only needed fields
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    author: {
      select: { name: true },
    },
  },
});

// ✅ Pagination
const posts = await prisma.post.findMany({
  take: 20,
  skip: page * 20,
  cursor: lastId ? { id: lastId } : undefined,
});
```

### Indexes
```sql
-- Add indexes for common queries
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_status_created ON posts(status, created_at DESC);

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM posts WHERE author_id = 'xxx';
```

## Performance Checklist

```markdown
## Initial Load
- [ ] Bundle size < 200KB (compressed)
- [ ] LCP < 2.5s
- [ ] Critical resources preloaded
- [ ] Fonts optimized (swap, preload)
- [ ] Images optimized (WebP, proper sizes)

## Runtime
- [ ] INP < 200ms
- [ ] No layout shifts (CLS < 0.1)
- [ ] Lists virtualized if > 100 items
- [ ] Expensive computations memoized
- [ ] No unnecessary re-renders

## Network
- [ ] Appropriate caching headers
- [ ] Resources prefetched/preloaded
- [ ] API responses cached
- [ ] No N+1 query problems

## Monitoring
- [ ] Core Web Vitals tracked
- [ ] Performance budgets set
- [ ] Alerts for regressions
```
