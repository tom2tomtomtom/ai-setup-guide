---
name: security-hardening
description: Web application security patterns including OWASP top 10, input validation, authentication, CSRF/XSS prevention. Use when handling user input that needs validation, implementing auth or CSRF protection, or reviewing code for security vulnerabilities.
---

# Security Hardening

Protect your applications from common vulnerabilities and security threats.

## When to Use This Skill

Use when:
- Building authentication/authorization
- Handling user input
- Working with sensitive data
- Implementing API security
- Reviewing code for vulnerabilities

## OWASP Top 10 Overview

| Risk | Description | Prevention |
|------|-------------|------------|
| Injection | Untrusted data sent to interpreter | Parameterized queries, input validation |
| Broken Auth | Session/credential flaws | Secure session management, MFA |
| Sensitive Data | Exposed sensitive information | Encryption, proper storage |
| XXE | XML external entity attacks | Disable DTDs, use JSON |
| Broken Access | Missing authorization checks | Deny by default, check on server |
| Misconfig | Insecure default settings | Hardened configs, security headers |
| XSS | Injected client-side scripts | Output encoding, CSP |
| Insecure Deserialization | Tampered serialized objects | Integrity checks, typed parsing |
| Vulnerable Components | Outdated dependencies | Regular updates, auditing |
| Logging Failures | Missing security logs | Comprehensive logging, monitoring |

## Input Validation

### Validate All Input
```typescript
import { z } from 'zod';

// Server-side validation with Zod
const userInputSchema = z.object({
  email: z.string()
    .email('Invalid email')
    .max(254, 'Email too long')
    .transform(s => s.toLowerCase().trim()),

  name: z.string()
    .min(1, 'Name required')
    .max(100, 'Name too long')
    .regex(/^[\p{L}\p{N}\s\-'.]+$/u, 'Invalid characters in name'),

  age: z.number()
    .int('Must be whole number')
    .min(13, 'Must be 13 or older')
    .max(120, 'Invalid age'),

  website: z.string()
    .url('Invalid URL')
    .refine(url => {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    }, 'Only HTTP(S) URLs allowed')
    .optional(),
});

// Usage in API route
export async function POST(req: Request) {
  const body = await req.json();
  const result = userInputSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    );
  }

  // result.data is validated and typed
  await createUser(result.data);
}
```

### Sanitize Output
```typescript
// HTML encoding for display
import DOMPurify from 'dompurify';

// If you MUST render HTML (avoid if possible)
function SafeHTML({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Better: Use structured data instead of HTML
function RichText({ content }: { content: RichTextNode[] }) {
  return (
    <>
      {content.map((node, i) => {
        switch (node.type) {
          case 'paragraph': return <p key={i}>{node.text}</p>;
          case 'bold': return <strong key={i}>{node.text}</strong>;
          case 'link': return <a key={i} href={node.href}>{node.text}</a>;
          default: return <span key={i}>{node.text}</span>;
        }
      })}
    </>
  );
}
```

## SQL Injection Prevention

### Always Use Parameterized Queries
```typescript
// ❌ NEVER do this - SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Parameterized query with Prisma
const user = await prisma.user.findUnique({
  where: { email },
});

// ✅ Parameterized query with raw SQL
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;

// ✅ With pg (node-postgres)
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ✅ With Supabase
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email);
```

### Validate IDs and Parameters
```typescript
// Validate UUID format
const uuidSchema = z.string().uuid();

// Validate numeric ID
const idSchema = z.coerce.number().int().positive();

// Usage
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const result = uuidSchema.safeParse(params.id);
  if (!result.success) {
    return Response.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: result.data },
  });
}
```

## XSS Prevention

### React's Built-in Protection
```typescript
// ✅ Safe - React escapes by default
function UserProfile({ user }) {
  return <h1>{user.name}</h1>; // Escaped automatically
}

// ❌ Dangerous - bypasses React's escaping
function UnsafeHTML({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// ✅ If you must use dangerouslySetInnerHTML, sanitize first
import DOMPurify from 'dompurify';

function SafeHTML({ content }) {
  const clean = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

### Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Tighten in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### URL Validation
```typescript
// Prevent javascript: URLs
function SafeLink({ href, children }) {
  const isSafe = useMemo(() => {
    try {
      const url = new URL(href, window.location.origin);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol);
    } catch {
      return false;
    }
  }, [href]);

  if (!isSafe) {
    console.warn('Blocked unsafe URL:', href);
    return <span>{children}</span>;
  }

  return <a href={href}>{children}</a>;
}
```

## CSRF Protection

### Token-Based Protection
```typescript
// Generate CSRF token
import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

// Middleware to validate CSRF token
export async function validateCSRF(req: Request) {
  const token = req.headers.get('X-CSRF-Token');
  const cookieToken = getCookie(req, 'csrf_token');

  if (!token || !cookieToken || token !== cookieToken) {
    throw new Error('CSRF validation failed');
  }
}

// React hook
function useCSRFToken() {
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from cookie or fetch from server
    const token = getCookie('csrf_token');
    setToken(token);
  }, []);

  return token;
}

// Usage in fetch
function useSecureFetch() {
  const csrfToken = useCSRFToken();

  return useCallback(
    (url: string, options: RequestInit = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'same-origin',
      });
    },
    [csrfToken]
  );
}
```

### SameSite Cookies
```typescript
// Set secure cookie options
import { cookies } from 'next/headers';

export function setSecureCookie(name: string, value: string) {
  cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // or 'strict' for more security
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
```

## Authentication Security

### Secure Password Handling
```typescript
import bcrypt from 'bcryptjs';

// Hash password before storing
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Adjust based on your security needs
  return bcrypt.hash(password, saltRounds);
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password validation schema
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain special character');
```

### Secure Session Management
```typescript
// Session configuration
const sessionConfig = {
  // Use secure, random session IDs
  generateId: () => randomBytes(32).toString('hex'),

  // Rotate session ID after login
  regenerateOnLogin: true,

  // Short lived sessions
  maxAge: 60 * 60 * 24, // 24 hours

  // Require re-auth for sensitive actions
  sensitiveActionTimeout: 60 * 15, // 15 minutes
};

// Regenerate session on privilege change
async function handleLogin(credentials: Credentials) {
  const user = await validateCredentials(credentials);
  if (!user) throw new Error('Invalid credentials');

  // Destroy old session and create new one
  await destroySession();
  const newSessionId = await createSession(user.id);

  return { user, sessionId: newSessionId };
}
```

### Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

export async function rateLimitMiddleware(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too many requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }
}

// Stricter limits for auth endpoints
const authRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
});
```

## Authorization

### Check Permissions on Every Request
```typescript
// ❌ Bad - checking on frontend only
{user.role === 'admin' && <AdminPanel />}

// ✅ Good - always check on server
export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Proceed with admin action
}
```

### Resource-Level Authorization
```typescript
// Check ownership before update
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  // Check ownership
  if (post.authorId !== session.user.id && session.user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Proceed with update
}

// Using Supabase RLS
const { data, error } = await supabase
  .from('posts')
  .update({ title: newTitle })
  .eq('id', postId)
  // RLS policy automatically filters by user
  .select();

if (!data?.length) {
  // Either doesn't exist or user doesn't have access
  throw new Error('Post not found or access denied');
}
```

## Secure Headers

```typescript
// middleware.ts (Next.js)
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  return response;
}
```

## Secrets Management

### Never Expose Secrets
```typescript
// ❌ Bad - API key in client code
const API_KEY = 'sk_live_abc123'; // Visible to anyone

// ✅ Good - server-side only
// .env.local (not committed)
DATABASE_URL=postgresql://...
API_SECRET_KEY=sk_live_abc123

// Access only in server code
export async function GET() {
  const apiKey = process.env.API_SECRET_KEY;
  // Use in server-side request
}
```

### Environment Variable Validation
```typescript
// env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// Validate at startup
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten());
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
```

## Security Checklist

```markdown
## Input Validation
- [ ] All user input validated on server
- [ ] Use allowlists, not blocklists
- [ ] Validate file uploads (type, size, content)
- [ ] Sanitize filenames

## Authentication
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Session tokens are random, long, HTTPOnly
- [ ] Session regenerated on login
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts

## Authorization
- [ ] Deny by default
- [ ] Check permissions on every request
- [ ] Validate resource ownership
- [ ] Use RLS for database access

## Data Protection
- [ ] HTTPS everywhere
- [ ] Sensitive data encrypted at rest
- [ ] PII logged carefully (or not at all)
- [ ] Secure cookie flags set

## Headers & Transport
- [ ] CSP configured
- [ ] HSTS enabled
- [ ] X-Frame-Options set
- [ ] CORS configured correctly

## Dependencies
- [ ] Regular npm audit
- [ ] Automated security updates
- [ ] Lock file committed
- [ ] No unnecessary dependencies
```

---

## Cross-Domain Cookie Security Patterns

### Cookie Flags Deep Dive

Every authentication cookie should have the correct combination of flags. Getting any one wrong creates a vulnerability.

| Flag | Purpose | When to Use |
|------|---------|-------------|
| `HttpOnly` | Prevents `document.cookie` access from JavaScript | **Always** for auth tokens. Mitigates XSS token theft. |
| `Secure` | Cookie only sent over HTTPS | **Always in production**. Set to `false` only in localhost dev. |
| `SameSite=Strict` | Cookie only sent on same-site requests | Forms, banking -- breaks cross-site login redirects. |
| `SameSite=Lax` | Cookie sent on top-level navigations + same-site | **Default choice** for auth cookies. Allows login redirects. |
| `SameSite=None` | Cookie sent on all cross-site requests | Only with `Secure`. Required for cross-origin iframe/API auth. |
| `Domain` | Which domains receive the cookie | Set to `.parent.com` for subdomain sharing. |
| `Path` | URL path scope | Usually `/`. Restrict to `/api` if cookie is API-only. |
| `Max-Age` / `Expires` | Cookie lifetime | Short (30min-24hr) for auth. Session cookies (no Max-Age) cleared on browser close. |

### SameSite: Lax vs Strict vs None

```
Strict:
  - Cookie NEVER sent on cross-site requests
  - User clicks link from email to your site → NO cookie sent → logged out
  - Use for: banking, admin panels where cross-site access is never needed

Lax (recommended for most auth):
  - Cookie sent on top-level navigations (clicking a link)
  - Cookie NOT sent on cross-site POST, iframe, fetch, img loads
  - Use for: SSO, multi-app auth, most web applications

None:
  - Cookie sent on ALL requests including cross-site
  - REQUIRES Secure flag (HTTPS only)
  - Use for: cross-origin API cookies, embedded iframes, third-party widgets
  - DANGER: Vulnerable to CSRF without additional protection
```

### Subdomain Cookie Sharing (.domain.com Pattern)

To share cookies across subdomains (e.g., `app.example.com`, `api.example.com`, `auth.example.com`):

```typescript
// Set cookie domain with leading dot
const cookieOptions = {
  domain: '.example.com',   // Leading dot = all subdomains
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  maxAge: 60 * 30,          // 30 minutes
}

// This cookie is accessible from:
// - example.com
// - app.example.com
// - api.example.com
// - any.sub.example.com
```

**Critical rules:**
```
[ ] Leading dot is REQUIRED for subdomain sharing: '.example.com'
[ ] Without leading dot, cookie is host-only: only 'example.com' gets it
[ ] Never set domain for localhost (use undefined)
[ ] Logout must delete cookies with the SAME domain they were created with
[ ] Watch for duplicate cookies: one host-only + one domain cookie = conflicts
```

### Debugging Duplicate Cookie Conflicts

A common SSO bug: two cookies with the same name but different domains.

```
Browser has:
  auth-token  Domain: .example.com       ← Shared (correct)
  auth-token  Domain: app.example.com    ← Host-only (conflict!)
```

The host-only cookie takes precedence on `app.example.com`, overriding the shared cookie. Fix by ensuring ALL cookie-setting code uses the parent domain:

```javascript
// Detect duplicates in browser console
document.cookie.split(';').forEach(c => {
  console.log(c.trim().split('=')[0])
})
// Then check DevTools > Application > Cookies for domain values
// Delete host-only duplicates manually or via:
document.cookie = 'auth-token=; Domain=app.example.com; Path=/; Max-Age=0'
```

### JWT Cookie vs Authorization Header: Tradeoffs

| Aspect | JWT in Cookie | Authorization Header |
|--------|--------------|---------------------|
| **CSRF protection** | Vulnerable (auto-sent) -- needs SameSite + CSRF token | Immune (manually attached) |
| **XSS protection** | HttpOnly prevents JS access | Stored in JS-accessible location (localStorage/memory) |
| **Cross-origin** | Needs SameSite=None + CORS credentials | Works with any CORS config |
| **Subdomain SSO** | Natural with Domain=.parent.com | Requires explicit token passing |
| **WebSocket auth** | Auto-sent during handshake | Must pass as query param |
| **Server-side rendering** | Available in SSR (cookies sent with request) | Not available in SSR (client-only) |
| **Mobile apps** | Awkward (cookie jars vary) | Natural fit |
| **Logout** | Must delete cookie on correct domain | Just discard token |

**Recommendation**: Use cookies for web apps with SSO needs. Use Authorization headers for APIs consumed by mobile/CLI clients. Support both in backends:

```python
# FastAPI: Check both Bearer token AND cookie
async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> User:
    # 1. Try Authorization: Bearer header
    if credentials:
        user = verify_token(credentials.credentials)
        if user:
            return user

    # 2. Fallback: Try cookie
    cookie_token = request.cookies.get("auth-token")
    if cookie_token:
        user = verify_token(cookie_token)
        if user:
            return user

    raise HTTPException(status_code=401)
```

```typescript
// Next.js middleware: Check both cookie and header
export async function middleware(request: NextRequest) {
  // 1. Try custom JWT cookie
  const cookieToken = request.cookies.get('auth-token')?.value
  if (cookieToken) {
    const payload = await verifyJWT(cookieToken)
    if (payload) return NextResponse.next()
  }

  // 2. Try Authorization header (for API clients)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const payload = await verifyJWT(token)
    if (payload) return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}
```

### CORS with Credentials for Cookie-Based Auth

When using cookies for cross-origin authentication, CORS must be configured precisely:

```typescript
// Next.js API route CORS headers
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'https://app.example.com',
    'https://admin.example.com',
  ]

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response(null, { status: 403 })
  }

  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,        // Must be exact, not '*'
      'Access-Control-Allow-Credentials': 'true',   // Required for cookies
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

```python
# FastAPI CORS for cookie auth
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.example.com",
        "https://admin.example.com",
    ],
    allow_credentials=True,     # Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# CRITICAL: These two lines are INCOMPATIBLE:
# allow_origins=["*"]  +  allow_credentials=True
# Browsers will reject this. You MUST list explicit origins.
```

**Client-side**: Always include `credentials` in fetch:

```typescript
// Browser fetch with cookie auth
const response = await fetch('https://api.example.com/data', {
  method: 'GET',
  credentials: 'include',  // Sends cookies cross-origin
})

// Axios with cookie auth
const client = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true,  // Sends cookies cross-origin
})
```

### Cookie Security Checklist

```markdown
## Cookie Security
- [ ] All auth cookies have HttpOnly flag
- [ ] All auth cookies have Secure flag in production
- [ ] SameSite is set appropriately (Lax for most, Strict for high-security)
- [ ] Cookie domain uses leading dot for subdomain sharing (.example.com)
- [ ] No duplicate cookies with different domains
- [ ] Cookie Max-Age is as short as practical (30min-24hr)
- [ ] Logout clears cookies with the SAME domain they were created with
- [ ] CORS allows credentials only for explicit, listed origins
- [ ] No sensitive data stored in cookie values (use server-side sessions or JWTs)
- [ ] Cookie size stays under 4KB (browser limit per cookie)

## Cross-Origin Cookie Auth
- [ ] CORS Access-Control-Allow-Origin is explicit (never * with credentials)
- [ ] CORS Access-Control-Allow-Credentials is true
- [ ] Client uses credentials: 'include' (fetch) or withCredentials: true (axios)
- [ ] SameSite=None + Secure for cross-origin cookie sending
- [ ] CSRF protection in place if SameSite=None (double-submit cookie or token)
```
