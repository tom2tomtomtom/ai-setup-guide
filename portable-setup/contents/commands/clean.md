---
name: clean
description: Remove dead code, fix lint errors, clean unused dependencies, and patch security issues with automatic rollback safety. Use when console.logs are piling up, imports are messy, or you want a safe cosmetic cleanup before a PR.
flags:
  --security-only: Only fix security issues
  --lint-only: Only run linter auto-fix
  --dry-run: Show what would be cleaned without changing anything
---

# Clean

Fast, safe codebase cleanup. Creates a git checkpoint, runs parallel cleanup agents by category, validates nothing broke, then commits. Rollback-safe.

## Execution Model

```
Step 1: Git checkpoint (safety net)
Step 2: Parallel cleanup agents
  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
  │ Security  │ │ Dead Code │ │ Lint/Style│ │ Deps      │
  └───────────┘ └───────────┘ └───────────┘ └───────────┘
Step 3: Build check (verify nothing broke)
Step 4: Commit or rollback
```

---

## Step 1: Safety Checkpoint

```bash
# Stash uncommitted work
git stash --include-untracked -m "pre-clean stash"

# Create cleanup branch
git checkout -b cleanup/automated-$(date +%Y%m%d-%H%M%S)
```

If anything goes wrong, rollback is one command:
```bash
git checkout - && git branch -D cleanup/automated-*
git stash pop
```

---

## Step 2: Parallel Cleanup Agents

Launch 4 agents simultaneously. Each handles one category:

### Agent 1: Security Fixes (Critical)
```
- Run npm audit fix (or equivalent)
- Remove hardcoded secrets (replace with env var references)
- Fix known vulnerability patterns (eval, dangerouslySetInnerHTML with user input)
- Update .gitignore if .env or credentials are tracked
DO NOT: change any business logic or API behavior
```

### Agent 2: Dead Code Removal (High)
```
- Remove console.log / console.debug statements
- Remove commented-out code blocks (>3 lines)
- Remove unused imports
- Remove unused variables and functions (verify with grep before deleting)
- Remove empty files
DO NOT: remove TODO/FIXME comments (those are tracked separately)
```

### Agent 3: Lint and Style (Medium)
```
- Run linter auto-fix if available (eslint --fix, biome check --fix, ruff format)
- Fix inconsistent formatting (quotes, semicolons, trailing commas)
- Organize imports (group by external/internal, alphabetize)
- Fix trailing whitespace and missing newlines at EOF
DO NOT: rename variables or change code structure
```

### Agent 4: Dependency Cleanup (Medium)
```
- Remove unused dependencies from package.json (check imports first)
- Update lock file after removals
- Flag deprecated packages (report but don't auto-update major versions)
DO NOT: update major versions (that's a separate task with testing)
```

If `--security-only`, run only Agent 1.
If `--lint-only`, run only Agent 3.
If `--dry-run`, agents report findings but don't modify files.

---

## Step 3: Validate

After all agents complete:

```bash
# Build check (catches broken imports, type errors)
npm run build  # or equivalent

# Quick test run if tests exist
npm test -- --bail  # fail fast on first error
```

**If build fails:**
1. Identify which agent's changes broke it
2. Revert that agent's changes: `git checkout -- [files]`
3. Report what was reverted and why
4. Re-run build to confirm fix

**If build passes:** proceed to commit.

---

## Step 4: Commit and Report

```bash
git add -A
git commit -m "chore: automated cleanup

- [Security fixes applied / skipped]
- [Dead code removed: N files, M lines]
- [Lint fixes: N files]
- [Dependencies cleaned: N removed]"
```

Merge back to original branch:
```bash
git checkout -
git merge cleanup/automated-*
git branch -d cleanup/automated-*
git stash pop  # restore any stashed work
```

### Summary Output

```
Cleanup Complete

  Security:    [N] fixes applied
  Dead code:   [N] files cleaned, [M] lines removed
  Lint/Style:  [N] files reformatted
  Dependencies:[N] unused packages removed

  Build: passed
  Tests: passed (or N/A)

  Commit: [hash] on branch [name]
```

---

## Integration

- `/analyze` quick-wins.md feeds into cleanup targets
- `/refactor` handles structural changes (clean handles cosmetic)
- `/execute --quality` handles task-based improvements (clean handles automated fixes)
- Clean is safe to run anytime. It only does reversible, non-behavioral changes.
