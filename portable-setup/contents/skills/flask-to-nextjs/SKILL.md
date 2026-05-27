---
name: flask-to-nextjs
description: Migrates Python Flask/FastAPI backends to Next.js App Router API routes with Supabase, translating routes, request handling, auth, and database queries. Use when converting Python APIs to TypeScript, rebuilding Flask apps in Next.js, or porting backend logic.
---

# Flask/FastAPI to Next.js App Router Migration

Migrate Python Flask or FastAPI backends to Next.js 14 App Router API routes with Supabase, TypeScript, and Tailwind. Covers route mapping, request/response translation, auth migration, database layer conversion, background tasks, and environment variables.

Stack: Next.js 14 App Router, Supabase, TypeScript, Tailwind. Deployed on Vercel.

---

## When to Use This Skill

- Converting a Flask or FastAPI backend to Next.js API routes
- Rebuilding Culture Wire (or similar) from Python to TypeScript
- Porting individual Python API endpoints to route handlers
- Migrating SQLAlchemy or raw SQL queries to Supabase client
- Replacing Flask auth decorators with Next.js middleware
- Moving Celery/background tasks to n8n webhooks or Vercel cron

---

## 1. Route Mapping

### Flask @app.route to Next.js route.ts

Flask defines routes with decorators on functions. Next.js uses the filesystem.

```python
# Flask
@app.route("/api/users", methods=["GET"])
def get_users():
    return jsonify(users)

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    return jsonify(user)

@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.json
    return jsonify(new_user), 201
```

```typescript
// Next.js: app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // GET /api/users
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json(newUser, { status: 201 });
}
```

```typescript
// Next.js: app/api/users/[id]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 15+ params are async
  return NextResponse.json(user);
}
```

### FastAPI @router to Next.js route handlers

```python
# FastAPI
@router.get("/api/items/{item_id}")
async def get_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@router.put("/api/items/{item_id}")
async def update_item(item_id: int, item: ItemModel):
    return {"item_id": item_id, **item.dict()}

@router.delete("/api/items/{item_id}")
async def delete_item(item_id: int):
    return {"deleted": True}
```

```typescript
// Next.js: app/api/items/[itemId]/route.ts
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ itemId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { itemId } = await params;
  const q = req.nextUrl.searchParams.get("q");
  return NextResponse.json({ itemId, q });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { itemId } = await params;
  const body = await req.json();
  return NextResponse.json({ itemId, ...body });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { itemId } = await params;
  return NextResponse.json({ deleted: true });
}
```

### Route Mapping Cheat Sheet

| Flask/FastAPI | Next.js App Router |
|---|---|
| `@app.route("/api/foo")` | `app/api/foo/route.ts` |
| `@app.route("/api/foo/<id>")` | `app/api/foo/[id]/route.ts` |
| `@app.route("/api/foo/<path:rest>")` | `app/api/foo/[...rest]/route.ts` |
| `methods=["GET"]` | `export async function GET()` |
| `methods=["POST"]` | `export async function POST()` |
| `methods=["PUT"]` | `export async function PUT()` |
| `methods=["DELETE"]` | `export async function DELETE()` |
| `methods=["PATCH"]` | `export async function PATCH()` |
| Blueprint prefix `/api/v1` | Route group `app/api/v1/` folder |
| FastAPI `APIRouter(prefix="/api")` | Folder nesting in `app/api/` |

### Bad vs Good: Route Structure

```python
# Flask — single file with all routes (common in small apps)
# app.py
@app.route("/api/users", methods=["GET", "POST"])
@app.route("/api/users/<id>", methods=["GET", "PUT", "DELETE"])
@app.route("/api/items", methods=["GET", "POST"])
```

```
# BAD: Dumping everything into one massive route.ts
app/api/route.ts  ← handles /users, /items, etc. via URL parsing

# GOOD: One route.ts per resource, filesystem does the routing
app/
  api/
    users/
      route.ts          ← GET (list), POST (create)
      [id]/
        route.ts        ← GET (detail), PUT (update), DELETE
    items/
      route.ts
      [id]/
        route.ts
```

---

## 2. Request/Response Translation

### Reading Request Data

```python
# Flask — request object
from flask import request, jsonify

@app.route("/api/submit", methods=["POST"])
def submit():
    # JSON body
    data = request.json                    # or request.get_json()
    name = data.get("name", "")

    # Query params
    page = request.args.get("page", 1, type=int)

    # Headers
    token = request.headers.get("Authorization")

    # Cookies
    session_id = request.cookies.get("session_id")

    # Form data
    file = request.files.get("upload")

    return jsonify({"ok": True}), 201
```

```typescript
// Next.js — NextRequest object
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // JSON body — MUST await (async, unlike Flask)
  const data = await req.json();
  const name = data.name ?? "";

  // Query params
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");

  // Headers
  const token = req.headers.get("authorization");

  // Cookies
  const sessionId = req.cookies.get("session_id")?.value;

  // Form data
  const formData = await req.formData();
  const file = formData.get("upload") as File;

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

### Response Patterns

| Flask | Next.js |
|---|---|
| `jsonify(data)` | `NextResponse.json(data)` |
| `jsonify(data), 201` | `NextResponse.json(data, { status: 201 })` |
| `jsonify({"error": "Not found"}), 404` | `NextResponse.json({ error: "Not found" }, { status: 404 })` |
| `make_response("", 204)` | `new NextResponse(null, { status: 204 })` |
| `redirect(url_for("index"))` | `NextResponse.redirect(new URL("/", req.url))` |
| `abort(403)` | `NextResponse.json({ error: "Forbidden" }, { status: 403 })` |
| Setting headers via `response.headers["X-Custom"]` | `NextResponse.json(data, { headers: { "X-Custom": "value" } })` |
| Setting cookies via `response.set_cookie(...)` | See cookie example below |

### Setting Cookies

```python
# Flask
resp = make_response(jsonify({"ok": True}))
resp.set_cookie("token", value="abc", httponly=True, samesite="Lax", max_age=3600)
return resp
```

```typescript
// Next.js
const response = NextResponse.json({ ok: true });
response.cookies.set("token", "abc", {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 3600,
});
return response;
```

### Bad vs Good: Request Parsing

```python
# Flask — synchronous, dict-like access
data = request.json
name = data["name"]  # KeyError if missing
```

```typescript
// BAD: No validation, crashes on missing fields
export async function POST(req: NextRequest) {
  const data = await req.json();
  const name = data.name; // undefined, not KeyError — silent bug
}

// GOOD: Validate with Zod before using
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const raw = await req.json();
  const parsed = CreateUserSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email } = parsed.data; // Fully typed
  // ...
}
```

---

## 3. Auth Migration

### Flask Decorators to Next.js Middleware

```python
# Flask — decorator-based auth
from functools import wraps
from flask import request, jsonify

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        user = verify_token(token)
        if not user:
            return jsonify({"error": "Invalid token"}), 401
        request.user = user
        return f(*args, **kwargs)
    return decorated

@app.route("/api/protected")
@require_auth
def protected():
    return jsonify({"user": request.user})
```

```typescript
// Next.js: middleware.ts (root of project)
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect API routes
  if (req.nextUrl.pathname.startsWith("/api/protected") && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return res;
}

export const config = {
  matcher: ["/api/protected/:path*", "/dashboard/:path*"],
};
```

### Per-Route Auth (when middleware is too broad)

```typescript
// app/api/protected/route.ts
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // user.id is the authenticated user's UUID
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
```

### Session Handling Differences

| Flask | Next.js + Supabase |
|---|---|
| `session["user_id"] = user.id` | Supabase manages sessions via cookies automatically |
| `session.get("user_id")` | `supabase.auth.getUser()` |
| `session.pop("user_id")` | `supabase.auth.signOut()` |
| Flask-Login `current_user` | `const { data: { user } } = await supabase.auth.getUser()` |
| `@login_required` decorator | Middleware matcher or per-route check |
| Server-side session store (Redis) | Supabase JWT in httpOnly cookies |

---

## 4. Database Layer Migration

### SQLAlchemy to Supabase Client

```python
# SQLAlchemy — ORM query
from models import User, db

# Select
users = User.query.filter_by(active=True).order_by(User.created_at.desc()).limit(10).all()

# Insert
new_user = User(name="Tom", email="tom@example.com")
db.session.add(new_user)
db.session.commit()

# Update
user = User.query.get(user_id)
user.name = "Updated"
db.session.commit()

# Delete
db.session.delete(user)
db.session.commit()

# Join
results = db.session.query(User, Post).join(Post, User.id == Post.user_id).all()
```

```typescript
// Supabase client
import { createClient } from "@/lib/supabase/server";

// Select
const supabase = await createClient();
const { data: users, error } = await supabase
  .from("users")
  .select("*")
  .eq("active", true)
  .order("created_at", { ascending: false })
  .limit(10);

// Insert
const { data, error } = await supabase
  .from("users")
  .insert({ name: "Tom", email: "tom@example.com" })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from("users")
  .update({ name: "Updated" })
  .eq("id", userId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from("users")
  .delete()
  .eq("id", userId);

// Join (foreign key relationship)
const { data, error } = await supabase
  .from("users")
  .select("*, posts(*)");  // Supabase auto-joins via FK
```

### Raw SQL (psycopg2) to Supabase

```python
# psycopg2 — raw SQL
import psycopg2

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()
cur.execute("""
    SELECT u.name, COUNT(p.id) as post_count
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    WHERE u.active = true
    GROUP BY u.name
    ORDER BY post_count DESC
""")
results = cur.fetchall()
cur.close()
conn.close()
```

```typescript
// Option 1: Supabase client (preferred for simple queries)
const { data, error } = await supabase
  .from("users")
  .select("name, posts(count)")
  .eq("active", true);

// Option 2: Supabase RPC for complex queries — create a Postgres function
// In Supabase SQL editor:
// CREATE FUNCTION get_user_post_counts()
// RETURNS TABLE(name text, post_count bigint) AS $$
//   SELECT u.name, COUNT(p.id)
//   FROM users u LEFT JOIN posts p ON u.id = p.user_id
//   WHERE u.active = true GROUP BY u.name ORDER BY COUNT(p.id) DESC
// $$ LANGUAGE sql;

const { data, error } = await supabase.rpc("get_user_post_counts");
```

### Query Translation Cheat Sheet

| SQLAlchemy / Raw SQL | Supabase Client |
|---|---|
| `.filter_by(col=val)` | `.eq("col", val)` |
| `.filter(col != val)` | `.neq("col", val)` |
| `.filter(col > val)` | `.gt("col", val)` |
| `.filter(col.in_([1,2,3]))` | `.in("col", [1,2,3])` |
| `.filter(col.like("%term%"))` | `.ilike("col", "%term%")` |
| `.filter(col.is_(None))` | `.is("col", null)` |
| `.order_by(col.desc())` | `.order("col", { ascending: false })` |
| `.limit(10).offset(20)` | `.range(20, 29)` |
| `.first()` | `.single()` (errors if 0 or 2+ rows) |
| `.count()` | `.select("*", { count: "exact", head: true })` |
| `db.session.add(obj)` | `.insert(obj)` |
| `db.session.commit()` | Not needed — Supabase auto-commits |
| Transactions | `.rpc()` with a Postgres function |

### Bad vs Good: Error Handling

```python
# Flask — exceptions bubble up, Flask catches them
try:
    user = User.query.get_or_404(user_id)
except Exception:
    return jsonify({"error": "Server error"}), 500
```

```typescript
// BAD: Ignoring Supabase errors (they don't throw!)
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { data } = await supabase.from("users").select("*").eq("id", id).single();
  return NextResponse.json(data); // data is null if error — returns null to client
}

// GOOD: Always check error
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.error("DB error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

---

## 5. Background Tasks

### Celery to n8n / Vercel Cron

Flask apps commonly use Celery for background work. Next.js on Vercel has no persistent worker process, so you need alternatives.

| Python Pattern | Next.js Replacement |
|---|---|
| `@celery.task` + `task.delay()` | n8n webhook trigger + HTTP node |
| Celery Beat (scheduled tasks) | Vercel Cron Jobs (`vercel.json`) |
| `threading.Thread(target=fn).start()` | `after()` from `next/server` (fire-and-forget) |
| Long-running background job | n8n workflow or Inngest function |
| Redis queue | Supabase `pg_cron` or n8n polling |

### Fire-and-Forget with after()

```python
# Flask — background thread (hacky but common)
import threading

@app.route("/api/signup", methods=["POST"])
def signup():
    user = create_user(request.json)
    threading.Thread(target=send_welcome_email, args=(user.email,)).start()
    return jsonify(user), 201
```

```typescript
// Next.js — after() runs code after response is sent
import { after } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const user = await createUser(data);

  after(async () => {
    await sendWelcomeEmail(user.email);
  });

  return NextResponse.json(user, { status: 201 });
}
```

### Vercel Cron Jobs

```python
# Flask + Celery Beat
@celery.task
def daily_digest():
    users = User.query.filter_by(digest_enabled=True).all()
    for user in users:
        send_digest(user)

# celerybeat schedule
CELERYBEAT_SCHEDULE = {
    "daily-digest": {
        "task": "tasks.daily_digest",
        "schedule": crontab(hour=9, minute=0),
    }
}
```

```typescript
// Next.js: app/api/cron/daily-digest/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("digest_enabled", true);

  // Process users...

  return NextResponse.json({ processed: users?.length ?? 0 });
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Triggering n8n Workflows

```python
# Flask — Celery task that does complex processing
@celery.task
def process_upload(file_url, user_id):
    # Download, process, notify — takes 30+ seconds
    pass
```

```typescript
// Next.js — offload to n8n via webhook
export async function POST(req: NextRequest) {
  const { fileUrl, userId } = await req.json();

  // Fire webhook to n8n, don't wait for completion
  fetch(process.env.N8N_WEBHOOK_PROCESS_UPLOAD!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl, userId }),
  }); // intentionally not awaited

  return NextResponse.json({ status: "processing" }, { status: 202 });
}
```

---

## 6. Environment Variables

### Python os.environ to process.env

| Python | Next.js |
|---|---|
| `os.environ["SECRET_KEY"]` | `process.env.SECRET_KEY` (server only) |
| `os.environ.get("KEY", "default")` | `process.env.KEY ?? "default"` |
| `python-dotenv` / `.env` | `.env.local` (gitignored by default) |
| `.flaskenv` | `.env.local` |
| `FLASK_ENV=production` | `NODE_ENV=production` (set by Vercel) |

### File Naming

```
# Flask typical setup
.env                  # python-dotenv loads this
.env.production       # manually loaded per environment

# Next.js setup
.env                  # Loaded in all environments, committed
.env.local            # Local overrides, gitignored
.env.development      # Dev only
.env.production       # Production only
```

### Client-Side Exposure

```python
# Flask — Jinja templates can access anything passed to them
# No concept of "public" vs "private" env vars
SECRET = os.environ["SECRET_KEY"]  # Available everywhere server-side
```

```typescript
// Next.js — NEXT_PUBLIC_ prefix exposes to browser
// Server only (safe for secrets)
const dbUrl = process.env.DATABASE_URL;
const stripeSecret = process.env.STRIPE_SECRET_KEY;

// Client accessible (NEVER put secrets here)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### Bad vs Good: Env Vars

```typescript
// BAD: Secret exposed to client
// .env.local
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_xxx  // NEVER prefix secrets with NEXT_PUBLIC_

// GOOD: Only public keys get the prefix
STRIPE_SECRET_KEY=sk_live_xxx              // Server only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  // Safe for client
```

---

## 7. Common Gotchas

### Python Dict vs JavaScript Object

```python
# Python — dict access with .get() and KeyError safety
data = {"name": "Tom", "settings": {"theme": "dark"}}
name = data.get("name", "Unknown")           # Safe default
theme = data.get("settings", {}).get("theme") # Nested safe access
missing = data["missing"]                     # KeyError — crashes
```

```typescript
// TypeScript — optional chaining and nullish coalescing
const data = { name: "Tom", settings: { theme: "dark" } };
const name = data.name ?? "Unknown";            // Nullish coalescing
const theme = data.settings?.theme;             // Optional chaining
const missing = (data as any).missing;          // undefined — silent, not crash
```

**Key differences:**
- Python `dict.get(key, default)` = TypeScript `obj.key ?? default`
- Python raises `KeyError` on missing keys. JS returns `undefined` silently.
- Python `None` = TypeScript `null` (but JS also has `undefined`)
- Python `not data` catches `None`, `""`, `0`, `[]`, `{}`. JS `!data` catches `null`, `undefined`, `0`, `""`, `NaN`, but NOT `[]` or `{}`.

### Async/Await Differences

```python
# Flask — synchronous by default
@app.route("/api/data")
def get_data():
    users = db.session.query(User).all()   # Blocking call, that's fine
    return jsonify(users)

# FastAPI — async
@router.get("/api/data")
async def get_data():
    users = await db.fetch_all(query)
    return users
```

```typescript
// Next.js — ALWAYS async
export async function GET(req: NextRequest) {
  // Every I/O call must be awaited
  const { data } = await supabase.from("users").select("*");

  // Common mistake: forgetting await
  const body = req.json();     // BAD: Returns Promise, not data
  const body = await req.json(); // GOOD: Returns parsed data

  return NextResponse.json(data);
}
```

**Key difference:** Flask is synchronous — you can call `request.json` without `await`. In Next.js, `req.json()` returns a Promise. Forgetting `await` is the #1 mistake when porting Flask code.

### Error Handling Patterns

```python
# Flask — try/except with specific exceptions
from werkzeug.exceptions import NotFound, BadRequest

@app.route("/api/users/<id>")
def get_user(id):
    try:
        user = User.query.get_or_404(id)
        return jsonify(user.to_dict())
    except NotFound:
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"error": "Server error"}), 500
```

```typescript
// Next.js — try/catch, but Supabase errors don't throw
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    // Supabase returns errors in the response, not exceptions
    if (error) {
      console.error("DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    // This catches JSON parsing errors, network failures, etc.
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### Date Handling

```python
# Python — datetime
from datetime import datetime, timezone

now = datetime.now(timezone.utc)
formatted = now.isoformat()                    # "2024-01-15T10:30:00+00:00"
parsed = datetime.fromisoformat(date_string)
```

```typescript
// TypeScript — Date (or use date-fns)
const now = new Date();
const formatted = now.toISOString();           // "2024-01-15T10:30:00.000Z"
// For parsing, use date-fns or dayjs — native Date parsing is unreliable

import { parseISO, format } from "date-fns";
const parsed = parseISO(dateString);
const display = format(parsed, "MMM d, yyyy"); // "Jan 15, 2024"
```

**Gotcha:** Python `datetime` and JS `Date` both handle UTC fine. But when Supabase returns `timestamptz`, it comes as an ISO string. Never do `new Date(supabaseTimestamp)` without checking for null first.

### Python Truthy vs JavaScript Truthy

```python
# Python
bool([])     # False
bool({})     # False
bool(0)      # False
bool("")     # False
```

```typescript
// JavaScript — DIFFERENT behavior for arrays and objects
Boolean([])   // true  (empty arrays are truthy!)
Boolean({})   // true  (empty objects are truthy!)
Boolean(0)    // false
Boolean("")   // false

// When porting "if data:" from Python, check length:
if (data && data.length > 0)    // for arrays
if (data && Object.keys(data).length > 0)  // for objects
```

---

## 8. Migration Checklist

Use this for each endpoint you migrate. Copy and work through it.

### Per-Endpoint Migration

```markdown
- [ ] **Map the route**
  - Flask route path: _______________
  - Next.js file path: app/api/___/route.ts
  - HTTP methods needed: GET / POST / PUT / DELETE / PATCH

- [ ] **Create the route file**
  - Export async function for each HTTP method
  - Import NextRequest, NextResponse

- [ ] **Translate request handling**
  - [ ] Body parsing: request.json → await req.json()
  - [ ] Query params: request.args → req.nextUrl.searchParams
  - [ ] Path params: <id> → [id] folder + params argument
  - [ ] Headers: request.headers → req.headers
  - [ ] Cookies: request.cookies → req.cookies
  - [ ] Add Zod validation schema for request body

- [ ] **Migrate auth**
  - [ ] Replace @require_auth decorator with middleware or per-route check
  - [ ] Replace session["user_id"] with supabase.auth.getUser()
  - [ ] Verify RLS policies cover what Python auth logic enforced

- [ ] **Migrate database calls**
  - [ ] Replace SQLAlchemy queries with Supabase client calls
  - [ ] Replace raw SQL with .rpc() or Supabase query builder
  - [ ] Handle Supabase error objects (they don't throw!)
  - [ ] Add .select() after .insert()/.update() if you need the result

- [ ] **Add TypeScript types**
  - [ ] Define request/response types or Zod schemas
  - [ ] Generate Supabase types: `npx supabase gen types typescript`
  - [ ] Type the params object

- [ ] **Migrate response**
  - [ ] jsonify() → NextResponse.json()
  - [ ] Status codes as second argument
  - [ ] Set-Cookie → response.cookies.set()

- [ ] **Handle background work**
  - [ ] Replace threading/Celery with after(), cron, or n8n webhook
  - [ ] Verify Vercel function timeout is sufficient (10s hobby, 60s pro)

- [ ] **Environment variables**
  - [ ] Move secrets to .env.local
  - [ ] Prefix client-visible vars with NEXT_PUBLIC_
  - [ ] Add to Vercel project settings

- [ ] **Test**
  - [ ] curl or Postman each method
  - [ ] Test with missing/invalid body
  - [ ] Test without auth
  - [ ] Test error cases
```

### Full App Migration Order

1. **Inventory** — List all Flask routes (`flask routes` command or grep `@app.route`)
2. **Prioritize** — Start with read-only GET endpoints (lowest risk)
3. **Auth first** — Set up Supabase auth + middleware before migrating protected routes
4. **Database schema** — Mirror Flask models in Supabase (use migrations)
5. **Migrate GETs** — Read endpoints, verify data matches
6. **Migrate writes** — POST/PUT/DELETE, verify with integration tests
7. **Background tasks** — Move Celery tasks to n8n or cron last
8. **Kill the Flask server** — Only after all endpoints are verified

---

## Quick Reference

### One-Line Translations

```
Flask request.json         →  await req.json()
Flask request.args         →  req.nextUrl.searchParams
Flask jsonify(data)        →  NextResponse.json(data)
Flask abort(404)           →  NextResponse.json({error}, {status: 404})
Flask session["key"]       →  supabase.auth.getUser()
Flask @app.route           →  export async function GET/POST/...
Flask Blueprint            →  Folder in app/api/
SQLAlchemy .query.all()    →  supabase.from("table").select("*")
os.environ["KEY"]          →  process.env.KEY
Celery task.delay()        →  after() or n8n webhook
```

### Starter Template

Copy this for each new route:

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("table_name")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const CreateSchema = z.object({
  // Define fields here
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json();
  const parsed = CreateSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("table_name")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
```

---

## Execution Notes

When running this skill:

1. **Always ask for the Flask/FastAPI source file first.** Read the actual Python code before translating — don't guess at the route structure.
2. **Generate Supabase types** before writing queries: `npx supabase gen types typescript --project-id <id> > src/types/supabase.ts`
3. **Migrate one endpoint at a time.** Don't batch — each endpoint should work independently before moving to the next.
4. **Check for Supabase RLS.** Flask apps enforce auth in Python code. Supabase should enforce it at the database level with Row Level Security policies. If the Flask app has `WHERE user_id = current_user.id`, that should be an RLS policy, not just application code.
5. **Watch for Python-isms** that don't translate: list comprehensions become `.map()/.filter()`, `**kwargs` becomes spread operator, f-strings become template literals.
