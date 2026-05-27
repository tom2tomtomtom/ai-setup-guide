---
name: analyze
description: Scan codebase for security vulnerabilities, code quality issues, tech debt, and test gaps using parallel agents. Use when assessing project health, before a major release, or tracking quality trends over time.
flags:
  --monitor: Track quality trends over time and alert on degradation
  --quick: Run only security + build checks (skip deep analysis)
---

# Analyze

Comprehensive codebase analysis using parallel agents for speed. Each analysis category runs as an independent subagent with fresh context, then results are merged into a unified report.

## Execution Model

### Parallel Analysis Agents

Six categories run simultaneously as Agent subagents:

```
Wave 1 (all parallel):
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Security  │ │ Code      │ │ Tech      │ │ Testing   │ │Performance│ │ Code      │
│ (critical)│ │ Quality   │ │ Debt      │ │ Coverage  │ │ Bottlenck │ │ Style     │
└───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘

Wave 2 (main context):
┌──────────────────────────────────────────────────────────────────────┐
│ Merge results → Score → Generate report → Create tasks → Quick wins │
└──────────────────────────────────────────────────────────────────────┘
```

Each agent gets fresh context dedicated to its category. No cross-contamination, no context rot.

---

## Phase 1: Prepare

1. Create analysis structure:
   ```
   .claude-suite/quality/YYYY-MM-DD-analysis/
   ```

2. Identify the project:
   - Read package.json, tsconfig.json, or equivalent
   - Detect framework (Next.js, Express, FastAPI, etc.)
   - Note test runner (jest, vitest, pytest, etc.)
   - Note linter config (eslint, biome, ruff, etc.)

---

## Phase 2: Parallel Analysis (6 agents)

Launch all 6 agents simultaneously. Each agent should:
- Search the codebase for issues in its category
- Count and locate specific problems
- Rate severity (critical/high/medium/low)
- Return structured findings

### Agent 1: Security (Critical Priority)
```
Scan for:
- Exposed secrets (.env committed, hardcoded keys, API tokens in source)
- SQL injection risks (raw queries, string interpolation in SQL)
- XSS vulnerabilities (dangerouslySetInnerHTML, unsanitized user input)
- Outdated dependencies with known CVEs (check package.json versions)
- Missing auth checks on API routes
- CORS misconfiguration
Return: list of {file, line, issue, severity, fix}
```

### Agent 2: Code Quality (High Priority)
```
Scan for:
- Functions > 50 lines
- Files > 300 lines
- Cyclomatic complexity > 10
- Nesting depth > 4 levels
- Functions with > 5 parameters
- Duplicate code blocks (>10 lines repeated)
Return: list of {file, line, metric, value, threshold}
```

### Agent 3: Technical Debt (High Priority)
```
Scan for:
- TODO/FIXME/HACK comments (count and list)
- Deprecated API usage
- Missing error handling (unhandled promises, empty catch blocks)
- Dead code (unused exports, unreachable branches)
- Inconsistent patterns (some files use pattern A, others pattern B)
Return: list of {file, line, debt_type, description}
```

### Agent 4: Testing (High Priority)
```
Scan for:
- Source files with no corresponding test file
- Test files with skipped tests (.skip, xit, xdescribe)
- Functions/modules with no test coverage
- Test files that only test happy path (no error cases)
- Missing integration tests for API routes
Return: {coverage_estimate, untested_files[], skipped_tests[], gaps[]}
```

### Agent 5: Performance (Medium Priority)
```
Scan for:
- N+1 query patterns (loops with DB calls)
- Missing indexes (queries on unindexed columns)
- Large bundle imports (importing full lodash, moment.js)
- Unoptimized images (no next/image, no lazy loading)
- Missing caching (repeated expensive computations)
- Synchronous operations that should be async
Return: list of {file, line, issue, impact_estimate}
```

### Agent 6: Code Style (Medium Priority)
```
Scan for:
- Naming convention violations (inconsistent casing)
- Import organization (mixed styles, circular imports)
- Inconsistent formatting (mixed quotes, semicolons)
- Missing type annotations (any types, implicit any)
- Console.log statements left in production code
Return: list of {file, line, violation, convention}
```

If `--quick` flag is set, only run Agent 1 (Security) and a build check. Skip the rest.

---

## Phase 3: Merge and Score

After all agents return, in the main context:

### Health Score Calculation

```
Security:     /25 (weight: 25%)
Code Quality: /20 (weight: 20%)
Tech Debt:    /15 (weight: 15%)
Testing:      /20 (weight: 20%)
Performance:  /10 (weight: 10%)
Code Style:   /10 (weight: 10%)
─────────────────
Total:        /100
```

Scoring per category:
- 0 critical issues + 0 high = full score
- Each critical issue = -10 points in category
- Each high issue = -5 points
- Each medium issue = -2 points

---

## Phase 4: Generate Outputs

Create these files in `.claude-suite/quality/YYYY-MM-DD-analysis/`:

### analysis-report.md
- Executive summary with health score
- Findings by category (linked to file:line)
- Top 10 issues by impact
- Recommendations ordered by effort/impact ratio

### tasks.md
- Prioritized task list grouped by priority (Critical > High > Medium > Low)
- Each task has subtasks with file:line references
- First subtask: review. Middle: implement. Last: verify.
- Tasks are structured for `/execute --quality` to pick up

### quick-wins.md
- Issues fixable in <30 minutes
- Exact commands where possible (lint --fix, npm audit fix)
- Estimated health score improvement per fix

### progress.md
- Baseline metrics for tracking improvement
- Visual progress bars (empty at start)
- Comparison table for weekly tracking

---

## Phase 5: Present Results

```
Codebase Analysis Complete

Health Score: [X]/100

  Critical: [N] issues (fix now)
  High:     [N] issues (fix this week)
  Medium:   [N] issues (fix this month)
  Low:      [N] issues (nice to have)

Created: .claude-suite/quality/YYYY-MM-DD-analysis/
  - analysis-report.md (detailed findings)
  - tasks.md (prioritized task list)
  - quick-wins.md (start here)
  - progress.md (track improvements)

Next: /execute --quality to start fixing, or review quick-wins.md first.
```

---

## --monitor Flag: Quality Trend Tracking

When `/analyze --monitor` is used, compare against previous analysis:

### Trend Detection
- Complexity increase > 10% → Alert
- Test coverage decrease > 5% → Alert
- Bundle size increase > 15% → Alert
- New security vulnerabilities → Critical alert
- Health score decrease > 5 points → Warning

### Commit Analysis
Scan recent commits for:
- Large changes (>200 lines) without tests
- New dependencies added
- Complexity increases in changed files

### Architecture Guards
Check for violations:
- Cross-boundary imports
- Circular dependencies
- Pattern inconsistencies

Save trends to `.claude-suite/quality/trends.json` for historical tracking.

---

## Integration

- `/execute --quality` reads tasks.md and executes via wave-based parallelism
- `/clean` uses quick-wins.md for targeted cleanup
- `/refactor` uses code quality findings for targeted refactoring
- `/progress --detailed` reads progress.md for quality metrics
