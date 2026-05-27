---
name: refactor
description: Split oversized files, extract duplicated code, flatten deep nesting, and standardize patterns using wave-based parallel execution. Use when files are too large, patterns are inconsistent, or code quality issues were flagged by /analyze.
flags:
  --scope: Limit to specific directory or file pattern (e.g. --scope src/components/)
  --dry-run: Show refactoring plan without executing
---

# Refactor

Targeted refactoring using parallel agents. Analyzes the codebase for refactoring opportunities, groups them by dependency, and executes in waves with fresh context per task.

## When to Use

- After `/analyze` identifies code quality issues
- When a file or module has grown unwieldy
- Before adding features to messy code (clean first, then build)
- When patterns are inconsistent across the codebase

## Phase 1: Identify Refactoring Targets

Read the codebase (or `--scope` subset) and identify:

### Size Issues
- Files > 300 lines → Split into modules
- Functions > 50 lines → Extract sub-functions
- Components > 200 lines → Extract child components

### Complexity Issues
- Nesting > 4 levels → Flatten with early returns or extract
- Functions with > 5 params → Use options object
- Switch/if chains > 5 cases → Use lookup maps or strategy pattern

### Duplication
- Code blocks repeated > 2 times → Extract shared utility
- Similar components with slight variations → Extract base + variants
- Repeated API call patterns → Extract API client layer

### Pattern Inconsistency
- Mixed async patterns (callbacks + promises + async/await) → Standardize on async/await
- Mixed state management (useState + useReducer + context) → Pick one per scope
- Mixed error handling (try/catch + .catch + no handling) → Standardize

### Naming Issues
- Inconsistent naming across files (camelCase vs snake_case mixed)
- Vague names (data, info, result, item, handleClick) → Descriptive names
- Abbreviations only the author understands → Spell out

Present the target list with file:line references. If `--dry-run`, stop here.

---

## Phase 2: Group and Plan

Group refactoring targets into independent tasks:

**Grouping rules:**
- Changes to the SAME file → same task (avoid merge conflicts)
- Extraction that creates a new shared utility → separate task, earlier wave
- Rename/move operations → separate task (affects imports across codebase)

**Wave ordering:**
- Wave 1: Extract shared utilities, create new modules (things others will depend on)
- Wave 2: Refactor individual files to use new shared code
- Wave 3: Rename operations (update all import paths)
- Wave 4: Cleanup (remove dead code, update re-exports)

---

## Phase 3: Execute in Waves

Each task runs as an Agent subagent with fresh context:

**Agent prompt for each refactoring task:**
```
TASK: [Refactoring description]
FILES: [List of files to modify]
PATTERN: [What the code looks like now → what it should look like]

Rules:
1. Preserve all existing behavior (refactoring = same behavior, better structure)
2. Do NOT change any public API signatures
3. Update all imports that reference moved/renamed code
4. Run build after changes to verify nothing broke
5. Commit with message: "refactor: [description]"
```

After each wave: run `npm run build` (or equivalent) to catch breakage before next wave.

---

## Phase 4: Verify

After all waves complete:

1. Run full build
2. Run tests (if they exist)
3. Summarize changes:
   - Files created/modified/deleted
   - Lines of code delta (should be neutral or negative)
   - Complexity reduction metrics
4. List any manual checks needed

---

## Refactoring Patterns (Quick Reference)

### Extract Function
```
BEFORE: 50-line function doing 3 things
AFTER:  3 focused functions called from original
```

### Extract Component
```
BEFORE: 200-line React component with inline logic
AFTER:  Parent component + 2-3 child components + custom hook
```

### Replace Conditionals with Map
```
BEFORE: if (type === 'a') ... else if (type === 'b') ... else if ...
AFTER:  const handlers = { a: ..., b: ..., c: ... }; handlers[type]()
```

### Flatten Nesting
```
BEFORE: if (a) { if (b) { if (c) { ...do work... } } }
AFTER:  if (!a) return; if (!b) return; if (!c) return; ...do work...
```

### Options Object
```
BEFORE: function create(name, email, role, active, limit)
AFTER:  function create({ name, email, role, active, limit })
```

### Standardize Async
```
BEFORE: mix of .then().catch(), try/catch, and unhandled promises
AFTER:  all async/await with try/catch at boundaries
```

---

## Integration

- `/analyze` findings feed directly into refactoring targets
- `/execute` uses the same wave-based parallel execution model
- Atomic commits per task for clean git history and easy revert
