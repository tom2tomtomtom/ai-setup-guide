---
name: debugging-strategies
description: Debug with binary search isolation (git bisect, code bisect), minimal reproduction steps, console/breakpoint placement, and root-cause checklists for race conditions, off-by-ones, and state mutation bugs; use when a bug resists obvious fixes
---

# Debugging Strategies

Systematic approaches to finding and fixing bugs quickly and effectively.

## When to Use This Skill

Use when:
- Facing a bug you can't immediately explain
- Need to reproduce an issue reported by users
- Debugging performance problems
- Dealing with race conditions or async issues
- Investigating production incidents

## The Debugging Mindset

### 1. Don't Guess - Investigate
```
❌ "It's probably this..." *changes random code*
✅ "What does the data actually look like here?" *adds logging*
```

### 2. Question Your Assumptions
```
❌ "This function definitely works, I wrote it"
✅ "Let me verify this function receives what I think it receives"
```

### 3. Reproduce First, Fix Second
```
❌ "I think I know what's wrong" *makes fix without reproducing*
✅ "Let me reproduce this consistently, then fix it"
```

## Binary Search Debugging

### The Strategy
When you don't know where the bug is, systematically narrow it down:

```typescript
// Original broken code path
A() -> B() -> C() -> D() -> E() -> F()

// Step 1: Check midpoint
A() -> B() -> C() -> [LOG HERE] -> D() -> E() -> F()
// Data looks correct here

// Step 2: Check later half midpoint
A() -> B() -> C() -> D() -> [LOG HERE] -> E() -> F()
// Data is wrong here! Bug is between C and D

// Step 3: Zero in on the problem
A() -> B() -> C() -> [LOG START OF D] -> D() -> [LOG END OF D]
// Found it: D() is corrupting the data
```

### Implementation
```typescript
// Add strategic logging
function debugTrace<T>(label: string, value: T): T {
  console.log(`[DEBUG ${label}]:`, JSON.stringify(value, null, 2));
  return value;
}

// Usage in suspected code path
const result = await getUserData(userId);
debugTrace('after getUserData', result);

const transformed = transformData(result);
debugTrace('after transformData', transformed);

const filtered = filterInactive(transformed);
debugTrace('after filterInactive', filtered);
```

## Reproduction Strategies

### 1. Isolate the Bug
```typescript
// Don't debug in full app context - isolate the component/function
// Create minimal reproduction

// Bad: Debugging in full page with 20 components
// Good: Create test file with just the failing component

// minimal-reproduction.tsx
import { BrokenComponent } from './BrokenComponent';

// Hardcode the exact props that cause the issue
const problematicProps = {
  items: [{ id: 1, name: null }], // The edge case
};

export default function Test() {
  return <BrokenComponent {...problematicProps} />;
}
```

### 2. Capture the Exact State
```typescript
// When bug is reported, capture everything
interface BugReport {
  // What the user saw
  error: string;
  screenshot?: string;

  // Application state
  url: string;
  userAgent: string;
  userId: string;
  timestamp: string;

  // Data state
  relevantState: Record<string, unknown>;

  // Steps to reproduce
  actions: string[];
}

// Add to error boundary
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  const bugReport: BugReport = {
    error: error.message,
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getCurrentUserId(),
    timestamp: new Date().toISOString(),
    relevantState: getRelevantState(),
    actions: getRecentUserActions(),
  };

  console.log('Bug report:', JSON.stringify(bugReport, null, 2));
  reportBug(bugReport);
}
```

### 3. Replay User Actions
```typescript
// Log user actions for replay
const actionLog: Array<{ action: string; timestamp: number; data?: unknown }> = [];

function logAction(action: string, data?: unknown) {
  actionLog.push({
    action,
    timestamp: Date.now(),
    data,
  });

  // Keep last 50 actions
  if (actionLog.length > 50) actionLog.shift();
}

// In your app
onClick={() => {
  logAction('click:submit-button');
  handleSubmit();
}}

onChange={(e) => {
  logAction('change:email-input', { value: e.target.value });
  setEmail(e.target.value);
}}
```

## Common Bug Patterns

### 1. Null/Undefined Access
```typescript
// Bug pattern
const name = user.profile.name; // 💥 if profile is null

// Detection
function safeAccess<T>(fn: () => T, fallback: T): T {
  try {
    const result = fn();
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

// Fix patterns
const name = user?.profile?.name ?? 'Unknown';
const name = user.profile?.name || 'Unknown';
```

### 2. Stale Closures
```typescript
// Bug pattern
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // Always logs 0! Stale closure
      setCount(count + 1); // Always sets to 1
    }, 1000);
    return () => clearInterval(id);
  }, []); // Empty deps = stale closure
}

// Fix
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // Use functional update
    }, 1000);
    return () => clearInterval(id);
  }, []);
}

// Or use ref for latest value
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      console.log(countRef.current); // Always current
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
```

### 3. Race Conditions
```typescript
// Bug pattern
async function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
    // If queries come fast: query1, query2
    // Results might arrive: results2, results1
    // Final state shows results1 (wrong!)
  }, [query]);
}

// Fix with abort controller
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    fetchResults(query, { signal: abortController.signal })
      .then(setResults)
      .catch(e => {
        if (e.name !== 'AbortError') throw e;
      });

    return () => abortController.abort();
  }, [query]);
}

// Fix with request ID
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    fetchResults(query).then(data => {
      if (requestId === requestIdRef.current) {
        setResults(data);
      }
    });
  }, [query]);
}
```

### 4. Memory Leaks
```typescript
// Bug pattern
useEffect(() => {
  const subscription = eventBus.subscribe('update', handleUpdate);
  // Missing cleanup! Subscription persists after unmount
}, []);

// Fix
useEffect(() => {
  const subscription = eventBus.subscribe('update', handleUpdate);
  return () => subscription.unsubscribe();
}, []);

// Detecting memory leaks
// 1. React strict mode (double-mounts components)
// 2. Chrome DevTools > Memory > Take heap snapshot
// 3. Look for detached DOM nodes
```

### 5. Infinite Loops
```typescript
// Bug pattern
useEffect(() => {
  setItems([...items, newItem]); // items in deps, changes items
}, [items]); // 💥 Infinite loop

// Bug pattern
const options = { enabled: true }; // New object every render
useQuery(['key'], fetchData, options); // options changes every render

// Fix - stable reference
const options = useMemo(() => ({ enabled: true }), []);

// Fix - include only needed deps
useEffect(() => {
  setItems(prev => [...prev, newItem]);
}, [newItem]); // Only depends on newItem
```

### 6. Off-by-One Errors
```typescript
// Bug patterns
for (let i = 0; i <= array.length; i++) // One too many
for (let i = 1; i < array.length; i++)  // Skips first
array.slice(0, 5) // Gets 5 items (0-4), not through index 5

// Fix - be explicit about intent
const firstFive = array.slice(0, 5); // 0, 1, 2, 3, 4
const lastFive = array.slice(-5);    // last 5 items
const allButFirst = array.slice(1);  // skip first
```

### 7. Async/Await Mistakes
```typescript
// Bug: forEach doesn't wait
async function processAll(items) {
  items.forEach(async (item) => {
    await processItem(item); // These run in parallel, not sequentially
  });
  console.log('Done'); // Logs before processing completes!
}

// Fix for sequential
async function processAll(items) {
  for (const item of items) {
    await processItem(item);
  }
  console.log('Done'); // After all items processed
}

// Fix for parallel
async function processAll(items) {
  await Promise.all(items.map(item => processItem(item)));
  console.log('Done');
}
```

## Debugging Tools

### Console Methods
```typescript
// Group related logs
console.group('User Authentication');
console.log('User:', user);
console.log('Token:', token);
console.groupEnd();

// Table for arrays/objects
console.table(users);
console.table(users, ['id', 'name']); // Specific columns

// Timing
console.time('fetch');
await fetchData();
console.timeEnd('fetch'); // "fetch: 234ms"

// Stack trace
console.trace('How did we get here?');

// Conditional logging
console.assert(user.id, 'User should have ID');

// Count occurrences
console.count('render'); // "render: 1", "render: 2", etc.
```

### Browser DevTools

#### Elements Panel
```javascript
// Find element in console
$0 // Currently selected element
$('selector') // querySelector
$$('selector') // querySelectorAll

// Monitor events
monitorEvents($0, 'click');
unmonitorEvents($0);
```

#### Network Panel
```javascript
// Filter requests
// - XHR only: filter by "Fetch/XHR"
// - By status: "status-code:404"
// - By domain: "domain:api.example.com"

// Block requests to test error handling
// Right-click request > "Block request URL"

// Throttle network
// Network conditions > Slow 3G
```

#### Sources Panel
```javascript
// Conditional breakpoints
// Right-click line > "Add conditional breakpoint"
// Condition: user.role === 'admin'

// Logpoints (log without stopping)
// Right-click line > "Add logpoint"
// Message: "User:", user

// XHR breakpoints
// Sources > XHR/fetch Breakpoints > Add
// Break when URL contains "users"

// Event listener breakpoints
// Sources > Event Listener Breakpoints > Mouse > click
```

### React DevTools
```javascript
// Profiler - find unnecessary renders
// 1. Start profiling
// 2. Interact with app
// 3. Stop profiling
// 4. Look for components with many renders

// Component inspection
// Select component > See props, state, hooks

// Highlight updates
// Settings > Highlight updates when components render
```

### Node.js Debugging
```bash
# Start with inspector
node --inspect server.js

# Break on first line
node --inspect-brk server.js

# Open chrome://inspect in Chrome
```

```typescript
// Programmatic breakpoint
function suspiciousFunction(data: unknown) {
  debugger; // Execution stops here when DevTools open
  return processData(data);
}
```

## Debugging Strategies by Bug Type

### "It Works on My Machine"
```bash
# Check environment differences
node -v  # Node version
npm -v   # npm version

# Check dependencies
npm ls   # Installed versions
cat package-lock.json | grep "version"

# Check environment variables
printenv | grep -i api
printenv | grep -i node

# Docker for consistent environment
docker-compose up
```

### "It Worked Yesterday"
```bash
# Find when it broke
git bisect start
git bisect bad                    # Current commit is bad
git bisect good abc123            # Last known good commit

# Git bisect will checkout middle commits
# Test each one and run:
git bisect good  # or
git bisect bad

# Find the first bad commit
git bisect reset  # When done
```

### "Random Failures"
```typescript
// Usually: race conditions, timing issues, or uncontrolled randomness

// Add timestamps to logs
function log(message: string, data?: unknown) {
  console.log(
    `[${new Date().toISOString()}] ${message}`,
    data ? JSON.stringify(data) : ''
  );
}

// Make randomness deterministic for testing
const seed = process.env.TEST_SEED || Date.now().toString();
const random = seedrandom(seed);
console.log(`Using seed: ${seed}`); // Reproduce by setting TEST_SEED
```

### "Works in Dev, Breaks in Prod"
```typescript
// Common causes:
// 1. Environment variables missing
// 2. Different data (more data, edge cases)
// 3. CORS/security policies
// 4. Build optimization issues
// 5. Caching

// Debug production build locally
npm run build
npm run start  # Not npm run dev

// Check for dev-only code
if (process.env.NODE_ENV === 'development') {
  // This won't run in prod
}

// Enable source maps in production
// next.config.js
module.exports = {
  productionBrowserSourceMaps: true,
};
```

## Debugging Checklist

```markdown
## Quick Checks
- [ ] Is there an error in the console?
- [ ] Is the network request succeeding? (DevTools > Network)
- [ ] Is the data what I expect? (console.log at key points)
- [ ] Did I save the file / restart the server?
- [ ] Is there a typo? (variable names, URLs)
- [ ] Am I on the right branch?

## State Issues
- [ ] Is the initial state correct?
- [ ] Is the state update being called?
- [ ] Is the state update actually changing the value?
- [ ] Is something else overwriting the state?
- [ ] Is there a stale closure?

## Rendering Issues
- [ ] Is the component rendering at all?
- [ ] Is it rendering with the right props?
- [ ] Is CSS being applied? (DevTools > Elements > Styles)
- [ ] Is there a z-index or overflow issue?
- [ ] Is there a conditional preventing render?

## Async Issues
- [ ] Is the promise resolving/rejecting?
- [ ] Is there a race condition?
- [ ] Is cleanup happening correctly?
- [ ] Are errors being caught?

## Environment Issues
- [ ] Are environment variables set?
- [ ] Are dependencies installed?
- [ ] Is the right version of Node/npm running?
- [ ] Are there TypeScript errors? (npx tsc --noEmit)
```

## The Debugging Report

When you find and fix a bug, document it:

```markdown
## Bug Report: [Title]

### Symptoms
- What the user saw
- Error messages
- Affected features

### Root Cause
- What actually went wrong
- Why it happened

### Investigation
- How the bug was found
- Key debugging steps that helped

### Fix
- What was changed
- Link to PR/commit

### Prevention
- How to prevent similar bugs
- Tests added
- Monitoring added
```
