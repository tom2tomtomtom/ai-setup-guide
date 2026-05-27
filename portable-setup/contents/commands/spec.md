---
name: create-spec
description: Generate implementation-ready specs covering API endpoints, database schema, and UI components that match existing codebase patterns. Use when turning a plan into buildable work, before handing off to /execute, or when a feature needs cross-layer alignment.
flags:
  --from-plan: Generate spec from an existing plan file
  --api-only: Generate only API specification
  --db-only: Generate only database schema specification
---

# Spec

Generate detailed technical specifications by analyzing requirements and the existing codebase. Uses parallel agents to spec different layers simultaneously.

## Execution Model

Spec generation runs parallel agents for independent layers:

```
Wave 1 (parallel):
┌──────────┐ ┌──────────┐ ┌──────────┐
│ API Spec │ │ DB Spec  │ │ UI Spec  │
└──────────┘ └──────────┘ └──────────┘

Wave 2 (main context):
┌──────────────────────────────────────┐
│ Merge → Cross-reference → Validate  │
└──────────────────────────────────────┘
```

Each agent examines the existing codebase for patterns and conventions, then specs new work that fits the established style.

---

## Phase 1: Understand What to Spec

1. **Read the input**: Plan file (`--from-plan`), user description, or conversation context
2. **Read the codebase**: Identify existing patterns:
   - API route structure and naming conventions
   - Database schema patterns (naming, relations, RLS)
   - Component structure and state management approach
   - Auth patterns in use
   - Error handling conventions
3. **Ask clarifying questions** if requirements are ambiguous. Don't guess.

---

## Phase 2: Parallel Spec Generation

Launch agents for each layer that's relevant. Skip layers that don't apply.

### Agent: API Specification
```
For each new endpoint, define:
- Method + Path (following existing route naming convention)
- Request body (TypeScript interface with validation rules)
- Response body (TypeScript interface)
- Error responses (status codes + error shapes)
- Auth requirement (none, API key, JWT, admin)
- Rate limiting (if applicable)

Match existing API patterns found in the codebase.
Output as a structured markdown table + TypeScript interfaces.
```

### Agent: Database Specification
```
For each new table/modification:
- Table name (following existing naming: singular vs plural, prefix convention)
- Columns with types, constraints, defaults
- Indexes (based on expected query patterns)
- Foreign keys and relations
- RLS policies (if Supabase)
- Migration SQL

Match existing schema patterns found in the codebase.
Output as SQL CREATE statements + relation diagram.
```

### Agent: UI Specification
```
For each new page/component:
- Component hierarchy (parent → children)
- Props interface (TypeScript)
- State requirements (local vs global vs URL)
- Data fetching approach (matching existing pattern)
- User interactions and flows
- Loading/error/empty states
- Responsive behavior

Match existing component patterns found in the codebase.
Output as component tree + state flow diagram.
```

If `--api-only` or `--db-only`, run only that agent.

---

## Phase 3: Merge and Cross-Reference

In the main context, merge agent outputs and verify:

1. **API ↔ DB alignment**: Every API response field maps to a DB column or computed value
2. **UI ↔ API alignment**: Every UI interaction has a corresponding API endpoint
3. **Auth consistency**: Auth requirements match across layers
4. **Naming consistency**: Same concept uses same name everywhere (no user_id vs userId vs userId mismatch)

---

## Phase 4: Output

Save as `specs/{feature-name}-spec.md` with sections:

```markdown
# {Feature Name} Specification

## Overview
One paragraph: what this feature does and why.

## API Endpoints
[Table of endpoints with request/response shapes]

## Database Changes
[SQL migrations + relation diagram]

## UI Components
[Component hierarchy + state flow]

## User Flows
[Step-by-step: user action → API call → DB change → UI update]

## Edge Cases
[What happens when: empty data, errors, concurrent access, permissions denied]

## Testing Plan
[What to test per layer: unit, integration, E2E]

## Open Questions
[Anything that needs human decision before implementation]
```

---

## Spec Quality Checklist

Before presenting the spec:
- [ ] Every API endpoint has request + response types defined
- [ ] Every DB table has indexes for expected query patterns
- [ ] Every UI component has loading, error, and empty states
- [ ] Auth is specified for every endpoint
- [ ] Edge cases are listed (not just happy path)
- [ ] Spec follows existing codebase conventions (don't invent new patterns)
- [ ] Open questions are flagged (don't make assumptions)

---

## Integration

- `/plan` creates high-level plans → `/spec` turns them into implementation-ready specs
- `/execute` reads specs for task extraction and wave planning
- Specs reference existing code patterns to maintain consistency
