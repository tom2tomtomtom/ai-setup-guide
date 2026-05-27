---
name: naming-conventions-guide
description: Naming conventions across database, API, frontend, and URLs with transformation utilities. Use when choosing between camelCase/snake_case/kebab-case, transforming keys between layers, or setting up naming standards for a new project.
---

# Naming Conventions Guide

A comprehensive guide for consistent naming across your entire stack - database, API, frontend, and URLs. Eliminates the mental overhead of switching between snake_case, camelCase, kebab-case, and provides transformation utilities.

## When to Use This Skill

Use this skill when:
- Starting a new project and establishing conventions
- Refactoring inconsistent naming across codebase
- Building APIs that transform between layers
- Onboarding developers to project conventions
- Debugging naming-related issues
- Setting up linting rules for consistency
- Working across database, backend, and frontend

---

## The Problem

**Different layers use different conventions:**

```
Database:     user_email, created_at, is_active
API Response: userEmail, createdAt, isActive
Frontend:     userEmail, createdAt, isActive
URL:          /api/users/user-profile
Constants:    MAX_UPLOAD_SIZE, API_BASE_URL
CSS/HTML:     user-profile-card, data-user-id
```

**Result:** Mental overhead, bugs, inconsistent code.

---

## Naming Convention Types

### 1. camelCase
**Format:** firstWordLowerRestCapitalized
**Use:** JavaScript/TypeScript variables, functions, methods

```typescript
const userName = 'John';
const isActive = true;
const createdAt = new Date();

function getUserProfile() {}
const handleSubmit = () => {};
```

---

### 2. PascalCase
**Format:** AllWordsCapitalized
**Use:** Classes, components, types, interfaces

```typescript
class UserService {}
interface UserProfile {}
type ApiResponse = {};

// React components
function UserCard() {}
const ProfilePage = () => {};
```

---

### 3. snake_case
**Format:** all_words_lowercase_with_underscores
**Use:** Database tables, columns, Python variables

```sql
-- PostgreSQL
CREATE TABLE user_profiles (
  user_id UUID,
  email_address VARCHAR(255),
  created_at TIMESTAMP,
  is_verified BOOLEAN
);
```

```python
# Python
def get_user_profile(user_id: str):
    return user_profile
```

---

### 4. kebab-case
**Format:** all-words-lowercase-with-hyphens
**Use:** URLs, CSS classes, file names, HTML attributes

```html
<!-- HTML/CSS -->
<div class="user-profile-card" data-user-id="123">
  <img class="profile-image" />
</div>
```

```
// URLs
GET /api/user-profiles/123
GET /api/order-history
```

```
// File names
user-profile.tsx
api-client.ts
database-helpers.ts
```

---

### 5. SCREAMING_SNAKE_CASE
**Format:** ALL_WORDS_UPPERCASE_WITH_UNDERSCORES
**Use:** Constants, environment variables

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

// .env file
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_test_...
MAX_CONNECTIONS=100
```

---

## Layer-by-Layer Conventions

### Database Layer (PostgreSQL/MySQL)

**Use:** `snake_case` for everything

```sql
-- Tables: plural, snake_case
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email_address VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(500),
  birth_date DATE
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  published_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email_address);
CREATE INDEX idx_posts_author ON blog_posts(author_id);

-- Functions
CREATE FUNCTION get_user_post_count(user_id UUID) 
RETURNS INTEGER AS $$
  SELECT COUNT(*) FROM blog_posts WHERE author_id = user_id;
$$ LANGUAGE sql;
```

**Common Patterns:**
- Primary keys: `id`
- Foreign keys: `{table_singular}_id` (e.g., `user_id`, `post_id`)
- Timestamps: `created_at`, `updated_at`, `deleted_at`, `published_at`
- Booleans: `is_{adjective}`, `has_{noun}` (e.g., `is_active`, `has_avatar`)
- Soft delete: `deleted_at` (NULL = not deleted)

---

### API Layer (Backend)

**Use:** `camelCase` for JSON, `kebab-case` for URLs

#### RESTful API Endpoints

```typescript
// Resource naming: plural, kebab-case
GET    /api/users                    // List users
POST   /api/users                    // Create user
GET    /api/users/:id                // Get user by ID
PUT    /api/users/:id                // Update user (full)
PATCH  /api/users/:id                // Update user (partial)
DELETE /api/users/:id                // Delete user

// Nested resources
GET    /api/users/:id/posts          // User's posts
POST   /api/users/:id/posts          // Create post for user
GET    /api/posts/:id/comments       // Post's comments

// Actions/operations (use verbs sparingly)
POST   /api/users/:id/verify-email   // Action: verify email
POST   /api/orders/:id/cancel        // Action: cancel order
POST   /api/posts/:id/publish        // Action: publish post

// Filtering, sorting, pagination
GET    /api/users?status=active&sort=createdAt&order=desc&page=1&limit=20

// Search
GET    /api/search/users?q=john
GET    /api/users/search?query=john

// Versioning
GET    /api/v1/users
GET    /api/v2/users
```

**Endpoint Naming Rules:**

1. **Use plural nouns:** `/users`, not `/user`
2. **Use kebab-case:** `/user-profiles`, not `/userProfiles` or `/user_profiles`
3. **No verbs in URLs:** `/users/123`, not `/getUser/123`
4. **Actions as sub-resources:** `/users/123/activate`, not `/activateUser/123`
5. **Use HTTP methods:** GET, POST, PUT, PATCH, DELETE
6. **Query params for filters:** `?status=active`, not `/users/active`

---

#### JSON Response Format

**Use:** `camelCase` for all JSON keys

```typescript
// ✅ Good: camelCase
{
  "id": "123",
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "createdAt": "2024-01-15T10:00:00Z",
  "isActive": true,
  "profileUrl": "/users/john-doe",
  "settings": {
    "emailNotifications": true,
    "darkMode": false
  }
}

// ❌ Bad: snake_case in JSON (confusing for frontend)
{
  "first_name": "John",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Common JSON Patterns:**
- IDs: `id`, `userId`, `postId`
- Timestamps: `createdAt`, `updatedAt`, `publishedAt` (ISO 8601 format)
- Booleans: `isActive`, `hasAvatar`, `canEdit`
- URLs: `profileUrl`, `avatarUrl`, `imageUrl`
- Counts: `postCount`, `followerCount`
- Lists: `users`, `posts`, `comments` (plural)

---

#### API Response Wrapper

```typescript
// Success response
{
  "data": {
    "id": "123",
    "name": "John"
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z",
    "version": "1.0"
  }
}

// List response with pagination
{
  "data": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalCount": 100
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": [
      {
        "field": "emailAddress",
        "message": "Must be a valid email"
      }
    ]
  }
}
```

---

### Frontend Layer (React/TypeScript)

**Use:** `camelCase` for variables/functions, `PascalCase` for components

```typescript
// Components: PascalCase
export function UserProfileCard() {}
export const BlogPostList = () => {};

// Component files: kebab-case
// user-profile-card.tsx
// blog-post-list.tsx

// Variables, functions: camelCase
const userName = 'John';
const isAuthenticated = true;
const userProfile = { firstName: 'John' };

function getUserData() {}
const handleSubmit = () => {};

// Custom hooks: camelCase with 'use' prefix
function useUserProfile() {}
const useAuth = () => {};

// Types/Interfaces: PascalCase
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

type ApiResponse<T> = {
  data: T;
  error?: string;
};

// Constants: SCREAMING_SNAKE_CASE
const MAX_USERNAME_LENGTH = 50;
const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

// Enums: PascalCase for enum, SCREAMING_SNAKE_CASE for values
enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}
```

---

### CSS/Tailwind Conventions

**Use:** `kebab-case` for custom classes, follow Tailwind conventions

```css
/* Custom CSS classes: kebab-case */
.user-profile-card {
  padding: 1rem;
}

.blog-post-header {
  margin-bottom: 2rem;
}

.nav-menu-item {
  display: flex;
}

/* BEM convention (optional) */
.user-card {}
.user-card__header {}
.user-card__body {}
.user-card--featured {}
```

```html
<!-- HTML attributes: kebab-case -->
<div 
  class="user-profile-card"
  data-user-id="123"
  data-test-id="profile-card"
  aria-label="User profile"
>
</div>
```

---

## Transformation Utilities

### Case Conversion Functions

```typescript
// camelCase ↔ snake_case
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// camelCase ↔ kebab-case
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// snake_case ↔ kebab-case
function snakeToKebab(str: string): string {
  return str.replace(/_/g, '-');
}

function kebabToSnake(str: string): string {
  return str.replace(/-/g, '_');
}

// Examples
camelToSnake('firstName')      // 'first_name'
snakeToCamel('first_name')     // 'firstName'
camelToKebab('firstName')      // 'first-name'
kebabToCamel('first-name')     // 'firstName'
```

---

### Object Key Transformation

```typescript
type CaseTransform = 'camelToSnake' | 'snakeToCamel' | 'camelToKebab' | 'kebabToCamel';

function transformKeys<T extends Record<string, any>>(
  obj: T,
  transform: CaseTransform
): any {
  const transformer = {
    camelToSnake,
    snakeToCamel,
    camelToKebab,
    kebabToCamel,
  }[transform];

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, transform));
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = transformer(key);
      acc[newKey] = transformKeys(obj[key], transform);
      return acc;
    }, {} as any);
  }

  return obj;
}

// Usage: Database → API
const dbUser = {
  id: '123',
  first_name: 'John',
  last_name: 'Doe',
  email_address: 'john@example.com',
  created_at: '2024-01-15',
};

const apiUser = transformKeys(dbUser, 'snakeToCamel');
// {
//   id: '123',
//   firstName: 'John',
//   lastName: 'Doe',
//   emailAddress: 'john@example.com',
//   createdAt: '2024-01-15',
// }
```

---

### Database Query Transformation (Supabase Example)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Fetch from database (snake_case)
const { data: dbUsers } = await supabase
  .from('user_profiles')
  .select('id, first_name, last_name, email_address, created_at');

// Transform to camelCase for API
const apiUsers = dbUsers?.map(user => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  emailAddress: user.email_address,
  createdAt: user.created_at,
}));

// Or use transformation utility
const apiUsers2 = dbUsers?.map(user => transformKeys(user, 'snakeToCamel'));
```

---

### API Client with Auto-Transform

```typescript
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    const data = await response.json();
    return transformKeys(data, 'snakeToCamel') as T;
  }

  async post<T>(path: string, body: any): Promise<T> {
    // Transform camelCase → snake_case for API
    const transformedBody = transformKeys(body, 'camelToSnake');
    
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformedBody),
    });
    
    const data = await response.json();
    // Transform response back to camelCase
    return transformKeys(data, 'snakeToCamel') as T;
  }
}

// Usage
const api = new ApiClient('https://api.example.com');

// Send camelCase, receive camelCase (auto-transformed)
const user = await api.post('/users', {
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john@example.com',
});
```

---

## Common Patterns

### User-Related Fields

```typescript
// Database (snake_case)
user_id, user_name, email_address, first_name, last_name
created_at, updated_at, last_login_at
is_active, is_verified, is_admin
has_avatar, has_completed_onboarding

// API/Frontend (camelCase)
userId, userName, emailAddress, firstName, lastName
createdAt, updatedAt, lastLoginAt
isActive, isVerified, isAdmin
hasAvatar, hasCompletedOnboarding
```

---

### Timestamps

```typescript
// Database (snake_case)
created_at, updated_at, deleted_at
published_at, archived_at, verified_at
started_at, completed_at, due_at

// API/Frontend (camelCase)
createdAt, updatedAt, deletedAt
publishedAt, archivedAt, verifiedAt
startedAt, completedAt, dueAt

// Format: ISO 8601
"2024-01-15T10:30:00Z"
```

---

### Booleans

```typescript
// Prefix with is/has/can/should

// Database (snake_case)
is_active, is_verified, is_public
has_avatar, has_subscription
can_edit, can_delete
should_notify

// API/Frontend (camelCase)
isActive, isVerified, isPublic
hasAvatar, hasSubscription
canEdit, canDelete
shouldNotify
```

---

### IDs and References

```typescript
// Database (snake_case)
id                    // Primary key
user_id              // Foreign key
author_id            // Foreign key
parent_id            // Self-reference
external_id          // Third-party ID

// API/Frontend (camelCase)
id
userId
authorId
parentId
externalId
```

---

### URLs and Slugs

```typescript
// Database (snake_case)
profile_url
avatar_url
image_url
thumbnail_url
slug

// API/Frontend (camelCase)
profileUrl
avatarUrl
imageUrl
thumbnailUrl
slug

// Actual URL format (kebab-case)
/users/john-doe
/posts/my-first-blog-post
/products/wireless-headphones
```

---

### Counts and Aggregates

```typescript
// Database (snake_case)
post_count
follower_count
total_views
average_rating

// API/Frontend (camelCase)
postCount
followerCount
totalViews
averageRating
```

---

## API Endpoint Patterns

### RESTful Resource Patterns

```typescript
// Users
GET    /api/users                     // List all users
GET    /api/users/:id                 // Get specific user
POST   /api/users                     // Create user
PUT    /api/users/:id                 // Replace user
PATCH  /api/users/:id                 // Update user
DELETE /api/users/:id                 // Delete user

// User's nested resources
GET    /api/users/:id/posts           // User's posts
GET    /api/users/:id/followers       // User's followers
GET    /api/users/:id/settings        // User's settings

// Posts
GET    /api/posts                     // List posts
GET    /api/posts/:id                 // Get post
GET    /api/posts/:id/comments        // Post's comments
GET    /api/posts/:id/likes           // Post's likes

// Actions (use POST for side effects)
POST   /api/users/:id/follow          // Follow user
POST   /api/users/:id/unfollow        // Unfollow user
POST   /api/posts/:id/publish         // Publish post
POST   /api/posts/:id/archive         // Archive post
POST   /api/orders/:id/cancel         // Cancel order
```

---

### Query Parameters

```typescript
// Filtering
GET /api/users?status=active
GET /api/posts?published=true&author=123

// Sorting
GET /api/users?sortBy=createdAt&order=desc
GET /api/posts?sort=-createdAt  // Minus = descending

// Pagination
GET /api/users?page=1&limit=20
GET /api/users?offset=0&limit=20

// Search
GET /api/users?q=john
GET /api/users?search=john

// Field selection (sparse fieldsets)
GET /api/users?fields=id,name,email

// Expand/include relations
GET /api/posts?include=author,comments
GET /api/users?expand=profile,settings

// Multiple filters
GET /api/posts?status=published&category=tech&author=123&sort=-createdAt
```

---

### Nested vs Flat Resources

```typescript
// ✅ Nested: When resource belongs to parent
GET /api/users/:userId/posts
POST /api/users/:userId/posts
GET /api/posts/:postId/comments

// ✅ Flat: When resource is independent or has multiple parents
GET /api/posts?userId=123           // Instead of /api/users/123/posts
GET /api/comments?postId=456        // Instead of /api/posts/456/comments

// Use flat when:
// - Resource can be accessed without parent
// - Resource has multiple parents
// - Need to query across all resources
```

---

### Bulk Operations

```typescript
// Bulk create
POST /api/users/bulk
Body: [{ name: 'User 1' }, { name: 'User 2' }]

// Bulk update
PATCH /api/users/bulk
Body: [
  { id: '1', status: 'active' },
  { id: '2', status: 'inactive' }
]

// Bulk delete
DELETE /api/users/bulk
Body: { ids: ['1', '2', '3'] }

// Or use query params
DELETE /api/users?ids=1,2,3
```

---

### API Versioning in URLs

```typescript
// Version in URL path (recommended)
GET /api/v1/users
GET /api/v2/users

// Version in subdomain
GET https://api-v1.example.com/users
GET https://api-v2.example.com/users

// Version in header (less visible)
GET /api/users
Header: Accept: application/vnd.example.v1+json

// Don't version unnecessarily - only when breaking changes
```

---

## File Naming Conventions

### React/TypeScript Files

```
// Components: PascalCase or kebab-case
UserProfile.tsx
user-profile.tsx  ← Recommended (easier to read in file tree)

// Component folders
user-profile/
  ├── user-profile.tsx
  ├── user-profile.test.tsx
  ├── user-profile.styles.ts
  └── index.ts

// Utilities: kebab-case
api-client.ts
date-helpers.ts
string-utils.ts

// Hooks: camelCase with 'use' prefix
useAuth.ts
useUserProfile.ts

// Types: kebab-case
user-types.ts
api-types.ts

// Constants: kebab-case
api-constants.ts
app-config.ts
```

---

### Backend Files

```
// Routes: kebab-case
user-routes.ts
post-routes.ts
auth-routes.ts

// Controllers: kebab-case
user-controller.ts
post-controller.ts

// Services: kebab-case
email-service.ts
payment-service.ts

// Models: PascalCase or kebab-case
User.ts
user-model.ts  ← Recommended

// Utilities: kebab-case
database-helpers.ts
validation-utils.ts
```

---

## Linting and Enforcement

### ESLint Rules

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Enforce camelCase for variables
    'camelcase': ['error', {
      properties: 'always',
      ignoreDestructuring: false,
      allow: ['^UNSAFE_'], // Allow React UNSAFE_ methods
    }],
    
    // Component names PascalCase
    'react/jsx-pascal-case': 'error',
    
    // File naming (with eslint-plugin-filename-rules)
    'filename-rules/match': [2, 'kebab-case'],
  }
};
```

---

### TypeScript Naming Convention Rules

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]  // Optional: IUserProfile
      }
    ]
  }
}
```

---

### Database Naming Conventions (SQL)

```sql
-- Create schema with naming conventions enforced
COMMENT ON TABLE users IS 'Use snake_case for all columns';

-- Enforce naming in migrations
-- migration: 001_create_users_table.sql
-- Always use snake_case
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email_address VARCHAR(255) NOT NULL,  -- snake_case
  created_at TIMESTAMP DEFAULT NOW()     -- snake_case
);

-- Naming convention check (for new columns)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name !~ '^[a-z][a-z0-9]*(_[a-z0-9]+)*$'
  ) THEN
    RAISE EXCEPTION 'Column names must be snake_case';
  END IF;
END $$;
```

---

## Real-World Example: Full Stack Flow

### 1. Database Schema (snake_case)

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  published_at TIMESTAMP,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Database Query Result

```typescript
// Raw database result (snake_case)
const dbPost = {
  id: '123',
  author_id: '456',
  title: 'My First Post',
  slug: 'my-first-post',
  content: 'Post content...',
  published_at: '2024-01-15T10:00:00Z',
  is_published: true,
  view_count: 100,
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T09:00:00Z',
};
```

---

### 3. Backend API Handler (transforms to camelCase)

```typescript
// api/posts/[id].ts
export async function GET(req: Request) {
  const { id } = req.params;
  
  // Get from database (snake_case)
  const dbPost = await db.query(
    'SELECT * FROM blog_posts WHERE id = $1',
    [id]
  );
  
  // Transform to camelCase for API
  const apiPost = {
    id: dbPost.id,
    authorId: dbPost.author_id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content,
    publishedAt: dbPost.published_at,
    isPublished: dbPost.is_published,
    viewCount: dbPost.view_count,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
  };
  
  return Response.json({ data: apiPost });
}
```

---

### 4. API Response (camelCase)

```json
{
  "data": {
    "id": "123",
    "authorId": "456",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "Post content...",
    "publishedAt": "2024-01-15T10:00:00Z",
    "isPublished": true,
    "viewCount": 100,
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-01-15T09:00:00Z"
  }
}
```

---

### 5. Frontend Type (camelCase)

```typescript
// types/blog-post.ts
interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

---

### 6. Frontend Component (camelCase + PascalCase)

```typescript
// components/blog-post-card.tsx
interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = formatDate(post.publishedAt);
  const isNew = isWithinDays(post.createdAt, 7);
  
  return (
    <div className="blog-post-card" data-post-id={post.id}>
      <h2>{post.title}</h2>
      {isNew && <span className="new-badge">New</span>}
      <p>{post.content.slice(0, 200)}...</p>
      <div className="post-meta">
        <span>{formattedDate}</span>
        <span>{post.viewCount} views</span>
      </div>
    </div>
  );
}
```

---

### 7. URL/Route (kebab-case)

```
GET /api/blog-posts/123
GET /blog-posts/my-first-post
```

---

### 8. CSS Classes (kebab-case)

```css
.blog-post-card {
  padding: 1rem;
  border: 1px solid #ddd;
}

.blog-post-card .post-meta {
  display: flex;
  gap: 1rem;
}

.blog-post-card .new-badge {
  background: #ff0000;
  color: white;
}
```

---

## Decision Tree

### "What convention should I use?"

```
Database column?
  → snake_case

API endpoint?
  → kebab-case (/user-profiles)

JSON key in API?
  → camelCase (firstName)

React component?
  → PascalCase (UserProfile)

React component file?
  → kebab-case (user-profile.tsx)

JavaScript variable?
  → camelCase (const userName)

TypeScript type/interface?
  → PascalCase (interface UserProfile)

Constant?
  → SCREAMING_SNAKE_CASE (const MAX_SIZE)

Environment variable?
  → SCREAMING_SNAKE_CASE (DATABASE_URL)

CSS class?
  → kebab-case (.user-profile-card)

HTML attribute?
  → kebab-case (data-user-id)

Function name?
  → camelCase (getUserData)

Custom hook?
  → camelCase with 'use' prefix (useUserData)

File name?
  → kebab-case (user-data-service.ts)

URL slug?
  → kebab-case (/my-blog-post)
```

---

## Common Mistakes

### ❌ Mixing Conventions in Same Layer

```typescript
// ❌ Bad: Inconsistent API response
{
  "firstName": "John",        // camelCase
  "last_name": "Doe",         // snake_case
  "email-address": "john@..."  // kebab-case
}

// ✅ Good: Consistent camelCase
{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@..."
}
```

---

### ❌ Wrong Convention for Layer

```typescript
// ❌ Bad: camelCase in database
CREATE TABLE users (
  userId UUID,        // Wrong!
  emailAddress TEXT   // Wrong!
);

// ✅ Good: snake_case in database
CREATE TABLE users (
  user_id UUID,
  email_address TEXT
);
```

---

### ❌ Not Transforming Between Layers

```typescript
// ❌ Bad: Exposing database naming to API
app.get('/users/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = $1');
  res.json(user); // Still has snake_case keys!
});

// ✅ Good: Transform to camelCase
app.get('/users/:id', async (req, res) => {
  const dbUser = await db.query('SELECT * FROM users WHERE id = $1');
  const apiUser = transformKeys(dbUser, 'snakeToCamel');
  res.json(apiUser);
});
```

---

### ❌ Inconsistent Boolean Prefixes

```typescript
// ❌ Bad: Inconsistent
{
  "active": true,       // Missing 'is'
  "hasAvatar": true,
  "verified": true      // Missing 'is'
}

// ✅ Good: Consistent prefixes
{
  "isActive": true,
  "hasAvatar": true,
  "isVerified": true
}
```

---

## Quick Reference

### Layer Conventions

| Layer | Convention | Example |
|-------|-----------|---------|
| Database tables | snake_case | `user_profiles` |
| Database columns | snake_case | `first_name`, `created_at` |
| API endpoints | kebab-case | `/user-profiles` |
| JSON keys | camelCase | `firstName`, `createdAt` |
| React components | PascalCase | `UserProfile` |
| Component files | kebab-case | `user-profile.tsx` |
| JS variables | camelCase | `userName`, `isActive` |
| Functions | camelCase | `getUserData()` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SIZE` |
| CSS classes | kebab-case | `.user-card` |
| File names | kebab-case | `api-client.ts` |

---

### Common Field Patterns

| Type | Database | API/Frontend |
|------|----------|--------------|
| Primary key | `id` | `id` |
| Foreign key | `user_id` | `userId` |
| Timestamp | `created_at` | `createdAt` |
| Boolean | `is_active` | `isActive` |
| URL | `avatar_url` | `avatarUrl` |
| Count | `post_count` | `postCount` |

---

### API Endpoint Patterns

| Action | Method | Endpoint |
|--------|--------|----------|
| List | GET | `/api/users` |
| Get | GET | `/api/users/:id` |
| Create | POST | `/api/users` |
| Update (full) | PUT | `/api/users/:id` |
| Update (partial) | PATCH | `/api/users/:id` |
| Delete | DELETE | `/api/users/:id` |
| Nested | GET | `/api/users/:id/posts` |
| Action | POST | `/api/users/:id/verify` |

---

## Best Practices

### DO:
✓ Be consistent within each layer
✓ Transform between layers at boundaries
✓ Use plural nouns for collections
✓ Use kebab-case for URLs and files
✓ Use camelCase for JavaScript/JSON
✓ Use snake_case for databases
✓ Prefix booleans (is, has, can)
✓ Use ISO 8601 for timestamps
✓ Document your conventions in README
✓ Enforce with linting rules

### DON'T:
✗ Mix conventions within same layer
✗ Use camelCase in database
✗ Use snake_case in URLs
✗ Use verbs in REST endpoints
✗ Abbreviate unnecessarily (usr → user)
✗ Use special characters in names
✗ Create inconsistent boolean patterns
✗ Expose database naming to API
✗ Skip transformation utilities
✗ Ignore linting warnings

---

## Setup Checklist

**For New Projects:**

1. ☐ Document naming conventions in README
2. ☐ Set up ESLint with naming rules
3. ☐ Create transformation utilities
4. ☐ Define TypeScript types with camelCase
5. ☐ Set database schema to snake_case
6. ☐ Configure API to return camelCase JSON
7. ☐ Use kebab-case for all file names
8. ☐ Add pre-commit hooks for linting
9. ☐ Create examples in docs
10. ☐ Share with team

**For Existing Projects:**

1. ☐ Audit current naming conventions
2. ☐ Document inconsistencies
3. ☐ Create migration plan
4. ☐ Add transformation layer
5. ☐ Gradually refactor (start with new code)
6. ☐ Enable linting rules
7. ☐ Update documentation
8. ☐ Communicate to team

---

**Remember:** Consistency is more important than the specific convention. Pick one convention per layer and stick with it!
