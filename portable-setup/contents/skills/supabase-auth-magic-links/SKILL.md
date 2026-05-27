---
name: supabase-auth-magic-links
description: "Supabase authentication with magic links for invite-only, approval-based applications. Use when: (1) Building passwordless auth systems, (2) Implementing approval workflows, (3) Creating invite-only applications, (4) Need Row Level Security with user status management"
---

# Supabase Auth with Magic Links & Approval Workflows

## Overview

Implement passwordless authentication using Supabase Auth magic links with three-tier approval system: INVITED → PENDING → APPROVED. Includes admin invite flow, Row Level Security policies, and middleware protection.

## Decision Tree

### Use Magic Links When:
- Building invite-only applications
- Eliminating password management liability
- Need approval before access
- Want instant authentication experience

### Use Traditional Auth When:
- Users prefer passwords
- Need offline authentication
- Regulatory requirements for password complexity

### Use OAuth When:
- Want social login options
- Need identity provider integration
- Have enterprise SSO requirements

## Core Architecture

### Three-Tier Access Model
```
INVITED  → Magic link sent to email
  ↓
PENDING  → Authenticated, awaiting admin approval
  ↓
APPROVED → Full access granted
```

### Database Schema

```sql
-- User profiles with approval status
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  invited_at timestamptz default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users,
  user_metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Invitations tracking
create table public.invitations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  invited_by uuid references auth.users not null,
  status text check (status in ('sent', 'accepted', 'expired')) default 'sent',
  expires_at timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- Admin roles
create table public.admin_roles (
  user_id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'super_admin')) not null,
  granted_at timestamptz default now(),
  granted_by uuid references auth.users
);

-- Indexes for RLS performance
create index profiles_user_id_idx on public.profiles (id);
create index profiles_status_idx on public.profiles (status);
create index admin_roles_user_id_idx on public.admin_roles (user_id);
create index invitations_email_idx on public.invitations (email);
```

## Workflow: Client-Side Magic Link Request

```typescript
// components/auth/MagicLinkLogin.tsx
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false, // Only invited users
      },
    })

    if (error) {
      if (error.message.includes('User not found')) {
        alert('Email not invited. Contact administrator.')
      } else {
        alert(error.message)
      }
    } else {
      alert('Check your email for the magic link')
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleMagicLink}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  )
}
```

## Workflow: Admin Invite System

```typescript
// app/api/admin/invite/route.ts
import { createClient } from '@supabase/supabase-js'

// Service role client (server-side only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  const { email, invitedBy, metadata } = await request.json()

  // 1. Create user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: false,
    user_metadata: { invited_by: invitedBy, ...metadata }
  })
  if (authError) throw authError

  // 2. Create profile
  await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      status: 'pending',
      user_metadata: metadata
    })

  // 3. Record invitation
  await supabaseAdmin
    .from('invitations')
    .insert({ email, invited_by: invitedBy, status: 'sent' })

  // 4. Generate magic link
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })

  // 5. Send email (your email service)
  await sendInvitationEmail({
    to: email,
    magicLink: linkData.properties.action_link,
    invitedBy
  })

  return Response.json({ success: true, userId: authData.user.id })
}
```

## Row Level Security Policies

```sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.admin_roles enable row level security;

-- Users view own profile
create policy "Users can view own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- Approved users view other approved profiles
create policy "Approved users view approved profiles"
on public.profiles for select
to authenticated
using (
  status = 'approved' 
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'approved'
  )
);

-- Users update own metadata (not status)
create policy "Users update own metadata"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id 
  and status = (select status from public.profiles where id = auth.uid())
);

-- Admins manage user status
create policy "Admins manage status"
on public.profiles for update
to authenticated
using (
  exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
  )
)
with check (true);

-- Admins manage invitations
create policy "Admins manage invitations"
on public.invitations for all
to authenticated
using (
  exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
  )
);

-- Super admins manage roles
create policy "Super admins manage roles"
on public.admin_roles for all
to authenticated
using (
  exists (
    select 1 from public.admin_roles
    where user_id = auth.uid() and role = 'super_admin'
  )
)
with check (
  exists (
    select 1 from public.admin_roles
    where user_id = auth.uid() and role = 'super_admin'
  )
);

-- Admins view roles
create policy "Admins view roles"
on public.admin_roles for select
to authenticated
using (
  exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
  )
);
```

## RLS Performance Optimization

```sql
-- Security definer function for admin check
create function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from admin_roles
    where user_id = auth.uid()
  );
end;
$$;

-- Use in policies to avoid RLS penalty
create policy "Admins approve users (optimized)"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

## Auth Callback Handler

```typescript
// app/auth/callback/route.ts (Next.js App Router)
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
    }

    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', session.user.id)
        .single()

      // Route based on status
      if (profile?.status === 'pending') {
        return NextResponse.redirect(`${requestUrl.origin}/auth/pending-approval`)
      }
      if (profile?.status === 'approved') {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
      if (profile?.status === 'rejected') {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${requestUrl.origin}/auth/rejected`)
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
}
```

## Middleware Protection

```typescript
// middleware.ts (Next.js)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Public routes
  const publicRoutes = ['/auth/login', '/auth/callback', '/auth/pending-approval']
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return response
  }

  // Require authentication
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Check approval status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (profile?.status === 'pending') {
    return NextResponse.redirect(new URL('/auth/pending-approval', request.url))
  }

  if (profile?.status === 'rejected') {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/auth/rejected', request.url))
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminRole) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Admin Approval Action

```typescript
// app/api/admin/approve-user/route.ts
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { userId, action } = await request.json()
  
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!adminRole) return Response.json({ error: 'Forbidden' }, { status: 403 })

  // Update status
  const newStatus = action === 'approve' ? 'approved' : 'rejected'
  
  await supabase
    .from('profiles')
    .update({
      status: newStatus,
      approved_at: action === 'approve' ? new Date().toISOString() : null,
      approved_by: action === 'approve' ? user.id : null
    })
    .eq('id', userId)

  return Response.json({ success: true })
}
```

## Alternative Auth Methods

### Phone-Based Magic Links (SMS OTP)
```typescript
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890',
  options: {
    channel: 'sms', // or 'whatsapp'
  }
})
```

### OAuth (Social Login)
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
})
```

### MFA Enforcement (Row Level Security)
```sql
-- Require MFA for sensitive operations
create policy "Require MFA for admin actions"
on public.sensitive_table
as restrictive
to authenticated
using (
  (select auth.jwt()->>'aal') = 'aal2' -- AAL2 = MFA verified
);
```

## Common Issues

### Issue: Magic Links Not Working Locally
**Solution**: Add redirect URLs to Supabase dashboard:
- Auth > URL Configuration > Redirect URLs
- Add: `http://localhost:3000/auth/callback`
- Production: `https://yourapp.com/auth/callback`

### Issue: "Email rate limit exceeded"
**Solution**: Adjust rate limits in Supabase dashboard (Auth > Rate Limits) or use admin API to generate links and send via your own email service:

```typescript
const { data } = await supabaseAdmin.auth.admin.generateLink({
  type: 'magiclink',
  email: 'user@example.com'
})
// Send via your email service
```

### Issue: RLS Policies Too Slow
**Solution**: Use security definer functions to bypass RLS on helper tables:

```sql
create function check_team_access(team_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from team_members
    where team_id = $1 and user_id = auth.uid()
  );
end;
$$;

-- Use in policy
create policy "Team access"
on documents
to authenticated
using (check_team_access(team_id));
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Server-side only

# App
NEXT_PUBLIC_APP_URL=https://yourapp.com

# Email
RESEND_API_KEY=your-resend-key
```

## Production Checklist

- [ ] Customize email templates (Supabase Dashboard > Auth > Email Templates)
- [ ] Configure rate limits (Dashboard > Auth > Rate Limits)
- [ ] Whitelist redirect URLs (Dashboard > Auth > URL Configuration)
- [ ] Test RLS policies with different user roles
- [ ] Add indexes for all RLS policy lookups
- [ ] Use security definer functions for performance
- [ ] Set up email deliverability (SPF/DKIM)
- [ ] Implement error logging and monitoring
- [ ] Configure alerts for failed auth attempts

## Dependencies

```bash
# Install Supabase clients
npm install @supabase/supabase-js @supabase/ssr

# Generate TypeScript types
supabase gen types typescript --local > lib/database.types.ts
```

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Magic Link Best Practices](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Admin API Reference](https://supabase.com/docs/reference/javascript/auth-admin-api)
