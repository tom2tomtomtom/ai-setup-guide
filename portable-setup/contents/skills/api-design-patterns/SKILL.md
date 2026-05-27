---
name: api-design-patterns
description: Design REST and GraphQL APIs with authentication, versioning, rate limiting, and error handling. Use when building new API endpoints, standardizing error responses, or setting up API gateways.
---

# API Design Patterns

Comprehensive guide for designing and implementing production-ready APIs, covering REST and GraphQL patterns, authentication strategies, error handling, versioning, rate limiting, and documentation best practices.

## When to Use This Skill

Use when:
- Designing new REST or GraphQL APIs
- Implementing API authentication and authorization
- Standardizing error handling across services
- Setting up API versioning strategies
- Implementing rate limiting and throttling
- Writing API documentation
- Building API gateways
- Migrating between API versions
- Optimizing API performance
- Establishing API governance standards

## REST API Patterns

### HTTP Methods and Status Codes

**Use appropriate methods:**
```typescript
// GET - Retrieve resources (idempotent, cacheable)
GET /api/posts
GET /api/posts/123

// POST - Create new resource
POST /api/posts
Body: { "title": "New Post", "content": "..." }

// PUT - Replace entire resource (idempotent)
PUT /api/posts/123
Body: { "title": "Updated", "content": "...", "status": "published" }

// PATCH - Partial update (not necessarily idempotent)
PATCH /api/posts/123
Body: { "status": "published" }

// DELETE - Remove resource (idempotent)
DELETE /api/posts/123
```

**Standard status codes:**
```typescript
// Success
200 OK              // Generic success
201 Created         // Resource created successfully
202 Accepted        // Accepted for processing (async)
204 No Content      // Success with no response body

// Client Errors
400 Bad Request     // Invalid request format/data
401 Unauthorized    // Authentication required
403 Forbidden       // Authenticated but not authorized
404 Not Found       // Resource doesn't exist
409 Conflict        // Resource conflict (duplicate)
422 Unprocessable   // Validation errors
429 Too Many Requests // Rate limit exceeded

// Server Errors
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

### URL Design

**RESTful resource naming:**
```typescript
// Good: Plural nouns, hierarchical
GET    /api/posts
POST   /api/posts
GET    /api/posts/123
PUT    /api/posts/123
DELETE /api/posts/123

// Nested resources
GET    /api/posts/123/comments
POST   /api/posts/123/comments
GET    /api/posts/123/comments/456

// User-specific resources
GET    /api/users/me/posts
GET    /api/users/me/notifications

// Actions on resources (when needed)
POST   /api/posts/123/publish
POST   /api/posts/123/archive
POST   /api/invoices/123/send
```

**Query parameters:**
```typescript
// Filtering
GET /api/posts?status=published&author=john

// Sorting
GET /api/posts?sort=created_at:desc

// Pagination
GET /api/posts?page=2&limit=20
GET /api/posts?cursor=abc123&limit=20

// Field selection
GET /api/posts?fields=id,title,created_at

// Search
GET /api/posts?q=typescript

// Multiple values
GET /api/posts?tags=react,typescript,nextjs
```

### Request/Response Format

**Consistent JSON structure:**
```typescript
// Success response (single resource)
{
  "data": {
    "id": "123",
    "type": "post",
    "attributes": {
      "title": "API Design",
      "content": "...",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "relationships": {
      "author": {
        "data": { "id": "456", "type": "user" }
      }
    }
  }
}

// Success response (collection)
{
  "data": [
    { "id": "1", "type": "post", ... },
    { "id": "2", "type": "post", ... }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  "links": {
    "self": "/api/posts?page=1",
    "next": "/api/posts?page=2",
    "prev": null
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

### REST API Implementation (Next.js)

**CRUD endpoints:**
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  status: z.enum(['draft', 'published']).default('draft')
})

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')

    // Build query
    const query: any = {}
    if (status) query.status = status

    // Fetch data
    const posts = await db.post.findMany({
      where: query,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' }
    })

    const total = await db.post.count({ where: query })

    return NextResponse.json({
      data: posts,
      meta: {
        total,
        page,
        per_page: limit,
        total_pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to fetch posts' } },
      { status: 500 }
    )
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate
    const validated = createPostSchema.parse(body)
    
    // Create
    const post = await db.post.create({
      data: {
        ...validated,
        user_id: request.user.id // From middleware
      }
    })

    return NextResponse.json(
      { data: post },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { error: { message: 'Failed to create post' } },
      { status: 500 }
    )
  }
}
```

**Single resource endpoints:**
```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// GET /api/posts/123
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { id: true, name: true, avatar: true }
      }
    }
  })

  if (!post) {
    return NextResponse.json(
      { error: { message: 'Post not found' } },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: post })
}

// PUT /api/posts/123
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check ownership
    const existing = await db.post.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: { message: 'Post not found' } },
        { status: 404 }
      )
    }

    if (existing.user_id !== request.user.id) {
      return NextResponse.json(
        { error: { message: 'Not authorized' } },
        { status: 403 }
      )
    }

    // Update
    const post = await db.post.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to update post' } },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/123
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check ownership
    const existing = await db.post.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: { message: 'Post not found' } },
        { status: 404 }
      )
    }

    if (existing.user_id !== request.user.id) {
      return NextResponse.json(
        { error: { message: 'Not authorized' } },
        { status: 403 }
      )
    }

    await db.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to delete post' } },
      { status: 500 }
    )
  }
}
```

## GraphQL Patterns

### Schema Design

**Type definitions:**
```graphql
# schema.graphql
type User {
  id: ID!
  email: String!
  name: String!
  avatar: String
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  status: PostStatus!
  author: User!
  comments: [Comment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  createdAt: DateTime!
}

type Query {
  # Get single resource
  user(id: ID!): User
  post(id: ID!): Post
  
  # Get collections
  users(
    page: Int = 1
    limit: Int = 20
    search: String
  ): UserConnection!
  
  posts(
    status: PostStatus
    authorId: ID
    page: Int = 1
    limit: Int = 20
  ): PostConnection!
  
  # Current user
  me: User
}

type Mutation {
  # User mutations
  updateProfile(input: UpdateProfileInput!): User!
  
  # Post mutations
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  publishPost(id: ID!): Post!
  
  # Comment mutations
  createComment(input: CreateCommentInput!): Comment!
  deleteComment(id: ID!): Boolean!
}

type Subscription {
  postCreated: Post!
  commentAdded(postId: ID!): Comment!
}

# Pagination types
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Input types
input CreatePostInput {
  title: String!
  content: String!
  status: PostStatus
}

input UpdatePostInput {
  title: String
  content: String
  status: PostStatus
}

input UpdateProfileInput {
  name: String
  avatar: String
}

scalar DateTime
```

### Resolvers (GraphQL Yoga + Pothos)

```typescript
// lib/graphql/schema.ts
import SchemaBuilder from '@pothos/core'
import { DateTimeResolver } from 'graphql-scalars'

const builder = new SchemaBuilder({})

// Scalars
builder.addScalarType('DateTime', DateTimeResolver, {})

// Enums
const PostStatus = builder.enumType('PostStatus', {
  values: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const,
})

// Object types
const User = builder.objectRef<{ id: string }>('User')
const Post = builder.objectRef<{ id: string }>('Post')
const Comment = builder.objectRef<{ id: string }>('Comment')

builder.objectType(User, {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.string({
      resolve: async (user, args, ctx) => {
        const data = await ctx.db.user.findUnique({
          where: { id: user.id }
        })
        return data.email
      }
    }),
    name: t.string({
      resolve: async (user, args, ctx) => {
        const data = await ctx.db.user.findUnique({
          where: { id: user.id }
        })
        return data.name
      }
    }),
    posts: t.field({
      type: [Post],
      resolve: async (user, args, ctx) => {
        return ctx.db.post.findMany({
          where: { user_id: user.id }
        })
      }
    }),
    createdAt: t.field({
      type: 'DateTime',
      resolve: async (user, args, ctx) => {
        const data = await ctx.db.user.findUnique({
          where: { id: user.id }
        })
        return data.created_at
      }
    })
  })
})

builder.objectType(Post, {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.string({
      resolve: async (post, args, ctx) => {
        const data = await ctx.db.post.findUnique({
          where: { id: post.id }
        })
        return data.title
      }
    }),
    content: t.string({
      resolve: async (post, args, ctx) => {
        const data = await ctx.db.post.findUnique({
          where: { id: post.id }
        })
        return data.content
      }
    }),
    status: t.field({
      type: PostStatus,
      resolve: async (post, args, ctx) => {
        const data = await ctx.db.post.findUnique({
          where: { id: post.id }
        })
        return data.status
      }
    }),
    author: t.field({
      type: User,
      resolve: async (post, args, ctx) => {
        const data = await ctx.db.post.findUnique({
          where: { id: post.id },
          include: { author: true }
        })
        return data.author
      }
    }),
    comments: t.field({
      type: [Comment],
      resolve: async (post, args, ctx) => {
        return ctx.db.comment.findMany({
          where: { post_id: post.id }
        })
      }
    }),
    createdAt: t.field({
      type: 'DateTime',
      resolve: async (post, args, ctx) => {
        const data = await ctx.db.post.findUnique({
          where: { id: post.id }
        })
        return data.created_at
      }
    })
  })
})

// Queries
builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: User,
      nullable: true,
      resolve: async (root, args, ctx) => {
        if (!ctx.user) return null
        return { id: ctx.user.id }
      }
    }),
    post: t.field({
      type: Post,
      nullable: true,
      args: {
        id: t.arg.id({ required: true })
      },
      resolve: async (root, args, ctx) => {
        const post = await ctx.db.post.findUnique({
          where: { id: args.id }
        })
        return post ? { id: post.id } : null
      }
    }),
    posts: t.field({
      type: [Post],
      args: {
        status: t.arg({ type: PostStatus }),
        limit: t.arg.int({ defaultValue: 20 })
      },
      resolve: async (root, args, ctx) => {
        const posts = await ctx.db.post.findMany({
          where: args.status ? { status: args.status } : undefined,
          take: args.limit,
          orderBy: { created_at: 'desc' }
        })
        return posts.map(p => ({ id: p.id }))
      }
    })
  })
})

// Mutations
builder.mutationType({
  fields: (t) => ({
    createPost: t.field({
      type: Post,
      args: {
        title: t.arg.string({ required: true }),
        content: t.arg.string({ required: true }),
        status: t.arg({ type: PostStatus, defaultValue: 'DRAFT' })
      },
      resolve: async (root, args, ctx) => {
        if (!ctx.user) {
          throw new Error('Not authenticated')
        }

        const post = await ctx.db.post.create({
          data: {
            title: args.title,
            content: args.content,
            status: args.status,
            user_id: ctx.user.id
          }
        })

        return { id: post.id }
      }
    }),
    updatePost: t.field({
      type: Post,
      args: {
        id: t.arg.id({ required: true }),
        title: t.arg.string(),
        content: t.arg.string(),
        status: t.arg({ type: PostStatus })
      },
      resolve: async (root, args, ctx) => {
        if (!ctx.user) {
          throw new Error('Not authenticated')
        }

        // Check ownership
        const existing = await ctx.db.post.findUnique({
          where: { id: args.id }
        })

        if (!existing) {
          throw new Error('Post not found')
        }

        if (existing.user_id !== ctx.user.id) {
          throw new Error('Not authorized')
        }

        const post = await ctx.db.post.update({
          where: { id: args.id },
          data: {
            ...(args.title && { title: args.title }),
            ...(args.content && { content: args.content }),
            ...(args.status && { status: args.status })
          }
        })

        return { id: post.id }
      }
    }),
    deletePost: t.boolean({
      args: {
        id: t.arg.id({ required: true })
      },
      resolve: async (root, args, ctx) => {
        if (!ctx.user) {
          throw new Error('Not authenticated')
        }

        const existing = await ctx.db.post.findUnique({
          where: { id: args.id }
        })

        if (!existing) {
          throw new Error('Post not found')
        }

        if (existing.user_id !== ctx.user.id) {
          throw new Error('Not authorized')
        }

        await ctx.db.post.delete({
          where: { id: args.id }
        })

        return true
      }
    })
  })
})

export const schema = builder.toSchema()
```

### GraphQL Server Setup (Next.js)

```typescript
// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga'
import { schema } from '@/lib/graphql/schema'
import { getServerSession } from 'next-auth'

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  context: async () => {
    const session = await getServerSession()
    
    return {
      user: session?.user,
      db: prisma // Your database client
    }
  }
})

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS
}
```

### DataLoader (N+1 Prevention)

```typescript
import DataLoader from 'dataloader'

// Create loaders
function createLoaders(db: PrismaClient) {
  const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await db.user.findMany({
      where: { id: { in: [...ids] } }
    })
    
    // Return in same order as requested
    return ids.map(id => users.find(u => u.id === id))
  })

  const postsByUserLoader = new DataLoader(
    async (userIds: readonly string[]) => {
      const posts = await db.post.findMany({
        where: { user_id: { in: [...userIds] } }
      })
      
      // Group by user_id
      return userIds.map(userId =>
        posts.filter(p => p.user_id === userId)
      )
    }
  )

  return {
    userLoader,
    postsByUserLoader
  }
}

// Use in context
const { handleRequest } = createYoga({
  schema,
  context: async () => ({
    user: session?.user,
    db: prisma,
    loaders: createLoaders(prisma)
  })
})

// Use in resolvers
builder.objectType(Post, {
  fields: (t) => ({
    author: t.field({
      type: User,
      resolve: async (post, args, ctx) => {
        // Uses DataLoader (batches requests)
        const author = await ctx.loaders.userLoader.load(post.user_id)
        return author
      }
    })
  })
})
```

## Authentication & Authorization

### JWT Authentication

**Generate token:**
```typescript
import jwt from 'jsonwebtoken'

function generateToken(user: { id: string; email: string }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
      issuer: 'your-app',
      audience: 'your-app-users'
    }
  )
}
```

**Verify token:**
```typescript
function verifyToken(token: string) {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
      {
        issuer: 'your-app',
        audience: 'your-app-users'
      }
    )
    return payload
  } catch (error) {
    return null
  }
}
```

**Middleware:**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json(
      { error: { message: 'No token provided' } },
      { status: 401 }
    )
  }

  const payload = verifyToken(token)
  
  if (!payload) {
    return NextResponse.json(
      { error: { message: 'Invalid token' } },
      { status: 401 }
    )
  }

  // Add user to request
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.sub)
  
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: '/api/:path*'
}
```

### API Keys

**Generate API key:**
```typescript
import crypto from 'crypto'

function generateApiKey() {
  return `sk_${crypto.randomBytes(32).toString('hex')}`
}

// Store hash in database
function hashApiKey(key: string) {
  return crypto
    .createHash('sha256')
    .update(key)
    .digest('hex')
}
```

**Validate API key:**
```typescript
async function validateApiKey(key: string) {
  const hash = hashApiKey(key)
  
  const apiKey = await db.apiKey.findUnique({
    where: { hash },
    include: { user: true }
  })
  
  if (!apiKey || !apiKey.is_active) {
    return null
  }
  
  // Update last used
  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { last_used_at: new Date() }
  })
  
  return apiKey.user
}
```

### Role-Based Access Control (RBAC)

```typescript
enum Permission {
  READ_POST = 'read:post',
  CREATE_POST = 'create:post',
  UPDATE_POST = 'update:post',
  DELETE_POST = 'delete:post',
  MANAGE_USERS = 'manage:users'
}

const rolePermissions: Record<string, Permission[]> = {
  user: [
    Permission.READ_POST,
    Permission.CREATE_POST,
    Permission.UPDATE_POST
  ],
  moderator: [
    Permission.READ_POST,
    Permission.CREATE_POST,
    Permission.UPDATE_POST,
    Permission.DELETE_POST
  ],
  admin: Object.values(Permission)
}

function hasPermission(
  userRole: string,
  permission: Permission
): boolean {
  return rolePermissions[userRole]?.includes(permission) || false
}

// Decorator for route handlers
function requirePermission(permission: Permission) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const request = args[0] as NextRequest
      const userRole = request.headers.get('x-user-role')

      if (!userRole || !hasPermission(userRole, permission)) {
        return NextResponse.json(
          { error: { message: 'Insufficient permissions' } },
          { status: 403 }
        )
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
```

## Error Handling

### Standard Error Format

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(details: any[]) {
    super(422, 'VALIDATION_ERROR', 'Validation failed', details)
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
  }
}

export class RateLimitError extends ApiError {
  constructor() {
    super(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests')
  }
}
```

### Global Error Handler

```typescript
// lib/error-handler.ts
import { NextResponse } from 'next/server'
import { ApiError } from './errors'
import { ZodError } from 'zod'

export function handleError(error: unknown) {
  console.error('API Error:', error)

  // Known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details && { details: error.details })
        }
      },
      { status: error.statusCode }
    )
  }

  // Validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }
      },
      { status: 422 }
    )
  }

  // Database errors
  if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: 'CONFLICT',
            message: 'Resource already exists',
            details: { field: prismaError.meta?.target }
          }
        },
        { status: 409 }
      )
    }
    
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        },
        { status: 404 }
      )
    }
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    },
    { status: 500 }
  )
}
```

**Usage:**
```typescript
// app/api/posts/route.ts
import { handleError } from '@/lib/error-handler'
import { NotFoundError, ValidationError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    // Your logic
    const posts = await fetchPosts()
    return NextResponse.json({ data: posts })
  } catch (error) {
    return handleError(error)
  }
}
```

## Rate Limiting

### Redis-based Rate Limiter

```typescript
// lib/rate-limiter.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 60 // seconds
) {
  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const windowStart = now - window * 1000

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart)

  // Count requests in current window
  const count = await redis.zcard(key)

  if (count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil((await redis.ttl(key)) / 1000)
    }
  }

  // Add current request
  await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })
  await redis.expire(key, window)

  return {
    success: true,
    limit,
    remaining: limit - count - 1,
    reset: window
  }
}
```

**Rate limit middleware:**
```typescript
// middleware.ts
import { rateLimit } from '@/lib/rate-limiter'

export async function middleware(request: NextRequest) {
  // Use IP or user ID as identifier
  const identifier = 
    request.headers.get('x-user-id') || 
    request.headers.get('x-forwarded-for') || 
    'anonymous'

  const result = await rateLimit(identifier)

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests'
        }
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': result.reset.toString()
        }
      }
    )
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())

  return response
}
```

## API Versioning

### URL Versioning

```typescript
// app/api/v1/posts/route.ts
export async function GET() {
  return NextResponse.json({ version: 'v1', data: [] })
}

// app/api/v2/posts/route.ts
export async function GET() {
  return NextResponse.json({ version: 'v2', data: [] })
}
```

### Header Versioning

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const version = request.headers.get('api-version') || 'v1'
  
  // Route to appropriate handler
  if (version === 'v2') {
    return NextResponse.rewrite(
      new URL(`/api/v2${request.nextUrl.pathname}`, request.url)
    )
  }
  
  return NextResponse.next()
}
```

### Content Negotiation

```typescript
export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept')
  
  if (accept?.includes('application/vnd.myapp.v2+json')) {
    return NextResponse.json({ version: 'v2', data: [] })
  }
  
  return NextResponse.json({ version: 'v1', data: [] })
}
```

## Caching

### HTTP Caching Headers

```typescript
export async function GET(request: NextRequest) {
  const posts = await fetchPosts()
  
  return NextResponse.json(
    { data: posts },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        'ETag': generateETag(posts),
        'Last-Modified': new Date().toUTCString()
      }
    }
  )
}
```

### Redis Caching

```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({...})

export async function GET(request: NextRequest) {
  const cacheKey = 'posts:all'
  
  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT' }
    })
  }
  
  // Fetch from database
  const posts = await db.post.findMany()
  
  // Store in cache (5 minutes)
  await redis.setex(cacheKey, 300, posts)
  
  return NextResponse.json(
    { data: posts },
    { headers: { 'X-Cache': 'MISS' } }
  )
}
```

## Documentation

### OpenAPI/Swagger

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
  description: API for managing posts
servers:
  - url: https://api.example.com/v1

paths:
  /posts:
    get:
      summary: List posts
      tags:
        - Posts
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, published, archived]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Post'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    
    post:
      summary: Create a post
      tags:
        - Posts
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePostInput'
      responses:
        '201':
          description: Post created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/Post'

components:
  schemas:
    Post:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        content:
          type: string
        status:
          type: string
          enum: [draft, published, archived]
        created_at:
          type: string
          format: date-time
    
    CreatePostInput:
      type: object
      required:
        - title
        - content
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        content:
          type: string
          minLength: 1
        status:
          type: string
          enum: [draft, published]
          default: draft
    
    PaginationMeta:
      type: object
      properties:
        total:
          type: integer
        page:
          type: integer
        per_page:
          type: integer
        total_pages:
          type: integer
    
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: array
          items:
            type: object
  
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Testing

### Unit Tests

```typescript
// __tests__/api/posts.test.ts
import { POST } from '@/app/api/posts/route'
import { NextRequest } from 'next/server'

describe('POST /api/posts', () => {
  it('creates a post', async () => {
    const request = new NextRequest('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Post',
        content: 'Test content'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.data.title).toBe('Test Post')
  })

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(422)
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })
})
```

### Integration Tests

```typescript
describe('Posts API Integration', () => {
  let authToken: string

  beforeAll(async () => {
    // Get auth token
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    })
    const { token } = await response.json()
    authToken = token
  })

  it('full CRUD workflow', async () => {
    // Create
    const createRes = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Integration Test',
        content: 'Test content'
      })
    })
    const { data: created } = await createRes.json()
    expect(created.id).toBeDefined()

    // Read
    const getRes = await fetch(`http://localhost:3000/api/posts/${created.id}`)
    const { data: fetched } = await getRes.json()
    expect(fetched.title).toBe('Integration Test')

    // Update
    const updateRes = await fetch(
      `http://localhost:3000/api/posts/${created.id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Updated Title'
        })
      }
    )
    const { data: updated } = await updateRes.json()
    expect(updated.title).toBe('Updated Title')

    // Delete
    const deleteRes = await fetch(
      `http://localhost:3000/api/posts/${created.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    )
    expect(deleteRes.status).toBe(200)
  })
})
```

## Best Practices

### Do's ✅

- **Use appropriate HTTP methods and status codes**
- **Version your API from the start**
- **Implement pagination for list endpoints**
- **Validate all input data**
- **Use consistent error formats**
- **Implement rate limiting**
- **Cache responses where appropriate**
- **Document your API (OpenAPI/GraphQL schema)**
- **Use authentication and authorization**
- **Log API usage and errors**
- **Support filtering, sorting, field selection**
- **Use ETags for conditional requests**
- **Implement CORS correctly**
- **Use HTTPS in production**

### Don'ts ❌

- **Don't expose internal IDs**
- **Don't return sensitive data in responses**
- **Don't use verbs in REST URLs**
- **Don't forget to handle edge cases**
- **Don't return stack traces to clients**
- **Don't use GET for state-changing operations**
- **Don't ignore validation**
- **Don't forget about N+1 queries (use DataLoader)**
- **Don't skip error handling**
- **Don't hardcode configuration**

## Quick Reference

### REST Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success, no body
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource missing
- `422 Unprocessable` - Validation error
- `429 Too Many Requests` - Rate limit
- `500 Internal Error` - Server error

### Common Headers
```
Content-Type: application/json
Authorization: Bearer <token>
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e"
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### GraphQL Query Examples
```graphql
# Query
query {
  posts(limit: 10, status: PUBLISHED) {
    id
    title
    author {
      name
    }
  }
}

# Mutation
mutation {
  createPost(input: {
    title: "New Post"
    content: "Content"
  }) {
    id
    title
  }
}

# Subscription
subscription {
  postCreated {
    id
    title
  }
}
```