---
name: testing-strategies
description: Build confidence in your code with the right level of testing for each situation. Use when deciding between unit, integration, or e2e tests, mocking external dependencies, or setting up a test suite from scratch.
---

# Testing Strategies

Build confidence in your code with effective testing strategies, proper test design, and appropriate coverage.

## When to Use This Skill

Use when:
- Setting up testing infrastructure for a project
- Deciding what level of testing to use
- Writing tests for complex logic or integrations
- Mocking external dependencies
- Improving test reliability and speed

## The Testing Trophy

```
         ╱╲
        ╱  ╲         E2E Tests
       ╱────╲        (Few, Slow, High Confidence)
      ╱      ╲
     ╱────────╲      Integration Tests
    ╱          ╲     (More, Medium Speed)
   ╱────────────╲
  ╱              ╲   Unit Tests
 ╱────────────────╲  (Many, Fast, Low-Level)
╱                  ╲
━━━━━━━━━━━━━━━━━━━━ Static Analysis (TypeScript, ESLint)
```

### What to Test at Each Level

| Level | What to Test | Tools |
|-------|--------------|-------|
| **Static** | Type errors, lint rules | TypeScript, ESLint |
| **Unit** | Pure functions, utilities, hooks | Vitest, Jest |
| **Integration** | Components with state, API handlers | Testing Library, MSW |
| **E2E** | Critical user flows | Playwright, Cypress |

## Unit Testing

### Testing Pure Functions
```typescript
// utils/format.ts
export function formatCurrency(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

// utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats cents to dollars', () => {
    expect(formatCurrency(1000)).toBe('$10.00');
    expect(formatCurrency(1050)).toBe('$10.50');
    expect(formatCurrency(99)).toBe('$0.99');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negative values', () => {
    expect(formatCurrency(-1000)).toBe('-$10.00');
  });

  it('supports different currencies', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€10.00');
    expect(formatCurrency(1000, 'GBP')).toBe('£10.00');
  });
});
```

### Testing with Edge Cases
```typescript
// Use table-driven tests for edge cases
describe('validateEmail', () => {
  it.each([
    ['valid@email.com', true],
    ['user.name@domain.co.uk', true],
    ['user+tag@example.com', true],
    ['invalid', false],
    ['@nodomain.com', false],
    ['spaces in@email.com', false],
    ['', false],
  ])('validates "%s" as %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});
```

### Testing Async Functions
```typescript
// api/users.ts
export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

// api/users.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUser } from './users';

describe('fetchUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns user data on success', async () => {
    const mockUser = { id: '1', name: 'John' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const user = await fetchUser('1');

    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user).toEqual(mockUser);
  });

  it('throws on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(fetchUser('1')).rejects.toThrow('User not found');
  });
});
```

### Testing Custom Hooks
```typescript
// hooks/useCounter.ts
import { useState, useCallback } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, decrement, reset };
}

// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('decrements', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });
});
```

## Integration Testing

### Testing React Components
```typescript
// components/LoginForm.tsx
export function LoginForm({ onSubmit }: { onSubmit: (data: LoginData) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields required');
      return;
    }
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div role="alert">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-label="Email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button type="submit">Log in</button>
    </form>
  );
}

// components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('calls onSubmit with email and password', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows error when fields are empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(screen.getByRole('alert')).toHaveTextContent('All fields required');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

### Testing with React Query
```typescript
// components/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from './UserProfile';

// Create wrapper for tests
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithClient(ui: React.ReactElement) {
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe('UserProfile', () => {
  it('displays user data', async () => {
    // Mock the fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: 'John Doe', email: 'john@example.com' }),
    });

    renderWithClient(<UserProfile userId="1" />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    renderWithClient(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing API Routes (Next.js)
```typescript
// app/api/users/route.test.ts
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('returns users list', async () => {
      const request = new NextRequest('http://localhost/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const request = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('John');
    });

    it('returns 400 for invalid data', async () => {
      const request = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
```

## Mocking Strategies

### Mock Service Worker (MSW)
```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ]);
  }),

  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ id, name: 'John' });
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),

  // Error scenarios
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// vitest.setup.ts
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Mocking Modules
```typescript
// Mock entire module
vi.mock('./analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

// Mock specific exports
vi.mock('./config', async () => {
  const actual = await vi.importActual('./config');
  return {
    ...actual,
    API_URL: 'http://test-api.com',
  };
});

// Mock with factory
vi.mock('./database', () => ({
  db: {
    users: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// In test
import { db } from './database';

beforeEach(() => {
  vi.mocked(db.users.findUnique).mockResolvedValue({ id: '1', name: 'John' });
});
```

### Mocking Time
```typescript
describe('Timer component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates every second', () => {
    render(<Timer />);

    expect(screen.getByText('0:00')).toBeInTheDocument();

    vi.advanceTimersByTime(1000);
    expect(screen.getByText('0:01')).toBeInTheDocument();

    vi.advanceTimersByTime(59000);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });
});
```

### Mocking Environment Variables
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      DATABASE_URL: 'postgresql://test',
      API_KEY: 'test-key',
    },
  },
});

// Or in test
describe('with env vars', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, API_KEY: 'test-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });
});
```

## E2E Testing with Playwright

### Basic Test Structure
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can log in', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  });
});
```

### Page Object Model
```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('user can log in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### Test Fixtures
```typescript
// e2e/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL('/dashboard');

    await use(page);
  },
});

// Usage
import { test } from './fixtures';

test('authenticated user can access settings', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/settings');
  // User is already logged in
});
```

## Test Design Principles

### Arrange-Act-Assert (AAA)
```typescript
it('adds item to cart', async () => {
  // Arrange - set up test data and conditions
  const product = { id: '1', name: 'Widget', price: 1000 };
  render(<AddToCartButton product={product} />);

  // Act - perform the action being tested
  await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

  // Assert - verify the expected outcome
  expect(screen.getByText('Added to cart')).toBeInTheDocument();
});
```

### Test One Thing Per Test
```typescript
// ❌ Bad - testing multiple things
it('handles login', async () => {
  // Tests empty validation
  await user.click(submitButton);
  expect(screen.getByText('Required')).toBeInTheDocument();

  // Tests invalid email
  await user.type(emailInput, 'invalid');
  expect(screen.getByText('Invalid email')).toBeInTheDocument();

  // Tests successful login
  await user.type(emailInput, 'valid@email.com');
  await user.type(passwordInput, 'password');
  await user.click(submitButton);
  expect(onSubmit).toHaveBeenCalled();
});

// ✅ Good - separate tests
it('shows error when fields are empty', async () => { /* ... */ });
it('shows error for invalid email', async () => { /* ... */ });
it('calls onSubmit with valid data', async () => { /* ... */ });
```

### Test Behavior, Not Implementation
```typescript
// ❌ Bad - testing implementation details
it('sets isLoading state to true', () => {
  const { result } = renderHook(() => useData());
  act(() => result.current.fetch());
  expect(result.current.isLoading).toBe(true);
});

// ✅ Good - testing behavior
it('shows loading indicator while fetching', async () => {
  render(<DataDisplay />);
  await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

### Use Realistic Data
```typescript
// ❌ Bad - meaningless test data
const user = { id: '1', name: 'test', email: 'test@test.com' };

// ✅ Good - realistic data
const user = {
  id: 'usr_2x8f9k3j',
  name: 'Jane Smith',
  email: 'jane.smith@company.com',
  createdAt: '2024-01-15T09:30:00Z',
};

// Use factories for consistent test data
function createUser(overrides?: Partial<User>): User {
  return {
    id: `usr_${Math.random().toString(36).slice(2, 11)}`,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
```

## Test Configuration

### Vitest Config
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules', 'test', '**/*.d.ts', '**/*.config.*'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Playwright Config
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## What to Test Checklist

```markdown
## Unit Tests
- [ ] Pure utility functions
- [ ] Data transformations
- [ ] Validation functions
- [ ] Custom hooks
- [ ] Reducers and state logic

## Integration Tests
- [ ] Form submissions
- [ ] User interactions (click, type, etc.)
- [ ] Component with data fetching
- [ ] Error states
- [ ] Loading states
- [ ] Empty states

## E2E Tests
- [ ] Authentication flow
- [ ] Main user journeys
- [ ] Payment/checkout flows
- [ ] Critical business logic
- [ ] Cross-browser compatibility

## Don't Test
- [ ] Third-party libraries
- [ ] Framework internals
- [ ] Implementation details
- [ ] Simple pass-through components
```
