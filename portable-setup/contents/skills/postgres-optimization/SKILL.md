---
name: postgres-optimization
description: Optimizes PostgreSQL performance with indexes, query tuning, and migration strategies; use when building scalable database applications
---

# PostgreSQL Optimization

Comprehensive guide for optimizing PostgreSQL databases, covering indexing strategies, query performance tuning, schema design, connection management, and production best practices.

## When to Use This Skill

Use when:
- Experiencing slow database queries
- Building applications that need to scale
- Designing database schemas for performance
- Implementing complex queries with JOINs
- Setting up production PostgreSQL configurations
- Debugging query performance issues
- Planning database migrations
- Managing large datasets (millions of rows)
- Implementing full-text search
- Optimizing database connections

## Query Performance Analysis

### EXPLAIN and EXPLAIN ANALYZE

**Basic EXPLAIN:**
```sql
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

-- Output shows query plan:
-- Seq Scan on users  (cost=0.00..25.88 rows=6 width=72)
--   Filter: (email = 'user@example.com'::text)
```

**EXPLAIN ANALYZE (actual execution):**
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Shows actual execution time:
-- Seq Scan on users  (cost=0.00..25.88 rows=6 width=72) 
--   (actual time=0.015..0.234 rows=1 loops=1)
-- Planning Time: 0.103 ms
-- Execution Time: 0.267 ms
```

**Detailed output:**
```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT u.*, p.* 
FROM users u 
JOIN profiles p ON u.id = p.user_id 
WHERE u.created_at > NOW() - INTERVAL '7 days';
```

### Reading Query Plans

**Cost interpretation:**
```
Seq Scan on users  (cost=0.00..25.88 rows=6 width=72)
                          ↑      ↑     ↑      ↑
                    startup  total  est.  row
                    cost     cost   rows  width
```

**Common node types:**
- **Seq Scan**: Full table scan (usually slow for large tables)
- **Index Scan**: Uses index (good)
- **Index Only Scan**: Uses covering index (best)
- **Bitmap Index Scan**: Multiple index scan (good for OR conditions)
- **Hash Join**: Efficient for large tables
- **Nested Loop**: Good for small result sets
- **Merge Join**: Good for pre-sorted data

### Performance Monitoring Queries

**Find slow queries:**
```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 slowest queries
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time,
  rows
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**Find missing indexes:**
```sql
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  seq_tup_read / seq_scan AS avg_seq_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;
```

**Index usage statistics:**
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

**Table bloat:**
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS external_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
```

## Indexing Strategies

### Index Types

**B-tree (default) - Best for equality and range queries:**
```sql
-- Single column
CREATE INDEX idx_users_email ON users(email);

-- Multi-column (order matters!)
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);

-- Partial index (filtered)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Expression index
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
```

**Hash - Only for equality:**
```sql
-- Good for exact matches, not range queries
CREATE INDEX idx_users_uuid ON users USING hash(uuid);
```

**GIN (Generalized Inverted Index) - For arrays, JSONB, full-text:**
```sql
-- Array containment
CREATE INDEX idx_posts_tags ON posts USING gin(tags);

-- JSONB
CREATE INDEX idx_users_metadata ON users USING gin(metadata);

-- Full-text search
CREATE INDEX idx_posts_content_fts ON posts 
USING gin(to_tsvector('english', content));
```

**GiST (Generalized Search Tree) - For geometric data, full-text:**
```sql
-- Full-text search (alternative to GIN)
CREATE INDEX idx_posts_content_gist ON posts 
USING gist(to_tsvector('english', content));

-- Range types
CREATE INDEX idx_bookings_dates ON bookings USING gist(date_range);
```

**BRIN (Block Range Index) - For very large, naturally ordered tables:**
```sql
-- Minimal storage, good for time-series
CREATE INDEX idx_events_created ON events USING brin(created_at);
```

### Composite Index Strategy

**Column order matters:**
```sql
-- Good: Most selective column first
CREATE INDEX idx_orders_status_created 
ON orders(status, created_at);

-- Query can use this index:
SELECT * FROM orders 
WHERE status = 'pending' 
AND created_at > NOW() - INTERVAL '7 days';

-- Query can partially use this index (status only):
SELECT * FROM orders WHERE status = 'pending';

-- Query CANNOT use this index efficiently:
SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '7 days';
```

**Covering indexes:**
```sql
-- Include frequently accessed columns
CREATE INDEX idx_users_email_name 
ON users(email) INCLUDE (first_name, last_name);

-- Enables Index-Only Scan
SELECT first_name, last_name 
FROM users 
WHERE email = 'user@example.com';
```

### Partial Indexes

**For filtered queries:**
```sql
-- Only index active users
CREATE INDEX idx_active_users_email 
ON users(email) 
WHERE active = true AND deleted_at IS NULL;

-- Query must match the filter
SELECT * FROM users 
WHERE email = 'user@example.com' 
AND active = true 
AND deleted_at IS NULL;
```

**Common patterns:**
```sql
-- Pending orders only
CREATE INDEX idx_pending_orders 
ON orders(created_at) 
WHERE status = 'pending';

-- Non-null values only
CREATE INDEX idx_posts_published 
ON posts(published_at) 
WHERE published_at IS NOT NULL;

-- Recent records only
CREATE INDEX idx_recent_events 
ON events(user_id, created_at) 
WHERE created_at > NOW() - INTERVAL '30 days';
```

### Expression Indexes

**For function calls:**
```sql
-- Case-insensitive searches
CREATE INDEX idx_users_lower_email 
ON users(LOWER(email));

SELECT * FROM users WHERE LOWER(email) = LOWER('User@Example.com');

-- Date truncation
CREATE INDEX idx_events_date 
ON events(DATE(created_at));

SELECT * FROM events WHERE DATE(created_at) = '2024-01-01';

-- JSON field
CREATE INDEX idx_metadata_type 
ON users((metadata->>'type'));

SELECT * FROM users WHERE metadata->>'type' = 'premium';
```

## Query Optimization

### N+1 Query Problem

**Bad (N+1 queries):**
```typescript
// Fetches users, then makes 1 query per user for posts
const users = await db.user.findMany()

for (const user of users) {
  user.posts = await db.post.findMany({
    where: { userId: user.id }
  })
}
```

**Good (2 queries):**
```typescript
// Fetch all at once with JOIN
const users = await db.user.findMany({
  include: {
    posts: true
  }
})
```

**SQL equivalent:**
```sql
-- Bad: N+1
SELECT * FROM users;
-- Then for each user:
SELECT * FROM posts WHERE user_id = ?;

-- Good: Single query with JOIN
SELECT 
  u.*,
  json_agg(p.*) as posts
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id;
```

### Efficient Pagination

**Bad (OFFSET):**
```sql
-- Gets slower as offset increases
SELECT * FROM posts 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 10000;
-- Must scan and skip 10,000 rows!
```

**Good (Keyset/Cursor pagination):**
```sql
-- Much faster for large offsets
SELECT * FROM posts 
WHERE created_at < '2024-01-01 12:00:00'
ORDER BY created_at DESC 
LIMIT 20;

-- Or using id:
SELECT * FROM posts 
WHERE id < 12345
ORDER BY id DESC 
LIMIT 20;
```

**Implementation:**
```typescript
async function getPosts(cursor?: string, limit = 20) {
  const posts = await db.post.findMany({
    where: cursor ? {
      created_at: { lt: new Date(cursor) }
    } : undefined,
    orderBy: { created_at: 'desc' },
    take: limit
  })
  
  return {
    posts,
    nextCursor: posts.length === limit 
      ? posts[posts.length - 1].created_at.toISOString()
      : null
  }
}
```

### Batch Operations

**Bad (multiple queries):**
```sql
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
INSERT INTO users (name, email) VALUES ('Jane', 'jane@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
```

**Good (single query):**
```sql
INSERT INTO users (name, email) VALUES 
  ('John', 'john@example.com'),
  ('Jane', 'jane@example.com'),
  ('Bob', 'bob@example.com');
```

**Batch updates:**
```sql
-- Using temporary table
CREATE TEMP TABLE temp_updates (
  id INT,
  status TEXT
);

INSERT INTO temp_updates VALUES 
  (1, 'active'),
  (2, 'inactive'),
  (3, 'active');

UPDATE users u
SET status = t.status
FROM temp_updates t
WHERE u.id = t.id;
```

### Subquery Optimization

**Bad (correlated subquery):**
```sql
-- Runs subquery for each row
SELECT 
  u.*,
  (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as post_count
FROM users u;
```

**Good (JOIN):**
```sql
SELECT 
  u.*,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id;
```

**Good (CTE for complex queries):**
```sql
WITH post_counts AS (
  SELECT 
    user_id,
    COUNT(*) as count
  FROM posts
  GROUP BY user_id
)
SELECT 
  u.*,
  COALESCE(pc.count, 0) as post_count
FROM users u
LEFT JOIN post_counts pc ON pc.user_id = u.id;
```

## Schema Design

### Normalization vs Denormalization

**Normalized (avoid redundancy):**
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT
);

-- Tags table
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Join table
CREATE TABLE post_tags (
  post_id INT REFERENCES posts(id),
  tag_id INT REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);
```

**Strategic denormalization (for read performance):**
```sql
-- Store commonly accessed data together
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  user_name TEXT, -- Denormalized
  user_avatar TEXT, -- Denormalized
  title TEXT NOT NULL,
  content TEXT,
  view_count INT DEFAULT 0, -- Cached aggregate
  comment_count INT DEFAULT 0 -- Cached aggregate
);

-- Update via trigger or application logic
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_counts();
```

### Column Types

**Choose appropriate types:**
```sql
-- Good
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY, -- Use BIGSERIAL for high-volume tables
  uuid UUID DEFAULT gen_random_uuid(),
  email VARCHAR(255), -- Limit length when possible
  age SMALLINT, -- Use SMALLINT for small numbers
  balance NUMERIC(10, 2), -- NUMERIC for money
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() -- Always use TIMESTAMPTZ
);

-- Avoid
CREATE TABLE users_bad (
  id INT, -- Too small, will overflow
  email TEXT, -- Unbounded
  age INT, -- Wasteful for small numbers
  balance FLOAT, -- Inaccurate for money
  created_at TIMESTAMP -- No timezone info
);
```

**JSONB for flexible schemas:**
```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB, -- Flexible attributes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index JSONB fields
CREATE INDEX idx_events_metadata_user 
ON events((metadata->>'user_id'));

-- Query
SELECT * FROM events 
WHERE metadata->>'user_id' = '123';
```

### Constraints for Data Integrity

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure updated_at is always >= created_at
  CONSTRAINT valid_timestamps CHECK (updated_at >= created_at)
);

-- Unique constraint with condition
CREATE UNIQUE INDEX unique_active_email 
ON users(email) 
WHERE deleted_at IS NULL;
```

## Connection Management

### Connection Pooling

**PgBouncer configuration:**
```ini
[databases]
mydb = host=localhost dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 25
```

**Application-level pooling (Node.js):**
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  user: 'postgres',
  password: 'password',
  port: 5432,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Use pool for queries
async function getUser(id: number) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}
```

**Prisma connection pooling:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pooling with Prisma Accelerate or PgBouncer
}

// Set connection limits
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=10`
    }
  }
})
```

### Read Replicas

**Primary (write) and replicas (read):**
```typescript
import { Pool } from 'pg'

const primaryPool = new Pool({
  host: 'primary.db.example.com',
  // ... config
})

const replicaPools = [
  new Pool({ host: 'replica1.db.example.com' }),
  new Pool({ host: 'replica2.db.example.com' })
]

// Round-robin read replica selection
let replicaIndex = 0
function getReadPool() {
  const pool = replicaPools[replicaIndex]
  replicaIndex = (replicaIndex + 1) % replicaPools.length
  return pool
}

// Route queries
async function getUser(id: number) {
  const pool = getReadPool() // Use replica for reads
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0]
}

async function createUser(data: User) {
  const result = await primaryPool.query( // Use primary for writes
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [data.name, data.email]
  )
  return result.rows[0]
}
```

## Migrations

### Safe Migration Patterns

**Add column (safe):**
```sql
-- Add nullable column first
ALTER TABLE users ADD COLUMN bio TEXT;

-- Backfill data (in batches)
UPDATE users SET bio = '' WHERE bio IS NULL;

-- Then make NOT NULL if needed
ALTER TABLE users ALTER COLUMN bio SET NOT NULL;
```

**Add column with default (careful):**
```sql
-- In PostgreSQL 11+, this is fast
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';

-- In older versions, specify NOT NULL separately
ALTER TABLE users ADD COLUMN status TEXT;
UPDATE users SET status = 'active' WHERE status IS NULL;
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
```

**Rename column (requires downtime or careful coordination):**
```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_address TEXT;

-- Step 2: Copy data
UPDATE users SET email_address = email;

-- Step 3: Deploy code that writes to both columns

-- Step 4: Deploy code that reads from new column

-- Step 5: Drop old column
ALTER TABLE users DROP COLUMN email;
```

**Add index concurrently (no locks):**
```sql
-- Don't lock table during index creation
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Check for invalid indexes
SELECT * FROM pg_indexes WHERE indexname = 'idx_users_email';
```

**Change column type (careful):**
```sql
-- Safe: varchar to text
ALTER TABLE users ALTER COLUMN email TYPE TEXT;

-- Unsafe: requires rewrite
ALTER TABLE users ALTER COLUMN id TYPE BIGINT;

-- Better approach for large tables:
-- 1. Add new column
ALTER TABLE users ADD COLUMN id_new BIGINT;

-- 2. Populate in batches
-- 3. Switch application to new column
-- 4. Drop old column
```

### Migration Tools

**Prisma migrations:**
```bash
# Create migration
npx prisma migrate dev --name add_user_bio

# Deploy to production
npx prisma migrate deploy

# Resolve migration conflicts
npx prisma migrate resolve --applied "20240101000000_migration_name"
```

**Drizzle migrations:**
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})

// Generate migration
// pnpm drizzle-kit generate

// Apply migration
// pnpm drizzle-kit migrate
```

## Full-Text Search

### Basic Full-Text Search

```sql
-- Create tsvector column
ALTER TABLE posts ADD COLUMN content_tsv tsvector;

-- Update tsvector
UPDATE posts SET content_tsv = to_tsvector('english', title || ' ' || content);

-- Create GIN index
CREATE INDEX idx_posts_content_tsv ON posts USING gin(content_tsv);

-- Search query
SELECT * FROM posts 
WHERE content_tsv @@ to_tsquery('english', 'postgres & optimization');

-- Ranked search
SELECT 
  *,
  ts_rank(content_tsv, to_tsquery('english', 'postgres & optimization')) as rank
FROM posts 
WHERE content_tsv @@ to_tsquery('english', 'postgres & optimization')
ORDER BY rank DESC;
```

### Auto-Update Full-Text Search

```sql
-- Trigger to keep tsvector updated
CREATE OR REPLACE FUNCTION posts_content_tsv_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_tsv := to_tsvector('english', 
    COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_content_tsv_update
BEFORE INSERT OR UPDATE OF title, content ON posts
FOR EACH ROW EXECUTE FUNCTION posts_content_tsv_trigger();
```

### Advanced Full-Text Features

```sql
-- Highlight search terms
SELECT 
  ts_headline('english', content, 
    to_tsquery('english', 'postgres & optimization'),
    'MaxWords=50, MinWords=25'
  ) as snippet
FROM posts
WHERE content_tsv @@ to_tsquery('english', 'postgres & optimization');

-- Multiple language support
ALTER TABLE posts ADD COLUMN language VARCHAR(10) DEFAULT 'english';
ALTER TABLE posts ADD COLUMN content_tsv_en tsvector;
ALTER TABLE posts ADD COLUMN content_tsv_es tsvector;

-- Weighted search (title more important than content)
UPDATE posts SET content_tsv = 
  setweight(to_tsvector('english', title), 'A') ||
  setweight(to_tsvector('english', content), 'B');
```

## Monitoring & Maintenance

### Essential Monitoring Queries

**Active queries:**
```sql
SELECT 
  pid,
  now() - query_start as duration,
  state,
  query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;
```

**Lock monitoring:**
```sql
SELECT 
  l.pid,
  l.mode,
  l.granted,
  a.query,
  a.state
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted
ORDER BY l.pid;
```

**Database size:**
```sql
SELECT 
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;
```

**Table and index sizes:**
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
```

### VACUUM and ANALYZE

**Manual vacuum:**
```sql
-- Regular vacuum (non-blocking)
VACUUM posts;

-- Vacuum with analyze
VACUUM ANALYZE posts;

-- Full vacuum (locks table, reclaims space)
VACUUM FULL posts;
```

**Auto-vacuum settings:**
```sql
-- Check current settings
SHOW autovacuum;

-- Per-table settings
ALTER TABLE posts SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);
```

**Statistics update:**
```sql
-- Update query planner statistics
ANALYZE posts;

-- For all tables
ANALYZE;
```

### Reindexing

```sql
-- Rebuild single index
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on table
REINDEX TABLE users;

-- Concurrent reindex (PostgreSQL 12+)
REINDEX INDEX CONCURRENTLY idx_users_email;
```

## Production Configuration

### postgresql.conf Settings

```ini
# Memory
shared_buffers = 4GB              # 25% of RAM
effective_cache_size = 12GB       # 50-75% of RAM
work_mem = 50MB                   # RAM / max_connections / 4
maintenance_work_mem = 1GB        # For VACUUM, CREATE INDEX

# Connections
max_connections = 100
superuser_reserved_connections = 3

# WAL
wal_buffers = 16MB
min_wal_size = 1GB
max_wal_size = 4GB
checkpoint_completion_target = 0.9

# Query Planning
random_page_cost = 1.1            # For SSD (default 4.0 for HDD)
effective_io_concurrency = 200    # For SSD (default 1 for HDD)

# Logging
log_min_duration_statement = 1000 # Log slow queries (ms)
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
```

### Connection Limits

```sql
-- Set per-database connection limit
ALTER DATABASE mydb CONNECTION LIMIT 50;

-- Set per-user connection limit
ALTER USER myapp CONNECTION LIMIT 25;

-- View current connections
SELECT 
  datname,
  count(*) as connections
FROM pg_stat_activity
GROUP BY datname;
```

## PostgreSQL 17+ Features

### MERGE Command (Upsert with Full Control)

**Basic MERGE:**
```sql
-- Single statement for INSERT, UPDATE, DELETE based on conditions
MERGE INTO products p
USING staging_products s ON p.product_id = s.product_id
WHEN MATCHED AND s.quantity = 0 THEN
  DELETE
WHEN MATCHED THEN
  UPDATE SET
    name = s.name,
    price = s.price,
    quantity = s.quantity,
    updated_at = NOW()
WHEN NOT MATCHED THEN
  INSERT (product_id, name, price, quantity)
  VALUES (s.product_id, s.name, s.price, s.quantity);
```

**MERGE with RETURNING and merge_action():**
```sql
-- Track what action was taken for each row
MERGE INTO inventory i
USING shipments s ON i.product_id = s.product_id
WHEN MATCHED AND s.quantity > 0 THEN
  UPDATE SET quantity = i.quantity + s.quantity
WHEN NOT MATCHED THEN
  INSERT (product_id, quantity)
  VALUES (s.product_id, s.quantity)
RETURNING merge_action(), i.*;

-- Returns: 'INSERT' or 'UPDATE' for each affected row
```

**Conditional MERGE patterns:**
```sql
-- Complex business logic in single statement
MERGE INTO user_subscriptions us
USING renewal_requests r ON us.user_id = r.user_id
WHEN MATCHED AND r.plan_type = 'cancel' THEN
  UPDATE SET status = 'cancelled', cancelled_at = NOW()
WHEN MATCHED AND us.expires_at < NOW() THEN
  UPDATE SET
    expires_at = NOW() + INTERVAL '1 year',
    plan_type = r.plan_type,
    renewed_at = NOW()
WHEN NOT MATCHED AND r.plan_type != 'cancel' THEN
  INSERT (user_id, plan_type, expires_at)
  VALUES (r.user_id, r.plan_type, NOW() + INTERVAL '1 year');
```

### JSON_TABLE (SQL/JSON Standard)

**Basic JSON_TABLE:**
```sql
-- Transform JSON arrays into relational rows
SELECT jt.*
FROM orders o,
JSON_TABLE(
  o.line_items,
  '$[*]' COLUMNS (
    row_num FOR ORDINALITY,
    product_id INT PATH '$.product_id',
    product_name TEXT PATH '$.name',
    quantity INT PATH '$.qty',
    unit_price NUMERIC PATH '$.price'
  )
) AS jt
WHERE o.id = 123;
```

**Nested JSON structures:**
```sql
-- Handle nested arrays with NESTED PATH
SELECT jt.*
FROM api_responses,
JSON_TABLE(
  response_data,
  '$.orders[*]' COLUMNS (
    order_id INT PATH '$.id',
    customer TEXT PATH '$.customer.name',
    NESTED PATH '$.items[*]' COLUMNS (
      item_num FOR ORDINALITY,
      sku TEXT PATH '$.sku',
      quantity INT PATH '$.quantity',
      price NUMERIC PATH '$.unit_price'
    )
  )
) AS jt;
```

**JSON_TABLE with error handling:**
```sql
-- Handle missing or null values gracefully
SELECT jt.*
FROM events,
JSON_TABLE(
  event_data,
  '$.participants[*]' COLUMNS (
    id INT PATH '$.id' ERROR ON ERROR,
    name TEXT PATH '$.name' DEFAULT 'Unknown' ON EMPTY,
    email TEXT PATH '$.contact.email' NULL ON ERROR,
    role TEXT PATH '$.role' OMIT QUOTES
  )
) AS jt;
```

**JSON_TABLE for API response processing:**
```sql
-- Process paginated API responses
CREATE OR REPLACE FUNCTION process_api_page(response JSONB)
RETURNS TABLE(id INT, name TEXT, status TEXT) AS $$
  SELECT jt.*
  FROM JSON_TABLE(
    response,
    '$.data[*]' COLUMNS (
      id INT PATH '$.id',
      name TEXT PATH '$.attributes.name',
      status TEXT PATH '$.attributes.status'
    )
  ) AS jt;
$$ LANGUAGE SQL;
```

### Generated Columns

**Computed columns (always up-to-date):**
```sql
-- Automatically computed from other columns
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  price_cents INT NOT NULL,
  quantity INT NOT NULL,
  -- Generated column: always equals price_cents * quantity
  total_cents INT GENERATED ALWAYS AS (price_cents * quantity) STORED,
  -- Format price as dollars
  price_display TEXT GENERATED ALWAYS AS (
    '$' || (price_cents / 100.0)::TEXT
  ) STORED
);

-- Insert without specifying generated columns
INSERT INTO products (price_cents, quantity) VALUES (1999, 3);
-- total_cents automatically = 5997, price_display = '$19.99'
```

**Common generated column patterns:**
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  -- Full name for display
  full_name TEXT GENERATED ALWAYS AS (
    first_name || ' ' || last_name
  ) STORED,
  -- Lowercase email for case-insensitive lookups
  email_lower TEXT GENERATED ALWAYS AS (LOWER(email)) STORED,
  -- Email domain extraction
  email_domain TEXT GENERATED ALWAYS AS (
    SPLIT_PART(email, '@', 2)
  ) STORED
);

-- Index generated columns for fast lookups
CREATE INDEX idx_users_email_lower ON users(email_lower);
CREATE INDEX idx_users_email_domain ON users(email_domain);
```

**Generated columns for search optimization:**
```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  -- Pre-computed tsvector for full-text search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'B')
  ) STORED
);

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Query uses pre-computed vector (no runtime computation)
SELECT * FROM posts
WHERE search_vector @@ to_tsquery('english', 'postgres & performance');
```

**Unit conversions with generated columns:**
```sql
CREATE TABLE measurements (
  id BIGSERIAL PRIMARY KEY,
  value_metric NUMERIC NOT NULL,
  unit_type TEXT NOT NULL,
  -- Auto-convert to imperial
  value_imperial NUMERIC GENERATED ALWAYS AS (
    CASE unit_type
      WHEN 'cm' THEN value_metric / 2.54
      WHEN 'kg' THEN value_metric * 2.20462
      WHEN 'celsius' THEN (value_metric * 9/5) + 32
      ELSE value_metric
    END
  ) STORED
);
```

### SQL/JSON Path Expressions

**JSON path queries:**
```sql
-- Check if path exists
SELECT * FROM products
WHERE metadata @? '$.specifications.dimensions';

-- Get value at path
SELECT
  metadata @> '{"featured": true}' AS is_featured,
  jsonb_path_query_first(metadata, '$.ratings.average') AS avg_rating
FROM products;
```

**Path expressions with filters:**
```sql
-- Filter within JSON path
SELECT jsonb_path_query_array(
  metadata,
  '$.reviews[*] ? (@.rating >= 4)'
) AS good_reviews
FROM products;

-- Path with variables
SELECT jsonb_path_query(
  metadata,
  '$.prices[*] ? (@.region == $region)',
  '{"region": "US"}'
) AS us_prices
FROM products;
```

## Common Pitfalls

### Avoid

❌ **Missing indexes on foreign keys:**
```sql
-- Bad: No index on foreign key
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id)
);

-- Good: Always index foreign keys
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id)
);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

❌ **Using SELECT *:**
```sql
-- Bad: Fetches all columns
SELECT * FROM users WHERE id = 1;

-- Good: Only fetch needed columns
SELECT id, email, name FROM users WHERE id = 1;
```

❌ **Missing WHERE in UPDATE/DELETE:**
```sql
-- Dangerous: Updates all rows
UPDATE users SET status = 'active';

-- Safe: Always use WHERE
UPDATE users SET status = 'active' WHERE id = 123;
```

❌ **Using LIKE with leading wildcard:**
```sql
-- Bad: Cannot use index
SELECT * FROM users WHERE email LIKE '%@example.com';

-- Good: Index can be used
SELECT * FROM users WHERE email LIKE 'john%';

-- Better: Use full-text search for contains
```

❌ **Inefficient counting:**
```sql
-- Slow for large tables
SELECT COUNT(*) FROM posts;

-- Faster: Use estimated count
SELECT reltuples::bigint AS estimate 
FROM pg_class 
WHERE relname = 'posts';

-- Or cache counts in a separate table
```

## Performance Checklist

### Database Design
- [ ] Primary keys on all tables
- [ ] Foreign keys have indexes
- [ ] Appropriate column types
- [ ] Constraints for data integrity
- [ ] Normalized where appropriate
- [ ] Strategic denormalization for performance

### Indexing
- [ ] Indexes on frequently queried columns
- [ ] Composite indexes for multi-column queries
- [ ] Partial indexes for filtered queries
- [ ] No unused indexes (check pg_stat_user_indexes)
- [ ] GIN indexes for JSONB/arrays/full-text
- [ ] Expression indexes for function calls

### Query Performance
- [ ] EXPLAIN ANALYZE for slow queries
- [ ] No N+1 queries
- [ ] Batch operations where possible
- [ ] Cursor pagination for large offsets
- [ ] CTEs for complex queries
- [ ] Avoid correlated subqueries

### Connection Management
- [ ] Connection pooling configured
- [ ] Appropriate pool size
- [ ] Read replicas for read-heavy workloads
- [ ] Connection limits set

### Monitoring
- [ ] pg_stat_statements enabled
- [ ] Slow query logging enabled
- [ ] Regular VACUUM ANALYZE
- [ ] Monitor table/index bloat
- [ ] Track lock contention
- [ ] Monitor connection counts

### Production
- [ ] Shared_buffers configured
- [ ] Work_mem tuned
- [ ] WAL settings optimized
- [ ] Backups automated
- [ ] Migration strategy defined
- [ ] Rollback plan for schema changes

## Testing Performance

### Load Testing

```typescript
// Using k6 for load testing
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
}

export default function () {
  const res = http.get('http://localhost:3000/api/posts')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  })
  sleep(1)
}
```

### Benchmarking Queries

```sql
-- pgbench for basic benchmarking
pgbench -i -s 50 mydb  -- Initialize
pgbench -c 10 -j 2 -t 1000 mydb  -- Run benchmark

-- Custom benchmark script
CREATE OR REPLACE FUNCTION benchmark_query()
RETURNS TABLE(execution_time numeric) AS $$
DECLARE
  start_time timestamptz;
  end_time timestamptz;
BEGIN
  start_time := clock_timestamp();
  
  -- Your query here
  PERFORM * FROM posts WHERE user_id = 123;
  
  end_time := clock_timestamp();
  execution_time := EXTRACT(MILLISECONDS FROM (end_time - start_time));
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Run benchmark
SELECT AVG(execution_time) 
FROM generate_series(1, 100), benchmark_query();
```

## Quick Reference

### Index Types
- **B-tree**: Default, equality and range
- **Hash**: Equality only
- **GIN**: Arrays, JSONB, full-text
- **GiST**: Geometric, full-text
- **BRIN**: Large, naturally ordered tables

### Query Plan Nodes
- **Seq Scan**: Full table scan
- **Index Scan**: Uses index
- **Index Only Scan**: Covering index
- **Bitmap Index Scan**: Multiple indexes
- **Hash Join**: Large tables
- **Nested Loop**: Small results
- **Merge Join**: Pre-sorted data

### Essential Commands
```sql
EXPLAIN ANALYZE <query>;
VACUUM ANALYZE <table>;
REINDEX INDEX <index>;
CREATE INDEX CONCURRENTLY <index>;
ALTER TABLE <table> ADD COLUMN <column>;
```

### Performance Queries
```sql
-- Slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- Missing indexes
SELECT * FROM pg_stat_user_tables WHERE idx_scan = 0 AND seq_scan > 0;

-- Table sizes
SELECT pg_size_pretty(pg_total_relation_size('table_name'));

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```