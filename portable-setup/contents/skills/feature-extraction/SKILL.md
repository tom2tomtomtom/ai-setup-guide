---
name: feature-extraction
description: Reverse-engineer features from reference apps and adapt them to your project. Use when copying a UI pattern from another codebase, understanding how a feature works under the hood, or "make it work like X does in Y app."
---

# Feature Extraction

Systematic approach for reverse-engineering working features from reference codebases. Use when you have a working example and want to understand how it works, then adapt it to your project.

---

## When to Use This Skill

Use when:
- Copying a UI pattern from a reference app
- Learning how a specific feature is implemented
- Adapting functionality from one codebase to another
- Understanding unfamiliar code architecture
- Extracting reusable patterns from examples
- "Make it work like X does in Y app"

---

## The Extraction Workflow

### Phase 1: Locate the Feature

**Goal:** Find all files related to the feature.

```
1. Start with the UI entry point
   - Search for visible text, button labels, route names
   - Find the component that renders the feature

2. Trace dependencies
   - What does this component import?
   - What hooks/utilities does it use?
   - What API calls does it make?

3. Map the feature boundary
   - List all files involved
   - Identify shared vs feature-specific code
```

**Search strategies:**

```bash
# Find by visible text
grep -r "Insights" --include="*.tsx" --include="*.jsx"

# Find by route/URL
grep -r "/insights" --include="*.tsx" --include="*.ts"

# Find by component name
grep -r "InsightsPanel" --include="*.tsx"

# Find API endpoints
grep -r "api/insights" --include="*.ts"
```

### Phase 2: Understand the Architecture

**Goal:** Understand how the feature is structured.

**Create a feature map:**

```
Feature: Insights Panel
├── UI Layer
│   ├── components/InsightsPanel.tsx      (main component)
│   ├── components/InsightCard.tsx        (child component)
│   └── components/InsightChart.tsx       (visualization)
├── State Layer
│   ├── hooks/useInsights.ts              (data fetching)
│   └── stores/insightsStore.ts           (state management)
├── Data Layer
│   ├── api/insights.ts                   (API calls)
│   └── types/insights.ts                 (type definitions)
└── Shared Dependencies
    ├── components/Card.tsx               (reusable)
    ├── hooks/useQuery.ts                 (reusable)
    └── utils/formatDate.ts               (reusable)
```

**Questions to answer:**

1. **Entry point:** Where does the user access this feature?
2. **Data source:** Where does the data come from? (API, local, computed)
3. **State management:** How is state handled? (local, context, store)
4. **Side effects:** What happens when actions are taken?
5. **Dependencies:** What shared code does this rely on?

### Phase 3: Extract Core Logic

**Goal:** Isolate the essential implementation from the noise.

**Separate concerns:**

```
Essential (copy this):
- Core business logic
- Data transformations
- Key algorithms
- Feature-specific hooks

Replaceable (adapt to your stack):
- UI framework specifics
- State management library
- Styling approach
- API client

Ignorable (skip this):
- Framework boilerplate
- Type definitions for external libs
- Test files (unless studying patterns)
- Config files
```

**Create a "logic extract":**

```typescript
// EXTRACT: Core insight calculation logic
// From: reference-app/src/utils/calculateInsights.ts

function calculateInsight(data: DataPoint[]): Insight {
  // The actual algorithm - this is what matters
  const trend = data.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7;
  const change = ((data[data.length - 1].value - trend) / trend) * 100;

  return {
    trend,
    change,
    direction: change > 0 ? 'up' : 'down',
  };
}
```

### Phase 4: Adapt to Target Codebase

**Goal:** Implement the feature in your project using your patterns.

**Adaptation checklist:**

| Reference App | Your App | Action |
|---------------|----------|--------|
| React Query | SWR | Rewrite data fetching hook |
| Zustand | Context | Adapt state management |
| Tailwind | CSS Modules | Restyle components |
| REST API | GraphQL | Rewrite API layer |
| TypeScript | JavaScript | Remove types (or add them) |

**Implementation order:**

```
1. Types/interfaces first
   - Define your data shapes
   - Match the reference or improve

2. Core logic second
   - Pure functions, no framework code
   - Copy algorithms directly if possible

3. Data layer third
   - API calls adapted to your backend
   - Data fetching hooks

4. State layer fourth
   - Use your state management approach
   - Match the behavior, not the implementation

5. UI layer last
   - Components using your design system
   - Wire up to your data/state layers
```

---

## Feature Map Template

Use this template when extracting a feature:

```markdown
# Feature: [Name]

## Summary
One sentence describing what this feature does.

## Entry Point
- Route: `/path/to/feature`
- Component: `FeatureContainer.tsx`
- Triggered by: [user action / route / condition]

## File Map

### UI Components
| File | Purpose | Copy? |
|------|---------|-------|
| `Component.tsx` | Main view | Adapt |
| `SubComponent.tsx` | Child element | Adapt |

### State/Hooks
| File | Purpose | Copy? |
|------|---------|-------|
| `useFeature.ts` | Data fetching | Adapt |
| `featureStore.ts` | State management | Adapt |

### Core Logic
| File | Purpose | Copy? |
|------|---------|-------|
| `calculate.ts` | Business logic | Copy directly |
| `transform.ts` | Data transforms | Copy directly |

### API/Data
| File | Purpose | Copy? |
|------|---------|-------|
| `api.ts` | Backend calls | Adapt |
| `types.ts` | Type definitions | Copy/adapt |

## Key Patterns

### Pattern 1: [Name]
```typescript
// Code snippet showing the pattern
```

### Pattern 2: [Name]
```typescript
// Code snippet showing the pattern
```

## Dependencies
- External: [list libraries used]
- Internal: [list shared code used]

## Adaptation Notes
- [ ] Replace X with Y in our codebase
- [ ] Our API returns different shape, need transform
- [ ] We use different auth pattern
```

---

## Extraction Strategies by Feature Type

### UI Component Pattern

**What to look for:**
- Component props interface
- Internal state
- Event handlers
- Render logic
- Styling approach

**Extract:**
```typescript
// Reference: Collapsible panel from app-x

// 1. Props interface
interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

// 2. Core behavior (state + handlers)
const [isOpen, setIsOpen] = useState(defaultOpen);
const toggle = () => setIsOpen(!isOpen);

// 3. Render structure
<div>
  <button onClick={toggle}>{title}</button>
  {isOpen && <div>{children}</div>}
</div>
```

### Data Fetching Pattern

**What to look for:**
- API endpoint and method
- Request/response shapes
- Loading/error states
- Caching strategy
- Refetch triggers

**Extract:**
```typescript
// Reference: Insights data fetching from app-x

// 1. API shape
GET /api/insights?range={range}
Response: { insights: Insight[], meta: Meta }

// 2. Fetching logic
const fetchInsights = async (range: string) => {
  const res = await fetch(`/api/insights?range=${range}`);
  return res.json();
};

// 3. Hook pattern
function useInsights(range: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights(range).then(setData).finally(() => setLoading(false));
  }, [range]);

  return { data, loading };
}
```

### State Management Pattern

**What to look for:**
- State shape
- Actions/mutations
- Selectors/computed values
- Side effects
- Persistence

**Extract:**
```typescript
// Reference: Filter state from app-x

// 1. State shape
interface FilterState {
  dateRange: [Date, Date];
  categories: string[];
  search: string;
}

// 2. Actions
const actions = {
  setDateRange: (range) => set({ dateRange: range }),
  toggleCategory: (cat) => set(s => ({
    categories: s.categories.includes(cat)
      ? s.categories.filter(c => c !== cat)
      : [...s.categories, cat]
  })),
  setSearch: (search) => set({ search }),
  reset: () => set(initialState),
};

// 3. Derived state
const activeFilterCount = (state) =>
  (state.categories.length > 0 ? 1 : 0) +
  (state.search ? 1 : 0) +
  (state.dateRange ? 1 : 0);
```

### Algorithm/Logic Pattern

**What to look for:**
- Input/output shapes
- Core algorithm steps
- Edge cases handled
- Performance considerations

**Extract:**
```typescript
// Reference: Trend calculation from app-x

// 1. Interface
interface TrendResult {
  direction: 'up' | 'down' | 'flat';
  percentage: number;
  confidence: number;
}

// 2. Algorithm (copy directly)
function calculateTrend(values: number[]): TrendResult {
  if (values.length < 2) {
    return { direction: 'flat', percentage: 0, confidence: 0 };
  }

  const recent = values.slice(-7);
  const previous = values.slice(-14, -7);

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

  const change = ((recentAvg - previousAvg) / previousAvg) * 100;

  return {
    direction: change > 1 ? 'up' : change < -1 ? 'down' : 'flat',
    percentage: Math.abs(change),
    confidence: Math.min(values.length / 30, 1),
  };
}
```

---

## Common Extraction Patterns

### Pattern: Find by User-Visible Text

Start with what you can see:

```bash
# Find the "Export" button
grep -rn "Export" --include="*.tsx" src/

# Find the modal that appears
grep -rn "ExportModal\|export-modal" --include="*.tsx" src/

# Find what the button calls
grep -rn "handleExport\|onExport" --include="*.tsx" src/
```

### Pattern: Trace from Route

Start with the URL:

```bash
# Find route definition
grep -rn '"/insights"' --include="*.tsx" --include="*.ts" src/

# Find the page component
grep -rn "InsightsPage\|insights/page" --include="*.tsx" src/

# List imports in that file
head -50 src/pages/insights.tsx
```

### Pattern: Follow the Data

Start with the API:

```bash
# Find API endpoint
grep -rn "api/insights" --include="*.ts" src/

# Find where it's called
grep -rn "fetchInsights\|getInsights" --include="*.ts" src/

# Find the hook that uses it
grep -rn "useInsights" --include="*.ts" src/
```

### Pattern: Map Component Tree

Start with parent, trace children:

```bash
# Find main component
grep -rn "InsightsPanel" --include="*.tsx" src/

# List its imports (shows children)
grep "^import" src/components/InsightsPanel.tsx

# Find where children are defined
grep -rn "InsightCard\|InsightChart" --include="*.tsx" src/
```

---

## Adaptation Checklist

Before implementing in your codebase:

### Compatibility
- [ ] Framework matches (React/Vue/Svelte)?
- [ ] TypeScript/JavaScript alignment?
- [ ] Node version compatible?
- [ ] Required dependencies acceptable?

### Architecture Fit
- [ ] State management approach compatible?
- [ ] API layer can be adapted?
- [ ] Auth/permissions handled differently?
- [ ] Styling approach matches?

### Scope
- [ ] Feature boundary clearly defined?
- [ ] All dependencies identified?
- [ ] Shared code available or need to create?
- [ ] Tests need to be written?

### Licensing
- [ ] Source code license permits copying?
- [ ] Attribution required?
- [ ] Commercial use allowed?

---

## Quick Reference: Extraction Commands

```bash
# Find all files mentioning a feature
grep -rl "FeatureName" --include="*.ts" --include="*.tsx" src/

# Find component definitions
grep -rn "function FeatureName\|const FeatureName" --include="*.tsx" src/

# Find hook usage
grep -rn "use[A-Z][a-zA-Z]*" --include="*.tsx" src/components/Feature.tsx

# Find API calls
grep -rn "fetch\|axios\|api\." --include="*.ts" src/

# Find state management
grep -rn "useState\|useReducer\|useContext\|create(" --include="*.ts" src/

# List file structure for a feature
find src -name "*insight*" -o -name "*Insight*"

# Show imports for a file
grep "^import" src/components/Feature.tsx

# Find type definitions
grep -rn "interface.*Feature\|type.*Feature" --include="*.ts" src/
```

---

## Example: Full Extraction

**Request:** "Copy the insights UI function from app-x"

### Step 1: Locate

```bash
$ grep -rl "insights" --include="*.tsx" app-x/src/
app-x/src/pages/dashboard/insights.tsx
app-x/src/components/insights/InsightsPanel.tsx
app-x/src/components/insights/InsightCard.tsx
app-x/src/components/insights/InsightChart.tsx
app-x/src/hooks/useInsights.ts
app-x/src/api/insights.ts
app-x/src/types/insights.ts
```

### Step 2: Map

```
Feature: Insights
├── Entry: /dashboard/insights route
├── UI
│   ├── InsightsPanel.tsx (container)
│   ├── InsightCard.tsx (displays single insight)
│   └── InsightChart.tsx (trend visualization)
├── Data
│   ├── useInsights.ts (React Query hook)
│   └── api/insights.ts (fetch functions)
└── Types
    └── types/insights.ts
```

### Step 3: Extract Key Files

**types/insights.ts:**
```typescript
export interface Insight {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'flat';
  period: string;
}

export interface InsightsResponse {
  insights: Insight[];
  generatedAt: string;
}
```

**hooks/useInsights.ts:**
```typescript
export function useInsights(period: string) {
  return useQuery({
    queryKey: ['insights', period],
    queryFn: () => fetchInsights(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**components/InsightCard.tsx:**
```typescript
export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Card>
      <CardTitle>{insight.title}</CardTitle>
      <div className="text-3xl font-bold">{insight.value}</div>
      <TrendIndicator direction={insight.trend} change={insight.change} />
    </Card>
  );
}
```

### Step 4: Adapt

```typescript
// Our version using SWR instead of React Query
// our-app/src/features/insights/useInsights.ts

import useSWR from 'swr';
import { fetchInsights } from '@/api/insights';

export function useInsights(period: string) {
  const { data, error, isLoading } = useSWR(
    ['insights', period],
    () => fetchInsights(period),
    { refreshInterval: 5 * 60 * 1000 }
  );

  return {
    insights: data?.insights ?? [],
    isLoading,
    error,
  };
}
```

---

## Tips

1. **Start with types** - Understanding data shapes reveals architecture
2. **Follow imports** - They show the dependency graph
3. **Read tests** - They document expected behavior
4. **Check package.json** - Shows what libraries are in use
5. **Look for README** - Often explains architecture decisions
6. **Don't copy blindly** - Understand before adapting
7. **Keep attribution** - Note where patterns came from
8. **Simplify** - Reference code may be over-engineered for your needs
