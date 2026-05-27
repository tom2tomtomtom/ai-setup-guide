---
name: help
description: List all available slash commands with usage examples, flags, and typical workflows. Use when unsure which command to run, exploring available tools, or looking up flag options for a specific command.
---

# Claude Productivity Suite Commands

## Quick Reference

| Command | Purpose | Flags |
|---------|---------|-------|
| `/build` | Build app from natural language | - |
| `/fix` | Auto-detect and fix issues | `--with-tests` |
| `/style` | Improve visual design | - |
| `/deploy` | Deploy to production | `--emergency` |
| `/progress` | Show project status | `--detailed` |
| `/analyze` | Code health analysis | `--monitor` |
| `/clean` | Automated code cleanup | - |
| `/refactor` | Intelligent refactoring | - |
| `/setup` | Initialize project with suite | - |
| `/plan` | Product planning with vision docs | - |
| `/spec` | Create feature specifications | - |
| `/execute` | Execute development tasks | `--quality` |
| `/undo` | Undo last action | - |
| `/template` | Use project templates | - |
| `/railway-deploy` | Railway-specific deployment | - |
| `/help` | Show this command list | - |

---

## Core Commands

### `/build`
Build an application from natural language description.

```
/build "describe what you want to build"
```

**Examples:**
- `/build "a landing page for my coffee shop"`
- `/build "a todo app with user accounts"`

---

### `/fix`
Universal problem solver - automatically detects and fixes issues.

```
/fix                    # Detect and fix all issues
/fix --with-tests       # Fix issues then run full test suite
```

**What it fixes:**
- Build errors and missing dependencies
- Syntax errors and code issues
- Mobile responsiveness problems
- Performance issues
- Accessibility problems

---

### `/style`
Improve visual design and user experience.

```
/style
```

**Improvements:**
- Color schemes and typography
- Layout and spacing
- Mobile responsiveness
- Visual polish and effects

---

### `/deploy`
Deploy your app to production.

```
/deploy                 # Full deployment with all checks
/deploy --emergency     # Quick deploy with only 5 critical checks
```

**Platforms supported:** Vercel, Netlify, GitHub Pages

---

### `/progress`
Visual dashboard showing what's been built and next steps.

```
/progress               # Overview of accomplishments
/progress --detailed    # Include technical metrics (build, tests, deps)
```

---

## Analysis Commands

### `/analyze`
Deep codebase analysis with quality task generation.

```
/analyze                # Full analysis, generate improvement tasks
/analyze --monitor      # Track quality trends over time
```

**Creates:**
- `.claude-suite/quality/[date]-analysis/analysis-report.md`
- `.claude-suite/quality/[date]-analysis/tasks.md`
- `.claude-suite/quality/[date]-analysis/quick-wins.md`

---

### `/clean`
Automated code cleanup with validation.

```
/clean
```

**Cleans:**
- Console logs and debug statements
- Unused imports and variables
- Code formatting issues
- Linting errors

---

### `/refactor`
Intelligent refactoring based on codebase analysis.

```
/refactor
```

---

## Planning Commands

### `/plan`
Product planning with vision document creation.

```
/plan "describe your product or feature"
```

**Creates:**
- Technical architecture
- Feature breakdown
- Development roadmap
- Risk assessment
- Vision documents in `.claude-suite/vision/`

---

### `/spec`
Create detailed feature specifications.

```
/spec "feature name"
```

---

### `/setup`
Initialize a project with Claude Productivity Suite.

```
/setup
```

**Creates:**
- `.claude-suite/project/` structure
- Project documentation
- Standards references

---

## Execution Commands

### `/execute`
Execute development tasks based on specifications.

```
/execute                # Execute feature development tasks
/execute --quality      # Execute quality improvement tasks from /analyze
```

---

## Utility Commands

### `/undo`
Undo the last action with intelligent rollback.

```
/undo
```

---

### `/template`
Use enterprise templates for rapid development.

```
/template
```

---

### `/railway-deploy`
Railway-specific deployment with environment configuration.

```
/railway-deploy
```

---

## Command Flags Summary

| Flag | Command | Purpose |
|------|---------|---------|
| `--with-tests` | `/fix` | Run unit, integration, and e2e tests after fixing |
| `--emergency` | `/deploy` | Skip full validation, run only 5 critical checks |
| `--detailed` | `/progress` | Include build status, test coverage, dependencies |
| `--monitor` | `/analyze` | Track quality trends and alert on degradation |
| `--quality` | `/execute` | Work through quality improvement tasks |

---

## Typical Workflows

### New Project
```
/plan "my project idea"
/build "implement the plan"
/style
/deploy
```

### Fix Issues
```
/fix --with-tests
/progress
```

### Improve Quality
```
/analyze
/execute --quality
/analyze --monitor
```

### Deploy Update
```
/fix
/progress --detailed
/deploy
```

---

## Vault Intelligence Commands

Commands for working with the Obsidian vault at `~/VAULT_PATH/`. These turn your notes into an active thinking partner.

### Session Setup

| Command | Purpose |
|---------|---------|
| `/vault-context` | Load project context before a coding session. Auto-detects project from working directory. |
| `/vault-today` | Morning review. Builds a prioritized daily plan from vault context + active projects. |

### Knowledge Capture

| Command | Purpose |
|---------|---------|
| `/vault-dump` | Brain dump thoughts. Auto-creates notes, wiki-links everything to the graph. |
| `/vault-research` | Web search a topic, create a sourced vault note. |
| `/vault-resource` | Summarize a URL (article/video) into a formatted vault note. |
| `/vault-update-vault` | Sync new patterns and decisions back to vault after a coding session. |
| `/vault-graduate` | Promote buried ideas from daily notes/inbox into standalone notes. |

### Deep Thinking

| Command | Purpose |
|---------|---------|
| `/vault-ask` | Query your entire vault to answer a question. Cites sources with wiki-links. |
| `/vault-emerge` | Surface hidden ideas, unnamed patterns, and convergences across the vault. |
| `/vault-deep` | 30-day cross-domain deep scan. Pattern detection across all domains. |
| `/vault-cross-pollinate` | Force unexpected connections between two projects or concepts. |
| `/vault-challenge` | Pressure-test thinking. Find contradictions, blind spots, and shifts. |
| `/vault-trace` | Track how a specific idea evolved over time across the vault. |
| `/vault-drift` | Compare stated intentions vs actual behavior. Surface avoidance. |

### Business Intelligence

| Command | Purpose |
|---------|---------|
| `/vault-client-intel` | Analyze client work. Suggest what to pitch, build, or propose next. |
| `/vault-gaps` | Audit vault for missing knowledge, stale notes, and broken links. |
| `/vault-tov-writer` | Write or rewrite text in Tom's natural voice. |

### Typical Vault Workflows

**Start of Day**
```
/vault-today
```

**Before a Coding Session**
```
/vault-context
```

**Brain Dump After a Meeting**
```
/vault-dump "met with Matt about scope writer, he wants Google Docs version control, needs lawyer approval for SOW storage, George on paternity from March 20"
```

**End of Coding Session**
```
/vault-update-vault
```

**Weekly Review (Friday)**
```
/vault-drift
/vault-emerge
/vault-client-intel
```

**Deep Research**
```
/vault-research "agency AI adoption patterns 2026"
/vault-deep
```

---

## Creative Production Commands

Commands for AI-powered creative work via the Creative Studio plugin.

| Command | Purpose |
|---------|---------|
| `/brain-chat` | Brainstorm with AIDEN Brain |
| `/creative-strategy` | Generate creative strategy from a brief |
| `/full-campaign` | End-to-end campaign pipeline |
| `/culture-scan` | Full cultural intelligence pipeline |
| `/brand-analysis` | Strategic fit and right to play |
| `/brand-check` | Brand guideline compliance check |
| `/campaign-toolkit` | Campaign asset toolkit |
| `/generate-hero` | Generate hero images |
| `/generate-video` | Generate video content |
| `/image-to-video` | Convert image to video |
| `/edit-image` | Edit images with AI |
| `/composite` | Composite images together |
| `/remove-bg` | Remove image backgrounds |
| `/resize-suite` | Resize assets for platforms |
| `/mood-board` | Generate mood boards |

---

## Getting Help

- **Report issues:** https://github.com/anthropics/claude-code/issues
- **Documentation:** See `.claude-suite/` folder in your project

---

*Claude Productivity Suite + Vault Intelligence + Creative Production*
