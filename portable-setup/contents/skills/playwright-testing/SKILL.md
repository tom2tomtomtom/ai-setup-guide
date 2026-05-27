---
name: playwright-testing
description: Build E2E test suites with Playwright including visual regression, component testing, and API mocking. Use when testing auth flows and user journeys, setting up cross-browser testing, or debugging flaky tests.
---

# Playwright Testing

Comprehensive guide for testing modern web applications with Playwright, covering end-to-end tests, visual regression, component testing, API mocking, parallel execution, and CI/CD integration.

## When to Use This Skill

Use when:
- Building E2E test suites for web applications
- Implementing visual regression testing
- Testing authentication flows and user journeys
- Setting up CI/CD test pipelines
- Testing across multiple browsers
- Implementing component testing
- Mocking API responses in tests
- Testing real-time features (WebSockets)
- Debugging flaky tests
- Setting up test automation

## Installation & Setup

### Install Playwright

```bash
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test
npx playwright install
```

### Project Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── posts.spec.ts
│   └── checkout.spec.ts
├── visual/
│   ├── homepage.spec.ts
│   └── components.spec.ts
├── api/
│   └── users.spec.ts
├── fixtures/
│   ├── auth.ts
│   └── db.ts
└── utils/
    ├── helpers.ts
    └── mocks.ts

playwright.config.ts
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

## Basic Test Patterns

### Simple Navigation Test

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check title
  await expect(page).toHaveTitle(/My App/)
  
  // Check heading
  const heading = page.getByRole('heading', { name: 'Welcome' })
  await expect(heading).toBeVisible()
  
  // Check navigation
  const navLinks = page.getByRole('navigation').getByRole('link')
  await expect(navLinks).toHaveCount(4)
})
```

### Form Submission

```typescript
// tests/e2e/contact.spec.ts
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('/contact')
  
  // Fill form
  await page.getByLabel('Name').fill('John Doe')
  await page.getByLabel('Email').fill('john@example.com')
  await page.getByLabel('Message').fill('Test message')
  
  // Submit
  await page.getByRole('button', { name: 'Send' }).click()
  
  // Verify success
  await expect(page.getByText('Message sent successfully')).toBeVisible()
})
```

### Link Navigation

```typescript
test('navigation between pages', async ({ page }) => {
  await page.goto('/')
  
  // Click link
  await page.getByRole('link', { name: 'About' }).click()
  
  // Verify new page
  await expect(page).toHaveURL('/about')
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible()
  
  // Go back
  await page.goBack()
  await expect(page).toHaveURL('/')
})
```

## Authentication Testing

### Login Flow

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('successful login', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Wait for redirect
    await page.waitForURL('/dashboard')
    
    // Verify logged in state
    await expect(page.getByText('Welcome back')).toBeVisible()
    
    // Check auth cookie/token
    const cookies = await page.context().cookies()
    const authCookie = cookies.find(c => c.name === 'auth-token')
    expect(authCookie).toBeDefined()
  })

  test('login with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Verify error message
    await expect(page.getByText('Invalid credentials')).toBeVisible()
    
    // Should stay on login page
    await expect(page).toHaveURL('/login')
  })

  test('logout flow', async ({ page }) => {
    // Login first (we'll extract this to fixture later)
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/dashboard')
    
    // Logout
    await page.getByRole('button', { name: 'Logout' }).click()
    
    // Verify redirected to home
    await page.waitForURL('/')
    
    // Verify logged out state
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
  })
})
```

### Authenticated Fixtures

```typescript
// tests/fixtures/auth.ts
import { test as base } from '@playwright/test'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/dashboard')
    
    await use(page)
    
    // Cleanup (logout)
    await page.getByRole('button', { name: 'Logout' }).click()
  }
})

export { expect } from '@playwright/test'
```

**Usage:**
```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '../fixtures/auth'

test('user can view dashboard', async ({ authenticatedPage: page }) => {
  // Already logged in!
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
```

### Storage State (Faster Auth)

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  
  await page.waitForURL('/dashboard')
  
  // Save auth state
  await page.context().storageState({ path: authFile })
})
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup']
    }
  ]
})
```

## API Testing & Mocking

### API Route Testing

```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test'

test('GET /api/users returns user list', async ({ request }) => {
  const response = await request.get('/api/users')
  
  expect(response.ok()).toBeTruthy()
  expect(response.status()).toBe(200)
  
  const users = await response.json()
  expect(users).toHaveLength(5)
  expect(users[0]).toHaveProperty('id')
  expect(users[0]).toHaveProperty('email')
})

test('POST /api/users creates new user', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  })
  
  expect(response.status()).toBe(201)
  
  const user = await response.json()
  expect(user.name).toBe('John Doe')
  expect(user.email).toBe('john@example.com')
  expect(user.id).toBeDefined()
})
```

### Mock API Responses

```typescript
// tests/e2e/posts.spec.ts
import { test, expect } from '@playwright/test'

test('display posts from API', async ({ page }) => {
  // Mock API response
  await page.route('/api/posts', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          { id: 1, title: 'Mock Post 1', content: 'Content 1' },
          { id: 2, title: 'Mock Post 2', content: 'Content 2' }
        ]
      })
    })
  })
  
  await page.goto('/posts')
  
  // Verify mocked data is displayed
  await expect(page.getByText('Mock Post 1')).toBeVisible()
  await expect(page.getByText('Mock Post 2')).toBeVisible()
})

test('handle API error gracefully', async ({ page }) => {
  // Mock API error
  await page.route('/api/posts', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' })
    })
  })
  
  await page.goto('/posts')
  
  // Verify error message
  await expect(page.getByText('Failed to load posts')).toBeVisible()
})
```

### Intercept and Modify Requests

```typescript
test('modify request before sending', async ({ page }) => {
  await page.route('/api/posts', async route => {
    // Get original request
    const request = route.request()
    
    // Modify and continue
    await route.continue({
      headers: {
        ...request.headers(),
        'X-Custom-Header': 'test-value'
      }
    })
  })
  
  await page.goto('/posts')
})
```

## Waiting & Assertions

### Smart Waiting

```typescript
test('wait for elements', async ({ page }) => {
  await page.goto('/')
  
  // Wait for element to be visible
  await page.waitForSelector('.spinner', { state: 'hidden' })
  
  // Wait for network idle
  await page.waitForLoadState('networkidle')
  
  // Wait for specific URL
  await page.waitForURL('/dashboard')
  
  // Wait for response
  await page.waitForResponse(response =>
    response.url().includes('/api/data') && response.status() === 200
  )
  
  // Wait for function
  await page.waitForFunction(() => window.dataLoaded === true)
})
```

### Auto-Waiting Assertions

```typescript
test('assertions with auto-waiting', async ({ page }) => {
  await page.goto('/')
  
  // These automatically wait up to default timeout
  await expect(page.getByText('Welcome')).toBeVisible()
  await expect(page.getByRole('button')).toBeEnabled()
  await expect(page.getByLabel('Email')).toHaveValue('user@example.com')
  await expect(page).toHaveURL(/dashboard/)
  await expect(page).toHaveTitle('Dashboard')
})
```

### Custom Timeouts

```typescript
test('custom timeout for slow operation', async ({ page }) => {
  await page.goto('/')
  
  // Wait up to 30 seconds
  await expect(page.getByText('Processing...')).toBeHidden({ timeout: 30000 })
  
  // Or set timeout for specific action
  await page.getByRole('button', { name: 'Submit' }).click({ timeout: 10000 })
})
```

## Visual Regression Testing

### Screenshot Comparison

```typescript
// tests/visual/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage visual regression', async ({ page }) => {
  await page.goto('/')
  
  // Take screenshot and compare
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100 // Allow small differences
  })
})

test('button states', async ({ page }) => {
  await page.goto('/components')
  
  const button = page.getByRole('button', { name: 'Click me' })
  
  // Normal state
  await expect(button).toHaveScreenshot('button-normal.png')
  
  // Hover state
  await button.hover()
  await expect(button).toHaveScreenshot('button-hover.png')
  
  // Focus state
  await button.focus()
  await expect(button).toHaveScreenshot('button-focus.png')
})
```

### Full Page Screenshots

```typescript
test('full page screenshot', async ({ page }) => {
  await page.goto('/')
  
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    animations: 'disabled' // Disable animations for consistent screenshots
  })
})
```

### Element Screenshots

```typescript
test('card component screenshot', async ({ page }) => {
  await page.goto('/components')
  
  const card = page.locator('.card').first()
  await expect(card).toHaveScreenshot('card.png')
})
```

### Update Snapshots

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test
npx playwright test homepage.spec.ts --update-snapshots
```

## Parallel Testing

### Test Sharding

```bash
# Split tests across 3 machines
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

### Test Isolation

```typescript
test.describe.configure({ mode: 'parallel' })

test.describe('Parallel tests', () => {
  test('test 1', async ({ page }) => {
    // Runs in parallel with test 2
  })
  
  test('test 2', async ({ page }) => {
    // Runs in parallel with test 1
  })
})

test.describe.configure({ mode: 'serial' })

test.describe('Serial tests', () => {
  test('test 1', async ({ page }) => {
    // Runs first
  })
  
  test('test 2', async ({ page }) => {
    // Runs after test 1
  })
})
```

### Shared Browser Context

```typescript
// tests/fixtures/shared-context.ts
import { test as base, chromium } from '@playwright/test'

export const test = base.extend({
  context: async ({}, use) => {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    await use(context)
    await browser.close()
  },
  
  page: async ({ context }, use) => {
    const page = await context.newPage()
    await use(page)
  }
})
```

## Database Testing

### Database Fixtures

```typescript
// tests/fixtures/db.ts
import { test as base } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

type DbFixtures = {
  db: PrismaClient
  cleanDb: void
}

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    const db = new PrismaClient()
    await use(db)
    await db.$disconnect()
  },
  
  cleanDb: [async ({ db }, use) => {
    // Clean before test
    await db.user.deleteMany()
    await db.post.deleteMany()
    
    await use()
    
    // Clean after test
    await db.user.deleteMany()
    await db.post.deleteMany()
  }, { auto: true }] // Run automatically
})
```

**Usage:**
```typescript
import { test, expect } from '../fixtures/db'

test('create post with user', async ({ page, db, cleanDb }) => {
  // Seed data
  const user = await db.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User'
    }
  })
  
  await page.goto('/posts/new')
  await page.getByLabel('Title').fill('Test Post')
  await page.getByRole('button', { name: 'Create' }).click()
  
  // Verify in database
  const post = await db.post.findFirst({
    where: { user_id: user.id }
  })
  
  expect(post).toBeDefined()
  expect(post?.title).toBe('Test Post')
})
```

## Advanced Patterns

### Page Object Model

```typescript
// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.submitButton = page.getByRole('button', { name: 'Sign In' })
    this.errorMessage = page.getByRole('alert')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }
}
```

**Usage:**
```typescript
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test('login with POM', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')
  
  await expect(page).toHaveURL('/dashboard')
})
```

### Custom Matchers

```typescript
// tests/matchers/custom.ts
import { expect } from '@playwright/test'

expect.extend({
  async toHaveLoadedWithin(page: Page, milliseconds: number) {
    const startTime = Date.now()
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    const pass = loadTime <= milliseconds
    
    return {
      pass,
      message: () =>
        pass
          ? `Page loaded in ${loadTime}ms (expected > ${milliseconds}ms)`
          : `Page took ${loadTime}ms to load (expected <= ${milliseconds}ms)`
    }
  }
})
```

**Usage:**
```typescript
test('page loads quickly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveLoadedWithin(2000)
})
```

### Retry Logic

```typescript
test('retry failed requests', async ({ page }) => {
  let attemptCount = 0
  
  await page.route('/api/flaky-endpoint', async route => {
    attemptCount++
    
    if (attemptCount < 3) {
      await route.fulfill({ status: 500 })
    } else {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      })
    }
  })
  
  await page.goto('/data')
  
  // Should succeed after retries
  await expect(page.getByText('Data loaded')).toBeVisible()
})
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
          retention-days: 30
```

### Docker

```dockerfile
# Dockerfile.playwright
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

```bash
# Run tests in Docker
docker build -f Dockerfile.playwright -t playwright-tests .
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report playwright-tests
```

## Debugging

### Debug Mode

```bash
# Run with headed browser
npx playwright test --headed

# Debug mode (pauses execution)
npx playwright test --debug

# Debug specific test
npx playwright test auth.spec.ts --debug
```

### Playwright Inspector

```typescript
test('debug with inspector', async ({ page }) => {
  await page.goto('/')
  
  // Pause execution
  await page.pause()
  
  // Continues after manual step-through
  await page.getByRole('button').click()
})
```

### Trace Viewer

```bash
# Run test with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Capture trace on first retry
  }
})
```

### Console Logs

```typescript
test('capture console logs', async ({ page }) => {
  const logs: string[] = []
  
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`)
  })
  
  await page.goto('/')
  
  console.log('Captured logs:', logs)
})
```

## Best Practices

### Do's ✅

- **Use built-in locators** (getByRole, getByLabel, getByText)
- **Write independent tests** (no test dependencies)
- **Use fixtures** for setup/teardown
- **Mock external APIs** for reliability
- **Take screenshots** on failure
- **Use Page Object Model** for complex pages
- **Run tests in parallel** for speed
- **Test responsive designs** with different viewports
- **Use storage state** for auth (faster)
- **Write descriptive test names**

### Don'ts ❌

- **Don't use CSS selectors** unnecessarily
- **Don't hardcode waits** (use auto-waiting)
- **Don't test implementation details**
- **Don't share state** between tests
- **Don't ignore flaky tests**
- **Don't test everything** (focus on critical paths)
- **Don't use random data** without cleanup
- **Don't skip error handling** in tests
- **Don't commit visual snapshots** without review
- **Don't run all tests locally** (use CI)

## Common Patterns

### File Upload

```typescript
test('upload file', async ({ page }) => {
  await page.goto('/upload')
  
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('path/to/file.pdf')
  
  await page.getByRole('button', { name: 'Upload' }).click()
  
  await expect(page.getByText('File uploaded successfully')).toBeVisible()
})
```

### Drag and Drop

```typescript
test('drag and drop', async ({ page }) => {
  await page.goto('/kanban')
  
  const source = page.locator('.task').first()
  const target = page.locator('.column').last()
  
  await source.dragTo(target)
  
  await expect(target.locator('.task')).toHaveCount(1)
})
```

### Keyboard Shortcuts

```typescript
test('keyboard navigation', async ({ page }) => {
  await page.goto('/editor')
  
  const editor = page.getByRole('textbox')
  
  // Type text
  await editor.type('Hello World')
  
  // Select all (Ctrl+A / Cmd+A)
  await editor.press('Control+A')
  
  // Copy (Ctrl+C / Cmd+C)
  await editor.press('Control+C')
  
  // Delete
  await editor.press('Delete')
  
  // Paste (Ctrl+V / Cmd+V)
  await editor.press('Control+V')
  
  await expect(editor).toHaveValue('Hello World')
})
```

### Mobile Testing

```typescript
test('mobile viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  
  await page.goto('/')
  
  // Test mobile menu
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.getByRole('navigation')).toBeVisible()
})

test.use({ ...devices['iPhone 12'] })

test('test on iPhone', async ({ page }) => {
  await page.goto('/')
  // Automatically uses iPhone 12 viewport and user agent
})
```

## Quick Reference

### Locator Strategies (Priority Order)
```typescript
// 1. Role-based (BEST)
page.getByRole('button', { name: 'Submit' })

// 2. Label (forms)
page.getByLabel('Email')

// 3. Placeholder
page.getByPlaceholder('Enter email')

// 4. Text
page.getByText('Welcome')

// 5. Test ID
page.getByTestId('submit-button')

// 6. CSS (LAST RESORT)
page.locator('.submit-btn')
```

### Common Assertions
```typescript
await expect(element).toBeVisible()
await expect(element).toBeHidden()
await expect(element).toBeEnabled()
await expect(element).toBeDisabled()
await expect(element).toHaveText('text')
await expect(element).toHaveValue('value')
await expect(element).toHaveCount(5)
await expect(page).toHaveURL('/path')
await expect(page).toHaveTitle('Title')
```

### Run Commands
```bash
npx playwright test                    # Run all tests
npx playwright test --headed           # With browser UI
npx playwright test --debug            # Debug mode
npx playwright test auth.spec.ts       # Specific file
npx playwright test --grep @smoke      # Tagged tests
npx playwright test --project=chromium # Specific browser
npx playwright show-report             # View HTML report
```

## Component Testing

### Setup Component Testing

```bash
# Install component testing for your framework
npm init playwright@latest -- --ct

# Or add to existing project
npm install -D @playwright/experimental-ct-react    # React
npm install -D @playwright/experimental-ct-vue      # Vue
npm install -D @playwright/experimental-ct-svelte   # Svelte
```

### Basic Component Test

```typescript
// Button.test.tsx
import { test, expect } from '@playwright/experimental-ct-react'
import { Button } from './Button'

test('renders button with text', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>)

  await expect(component).toContainText('Click me')
})

test('handles click events', async ({ mount }) => {
  let clicked = false

  const component = await mount(
    <Button onClick={() => { clicked = true }}>Submit</Button>
  )

  await component.click()

  expect(clicked).toBeTruthy()
})
```

### Component Testing with Props

```typescript
test('button variants', async ({ mount }) => {
  const component = await mount(
    <Button variant="primary" size="lg">
      Large Primary
    </Button>
  )

  await expect(component).toHaveClass(/btn-primary/)
  await expect(component).toHaveClass(/btn-lg/)
})
```

### Story Pattern for Complex Components

```typescript
// InputMedia.story.tsx - Wrapper for testing
import React from 'react'
import InputMedia from './InputMedia'

type InputMediaForTestProps = {
  onMediaChange(mediaName: string): void
}

export function InputMediaForTest(props: InputMediaForTestProps) {
  // Convert complex objects to simple serializable data for tests
  return <InputMedia onChange={media => props.onMediaChange(media.name)} />
}
```

```typescript
// InputMedia.test.tsx
import { test, expect } from '@playwright/experimental-ct-react'
import { InputMediaForTest } from './InputMedia.story'

test('uploads and processes media', async ({ mount }) => {
  let mediaSelected: string | null = null

  const component = await mount(
    <InputMediaForTest
      onMediaChange={mediaName => { mediaSelected = mediaName }}
    />
  )

  await component
    .getByTestId('imageInput')
    .setInputFiles('src/assets/logo.png')

  await expect(component.getByAltText(/selected image/i)).toBeVisible()
  await expect.poll(() => mediaSelected).toBe('logo.png')
})
```

## Locator Handlers

### Auto-Handle Overlays and Popups

```typescript
test('handle cookie consent overlay', async ({ page }) => {
  // Register handler for overlay that might appear
  const overlay = page.getByRole('dialog', { name: 'Cookie Consent' })

  await page.addLocatorHandler(overlay, async () => {
    await page.getByRole('button', { name: 'Accept' }).click()
  })

  // Test continues - overlay handled automatically if it appears
  await page.goto('/')
  await page.getByRole('button', { name: 'Submit' }).click()
})

// With options
await page.addLocatorHandler(
  page.getByText('This interstitial covers the button'),
  async overlay => {
    await overlay.locator('#close').click()
  },
  { times: 3, noWaitAfter: true }
)

// Remove handler when no longer needed
await page.removeLocatorHandler(overlay)
```

### Framework-Specific Locators (Experimental)

```typescript
// React component locators
await page.locator('_react=BookItem').click()
await page.locator('_react=BookItem[author = "Steven King"]').click()
await page.locator('_react=[author *= "King" i]').click() // Case insensitive
await page.locator('_react=MyButton[enabled]').click() // Truthy
await page.locator('_react=[some.nested.value = 12]').click() // Nested

// Vue component locators
await page.locator('_vue=book-item').click()
await page.locator('_vue=book-item[author = "Steven King"]').click()
```

## Additional Assertions

```typescript
// Extended assertions
await expect(element).toBeAttached()
await expect(element).toBeChecked()
await expect(element).toBeEditable()
await expect(element).toBeFocused()
await expect(element).toBeInViewport()
await expect(element).toHaveAttribute('data-id', '123')
await expect(element).toHaveClass(/active/)
await expect(element).toHaveCSS('color', 'rgb(0, 0, 0)')
await expect(element).toHaveId('submit-btn')
await expect(element).toHaveScreenshot('button.png')
await expect(element).toHaveValues(['option1', 'option2']) // Select
```

### Custom Test ID Attribute

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw' // Use data-pw instead of data-testid
  }
})

// Usage
await page.getByTestId('submit-button').click()
// Matches: <button data-pw="submit-button">Submit</button>
```

### Locator Description for Debugging

```typescript
// Add custom description for debugging
const button = page.getByRole('button').describe('Subscribe button')
console.log(button.description()) // "Subscribe button"

// Helpful in test reports and debugging
```