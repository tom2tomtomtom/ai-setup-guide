---
name: github-cli-workflows
description: GitHub CLI (gh) workflows for pull requests, issues, releases, CI checks, and repository management. Use when creating PRs, managing issues, checking CI status, creating releases, or querying GitHub API from the command line.
---

# GitHub CLI Workflows

Day-to-day GitHub operations using the `gh` CLI: pull requests, issues, releases, CI checks, and API queries. Complements `git-workflow-strategies` (branching) and `ci-cd-github-actions` (YAML workflows).

## When to Use This Skill

- Creating or managing pull requests from the terminal
- Listing, creating, or closing GitHub issues
- Checking CI/CD status for a branch or PR
- Creating GitHub releases with changelogs
- Querying the GitHub API for advanced operations
- Reviewing PR comments and review status
- Checking out PRs locally for review

---

## Pull Requests

### Create a PR

```bash
# Interactive (prompts for title, body, base branch)
gh pr create

# With title and body (HEREDOC for multi-line body)
gh pr create --title "Add user authentication" --body "$(cat <<'EOF'
## Summary
- Implemented JWT-based auth flow
- Added login/signup pages
- Integrated with Supabase Auth

## Test plan
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test session persistence
EOF
)"

# Create as draft
gh pr create --draft --title "WIP: New feature"

# Specify base branch
gh pr create --base develop --title "Feature X"

# Auto-fill from commits
gh pr create --fill
```

### View and Manage PRs

```bash
# View current branch's PR
gh pr view

# View specific PR
gh pr view 123

# View in browser
gh pr view 123 --web

# List open PRs
gh pr list

# List your PRs
gh pr list --author @me

# List PRs awaiting your review
gh pr list --search "review-requested:@me"
```

### Review and Merge

```bash
# Check out a PR locally
gh pr checkout 123

# View PR diff
gh pr diff 123

# Check CI status
gh pr checks 123

# Wait for checks to pass
gh pr checks 123 --watch

# Merge PR
gh pr merge 123

# Merge with squash
gh pr merge 123 --squash

# Merge with rebase
gh pr merge 123 --rebase

# Auto-merge when checks pass
gh pr merge 123 --auto --squash
```

### PR Comments and Reviews

```bash
# View PR comments via API
gh api repos/{owner}/{repo}/pulls/123/comments

# View review comments
gh api repos/{owner}/{repo}/pulls/123/reviews

# Add a comment
gh pr comment 123 --body "Looks good, just one suggestion on the error handling."

# Request review
gh pr edit 123 --add-reviewer username

# Close PR
gh pr close 123
```

---

## Issues

### Create and Manage

```bash
# Create issue interactively
gh issue create

# Create with title and body
gh issue create --title "Bug: Login fails on Safari" --body "Steps to reproduce..."

# Create with labels
gh issue create --title "Add dark mode" --label "enhancement,frontend"

# Create with assignee
gh issue create --title "Fix auth" --assignee @me
```

### View and List

```bash
# List open issues
gh issue list

# List by label
gh issue list --label "bug"

# List assigned to you
gh issue list --assignee @me

# View specific issue
gh issue view 456

# View in browser
gh issue view 456 --web
```

### Update and Close

```bash
# Close issue
gh issue close 456

# Close with comment
gh issue close 456 --comment "Fixed in #123"

# Reopen
gh issue reopen 456

# Add labels
gh issue edit 456 --add-label "priority:high"

# Assign
gh issue edit 456 --add-assignee username
```

---

## CI/CD Checks

### View Workflow Runs

```bash
# List recent workflow runs
gh run list

# List runs for specific workflow
gh run list --workflow "deploy.yml"

# List failed runs
gh run list --status failure

# View specific run
gh run view 12345

# View run logs
gh run view 12345 --log

# Watch a run in progress
gh run watch 12345

# Re-run failed jobs
gh run rerun 12345 --failed
```

### Trigger Workflows

```bash
# Trigger workflow dispatch
gh workflow run deploy.yml

# With inputs
gh workflow run deploy.yml -f environment=staging -f version=1.2.3

# List workflows
gh workflow list
```

---

## Releases

### Create Releases

```bash
# Create release from tag
gh release create v1.0.0

# With title and notes
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"

# Generate notes from commits
gh release create v1.0.0 --generate-notes

# Create draft release
gh release create v1.0.0 --draft --generate-notes

# Create pre-release
gh release create v1.0.0-beta.1 --prerelease

# Upload assets
gh release create v1.0.0 ./dist/app.zip ./dist/app.tar.gz
```

### Manage Releases

```bash
# List releases
gh release list

# View latest
gh release view

# Download assets
gh release download v1.0.0

# Delete release
gh release delete v1.0.0
```

---

## Repository Operations

```bash
# Clone a repo
gh repo clone owner/repo

# Fork a repo
gh repo fork owner/repo

# Create new repo
gh repo create my-project --public --clone

# View repo info
gh repo view

# View in browser
gh repo view --web

# List your repos
gh repo list

# Set default repo (for API calls)
gh repo set-default owner/repo
```

---

## API Queries (Advanced)

The `gh api` command gives direct access to the GitHub REST and GraphQL APIs.

```bash
# REST: Get repo info
gh api repos/owner/repo

# REST: List PR files changed
gh api repos/owner/repo/pulls/123/files

# REST: Get user profile
gh api user

# GraphQL: Complex query
gh api graphql -f query='
  query {
    repository(owner: "owner", name: "repo") {
      pullRequests(last: 5, states: OPEN) {
        nodes {
          title
          number
          author { login }
        }
      }
    }
  }
'

# Paginate results
gh api repos/owner/repo/issues --paginate

# JSON output with jq filtering
gh api repos/owner/repo/pulls --jq '.[].title'
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `gh pr create --fill` | Create PR from commits |
| `gh pr list` | List open PRs |
| `gh pr view 123` | View PR details |
| `gh pr checkout 123` | Check out PR locally |
| `gh pr checks 123` | View CI status |
| `gh pr merge 123 --squash` | Squash merge PR |
| `gh issue create` | Create issue |
| `gh issue list --label bug` | List bugs |
| `gh issue close 456` | Close issue |
| `gh run list` | List CI runs |
| `gh run view 123 --log` | View run logs |
| `gh run watch 123` | Watch run in progress |
| `gh release create v1.0.0 --generate-notes` | Create release |
| `gh api repos/o/r/pulls/123/comments` | PR comments via API |

## Execution Notes

- `gh` auto-detects the repo from the current git directory. No need to specify owner/repo for most commands.
- Use `--web` flag on any view command to open in browser.
- PR bodies should use HEREDOC syntax for proper multi-line formatting.
- `gh pr checks --watch` is useful for waiting on CI before merging.
- `gh api` with `--jq` is powerful for extracting specific fields from JSON responses.
- For cross-repo operations, use the full `owner/repo` format.
