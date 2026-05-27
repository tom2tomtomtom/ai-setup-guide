---
name: ui-feature-debugging
description: "Diagnoses broken UI features from visible symptoms to root cause. 12 symptom-specific playbooks for: button does nothing, form won't submit, data missing, modal won't open, filter broken, drag-and-drop broken, blank page, state not reflecting, works in dev not prod, works on desktop not mobile. Includes Supabase RLS and shadcn/ui gotchas. Use when: (1) A UI feature doesn't work and you don't know why, (2) Something worked before but stopped, (3) User reports a broken interaction, (4) You need a systematic approach instead of guessing"
---

# UI Feature Debugging

The entry-point skill for diagnosing broken UI features. Start here when "something doesn't work" — this guides you from visible symptom to root cause.

**Related skills**: Use `browser-devtools-for-ui-debugging` for detailed DevTools techniques. Use `nextjs-react-debugging` for framework-specific issues (hydration, caching, server components).

---

## Table of Contents

1. [Diagnostic Framework](#1-diagnostic-framework)
2. [Quick Diagnostic Checklist](#2-quick-diagnostic-checklist)
3. [Symptom Playbooks](#3-symptom-playbooks)
   - 3.1 Button Does Nothing When Clicked
   - 3.2 Form Submits But Nothing Happens
   - 3.3 Data Doesn't Appear on the Page
   - 3.4 Modal/Dialog Doesn't Open or Close
   - 3.5 Filter/Search Doesn't Work
   - 3.6 Drag and Drop Is Broken
   - 3.7 Animation Doesn't Play
   - 3.8 Page Shows Blank Content
   - 3.9 State Updates But UI Doesn't Reflect It
   - 3.10 Infinite Re-renders / Page Freezes
   - 3.11 Works in Dev But Not Production
   - 3.12 Works on Desktop But Not Mobile
   - 3.13 Feature Worked Yesterday But Doesn't Today
4. [Supabase-Specific UI Pitfalls](#4-supabase-specific-ui-pitfalls)
5. [shadcn/ui-Specific Pitfalls](#5-shadcnui-specific-pitfalls)
6. [The 5-Layer Model](#6-the-5-layer-model)

---

## 1. Diagnostic Framework

Every broken UI feature fails at one of five layers. Identify which layer is broken and you're 80% to the fix.

```
User Action (click, type, submit)
     │
     ▼
┌─────────────┐
│  1. EVENT   │  Is the handler even firing?
│   LAYER     │  Console.log in onClick/onSubmit → nothing? Event isn't reaching handler.
└──────┬──────┘
       ▼
┌─────────────┐
│  2. STATE   │  Does the handler update state correctly?
│   LAYER     │  Log state before/after → wrong value? State logic is broken.
└──────┬──────┘
       ▼
┌─────────────┐
│  3. DATA    │  Does the API call succeed with correct data?
│   LAYER     │  Check Network tab → 4xx/5xx? Empty response? Data fetch is broken.
└──────┬──────┘
       ▼
┌─────────────┐
│  4. RENDER  │  Does the component re-render with new state?
│   LAYER     │  React DevTools → component not updating? Render logic is broken.
└──────┬──────┘
       ▼
┌─────────────┐
│  5. DISPLAY │  Is the rendered element visible on screen?
│   LAYER     │  Element exists but invisible? CSS/layout is broken.
└─────────────┘
```

### Rapid Layer Identification

| Question | How to Check | If No → |
|----------|-------------|---------|
| Does the handler fire? | Add `console.log('clicked')` as first line | Event layer broken |
| Does state change? | Log state value after update | State layer broken |
| Does the API call succeed? | Network tab: status code + response body | Data layer broken |
| Does the component re-render? | React DevTools: watch props/state | Render layer broken |
| Is the element in the DOM? | Elements tab: search for expected text/class | Render layer broken |
| Is the element visible? | Computed styles: display, visibility, opacity, dimensions | Display layer broken |

---

## 2. Quick Diagnostic Checklist

Run through this in 60 seconds before diving deep:

```
□ Open browser Console — any red errors?
□ Open Network tab — any failed requests (red)?
□ Is there a typo in the handler name? (onClick vs onclick, onSubmit vs onsubmit)
□ Is the component actually mounted? (React DevTools → search for component name)
□ Is the button/element disabled? (Check DOM attributes)
□ Is something covering the element? (Right-click → Inspect → check z-index, overlays)
□ Is the correct environment variable set? (Console: log the var, or check .env)
□ Did you save the file? (Check dev server output for compilation)
□ Hard refresh? (Cmd+Shift+R / Ctrl+Shift+R)
□ Clear site data? (Application tab → Clear site data)
```

---

## 3. Symptom Playbooks

### 3.1 Button Does Nothing When Clicked

**Most common causes** (check in this order):

1. **Handler not attached**
   ```tsx
   // ❌ Calling the function immediately, not passing it
   <button onClick={handleClick()}>Save</button>

   // ✅ Passing a reference
   <button onClick={handleClick}>Save</button>
   <button onClick={() => handleClick(id)}>Save</button>
   ```

2. **Element is covered by invisible overlay**
   - Right-click the button → Inspect → is the highlighted element actually the button?
   - Check for: modals with `opacity: 0`, absolute/fixed positioned elements, `pointer-events: none` on parent
   - DevTools: `document.elementFromPoint(x, y)` to see what's actually on top

3. **Button is inside a form and causing navigation**
   ```tsx
   // ❌ Default type is "submit" — reloads the page
   <form><button onClick={handleClick}>Go</button></form>

   // ✅ Explicitly set type
   <form><button type="button" onClick={handleClick}>Go</button></form>
   ```

4. **Event propagation stopped by parent**
   - Check parent elements for `e.stopPropagation()` calls
   - Check for `pointer-events: none` on any ancestor

5. **Handler has early return or guard that silently exits**
   ```tsx
   const handleClick = () => {
     if (!isValid) return; // ← Is isValid always false?
     // rest of logic never runs
   };
   ```

6. **Disabled state you can't see**
   ```tsx
   // Button looks normal but is functionally disabled
   <button onClick={isLoading ? undefined : handleClick}>Save</button>
   ```

**Diagnosis steps**:
```
1. Console.log as first line of handler → fires?
   NO  → Handler not attached. Check onClick spelling, element type, overlay.
   YES → Continue.
2. Console.log before each conditional return → which one exits?
   → Found the guard that's blocking. Fix the condition.
3. Log the async call result → does the API call happen?
   NO  → Something prevents reaching the call. Walk through logic.
   YES → Problem is in handling the response. Check step 4.
4. Network tab → is the request successful?
   → Debug at the data layer.
```

---

### 3.2 Form Submits But Nothing Happens

**Most common causes**:

1. **Missing `e.preventDefault()` — page reloads**
   ```tsx
   // ❌ Form does full page navigation
   const onSubmit = (data) => { saveData(data); };

   // ✅ Prevent default form behavior
   const onSubmit = (e) => { e.preventDefault(); saveData(formData); };

   // ✅ React Hook Form handles this automatically
   <form onSubmit={handleSubmit(onSubmit)}>
   ```

2. **Validation fails silently**
   ```tsx
   // React Hook Form: check formState.errors
   const { formState: { errors } } = useForm();
   console.log('Form errors:', errors); // ← Are there validation errors?

   // Zod: the schema rejects the data shape
   const result = schema.safeParse(formData);
   console.log('Parse result:', result); // ← success: false?
   ```

3. **Server Action not connected**
   ```tsx
   // ❌ Server action defined but not used correctly
   <form action={submitForm}>  // Works in Next.js App Router
   <form onSubmit={submitForm}> // ❌ This doesn't work for server actions
   ```

4. **API call succeeds but no feedback**
   - Request returns 200 but UI shows no success/error message
   - Check: is there a toast/notification after the API call?
   - Check: does the page revalidate/refresh after mutation?

5. **Submit button is outside the form element**
   ```tsx
   // ❌ Button not inside <form>, won't trigger submit
   <form id="myForm">...</form>
   <button type="submit">Save</button>

   // ✅ Use form attribute or put button inside form
   <button type="submit" form="myForm">Save</button>
   ```

**Diagnosis steps**:
```
1. Does the page reload on submit?
   YES → Missing e.preventDefault() or using server action wrong.
   NO  → Continue.
2. Console.log in onSubmit → fires?
   NO  → Form validation is blocking. Check errors object.
   YES → Continue.
3. Network tab → is the API request sent?
   NO  → Submit handler doesn't reach the fetch/mutation call.
   YES → Check response. Success? Failure? What does the handler do with it?
```

---

### 3.3 Data Doesn't Appear on the Page

**Most common causes**:

1. **Data is fetched but the key/path is wrong**
   ```tsx
   // API returns { data: { users: [...] } }

   // ❌ Wrong path
   const users = response.data; // This is { users: [...] }, not the array

   // ✅ Correct path
   const users = response.data.users;
   ```

2. **Supabase returns empty array due to RLS** (see Section 4)
   - The query succeeds (200) but returns `[]`
   - No error is thrown — this is the #1 Supabase data gotcha

3. **Data is null/undefined during initial render**
   ```tsx
   // ❌ Crashes on first render before data loads
   return <div>{data.items.map(...)}</div>;

   // ✅ Handle loading state
   if (!data) return <Loading />;
   return <div>{data.items.map(...)}</div>;
   ```

4. **useEffect dependency array prevents refetch**
   ```tsx
   // ❌ Empty deps = fetches once on mount, never again
   useEffect(() => { fetchData(filter); }, []);

   // ✅ Include the dependency
   useEffect(() => { fetchData(filter); }, [filter]);
   ```

5. **Next.js caching returns stale data**
   - Fetch is cached and returns old data
   - See `nextjs-react-debugging` skill for cache debugging
   - Quick fix: `fetch(url, { cache: 'no-store' })` to confirm it's a caching issue

6. **Component renders before async data resolves**
   ```tsx
   // State is initially empty and component renders that
   const [items, setItems] = useState([]);
   // ...items.map renders nothing on first pass
   ```

7. **TanStack Query / SWR serving stale cache**
   ```tsx
   // Client-side data fetching libraries cache independently from Next.js
   // Data may be stale even though the API returns fresh data

   // TanStack Query: check staleTime and gcTime
   const { data } = useQuery({
     queryKey: ['projects'],
     queryFn: fetchProjects,
     staleTime: 5 * 60 * 1000, // ← Data considered "fresh" for 5 min
   });

   // Force refetch to confirm it's a cache issue:
   queryClient.invalidateQueries({ queryKey: ['projects'] });

   // SWR: check dedupingInterval and revalidation settings
   const { data, mutate } = useSWR('/api/projects', fetcher);
   mutate(); // Force revalidation
   ```

**Diagnosis steps**:
```
1. Network tab → does the request fire? What's the response?
   NO REQUEST  → Fetch never called. Check useEffect, loader, or server component.
   EMPTY ARRAY → RLS (Supabase), wrong query params, or no matching data.
   ERROR       → API error. Check server logs.
   GOOD DATA   → Continue.
2. Console.log the data in the component → correct shape?
   UNDEFINED   → Data not passed to component. Check props/context.
   WRONG SHAPE → Transform/map the data correctly.
   CORRECT     → Continue.
3. Does the JSX render the data? Check conditional rendering.
   → Look for {data && ...}, {data?.length > 0 && ...}, etc.
```

---

### 3.4 Modal/Dialog Doesn't Open or Close

**Most common causes**:

1. **shadcn/ui Dialog: missing `onOpenChange`** (see Section 5)
   ```tsx
   // ❌ Controlled dialog without onOpenChange can't close
   <Dialog open={isOpen}>

   // ✅ Always provide onOpenChange for controlled dialogs
   <Dialog open={isOpen} onOpenChange={setIsOpen}>
   ```

2. **State not toggling correctly**
   ```tsx
   // ❌ Always sets to true, never toggles
   const openModal = () => setIsOpen(true);
   // Close handler missing or never called

   // Check: is there an onClose/setIsOpen(false) anywhere?
   ```

3. **Portal renders outside visible area**
   - Dialog renders in a portal at `<body>` root
   - Check if CSS on body/html clips or hides overflow
   - Check z-index: modal needs higher z-index than everything else

4. **Close fires immediately after open**
   ```tsx
   // ❌ Click event propagates: opens then immediately closes
   <div onClick={closeModal}>
     <button onClick={openModal}>Open</button>
   </div>

   // ✅ Stop propagation
   <button onClick={(e) => { e.stopPropagation(); openModal(); }}>Open</button>
   ```

5. **Trigger element re-renders and resets state**
   - Parent component re-renders → state resets to false
   - Check if modal state is defined at the correct level

**Diagnosis steps**:
```
1. Click trigger → does open state change?
   Log the state: console.log('isOpen:', isOpen)
   NO  → Handler not firing or state not updating.
   YES → Continue.
2. Is the dialog element in the DOM?
   Elements tab → search for dialog/modal class names
   NO  → Conditional rendering blocks it. Check {isOpen && <Dialog>}.
   YES → Continue.
3. Is the dialog visible?
   Check computed styles: display, opacity, z-index, position, transform
   → CSS is hiding it. Fix the styles.
```

---

### 3.5 Filter/Search Doesn't Work

**Most common causes**:

1. **Filtering client-side on wrong field**
   ```tsx
   // ❌ Filtering on 'name' but data uses 'title'
   const filtered = items.filter(i => i.name.includes(query));

   // ✅ Check the actual field name in the data
   const filtered = items.filter(i => i.title.includes(query));
   ```

2. **Case sensitivity**
   ```tsx
   // ❌ "React" doesn't match "react"
   items.filter(i => i.name.includes(query));

   // ✅ Normalize case
   items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
   ```

3. **Filter state doesn't trigger re-fetch (server-side filtering)**
   ```tsx
   // URL params not updating
   // Check: does the URL change when you select a filter?
   // Check: does the server query use the filter parameter?
   ```

4. **Debounce too aggressive or broken**
   ```tsx
   // Search input debounces but the debounced function is stale
   // or debounce delay is so long user thinks it's broken
   ```

5. **useSearchParams needs Suspense boundary** (Next.js)
   ```tsx
   // ❌ Direct usage in page component breaks static generation
   export default function Page() {
     const params = useSearchParams(); // Breaks
   }

   // ✅ Wrap in Suspense
   export default function Page() {
     return <Suspense><SearchContent /></Suspense>;
   }
   ```

**Diagnosis steps**:
```
1. Type in search → does the filter state update?
   Console.log the filter value on each change.
   NO  → Input not connected to state. Check onChange handler.
   YES → Continue.
2. Does the filtered result set change?
   Log filtered.length after filter logic.
   SAME → Filter logic is wrong. Check field names, case, comparison.
   CHANGES → Continue.
3. Does the UI update?
   → If data changes but UI doesn't, it's a render issue. Check keys, memoization.
```

---

### 3.6 Drag and Drop Is Broken

**Most common causes**:

1. **Missing drag attributes**
   ```tsx
   // ❌ Element not draggable
   <div>Drag me</div>

   // ✅ Native HTML drag
   <div draggable onDragStart={handleDragStart}>Drag me</div>
   ```

2. **Drop zone doesn't allow drops**
   ```tsx
   // ❌ Must prevent default on dragOver for drop to work
   <div onDrop={handleDrop}>Drop here</div>

   // ✅ Prevent default on dragOver
   <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>Drop here</div>
   ```

3. **Library-specific issues (dnd-kit, react-beautiful-dnd)**
   - Missing `DndContext` or `DragDropContext` provider
   - Sensor not configured (pointer, keyboard)
   - Collision detection not matching drop zones
   - Missing `useDroppable` / `useSortable` hooks on targets

4. **Touch devices: touch events conflict with drag**
   - `touch-action: none` needed on draggable elements
   - Some libraries need touch sensor explicitly enabled

5. **State update doesn't persist new order**
   ```tsx
   // Items reorder visually during drag but snap back on drop
   // → The onDragEnd handler isn't updating the source array
   ```

**Diagnosis steps**:
```
1. Can you start a drag? Does the element visually respond?
   NO  → Missing draggable attribute or drag start handler.
   YES → Continue.
2. Does the drop zone highlight/respond on dragOver?
   NO  → Missing preventDefault on dragOver or droppable setup.
   YES → Continue.
3. Does the drop handler fire?
   Console.log in onDrop/onDragEnd
   NO  → Drop zone not accepting. Check type matching.
   YES → State update in handler is wrong. Log before/after state.
```

---

### 3.7 Animation Doesn't Play

**Most common causes**:

1. **CSS transition on wrong property or missing initial state**
   ```css
   /* ❌ No initial state to transition from */
   .element { transition: opacity 0.3s; }

   /* ✅ Define both states */
   .element { opacity: 0; transition: opacity 0.3s; }
   .element.visible { opacity: 1; }
   ```

2. **Framer Motion: `animate` without `initial`**
   ```tsx
   // ❌ No initial state — no animation visible
   <motion.div animate={{ opacity: 1 }}>

   // ✅ Define where to animate from
   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
   ```

3. **Element removed from DOM before animation completes**
   ```tsx
   // ❌ Conditional render — element disappears instantly
   {isVisible && <div className="fade-out">Content</div>}

   // ✅ Framer Motion AnimatePresence handles exit animations
   <AnimatePresence>
     {isVisible && <motion.div exit={{ opacity: 0 }}>Content</motion.div>}
   </AnimatePresence>
   ```

4. **`prefers-reduced-motion` media query**
   - User has system-level "reduce motion" enabled
   - Check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

5. **Tailwind animation class purged in production**
   - Custom animation class not in `tailwind.config.js` safelist
   - Dynamic class construction: `animate-${type}` gets purged

**Diagnosis steps**:
```
1. Does the element exist in the DOM during the animation window?
   → Elements tab: is it there? Does it get removed immediately?
2. Are the CSS properties actually changing?
   → Computed tab: watch the values. Are they transitioning?
3. Is the animation defined correctly?
   → Check keyframes, transition properties, initial/animate states.
```

---

### 3.8 Page Shows Blank Content

**Most common causes**:

1. **JavaScript error prevents render**
   - Console tab: red error → fix that error first
   - Common: `Cannot read properties of undefined`, `x is not a function`

2. **Suspense fallback stuck / loading state never resolves**
   ```tsx
   // Promise never resolves → Suspense shows fallback forever
   // Check Network tab: is a request hanging?
   ```

3. **Conditional render evaluates to false**
   ```tsx
   // ❌ data is [] (empty array) which is truthy, but .length is 0
   {data.length && <Content data={data} />}  // Renders "0" or nothing

   // ✅ Explicit boolean check
   {data.length > 0 && <Content data={data} />}
   ```

4. **White screen of death (WSOD) — error boundary missing**
   - Unhandled error crashes entire React tree
   - Add `error.tsx` (Next.js) or `<ErrorBoundary>` wrapper

5. **Server component throws but error boundary is in wrong place**
   - `error.tsx` catches errors in the same route segment's `page.tsx`
   - `layout.tsx` errors need `error.tsx` one level UP

6. **CSS hiding everything**
   - `display: none` or `visibility: hidden` on a wrapper
   - `height: 0; overflow: hidden` on container
   - White text on white background

7. **JavaScript bundle failed to load**
   - No console error appears — the script simply never loaded
   - Network tab: look for failed `.js` chunk downloads (red status or cancelled)
   - Common causes: CDN outage, ad blocker blocking a script, network interruption
   - Different from a JS error: nothing appears in console because the code never ran

**Diagnosis steps**:
```
1. Console errors?
   YES → Fix the error. That's your root cause.
   NO  → Continue.
2. Network tab → did all JS bundles load successfully?
   FAILED CHUNK → Script didn't load. Check CDN, ad blockers, network.
   ALL OK → Continue.
3. Elements tab → is there HTML content in the page?
   NO  → React didn't render. Check server component errors, Suspense, data fetching.
   YES → Content exists but isn't visible. CSS issue.
4. View Page Source → does the HTML contain content?
   YES (but page is blank) → Client-side JS crashing. Check hydration errors.
   NO  → Server-side rendering failed. Check server logs.
```

---

### 3.9 State Updates But UI Doesn't Reflect It

**Most common causes**:

1. **Mutating state directly instead of creating new reference**
   ```tsx
   // ❌ React doesn't detect mutation — no re-render
   const handleAdd = () => {
     items.push(newItem);
     setItems(items); // Same reference!
   };

   // ✅ Create new array
   const handleAdd = () => {
     setItems([...items, newItem]);
   };

   // ❌ Mutating nested object
   const handleUpdate = () => {
     user.name = 'New Name';
     setUser(user); // Same reference!
   };

   // ✅ Spread to create new reference
   const handleUpdate = () => {
     setUser({ ...user, name: 'New Name' });
   };
   ```

2. **Stale closure captures old state**
   ```tsx
   // ❌ count is captured at 0, always sets to 1
   const increment = () => setCount(count + 1);

   // ✅ Use updater function
   const increment = () => setCount(prev => prev + 1);
   ```

3. **React.memo or useMemo preventing re-render**
   ```tsx
   // Component wrapped in memo with shallow comparison
   // State changes but the memoized component doesn't see it
   // Check: is the component wrapped in React.memo?
   // Check: are useMemo/useCallback deps correct?
   ```

4. **Key prop not changing on list items**
   ```tsx
   // ❌ Using index as key — React reuses DOM nodes
   {items.map((item, i) => <Item key={i} data={item} />)}

   // ✅ Use stable unique ID
   {items.map(item => <Item key={item.id} data={item} />)}
   ```

5. **Zustand/Context not triggering subscriber re-render**
   ```tsx
   // ❌ Selecting entire store object — reference doesn't change
   const store = useStore();

   // ✅ Select specific slice
   const count = useStore(state => state.count);
   ```

6. **Using `useRef` instead of `useState`**
   ```tsx
   // ❌ useRef updates do NOT trigger re-renders
   const countRef = useRef(0);
   const increment = () => {
     countRef.current += 1; // Value changes but component doesn't re-render!
   };
   return <span>{countRef.current}</span>; // Always shows stale value

   // ✅ Use useState for values that should appear in UI
   const [count, setCount] = useState(0);
   const increment = () => setCount(prev => prev + 1);
   return <span>{count}</span>;
   ```

**Diagnosis steps**:
```
1. Log state value after setState → does it change?
   NO  → setState not being called or condition prevents it.
   YES → Continue.
2. React DevTools → does the component's state/props update?
   NO  → State lives in wrong component, or it's a different instance.
   YES → Continue.
3. Does the component re-render?
   Add console.log at top of component. Does it fire after state change?
   NO  → Memo/useMemo blocking. Check memoization.
   YES → JSX conditional rendering logic is wrong. Check the return statement.
```

---

### 3.10 Infinite Re-renders / Page Freezes

**Symptoms**: Console floods with logs, browser tab becomes unresponsive, "Maximum update depth exceeded" error, React DevTools highlight flashing non-stop.

**Most common causes**:

1. **setState called directly in render body (no useEffect)**
   ```tsx
   // ❌ Sets state on every render → triggers re-render → infinite loop
   export default function Component({ data }) {
     const [items, setItems] = useState([]);
     setItems(data.items); // This runs on every render!

     // ✅ Use useEffect for side effects
     useEffect(() => {
       setItems(data.items);
     }, [data.items]);
   }
   ```

2. **useEffect with missing or wrong dependency array**
   ```tsx
   // ❌ No dependency array → runs after EVERY render → sets state → re-render → loop
   useEffect(() => {
     setCount(count + 1);
   }); // Missing []!

   // ❌ Object/array in deps creates new reference each render
   useEffect(() => {
     fetchData(filters);
   }, [{ status: 'active', page: 1 }]); // New object every render!

   // ✅ Use primitive deps or useMemo
   const filters = useMemo(() => ({ status: 'active', page: 1 }), []);
   useEffect(() => { fetchData(filters); }, [filters]);
   ```

3. **Unstable function/object passed as prop triggers child re-render**
   ```tsx
   // ❌ Parent re-renders → creates new function → child sees "changed" prop → re-renders
   function Parent() {
     return <Child onChange={(val) => console.log(val)} />;
     //                       ↑ New function reference every render
   }

   // ✅ Stabilize with useCallback
   const handleChange = useCallback((val) => console.log(val), []);
   return <Child onChange={handleChange} />;
   ```

4. **Two state updates ping-ponging**
   ```tsx
   // ❌ useEffect A sets stateB → useEffect B sets stateA → useEffect A fires → loop
   useEffect(() => { setB(a + 1); }, [a]);
   useEffect(() => { setA(b + 1); }, [b]);
   ```

5. **Event handler triggers on render (not on user action)**
   ```tsx
   // ❌ Calling the function, not passing a reference
   <input onChange={setQuery(e.target.value)} />  // Runs immediately!

   // ✅ Pass a function reference
   <input onChange={(e) => setQuery(e.target.value)} />
   ```

**Diagnosis steps**:
```
1. Check console for "Maximum update depth exceeded" error
   YES → React detected the loop. Look at the component in the stack trace.
   NO  → Continue (might be a slow loop, not caught yet).
2. Add console.log at top of suspected component — how fast does it log?
   FLOODING → This component is the one looping.
3. Comment out useEffect hooks one by one
   → When the loop stops, that useEffect is the cause.
4. Check dependency arrays for objects/arrays/functions
   → Are any deps creating new references each render?
5. React DevTools Profiler → "Why did this render?"
   → Shows which prop/state change triggered each render.
```

---

### 3.11 Works in Dev But Not Production

**Most common causes**:

1. **Environment variables missing in production**
   ```
   # Next.js: client-side vars MUST start with NEXT_PUBLIC_
   NEXT_PUBLIC_API_URL=...  ✅ Available in browser
   API_URL=...              ❌ Only available server-side
   ```
   - Check: log the env var → is it `undefined` in production?

2. **TypeScript errors hidden in dev, caught in build**
   - `npm run build` locally to catch these
   - Common: implicit `any`, missing return types, unused variables (strict mode)

3. **Case-sensitive imports (Mac dev → Linux production)**
   ```tsx
   // Works on Mac (case-insensitive filesystem)
   import { Button } from './button'; // File is actually Button.tsx

   // Fails on Linux (case-sensitive filesystem) in production
   ```

4. **Tailwind classes purged in production**
   - Dynamic class names get purged: `` `text-${color}-500` ``
   - Fix: use complete class names or `safelist` in config

5. **API URLs hardcoded to localhost**
   ```tsx
   // ❌ Works in dev, fails in production
   fetch('http://localhost:3000/api/data');

   // ✅ Use relative URLs or env vars
   fetch('/api/data');
   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`);
   ```

6. **Build-time vs runtime data**
   - Static pages built at deploy time with stale data
   - See `nextjs-react-debugging` skill for caching issues

**Diagnosis steps**:
```
1. Build locally: npm run build && npm start
   ERROR → Fix build errors. These are your production bugs.
   WORKS → Continue.
2. Check environment variables in production deployment
   → Deployment platform dashboard: are all env vars set?
3. Check browser console in production
   → Are there errors that don't appear in dev?
4. Check Network tab in production
   → Are API calls going to the right URLs?
```

---

### 3.12 Works on Desktop But Not Mobile

**Most common causes**:

1. **Hover-dependent interactions**
   ```tsx
   // ❌ Only visible on hover — can't hover on touch devices
   <div className="opacity-0 hover:opacity-100">Actions</div>

   // ✅ Always visible on mobile, hover on desktop
   <div className="opacity-100 md:opacity-0 md:hover:opacity-100">Actions</div>
   ```

2. **Click vs touch events**
   - `onClick` works on mobile (React normalizes this)
   - But `onMouseDown`/`onMouseEnter` don't fire on touch
   - `onTouchStart`/`onPointerDown` for touch-specific handling

3. **Viewport/responsive issues**
   ```tsx
   // ❌ Fixed width overflows on mobile
   <div style={{ width: '800px' }}>Content</div>

   // ❌ Tailwind: desktop classes applied first (min-width)
   // Wrong mental model: "sm" is not "small screens", it's "640px and UP"
   <div className="hidden sm:block">  // Hidden below 640px!
   ```

4. **Virtual keyboard pushing content**
   - Form inputs: keyboard pushes content up
   - Fixed elements get repositioned
   - `100vh` includes space behind keyboard on some browsers

5. **Touch target too small**
   - Minimum 44x44px for touch targets (WCAG)
   - Small buttons/links that work with a precise cursor fail with fingers

6. **Safari-specific issues**
   - `100vh` bug (includes address bar)
   - `position: fixed` inside scrollable containers
   - `backdrop-filter` rendering differences
   - Date input format differences

**Diagnosis steps**:
```
1. Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
   Does the issue reproduce in device emulation?
   YES → Likely responsive CSS. Inspect at mobile viewport.
   NO  → Touch-specific or real device issue. Test on actual device.
2. Check for hover-dependent UI
   → Search codebase for "hover:" — are critical interactions hover-only?
3. Check for viewport overflow
   → At mobile width, does the page scroll horizontally?
4. Test on actual device with remote debugging
   → Chrome: chrome://inspect → connect to Android device
   → Safari: Develop menu → connect to iOS device
```

---

### 3.13 Feature Worked Yesterday But Doesn't Today

**Most common causes**:

1. **Recent code change broke it**
   ```bash
   # What changed recently?
   git log --oneline -10
   git diff HEAD~5 -- src/components/FeatureName/

   # When did it last work?
   git bisect start
   git bisect bad          # Current commit is broken
   git bisect good abc123  # This commit was working
   # Git will binary search to find the breaking commit
   ```

2. **Dependency update broke something**
   ```bash
   # Check for recent dependency changes
   git diff HEAD~5 -- package.json package-lock.json

   # Restore previous lock file to test
   git checkout HEAD~5 -- package-lock.json && npm install
   ```

3. **External service changed**
   - API endpoint changed or deprecated
   - Third-party service outage
   - Rate limit hit
   - Auth tokens expired

4. **Environment variable changed**
   - Someone rotated API keys
   - Deployment config changed
   - `.env.local` got overwritten

5. **Data changed**
   - Database migration ran
   - Seed data was modified
   - RLS policies changed
   - User permissions changed

6. **Browser update**
   - Chrome/Safari auto-updated and changed behavior
   - Check: does it work in a different browser?

**Diagnosis steps**:
```
1. Check git log — was there a recent deploy or merge?
   YES → Diff the changes. Focus on files related to the broken feature.
   NO  → Continue.
2. Check external dependencies — are APIs responding?
   → Network tab: are third-party calls failing?
3. Check data — has the database content changed?
   → Query the data directly. Is it what you expect?
4. Test in different browser/incognito
   → If it works in incognito: cached state, cookies, or extensions.
5. git bisect to find the exact breaking commit
```

---

## 4. Supabase-Specific UI Pitfalls

### RLS Returns Empty Arrays, Not Errors

This is the #1 Supabase debugging trap. When Row Level Security blocks access, you get:
- HTTP 200 (success!)
- Empty array `[]` or `null`
- No error message

```tsx
// This looks like "no data exists" but really RLS is blocking
const { data, error } = await supabase
  .from('projects')
  .select('*');
// data = []  ← Not an error! RLS silently filtered everything.
// error = null ← No error!
```

**Diagnosis**:
```sql
-- Check RLS policies on the table
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Test as a specific user (in Supabase SQL editor)
SET request.jwt.claims = '{"sub": "user-uuid-here"}';
SELECT * FROM projects; -- Does this return data?

-- Nuclear option: temporarily disable RLS to confirm
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- Don't forget to re-enable!
```

### Missing `.single()` Returns Array Instead of Object

```tsx
// ❌ Returns array with one element, not the object
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);
// data = [{ id: '...', name: '...' }]  ← Array!

// ✅ Use .single() for one-row queries
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
// data = { id: '...', name: '...' }  ← Object!
```

### Wrong Column Names in Joins

```tsx
// ❌ Junction table column might not match what you expect
const { data } = await supabase
  .from('ad_library_tags')
  .select('*, ads:ad_library_id(*)');  // Wrong FK name!

// ✅ Always check database.ts for actual FK column names
const { data } = await supabase
  .from('ad_library_tags')
  .select('*, ads:ad_id(*)');  // Correct FK: ad_id
```

### Auth Session Not Available in Server Component

```tsx
// ❌ createClient() without cookies in server component has no session
const supabase = createClient();
const { data } = await supabase.from('private_table').select('*');
// Returns [] because no auth context

// ✅ Modern approach: @supabase/ssr (replaces deprecated @supabase/auth-helpers-nextjs)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// ⚠️ If you see imports from @supabase/auth-helpers-nextjs, that package
// is deprecated. Migrate to @supabase/ssr.
```

---

## 5. shadcn/ui-Specific Pitfalls

### Dialog Controlled Mode Requires `onOpenChange`

```tsx
// ❌ Can't close the dialog — no way to set open to false
<Dialog open={isOpen}>
  <DialogContent>...</DialogContent>
</Dialog>

// ✅ Provide onOpenChange to handle close (X button, overlay click, Escape)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>...</DialogContent>
</Dialog>
```

### Select Value Must Match Option Value Exactly

```tsx
// ❌ Value doesn't match any option — shows blank
<Select value={1}> {/* Number, not string */}
  <SelectItem value="1">Option 1</SelectItem> {/* String */}
</Select>

// ✅ Types must match
<Select value="1">
  <SelectItem value="1">Option 1</SelectItem>
</Select>
```

### Component Not Installed

```bash
# shadcn/ui components aren't all installed by default
# If you get "Module not found" for a shadcn component:
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add toast
```

### Toast Requires Toaster Component

```tsx
// ❌ toast() calls do nothing
import { toast } from '@/components/ui/use-toast';
toast({ title: 'Saved!' }); // Nothing appears!

// ✅ Must have <Toaster /> mounted in layout
// app/layout.tsx
import { Toaster } from '@/components/ui/toaster';
export default function Layout({ children }) {
  return <html><body>{children}<Toaster /></body></html>;
}
```

### Command/Combobox Filtering Issues

```tsx
// ❌ Command search doesn't find items
// Default filter is case-sensitive exact substring match
<Command>
  <CommandInput />
  <CommandItem value="React Framework">React</CommandItem>
</Command>

// The filter uses the `value` prop, not the children text
// Make sure `value` contains searchable text
```

---

## 6. The 5-Layer Model

Reference for deeper understanding. Each layer has specific tools and techniques.

| Layer | What Breaks | Primary Tool | Secondary Tool |
|-------|-------------|-------------|----------------|
| **Event** | Handler not called, wrong element receives event, propagation stopped | Console.log in handler | Event Listeners panel |
| **State** | Wrong value, stale closure, mutation instead of new reference | Console.log + React DevTools | Zustand/Redux DevTools |
| **Data** | API error, wrong response shape, RLS blocking, cache stale | Network tab | Supabase dashboard |
| **Render** | Component doesn't re-render, wrong conditional branch, key issues | React DevTools Components | React Profiler |
| **Display** | Element exists but invisible: z-index, overflow, dimensions, CSS | Elements + Computed tab | Layout inspectors |

### When to Escalate to Related Skills

- **Need detailed DevTools guidance** → `browser-devtools-for-ui-debugging`
- **Hydration mismatch, caching, server components** → `nextjs-react-debugging`
- **Auth/session issues** → `supabase-auth-debugging`
- **Code-level debugging techniques** → `debugging-strategies`
- **Production ops issues** → `production-debugging-playbook`
