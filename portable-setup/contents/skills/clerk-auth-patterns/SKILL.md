---
name: clerk-auth-patterns
description: Clerk authentication patterns for user management in React and Next.js applications; use when implementing authentication, user profiles, and organizations
---

# Clerk Auth Patterns

Complete authentication and user management for Next.js and React applications.

## When to Use This Skill

Use when:
- Adding authentication to Next.js/React apps
- Need pre-built auth UI components
- User management without backend code
- Multi-tenant/organization features
- Social login and passwordless auth

## Installation

```bash
npm install @clerk/nextjs
```

## Environment Setup

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Provider Setup

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## Middleware (Route Protection)

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/api/protected(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes - require specific role
  if (isAdminRoute(req)) {
    await auth.protect({ role: 'org:admin' });
  }

  // Protect dashboard routes - require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## Authentication Components

### Sign In / Sign Up Pages

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

```tsx
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

### User Button

```tsx
import { UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
```

### Signed In/Out Conditional

```tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export function AuthButton() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
```

## Hooks

### useUser Hook

```tsx
'use client';

import { useUser } from '@clerk/nextjs';

export function Profile() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;

  return (
    <div>
      <img src={user.imageUrl} alt={user.fullName || ''} />
      <h1>{user.fullName}</h1>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
      <p>Member since: {user.createdAt?.toLocaleDateString()}</p>
    </div>
  );
}
```

### useAuth Hook

```tsx
'use client';

import { useAuth } from '@clerk/nextjs';

export function Dashboard() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth();

  const fetchData = async () => {
    const token = await getToken();
    const response = await fetch('/api/data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Sign in to view dashboard</div>;

  return (
    <div>
      <p>User ID: {userId}</p>
      <p>Session ID: {sessionId}</p>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### useClerk Hook

```tsx
'use client';

import { useClerk } from '@clerk/nextjs';

export function SignOutButton() {
  const { signOut, openSignIn, openUserProfile } = useClerk();

  return (
    <div>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => openSignIn()}>Sign In Modal</button>
      <button onClick={() => openUserProfile()}>Profile Modal</button>
    </div>
  );
}
```

## Server-Side Authentication

### In Server Components

```tsx
// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

### In API Routes

```typescript
// app/api/user/route.ts
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();

  return NextResponse.json({
    id: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    name: user?.fullName,
  });
}
```

## User Metadata

### Public Metadata (Readable by client)

```typescript
// Server-side: Update metadata
import { clerkClient } from '@clerk/nextjs/server';

await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    plan: 'pro',
    features: ['feature1', 'feature2'],
  },
});
```

```tsx
// Client-side: Read metadata
const { user } = useUser();
const plan = user?.publicMetadata?.plan as string;
```

### Private Metadata (Server-only)

```typescript
await clerkClient.users.updateUserMetadata(userId, {
  privateMetadata: {
    stripeCustomerId: 'cus_xxx',
    internalNotes: 'VIP customer',
  },
});
```

## Organizations

### Create Organization

```tsx
import { CreateOrganization } from '@clerk/nextjs';

export function CreateOrgPage() {
  return <CreateOrganization afterCreateOrganizationUrl="/dashboard" />;
}
```

### Organization Switcher

```tsx
import { OrganizationSwitcher } from '@clerk/nextjs';

export function Header() {
  return (
    <header>
      <OrganizationSwitcher
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
      />
    </header>
  );
}
```

### Check Organization Role

```typescript
// middleware.ts
export default clerkMiddleware(async (auth, req) => {
  const { userId, orgRole } = await auth();

  if (isAdminRoute(req)) {
    if (orgRole !== 'org:admin') {
      return new Response('Forbidden', { status: 403 });
    }
  }
});
```

```tsx
// In component
import { useOrganization } from '@clerk/nextjs';

export function AdminPanel() {
  const { membership } = useOrganization();

  if (membership?.role !== 'org:admin') {
    return <div>Admin access required</div>;
  }

  return <div>Admin Panel</div>;
}
```

## Webhooks

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error('Missing webhook secret');

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    }) as WebhookEvent;
  } catch (err) {
    return new Response('Error verifying webhook', { status: 400 });
  }

  switch (evt.type) {
    case 'user.created':
      await createUserInDatabase(evt.data);
      break;
    case 'user.updated':
      await updateUserInDatabase(evt.data);
      break;
    case 'user.deleted':
      await deleteUserFromDatabase(evt.data.id!);
      break;
  }

  return new Response('Webhook processed', { status: 200 });
}
```

## Customization

### Appearance

```tsx
<ClerkProvider
  appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#1f2937',
      colorText: '#f9fafb',
    },
    elements: {
      formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
      card: 'shadow-xl',
    },
  }}
>
```

### Localization

```tsx
<ClerkProvider localization={frFR}>
  {children}
</ClerkProvider>
```

## Best Practices

1. **Use middleware for route protection** - More reliable than client-side checks
2. **Sync with database via webhooks** - Keep user data in sync
3. **Use organizations for multi-tenancy** - Built-in role-based access
4. **Store app-specific data in metadata** - Public for client, private for server
5. **Handle loading states** - Always check `isLoaded` before accessing user data

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
