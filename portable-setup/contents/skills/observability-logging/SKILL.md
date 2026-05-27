---
name: observability-logging
description: Structured logging, error monitoring with Sentry, metrics, and alerting patterns. Use when setting up logging infrastructure, integrating Sentry error monitoring, or debugging production issues with metrics and traces.
---

# Observability and Logging

Build observable systems that tell you what's happening in production.

## When to Use This Skill

Use when:
- Setting up logging infrastructure
- Integrating error monitoring (Sentry)
- Adding metrics and alerting
- Debugging production issues
- Building dashboards

## The Three Pillars

| Pillar | Purpose | Tools |
|--------|---------|-------|
| **Logs** | What happened | Pino, Winston, CloudWatch |
| **Metrics** | How much/how fast | Prometheus, Datadog, CloudWatch |
| **Traces** | Request flow | OpenTelemetry, Jaeger |

## Structured Logging

### Basic Setup with Pino
```bash
npm install pino pino-pretty
```

```typescript
// lib/logger.ts
import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss',
      },
    },
  }),
});

// Create child loggers with context
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
```

### Log Levels
```typescript
// Error - Something broke
logger.error({ err: error, userId }, 'Failed to process payment');

// Warn - Something might be wrong
logger.warn({ attempts: 3 }, 'Rate limit approaching');

// Info - Something important happened
logger.info({ orderId, amount }, 'Order placed successfully');

// Debug - Detailed debugging info (not in production)
logger.debug({ query, params }, 'Database query executed');

// Trace - Very detailed tracing
logger.trace({ headers }, 'Incoming request');
```

### What to Log

```typescript
// ✅ Good logging
logger.info({
  event: 'user.signup',
  userId: user.id,
  email: maskEmail(user.email),
  source: 'google-oauth',
  duration: Date.now() - startTime,
});

logger.error({
  event: 'payment.failed',
  userId,
  orderId,
  amount,
  provider: 'stripe',
  errorCode: error.code,
  err: error,
});

// ❌ Bad logging
console.log('User signed up');           // No structure, no context
logger.info(user);                        // PII exposure risk
logger.info('Payment failed: ' + error);  // String concatenation, loses error stack
```

### Request Logging Middleware
```typescript
// middleware/request-logger.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { randomUUID } from 'crypto';

export function withRequestLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const requestId = randomUUID();
    const startTime = Date.now();

    const log = logger.child({
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers.get('user-agent'),
    });

    log.info('Request started');

    try {
      const response = await handler(req);

      log.info({
        status: response.status,
        duration: Date.now() - startTime,
      }, 'Request completed');

      // Add request ID to response headers
      response.headers.set('x-request-id', requestId);
      return response;

    } catch (error) {
      log.error({
        err: error,
        duration: Date.now() - startTime,
      }, 'Request failed');

      throw error;
    }
  };
}
```

### Correlation IDs
```typescript
// Trace requests across services
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  requestId: string;
  userId?: string;
  traceId?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

// Middleware to set context
export function withContext(handler: Function) {
  return async (req: NextRequest) => {
    const context: RequestContext = {
      requestId: req.headers.get('x-request-id') || randomUUID(),
      traceId: req.headers.get('x-trace-id') || randomUUID(),
    };

    return requestContext.run(context, () => handler(req));
  };
}

// Logger automatically includes context
export function getLogger() {
  const context = requestContext.getStore();
  return logger.child(context || {});
}
```

## Error Monitoring with Sentry

### Setup
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  profilesSampleRate: 0.1,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network request failed',
    /^Loading chunk \d+ failed/,
  ],

  beforeSend(event, hint) {
    // Don't send errors from bots
    const userAgent = event.request?.headers?.['user-agent'] || '';
    if (/bot|crawler|spider/i.test(userAgent)) {
      return null;
    }
    return event;
  },
});
```

### Capturing Errors
```typescript
import * as Sentry from '@sentry/nextjs';

// Automatic error capture (thrown errors)
throw new Error('Something went wrong'); // Automatically captured

// Manual capture with context
try {
  await processPayment(order);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'payments',
      provider: 'stripe',
    },
    extra: {
      orderId: order.id,
      amount: order.amount,
    },
    user: {
      id: user.id,
      email: user.email,
    },
  });

  throw error; // Re-throw after capturing
}

// Capture message (non-errors)
Sentry.captureMessage('User reached usage limit', {
  level: 'warning',
  tags: { feature: 'billing' },
  extra: { userId, currentUsage, limit },
});
```

### User Context
```typescript
// Set user context on login
import * as Sentry from '@sentry/nextjs';

function onLogin(user: User) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

function onLogout() {
  Sentry.setUser(null);
}
```

### Breadcrumbs
```typescript
// Add breadcrumbs for debugging context
Sentry.addBreadcrumb({
  category: 'user',
  message: 'User clicked checkout button',
  level: 'info',
  data: {
    cartItems: cart.items.length,
    total: cart.total,
  },
});

// Automatic breadcrumbs:
// - Console logs
// - Network requests
// - DOM events
// - Navigation
```

### Performance Monitoring
```typescript
// Manual transaction
const transaction = Sentry.startTransaction({
  name: 'processOrder',
  op: 'task',
});

try {
  const span1 = transaction.startChild({
    op: 'db.query',
    description: 'Fetch inventory',
  });
  await fetchInventory();
  span1.finish();

  const span2 = transaction.startChild({
    op: 'http',
    description: 'Charge payment',
  });
  await chargePayment();
  span2.finish();

  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('error');
  throw error;
} finally {
  transaction.finish();
}
```

## Metrics

### Custom Metrics with Prometheus
```typescript
// lib/metrics.ts
import { Counter, Histogram, Registry } from 'prom-client';

export const registry = new Registry();

// Request counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [registry],
});

// Request duration
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [registry],
});

// Business metrics
export const ordersTotal = new Counter({
  name: 'orders_total',
  help: 'Total orders placed',
  labelNames: ['status', 'payment_method'],
  registers: [registry],
});

export const orderValue = new Histogram({
  name: 'order_value_dollars',
  help: 'Order value in dollars',
  buckets: [10, 50, 100, 500, 1000],
  registers: [registry],
});
```

### Metrics Endpoint
```typescript
// app/api/metrics/route.ts
import { registry } from '@/lib/metrics';

export async function GET() {
  const metrics = await registry.metrics();
  return new Response(metrics, {
    headers: { 'Content-Type': registry.contentType },
  });
}
```

### Key Metrics to Track

```typescript
// System metrics
- request_duration_seconds      // How fast?
- request_total                 // How many?
- error_total                   // How often failing?
- active_connections            // Current load?

// Business metrics
- orders_total                  // Revenue indicator
- signups_total                 // Growth indicator
- feature_usage_total           // Engagement
- api_calls_remaining           // Usage limits

// Infrastructure metrics
- db_query_duration_seconds
- cache_hit_ratio
- queue_depth
- memory_usage_bytes
```

## Alerting

### Alert Rules (Prometheus/Grafana)
```yaml
# alerting-rules.yml
groups:
  - name: app-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m]))
          > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: Error rate is {{ $value | humanizePercentage }}

      - alert: SlowResponses
        expr: |
          histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
          > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: Slow response times
          description: P95 latency is {{ $value }}s

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 1e9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High memory usage
```

### Alert Best Practices
```markdown
✅ DO:
- Alert on symptoms (errors, latency) not causes
- Include runbook links in alert descriptions
- Set appropriate thresholds (avoid alert fatigue)
- Page only for actionable issues
- Use severity levels (critical, warning, info)

❌ DON'T:
- Alert on every error
- Alert on things you can't fix
- Have alerts that fire constantly
- Alert without context
```

## Logging Best Practices

### What to Log
```typescript
// ✅ Log these
- Request/response metadata (not bodies)
- Authentication events
- Authorization failures
- Business transactions
- External service calls
- Error details with stack traces
- Performance metrics

// ❌ Don't log these
- Passwords or tokens
- Full credit card numbers
- Personal data (or mask it)
- Health check requests
- Successful auth tokens
- Request/response bodies (usually)
```

### PII Masking
```typescript
// lib/masking.ts
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
}

export function maskCard(cardNumber: string): string {
  return `****${cardNumber.slice(-4)}`;
}

export function maskIP(ip: string): string {
  return ip.replace(/\.\d+$/, '.xxx');
}

// Usage
logger.info({
  email: maskEmail(user.email),
  card: maskCard(payment.cardNumber),
  ip: maskIP(request.ip),
});
```

### Log Retention
```markdown
| Log Type | Retention | Reason |
|----------|-----------|--------|
| Error logs | 90 days | Debugging, compliance |
| Access logs | 30 days | Security, auditing |
| Debug logs | 7 days | Development only |
| Audit logs | 7 years | Compliance |
```

## Production Debugging

### Finding Issues
```typescript
// 1. Check error monitoring (Sentry)
// - Recent errors
// - Error trends
// - Affected users

// 2. Check logs
// - Filter by request ID
// - Filter by user ID
// - Filter by error type

// 3. Check metrics
// - Error rate spike?
// - Latency increase?
// - Traffic change?

// 4. Check traces
// - Where is time spent?
// - Which service is slow?
```

### Debug Query Example
```sql
-- Find all errors for a user in the last hour
SELECT timestamp, level, message, context
FROM logs
WHERE
  level = 'error'
  AND context->>'userId' = 'user_123'
  AND timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;

-- Find slow requests
SELECT
  path,
  AVG(duration) as avg_duration,
  COUNT(*) as count
FROM logs
WHERE
  timestamp > NOW() - INTERVAL '1 hour'
GROUP BY path
HAVING AVG(duration) > 1000
ORDER BY avg_duration DESC;
```

## Observability Checklist

```markdown
## Logging
- [ ] Structured logging configured
- [ ] Log levels used appropriately
- [ ] Request IDs for correlation
- [ ] PII is masked
- [ ] Logs ship to central location

## Error Monitoring
- [ ] Sentry (or equivalent) configured
- [ ] Source maps uploaded
- [ ] User context set
- [ ] Error grouping is sensible
- [ ] Alerts configured for new errors

## Metrics
- [ ] Request metrics (count, duration, errors)
- [ ] Business metrics defined
- [ ] Dashboards created
- [ ] Baselines established

## Alerting
- [ ] Critical path alerts defined
- [ ] On-call rotation set
- [ ] Runbooks documented
- [ ] Alert thresholds tuned
```
