---
name: git-workflow-strategies
description: Branching strategies, conventional commits, PR templates, and release workflows. Use when choosing a branching strategy, setting up commit conventions and hooks, or configuring automated releases with semantic versioning.
---

# Git Workflow Strategies

Establish clean, consistent git practices for effective collaboration.

## When to Use This Skill

Use when:
- Setting up git workflow for a team
- Deciding on branching strategy
- Creating commit message standards
- Setting up PR processes
- Planning release workflows

## Branching Strategies

### Trunk-Based Development (Recommended)
```
Best for: CI/CD, small teams, fast releases

main ─────●─────●─────●─────●─────●─────●─────→
           \   /       \   /       \   /
feature-a ──●──       feature-b ──●──

Rules:
- main is always deployable
- Short-lived feature branches (< 2 days)
- Small, frequent merges
- Feature flags for incomplete features
```

### GitHub Flow
```
Best for: SaaS, continuous deployment

main ────────●────────●────────●────────→
              \      / \      /
               \    /   \    /
feature-1 ──●──●──    feature-2 ──●──

Rules:
- main is production
- Branch from main for features
- Open PR for discussion
- Merge when approved and CI passes
- Deploy immediately after merge
```

### Git Flow
```
Best for: Scheduled releases, versioned software

main ─────────────●────────────────●────────→
                  ↑                 ↑
                  │                 │
develop ──●──●──●─┴──●──●──●──●──●─┴──●──→
           \       /              /
feature ────●──●──      release ──●──
                        (fixes)
```

## Conventional Commits

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add social login` |
| `fix` | Bug fix | `fix(cart): correct total calculation` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting | `style: fix indentation` |
| `refactor` | Code restructure | `refactor(db): simplify query logic` |
| `perf` | Performance | `perf: optimize image loading` |
| `test` | Tests | `test: add auth integration tests` |
| `build` | Build system | `build: update webpack config` |
| `ci` | CI changes | `ci: add deploy workflow` |
| `chore` | Maintenance | `chore: update dependencies` |
| `revert` | Revert commit | `revert: feat(auth): add social login` |

### Examples
```bash
# Feature with scope
git commit -m "feat(dashboard): add analytics widget"

# Bug fix with issue reference
git commit -m "fix(auth): prevent session timeout on active tab

Fixes #234"

# Breaking change
git commit -m "feat(api)!: change response format

BREAKING CHANGE: API responses now use camelCase keys"

# Multiple changes (use body)
git commit -m "refactor(components): reorganize button variants

- Extract base button styles
- Add size variants
- Update storybook examples"
```

### Commitlint Setup
```bash
npm install -D @commitlint/{cli,config-conventional}
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 72],
  },
};
```

### Husky Hook
```bash
npm install -D husky
npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

## Branch Naming

### Convention
```
<type>/<ticket-id>-<short-description>

Examples:
feat/PROJ-123-user-authentication
fix/PROJ-456-cart-calculation
docs/update-readme
chore/upgrade-dependencies
```

### Automated Setup
```bash
# Git alias for consistent branch creation
git config --global alias.feature '!f() { git checkout -b "feat/$1"; }; f'
git config --global alias.fix '!f() { git checkout -b "fix/$1"; }; f'

# Usage
git feature PROJ-123-add-login
git fix PROJ-456-cart-bug
```

## Pull Request Process

### PR Template
```markdown
<!-- .github/pull_request_template.md -->

## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Related Issues
<!-- Link to related issues: Fixes #123, Relates to #456 -->

## Changes Made
<!-- Bullet points of specific changes -->
-
-
-

## Testing
<!-- How was this tested? -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots
<!-- If UI changes, add before/after screenshots -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented hard-to-understand areas
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests proving my fix/feature works
- [ ] All tests pass locally
```

### PR Size Guidelines
```
Ideal PR Size:
- < 400 lines of changes
- Single logical change
- Can be reviewed in < 30 minutes

If PR is too large:
1. Split into smaller PRs
2. Use stacked PRs pattern
3. Consider feature flags for partial work
```

### Stacked PRs
```bash
# Create base branch
git checkout -b feat/user-auth-1-models
# ... make changes, push, create PR

# Stack on top
git checkout -b feat/user-auth-2-api
# ... make changes, push, create PR targeting user-auth-1

# Stack another
git checkout -b feat/user-auth-3-ui
# ... make changes, push, create PR targeting user-auth-2

# After user-auth-1 merges, rebase others
git checkout feat/user-auth-2-api
git rebase main
git push --force-with-lease
```

## Common Git Operations

### Clean Commit History
```bash
# Interactive rebase to clean up commits
git rebase -i HEAD~5

# In editor:
pick abc123 feat: add login form
squash def456 fix typo
squash ghi789 fix another typo
pick jkl012 feat: add validation

# Result: 2 clean commits instead of 4
```

### Sync with Main
```bash
# Preferred: Rebase (linear history)
git checkout feature-branch
git fetch origin
git rebase origin/main
git push --force-with-lease

# Alternative: Merge (preserves history)
git checkout feature-branch
git fetch origin
git merge origin/main
git push
```

### Fix Last Commit
```bash
# Amend commit message
git commit --amend -m "feat(auth): add social login"

# Add forgotten files to last commit
git add forgotten-file.ts
git commit --amend --no-edit

# Warning: Only amend unpushed commits!
```

### Undo Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific file changes
git checkout -- path/to/file

# Create revert commit
git revert abc123
```

### Cherry Pick
```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Cherry pick range
git cherry-pick abc123..def456

# Cherry pick without committing
git cherry-pick -n abc123
```

### Find Bug Introduction
```bash
# Binary search for bug
git bisect start
git bisect bad                  # Current commit is bad
git bisect good abc123          # Last known good commit

# Git checks out middle commit
# Test and mark:
git bisect good  # or
git bisect bad

# Repeat until found, then:
git bisect reset
```

## Release Workflow

### Semantic Versioning
```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)

Examples:
1.0.0 → 2.0.0  (breaking change)
1.0.0 → 1.1.0  (new feature)
1.0.0 → 1.0.1  (bug fix)
```

### Release Process
```bash
# 1. Create release branch (if using Git Flow)
git checkout -b release/1.2.0

# 2. Update version
npm version minor  # Updates package.json and creates tag

# 3. Update changelog
# (automated with conventional-changelog)
npx conventional-changelog -p angular -i CHANGELOG.md -s

# 4. Commit and push
git add .
git commit -m "chore(release): 1.2.0"
git push origin release/1.2.0 --tags

# 5. Create PR to main

# 6. After merge, merge to develop (Git Flow)
```

### Automated Releases
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

### semantic-release config
```javascript
// release.config.js
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]',
    }],
  ],
};
```

## Git Hooks

### Pre-commit
```bash
#!/bin/sh
# .husky/pre-commit

# Lint staged files
npx lint-staged

# Run type check
npm run type-check

# Run tests related to changed files
npm run test -- --changedSince=HEAD --passWithNoTests
```

### lint-staged config
```javascript
// package.json or .lintstagedrc.js
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Pre-push
```bash
#!/bin/sh
# .husky/pre-push

# Run full test suite
npm test

# Check for console.logs in production code
if git diff --cached --name-only | xargs grep -l "console.log" | grep -v ".test."; then
  echo "Warning: console.log statements found"
  exit 1
fi
```

## Best Practices

### Do
```bash
✅ Write clear, descriptive commit messages
✅ Keep commits atomic (one logical change)
✅ Pull/rebase before pushing
✅ Use feature branches
✅ Review your own PR before requesting review
✅ Respond to review comments promptly
✅ Delete merged branches
```

### Don't
```bash
❌ Commit directly to main
❌ Force push to shared branches
❌ Mix refactoring with feature work
❌ Leave PR open for weeks
❌ Ignore CI failures
❌ Merge without approval
❌ Commit secrets or sensitive data
```

## Git Aliases
```bash
# ~/.gitconfig
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = !gitk
  lg = log --oneline --graph --decorate
  amend = commit --amend --no-edit
  wip = commit -am "WIP"
  undo = reset --soft HEAD~1
  cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master\\|develop' | xargs -n 1 git branch -d"
```
