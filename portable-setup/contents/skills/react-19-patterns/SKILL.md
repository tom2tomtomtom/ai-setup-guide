---
name: react-19-patterns
description: Build modern React 19 apps with concurrent rendering, Server Components, Actions, and the use hook. Use when working with Next.js App Router, migrating from React 18, or implementing optimistic UI updates.
---

# React 19 Patterns

Comprehensive guide for React 19 features including concurrent rendering, new hooks, server components, Actions, and modern patterns for building performant applications.

## When to Use This Skill

Use when:
- Building applications with React 19
- Using Next.js App Router with React Server Components
- Implementing concurrent rendering patterns
- Working with the new `use` hook and Actions
- Managing async state transitions
- Optimizing rendering performance
- Migrating from React 18 to React 19
- Understanding server vs client component patterns
- Implementing form handling with Actions

## What's New in React 19

### Major Features

1. **Actions** - Async functions for data mutations
2. **`use` hook** - Read resources (promises, context) in render
3. **`useOptimistic`** - Optimistic UI updates
4. **`useActionState`** - Form state management with Actions
5. **`useFormStatus`** - Access form submission status
6. **Server Components** - Full server-side rendering support
7. **Asset Loading** - Improved preloading and suspense integration
8. **Document Metadata** - Built-in support for `<title>`, `<meta>`
9. **Enhanced Error Handling** - Better error boundaries

### Breaking Changes from React 18

- Refs as props (no more `forwardRef` needed)
- Cleanup functions must be synchronous
- `Context.Provider` → `Context`
- Removed deprecated APIs (string refs, `defaultProps`, etc.)

## Actions

### What are Actions?

Actions are async functions that handle data mutations. React tracks their pending state automatically.

**Basic Action:**
```typescript
async function updateName(formData: FormData) {
  'use server' // In Next.js, marks as server action
  
  const name = formData.get('name')
  await db.user.update({ name })
}

function Form() {
  return (
    <form action={updateName}>
      <input name="name" />
      <button type="submit">Update</button>
    </form>
  )
}
```

### Client-Side Actions

```typescript
'use client'

import { useState, useTransition } from 'react'

function UpdateProfile() {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await fetch('/api/profile', {
        method: 'POST',
        body: formData
      })
    })
  }
  
  return (
    <form action={handleSubmit}>
      <input 
        name="name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

### Server Actions (Next.js)

```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  await db.post.create({
    data: { title, content }
  })
  
  revalidatePath('/posts')
}

export async function deletePost(postId: string) {
  await db.post.delete({
    where: { id: postId }
  })
  
  revalidatePath('/posts')
}
```

```typescript
// app/posts/new/page.tsx
import { createPost } from '@/app/actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

### Actions with `useActionState`

The `useActionState` hook manages form state and provides pending status. It returns `[state, formAction, isPending]`.

**Basic Pattern:**
```typescript
'use client'

import { useActionState } from 'react'

async function updateProfile(
  prevState: { message: string } | null,
  formData: FormData
) {
  const name = formData.get('name') as string

  if (!name) {
    return { message: 'Name is required' }
  }

  await fetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify({ name })
  })

  return { message: 'Profile updated!' }
}

function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <form action={formAction}>
      <input name="name" required />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

**With Error Handling and Redirect:**
```typescript
'use client'

import { useActionState } from 'react'

function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"))
      if (error) {
        return error
      }
      redirect("/path")
      return null
    },
    null,
  )

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

**With Server Functions (Progressive Enhancement):**
```typescript
// requestUsername.js
'use server'

export default async function requestUsername(formData) {
  const username = formData.get('username')
  if (canRequest(username)) {
    return 'successful'
  }
  return 'failed'
}

// UsernameForm.js
'use client'

import { useActionState } from 'react'
import requestUsername from './requestUsername'

function UsernameForm() {
  // Third parameter is permalink for progressive enhancement
  const [state, action] = useActionState(requestUsername, null, 'n/a')

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  )
}
```

**useActionState Hook Reference:**
```typescript
// Signature
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?)

// Parameters:
// - fn: Action function receiving (previousState, formData) => newState
// - initialState: Initial state value (any serializable value)
// - permalink: Optional URL for progressive enhancement

// Returns:
// - state: Current form state (initialState until first invocation)
// - formAction: Action to pass to form's action prop
// - isPending: Boolean indicating if action is processing
```

## The `use` Hook

The `use` hook reads resources (promises or context) during render. Unlike other hooks, it can be called conditionally and in loops.

### Reading Promises

```typescript
import { use, Suspense } from 'react'

async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // Suspends until promise resolves
  const user = use(userPromise)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

function App() {
  const userPromise = fetchUser('123')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}
```

### Server to Client Promise Streaming

Pass promises from Server Components to Client Components for progressive rendering:

```typescript
// ServerComponent.tsx (Server Component)
import Comments from './Comments'

export default async function Page({ postId }) {
  // Start fetching but don't await
  const commentsPromise = fetchComments(postId)

  return (
    <article>
      <h1>Post Title</h1>
      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </article>
  )
}
```

```typescript
// Comments.tsx (Client Component)
'use client'

import { use } from 'react'

function Comments({ commentsPromise }) {
  // Resume the promise from the server
  // Suspends until data is available
  const comments = use(commentsPromise)

  return comments.map(comment => <p key={comment.id}>{comment.text}</p>)
}
```

### Conditional `use`

Unlike hooks, `use` can be called conditionally:

```typescript
function UserProfile({ userPromise, isGuest }: Props) {
  // This is OK! Traditional hooks can't do this
  if (!isGuest) {
    const user = use(userPromise)
    return <div>{user.name}</div>
  }

  return <div>Guest User</div>
}
```

### Valid Hook Usage with `use`

```typescript
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Regular hooks at top level
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  if (!isSpecial) {
    return null
  }

  if (shouldFetch) {
    // ✅ `use` can be conditional
    const data = use(fetchPromise)
    return <div>{data}</div>
  }

  return <div>{name}: {count}</div>
}
```

### Reading Context with `use`

```typescript
import { use } from 'react'
import { ThemeContext } from './ThemeContext'

function Button() {
  const theme = use(ThemeContext)
  return <button className={theme}>Click me</button>
}
```

### `use` in Loops and Conditions

```typescript
function PostList({ postPromises }: { postPromises: Promise<Post>[] }) {
  return (
    <div>
      {postPromises.map((promise, index) => {
        const post = use(promise) // Can use in loops!
        return <PostCard key={index} post={post} />
      })}
    </div>
  )
}
```

## Optimistic Updates

### `useOptimistic` Hook

The `useOptimistic` hook provides immediate UI feedback while async operations complete in the background. If the operation fails, React automatically reverts to the original state.

**Basic Pattern with Sending Indicator:**
```typescript
'use client'

import { useOptimistic, useState, useRef, startTransition } from 'react'
import { deliverMessage } from './actions'

type Message = {
  text: string
  sending?: boolean
}

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef()
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  )

  function formAction(formData) {
    addOptimisticMessage(formData.get("message"))
    formRef.current.reset()
    startTransition(async () => {
      await sendMessageAction(formData)
    })
  }

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  )
}
```

**Todo List Pattern:**
```typescript
'use client'

import { useOptimistic, useTransition } from 'react'

type Todo = {
  id: string
  text: string
  done: boolean
}

function TodoList({ todos }: { todos: Todo[] }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  async function addTodo(formData: FormData) {
    const text = formData.get('text') as string
    const newTodo = { id: crypto.randomUUID(), text, done: false }

    startTransition(async () => {
      // Immediately show in UI
      addOptimisticTodo(newTodo)

      // Save to server
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo)
      })
    })
  }

  return (
    <div>
      <ul>
        {optimisticTodos.map(todo => (
          <li
            key={todo.id}
            style={{ opacity: isPending ? 0.5 : 1 }}
          >
            {todo.text}
          </li>
        ))}
      </ul>

      <form action={addTodo}>
        <input name="text" required />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}
```

### Optimistic Deletions

```typescript
'use client'

import { useOptimistic } from 'react'
import { deletePost } from './actions'

type Post = {
  id: string
  title: string
}

function PostList({ posts }: { posts: Post[] }) {
  const [optimisticPosts, removeOptimisticPost] = useOptimistic(
    posts,
    (state, removedId: string) => state.filter(p => p.id !== removedId)
  )
  
  async function handleDelete(postId: string) {
    // Optimistically remove from UI
    removeOptimisticPost(postId)
    
    // Delete on server
    await deletePost(postId)
  }
  
  return (
    <ul>
      {optimisticPosts.map(post => (
        <li key={post.id}>
          {post.title}
          <button onClick={() => handleDelete(post.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

### Optimistic Updates with State

```typescript
'use client'

import { useOptimistic, useState } from 'react'

type Message = {
  id: string
  text: string
  sending?: boolean
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  )
  
  async function sendMessage(formData: FormData) {
    const text = formData.get('text') as string
    const tempId = crypto.randomUUID()
    
    // Add optimistically
    addOptimisticMessage({
      id: tempId,
      text,
      sending: true
    })
    
    // Send to server
    const response = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ text })
    })
    
    const savedMessage = await response.json()
    
    // Replace optimistic with real
    setMessages(prev => [...prev, savedMessage])
  }
  
  return (
    <div>
      {optimisticMessages.map(msg => (
        <div 
          key={msg.id}
          style={{ opacity: msg.sending ? 0.5 : 1 }}
        >
          {msg.text}
        </div>
      ))}
      
      <form action={sendMessage}>
        <input name="text" />
        <button>Send</button>
      </form>
    </div>
  )
}
```

## Form Handling

### `useFormStatus`

```typescript
'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

function Form() {
  async function handleSubmit(formData: FormData) {
    await fetch('/api/submit', {
      method: 'POST',
      body: formData
    })
  }
  
  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      <SubmitButton />
    </form>
  )
}
```

### Form Validation with Actions

```typescript
'use client'

import { useActionState } from 'react'

type FormState = {
  errors?: {
    email?: string
    password?: string
  }
  message?: string
}

async function signup(prevState: FormState, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const errors: FormState['errors'] = {}
  
  if (!email?.includes('@')) {
    errors.email = 'Invalid email address'
  }
  
  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors }
  }
  
  // Save to database
  await createUser({ email, password })
  
  return { message: 'Account created!' }
}

function SignupForm() {
  const [state, formAction] = useActionState(signup, {})
  
  return (
    <form action={formAction}>
      <div>
        <input name="email" type="email" />
        {state.errors?.email && (
          <p className="error">{state.errors.email}</p>
        )}
      </div>
      
      <div>
        <input name="password" type="password" />
        {state.errors?.password && (
          <p className="error">{state.errors.password}</p>
        )}
      </div>
      
      <button type="submit">Sign Up</button>
      
      {state.message && (
        <p className="success">{state.message}</p>
      )}
    </form>
  )
}
```

### Progressive Enhancement

Forms work without JavaScript when using Server Functions. React automatically handles form submission before hydration completes.

**Basic Server Form (Works Without JS):**
```typescript
// Works without JavaScript!
function CommentForm() {
  async function postComment(formData: FormData) {
    'use server'

    const comment = formData.get('comment')
    await db.comment.create({ data: { text: comment } })
    revalidatePath('/posts')
  }

  return (
    <form action={postComment}>
      <textarea name="comment" required />
      <button type="submit">Post Comment</button>
    </form>
  )
}
```

**Display Errors Before JS Loads:**
```typescript
import { useActionState } from "react"
import { signUpNewUser } from "./api"

export default function Page() {
  async function signup(prevState, formData) {
    "use server"
    const email = formData.get("email")
    try {
      await signUpNewUser(email)
      alert(`Added "${email}"`)
    } catch (err) {
      return err.toString()
    }
  }

  const [message, signupAction] = useActionState(signup, null)

  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  )
}
```

**Direct Form Action with Server Function:**
```typescript
// App.js
async function requestUsername(formData) {
  'use server'
  const username = formData.get('username')
  // Process username...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  )
}
```

## Transitions

### `useTransition` for Non-Urgent Updates

```typescript
'use client'

import { useState, useTransition } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()
  
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value) // Urgent: update input immediately
    
    startTransition(() => {
      // Non-urgent: update results
      const filtered = allData.filter(item => 
        item.title.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filtered)
    })
  }
  
  return (
    <div>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />
      
      {isPending && <div>Searching...</div>}
      
      <ul style={{ opacity: isPending ? 0.5 : 1 }}>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Route Transitions

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

function Navigation() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function navigate(href: string) {
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <nav>
      <button onClick={() => navigate('/home')}>
        Home
      </button>
      <button onClick={() => navigate('/about')}>
        About
      </button>
      {isPending && <Spinner />}
    </nav>
  )
}
```

## Server Functions

Server Functions (marked with `'use server'`) run on the server and can be called from Client Components. They enable secure database operations and server-side logic.

### Calling Server Functions with useTransition

```typescript
// actions.js
'use server'

let likeCount = 0
export default async function incrementLike() {
  likeCount++
  return likeCount
}
```

```typescript
// LikeButton.js
'use client'

import incrementLike from './actions'
import { useState, useTransition } from 'react'

function LikeButton() {
  const [isPending, startTransition] = useTransition()
  const [likeCount, setLikeCount] = useState(0)

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike()
      setLikeCount(currentCount)
    })
  }

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>
    </>
  )
}
```

### Server Function with Form and State Management

```typescript
// actions.ts
'use server'

export async function updateName(name: string) {
  // Validate and update in database
  if (!name) {
    return { error: 'Name is required' }
  }
  await db.user.update({ name })
  return { error: null }
}
```

```typescript
// UpdateName.tsx
'use client'

import { updateName } from './actions'
import { useState, useTransition } from 'react'

function UpdateName() {
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [isPending, startTransition] = useTransition()

  const submitAction = async () => {
    startTransition(async () => {
      const { error } = await updateName(name)
      if (error) {
        setError(error)
      } else {
        setName('')
      }
    })
  }

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

### Server Function with useActionState

```typescript
// actions.ts
'use server'

export async function updateName(prevState, formData) {
  const name = formData.get('name')
  if (!name) {
    return { error: 'Name is required' }
  }
  await db.user.update({ name })
  return { error: null }
}
```

```typescript
// UpdateName.tsx
'use client'

import { useActionState } from 'react'
import { updateName } from './actions'

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, { error: null })

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

## Server Components

### Server Component Patterns

**Data fetching:**
```typescript
// app/posts/page.tsx
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.post.findMany()
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

**Parallel data fetching:**
```typescript
async function getPost(slug: string) {
  return fetch(`/api/posts/${slug}`).then(r => r.json())
}

async function getAuthor(authorId: string) {
  return fetch(`/api/authors/${authorId}`).then(r => r.json())
}

async function getComments(postId: string) {
  return fetch(`/api/comments/${postId}`).then(r => r.json())
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Fetch in parallel
  const [post, author, comments] = await Promise.all([
    getPost(params.slug),
    getAuthor('author-id'),
    getComments('post-id')
  ])
  
  return (
    <article>
      <h1>{post.title}</h1>
      <AuthorCard author={author} />
      <Comments comments={comments} />
    </article>
  )
}
```

### Composition Pattern

**Server wrapper with client interactivity:**
```typescript
// ServerWrapper.tsx (Server Component)
import ClientComponent from './ClientComponent'
import { db } from '@/lib/db'

export default async function ServerWrapper() {
  const data = await db.data.findMany()
  
  return (
    <div>
      <h1>Server-rendered Header</h1>
      <ClientComponent initialData={data} />
    </div>
  )
}
```

```typescript
// ClientComponent.tsx (Client Component)
'use client'

import { useState } from 'react'

export default function ClientComponent({ 
  initialData 
}: { 
  initialData: Data[] 
}) {
  const [data, setData] = useState(initialData)
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={() => setData([...data, newItem])}>
        Add Item
      </button>
    </div>
  )
}
```

### Passing Server Components as Props

```typescript
// Layout.tsx (Server Component)
export default function Layout({
  children,
  sidebar
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  )
}
```

```typescript
// Page.tsx
import Layout from './Layout'
import Sidebar from './Sidebar' // Server Component
import Content from './Content' // Server Component

export default function Page() {
  return (
    <Layout sidebar={<Sidebar />}>
      <Content />
    </Layout>
  )
}
```

## Context in React 19

### No More `.Provider`

```typescript
// React 18 (old)
<ThemeContext.Provider value={theme}>
  {children}
</ThemeContext.Provider>

// React 19 (new)
<ThemeContext value={theme}>
  {children}
</ThemeContext>
```

### Creating Context

```typescript
// context/ThemeContext.tsx
'use client'

import { createContext, useState } from 'react'

type Theme = 'light' | 'dark'

export const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'light',
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  
  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  )
}
```

### Using Context

```typescript
'use client'

import { use } from 'react'
import { ThemeContext } from './ThemeContext'

export default function ThemedButton() {
  const { theme, setTheme } = use(ThemeContext)
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  )
}
```

## Refs as Props

### No More `forwardRef`

```typescript
// React 18 (old)
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})

// React 19 (new)
function Input({ ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

### Ref Callback Cleanup

```typescript
'use client'

function VideoPlayer() {
  return (
    <video
      ref={node => {
        if (node) {
          node.play()
        }
        
        // Cleanup when ref changes or unmounts
        return () => {
          if (node) {
            node.pause()
          }
        }
      }}
    />
  )
}
```

## Document Metadata

### Built-in Title and Meta

```typescript
// No more react-helmet!
function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.coverImage} />
      
      <article>
        <h1>{post.title}</h1>
        {post.content}
      </article>
    </>
  )
}
```

### Resource Preloading

```typescript
import { preload, preinit } from 'react-dom'

function App() {
  // Preload data
  preload('/api/data', { as: 'fetch' })
  
  // Preinit stylesheet (blocks render)
  preinit('/styles.css', { as: 'style' })
  
  // Preinit script
  preinit('/analytics.js', { as: 'script' })
  
  return <div>{/* ... */}</div>
}
```

## Error Handling

### Error Boundaries

```typescript
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught by boundary:', error, info)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Using Error Boundaries

```typescript
function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <MainContent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Suspense Patterns

### Nested Suspense

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Fast data loads first */}
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile />
      </Suspense>
      
      {/* Slow data doesn't block */}
      <Suspense fallback={<ChartsSkeleton />}>
        <Charts />
      </Suspense>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

### Suspense with `use`

```typescript
import { use, Suspense } from 'react'

async function fetchData() {
  const res = await fetch('/api/data')
  return res.json()
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise)
  return <div>{data.value}</div>
}

function App() {
  const dataPromise = fetchData()
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataDisplay dataPromise={dataPromise} />
    </Suspense>
  )
}
```

## Performance Patterns

### Memoization

```typescript
'use client'

import { useMemo, memo } from 'react'

// Memoize expensive calculations
function TodoList({ todos, filter }: Props) {
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.done
      if (filter === 'completed') return todo.done
      return true
    })
  }, [todos, filter])
  
  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

// Memoize components
const TodoItem = memo(function TodoItem({ todo }: { todo: Todo }) {
  return <li>{todo.text}</li>
})
```

### `useCallback` for Stable References

```typescript
'use client'

import { useCallback, useState } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  
  // Stable function reference
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])
  
  return (
    <div>
      <Child onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  )
}

const Child = memo(function Child({ 
  onClick 
}: { 
  onClick: () => void 
}) {
  console.log('Child rendered')
  return <button onClick={onClick}>Increment</button>
})
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## Common Patterns

### Loading States

```typescript
'use client'

import { useState, useTransition } from 'react'

function DataLoader() {
  const [data, setData] = useState(null)
  const [isPending, startTransition] = useTransition()
  
  async function loadData() {
    startTransition(async () => {
      const res = await fetch('/api/data')
      const json = await res.json()
      setData(json)
    })
  }
  
  return (
    <div>
      <button onClick={loadData} disabled={isPending}>
        {isPending ? 'Loading...' : 'Load Data'}
      </button>
      
      {data && <DataDisplay data={data} />}
    </div>
  )
}
```

### Infinite Scroll

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'

function InfiniteList() {
  const [items, setItems] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    async function loadMore() {
      const res = await fetch(`/api/items?page=${page}`)
      const newItems = await res.json()
      
      setItems(prev => [...prev, ...newItems])
      setHasMore(newItems.length > 0)
    }
    
    loadMore()
  }, [page])
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(p => p + 1)
        }
      },
      { threshold: 1.0 }
    )
    
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    
    return () => observer.disconnect()
  }, [hasMore])
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <div ref={observerRef}>
        {hasMore && <div>Loading more...</div>}
      </div>
    </div>
  )
}
```

### Debounced Search

```typescript
'use client'

import { useState, useTransition, useEffect } from 'react'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()
  
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await fetch(`/api/search?q=${query}`)
        const data = await res.json()
        setResults(data)
      })
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query])
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {isPending && <div>Searching...</div>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Custom Hooks

Custom hooks encapsulate reusable stateful logic. They share behavior, not state - each component using a hook gets its own isolated state.

### useOnlineStatus Hook

```typescript
// useOnlineStatus.ts
import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

```typescript
// Using the hook
import { useOnlineStatus } from './useOnlineStatus'

function StatusBar() {
  const isOnline = useOnlineStatus()
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
}

function SaveButton() {
  const isOnline = useOnlineStatus()

  function handleSaveClick() {
    console.log('✅ Progress saved')
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  )
}
```

### useChatRoom Hook

```typescript
// useChatRoom.ts
import { useEffect } from 'react'
import { createConnection } from './chat'

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    }
    const connection = createConnection(options)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId, serverUrl])
}
```

```typescript
// ChatRoom.tsx
import { useState } from 'react'
import { useChatRoom } from './useChatRoom'

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234')

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  })

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  )
}
```

### Custom Hook with Callback Parameter

```typescript
// useChatRoom.ts - with message handler
import { useEffect } from 'react'
import { createConnection } from './chat'

export function useChatRoom({ serverUrl, roomId, onMessage }) {
  useEffect(() => {
    const options = { serverUrl, roomId }
    const connection = createConnection(options)

    connection.connect()
    connection.on('message', (msg) => {
      onMessage(msg)
    })

    return () => connection.disconnect()
  }, [roomId, serverUrl, onMessage])
}
```

```typescript
// Usage with custom message handling
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([])

  useChatRoom({
    roomId,
    serverUrl: 'https://localhost:1234',
    onMessage: (msg) => {
      setMessages(prev => [...prev, msg])
    }
  })

  return (
    <ul>
      {messages.map((msg, i) => <li key={i}>{msg}</li>)}
    </ul>
  )
}
```

### Hook Composition Rules

Each hook call creates isolated state:

```typescript
// Each component gets its own state
function StatusBar() {
  const isOnline = useOnlineStatus()  // Own state
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus()  // Separate state
  // ...
}
```

## Migration Guide

### From React 18 to React 19

**Update dependencies:**
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**Replace `forwardRef`:**
```typescript
// Before
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />)

// After
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

**Update Context:**
```typescript
// Before
<MyContext.Provider value={value}>

// After
<MyContext value={value}>
```

**Remove string refs:**
```typescript
// Before (deprecated)
<input ref="myInput" />

// After
const inputRef = useRef()
<input ref={inputRef} />
```

**Update cleanup functions:**
```typescript
// Before (could be async)
useEffect(() => {
  return async () => {
    await cleanup()
  }
}, [])

// After (must be sync)
useEffect(() => {
  return () => {
    cleanup() // Call async function synchronously
  }
}, [])
```

## Testing

### Testing Actions

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form from './Form'

test('submits form with action', async () => {
  const user = userEvent.setup()
  render(<Form />)
  
  await user.type(screen.getByLabelText('Name'), 'John')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })
})
```

### Testing Server Components

```typescript
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ title: 'Test Post' })
  })
)

test('renders server component', async () => {
  const Component = await Page()
  render(Component)
  
  expect(screen.getByText('Test Post')).toBeInTheDocument()
})
```

## Best Practices

### Do's

✅ Use server components by default
✅ Use client components only when needed (interactivity, hooks, browser APIs)
✅ Fetch data in parallel when possible
✅ Use Suspense for loading states
✅ Use Actions for mutations
✅ Use `useOptimistic` for instant UI feedback
✅ Use `useTransition` for non-urgent updates
✅ Use error boundaries for error handling
✅ Preload critical resources
✅ Keep components small and focused

### Don'ts

❌ Don't mark everything as `'use client'`
❌ Don't fetch data in effects when you can use server components
❌ Don't forget error boundaries
❌ Don't ignore loading states
❌ Don't use async cleanup functions
❌ Don't pass promises without Suspense
❌ Don't use string refs
❌ Don't use `defaultProps` (removed)
❌ Don't over-optimize with `useMemo` prematurely

## React Compiler

React Compiler is a new build-time tool that automatically optimizes React applications by adding memoization.

### What React Compiler Does

The compiler automatically adds `useMemo`, `useCallback`, and `memo` optimizations so you don't have to. It analyzes your code and generates optimized output with automatic memoization.

**Before (your code):**
```typescript
function ProductList({ products, filter }) {
  const filtered = products.filter(p => p.category === filter)

  return (
    <ul>
      {filtered.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  )
}
```

**After (compiler output):**
```typescript
import { c as _c } from "react/compiler-runtime"

function ProductList(t0) {
  const $ = _c(4)
  const { products, filter } = t0

  let filtered
  if ($[0] !== products || $[1] !== filter) {
    filtered = products.filter(p => p.category === filter)
    $[0] = products
    $[1] = filter
    $[2] = filtered
  } else {
    filtered = $[2]
  }

  let t1
  if ($[3] !== filtered) {
    t1 = (
      <ul>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ul>
    )
    $[3] = filtered
  } else {
    t1 = $[3]
  }
  return t1
}
```

### Enabling React Compiler

**Babel configuration:**
```javascript
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
}
```

**Next.js configuration:**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
```

### Compiler Directives

**Skip compilation for specific components:**
```typescript
function LegacyComponent() {
  'use no memo' // Opt out of compiler optimization

  // Component with patterns incompatible with compiler
  return <div>...</div>
}
```

**Enable strict optimization assumptions:**
```typescript
// @enableAssumeHooksFollowRulesOfReact true
function Component(props) {
  const x = {}
  // Compiler assumes hooks freeze inputs and return frozen values
  const y = useFoo(x)
  // Both x and y are treated as frozen
  bar(x, y)
  return [x, y]
}
```

### When to Use the Compiler

✅ **Do use:**
- New React 19 projects
- Projects following Rules of Hooks
- Applications where manual memoization is tedious

❌ **Don't use yet:**
- Projects with complex manual memoization
- Libraries that break Rules of Hooks
- Applications not yet on React 19

## Root Error Handling

React 19 provides granular error handling options for `createRoot` and `hydrateRoot`.

### Error Handling Options

```typescript
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!, {
  // Called when React catches an error in an Error Boundary
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error)
    console.error('Component stack:', errorInfo.componentStack)
    // Send to error reporting service
    reportError(error, { type: 'caught', ...errorInfo })
  },

  // Called when an error is thrown and NOT caught by Error Boundary
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error)
    // Show error UI or reload
    showErrorOverlay(error)
    reportError(error, { type: 'uncaught', ...errorInfo })
  },

  // Called when an error is thrown and automatically recovered
  onRecoverableError: (error, errorInfo) => {
    console.warn('Recoverable error:', error)
    // Usually hydration mismatches
    reportError(error, { type: 'recoverable', ...errorInfo })
  }
})

root.render(<App />)
```

### Hydration Error Handling

```typescript
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(
  document.getElementById('root')!,
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      // Common during hydration - mismatch between server and client
      if (error.message.includes('Hydration')) {
        console.warn('Hydration mismatch:', error)
        // Optionally trigger client-side re-render
      }
    }
  }
)
```

## useId Patterns

### Multiple React Apps on Same Page

When rendering multiple React apps on the same page, use `identifierPrefix` to prevent ID collisions.

**Client-side rendering:**
```typescript
import { createRoot } from 'react-dom/client'

// First app
const root1 = createRoot(document.getElementById('app1')!, {
  identifierPrefix: 'app1-'
})
root1.render(<App />)

// Second app
const root2 = createRoot(document.getElementById('app2')!, {
  identifierPrefix: 'app2-'
})
root2.render(<App />)
```

**Server-side rendering:**
```typescript
// Server
import { renderToPipeableStream } from 'react-dom/server'

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'myapp-' }
)

// Client (must match server)
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(
  document.getElementById('root')!,
  <App />,
  { identifierPrefix: 'myapp-' }
)
```

### Generating Multiple Related IDs

```typescript
import { useId } from 'react'

function FormField({ label }: { label: string }) {
  const id = useId()

  return (
    <div>
      <label htmlFor={`${id}-input`}>{label}</label>
      <input id={`${id}-input`} aria-describedby={`${id}-hint`} />
      <p id={`${id}-hint`}>Enter a valid {label.toLowerCase()}</p>
      <span id={`${id}-error`} role="alert" aria-live="polite" />
    </div>
  )
}
```

## useSyncExternalStore Patterns

### Custom Hook with useSyncExternalStore

```typescript
import { useSyncExternalStore, useCallback } from 'react'

// Track online status
export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,      // Client snapshot
    () => true                    // Server snapshot (assume online)
  )
}

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}
```

### External Store with Parameters

```typescript
import { useSyncExternalStore, useCallback } from 'react'

function useChatStatus(roomId: string) {
  // Memoize subscribe to prevent re-subscriptions
  const subscribe = useCallback((callback: () => void) => {
    const unsubscribe = chatService.subscribe(roomId, callback)
    return unsubscribe
  }, [roomId])

  const getSnapshot = useCallback(() => {
    return chatService.getConnectionStatus(roomId)
  }, [roomId])

  return useSyncExternalStore(subscribe, getSnapshot, () => 'connecting')
}
```

### Read External Store with `use` (React 19)

```typescript
import { use } from 'react'

// New way to read external stores - supports concurrent features
function ChatIndicator({ store }: { store: Store }) {
  const value = use(store) // Supports transitions and Suspense
  return <div>{value}</div>
}
```

### Avoid Common Mistakes

```typescript
// ❌ Bad: Creates new object every render - causes infinite loop
function getSnapshot() {
  return { todos: myStore.todos }
}

// ✅ Good: Return immutable data or same reference
function getSnapshot() {
  return myStore.todos // Return the actual array, not a wrapper
}

// ❌ Bad: Subscribe recreated every render
function Component() {
  function subscribe() { /* ... */ }
  const data = useSyncExternalStore(subscribe, getSnapshot)
}

// ✅ Good: Stable subscribe function
const subscribe = (callback: () => void) => {
  store.addListener(callback)
  return () => store.removeListener(callback)
}

function Component() {
  const data = useSyncExternalStore(subscribe, getSnapshot)
}
```

## TypeScript Support

### Typing Actions

```typescript
type FormState = {
  error?: string
  success?: boolean
}

async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  
  if (!name) {
    return { error: 'Name required' }
  }
  
  await saveData(name)
  return { success: true }
}
```

### Typing `use` Hook

```typescript
function Component({ promise }: { promise: Promise<User> }) {
  const user: User = use(promise)
  return <div>{user.name}</div>
}
```

### Typing Server Components

```typescript
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params, searchParams }: Props) {
  const data = await getData(params.id)
  return <div>{data.title}</div>
}
```

## Quick Reference

### New Hooks
- `use(promise | context)` - Read resources
- `useOptimistic(state, updateFn)` - Optimistic updates
- `useActionState(action, initialState)` - Form state with actions
- `useFormStatus()` - Access form submission status

### Actions
- Async functions for mutations
- Automatic pending state tracking
- Works with forms (progressive enhancement)
- Can be server actions (`'use server'`)

### Server Components
- Default in Next.js App Router
- Direct backend access
- No client JavaScript
- Can't use hooks or browser APIs

### Client Components
- Marked with `'use client'`
- Can use hooks and browser APIs
- Required for interactivity
- Run on server (SSR) and client

### Breaking Changes
- Refs as props (no `forwardRef`)
- `Context` instead of `Context.Provider`
- Cleanup must be synchronous
- Removed: string refs, `defaultProps`

### Performance
- Use `memo` for expensive re-renders
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Use `lazy` for code splitting
- Use Suspense for loading states