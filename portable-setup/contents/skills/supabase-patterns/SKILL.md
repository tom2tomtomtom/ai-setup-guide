---
name: supabase-patterns
description: Build full-stack apps with Supabase auth, Row Level Security, real-time subscriptions, storage, and edge functions. Use when setting up RLS policies, implementing auth flows, or wiring up real-time data.
---

# Supabase Patterns

Comprehensive guide for building production applications with Supabase, covering authentication patterns, Row Level Security (RLS), real-time subscriptions, storage, edge functions, and advanced database features.

## When to Use This Skill

Use when:
- Building full-stack applications with Supabase
- Implementing complex authentication flows
- Setting up Row Level Security policies
- Working with real-time data subscriptions
- Managing file uploads and storage
- Building serverless edge functions
- Optimizing Supabase queries
- Implementing multi-tenancy
- Setting up role-based access control
- Migrating to Supabase from other platforms

## Authentication Patterns

### Email/Password Auth

**Sign up with metadata:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    data: {
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    emailRedirectTo: 'https://yourapp.com/confirm'
  }
})
```

**Sign in:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
})
```

**Password reset:**
```typescript
// Send reset email
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://yourapp.com/reset-password'
  }
)

// Update password (on reset page)
const { data, error } = await supabase.auth.updateUser({
  password: 'newpassword'
})
```

### OAuth Providers

**Configure providers:**
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback',
    scopes: 'repo user'
  }
})

// Available providers: github, google, gitlab, bitbucket, azure, facebook, discord, twitter, slack, spotify
```

**Handle callback:**
```typescript
// app/auth/callback/route.ts (Next.js)
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Handle forwarded host for production load balancers
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

### Magic Link Auth

**Send magic link:**
```typescript
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://yourapp.com/auth/confirm',
    data: {
      full_name: 'John Doe'
    }
  }
})
```

**Phone OTP:**
```typescript
// Send OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
})

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
})
```

### Session Management

**Get session:**
```typescript
const { data: { session }, error } = await supabase.auth.getSession()
```

**Refresh session:**
```typescript
const { data: { session }, error } = await supabase.auth.refreshSession()
```

**Auth state listener:**
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log(event, session)
    
    if (event === 'SIGNED_IN') {
      // Handle sign in
    }
    if (event === 'SIGNED_OUT') {
      // Handle sign out
    }
    if (event === 'TOKEN_REFRESHED') {
      // Handle token refresh
    }
  }
)

// Cleanup
subscription.unsubscribe()
```

**Sign out:**
```typescript
const { error } = await supabase.auth.signOut()
```

### Server-Side Auth with @supabase/ssr (Next.js)

**Install packages:**
```bash
npm install @supabase/ssr @supabase/supabase-js

# If migrating from auth-helpers:
npm uninstall @supabase/auth-helpers-nextjs
```

**Create server client utility:**
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component - can be ignored
            // if you have middleware refreshing user sessions
          }
        },
      },
    }
  )
}
```

**Create browser client utility:**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Middleware for session refresh:**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getUser() to validate JWT (not getSession which is unvalidated)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect routes
  if (!user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
```

**Server Component:**
```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()

  // Use getUser() - it validates the JWT
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <div>Welcome {profile.full_name}</div>
}
```

**Route Handler:**
```typescript
// app/api/profile/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Use getUser() - validates JWT on server
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json(data)
}
```

**Server Actions:**
```typescript
// app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
```

**Client Component:**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return <button onClick={handleSignOut}>Sign Out</button>
}
```

## Row Level Security (RLS)

### Enable RLS

```sql
-- Enable RLS on table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Disable RLS (not recommended in production)
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
```

### Basic Policies

**Public read, authenticated write:**
```sql
-- Anyone can read
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

**Private by default:**
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR ALL
USING (auth.uid() = id);
```

### Advanced RLS Patterns

**Role-based access:**
```sql
-- Create enum for roles
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');

-- Add role to profiles
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'user';

-- Admins can see everything
CREATE POLICY "Admins can view all posts"
ON posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Moderators can update any post
CREATE POLICY "Moderators can update posts"
ON posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('moderator', 'admin')
  )
);
```

**Team/Organization access:**
```sql
-- Schema
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

CREATE TABLE organization_members (
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL,
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL
);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can view projects in their organizations
CREATE POLICY "Organization members can view projects"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = projects.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

-- Only admins can create projects
CREATE POLICY "Organization admins can create projects"
ON projects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = projects.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'admin'
  )
);
```

**Time-based access:**
```sql
-- Published posts are public, drafts are private
CREATE POLICY "Published posts are public"
ON posts FOR SELECT
USING (
  published_at IS NOT NULL 
  AND published_at <= NOW()
);

CREATE POLICY "Authors can view own drafts"
ON posts FOR SELECT
USING (
  auth.uid() = user_id 
  AND (published_at IS NULL OR published_at > NOW())
);
```

**Attribute-based access:**
```sql
-- Users can access premium content if they have subscription
CREATE POLICY "Premium content for subscribers"
ON content FOR SELECT
USING (
  is_premium = false
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND subscription_status = 'active'
    AND subscription_expires_at > NOW()
  )
);
```

### RLS with JOINs

**Secure multi-table queries:**
```sql
-- Ensure RLS on all related tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments inherit post visibility
CREATE POLICY "Comments visible if post visible"
ON comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = comments.post_id
    -- Post RLS policies apply here automatically
  )
);
```

### Security Definer Functions

**Bypass RLS for specific operations:**
```sql
-- Function runs with definer's permissions (bypass RLS)
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION increment_view_count TO authenticated;
```

## Real-Time Subscriptions

### Basic Subscriptions

**Subscribe to table changes:**
```typescript
const channel = supabase
  .channel('posts')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, or *
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// Cleanup
channel.unsubscribe()
```

**Filter by column:**
```typescript
const channel = supabase
  .channel('user-posts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New post!', payload.new)
    }
  )
  .subscribe()
```

### React Integration

**useEffect subscription:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RealtimePosts() {
  const [posts, setPosts] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      setPosts(data || [])
    }

    fetchPosts()

    // Subscribe to changes
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts((current) => [payload.new, ...current])
          }
          if (payload.eventType === 'UPDATE') {
            setPosts((current) =>
              current.map((post) =>
                post.id === payload.new.id ? payload.new : post
              )
            )
          }
          if (payload.eventType === 'DELETE') {
            setPosts((current) =>
              current.filter((post) => post.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Presence (Online Users)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('room1')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.values(state).flat()
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: 'user123',
            online_at: new Date().toISOString()
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return (
    <div>
      <h3>Online Users ({onlineUsers.length})</h3>
      <ul>
        {onlineUsers.map((user, index) => (
          <li key={index}>{user.user_id}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Broadcast (Send Messages)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('chat-room')

    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages((current) => [...current, payload])
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  const sendMessage = async () => {
    const channel = supabase.channel('chat-room')
    
    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        text: input,
        user_id: 'user123',
        created_at: new Date().toISOString()
      }
    })

    setInput('')
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
    </div>
  )
}
```

## Storage

### File Upload

**Basic upload:**
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: false
  })
```

**Upload with progress:**
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    onUploadProgress: (progress) => {
      console.log(`${progress.loaded} / ${progress.total}`)
    }
  })
```

**Multi-part upload (large files):**
```typescript
// For files > 6MB
const file = event.target.files[0]
const { data, error } = await supabase.storage
  .from('videos')
  .upload(`${userId}/video.mp4`, file, {
    cacheControl: '3600',
    upsert: false,
    // Automatically uses multi-part for large files
  })
```

### File Download

**Get public URL:**
```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user/avatar.png')

console.log(data.publicUrl)
```

**Download file:**
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download('user/avatar.png')

// Create object URL
const url = URL.createObjectURL(data)
```

**Create signed URL (temporary access):**
```typescript
const { data, error } = await supabase.storage
  .from('private-files')
  .createSignedUrl('file.pdf', 60) // 60 seconds

console.log(data.signedUrl)
```

### Storage RLS

**Bucket policies:**
```sql
-- Enable RLS on storage buckets
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### Image Transformations

**Resize images:**
```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('avatar.png', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover' // contain, cover, fill
    }
  })
```

**Format conversion:**
```typescript
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.png', {
    transform: {
      format: 'webp',
      quality: 80
    }
  })
```

## Edge Functions

### Basic Edge Function

**Create function:**
```typescript
// supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { name } = await req.json()
  
  return new Response(
    JSON.stringify({ message: `Hello ${name}!` }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
})
```

**Deploy:**
```bash
supabase functions deploy hello
```

**Invoke from client:**
```typescript
const { data, error } = await supabase.functions.invoke('hello', {
  body: { name: 'World' }
})

console.log(data) // { message: "Hello World!" }
```

### Authenticated Edge Function

```typescript
// supabase/functions/protected/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Get auth token from header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401 }
    )
  }

  // Create Supabase client with user's token
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader }
      }
    }
  )

  // Verify user
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401 }
    )
  }

  // Your protected logic here
  return new Response(
    JSON.stringify({ user_id: user.id, message: 'Success' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### Database Operations in Edge Functions

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use service role for full access
  )

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(10)

  return new Response(
    JSON.stringify({ posts: data }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### Scheduled Edge Functions (Cron)

```typescript
// supabase/functions/_shared/cron.ts
export async function handleCron() {
  console.log('Cron job running!')
  
  // Your scheduled task
  const supabase = createClient(...)
  await supabase
    .from('posts')
    .delete()
    .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
}

// Call from edge function triggered by external cron service
```

## Advanced Query Patterns

### Optimized Queries

**Select specific columns:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')
```

**Nested selects:**
```typescript
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    author:profiles(id, full_name, avatar_url),
    comments(id, content, created_at)
  `)
```

**Count rows:**
```typescript
const { count } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true })
```

**Aggregations:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('user_id, count:id.count(), avg_views:view_count.avg()')
  .group('user_id')
```

### Filters

**Basic operators:**
```typescript
// Equals
.eq('status', 'published')

// Not equals
.neq('status', 'draft')

// Greater than
.gt('view_count', 100)

// Less than or equal
.lte('created_at', '2024-01-01')

// IN
.in('status', ['published', 'featured'])

// LIKE (pattern matching)
.like('title', '%typescript%')

// ILIKE (case-insensitive)
.ilike('title', '%typescript%')

// IS NULL
.is('deleted_at', null)

// Text search
.textSearch('content', 'postgres & optimization')
```

**Combining filters:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('status', 'published')
  .gt('view_count', 100)
  .order('created_at', { ascending: false })
  .limit(20)
```

**OR filters:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .or('status.eq.published,status.eq.featured')
```

### Pagination

**Offset pagination:**
```typescript
const pageSize = 20
const page = 2

const { data, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range((page - 1) * pageSize, page * pageSize - 1)
```

**Cursor pagination:**
```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .lt('id', lastPostId) // Cursor
  .order('id', { ascending: false })
  .limit(20)
```

### Upsert (Insert or Update)

```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    full_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  })
```

### Transactions

**Using RPC for transactions:**
```sql
-- Create function for atomic operations
CREATE OR REPLACE FUNCTION transfer_points(
  from_user_id UUID,
  to_user_id UUID,
  amount INT
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deduct from sender
  UPDATE profiles
  SET points = points - amount
  WHERE id = from_user_id
  AND points >= amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;

  -- Add to receiver
  UPDATE profiles
  SET points = points + amount
  WHERE id = to_user_id;
END;
$$;
```

```typescript
const { data, error } = await supabase.rpc('transfer_points', {
  from_user_id: 'uuid1',
  to_user_id: 'uuid2',
  amount: 100
})
```

## TypeScript Integration

### Generate types:**
```bash
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
```

**Use types:**
```typescript
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Post = Database['public']['Tables']['posts']['Row']

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Type-safe queries
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .returns<Post[]>()
```

## Production Best Practices

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Server-side only!
```

### Error Handling

```typescript
const { data, error } = await supabase
  .from('posts')
  .select('*')

if (error) {
  // Log error
  console.error('Database error:', error)
  
  // Handle specific errors
  if (error.code === '23505') {
    // Unique constraint violation
    return { error: 'Post already exists' }
  }
  
  // Generic error
  return { error: 'Failed to fetch posts' }
}

return { data }
```

### Rate Limiting

**Implement with Edge Functions:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const limit = 100 // requests per minute
  
  const rateLimit = rateLimitMap.get(ip)
  
  if (rateLimit) {
    if (now < rateLimit.resetAt) {
      if (rateLimit.count >= limit) {
        return new Response('Rate limit exceeded', { status: 429 })
      }
      rateLimit.count++
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 })
  }
  
  // Process request
  return new Response('OK')
})
```

### Database Backups

```bash
# Manual backup
supabase db dump -f backup.sql

# Restore
supabase db reset --db-url "postgresql://..."
```

### Monitoring

**Log queries:**
```typescript
const supabase = createClient(url, key, {
  auth: {
    persistSession: true
  },
  global: {
    fetch: (url, options) => {
      console.log('Supabase request:', url)
      return fetch(url, options)
    }
  }
})
```

## Testing

### Unit Tests

```typescript
import { createClient } from '@supabase/supabase-js'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [{ id: 1, title: 'Test Post' }],
          error: null
        }))
      }))
    }))
  }))
}))

test('fetches posts', async () => {
  const supabase = createClient('url', 'key')
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', 1)
  
  expect(data).toHaveLength(1)
  expect(data[0].title).toBe('Test Post')
})
```

### Integration Tests

```typescript
import { createClient } from '@supabase/supabase-js'

// Use test database
const supabase = createClient(
  process.env.TEST_SUPABASE_URL!,
  process.env.TEST_SUPABASE_ANON_KEY!
)

beforeEach(async () => {
  // Clean up test data
  await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
})

test('creates and retrieves post', async () => {
  const { data: created } = await supabase
    .from('posts')
    .insert({ title: 'Test', content: 'Content' })
    .select()
    .single()
  
  const { data: retrieved } = await supabase
    .from('posts')
    .select('*')
    .eq('id', created.id)
    .single()
  
  expect(retrieved.title).toBe('Test')
})
```

## Migration Patterns

### From Firebase

**Auth migration:**
```typescript
// Import Firebase users
const { data, error } = await supabase.auth.admin.createUser({
  email: firebaseUser.email,
  email_confirm: true,
  user_metadata: {
    firebase_uid: firebaseUser.uid
  }
})
```

**Firestore to Postgres:**
```typescript
// Batch migration script
const firestore = admin.firestore()
const snapshot = await firestore.collection('posts').get()

const posts = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
  created_at: doc.data().createdAt.toDate()
}))

const { error } = await supabase
  .from('posts')
  .insert(posts)
```

## Quick Reference

### Auth Methods
```typescript
// Sign up
supabase.auth.signUp({ email, password })

// Sign in
supabase.auth.signInWithPassword({ email, password })

// OAuth
supabase.auth.signInWithOAuth({ provider: 'github' })

// Magic link
supabase.auth.signInWithOtp({ email })

// Get session
supabase.auth.getSession()

// Sign out
supabase.auth.signOut()
```

### Database Queries
```typescript
// Select
.from('table').select('*')

// Insert
.from('table').insert({ data })

// Update
.from('table').update({ data }).eq('id', id)

// Delete
.from('table').delete().eq('id', id)

// Upsert
.from('table').upsert({ data })
```

### Storage Operations
```typescript
// Upload
.storage.from('bucket').upload(path, file)

// Download
.storage.from('bucket').download(path)

// Get URL
.storage.from('bucket').getPublicUrl(path)

// Delete
.storage.from('bucket').remove([path])
```

### Real-time
```typescript
// Subscribe
supabase.channel('name')
  .on('postgres_changes', { ... }, callback)
  .subscribe()

// Presence
channel.track({ user_id })

// Broadcast
channel.send({ type: 'broadcast', event, payload })
```