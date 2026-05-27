---
name: copy-review
description: Sharpen every word in your app so users understand, decide, and act faster. Use when reviewing UI text, onboarding flows, or error messages for clarity, tone, and conversion.
---

# Copy Review Skill

Systematic review of all user-facing copy in an application. Audits text against the app's purpose, audience, and brand voice, then provides actionable rewrites organized by severity.

---

## Core Philosophy

**Copy is a product feature, not decoration.** Every word in your app either helps users succeed or gets in their way. There is no neutral text.

### The Copy Contract

Users give you their attention. In return, every piece of text must:
1. **Help them understand** where they are and what's happening
2. **Help them decide** what to do next
3. **Help them feel** confident they're in the right place

If copy doesn't serve one of those three purposes, it's noise.

### What Good App Copy Looks Like

| Principle | Bad | Good |
|-----------|-----|------|
| **Clear over clever** | "Unleash the power of your data" | "See your sales by month" |
| **Specific over vague** | "Something went wrong" | "We couldn't save your changes. Check your connection and try again." |
| **Active over passive** | "Your password has been reset" | "You reset your password" |
| **Short over long** | "In order to proceed with..." | "To continue..." |
| **Human over corporate** | "Your request has been submitted and is being processed" | "Got it! We'll email you when it's ready." |

---

## Step 1: Understand the App

**Do not review any copy until you understand the product.** Generic copy advice is useless. Every review must be grounded in what the app does and who it serves.

### Gather the Brief

Look for or ask the user for:

1. **What the app does** - One sentence. "Helps freelancers send invoices and get paid faster."
2. **Who it's for** - Target audience with specifics. "Solo freelancers who hate admin, ages 25-45, non-technical."
3. **Brand voice** - How should the app sound? (e.g., "Friendly but professional. Like a smart friend who happens to be an accountant.")
4. **Key goals** - What does the business need users to do? (e.g., "Sign up, create first invoice, connect bank account.")
5. **Competitive context** - Who are alternatives? How should this feel different?

### Where to Find This Information

Search the codebase for:
- `README.md`, `BRIEF.md`, `PRODUCT.md`, or similar docs
- `/docs/` or `/documentation/` directories
- Brand guidelines or style guides
- Marketing pages or landing page copy
- Package description in `package.json`

If none exist, **ask the user** before proceeding. A copy review without context is just opinion.

### Voice Profile Template

Once gathered, synthesize into a voice profile:

```
VOICE PROFILE
─────────────
Personality: [e.g., Confident, warm, direct]
Tone range:  [e.g., Casual-to-professional depending on context]
Vocabulary:  [e.g., Simple, no jargon, explain technical terms]
Humor:       [e.g., Light and occasional, never in error states]
Formality:   [e.g., First names, contractions OK, no "Dear User"]
```

---

## Step 2: Find All Copy

Systematically locate every piece of user-facing text in the codebase.

### Where to Search

```
Search patterns (adapt to framework):

# React/Next.js JSX text
- String literals in JSX: grep for text between > and <
- Component props: placeholder=, title=, label=, alt=, aria-label=
- Template literals in JSX: {`...`}

# Content/i18n files
- JSON translation files: en.json, messages.json, locales/
- Content directories: /content/, /copy/, /strings/
- Constants with user-facing text: MESSAGES, LABELS, ERRORS, STRINGS

# Configuration with copy
- Meta tags: <title>, <meta description>
- Toast/notification messages
- Email templates
- PDF/export templates

# Dynamic copy
- API error messages returned to users
- Validation messages in schemas (Zod, Yup)
- Placeholder and default values
```

### Copy Inventory Checklist

Catalog every instance of these copy types:

- [ ] **Page titles** and meta descriptions
- [ ] **Navigation labels** (menus, tabs, breadcrumbs)
- [ ] **Headings** (H1-H6 on every page/view)
- [ ] **Body copy** (descriptions, explanations)
- [ ] **CTAs** (buttons, links that prompt action)
- [ ] **Form labels** and placeholder text
- [ ] **Validation/error messages**
- [ ] **Empty states** ("No results", "Get started" screens)
- [ ] **Loading states** (skeleton text, spinners with messages)
- [ ] **Success/confirmation messages**
- [ ] **Onboarding copy** (welcome screens, tooltips, tours)
- [ ] **Modal/dialog content** (titles, descriptions, button labels)
- [ ] **Tooltip and help text**
- [ ] **Notification copy** (toasts, banners, alerts)
- [ ] **Footer content**
- [ ] **Legal/compliance text** (terms links, privacy notices)
- [ ] **404 and error pages**

---

## Step 3: The 12 Review Dimensions

Score each piece of copy against these dimensions. Not all dimensions apply to all copy — a button label doesn't need "emotional intelligence" but an error message does.

### 1. Clarity

*Can the user understand this instantly?*

```
❌ "Your action could not be completed due to a conflict with the current state of the resource."
✅ "Someone else just edited this. Refresh to see their changes, then try again."

❌ "Manage subscription preferences"
✅ "Change your plan"
```

**Check:** Read it once. If you have to re-read it, rewrite it.

### 2. Conciseness

*Can you say the same thing with fewer words?*

```
❌ "In order to get started with your account setup process, please click the button below."
✅ "Set up your account"

❌ "Are you sure you want to permanently delete this item? This action cannot be undone."
✅ "Delete this forever? There's no undo."
```

**Check:** Remove a word. Does the meaning change? If not, remove it.

### 3. Tone Consistency

*Does this sound like the same app wrote it?*

```
❌ Page A: "Hey! Let's get you set up 🎉"
   Page B: "Please complete the required fields to proceed."
   (Two different personalities)

✅ Page A: "Let's get you set up"
   Page B: "Just a few details to fill in"
   (Same friendly, direct voice)
```

**Check:** Read copy from different screens back-to-back. Does it sound like the same person wrote it?

### 4. Action Orientation

*Does the user know exactly what to do next?*

```
❌ Button: "Submit"
✅ Button: "Send invoice"

❌ Button: "OK"
✅ Button: "Got it, continue"

❌ Empty state: "No projects yet."
✅ Empty state: "No projects yet. Create your first one to get started."
```

**Check:** Every screen should answer: "What should I do now?"

### 5. Error Handling Copy

*When things go wrong, does the copy help users recover?*

Good error messages follow the pattern: **What happened + Why + What to do**

```
❌ "Error 403"
✅ "You don't have access to this page. Ask your team admin to invite you."

❌ "Invalid input"
✅ "Email addresses need an @ symbol. Try something like name@company.com"

❌ "Request failed"
✅ "We couldn't reach our servers. Check your internet connection and try again."
```

**Check:** Could a non-technical person read this error and know how to fix it?

### 6. User Focus

*Is the copy about the user or about the product?*

```
❌ "Our platform leverages AI to provide intelligent insights."
✅ "Get answers from your data in seconds."

❌ "We've updated our dashboard with new features."
✅ "You can now filter reports by date range."
```

**Check:** Count instances of "we/our/the platform" vs "you/your". User-focused copy centers on "you".

### 7. Accessibility

*Can everyone understand this, regardless of reading level or ability?*

```
❌ "Utilize the interface to configure parameters"
✅ "Use settings to change how this works"

❌ Button: [icon only, no label]
✅ Button: [icon + "Save"] or [icon with aria-label="Save"]
```

**Check:**
- Reading level: aim for grade 6-8 (plain language)
- Screen readers: do all interactive elements have text labels?
- Color: is meaning conveyed with text, not just color? (red dot alone vs "Error: ...")

### 8. Conversion Support

*Does the copy help users take the action the business needs?*

```
❌ "Sign up for our free plan"
✅ "Start free — no credit card needed"

❌ "Upgrade"
✅ "Get unlimited projects for $9/mo"

❌ Pricing page: "Enterprise" with no context
✅ Pricing page: "Enterprise — For teams of 50+. Dedicated support, SSO, and custom contracts."
```

**Check:** At decision points (signup, upgrade, checkout), does the copy reduce anxiety and increase confidence?

### 9. Consistency

*Are the same things called the same thing everywhere?*

```
❌ "Workspace" on page A, "Project" on page B, "Space" on page C (same concept, three names)
✅ "Workspace" everywhere

❌ "Delete" in one place, "Remove" in another, "Trash" in a third (same action, three verbs)
✅ Pick one and use it everywhere
```

**Check:** Create a glossary of key terms. Search the codebase for each. Are there synonyms being used interchangeably?

### 10. Emotional Intelligence

*Does the copy match the user's emotional state in this moment?*

```
❌ After failed payment: "Oops! 😅 Something went wrong with your payment!"
✅ After failed payment: "Your payment didn't go through. Here's what to check..."

❌ After deleting account: "Thanks for using our product! We hope to see you again! 🎉"
✅ After deleting account: "Your account has been deleted. If you change your mind within 30 days, contact support@app.com."

❌ During onboarding: "Step 4 of 12. Configure your notification preferences."
✅ During onboarding: "Almost done! Just pick how you'd like to hear from us."
```

**Check:** What is the user feeling right now? Frustrated? Excited? Anxious? Does the tone match?

### 11. Brand Alignment

*Does this copy reinforce who this brand is?*

Compare every piece of copy against the voice profile from Step 1.

```
Brand voice: "Professional but warm"
❌ "Hey bestie! Check out these sick deals! 🔥"
✅ "New this week: features your team asked for."

Brand voice: "Playful and bold"
❌ "Please review the following notification settings."
✅ "Pick your vibe — how often should we ping you?"
```

**Check:** Cover the logo. Could you tell which brand wrote this?

### 12. Technical Quality

*Is the copy free from mechanical errors?*

- Spelling and grammar
- Consistent capitalization (Title Case vs Sentence case — pick one for headings)
- Consistent punctuation (periods at end of list items: all or none)
- Consistent formatting (date formats, number formats)
- No orphaned text or placeholder copy ("Lorem ipsum", "TODO", "[placeholder]")
- No developer-facing text leaking through ("null", "undefined", "NaN", raw error codes)

---

## Step 4: Conversion & Persuasion Audit

For key decision points (signup, upgrade, checkout, first-run), apply these frameworks:

### AIDA for CTAs and Landing Pages

| Stage | Purpose | Check |
|-------|---------|-------|
| **Attention** | Stop the scroll | Does the headline speak to a specific pain or desire? |
| **Interest** | Keep them reading | Does the body copy show you understand their problem? |
| **Desire** | Make them want it | Do you show the outcome, not just features? |
| **Action** | Get the click | Is the CTA specific and low-friction? |

### PAS for Problem-Focused Copy

| Stage | Purpose | Example |
|-------|---------|---------|
| **Problem** | Name the pain | "Chasing invoices wastes 5+ hours/month" |
| **Agitate** | Make it feel urgent | "That's time you could spend on actual client work" |
| **Solution** | Present the fix | "Send invoices that get paid 2x faster" |

### Value Proposition Check

Every key page should clearly answer:
1. **What is this?** (in 5 words or fewer)
2. **Who is it for?** (specific audience)
3. **Why should I care?** (benefit, not feature)
4. **What should I do?** (clear next step)

---

## Step 5: Voice & Tone Verification

### NN/g's 4 Tone Dimensions

Map the app's copy on these spectrums:

```
Funny ←————————————→ Serious
Casual ←————————————→ Formal
Irreverent ←————————————→ Respectful
Enthusiastic ←————————————→ Matter-of-fact
```

### Context-Appropriate Tone

The same app should shift tone based on context:

| Context | Tone Shift | Example |
|---------|-----------|---------|
| **Onboarding** | Warmer, more encouraging | "Great start! You're all set up." |
| **Error states** | More serious, more helpful | "We couldn't save that. Try again in a moment." |
| **Success states** | Celebratory but brief | "Invoice sent!" |
| **Settings/admin** | More neutral, more precise | "Notifications: Email digest every Monday at 9am" |
| **Destructive actions** | Clear and serious | "This will permanently delete all project data." |
| **Payment/billing** | Professional, reassuring | "You'll be charged $9/mo starting March 1. Cancel anytime." |

**Check:** Review copy in each context category. Is the tone appropriately shifting while staying on-brand?

---

## Step 6: Accessibility & Inclusion Audit

### Plain Language

- Target grade 6-8 reading level
- Avoid jargon unless your audience expects it (and even then, consider alternatives)
- Spell out acronyms on first use
- Use common words: "use" not "utilize", "help" not "facilitate", "start" not "initiate"

### Inclusive Language

- Avoid gendered terms when gender is irrelevant ("they" not "he/she")
- Don't use ability as metaphor ("blind spot" → "gap", "sanity check" → "review")
- Avoid culturally specific idioms that may not translate ("knock it out of the park" → "do a great job")
- Don't assume context ("as you know" — they might not know)

### Localization Readiness

Flag copy that would be hard to translate:
- Wordplay and puns
- Cultural references
- Text baked into images
- Hardcoded date/number formats
- Strings that concatenate translated fragments (translation breaks word order)
- Very short labels that may expand in other languages

---

## Step 7: Output Format

Organize findings into a structured report:

```markdown
# Copy Review: [App Name]

## Brief Summary
- **App purpose:** [one sentence]
- **Target audience:** [who]
- **Brand voice:** [personality in 3-5 words]
- **Scope reviewed:** [what was audited]

## Voice Profile
Personality: ...
Tone range: ...
Vocabulary: ...

---

## Blockers 🔴
Issues that actively confuse, mislead, or prevent users from succeeding.

### [Issue Title]
- **Location:** `file:line` or screen/component name
- **Current copy:** "the existing text"
- **Problem:** Why this fails the user
- **Suggested rewrite:** "the improved text"
- **Dimension:** Which of the 12 dimensions this violates

---

## Improvements 🟡
Copy that works but could serve users significantly better.

### [Issue Title]
- **Location:** ...
- **Current copy:** ...
- **Problem:** ...
- **Suggested rewrite:** ...
- **Dimension:** ...

---

## Polish 🟢
Minor refinements for consistency and professionalism.

### [Issue Title]
- **Location:** ...
- **Current copy:** ...
- **Suggested rewrite:** ...

---

## Consistency Glossary

| Term Used | Alternatives Found | Recommended |
|-----------|--------------------|-------------|
| Workspace | Project, Space | Workspace |

## Scorecard

| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity | | |
| Conciseness | | |
| Tone Consistency | | |
| Action Orientation | | |
| Error Handling | | |
| User Focus | | |
| Accessibility | | |
| Conversion Support | | |
| Consistency | | |
| Emotional Intelligence | | |
| Brand Alignment | | |
| Technical Quality | | |

## Top 3 Quick Wins
1. ...
2. ...
3. ...

## Top 3 Strategic Recommendations
1. ...
2. ...
3. ...
```

---

## Execution Notes

When running this review:

1. **Always start with Step 1.** No brief = no review. Ask the user if you can't find context in the codebase.
2. **Read the actual code.** Don't guess what the copy says — grep for it, read the components, look at the templates.
3. **Review screen by screen.** Don't just search for strings — follow user flows so you understand the copy in context.
4. **Prioritize ruthlessly.** A 50-item list helps nobody. Lead with the 5-10 changes that would have the most impact.
5. **Always provide rewrites.** Flagging a problem without a solution is half the job.
6. **Respect the brand.** Your rewrites should match the app's established voice, not impose your own preferences.
