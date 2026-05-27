---
name: code-review-guidelines
description: Effective code review practices, what to look for, how to give feedback, and review checklists. Use when reviewing a pull request, preparing code for review, or setting up automated review tooling like Danger.js or CodeRabbit.
---

# Code Review Guidelines

Give and receive effective code reviews that improve code quality without slowing down development.

## When to Use This Skill

Use when:
- Reviewing pull requests
- Preparing code for review
- Establishing team review standards
- Mentoring through code reviews

## Review Goals

### Primary Goals
1. **Find bugs** before they reach production
2. **Ensure maintainability** for future developers
3. **Share knowledge** across the team
4. **Enforce standards** consistently

### Not Goals
- Gatekeeping or power dynamics
- Achieving perfection
- Rewriting in your preferred style
- Proving you're smarter

## What to Look For

### 1. Correctness
```typescript
// ❌ Logic error
function isAdult(age: number): boolean {
  return age > 18; // Should be >= 18
}

// ❌ Off-by-one error
for (let i = 0; i <= array.length; i++) { // Should be <
  console.log(array[i]);
}

// ❌ Incorrect null handling
const name = user.profile.name; // What if profile is null?

// ✅ Correct
const name = user.profile?.name ?? 'Anonymous';
```

### 2. Edge Cases
```typescript
// Review question: What happens when...
// - Array is empty?
// - Input is null/undefined?
// - Number is negative/zero?
// - String is empty or only whitespace?
// - User is not authenticated?
// - Network request fails?
// - Concurrent requests happen?

// ❌ Missing edge case
function getFirst<T>(items: T[]): T {
  return items[0]; // Undefined if empty!
}

// ✅ Handled
function getFirst<T>(items: T[]): T | undefined {
  return items.at(0);
}
```

### 3. Security
```typescript
// ❌ SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ❌ XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ Missing authorization
async function deletePost(postId: string) {
  await db.posts.delete({ where: { id: postId } });
  // Who's allowed to delete this?
}

// ✅ Secure
async function deletePost(postId: string, userId: string) {
  const post = await db.posts.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== userId) {
    throw new ForbiddenError();
  }
  await db.posts.delete({ where: { id: postId } });
}
```

### 4. Performance
```typescript
// ❌ N+1 query problem
const posts = await db.posts.findMany();
for (const post of posts) {
  const author = await db.users.findUnique({ where: { id: post.authorId } });
  // 1 query for posts + N queries for authors
}

// ✅ Single query with include
const posts = await db.posts.findMany({
  include: { author: true },
});

// ❌ Unnecessary re-renders
function List({ items }: { items: Item[] }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
  // sort() on every render!
}

// ✅ Memoized
function List({ items }: { items: Item[] }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
}
```

### 5. Readability
```typescript
// ❌ Unclear intent
const x = data.filter(d => d.s === 'a' && d.t > Date.now() - 86400000);

// ✅ Self-documenting
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const oneDayAgo = Date.now() - ONE_DAY_MS;

const activeItems = data.filter(
  item => item.status === 'active' && item.timestamp > oneDayAgo
);
```

### 6. Error Handling
```typescript
// ❌ Swallowed errors
try {
  await saveData(data);
} catch {
  // Silent failure
}

// ❌ Generic error message
try {
  await saveData(data);
} catch (error) {
  throw new Error('Something went wrong');
}

// ✅ Proper error handling
try {
  await saveData(data);
} catch (error) {
  console.error('Failed to save data:', error);
  throw new SaveError('Could not save data. Please try again.', { cause: error });
}
```

### 7. Testing
```typescript
// Questions to ask:
// - Are there tests for new code?
// - Do tests cover edge cases?
// - Are tests testing behavior, not implementation?
// - Could tests break from unrelated changes?

// ❌ Testing implementation
expect(component.state.isLoading).toBe(true);

// ✅ Testing behavior
expect(screen.getByRole('progressbar')).toBeInTheDocument();
```

## How to Give Feedback

### Be Kind and Constructive
```markdown
❌ "This is wrong."
✅ "This might cause issues when X. Consider using Y instead."

❌ "You should know better."
✅ "I've made this mistake before too! Here's what I learned..."

❌ "Why did you do this?"
✅ "I'm curious about this approach. Was there a specific reason for it?"
```

### Explain the Why
```markdown
❌ "Use const instead of let."
✅ "Using const here signals that this value won't change, making the code easier to reason about."

❌ "Add error handling."
✅ "If this API call fails, the user will see a blank screen. Adding error handling will let us show a helpful message."
```

### Distinguish Severity

Use prefixes to indicate importance:

```markdown
**Blocking (must fix):**
🔴 [BLOCKER] This will cause a runtime error when user is null

**Should fix:**
🟡 [SUGGESTION] Consider extracting this to a custom hook for reusability

**Nice to have:**
🟢 [NIT] Could rename this to be more descriptive

**Question:**
❓ [QUESTION] Is there a reason this doesn't use the shared utility?

**Praise:**
✨ [NICE] Great use of discriminated unions here!
```

### Make Suggestions Actionable
```markdown
❌ "This could be better."
✅ "Consider using `useMemo` here to prevent recalculating on every render:
\`\`\`typescript
const sorted = useMemo(() => items.sort(...), [items]);
\`\`\`"
```

### Use GitHub Suggestions
```suggestion
const isValid = value != null && value.length > 0;
```

## How to Receive Feedback

### Assume Good Intent
```markdown
❌ "They're just nitpicking."
✅ "They might see something I missed."

❌ "They're trying to show off."
✅ "They're trying to share knowledge."
```

### Ask for Clarification
```markdown
"I'm not sure I understand. Could you explain why X is preferred over Y?"

"Thanks for the suggestion! I went with this approach because of Z. Does that change your recommendation?"
```

### Don't Take It Personally
```markdown
- Reviews are about code, not about you
- Everyone's code can be improved
- Learning from reviews makes you better
```

## Review Checklist

### Before Requesting Review
```markdown
## Self-Review Checklist

### Code Quality
- [ ] Code is self-documenting (clear names, simple logic)
- [ ] No debug code (console.logs, debugger statements)
- [ ] No commented-out code
- [ ] No TODOs without linked issues

### Functionality
- [ ] Requirements are met
- [ ] Edge cases are handled
- [ ] Error states are handled
- [ ] Loading states are handled

### Security
- [ ] No secrets in code
- [ ] Input is validated
- [ ] Authorization is checked
- [ ] No SQL/XSS vulnerabilities

### Testing
- [ ] Tests are added/updated
- [ ] Tests pass locally
- [ ] Coverage is maintained

### Documentation
- [ ] PR description explains the change
- [ ] Complex logic has comments
- [ ] README updated if needed
```

### During Review
```markdown
## Reviewer Checklist

### Understanding
- [ ] I understand what this PR is trying to do
- [ ] The approach makes sense
- [ ] Edge cases are considered

### Code Quality
- [ ] Code is readable and maintainable
- [ ] Naming is clear and consistent
- [ ] No unnecessary complexity
- [ ] No code duplication

### Correctness
- [ ] Logic is correct
- [ ] Error handling is appropriate
- [ ] No obvious bugs

### Security
- [ ] No security vulnerabilities
- [ ] Authorization is enforced
- [ ] Sensitive data is protected

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are efficient
- [ ] No unnecessary re-renders

### Testing
- [ ] Tests cover the changes
- [ ] Tests are meaningful
- [ ] Edge cases are tested
```

## Review Types

### Quick Review (< 100 lines)
- Focus on correctness and security
- Check edge cases
- Verify tests exist
- Time: 10-15 minutes

### Standard Review (100-400 lines)
- Full checklist
- Understand the context
- Check integration points
- Time: 30-45 minutes

### Large Review (400+ lines)
- Consider asking for split
- Review in multiple sessions
- Focus on architecture first
- Time: Schedule dedicated time

## Common Review Comments

### Naming
```typescript
// "Consider a more descriptive name"
const d = new Date();  // → const createdAt = new Date();

// "This name doesn't match what it does"
function getData() { return users; }  // → function getUsers()
```

### Simplification
```typescript
// "This can be simplified"
if (isValid === true) { }  // → if (isValid) { }

// "Consider using optional chaining"
user && user.profile && user.profile.name
// → user?.profile?.name
```

### Early Return
```typescript
// "Consider early return to reduce nesting"
function process(data) {
  if (data) {
    if (data.isValid) {
      // lots of code
    }
  }
}

// Better:
function process(data) {
  if (!data || !data.isValid) return;
  // lots of code
}
```

### Missing Types
```typescript
// "Add types for better safety"
function process(data: any) { }  // → function process(data: UserData) { }
```

### Test Coverage
```markdown
"Could you add a test for the case when X is empty?"

"This error path isn't tested. Mind adding a test?"
```

## Anti-Patterns

### Reviewer Anti-Patterns
```markdown
❌ Rubber-stamping (approving without reading)
❌ Blocking for style preferences
❌ Requesting unnecessary changes
❌ Leaving reviews without context
❌ Being harsh or dismissive
❌ Reviewing too slowly
```

### Author Anti-Patterns
```markdown
❌ Getting defensive
❌ Ignoring feedback
❌ Making large PRs
❌ Not responding to comments
❌ Not testing before review
❌ Missing PR description
```

## Team Practices

### Review SLAs
```markdown
- PRs should be reviewed within 24 hours
- Urgent PRs tagged with 🔥 should be reviewed within 2 hours
- Reviews should be re-reviewed within 4 hours of updates
```

### Rotation
```markdown
- Rotate primary reviewers to share knowledge
- At least 2 approvals for production code
- Required review from code owner for critical paths
```

### Pair Programming Alternative
```markdown
For complex changes, consider:
- Pair programming during implementation
- Review meeting to walk through together
- Mob code review for learning
```

## AI-Assisted Code Review

### Using AI for Initial Review

Before human review, use AI to catch common issues:

```markdown
## AI Review Prompt Template

Review this code for:
1. Logic errors and edge cases
2. Security vulnerabilities (injection, XSS, auth bypass)
3. Performance issues (N+1 queries, unnecessary re-renders)
4. TypeScript type safety issues
5. Error handling gaps
6. Code style and readability
7. Missing tests

For each issue found, provide:
- Severity (Critical/High/Medium/Low)
- Location (file:line)
- Description of the issue
- Suggested fix with code example

Code to review:
\`\`\`typescript
[paste code here]
\`\`\`
```

### Security-Focused AI Review

```markdown
## Security Review Prompt

Analyze this code for OWASP Top 10 vulnerabilities:

1. Injection (SQL, NoSQL, Command)
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities (XXE)
5. Broken Access Control
6. Security Misconfiguration
7. Cross-Site Scripting (XSS)
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging & Monitoring

For each vulnerability found:
- Risk level (Critical/High/Medium/Low)
- Attack vector description
- Proof of concept (if safe to demonstrate)
- Remediation steps with code

\`\`\`typescript
[paste code here]
\`\`\`
```

### Performance Analysis Prompt

```markdown
## Performance Review Prompt

Analyze this code for performance issues:

1. Database:
   - N+1 query patterns
   - Missing indexes (based on query patterns)
   - Unoptimized queries

2. React/Frontend:
   - Unnecessary re-renders
   - Missing memoization
   - Large component bundles

3. API:
   - Over-fetching data
   - Missing pagination
   - Inefficient algorithms

4. Memory:
   - Memory leaks
   - Unbounded caches
   - Large object retention

Provide complexity analysis (Big O) where applicable.

\`\`\`typescript
[paste code here]
\`\`\`
```

### AI Review Tools Integration

#### GitHub Copilot

```markdown
In VS Code with Copilot Chat:
- Select code and ask: "Review this code for bugs and security issues"
- Ask: "What edge cases am I missing?"
- Ask: "How can I optimize this?"
```

#### CodeRabbit

```yaml
# .coderabbit.yaml
reviews:
  auto_review:
    enabled: true
    drafts: true
  path_instructions:
    - path: "src/api/**"
      instructions: "Focus on security and input validation"
    - path: "src/components/**"
      instructions: "Check for accessibility and performance"
```

#### Sourcery

```yaml
# .sourcery.yaml
refactor:
  skip: []
  rule_settings:
    enable:
      - extract-method
      - use-any-of
      - remove-redundant-if
github:
  labels:
    - sourcery
```

### Hybrid Human-AI Reviews

**What AI catches well:**
- Syntax errors and typos
- Common security vulnerabilities
- Style inconsistencies
- Missing null checks
- Obvious performance issues
- Documentation gaps

**What humans catch better:**
- Business logic correctness
- Architectural concerns
- User experience issues
- Team convention alignment
- Subtle security issues
- Code maintainability

**Workflow:**
```markdown
1. AI Review (automated on PR)
   → Catches obvious issues immediately
   → Author fixes before human review

2. Human Review (by team member)
   → Focuses on business logic and architecture
   → Reviews AI suggestions for false positives
   → Provides mentoring feedback

3. Final Check (by author)
   → Addresses all feedback
   → Verifies AI suggestions make sense
```

## Automated Review Patterns

### Pre-Review CI Checks

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Danger.js for Review Automation

```typescript
// dangerfile.ts
import { danger, warn, fail, message } from 'danger';

// PR size check
const bigPRThreshold = 500;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn('This PR is quite large. Consider breaking it into smaller PRs.');
}

// Missing tests check
const hasTests = danger.git.created_files.some(f => f.includes('.test.'));
const hasSourceChanges = danger.git.modified_files.some(f =>
  f.includes('src/') && !f.includes('.test.')
);
if (hasSourceChanges && !hasTests) {
  warn('No tests added. Please add tests for new functionality.');
}

// Console.log check
const consoleLogFiles = danger.git.modified_files.filter(async f => {
  const content = await danger.github.utils.fileContents(f);
  return content.includes('console.log');
});
if (consoleLogFiles.length > 0) {
  fail(`console.log found in: ${consoleLogFiles.join(', ')}`);
}

// PR description check
if (danger.github.pr.body.length < 50) {
  warn('Please provide a more detailed PR description.');
}

// Check for TODO without issue link
const todosWithoutIssues = danger.git.modified_files.filter(async f => {
  const content = await danger.github.utils.fileContents(f);
  return content.match(/\/\/\s*TODO(?!.*#\d)/);
});
if (todosWithoutIssues.length > 0) {
  warn('TODOs found without linked issues. Please link to tracking issues.');
}
```

### GitHub Actions for PR Comments

```yaml
# .github/workflows/pr-feedback.yml
name: PR Feedback

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: preactjs/compressed-size-action@v2
        with:
          pattern: ".next/**/*.js"

  coverage-diff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          fail_ci_if_error: true
```

### Custom Review Bot

```typescript
// scripts/review-bot.ts
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function reviewPR(owner: string, repo: string, prNumber: number) {
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  const comments = [];

  for (const file of files) {
    // Check for large files
    if (file.additions > 300) {
      comments.push({
        path: file.filename,
        line: 1,
        body: '⚠️ This file has over 300 lines of changes. Consider splitting into smaller commits.',
      });
    }

    // Check for missing types in TypeScript
    if (file.filename.endsWith('.ts') && file.patch?.includes(': any')) {
      comments.push({
        path: file.filename,
        line: findLineNumber(file.patch, ': any'),
        body: '🔴 Avoid using `any`. Please add proper types.',
      });
    }
  }

  if (comments.length > 0) {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      event: 'COMMENT',
      comments,
    });
  }
}
```

## Security-Focused Reviews

### OWASP Checklist Integration

```markdown
## Security Review Checklist

### A01: Broken Access Control
- [ ] Authorization checked on every endpoint
- [ ] No IDOR vulnerabilities (check object ownership)
- [ ] Rate limiting on sensitive operations
- [ ] CORS configured correctly

### A02: Cryptographic Failures
- [ ] Sensitive data encrypted in transit (HTTPS)
- [ ] Passwords hashed with bcrypt/argon2
- [ ] No hardcoded secrets
- [ ] Secure random number generation

### A03: Injection
- [ ] Parameterized queries for database
- [ ] Input validation on all user data
- [ ] Output encoding for HTML/JS
- [ ] No shell command injection

### A04: Insecure Design
- [ ] Threat modeling considered
- [ ] Rate limiting implemented
- [ ] Audit logging for sensitive actions

### A05: Security Misconfiguration
- [ ] Error messages don't leak info
- [ ] Security headers configured
- [ ] Default credentials changed
- [ ] Unnecessary features disabled

### A06: Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit)
- [ ] Licenses reviewed

### A07: Authentication Failures
- [ ] Strong password requirements
- [ ] Account lockout after failures
- [ ] Session timeout configured
- [ ] MFA available for sensitive accounts

### A08: Software Integrity Failures
- [ ] Dependencies from trusted sources
- [ ] Integrity checks on downloads
- [ ] CI/CD pipeline secured

### A09: Security Logging Failures
- [ ] Security events logged
- [ ] Logs protected from tampering
- [ ] Alerting on suspicious activity

### A10: Server-Side Request Forgery
- [ ] URL validation on server-side requests
- [ ] No internal network access from user input
```

### Secrets Detection

```yaml
# .github/workflows/secrets-scan.yml
name: Secrets Scan

on: [push, pull_request]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

## Performance Review Patterns

### Bundle Size Review

```typescript
// scripts/bundle-analysis.ts
import { readFileSync } from 'fs';
import { globSync } from 'glob';

const MAX_BUNDLE_SIZE = 250 * 1024; // 250KB

function analyzeBundles() {
  const bundles = globSync('.next/static/chunks/*.js');
  const issues = [];

  for (const bundle of bundles) {
    const size = readFileSync(bundle).length;
    if (size > MAX_BUNDLE_SIZE) {
      issues.push({
        file: bundle,
        size: `${(size / 1024).toFixed(2)}KB`,
        limit: `${(MAX_BUNDLE_SIZE / 1024).toFixed(2)}KB`,
      });
    }
  }

  return issues;
}
```

### Import Analysis

```typescript
// Review for tree-shaking issues
// ❌ Imports entire library
import _ from 'lodash';
const result = _.get(obj, 'path');

// ✅ Imports only what's needed
import get from 'lodash/get';
const result = get(obj, 'path');

// ❌ Barrel file imports
import { Button, Input, Card } from '@/components';

// ✅ Direct imports
import { Button } from '@/components/button';
import { Input } from '@/components/input';
```

### Database Query Review

```markdown
## Query Review Checklist

### Efficiency
- [ ] No SELECT * (only needed columns)
- [ ] Appropriate LIMIT on queries
- [ ] Indexes exist for WHERE/JOIN columns
- [ ] No N+1 patterns (use includes/joins)

### Security
- [ ] Parameterized queries (no string concatenation)
- [ ] User input validated before query
- [ ] Row-level security considered

### Performance Queries
\`\`\`sql
-- Check for missing indexes
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 1;

-- If "Seq Scan" appears, consider adding index:
CREATE INDEX idx_posts_user_id ON posts(user_id);
\`\`\`
```

## Resources

- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)
- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [Conventional Comments](https://conventionalcomments.org/)
- [Danger.js Documentation](https://danger.systems/js/)
- [CodeRabbit](https://coderabbit.ai/)
- [GitHub Copilot Code Review](https://docs.github.com/en/copilot)
