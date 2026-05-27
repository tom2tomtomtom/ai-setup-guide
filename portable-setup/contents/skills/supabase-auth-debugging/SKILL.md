---
name: supabase-auth-debugging
description: "Diagnoses and fixes Supabase auth issues including multi-app SSO, cross-subdomain sessions, magic links, PKCE flows, refresh tokens, approval workflows, SAML SSO, rate limiting, RLS policies, and auth hooks. Use when: (1) Auth is broken or flaky, (2) Sessions don't persist across apps/subdomains, (3) Magic links fail, (4) Refresh tokens cause logouts, (5) Approval workflows need debugging, (6) Rate limiting causes 429 errors, (7) RLS policies block authenticated users"
---

# Supabase Auth Debugging

Comprehensive diagnostic and fix guide for every layer of Supabase authentication -- from token mechanics to multi-app SSO architectures.

---

## Table of Contents

1. [Diagnostic Decision Tree](#1-diagnostic-decision-tree)
2. [Session & Token Fundamentals](#2-session--token-fundamentals)
3. [Refresh Token Debugging](#3-refresh-token-debugging)
4. [Multi-App SSO & Cross-Subdomain Sessions](#4-multi-app-sso--cross-subdomain-sessions)
5. [Hub-and-Spoke Auth Pattern](#5-hub-and-spoke-auth-pattern)
6. [Magic Link Debugging](#6-magic-link-debugging)
7. [PKCE Flow Debugging](#7-pkce-flow-debugging)
8. [Approval Workflow Debugging](#8-approval-workflow-debugging)
9. [SAML 2.0 Enterprise SSO](#9-saml-20-enterprise-sso)
10. [Next.js Middleware Debugging](#10-nextjs-middleware-debugging)
11. [Row Level Security (RLS) with Auth](#11-row-level-security-rls-with-auth)
12. [Auth Hooks & Triggers](#12-auth-hooks--triggers)
13. [Rate Limiting](#13-rate-limiting)
14. [Error Code Reference](#14-error-code-reference)
15. [Diagnostic Queries & Tools](#15-diagnostic-queries--tools)

---

## 1. Diagnostic Decision Tree

Start here. Match the symptom to the section.

```
SYMPTOM                                          GO TO SECTION
─────────────────────────────────────────────────────────────────
User gets logged out randomly                 -> 3 (Refresh Tokens)
Session works on one app but not another      -> 4 (Cross-Subdomain SSO)
Magic link says "expired" or "invalid"        -> 6 (Magic Links)
"bad_code_verifier" error                     -> 7 (PKCE Flow)
User can log in but can't access data         -> 8 (Approval) or 11 (RLS)
429 Too Many Requests                         -> 13 (Rate Limiting)
Signups create user but trigger fails         -> 12 (Auth Hooks)
SAML SSO redirects but fails                  -> 9 (SAML SSO)
Middleware redirect loops                     -> 10 (Middleware)
"Missing sub claim" / "invalid JWT"           -> 2 (Token Fundamentals)
User approved but still blocked               -> 8 (Approval) + 3 (Refresh)
Auth works locally but not in production      -> 4 (Cookie Domain) + 10
```

### Quick Triage Checklist

```
[ ] Can you reproduce the issue?
[ ] Check browser DevTools > Application > Cookies -- are sb-* cookies present?
[ ] Check Network tab -- is getUser() returning 200 or an error?
[ ] Check Supabase Dashboard > Authentication > Users -- does the user exist?
[ ] Check Dashboard > Authentication > URL Configuration -- are redirect URLs listed?
[ ] Check Dashboard > Logs > Auth -- what errors appear?
[ ] Is this happening for all users or just one?
[ ] Did this start after a deployment or config change?
```

---

## 2. Session & Token Fundamentals

### How Supabase Sessions Work

A session consists of two tokens:

| Token | Type | Lifetime | Storage |
|-------|------|----------|---------|
| **Access token** | JWT | 1 hour (default, configurable 5min-1hr) | Cookie chunk `sb-<ref>-auth-token.0`, `.1`, etc. |
| **Refresh token** | Opaque string | Never expires (but single-use) | Stored alongside access token |

Every access token contains these claims:

```json
{
  "sub": "user-uuid",
  "aud": "authenticated",
  "role": "authenticated",
  "aal": "aal1",
  "session_id": "session-uuid",
  "email": "user@example.com",
  "phone": "",
  "app_metadata": { "provider": "email" },
  "user_metadata": { "full_name": "..." },
  "exp": 1700000000,
  "iat": 1699996400
}
```

### getUser() vs getSession() -- Critical Security Rule

```typescript
// SERVER-SIDE: ALWAYS use getUser() -- makes a network call to verify
const { data: { user }, error } = await supabase.auth.getUser()
// This contacts the Supabase Auth server. Cannot be spoofed.

// CLIENT-SIDE: getSession() is OK for UI state (not for security decisions)
const { data: { session } } = await supabase.auth.getSession()
// Reads from local storage/cookies. CAN be tampered with.
// NEVER trust this on the server for authorization decisions.
```

**Why this matters**: `getSession()` decodes the JWT from cookies without verification. An attacker can craft a fake JWT cookie. `getUser()` validates against the Supabase Auth server.

### Common JWT Errors

**"Missing sub claim" (401)**
```
AuthApiError: { 401: invalid claim: missing sub }
```
- **Cause**: Using the Supabase API key (`SUPABASE_ANON_KEY`) where a user's access token is expected
- **Fix**: Pass `session.access_token` in the Authorization header, not the API key

**"JWT is invalid"**
- **Cause**: Token expired, malformed, or signing key mismatch
- **Fix**: Check token expiry. Ensure `SUPABASE_JWT_SECRET` matches between environments. Force session refresh.

**Decode a JWT for debugging:**
```bash
# Decode without verification (for inspection only)
echo "YOUR_JWT_HERE" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .
```

```typescript
// In code
const jwt = session.access_token
const payload = JSON.parse(atob(jwt.split('.')[1]))
console.log('Expires:', new Date(payload.exp * 1000))
console.log('Session ID:', payload.session_id)
console.log('User ID:', payload.sub)
```

---

## 3. Refresh Token Debugging

### How Refresh Tokens Work

```
1. User logs in -> receives access_token + refresh_token
2. Access token expires (default 1 hour)
3. SDK automatically uses refresh_token to get new pair
4. Old refresh token is INVALIDATED (single-use)
5. New access_token + new refresh_token issued
6. Repeat from step 2
```

### The 10-Second Reuse Window

Supabase allows refresh token reuse within a **10-second window** after first use. This handles SSR race conditions where multiple server processes try to refresh simultaneously.

```
Timeline:
0s  - Process A uses refresh_token_1 -> gets token_2 pair
3s  - Process B uses refresh_token_1 -> ALLOWED (within 10s window, returns same token_2)
15s - Process C uses refresh_token_1 -> DENIED (outside 10s window)
     -> ENTIRE SESSION REVOKED (security: potential token theft)
     -> User forcibly logged out
```

### Symptom: Random Logouts

**Root causes (most common first):**

1. **Multiple tabs/windows refreshing simultaneously**
   ```
   Tab A refreshes token at T=0 -> gets new pair
   Tab B still has old token, refreshes at T=12 -> REVOKED
   Both tabs logged out
   ```
   **Fix**: Use `BroadcastChannel` or `localStorage` events for cross-tab token sync:
   ```typescript
   // The @supabase/ssr package handles this via cookies automatically.
   // If using @supabase/supabase-js directly (client-only), ensure
   // you're using a single client instance shared across the app.

   // WRONG: Creating multiple clients
   function ComponentA() {
     const supabase = createClient(url, key) // New client = new refresh cycle
   }
   function ComponentB() {
     const supabase = createClient(url, key) // Another client = race condition
   }

   // RIGHT: Single shared client
   // lib/supabase.ts
   let client: SupabaseClient | null = null
   export function getSupabase() {
     if (!client) {
       client = createClient(url, key)
     }
     return client
   }
   ```

2. **Server-side rendering refresh race**
   ```
   Middleware refreshes token -> writes new cookie
   Server Component reads stale cookie -> tries old refresh token -> REVOKED
   ```
   **Fix**: The middleware must update `request.cookies` (not just `response.cookies`) so downstream Server Components get the fresh token:
   ```typescript
   // In middleware setAll callback:
   setAll(cookiesToSet) {
     // Step 1: Update request cookies (for Server Components)
     cookiesToSet.forEach(({ name, value }) =>
       request.cookies.set(name, value)
     )
     // Step 2: Create new response with updated request
     supabaseResponse = NextResponse.next({ request })
     // Step 3: Update response cookies (for the browser)
     cookiesToSet.forEach(({ name, value, options }) =>
       supabaseResponse.cookies.set(name, value, options)
     )
   }
   ```

3. **Stale closure capturing old token**
   ```typescript
   // WRONG: Token captured at component mount, stale after refresh
   useEffect(() => {
     const token = session?.access_token // Stale after refresh!
     fetchData(token)
   }, []) // Empty deps = never updates

   // RIGHT: Use the client, which manages tokens internally
   useEffect(() => {
     supabase.from('items').select('*') // Client uses current token
   }, [])
   ```

4. **Cross-subdomain cookie conflicts**
   - Two apps writing auth cookies with different domains
   - One app's cookie overwrites the other's
   - See Section 4

5. **Service worker or CDN caching stale auth responses**
   - **Fix**: Ensure auth endpoints bypass cache. Add `Cache-Control: no-store` headers.

### Symptom: "refresh_token_already_used" Error

```
AuthSessionMissingError: Session from session_id claim in JWT does not exist
AuthApiError: Invalid Refresh Token: Already Used
```

**Diagnosis steps:**

```typescript
// 1. Log all auth state changes to find the culprit
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`[AUTH] ${new Date().toISOString()} event=${event}`, {
    sessionId: session?.user?.id,
    expiresAt: session?.expires_at,
    // Don't log full tokens in production!
  })
})

// 2. Check if multiple clients exist
// In browser console:
console.log('Supabase clients:',
  performance.getEntriesByType('resource')
    .filter(r => r.name.includes('auth/v1/token'))
    .length
)
// If > 1 within a few seconds, you have a race condition
```

**Fix**: Ensure exactly ONE Supabase client instance per context (browser tab, server request).

### Symptom: Token Refresh Succeeds But User Appears Logged Out

**Cause**: The refreshed cookie isn't being read by the component checking auth.

```typescript
// Debug: Compare what middleware sees vs what the page sees
// In middleware:
console.log('[MW] cookies:', request.cookies.getAll().map(c => c.name))

// In Server Component:
import { cookies } from 'next/headers'
const cookieStore = await cookies()
console.log('[SC] cookies:', cookieStore.getAll().map(c => c.name))

// If middleware sees updated cookies but Server Component doesn't,
// the middleware isn't passing cookies via request.cookies.set()
```

### Refresh Token Lifecycle Debugging

```sql
-- Check active sessions for a user (run in Supabase SQL editor)
SELECT
  s.id as session_id,
  s.created_at,
  s.updated_at,
  s.not_after,
  s.refreshed_at,
  s.user_agent,
  s.ip
FROM auth.sessions s
WHERE s.user_id = 'USER_UUID_HERE'
ORDER BY s.created_at DESC;

-- Check refresh tokens for a session
SELECT
  rt.id,
  rt.token,
  rt.revoked,
  rt.created_at,
  rt.updated_at,
  rt.parent
FROM auth.refresh_tokens rt
WHERE rt.session_id = 'SESSION_UUID_HERE'
ORDER BY rt.created_at DESC
LIMIT 10;

-- Find revoked sessions (potential token theft detection)
SELECT
  rt.session_id,
  rt.revoked,
  rt.created_at,
  s.user_id
FROM auth.refresh_tokens rt
JOIN auth.sessions s ON s.id = rt.session_id
WHERE rt.revoked = true
ORDER BY rt.created_at DESC
LIMIT 20;
```

### Force Session Refresh (Client-Side Recovery)

```typescript
// When you detect a stale session, force refresh:
const { data, error } = await supabase.auth.refreshSession()

if (error) {
  // Refresh failed -- session is dead, must re-authenticate
  console.error('Session refresh failed:', error.code)
  await supabase.auth.signOut()
  window.location.href = '/login'
} else {
  console.log('Session refreshed successfully')
}
```

### Preventing Refresh Token Issues

```typescript
// 1. Use onAuthStateChange instead of polling getSession()
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Update any cached auth state
    setSession(session)
  }
  if (event === 'SIGNED_OUT') {
    // Session is gone -- could be revocation from another tab
    router.push('/login')
  }
})

// 2. Handle visibility change (user returns to tab)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Tab became active -- check if session is still valid
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      }
    })
  }
})
```

---

## 4. Multi-App SSO & Cross-Subdomain Sessions

### The Problem

Multiple apps on subdomains (`gateway.aiden.services`, `creative.aiden.services`, `studio.aiden.services`) each create their own Supabase auth cookies scoped to their specific host. Sessions don't transfer between subdomains by default.

### Solution: Set Cookie Domain to Parent

Every Supabase client across all apps must set cookies on the **parent domain**:

```typescript
// CRITICAL: This must be identical across ALL apps sharing auth
const COOKIE_DOMAIN = process.env.NODE_ENV === 'production'
  ? '.aiden.services'   // Leading dot = includes all subdomains
  : undefined           // undefined for localhost (NEVER set '.localhost')
```

**Browser client (`lib/supabase/client.ts`):**

```typescript
import { createBrowserClient } from '@supabase/ssr'

const COOKIE_DOMAIN = process.env.NODE_ENV === 'production'
  ? '.aiden.services'
  : undefined

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: COOKIE_DOMAIN,
        path: '/',
        sameSite: 'lax',
        secure: true,
      },
    }
  )
}
```

**Server client (`lib/supabase/server.ts`):**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const COOKIE_DOMAIN = process.env.NODE_ENV === 'production'
  ? '.aiden.services'
  : undefined

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                domain: COOKIE_DOMAIN,
              })
            )
          } catch {
            // Called from Server Component -- safe to ignore if middleware handles refresh
          }
        },
      },
    }
  )
}
```

**Middleware (`lib/supabase/middleware.ts`):**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_DOMAIN = process.env.NODE_ENV === 'production'
  ? '.aiden.services'
  : undefined

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              domain: COOKIE_DOMAIN,
            })
          )
        },
      },
    }
  )

  // CRITICAL: Do NOT run code between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // CRITICAL: Return supabaseResponse, not a new NextResponse
  return supabaseResponse
}
```

### Cross-Subdomain Debugging Checklist

```
[ ] All apps use the SAME Supabase project URL and anon key
[ ] All apps set cookie domain to '.parentdomain.com' (with leading dot)
[ ] Cookie domain is undefined (not set) in development/localhost
[ ] All apps have sameSite: 'lax' and secure: true
[ ] Redirect URLs for ALL subdomains are listed in Supabase Dashboard
[ ] Logout clears cookies with the SAME domain attribute used during creation
[ ] No app is setting cookies without the domain (creates host-only duplicates)
```

### Debugging Cookie Conflicts

```javascript
// Run in browser console on each subdomain to see what cookies exist:
document.cookie.split(';').forEach(c => {
  const [name, value] = c.trim().split('=')
  if (name.startsWith('sb-')) {
    console.log(`Cookie: ${name}, Length: ${value?.length || 0}`)
  }
})

// Check cookie domain in DevTools > Application > Cookies
// Look for DUPLICATE cookies with different domains:
//   sb-xxxx-auth-token.0  Domain: .aiden.services     <-- shared (correct)
//   sb-xxxx-auth-token.0  Domain: creative.aiden.services  <-- host-only (conflict!)
```

**Fix duplicate cookies**: Delete the host-specific cookie. Ensure every `setAll` callback includes the parent domain.

### Logout Across All Subdomains

```typescript
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()

  // Explicitly clear cookies on the shared domain
  const cookieNames = document.cookie
    .split(';')
    .map(c => c.trim().split('=')[0])
    .filter(name => name.startsWith('sb-'))

  cookieNames.forEach(name => {
    // Clear on parent domain
    document.cookie = `${name}=; Domain=.aiden.services; Path=/; Max-Age=0; Secure; SameSite=Lax`
    // Also clear on current subdomain (in case host-only cookies exist)
    document.cookie = `${name}=; Path=/; Max-Age=0; Secure; SameSite=Lax`
  })
}
```

### localhost Development with Subdomains

Browsers restrict cookie sharing on `.localhost`. For local multi-app testing:

```bash
# /etc/hosts (macOS/Linux) or C:\Windows\System32\drivers\etc\hosts
127.0.0.1   gateway.local.test
127.0.0.1   creative.local.test
127.0.0.1   studio.local.test
```

```typescript
// Use .local.test domain in development
const COOKIE_DOMAIN = process.env.NODE_ENV === 'production'
  ? '.aiden.services'
  : process.env.NEXT_PUBLIC_DEV_COOKIE_DOMAIN || undefined // '.local.test'
```

---

## 5. Hub-and-Spoke Auth Pattern

### Architecture

A central "hub" (gateway) handles all authentication. Spoke apps consume the shared session.

```
                    ┌─────────────────────┐
                    │  gateway.aiden.services  │
                    │  (Hub - Login/Signup)    │
                    └──────────┬──────────┘
                               │
              Sets cookie on .aiden.services
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│ creative.aiden  │  │  studio.aiden   │  │   chat.aiden    │
│  (Spoke App)    │  │  (Spoke App)    │  │  (Spoke App)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │                     │
         └─────── All read cookie from .aiden.services ──────┘
```

### Hub App: Login Handler

```typescript
// gateway.aiden.services/app/login/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const returnTo = formData.get('returnTo') as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `https://gateway.aiden.services/auth/callback?next=${encodeURIComponent(returnTo || '/')}`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login/check-email')
}
```

### Spoke App: Redirect to Hub

```typescript
// creative.aiden.services/middleware.ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // If updateSession redirected to /login, redirect to gateway instead
  if (response.headers.get('location')?.includes('/login')) {
    const returnTo = request.nextUrl.pathname
    const gatewayLogin = `https://gateway.aiden.services/login?returnTo=${encodeURIComponent(`https://creative.aiden.services${returnTo}`)}`
    return NextResponse.redirect(gatewayLogin)
  }

  return response
}
```

### Hub Auth Callback with Cross-App Redirect

```typescript
// gateway.aiden.services/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If 'next' is an absolute URL to a spoke app, redirect there
      if (next.startsWith('https://') && next.includes('.aiden.services')) {
        return NextResponse.redirect(next)
      }
      // Otherwise redirect within gateway
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
```

### Auth Caching to Reduce API Calls

```typescript
// Pattern from AIDEN architecture: cache getUser() verification for 30s
const AUTH_CACHE_COOKIE = 'aiden-auth-ts'
const AUTH_CACHE_TTL_MS = 30_000

export async function updateSession(request: NextRequest) {
  // Check public routes BEFORE any auth call
  const publicRoutes = ['/login', '/auth/callback', '/api/health']
  if (publicRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Check auth cache cookie
  const authCache = request.cookies.get(AUTH_CACHE_COOKIE)
  if (authCache) {
    const cacheTime = parseInt(authCache.value)
    if (Date.now() - cacheTime < AUTH_CACHE_TTL_MS) {
      return NextResponse.next() // Skip getUser() call
    }
  }

  // Cache miss -- verify with Supabase
  const supabase = createServerClient(/* ... */)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error?.status === 429) {
    // Rate limited -- DON'T clear cookies, redirect with flag
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('rate_limited', '1')
    return NextResponse.redirect(url)
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Set cache cookie on shared domain
  const response = NextResponse.next({ request })
  response.cookies.set(AUTH_CACHE_COOKIE, Date.now().toString(), {
    domain: COOKIE_DOMAIN,
    maxAge: 30,
    path: '/',
    sameSite: 'lax',
    secure: true,
  })

  return response
}
```

### Cross-Domain SSO (Different Parent Domains)

For apps that do NOT share a parent domain, use Supabase as an **OAuth 2.1 Server** (beta):

```typescript
// Spoke app initiates OAuth flow to Supabase
const { data, error } = await supabase.auth.signInWithSSO({
  domain: 'your-org.com',
  options: {
    redirectTo: 'https://spoke-app.different-domain.com/auth/callback',
  },
})

if (data?.url) {
  window.location.href = data.url
}
```

---

## 6. Magic Link Debugging

### How Magic Links Work

```
1. Client calls signInWithOtp({ email, options: { emailRedirectTo } })
2. Supabase generates PKCE code_challenge + stores code_verifier in browser
3. Supabase sends email with link containing auth code
4. User clicks link -> redirected to emailRedirectTo with ?code=XXX
5. App exchanges code for session using stored code_verifier
6. Session established
```

### Common Failures and Fixes

#### "otp_expired" / Link says expired

**Causes (in order of likelihood):**

1. **Email security scanner consumed the link**
   - Enterprise email systems (Microsoft Defender, Mimecast, Barracuda) pre-fetch URLs
   - The one-time link gets used by the scanner before the user clicks
   - **Fix**: Use an intermediate confirmation page instead of a direct auth link:
   ```html
   <!-- Custom email template using token_hash instead of direct link -->
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard">
     Sign In to AIDEN
   </a>
   ```

2. **User waited too long (>5 minutes for PKCE, configurable for OTP)**
   - **Fix**: Increase OTP expiry in Dashboard > Authentication > Email or inform user

3. **Link was already used (single-use)**
   - **Fix**: Generate a new link. If this happens repeatedly, check for email scanner issue

4. **User clicked an old link from a previous request**
   - Each new `signInWithOtp` invalidates prior links
   - **Fix**: Tell users to click the MOST RECENT email

#### "bad_code_verifier"

The PKCE `code_verifier` is stored in the browser that initiated the flow. See Section 7.

#### "Redirect URL not allowed"

```
Error: Redirect URL not allowed
```

**Fix checklist:**
```
[ ] emailRedirectTo URL is in Dashboard > Authentication > URL Configuration > Redirect URLs
[ ] Wildcards are used correctly: https://*.aiden.services/**
[ ] Protocol matches exactly: http vs https
[ ] localhost URLs added for development: http://localhost:3000/**
[ ] No trailing slash mismatch
```

#### Magic link works locally but not in production

```
[ ] Production URL is in redirect URLs list
[ ] Custom domain configured correctly in Supabase Dashboard
[ ] Email template uses {{ .SiteURL }} not a hardcoded URL
[ ] HTTPS is enforced in production
```

#### Rate limiting on magic links

- **Default**: 2 emails per hour per recipient
- **60-second cooldown** between resends per user
- **Fix**: Set up custom SMTP to increase limits, or show cooldown UI:

```typescript
const MAGIC_LINK_COOLDOWN_MS = 60_000

export function MagicLinkForm() {
  const [lastSent, setLastSent] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  async function handleSubmit(email: string) {
    const now = Date.now()
    if (now - lastSent < MAGIC_LINK_COOLDOWN_MS) {
      setCooldown(Math.ceil((MAGIC_LINK_COOLDOWN_MS - (now - lastSent)) / 1000))
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error?.code === 'over_email_send_rate_limit') {
      setCooldown(60)
    } else if (!error) {
      setLastSent(now)
    }
  }

  return (
    <form>
      <input type="email" name="email" />
      <button disabled={cooldown > 0}>
        {cooldown > 0 ? `Wait ${cooldown}s` : 'Send Magic Link'}
      </button>
    </form>
  )
}
```

### Using OTP Code Instead of Magic Link (Cross-Device Friendly)

Magic links with PKCE fail cross-device. OTP codes work everywhere:

```typescript
// Send OTP code (no emailRedirectTo = sends 6-digit code)
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  // No emailRedirectTo option
})

// User enters the 6-digit code
const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email',
})
```

---

## 7. PKCE Flow Debugging

### How PKCE Works in Supabase

```
Browser                          Supabase Auth
  │                                    │
  │ signInWithOtp(email)               │
  ├───────────────────────────────────>│
  │                                    │
  │ Generates:                         │
  │ - code_verifier (random, stored    │
  │   in localStorage)                 │
  │ - code_challenge = SHA256(verifier)│
  │                                    │
  │ Sends code_challenge to server ───>│
  │                                    │ Stores challenge
  │                                    │ Sends email with code
  │                                    │
  │ [User clicks magic link]           │
  │                                    │
  │ GET /auth/callback?code=XXX        │
  │ exchangeCodeForSession(code)       │
  ├───────────────────────────────────>│
  │ Sends code + code_verifier ───────>│
  │                                    │ Verifies:
  │                                    │ SHA256(verifier) == stored challenge
  │                                    │
  │ <──────── access_token + refresh   │
  │           token returned           │
```

### "bad_code_verifier" Debugging

This is the **#1 magic link complaint**. The code_verifier from step 1 must match the code from step 2.

**Why it fails:**

| Scenario | Why | Fix |
|----------|-----|-----|
| Different device | code_verifier is in original browser's localStorage | Use OTP codes instead |
| Different browser | Same as above | Use OTP codes instead |
| Incognito window | localStorage cleared between request and click | Don't use incognito for magic links |
| localStorage cleared | Extensions, security software, manual clear | Check for aggressive cleanup |
| Multiple signInWithOtp calls | Each call generates a new verifier, invalidating the previous | Debounce the request |
| SSR mismatch | Server doesn't have access to browser localStorage | Use token_hash verification route |

### The Token Hash Alternative (Bypasses PKCE Issues)

```typescript
// app/auth/confirm/route.ts
// Uses token_hash from the email link instead of PKCE code
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      redirect(next)
    }
  }

  redirect('/auth/error')
}
```

**Email template for token_hash approach:**
```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard">
  Sign In
</a>
```

### admin.generateLink() Does NOT Support PKCE

```typescript
// Links generated server-side always use implicit flow
const { data, error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: 'user@example.com',
})
// data.properties.hashed_token -> use with verifyOtp({ token_hash })
// This works cross-device because there's no code_verifier
```

---

## 8. Approval Workflow Debugging

### Architecture: Three-Tier Access Model

```
SIGNUP    -> User created in auth.users
            Profile created with status='pending'

PENDING   -> Authenticated but blocked from data
            Sees "awaiting approval" page

APPROVED  -> Admin sets is_approved=true
            Custom JWT hook adds claim
            User refreshes -> full access
```

### Database Schema

```sql
-- Profiles table with approval status
CREATE TABLE public.profiles (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Custom Access Token Hook (Injects Approval into JWT)

```sql
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_status text;
BEGIN
  SELECT p.status INTO user_status
  FROM public.profiles p
  WHERE p.user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF jsonb_typeof(claims->'app_metadata') IS NULL THEN
    claims := jsonb_set(claims, '{app_metadata}', '{}');
  END IF;

  claims := jsonb_set(
    claims,
    '{app_metadata, approval_status}',
    to_jsonb(COALESCE(user_status, 'pending'))
  );
  claims := jsonb_set(
    claims,
    '{app_metadata, is_approved}',
    to_jsonb(COALESCE(user_status, 'pending') = 'approved')
  );

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

-- Required grants
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;
GRANT ALL ON TABLE public.profiles TO supabase_auth_admin;

CREATE POLICY "Auth admin reads profiles"
  ON public.profiles AS PERMISSIVE FOR SELECT
  TO supabase_auth_admin USING (true);
```

**Enable**: Dashboard > Authentication > Hooks > Custom Access Token > Select `custom_access_token_hook`

### RLS Policies for Approval

```sql
-- Only approved users can access application data
CREATE POLICY "Approved users read data"
  ON public.app_data FOR SELECT
  TO authenticated
  USING (
    COALESCE(
      ((SELECT auth.jwt()->'app_metadata')::jsonb->>'is_approved')::boolean,
      false
    ) = true
  );

-- Users can always read their own profile (to see their status)
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Admins can read all profiles
CREATE POLICY "Admins read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    COALESCE(
      ((SELECT auth.jwt())->'app_metadata'->>'approval_status'),
      'pending'
    ) = 'approved'
    AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (SELECT auth.uid()) AND role = 'admin'
    )
  );
```

### Middleware: Redirect Unapproved Users

```typescript
export async function updateSession(request: NextRequest) {
  // ... standard middleware setup ...

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check approval status from JWT claims
  const isApproved = user.app_metadata?.is_approved === true
  const isPendingPage = request.nextUrl.pathname.startsWith('/pending-approval')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  if (!isApproved && !isPendingPage && !isAuthRoute) {
    return NextResponse.redirect(new URL('/pending-approval', request.url))
  }

  if (isApproved && isPendingPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
```

### Admin Approval API Route

```typescript
// app/api/admin/approve/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Use service role -- NEVER expose to client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { userId, status } = await request.json()

  // Validate status
  if (!['approved', 'rejected', 'suspended'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Update profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      status,
      approved_by: /* admin user id from auth */,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    })
    .eq('user_id', userId)

  // Also update app_metadata directly (takes effect on next token refresh)
  const { error: userError } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: {
        approval_status: status,
        is_approved: status === 'approved',
      },
    }
  )

  if (profileError || userError) {
    return NextResponse.json(
      { error: 'Failed to update', details: { profileError, userError } },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
```

### Debugging: User Approved But Still Blocked

**Symptom**: Admin approved the user, but they still see "pending approval"

**Root cause**: The JWT still contains the old `is_approved: false` claim. JWTs are valid until expiry (default 1 hour).

**Fixes:**

1. **Force token refresh after approval** (client-side):
   ```typescript
   // After admin approves, tell the user to click "Refresh"
   async function refreshApprovalStatus() {
     const { data, error } = await supabase.auth.refreshSession()
     if (data.session) {
       const isApproved = data.session.user.app_metadata?.is_approved
       if (isApproved) {
         router.push('/dashboard')
       } else {
         alert('Your account is still pending approval.')
       }
     }
   }
   ```

2. **Auto-poll for approval** (pending page):
   ```typescript
   // Pending approval page -- check every 30s
   useEffect(() => {
     const interval = setInterval(async () => {
       const { data } = await supabase.auth.refreshSession()
       if (data.session?.user?.app_metadata?.is_approved) {
         router.push('/dashboard')
       }
     }, 30_000)
     return () => clearInterval(interval)
   }, [])
   ```

3. **Shorter JWT expiry** (reduces wait time):
   - Dashboard > Authentication > JWT Configuration > JWT Expiry
   - Set to 300 (5 minutes) for approval-heavy apps
   - Tradeoff: more frequent refreshes = more API calls

### Important: app_metadata vs user_metadata

```
app_metadata:  Server-only. Set via service role or admin API. SAFE for authorization.
user_metadata: User-writable via supabase.auth.updateUser(). NEVER use for authorization.
```

---

## 9. SAML 2.0 Enterprise SSO

### Setup

```bash
# 1. Retrieve your SAML endpoints (give these to your IdP)
supabase sso info --project-ref <your-project>

# EntityID:  https://<ref>.supabase.co/auth/v1/sso/saml/metadata
# ACS URL:   https://<ref>.supabase.co/auth/v1/sso/saml/acs
# SLO URL:   https://<ref>.supabase.co/auth/v1/sso/slo

# 2. Register the IdP
supabase sso add --type saml --project-ref <your-project> \
  --metadata-url 'https://idp.company.com/saml/metadata' \
  --domains company.com

# 3. List registered providers
supabase sso list --project-ref <your-project>
```

### Client-Side SSO Initiation

```typescript
const { data, error } = await supabase.auth.signInWithSSO({
  domain: 'company.com',
  options: {
    redirectTo: 'https://app.example.com/auth/callback',
  },
})

if (data?.url) {
  window.location.href = data.url // Redirect to IdP login
}
```

### Common SAML Errors

| Error Code | Cause | Fix |
|-----------|-------|-----|
| `saml_provider_disabled` | SAML not enabled | Enable in Dashboard > Auth Providers |
| `saml_idp_not_found` | Domain not registered | Register domain with `supabase sso add` |
| `saml_assertion_no_email` | IdP didn't send email | Map email attribute in IdP config |
| `saml_assertion_no_user_id` | Missing NameID | Configure NameID in IdP |
| `saml_relay_state_expired` | User too slow at IdP | Increase timeout or retry |
| `saml_metadata_fetch_failed` | Can't reach IdP metadata URL | Check network/firewall |

### SAML + RLS: Tenant Isolation

```sql
-- Use SSO provider ID for multi-tenant data isolation
CREATE POLICY "Tenant data via SSO"
  ON organization_data
  AS RESTRICTIVE FOR SELECT
  TO authenticated
  USING (
    sso_provider_id = ((SELECT auth.jwt()) #>> '{amr,0,provider}')
  );

-- Check auth method in policies
-- auth.jwt()#>>'{amr,0,method}' returns 'sso/saml' for SAML users
```

---

## 10. Next.js Middleware Debugging

### The Three Cookie Operations (Must All Work)

```
1. REFRESH: supabase.auth.getUser() triggers token refresh if expired
2. PASS TO SERVER COMPONENTS: request.cookies.set() updates the request
3. PASS TO BROWSER: response.cookies.set() updates the response
```

**If any step fails, auth breaks.**

### Common Middleware Issues

#### Infinite redirect loop

```
/dashboard -> middleware -> /login -> middleware -> /login -> ...
```

**Causes:**
1. Public route check missing for `/login`:
   ```typescript
   // WRONG: /login is not excluded from auth check
   if (!user) {
     return NextResponse.redirect(new URL('/login', request.url))
   }

   // RIGHT: Skip auth for public routes
   const publicRoutes = ['/login', '/auth', '/api/health']
   if (publicRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
     return NextResponse.next()
   }
   ```

2. Middleware matcher includes static files:
   ```typescript
   // RIGHT: Exclude static files
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
     ],
   }
   ```

3. Auth callback route not excluded:
   ```typescript
   // MUST exclude /auth/callback or the PKCE exchange fails
   if (request.nextUrl.pathname.startsWith('/auth/callback')) {
     return NextResponse.next()
   }
   ```

#### Creating a new response breaks cookies

```typescript
// WRONG: Creating new response loses cookie updates
const { data: { user } } = await supabase.auth.getUser()
return NextResponse.next() // Fresh response = cookies from setAll lost!

// RIGHT: Return supabaseResponse (has cookie updates)
const { data: { user } } = await supabase.auth.getUser()
return supabaseResponse

// RIGHT: If you must create a new response, copy cookies
const myResponse = NextResponse.rewrite(someUrl)
myResponse.cookies.setAll(supabaseResponse.cookies.getAll())
return myResponse
```

#### Code between createServerClient and getUser()

```typescript
// WRONG: Can cause random logouts
const supabase = createServerClient(/* ... */)
await someOtherAsyncOperation() // This can interfere with cookie handling
const { data: { user } } = await supabase.auth.getUser()

// RIGHT: Call getUser() immediately after creating client
const supabase = createServerClient(/* ... */)
const { data: { user } } = await supabase.auth.getUser()
await someOtherAsyncOperation() // After getUser is fine
```

### Server Components vs Client Components Auth

| | Server Component | Client Component |
|---|---|---|
| Client | `createClient()` from `server.ts` | `createClient()` from `client.ts` |
| Cookie access | `cookies()` API (read-only) | Browser automatic |
| Session refresh | Handled by middleware | Handled by `onAuthStateChange` |
| Security check | `getUser()` always | `getSession()` OK for UI |
| Cookie writing | Cannot write (catch block) | Automatic via `@supabase/ssr` |

---

## 11. Row Level Security (RLS) with Auth

### Core Auth Functions in SQL

```sql
(SELECT auth.uid())   -- Authenticated user's UUID (from JWT sub claim)
(SELECT auth.jwt())   -- Full JWT claims as JSONB
(SELECT auth.role())  -- Current role: 'anon', 'authenticated', 'service_role'
```

### Performance-Critical Pattern: Always Use SELECT Subquery

```sql
-- BAD: Calls auth.uid() for EVERY ROW (O(n) function calls)
CREATE POLICY "Users see own" ON items FOR SELECT
  USING (auth.uid() = user_id);

-- GOOD: Calls auth.uid() ONCE via initPlan caching (O(1))
CREATE POLICY "Users see own" ON items FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
```

This can yield **100x+ performance improvements** on large tables.

### Common RLS Gotchas

**1. RLS enabled + no policies = deny all:**
```sql
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- Forgot policies -> ALL access blocked, even authenticated users
```

**2. UPDATE requires a matching SELECT policy:**
```sql
-- This alone WON'T work:
CREATE POLICY "update" ON items FOR UPDATE USING ((SELECT auth.uid()) = user_id);
-- You ALSO need:
CREATE POLICY "select" ON items FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);
```

**3. Always specify TO role:**
```sql
-- GOOD: Skip evaluation entirely for anon
CREATE POLICY "auth only" ON items FOR SELECT
  TO authenticated  -- <-- This matters
  USING ((SELECT auth.uid()) = user_id);
```

**4. Add indexes on RLS columns:**
```sql
CREATE INDEX idx_items_user_id ON items USING btree (user_id);
```

### Debugging RLS Policies

```sql
-- Test RLS as a specific user
SET request.jwt.claims = '{"sub": "USER-UUID", "role": "authenticated", "app_metadata": {"is_approved": true}}';
SET role = 'authenticated';

-- Run query
SELECT * FROM items LIMIT 5;

-- Check query plan with RLS
EXPLAIN ANALYZE SELECT * FROM items WHERE id = 'some-id';

-- Reset
RESET role;
RESET request.jwt.claims;
```

```typescript
// Client-side: use explain modifier
const { data } = await supabase
  .from('items')
  .select('*')
  .explain({ analyze: true, verbose: true })
console.log(data) // Shows query plan with RLS policies applied
```

### RBAC Authorization Function

```sql
CREATE TYPE public.app_permission AS ENUM (
  'projects.read', 'projects.write', 'projects.delete',
  'admin.manage_users'
);

CREATE OR REPLACE FUNCTION public.authorize(requested_permission app_permission)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role public.app_role;
BEGIN
  SELECT ((SELECT auth.jwt()) ->> 'user_role')::public.app_role INTO user_role;

  RETURN EXISTS (
    SELECT 1 FROM public.role_permissions
    WHERE permission = requested_permission AND role = user_role
  );
END;
$$;

-- Use in policy
CREATE POLICY "Delete requires permission"
  ON items FOR DELETE TO authenticated
  USING (public.authorize('projects.delete'));
```

---

## 12. Auth Hooks & Triggers

### Auth Hooks (Run DURING Auth Flow)

| Hook | When | Use Case |
|------|------|----------|
| Before User Created | Before insert into auth.users | Block disposable emails, enforce invite-only |
| Custom Access Token | Before JWT issued | Add roles, approval status, custom claims |
| Send Email | When email needs sending | Custom email provider |
| Send SMS | When SMS needs sending | Custom SMS provider |
| MFA Verification | During MFA check | Custom MFA logic |
| Password Verification | During password check | External password store |

**Timeout**: Postgres hooks = 2 seconds. HTTP hooks = 5 seconds.

### Custom Access Token Hook Template

```sql
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  -- Add your variables here
BEGIN
  claims := event->'claims';

  -- Ensure app_metadata exists
  IF jsonb_typeof(claims->'app_metadata') IS NULL THEN
    claims := jsonb_set(claims, '{app_metadata}', '{}');
  END IF;

  -- Add your custom claims
  -- claims := jsonb_set(claims, '{app_metadata, key}', '"value"');

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

-- REQUIRED grants (hook won't work without these)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;
```

### Before User Created Hook (Invite-Only / Block Signups)

```sql
CREATE OR REPLACE FUNCTION public.before_user_created_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  invite_exists boolean;
BEGIN
  -- Check if this email was invited
  SELECT EXISTS (
    SELECT 1 FROM public.invitations
    WHERE email = (event->'user'->>'email')
    AND status = 'pending'
  ) INTO invite_exists;

  IF NOT invite_exists THEN
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'Registration is by invitation only'
      )
    );
  END IF;

  RETURN event;
END;
$$;
```

### Database Triggers (Run AFTER Auth Events)

```sql
-- These fire on database changes, not during auth flow
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Critical**: If the trigger function fails, **signups are blocked**. Always use `SECURITY DEFINER` and `SET search_path = ''`.

### Debugging Hooks

```sql
-- Check if hook is registered
SELECT * FROM auth.flow_state ORDER BY created_at DESC LIMIT 5;

-- Test hook function manually
SELECT public.custom_access_token_hook('{
  "user_id": "test-uuid",
  "claims": {
    "sub": "test-uuid",
    "aud": "authenticated",
    "role": "authenticated",
    "app_metadata": {}
  }
}'::jsonb);

-- Check for errors in Supabase logs
-- Dashboard > Logs > Auth > Filter by level: error
```

---

## 13. Rate Limiting

### Default Limits

| Endpoint | Default Limit | Config Key |
|----------|--------------|------------|
| Email sending | 2/hour | `rate_limit_email_sent` |
| SMS sending | 30/hour | `rate_limit_sms_sent` |
| OTP generation | 30/hour | `rate_limit_otp` |
| Token refresh | 1800/hour | `rate_limit_token_refresh` |
| Verification | 30/hour | `rate_limit_verify` |
| Anonymous signups | 30/hour | `rate_limit_anonymous_users` |
| SSO | 30/hour | `rate_limit_sso` |
| Per-user OTP resend | 60s cooldown | - |
| Per-user password reset | 60s cooldown | - |

Rate limits are **IP-based**. Limits are per-instance (not distributed across replicas).

### The Golden Rule: On 429, Do NOT Clear Cookies

```typescript
// WRONG: Clearing cookies on 429 forces re-auth, causing MORE requests
if (error?.status === 429) {
  await supabase.auth.signOut()  // NO! This makes it WORSE
}

// RIGHT: Redirect with rate_limited flag, show cooldown timer
if (error?.status === 429) {
  const url = new URL('/login', request.url)
  url.searchParams.set('rate_limited', '1')
  return NextResponse.redirect(url)
}
```

### Preventing Rate Limits

```
1. Check public routes BEFORE calling getUser() -- zero API calls for public pages
2. Cache auth verification (30s cookie) -- reduces getUser() calls by 90%+
3. Never create multiple Supabase clients per request
4. Debounce login/signup buttons
5. Use getSession() for non-critical UI state (no API call)
6. Set up custom SMTP to increase email limits
```

### Configuring Rate Limits

```bash
# Via Management API
curl -X PATCH "https://api.supabase.com/v1/projects/<ref>/config/auth" \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit_email_sent": 10,
    "rate_limit_otp": 60,
    "rate_limit_token_refresh": 3600
  }'
```

Or via Dashboard > Authentication > Rate Limits.

### Exponential Backoff Utility

```typescript
async function withRetry<T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 3
): Promise<{ data: T | null; error: any }> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await fn()

    if (result.error?.status !== 429) return result
    if (attempt === maxRetries) return result

    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return { data: null, error: new Error('Max retries exceeded') }
}
```

---

## 14. Error Code Reference

### Quick Reference Table

| Code | HTTP | Meaning | Fix |
|------|------|---------|-----|
| `bad_jwt` | 401 | Invalid JWT | Check token is access_token not API key |
| `bad_code_verifier` | 403 | PKCE mismatch | Same browser required; use OTP instead |
| `email_not_confirmed` | 403 | Email unverified | Resend confirmation email |
| `flow_state_expired` | 403 | PKCE code expired | Restart auth flow (5min window) |
| `flow_state_not_found` | 403 | PKCE state missing | Link was already used or state cleared |
| `invalid_credentials` | 401 | Wrong email/password | Same error for non-existent user (anti-enumeration) |
| `otp_expired` | 403 | OTP/magic link expired | Request new OTP |
| `over_email_send_rate_limit` | 429 | Too many emails | Wait; use custom SMTP for higher limits |
| `over_request_rate_limit` | 429 | IP rate limited | Exponential backoff; check for loops |
| `refresh_token_already_used` | 403 | Token reuse outside 10s | Session revoked; user must re-login |
| `session_expired` | 403 | Session ended | Re-authenticate; check timeout settings |
| `session_not_found` | 404 | Session deleted | Re-authenticate |
| `user_banned` | 403 | User banned | Admin: `updateUserById(id, { ban_duration: 'none' })` |
| `email_exists` | 422 | Duplicate email | Direct to login or password recovery |
| `signup_disabled` | 422 | Signups turned off | Enable in Dashboard > Auth Settings |
| `weak_password` | 422 | Password too weak | Check dashboard password policy |
| `captcha_failed` | 422 | CAPTCHA verification failed | Verify CAPTCHA provider config |
| `saml_idp_not_found` | 422 | SSO domain not registered | Register with `supabase sso add` |
| `unexpected_failure` | 500 | Server error | Check Supabase status page; report to support |

### Error Handling Pattern

```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

if (error) {
  // ALWAYS use error.code, NEVER string-match on error.message
  switch (error.code) {
    case 'invalid_credentials':
      return { error: 'Invalid email or password' }
    case 'email_not_confirmed':
      return { error: 'Please verify your email first' }
    case 'over_request_rate_limit':
      return { error: 'Too many attempts. Please wait a few minutes.' }
    case 'user_banned':
      return { error: 'Your account has been suspended' }
    default:
      console.error('Auth error:', error.code, error.message, error.status)
      return { error: 'Authentication failed. Please try again.' }
  }
}
```

---

## 15. Diagnostic Queries & Tools

### SQL Queries (Run in Supabase SQL Editor)

```sql
-- View user details including metadata
SELECT
  id,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  confirmed_at,
  email_confirmed_at,
  banned_until,
  last_sign_in_at
FROM auth.users
WHERE email = 'user@example.com';

-- View active sessions for a user
SELECT
  s.id,
  s.created_at,
  s.updated_at,
  s.refreshed_at,
  s.not_after,
  s.user_agent,
  s.ip
FROM auth.sessions s
WHERE s.user_id = 'USER-UUID'
ORDER BY s.created_at DESC;

-- Check refresh token history (detect race conditions)
SELECT
  rt.token,
  rt.revoked,
  rt.created_at,
  rt.updated_at,
  rt.parent,
  rt.session_id
FROM auth.refresh_tokens rt
WHERE rt.session_id = 'SESSION-UUID'
ORDER BY rt.created_at DESC
LIMIT 10;

-- Find recently revoked tokens (indicates token reuse/theft)
SELECT
  rt.session_id,
  rt.revoked,
  rt.created_at,
  s.user_id,
  u.email
FROM auth.refresh_tokens rt
JOIN auth.sessions s ON s.id = rt.session_id
JOIN auth.users u ON u.id = s.user_id
WHERE rt.revoked = true
ORDER BY rt.created_at DESC
LIMIT 20;

-- Check PKCE flow states (debug magic link issues)
SELECT
  id,
  auth_code,
  code_challenge_method,
  created_at,
  authentication_method
FROM auth.flow_state
ORDER BY created_at DESC
LIMIT 10;

-- Check pending approval users
SELECT
  p.user_id,
  p.email,
  p.status,
  p.created_at,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.status = 'pending'
ORDER BY p.created_at ASC;

-- View auth hook execution (check for errors)
SELECT
  id,
  hook_name,
  run_at,
  duration_ms,
  status,
  error
FROM auth.audit_log_entries
WHERE payload->>'action' LIKE '%hook%'
ORDER BY created_at DESC
LIMIT 20;
```

### Browser Console Debugging

```javascript
// Check all Supabase cookies
document.cookie.split(';').forEach(c => {
  const name = c.trim().split('=')[0]
  if (name.startsWith('sb-') || name === 'aiden-auth-ts') {
    console.log(c.trim())
  }
})

// Decode current JWT (without verification)
const cookies = document.cookie.split(';')
const authCookie = cookies.find(c => c.trim().startsWith('sb-') && c.includes('auth-token'))
if (authCookie) {
  const value = decodeURIComponent(authCookie.split('=').slice(1).join('='))
  try {
    const parsed = JSON.parse(value)
    const jwt = parsed.access_token || value
    const payload = JSON.parse(atob(jwt.split('.')[1]))
    console.log('JWT payload:', payload)
    console.log('Expires:', new Date(payload.exp * 1000))
    console.log('Issued:', new Date(payload.iat * 1000))
    console.log('User ID:', payload.sub)
    console.log('App metadata:', payload.app_metadata)
  } catch (e) {
    console.log('Could not parse cookie:', e)
  }
}

// Monitor auth state changes in real-time
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  console.log(`[AUTH ${new Date().toISOString()}]`, event, {
    userId: session?.user?.id,
    expiresAt: session?.expires_at,
    approved: session?.user?.app_metadata?.is_approved,
  })
})
```

### Network Tab Checks

```
Look for these endpoints in DevTools > Network:

POST /auth/v1/token?grant_type=password      -- Login
POST /auth/v1/token?grant_type=refresh_token  -- Token refresh
POST /auth/v1/otp                             -- Magic link / OTP request
GET  /auth/v1/user                            -- getUser() verification
POST /auth/v1/logout                          -- Sign out
GET  /auth/v1/callback                        -- PKCE code exchange

Check:
- Status codes (200, 401, 403, 429)
- Response body error codes
- Request frequency (too many = rate limit risk)
- Cookie headers (Set-Cookie with correct domain)
```

### Supabase Dashboard Checks

```
Authentication > Users:     Is the user created? Confirmed? Banned?
Authentication > Logs:      Filter by error level, look for patterns
Authentication > Hooks:     Is the custom access token hook enabled?
Authentication > URL Config: Are all redirect URLs listed?
Authentication > Rate Limits: Current settings
Authentication > Email Templates: Custom template syntax errors?
Logs > Auth:                Raw auth server logs with error details
```

---

## Quick Fix Recipes

### Recipe: Fix "user can log in but gets redirected back to login"

```bash
# 1. Check if cookies have the correct domain
# Browser > DevTools > Application > Cookies
# Look for sb-*-auth-token cookies
# Domain should be .parentdomain.com (not hostname.parentdomain.com)

# 2. Check middleware is returning supabaseResponse, not NextResponse.next()

# 3. Check middleware matcher isn't excluding the page

# 4. Check for cookie conflicts (duplicate cookies with different domains)
```

### Recipe: Fix cross-subdomain auth not working

```bash
# 1. Verify ALL apps use same COOKIE_DOMAIN
# 2. Check for host-only cookies conflicting with domain cookies
# 3. Ensure redirect URLs include all subdomains in Dashboard
# 4. Test: log in on hub, visit spoke, check cookies in DevTools
```

### Recipe: Fix magic link "expired" on first click

```bash
# 1. Check if enterprise email scanner is consuming the link
# 2. Switch to token_hash verification route
# 3. Or switch to 6-digit OTP codes
```

### Recipe: Fix random logouts

```bash
# 1. Check for multiple Supabase client instances
# 2. Check middleware passes cookies to both request AND response
# 3. Check for refresh token race conditions in logs
# 4. Look for 'refresh_token_already_used' errors in auth logs
```

---

---

## 16. Gateway JWT Cookie SSO (Custom Cross-Subdomain Auth)

When Supabase's native cookie-based SSO across subdomains is too slow (due to `getUser()` network calls on every request), a **custom Gateway JWT** layer eliminates latency by verifying tokens locally.

### Architecture: Gateway JWT Proxy

```
                        ┌─────────────────────────┐
                        │   AIDEN Gateway          │
                        │   www.aiden.services     │
                        │                          │
                        │   - Supabase Auth owner  │
                        │   - Signs aiden-gw JWT   │
                        │   - /api/auth/session    │
                        │   - /auth/logout         │
                        └────────────┬────────────┘
                                     │
                          aiden-gw cookie
                         (.aiden.services)
                                     │
              ┌──────────┬───────────┼───────────┬──────────┐
              │          │           │           │          │
         Creative    Pressure    Studio V2    Chat      (Future
          Agent       Test       (Pitch)    (Unified)    Apps)
```

**Key principle**: Only the Gateway touches Supabase Auth (`getUser()`). All other apps verify a Gateway-signed JWT locally in ~2ms.

### 3-Tier Auth Flow (Middleware Cascade)

Every protected request goes through this cascade:

```
Request arrives
    │
    ├─ Tier 1: Verify aiden-gw JWT locally (~2ms)
    │   └─ Uses JWT_SECRET (HS256) — NO network call
    │   └─ If valid → pass through, set request headers
    │
    ├─ Tier 2: Refresh from Gateway
    │   └─ POST www.aiden.services/api/auth/session
    │   └─ Forwards sb-* cookies from request
    │   └─ Gateway returns { user, jwt, cookies }
    │   └─ Sets fresh aiden-gw cookie (30min)
    │
    ├─ Tier 3: Direct Supabase getUser() (safety net)
    │   └─ Uses sb-* cookies directly
    │   └─ TEMPORARY fallback — remove after stable
    │
    └─ All failed → Redirect to Gateway login
        └─ ${GATEWAY_URL}/login?next=${encodeURIComponent(currentUrl)}
```

### aiden-gw Cookie Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Name | `aiden-gw` | Custom name, not `sb-*` |
| Domain | `.aiden.services` | Leading dot covers all subdomains |
| HttpOnly | `true` | Cannot be read by JavaScript |
| Secure | `true` (prod) | HTTPS only in production |
| SameSite | `lax` | Sent on top-level navigations |
| MaxAge | 1800 (30 min) | Short-lived, forces periodic Gateway refresh |
| Signed by | Gateway only | HS256 with shared `JWT_SECRET` |

### JWT Claims

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iss": "aiden-gateway",
  "iat": 1700000000,
  "exp": 1700001800
}
```

### gateway-jwt.ts: Local JWT Verification (Next.js Spoke App)

This is the ~24-line file each spoke app uses to verify the Gateway JWT locally without any network call:

```typescript
import { jwtVerify, type JWTPayload } from 'jose'

export const GW_COOKIE_NAME = 'aiden-gw'

export interface GatewayJWTPayload extends JWTPayload {
  sub: string
  email: string
  iss: string
}

export async function verifyGatewayJWT(token: string): Promise<GatewayJWTPayload | null> {
  const secret = process.env.JWT_SECRET
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: 'aiden-gateway',
    })
    if (!payload.sub || !payload.email) return null
    return payload as GatewayJWTPayload
  } catch {
    return null
  }
}
```

**Key details**:
- Uses the `jose` library (not `jsonwebtoken`) because `jose` works in Edge Runtime / middleware
- `issuer: 'aiden-gateway'` ensures tokens from other issuers are rejected
- Returns `null` on any failure (expired, bad signature, missing claims)
- `JWT_SECRET` env var must be identical across all apps

### autoRefreshToken: false Pattern

When using a Gateway JWT proxy, the browser Supabase client should NOT auto-refresh tokens, because:
1. The Gateway manages session freshness, not the spoke app
2. Auto-refresh causes unnecessary Supabase API calls
3. It can create race conditions with the Gateway JWT cookie

```typescript
// Browser client in spoke apps
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false, // Gateway handles session freshness
      },
      cookieOptions: {
        domain: '.aiden.services',
        path: '/',
        sameSite: 'lax',
        secure: true,
      },
    }
  )
}
```

### Vite SPA Flow (No Middleware)

For Vite/React SPAs that cannot run server middleware:

```typescript
// On app mount, check session with Gateway
async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch(`${GATEWAY_URL}/api/auth/session`, {
      method: 'POST',
      credentials: 'include', // Sends aiden-gw + sb-* cookies
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.user
  } catch {
    return null
  }
}

// If no session, redirect to Gateway login
function redirectToLogin() {
  const currentUrl = window.location.href
  window.location.href = `${GATEWAY_URL}/login?next=${encodeURIComponent(currentUrl)}`
}
```

### Debugging Gateway JWT SSO Issues

#### Cookie not sent to spoke app

```
SYMPTOM: Tier 1 always fails, falls through to Tier 2 or 3
```

**Checklist:**
```
[ ] Cookie domain is '.aiden.services' (with leading dot)
[ ] Spoke app is on a subdomain of aiden.services (e.g., creative.aiden.services)
[ ] Cookie was set with SameSite=lax (not strict)
[ ] Cookie was set with Secure=true AND page is served over HTTPS
[ ] No duplicate cookies exist (check DevTools > Application > Cookies)
[ ] Gateway URL uses 'www.aiden.services' (not bare 'aiden.services')
```

#### JWT verification fails

```
SYMPTOM: verifyGatewayJWT returns null even though cookie is present
```

**Checklist:**
```
[ ] JWT_SECRET env var is set AND identical across Gateway + all spoke apps
[ ] JWT has not expired (30min MaxAge) -- decode and check 'exp' claim
[ ] Issuer matches: token 'iss' claim must be 'aiden-gateway'
[ ] jose library is installed: npm ls jose
[ ] Token is not malformed (decode in browser): atob(token.split('.')[1])
```

#### Token expired but Gateway session is valid

```
SYMPTOM: User sees brief redirect to login, then comes back authenticated
```

This is expected behavior when the 30-minute `aiden-gw` cookie expires but the underlying Supabase session is still valid. The middleware falls through to Tier 2 (Gateway session refresh), which re-issues a fresh `aiden-gw` cookie.

**To reduce frequency**: Increase MaxAge from 1800 to 3600 (1 hour), but this increases the window where a revoked user can still access spoke apps.

#### Domain mismatch in development

```
SYMPTOM: Works in production but not locally
```

In development, cookies cannot use `.localhost`. Either:
1. Set cookie domain to `undefined` (no domain restriction)
2. Use `/etc/hosts` aliases: `127.0.0.1 creative.local.test`

```typescript
const COOKIE_DOMAIN = process.env.NODE_ENV === 'production'
  ? '.aiden.services'
  : undefined
```

#### CORS with credentials failing

```
SYMPTOM: Gateway session refresh (Tier 2) fails with CORS error
```

The Gateway's CORS must explicitly allow the spoke app's origin AND `credentials: true`:

```typescript
// Gateway CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://creative.aiden.services",
        "https://chat.aiden.services",
        "https://pitch.aiden.services",
    ],
    allow_credentials=True,  # Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Never use `allow_origins=["*"]` with `allow_credentials=True`** -- browsers reject this combination.

### Gateway JWT vs Supabase Auth -- When to Use Which

| Approach | Use When | Latency | Network Calls |
|----------|----------|---------|---------------|
| Gateway JWT (aiden-gw) | Multi-app SSO across subdomains | ~2ms | 0 (local verify) |
| Supabase getUser() | Single app, or Gateway itself | ~200ms | 1 per request |
| Supabase session cookies | Single app, no cross-subdomain needs | ~200ms | 1 per request |

### Diagnostic: Decode aiden-gw Cookie

```javascript
// Browser console on any subdomain
const gw = document.cookie.split(';').find(c => c.trim().startsWith('aiden-gw='))
if (gw) {
  // Note: HttpOnly cookies won't appear in document.cookie
  // Use DevTools > Application > Cookies instead
  console.log('aiden-gw cookie found (but HttpOnly -- check DevTools)')
} else {
  console.log('No aiden-gw cookie visible (expected if HttpOnly)')
}

// In DevTools > Application > Cookies, find 'aiden-gw' and copy the value, then:
// Paste the JWT value and decode it:
const jwt = 'PASTE_JWT_HERE'
const payload = JSON.parse(atob(jwt.split('.')[1]))
console.log('Claims:', payload)
console.log('Expires:', new Date(payload.exp * 1000))
console.log('Issued:', new Date(payload.iat * 1000))
console.log('User:', payload.sub, payload.email)
console.log('Issuer:', payload.iss) // Should be 'aiden-gateway'
```

---

**Version**: 1.1
**Last Updated**: February 2026
**Covers**: @supabase/ssr 0.6+, @supabase/supabase-js 2.x, Next.js 14/15 App Router, jose JWT library, Gateway JWT SSO
