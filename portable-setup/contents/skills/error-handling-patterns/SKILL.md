---
name: error-handling-patterns
description: Build resilient error handling with custom error types, React error boundaries, and recovery strategies. Use when designing error strategy for a new project, adding retry logic, or improving error messages for debugging.
---

# Error Handling Patterns

Build resilient applications with proper error handling, informative error messages, and graceful recovery.

## When to Use This Skill

Use when:
- Designing error handling strategy for a new project
- Creating custom error types for different failure modes
- Implementing error boundaries in React applications
- Building API error responses
- Adding retry logic and recovery mechanisms
- Improving error messages for debugging

## Custom Error Types

### Base Error Class
```typescript
// Base application error
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }
}
```

### Specific Error Types
```typescript
// Validation errors
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

// Authorization errors
export class AuthorizationError extends AppError {
  constructor(message = 'Permission denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

// Not found errors
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with ID ${id} not found` : `${resource} not found`,
      'NOT_FOUND',
      404
    );
  }
}

// Conflict errors
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

// Rate limit errors
export class RateLimitError extends AppError {
  constructor(
    public retryAfter: number,
    message = 'Too many requests'
  ) {
    super(message, 'RATE_LIMIT', 429);
  }
}

// External service errors
export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    public originalError?: Error
  ) {
    super(`External service error: ${service}`, 'EXTERNAL_SERVICE_ERROR', 502);
  }
}
```

### Error Factory
```typescript
// Centralized error creation
export const Errors = {
  validation: (message: string, field?: string) =>
    new ValidationError(message, field),

  notFound: (resource: string, id?: string) =>
    new NotFoundError(resource, id),

  unauthorized: (message?: string) =>
    new AuthenticationError(message),

  forbidden: (message?: string) =>
    new AuthorizationError(message),

  conflict: (message: string) =>
    new ConflictError(message),

  rateLimit: (retryAfter: number) =>
    new RateLimitError(retryAfter),

  external: (service: string, error?: Error) =>
    new ExternalServiceError(service, error),
};

// Usage
throw Errors.notFound('User', userId);
throw Errors.validation('Email is invalid', 'email');
```

## Result Type Pattern

### Result Type Definition
```typescript
// Success/Failure discriminated union
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helper functions
export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// Usage
async function getUser(id: string): Promise<Result<User, AppError>> {
  try {
    const user = await db.users.findUnique({ where: { id } });
    if (!user) {
      return Err(Errors.notFound('User', id));
    }
    return Ok(user);
  } catch (e) {
    return Err(new AppError('Database error', 'DB_ERROR', 500));
  }
}

// Consuming Result
const result = await getUser('123');
if (result.ok) {
  console.log(result.value.name);
} else {
  console.error(result.error.message);
}
```

### Result Utilities
```typescript
// Map over success value
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.ok ? Ok(fn(result.value)) : result;
}

// Chain Results
function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

// Unwrap with default
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue;
}

// Collect multiple Results
function collectResults<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (!result.ok) return result;
    values.push(result.value);
  }
  return Ok(values);
}
```

## React Error Boundaries

### Basic Error Boundary
```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800 font-semibold">Something went wrong</h2>
      <p className="text-red-600 mt-2">{error?.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Reload page
      </button>
    </div>
  );
}
```

### Resettable Error Boundary
```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackRender: (props: { error: Error; reset: () => void }) => ReactNode;
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ResettableErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: Props) {
    // Reset when resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      const hasKeysChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );
      if (hasKeysChanged) {
        this.reset();
      }
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallbackRender({
        error: this.state.error,
        reset: this.reset,
      });
    }
    return this.props.children;
  }
}

// Usage
<ResettableErrorBoundary
  resetKeys={[userId]}
  onReset={() => queryClient.invalidateQueries(['user', userId])}
  fallbackRender={({ error, reset }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <UserProfile userId={userId} />
</ResettableErrorBoundary>
```

### Suspense + Error Boundary Pattern
```typescript
import { Suspense } from 'react';

function AsyncBoundary({
  children,
  loadingFallback,
  errorFallback,
}: {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback: (error: Error, reset: () => void) => ReactNode;
}) {
  return (
    <ResettableErrorBoundary fallbackRender={({ error, reset }) => errorFallback(error, reset)}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ResettableErrorBoundary>
  );
}

// Usage
<AsyncBoundary
  loadingFallback={<Skeleton />}
  errorFallback={(error, reset) => (
    <ErrorCard error={error} onRetry={reset} />
  )}
>
  <UserData />
</AsyncBoundary>
```

## API Error Handling

### Express Error Handler
```typescript
import { Request, Response, NextFunction } from 'express';

// Async handler wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.context && { details: err.context }),
      },
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: (err as any).errors,
      },
    });
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
}
```

### Next.js API Error Handling
```typescript
// lib/api-handler.ts
import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest, context?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof AppError) {
        return NextResponse.json(
          { error: { code: error.code, message: error.message } },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
        { status: 500 }
      );
    }
  };
}

// Usage in route handler
export const GET = withErrorHandler(async (req) => {
  const user = await getUser(req.params.id);
  if (!user) {
    throw Errors.notFound('User', req.params.id);
  }
  return NextResponse.json(user);
});
```

## Client-Side Error Handling

### Fetch Wrapper with Error Handling
```typescript
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<Result<T, AppError>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));

        switch (response.status) {
          case 400:
            return Err(new ValidationError(errorBody.error?.message || 'Bad request'));
          case 401:
            return Err(new AuthenticationError(errorBody.error?.message));
          case 403:
            return Err(new AuthorizationError(errorBody.error?.message));
          case 404:
            return Err(new NotFoundError('Resource'));
          case 429:
            return Err(new RateLimitError(
              parseInt(response.headers.get('Retry-After') || '60')
            ));
          default:
            return Err(new AppError(
              errorBody.error?.message || 'Request failed',
              errorBody.error?.code || 'REQUEST_FAILED',
              response.status
            ));
        }
      }

      const data = await response.json();
      return Ok(data as T);
    } catch (error) {
      // Network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return Err(new AppError('Network error', 'NETWORK_ERROR', 0, true));
      }
      return Err(new AppError('Unknown error', 'UNKNOWN_ERROR', 500));
    }
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}
```

### React Query Error Handling
```typescript
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show toast for queries that have data (background refetch failed)
      if (query.state.data !== undefined) {
        toast.error(`Background update failed: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof AuthenticationError) {
        // Redirect to login
        window.location.href = '/login';
        return;
      }
      toast.error(error.message);
    },
  }),
});
```

## Retry Patterns

### Exponential Backoff
```typescript
interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, shouldRetry = () => true } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(lastError, attempt)) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError!;
}

// Usage
const data = await withRetry(
  () => fetchData(),
  {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (error) => {
      // Don't retry client errors
      if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      return true;
    },
  }
);
```

### Circuit Breaker
```typescript
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failures = 0;
  private successes = 0;
  private lastFailureTime?: number;

  constructor(
    private options: {
      failureThreshold: number;
      successThreshold: number;
      timeout: number;
    }
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime! > this.options.timeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successes = 0;
      } else {
        throw new AppError('Circuit breaker is open', 'CIRCUIT_OPEN', 503);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.options.successThreshold) {
        this.state = CircuitState.CLOSED;
      }
    }
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}
```

## Error Logging and Monitoring

### Structured Error Logging
```typescript
interface ErrorLogContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  [key: string]: unknown;
}

class ErrorLogger {
  log(error: Error, context: ErrorLogContext = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: this.getLevel(error),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof AppError && {
          code: error.code,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
        }),
      },
      context,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(JSON.stringify(logEntry, null, 2));
    } else {
      // Send to logging service (e.g., CloudWatch, Datadog)
      console.error(JSON.stringify(logEntry));
    }

    // Report to error tracking service
    if (!this.isOperational(error)) {
      this.reportToSentry(error, context);
    }
  }

  private getLevel(error: Error): string {
    if (error instanceof AppError) {
      return error.statusCode >= 500 ? 'error' : 'warn';
    }
    return 'error';
  }

  private isOperational(error: Error): boolean {
    return error instanceof AppError && error.isOperational;
  }

  private reportToSentry(error: Error, context: ErrorLogContext) {
    // Sentry.captureException(error, { extra: context });
  }
}

export const errorLogger = new ErrorLogger();
```

## User-Friendly Error Messages

```typescript
// Map error codes to user-friendly messages
const userMessages: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'Please log in to continue.',
  AUTHORIZATION_ERROR: 'You don\'t have permission to do that.',
  NOT_FOUND: 'The requested item could not be found.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
};

export function getUserMessage(error: Error): string {
  if (error instanceof AppError) {
    return userMessages[error.code] || error.message;
  }
  return userMessages.INTERNAL_ERROR;
}

// React hook for error display
export function useErrorMessage(error: Error | null) {
  if (!error) return null;

  return {
    title: error instanceof AppError ? error.name : 'Error',
    message: getUserMessage(error),
    canRetry: !(error instanceof ValidationError),
    needsLogin: error instanceof AuthenticationError,
  };
}
```
