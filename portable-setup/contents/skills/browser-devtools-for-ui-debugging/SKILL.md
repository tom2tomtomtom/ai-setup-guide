---
name: browser-devtools-for-ui-debugging
description: "Exhaustive browser DevTools reference for UI debugging. Covers Elements panel (invisible elements, CSS conflicts, layout debugging), Event Listeners panel (verifying handlers, React delegation), Console techniques ($r, store-as-global, monitorEvents), Network panel (Supabase-specific: 200 + empty = RLS), React DevTools (state/props inspection, Profiler, why-did-render), and Sources panel (conditional breakpoints, logpoints). Use when: (1) You need to inspect why an element is invisible, (2) You need to verify event handlers are attached, (3) You need to debug network requests, (4) You need to inspect React component state"
---

# Browser DevTools for UI Debugging

Comprehensive reference for using Chrome DevTools and React DevTools to answer specific diagnostic questions during UI debugging. This is the "how to look" companion to `ui-feature-debugging` (which tells you "what to look for").

---

## Table of Contents

1. [Elements Panel](#1-elements-panel)
2. [Event Listeners Panel](#2-event-listeners-panel)
3. [Console Techniques](#3-console-techniques)
4. [Network Panel](#4-network-panel)
5. [Application Panel](#5-application-panel)
6. [React DevTools](#6-react-devtools)
7. [Sources Panel](#7-sources-panel)
8. [Performance Panel](#8-performance-panel)
9. [Rendering Tab](#9-rendering-tab)
10. [Memory Panel](#10-memory-panel)
11. [Workflow Patterns](#11-workflow-patterns)

---

## 1. Elements Panel

### Finding Invisible Elements

When an element exists in the DOM but isn't visible, check these properties in the **Computed** tab:

| Property | Symptom | How to Check |
|----------|---------|-------------|
| `display: none` | Element takes no space | Computed → search "display" |
| `visibility: hidden` | Element takes space but invisible | Computed → search "visibility" |
| `opacity: 0` | Fully transparent | Computed → search "opacity" |
| `width: 0` / `height: 0` | Zero dimensions | Box model diagram at top of Computed |
| `overflow: hidden` on parent | Content clipped | Check each parent's overflow value |
| `clip-path` | Element clipped by shape | Computed → search "clip" |
| `z-index` too low | Behind another element | See z-index debugging below |
| `position: absolute` + off-screen | Positioned outside viewport | Check top/left/right/bottom values |
| `transform: scale(0)` | Scaled to nothing | Computed → search "transform" |
| `color` same as `background` | Text invisible | Compare color and background-color |

**Quick invisible element check**:
```
Right-click element in Elements panel → Scroll into view
If nothing scrolls → element has 0 dimensions or display:none
```

### Z-Index Debugging

```
1. Right-click the "covering" element → Inspect
2. Look at the stacking context:
   - Check `z-index` of the element AND its positioned ancestors
   - z-index only works on positioned elements (relative, absolute, fixed, sticky)
   - A higher z-index in a lower stacking context still loses

3. Quick trick: In Console:
   document.elementFromPoint(x, y)
   // Returns the topmost element at those coordinates
   // x, y from hovering over the element and reading coordinates
```

**Creating a stacking context** (things that create new z-index contexts):
- `position: relative/absolute/fixed` + `z-index` value
- `opacity` less than 1
- `transform`, `filter`, `backdrop-filter`
- `isolation: isolate`

### CSS Debugging

**Finding which rule applies**:
```
1. Select element in Elements panel
2. Styles tab shows all rules, most specific on top
3. Crossed-out properties are overridden
4. Grayed-out properties are inherited but overridden
5. Click the filename:line link to see source
```

**Tailwind class conflict resolution**:
```
Problem: Multiple Tailwind classes for the same property
Example: "p-4 p-8" — which wins?

1. Inspect element → Styles tab
2. Tailwind generates utilities in stylesheet order
3. Later classes in the stylesheet win (not later in class attribute)
4. Solution: Use tailwind-merge to resolve conflicts
   import { cn } from "@/lib/utils";
   cn("p-4", "p-8") → "p-8"
```

**Force element state for testing**:
```
1. Right-click element in Elements panel
2. "Force state" → :hover, :active, :focus, :focus-within, :visited
3. Element stays in that state for CSS inspection
```

### Layout Debugging (Flex/Grid)

**Flexbox inspector**:
```
1. Select a flex container in Elements panel
2. Look for "flex" badge next to the element tag
3. Click the badge → overlay shows flex lines, item sizes, gaps
4. Layout tab (next to Computed) shows flex properties visually
```

**Grid inspector**:
```
1. Select a grid container
2. Click the "grid" badge next to the element tag
3. Overlay shows grid lines, track sizes, gap values
4. Layout tab → Grid section:
   - Toggle line numbers
   - Toggle track sizes
   - Toggle area names
```

**Box model interactive editing**:
```
1. Computed tab → box model diagram at top
2. Double-click any value (margin, border, padding, content) to edit
3. Changes apply live — great for testing spacing fixes
```

---

## 2. Event Listeners Panel

### Verifying Handlers Are Attached

```
1. Select the element in Elements panel
2. Event Listeners tab (next to Styles)
3. Expand "click" (or relevant event type)
4. See all handlers attached, with file:line references
```

**Important**: Uncheck "Ancestors" checkbox to see only handlers directly on this element (not inherited from parents).

### React's Event Delegation Model

React doesn't attach handlers to individual elements. Instead:
- **React 17+**: Attaches a single listener to the React **root** DOM node
- **React 16**: Attaches to `document`

What this means for the Event Listeners panel:
```
1. Select a <button> with onClick
2. Event Listeners tab → "click" may show NO handler on the button itself
3. This is NORMAL for React — the handler is on the root
4. To verify React handlers, use React DevTools instead (Section 6)
```

### monitorEvents for Live Event Tracking

```javascript
// In Console — log all events on an element
monitorEvents(document.querySelector('#myButton'));
// Now click the button → Console shows every event that fires

// Filter to specific events
monitorEvents(document.querySelector('#myButton'), 'click');
monitorEvents(document.querySelector('#myButton'), ['click', 'mouseenter', 'focus']);

// Stop monitoring
unmonitorEvents(document.querySelector('#myButton'));

// Monitor key events (useful for keyboard shortcuts)
monitorEvents(document, 'key');
```

### DOM Mutation Breakpoints

When you need to know what code changes an element:
```
1. Right-click element in Elements panel
2. "Break on..." →
   - "Subtree modifications" — pauses when children change
   - "Attribute modifications" — pauses when attributes change
   - "Node removal" — pauses when element is removed
3. Trigger the action → debugger pauses at the JS that causes the change
```

**Use case**: Element keeps disappearing and you don't know why → "Node removal" breakpoint.

---

## 3. Console Techniques

### React Fiber Access

```javascript
// Get React fiber from a DOM element
// (for when you need to debug from DOM → React component)
const element = document.querySelector('.my-component');
const fiberKey = Object.keys(element).find(k => k.startsWith('__reactFiber$'));
const fiber = element[fiberKey];

// Navigate the fiber tree
fiber.memoizedProps   // Current props
fiber.memoizedState   // Current state (for class components)
fiber.return          // Parent fiber
fiber.child           // First child fiber
fiber.type            // Component function/class
```

### $0 and $r Shortcuts

```javascript
// $0 — the currently selected element in Elements panel
$0                    // Returns the DOM node
$0.textContent        // Quick content check
$0.getBoundingClientRect()  // Position and size

// $r — the currently selected component in React DevTools Components tab
// (Must have React DevTools installed and Components tab active)
$r                    // Returns the component instance
$r.props              // Current props
$r.state              // Current state (class components)
// For function components, use React DevTools hooks panel instead
```

### Store as Global Variable

```javascript
// 1. In Console, right-click on any logged object
// 2. "Store as global variable" → creates temp1, temp2, etc.
// 3. Now you can explore it interactively

// Example workflow:
// Console logs: {data: Array(50), meta: {...}}
// Right-click → Store as global variable → temp1
temp1.data.filter(d => d.status === 'error')  // Explore the data
temp1.data.length  // Quick counts
```

### Useful Console Utilities

```javascript
// copy() — copy any value to clipboard
copy(JSON.stringify(data, null, 2));  // Copy formatted JSON

// debug() — add breakpoint to a function
debug(myFunction);  // Pauses whenever myFunction is called
undebug(myFunction); // Remove

// table() — tabular display of arrays/objects
console.table(users);  // Pretty table with columns
console.table(users, ['name', 'email']);  // Specific columns only

// dir() — view object properties (not HTML representation)
console.dir(document.querySelector('#app'));  // Properties, not HTML

// time/timeEnd — measure execution time
console.time('fetch');
await fetch('/api/data');
console.timeEnd('fetch');  // "fetch: 234ms"

// group/groupEnd — organize console output
console.group('User Data Processing');
console.log('Fetched 50 users');
console.log('Filtered to 12 active');
console.groupEnd();

// assert — log only when condition is false
console.assert(users.length > 0, 'Users array is empty!');
```

### Live Expression (Console Pin)

```
1. Click the eye icon in Console toolbar
2. Type an expression: document.querySelectorAll('.item').length
3. Value updates live as the DOM changes
4. Great for monitoring: element count, scroll position, state values
```

---

## 4. Network Panel

### Request Filtering

```
Filter bar shortcuts:
  status-code:404          Only show 404 responses
  status-code:200          Only show successful requests
  domain:api.supabase.co   Only show Supabase requests
  method:POST              Only show POST requests
  larger-than:1M           Only show large responses
  -domain:cdn.example.com  Exclude CDN requests
  is:from-cache            Only cached responses

Type filters (buttons above the list):
  XHR   — API calls (fetch, XMLHttpRequest)
  JS    — JavaScript files
  CSS   — Stylesheets
  Img   — Images
  Media — Video/audio
  WS    — WebSocket connections
```

### Supabase-Specific Network Debugging

**The #1 Supabase trap**: HTTP 200 + empty array = RLS blocking

```
1. Filter to Supabase: domain:supabase.co (or your project URL)
2. Find the relevant request (usually POST to /rest/v1/rpc or GET to /rest/v1/tablename)
3. Check Response tab:

   [] ← Empty array with status 200
   This means RLS is silently filtering. NOT "no data."

4. Check Request headers:
   - Authorization: Bearer <token> — is the JWT present?
   - apikey: — is the anon key correct?

5. Check Request payload (for .rpc calls):
   - Are the parameters correct?
   - Is the function name correct?
```

**Supabase PostgREST query inspection**:
```
1. GET requests to /rest/v1/tablename show query in URL params:
   ?select=*&id=eq.123&status=eq.active

2. Verify:
   - Correct table name
   - Correct filter operators (eq, neq, gt, lt, like, in, is)
   - Correct column names (common: 'ad_id' vs 'ad_library_id')

3. Response headers show row count:
   Content-Range: 0-9/42  (10 items of 42 total)
   Content-Range: *\/0     (0 items — RLS or no matches)
```

### Blocking Requests (Test Offline/Error Scenarios)

```
1. Right-click a request → "Block request URL"
   or: Right-click → "Block request domain"
2. Request now returns ERR_BLOCKED_BY_CLIENT
3. Great for testing: error handling, fallback UI, offline states

To manage blocks:
  Network tab → three-dot menu → "Request blocking"
```

### Replay and Copy

```
Right-click any request:
  "Replay XHR" — re-send the exact same request
  "Copy" → "Copy as fetch" — get JS code to reproduce the request
  "Copy" → "Copy as cURL" — get shell command to test in terminal
  "Copy" → "Copy response" — copy the full response body
```

### Throttling

```
Network tab → "No throttling" dropdown:
  "Slow 3G" — 400ms RTT, 400kb/s down
  "Fast 3G" — 150ms RTT, 1.5Mb/s down
  "Offline" — no network

Add custom:
  Settings icon → Throttling → Add custom profile
  Useful: "Slow API" — normal download, 2000ms latency
```

### Waterfall Reading

```
Waterfall column shows timing breakdown:
  ┌ Stalled    — waiting for connection slot
  │ DNS        — DNS lookup time
  │ Connect    — TCP connection
  │ SSL        — TLS handshake
  │ Send       — uploading request body
  │ Waiting    — TTFB (time to first byte) — server processing
  └ Download   — downloading response body

Large "Waiting" = slow server/API
Large "Stalled" = too many concurrent connections to same domain
Large "Download" = response payload too big
```

---

## 5. Application Panel

### Cookie Inspection

```
Application tab → Cookies → your domain

Key columns:
  Name     — cookie name
  Value    — cookie value (click to expand)
  Domain   — which domain receives this cookie
  Path     — URL path scope
  Expires  — when it expires (Session = browser close)
  HttpOnly — can't be accessed by JavaScript
  Secure   — only sent over HTTPS
  SameSite — cross-site sending rules (Strict, Lax, None)

Supabase auth cookies to look for:
  sb-<project>-auth-token  — the session JWT
  aiden-auth-ts            — AIDEN SSO cache cookie

Right-click → Delete to remove individual cookies
"Clear all" button to remove all cookies for the domain
```

### LocalStorage / SessionStorage

```
Application tab → Local Storage / Session Storage → your domain

View as key-value pairs
Click any row to see full value
Right-click → Delete to remove

Common things stored:
  supabase.auth.token  — Supabase session
  theme                — Dark/light mode preference
  sidebar-collapsed    — UI state
```

### Service Worker Debugging

```
Application tab → Service Workers

Check:
  Status: activated and running / waiting / installing
  "Update on reload" checkbox — forces fresh SW on each reload
  "Bypass for network" checkbox — disables SW caching temporarily

If stale content:
  1. Check "Update on reload"
  2. Click "Unregister" to remove the SW entirely
  3. Hard refresh (Cmd+Shift+R)
```

### Clear Site Data

```
Application tab → Storage → "Clear site data"

Checkboxes for:
  □ Cookies
  □ Local and session storage
  □ IndexedDB
  □ Cache storage
  □ Service workers

The nuclear option when something is cached/stale and you can't figure out what.
```

---

## 6. React DevTools

### Components Tab

**Finding a component**:
```
1. Click the target icon (top-left of React DevTools)
2. Click any element on the page
3. React DevTools navigates to that component in the tree

Alternative:
  Search box at top of Components panel
  Type component name to find it
```

**Inspecting state and props**:
```
1. Select a component in the tree
2. Right panel shows:
   props      — what the parent passes in
   hooks      — useState, useEffect, useMemo, custom hooks
   rendered by — which component renders this one

3. For hooks:
   State: "hello"          — useState value
   Effect: ƒ () { ... }   — useEffect callback
   Memo: [1, 2, 3]        — useMemo cached value
   Ref: {current: <div>}  — useRef value

4. You can EDIT values:
   Click on a state value → change it → component re-renders
   Great for testing: "what if this state were different?"
```

**$r shortcut**:
```
1. Select a component in React DevTools
2. Go to Console
3. Type $r — this is the component instance
   $r.props  — view all props
   $r.state  — view state (class components)
   For function components, inspect hooks in the panel instead
```

### Highlight Renders

```
React DevTools → Settings (gear icon) → General
  ✓ "Highlight updates when components render"

Now every re-render flashes a colored border:
  Blue/green = occasional render (normal)
  Yellow/red = frequent render (possible performance issue)

Use this to answer: "Is this component re-rendering when I think it should?"
```

### Profiler Tab

**Recording a profile**:
```
1. React DevTools → Profiler tab
2. Click record (blue circle)
3. Perform the action you want to profile
4. Click stop

Reading the results:
  Each vertical bar = one commit (batch of updates)
  Click a commit to see:
    - Which components rendered
    - How long each took
    - Why they rendered (with "Record why each component rendered" setting)
```

**"Why did this render?"** setting:
```
React DevTools → Settings → Profiler
  ✓ "Record why each component rendered while profiling"

Now the Profiler shows for each component:
  "Why did this render?"
  - Props changed: name
  - State changed
  - Hooks changed
  - Parent rendered
  - First render

This answers the common question: "Why does this keep re-rendering?"
```

### Component Filters

```
React DevTools → Settings → Components

Add filters:
  Hide components where name matches: "styled"
  Hide host (HTML) components

Filters declutter the tree so you see only your app components.
```

---

## 7. Sources Panel

### Conditional Breakpoints

```
1. Sources tab → open file → click line number gutter to add breakpoint
2. Right-click the breakpoint → "Edit breakpoint"
3. Enter condition: userId === 'abc123'
4. Breakpoint only pauses when condition is true

Use case: Loop processes 1000 items, bug only on item #47
  Condition: item.id === 47
```

### Logpoints (Non-Breaking Console.log)

```
1. Right-click line number gutter → "Add logpoint"
2. Enter expression: "User:", user.name, "Status:", user.status
3. Logs to console on each execution without pausing

Better than adding console.log to code because:
  - No code changes needed
  - No risk of committing debug logs
  - Can add/remove without restarting dev server
```

### XHR/Fetch Breakpoints

```
Sources tab → XHR/fetch Breakpoints panel (right sidebar)
  Click + → enter URL substring
  Example: "/api/projects" → pauses on any fetch to that endpoint

Use case: "What code triggers this API call?"
  Set XHR breakpoint → trigger the action → call stack shows exactly what initiated it
```

### Event Listener Breakpoints

```
Sources tab → Event Listener Breakpoints panel (right sidebar)
Expand categories:
  Mouse → click, mousedown, mouseup
  Keyboard → keydown, keyup, keypress
  Touch → touchstart, touchmove, touchend

Check any event → debugger pauses when that event fires
Call stack shows the handler code

Use case: "Something happens on click but I don't know what handler runs"
  Check Mouse → click → click the element → see the handler
```

### Source Maps

```
When debugging minified production code:
  Settings (gear icon) → Enable JavaScript source maps
  Settings → Enable CSS source maps

Webpack/Next.js devtool settings for useful source maps:
  Development: 'eval-source-map' (fast, accurate)
  Production: 'source-map' (separate .map files)
  Debug production: 'hidden-source-map' (maps without public exposure)
```

### Blackboxing (Ignore Framework Code)

```
When stepping through code and you keep landing in React/library internals:

1. Right-click a file in call stack → "Add script to ignore list"
2. Or: Settings → Ignore List → Add pattern
   /node_modules/
   /react-dom/
   /webpack/

Now "Step Into" skips library code and lands on your code.
```

---

## 8. Performance Panel

When UI feels janky, animations stutter, or interactions are slow — the Performance panel shows exactly what's happening frame-by-frame.

### Recording a Performance Profile

```
1. Performance tab → click Record (circle icon)
2. Perform the slow action (scroll, click, animate)
3. Click Stop
4. Timeline shows everything that happened, frame by frame

Key areas in the recording:
  Top bar: FPS indicator (green = good, red = dropped frames)
  Flame chart: shows all JS execution stacked by call tree
  Summary tab: pie chart of time spent (Scripting, Rendering, Painting, Idle)
```

### Reading the Flame Chart

```
Each bar = one function call
Width = how long it took
Color coding:
  Yellow = JavaScript execution (Scripting)
  Purple = Layout/Recalculate Style (Rendering)
  Green  = Paint/Composite (Painting)
  Gray   = Idle / System

Look for:
  Wide yellow bars    → Slow JS function. Click to see which function.
  Purple after yellow → JS triggered layout recalculation (layout thrashing)
  Red triangle on bar → "Long task" (>50ms, blocks main thread)
```

### Common Performance Problems

**Layout thrashing (forced reflows)**:
```
Symptom: Purple "Layout" bars appearing repeatedly
Cause: Reading layout properties (offsetHeight, getBoundingClientRect)
       then writing styles, in a loop

// ❌ Forces layout recalculation on every iteration
elements.forEach(el => {
  const height = el.offsetHeight;      // READ → triggers layout
  el.style.height = height + 10 + 'px'; // WRITE → invalidates layout
});

// ✅ Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';          // All writes
});
```

**Long tasks blocking interaction**:
```
Symptom: Red triangles on flame chart, "Long Task" warnings
Cause: JavaScript running >50ms without yielding

Diagnosis:
  1. Click the long task bar
  2. Bottom-up tab shows which functions took the most time
  3. Call tree tab shows the full execution path

Fixes:
  - Break work into smaller chunks with requestIdleCallback
  - Move heavy computation to Web Worker
  - Virtualize long lists (react-virtual, react-window)
```

**Expensive re-renders**:
```
Symptom: Lots of yellow (Scripting) on every interaction
Cause: React rendering too many components

Diagnosis:
  1. In flame chart, look for React's "commit" phase
  2. Expand to see which components are rendering
  3. Cross-reference with React DevTools Profiler for "why did this render?"
```

### FPS Monitor (Real-time)

```
Performance tab → three-dot menu → "Show console drawer"
Console drawer → three-dot menu → "Rendering"
Check "Frame Rendering Stats"
→ Real-time FPS counter overlay on the page

Or: Cmd+Shift+P → "Show FPS" → shows FPS meter
```

---

## 9. Rendering Tab

The Rendering tab lives under "More tools" and provides visual overlays for debugging layout, paint, and scroll issues.

### Accessing the Rendering Tab

```
Three-dot menu (top-right of DevTools) → More tools → Rendering
Or: Cmd+Shift+P → type "Rendering" → Show Rendering
```

### Paint Flashing

```
✓ "Paint flashing"
→ Green rectangles flash over areas being repainted
→ If the whole page flashes green on every interaction, too much is being painted

Use to answer: "What's being repainted when I scroll/click/type?"
Ideal: only the changed area flashes, not the entire page.
```

### Layout Shift Regions

```
✓ "Layout shift regions"
→ Blue rectangles highlight elements that shift position
→ Directly maps to Cumulative Layout Shift (CLS) — a Core Web Vital

Common causes of layout shifts:
  - Images without width/height attributes
  - Fonts loading and changing text size (FOUT)
  - Dynamic content inserted above existing content
  - Ads or embeds loading late
```

### Scrolling Performance Issues

```
✓ "Scrolling performance issues"
→ Highlights elements that slow down scrolling:
  - Elements with non-composited scroll handlers
  - Touch event handlers that prevent default
  - Elements that cause repaints on scroll

Look for: elements highlighted in yellow with warning text
Fix: Use passive event listeners, will-change: transform, or CSS containment
```

### Emulate CSS Media

```
Useful for debugging without changing system settings:
  Emulate CSS prefers-color-scheme: dark/light
  Emulate CSS prefers-reduced-motion: reduce
  Emulate CSS prefers-contrast: more

Use case: "Does our reduced-motion setting actually work?"
→ Set the emulation → check if animations are removed
```

---

## 10. Memory Panel

Use when you suspect memory leaks — the page gets slower over time, or RAM usage keeps growing.

### When to Use Memory Panel

```
Symptoms of memory leaks:
  - Page gets slower the longer you use it
  - Task Manager shows growing memory for the tab
  - Happens especially on pages with frequent updates (dashboards, chat)
  - Components that mount/unmount repeatedly (modals, routes)
```

### Taking a Heap Snapshot

```
1. Memory tab → "Heap snapshot" → Take snapshot
2. Use the page normally for a while (open/close modals, navigate)
3. Take another snapshot
4. Select Snapshot 2 → change view to "Comparison"
5. Compare against Snapshot 1
6. Sort by "# Delta" (new allocations) or "Size Delta" (memory growth)

Look for:
  - Detached DOM nodes (elements removed from page but still in memory)
  - Growing arrays or objects
  - Event listeners that weren't cleaned up
```

### Common React Memory Leaks

```
1. Unmounted component still setting state:
   // ❌ Fetch completes after component unmounts
   useEffect(() => {
     fetch('/api/data').then(res => res.json()).then(setData);
     // Component unmounts → setData called on unmounted component
   }, []);

   // ✅ Clean up with AbortController
   useEffect(() => {
     const controller = new AbortController();
     fetch('/api/data', { signal: controller.signal })
       .then(res => res.json())
       .then(setData)
       .catch(() => {}); // Ignore abort errors
     return () => controller.abort();
   }, []);

2. Event listeners not cleaned up:
   // ❌ Adds listener every render, never removes
   useEffect(() => {
     window.addEventListener('resize', handleResize);
   });

   // ✅ Return cleanup function
   useEffect(() => {
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);

3. Intervals/timers not cleared:
   // ❌ Interval keeps running after unmount
   useEffect(() => {
     setInterval(pollData, 5000);
   }, []);

   // ✅ Clear on unmount
   useEffect(() => {
     const id = setInterval(pollData, 5000);
     return () => clearInterval(id);
   }, []);
```

### Allocation Timeline

```
Memory tab → "Allocation instrumentation on timeline"
1. Click Start
2. Use the app (trigger suspected leak)
3. Click Stop

Blue bars = allocations still in memory (potential leaks)
Gray bars = allocations that were garbage collected (normal)

If blue bars keep growing → memory leak
Click a blue bar to see what was allocated and where
```

---

## 11. Workflow Patterns

### "Is This a CSS or JS Problem?"

```
Diagnosis workflow:
1. Elements panel → select the element
2. Does the element exist in the DOM?
   NO  → JS problem: component not rendering this element
   YES → Continue
3. Does the element have the expected content/attributes?
   NO  → JS problem: wrong data passed or wrong conditional
   YES → Continue
4. Is the element visible? (Check computed display, visibility, opacity, dimensions)
   NO  → CSS problem: element exists but is hidden
   YES → CSS problem: element is visible but styled wrong
```

### "Which Request Is Failing?"

```
1. Network tab → clear existing requests (🚫 icon)
2. Perform the action that fails
3. Look for:
   Red rows = failed requests (4xx, 5xx, network error)
   Filter: status-code:400 (or 401, 403, 404, 500)
4. Click the failed request:
   Headers tab → status code and request details
   Response tab → error message from server
   Preview tab → formatted response (JSON)
```

### "What State Does This Component Have?"

```
Method 1 — React DevTools:
  Components tab → find/select component → view hooks panel

Method 2 — Console logging:
  Add temporary: console.log('MyComponent render', { state1, state2, props });

Method 3 — React DevTools $r:
  Select component → Console → $r.props / look at hooks panel

Method 4 — DOM inspection:
  Elements panel → select element → look for data attributes
  Some frameworks add data-state, aria-expanded, etc.
```

### "Why Did My Re-render Happen?"

```
Step 1 — Check if it re-renders at all:
  React DevTools → Settings → Highlight updates
  Perform action → does the component flash?

Step 2 — Identify the trigger:
  React DevTools → Profiler → Record
  Perform action → Stop
  Click the commit → find the component → "Why did this render?"

Step 3 — Common causes:
  "Props changed" → Parent is passing new object/array references
    Fix: useMemo in parent, or React.memo on child
  "State changed" → This component's own state updated
    Fix: Check if setState is called unnecessarily
  "Hooks changed" → A custom hook returned new values
    Fix: Check hook return value stability
  "Parent rendered" → Parent re-rendered, causing child to re-render
    Fix: React.memo on this component if re-render is expensive
```

### "Is This a Client or Server Issue?"

```
1. Network tab → find the relevant request
2. Check the response:
   - 4xx error → client sending wrong request (bad params, missing auth)
   - 5xx error → server error (check server logs)
   - 200 + empty → server returned nothing (RLS, wrong query)
   - 200 + data → server is fine, problem is client-side rendering

3. Reproduce with cURL:
   Right-click request → Copy as cURL
   Run in terminal → same response?
   YES → server issue
   NO  → something about the browser request is different (cookies, headers)
```

### "Event Fires But Nothing Happens"

```
1. Console.log as first line of handler → confirms handler fires
2. Step through handler with breakpoints:
   Sources → set breakpoint in handler → trigger event
3. Watch for:
   - Early returns (guard clauses with wrong conditions)
   - try/catch swallowing errors silently
   - Async operations that aren't awaited
   - State updates that don't trigger re-render (mutation)
4. Check: is there an error in the catch block that's not logged?
   try {
     await saveData();
   } catch (e) {
     // ← Nothing here? Add console.error(e)
   }
```

### "Element Is There But I Can't Click It"

```
1. Console: document.elementFromPoint(x, y)
   → Shows what element is actually on top at those coordinates
   → If it's not your button, something is covering it

2. Elements panel: look for overlays
   - Elements with position:fixed or position:absolute
   - Invisible overlays (opacity:0, background:transparent)
   - Modal backdrops that didn't get removed
   - Elements with higher z-index

3. Check for pointer-events:none on the element or its parents
   Computed tab → search "pointer"

4. Check disabled attribute
   Elements panel → look for disabled, aria-disabled, data-disabled
```
