---
name: production-debugging-playbook
description: Fix production issues fast without deploying code, using platform dashboards, SQL commands, and config changes. Use when the app is down, queries are timing out, or you need to rollback a bad deployment.
---

# Production Debugging Playbook

A practical guide for diagnosing and fixing production issues through **operational actions** - using platform dashboards, SQL commands, and configuration changes instead of code deploys.

## When to Use This Skill

Use this skill when:
- Production app is down or degraded
- Database queries are slow or timing out
- Services are running out of memory
- Authentication/authorization issues occur
- Need to fix issues WITHOUT deploying code
- Investigating performance problems
- Rolling back bad deployments
- Clearing caches or resetting state
- Managing resources and connections

**Philosophy:** Fix it now through operations, deploy the permanent fix later.

---

## Railway Platform Fixes

### Symptom: Service Crashes Randomly

**Check Memory Usage:**
```bash
# Railway CLI
railway logs --service <service-name>

# Look for:
# - "killed" or "OOM" (out of memory)
# - "exit code 137" (killed by system)
```

**Fix in Railway Dashboard:**
1. Go to service → Settings → Resources
2. Increase memory: 512MB → 1GB or 2GB
3. Service will restart automatically

**Quick Fix: Restart Service**
1. Dashboard → Service → Settings
2. Click "Restart" button
3. Or via CLI: `railway restart --service <service>`

---

### Symptom: Deployment Succeeded but Old Version Still Running

**Cause:** Failed health check, deployment stuck

**Fix: Check Health Check Endpoint**
1. Dashboard → Service → Settings → Deploy
2. Verify Health Check Path (e.g., `/health`, `/api/health`)
3. Test endpoint manually: `curl https://your-app.railway.app/health`
4. If 404, disable health check temporarily or fix endpoint

**Force Redeploy:**
```bash
railway up --service <service>
# Or dashboard: Deployments → Latest → "Redeploy"
```

---

### Symptom: App Won't Start After Deploy

**Check Build Logs:**
1. Dashboard → Deployments → Failed deployment
2. Click "View Logs" → Build tab
3. Look for:
   - Missing dependencies
   - Build command failures
   - Port binding errors

**Common Fixes:**

**Wrong Start Command:**
- Dashboard → Settings → Deploy
- Check "Start Command" field
- Should be: `node dist/index.js` or `npm start`, not `npm run dev`

**Missing Environment Variables:**
```bash
railway variables list

# Add missing vars:
railway variables set KEY=value
```

**Port Binding Issue:**
- Railway provides `PORT` env var
- Code must use: `process.env.PORT || 3000`
- Don't hardcode port 3000

---

### Symptom: Service A Can't Connect to Service B

**Fix: Enable Private Networking**
1. Dashboard → Service B → Settings → Networking
2. Enable "Private Networking"
3. Copy private URL: `service-b.railway.internal:3000`
4. Update Service A env var: `SERVICE_B_URL=http://service-b.railway.internal:3000`

**Verify Connection:**
```bash
# From Service A container
railway run --service service-a curl http://service-b.railway.internal:3000/health
```

---

### Symptom: High Costs / Unexpected Bills

**Check Resource Usage:**
1. Dashboard → Project → Usage
2. Look for:
   - Services running 24/7 unnecessarily
   - Preview environments not deleted
   - Large disk usage

**Quick Fixes:**
- Delete old preview deployments
- Set sleep schedule for dev services
- Reduce instance count for non-prod

**Set Resource Limits:**
1. Service → Settings → Resources
2. Set max memory (prevents runaway usage)
3. Set max CPU (cap costs)

---

### Symptom: Logs Not Showing or Truncated

**Fix: Configure Log Retention**
```bash
# View recent logs
railway logs --tail 1000

# Follow live logs
railway logs --follow

# Filter by service
railway logs --service api

# Export logs for analysis
railway logs > logs.txt
```

**Dashboard:** Logs only show last 24 hours by default

**Enable Longer Retention:**
- Use external logging: Datadog, Logtail, Better Stack
- Set up log shipping from Railway

---

## Database Fixes (SQL Commands)

### Symptom: Queries Extremely Slow

**Check for Missing Indexes:**
```sql
-- Find slow queries
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check if indexes exist on commonly queried columns
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Create Missing Indexes (NO DOWNTIME):**
```sql
-- ✅ SAFE: Use CONCURRENTLY
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_orders_created_at ON orders(created_at);

-- ❌ DANGEROUS: Without CONCURRENTLY (locks table)
-- CREATE INDEX idx_users_email ON users(email);
```

**Composite Indexes for Multiple Columns:**
```sql
-- If you query: WHERE user_id = X AND status = 'active'
CREATE INDEX CONCURRENTLY idx_orders_user_status 
  ON orders(user_id, status);

-- If you query: WHERE created_at > X ORDER BY created_at DESC
CREATE INDEX CONCURRENTLY idx_orders_created_desc 
  ON orders(created_at DESC);
```

---

### Symptom: Database Connection Errors

**Check Active Connections:**
```sql
-- See all connections
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query,
  state_change
FROM pg_stat_activity
ORDER BY state_change;

-- Count connections by state
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Check connection limit
SHOW max_connections; -- Default: 100
```

**Fix: Kill Idle Connections:**
```sql
-- Kill idle connections older than 5 minutes
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND state_change < now() - interval '5 minutes'
  AND pid != pg_backend_pid(); -- Don't kill your own connection

-- Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
  AND query_start < now() - interval '10 minutes'
  AND pid != pg_backend_pid();
```

**Set Connection Limits Per User:**
```sql
-- Prevent app from using all connections
ALTER USER app_user CONNECTION LIMIT 50;

-- Check user limits
SELECT 
  rolname,
  rolconnlimit
FROM pg_roles
WHERE rolconnlimit != -1;
```

---

### Symptom: Table Bloated / Slow After Many Updates

**Check Table Bloat:**
```sql
-- Check dead tuples
SELECT 
  schemaname,
  relname,
  n_live_tup,
  n_dead_tup,
  last_autovacuum,
  last_vacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY n_dead_tup DESC;
```

**Fix: Vacuum Tables:**
```sql
-- ✅ Regular vacuum (online, no lock)
VACUUM ANALYZE users;
VACUUM ANALYZE orders;

-- 🔶 Aggressive vacuum (may take longer)
VACUUM FULL ANALYZE users; -- ⚠️ Locks table briefly

-- Vacuum all tables
VACUUM ANALYZE;
```

**Automate Vacuuming:**
```sql
-- Check autovacuum settings
SHOW autovacuum;
SHOW autovacuum_naptime;

-- Force autovacuum on specific table
ALTER TABLE users SET (autovacuum_vacuum_scale_factor = 0.1);
```

---

### Symptom: Data Corruption / Invalid Records

**Add Constraints (Prevent Future Issues):**
```sql
-- Ensure emails are not empty
ALTER TABLE users 
  ADD CONSTRAINT users_email_not_empty 
  CHECK (email != '');

-- Ensure prices are positive
ALTER TABLE products 
  ADD CONSTRAINT products_price_positive 
  CHECK (price > 0);

-- Ensure foreign keys exist
ALTER TABLE orders 
  ADD CONSTRAINT fk_orders_user 
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;

-- Ensure enum values
ALTER TABLE orders 
  ADD CONSTRAINT orders_status_valid 
  CHECK (status IN ('pending', 'completed', 'cancelled'));
```

**Find and Fix Invalid Data:**
```sql
-- Find null emails
SELECT * FROM users WHERE email IS NULL OR email = '';

-- Fix them
UPDATE users SET email = 'unknown@example.com' 
WHERE email IS NULL OR email = '';

-- Find negative prices
SELECT * FROM products WHERE price < 0;

-- Fix them
UPDATE products SET price = 0 WHERE price < 0;
```

---

### Symptom: Duplicate Records

**Find Duplicates:**
```sql
-- Find duplicate emails
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Find duplicate orders
SELECT user_id, product_id, COUNT(*) 
FROM orders 
GROUP BY user_id, product_id 
HAVING COUNT(*) > 1;
```

**Fix: Add Unique Constraints:**
```sql
-- Prevent duplicate emails (after cleaning data)
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Composite unique constraint
ALTER TABLE orders 
  ADD CONSTRAINT orders_user_product_unique 
  UNIQUE (user_id, product_id);
```

**Remove Duplicates:**
```sql
-- Keep oldest, delete duplicates
DELETE FROM users a USING users b
WHERE a.id > b.id 
  AND a.email = b.email;
```

---

### Symptom: Locks / Queries Hanging Forever

**Check for Blocking Queries:**
```sql
-- See what's blocking what
SELECT 
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_query,
  blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity 
  ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
  ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
  AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
  AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
  AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
  AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
  AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
  AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
  AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
  AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
  AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity 
  ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

**Kill Blocking Query:**
```sql
-- Kill the blocking PID from query above
SELECT pg_terminate_backend(12345); -- Replace with actual PID
```

**Set Statement Timeout:**
```sql
-- Prevent queries from running forever
ALTER DATABASE your_db SET statement_timeout = '30s';

-- Or per session
SET statement_timeout = '30s';
```

---

## Supabase Dashboard Fixes

### Symptom: Users Can Read/Write Data They Shouldn't

**Fix: Enable RLS (Row Level Security)**

1. **Dashboard → Database → Tables**
2. Select table → Click "RLS" toggle → Enable
3. **Add Policies:**

**Allow users to read only their own data:**
```sql
CREATE POLICY "Users can view own records"
  ON users
  FOR SELECT
  USING (auth.uid() = id);
```

**Allow users to update only their own data:**
```sql
CREATE POLICY "Users can update own records"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);
```

**Allow insert only with valid user_id:**
```sql
CREATE POLICY "Users can insert own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Public read, authenticated write:**
```sql
CREATE POLICY "Public read access"
  ON posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write access"
  ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

### Symptom: Storage Files Not Accessible

**Fix: Storage Bucket Policies**

1. **Dashboard → Storage → Buckets**
2. Select bucket → Policies tab

**Public read access:**
```sql
CREATE POLICY "Public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');
```

**Authenticated upload:**
```sql
CREATE POLICY "Authenticated upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );
```

**User can only access their own files:**
```sql
CREATE POLICY "User owns file"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'private-files' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

### Symptom: Real-time Subscriptions Not Working

**Check Replication:**
1. **Dashboard → Database → Replication**
2. Ensure tables are enabled for replication
3. Enable for specific tables

**Enable Replication via SQL:**
```sql
-- Enable replication for table
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Check replication status
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

**Check Policies Allow Real-time:**
```sql
-- Real-time needs SELECT permission
CREATE POLICY "Enable real-time"
  ON messages
  FOR SELECT
  USING (true); -- Or your specific logic
```

---

### Symptom: Edge Functions Timing Out

**Dashboard → Edge Functions → Logs**

**Check Timeout Setting:**
- Default: 10 seconds
- Max: 150 seconds (Pro plan)

**Increase Timeout (in function):**
```typescript
// deno.json
{
  "functions": {
    "my-function": {
      "timeout": 60
    }
  }
}
```

**Quick Fix: Redeploy Function**
```bash
supabase functions deploy my-function --no-verify-jwt
```

---

### Symptom: Auth Issues / Users Can't Login

**Check Auth Settings:**
1. **Dashboard → Authentication → Settings**

**Email Confirmation Required:**
- Disable "Email confirmations" for testing
- Check email templates are configured

**Password Requirements:**
- Settings → Password → Check minimum length

**JWT Secret Mismatch:**
```bash
# Get JWT secret
supabase status

# Verify in your app:
# SUPABASE_ANON_KEY should match dashboard → Settings → API
```

**Manually Confirm User:**
```sql
-- Confirm user email
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'user@example.com';
```

---

## Log Analysis

### Reading Railway Logs

**Find Errors:**
```bash
# Search for errors
railway logs | grep -i error

# Search for specific status codes
railway logs | grep "500"
railway logs | grep "404"

# Find memory issues
railway logs | grep -i "memory"
railway logs | grep "OOM"
```

**Trace Request:**
```bash
# Find request by ID
railway logs | grep "request-id-xyz"

# Find user's requests
railway logs | grep "user@example.com"
```

**Performance Analysis:**
```bash
# Find slow requests (>1s)
railway logs | grep "duration.*[0-9]{4,}ms"
```

---

### Reading Database Logs

**Supabase Logs:**
1. **Dashboard → Logs → Database**
2. Filter by severity: Error, Warning
3. Look for:
   - Connection failures
   - Query timeouts
   - Permission errors

**Railway Postgres Logs:**
```bash
railway logs --service postgres

# Look for:
# - "connection limit exceeded"
# - "too many connections"
# - "deadlock detected"
```

---

## Quick Rollback Procedures

### Railway Rollback

**Option 1: Dashboard**
1. Deployments → Previous successful deployment
2. Click "Redeploy"
3. Confirms in ~30 seconds

**Option 2: CLI**
```bash
# View deployment history
railway status

# Rollback to specific deployment
railway rollback <deployment-id>

# Rollback to previous
railway rollback
```

---

### Supabase Rollback

**Database Schema:**
```bash
# Using migrations (if set up)
supabase migration list
supabase migration repair

# Or via SQL
BEGIN;
-- Run migration rollback SQL
ROLLBACK; -- or COMMIT when ready
```

**Edge Functions:**
```bash
# Redeploy previous version
supabase functions deploy my-function --version <previous-version>
```

---

## Environment Variable Fixes

### Railway: Update Without Deploy

**Via Dashboard:**
1. Settings → Variables
2. Edit variable
3. Click "Restart" to apply (no new deploy)

**Via CLI:**
```bash
# Update variable
railway variables set DATABASE_URL="new-connection-string"

# Restart to apply
railway restart

# Verify
railway variables list
```

**Bulk Update:**
```bash
# From .env file
railway variables --set < .env
```

---

### Supabase: API Keys

**Rotate Keys (Security Breach):**
1. Dashboard → Settings → API
2. Click "Rotate" next to key
3. Update apps with new key immediately

**Service Role Key (Admin Actions):**
- Use only server-side
- Never expose in frontend
- Bypass RLS policies

---

## Cache Clearing

### Clear CDN Cache (If Using)

**Vercel:**
```bash
vercel deploy --force
```

**Cloudflare:**
1. Dashboard → Caching → Purge Cache
2. Purge Everything

---

### Clear Redis Cache

```bash
# Connect to Redis
redis-cli

# Clear all keys
FLUSHALL

# Clear specific key
DEL user:123:profile

# Clear by pattern
KEYS "session:*" | xargs redis-cli DEL
```

---

### Clear Browser Cache (For Users)

**Force Refresh Assets:**
- Append version query: `app.js?v=2`
- Use cache-busting in build tool

**Service Worker Clear:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(r => r.unregister())
  })
```

---

## Resource Management

### Restart Stuck Services

**Railway:**
```bash
railway restart --service api
railway restart --service worker
```

**PM2 (If using):**
```bash
railway run pm2 restart all
railway run pm2 logs
```

---

### Check Disk Usage

**Railway:**
```bash
railway run df -h

# Clean up logs
railway run rm -rf /app/logs/*.log

# Clean node_modules (if needed)
railway run npm prune --production
```

---

### Adjust Resource Limits

**Railway:**
1. Service → Settings → Resources
2. Adjust:
   - Memory: 512MB → 2GB
   - CPU: Shared → Dedicated
   - Replicas: 1 → 2 (horizontal scaling)

**Trigger:**
- CPU > 80% sustained → add more CPU
- Memory > 80% → increase memory
- Request queue growing → add replicas

---

## Emergency Procedures

### Complete Service Restart

```bash
# Railway: restart all services
railway restart --service api
railway restart --service worker
railway restart --service postgres

# Or entire project
railway restart
```

---

### Database Connection Pool Reset

**Supabase:**
```sql
-- Kill all non-superuser connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid != pg_backend_pid()
  AND usename != 'postgres';
```

**Connection Pooler:**
- Supabase uses PgBouncer
- Dashboard → Database → Connection pooling
- Restart pooler if needed

---

### Circuit Breaker Manual Override

**If you have circuit breaker in code:**

**Temporary disable (via env var):**
```bash
railway variables set CIRCUIT_BREAKER_ENABLED=false
railway restart
```

**Reset circuit state (Redis):**
```bash
redis-cli DEL circuit:payment-service
```

---

## Troubleshooting Checklist

### App Down ✅

1. ☐ Check service status (Railway dashboard)
2. ☐ Check recent deployments (successful?)
3. ☐ Check logs for errors
4. ☐ Check health endpoint
5. ☐ Check environment variables
6. ☐ Restart service
7. ☐ Rollback to previous deployment

---

### Slow Performance ✅

1. ☐ Check database query performance
2. ☐ Look for missing indexes
3. ☐ Check active connections
4. ☐ Run VACUUM on tables
5. ☐ Check memory usage
6. ☐ Check CDN cache hit rate
7. ☐ Clear stale cache entries

---

### Database Issues ✅

1. ☐ Check connection count
2. ☐ Kill idle connections
3. ☐ Check for long-running queries
4. ☐ Kill blocking queries
5. ☐ Check table bloat
6. ☐ Run VACUUM ANALYZE
7. ☐ Verify indexes exist

---

### Auth Problems ✅

1. ☐ Check RLS policies
2. ☐ Verify JWT tokens valid
3. ☐ Check auth settings
4. ☐ Confirm user email
5. ☐ Check CORS settings
6. ☐ Verify API keys

---

## Best Practices

### DO:
✓ Check logs FIRST
✓ Test SQL queries on staging before production
✓ Use CONCURRENTLY when creating indexes
✓ Set connection limits per user
✓ Enable health checks
✓ Monitor resource usage
✓ Keep recent backups
✓ Document emergency contacts
✓ Test rollback procedures
✓ Use staging environment

### DON'T:
✗ Run `ALTER TABLE` without CONCURRENTLY
✗ Deploy to production on Friday afternoon
✗ Skip backups before big changes
✗ Kill connections without understanding impact
✗ Disable RLS in production
✗ Ignore memory warnings
✗ Hardcode secrets
✗ Deploy without testing locally
✗ Change multiple things at once
✗ Panic - follow the checklist

---

## Quick Command Reference

### Railway
```bash
railway login
railway link
railway logs --tail 100
railway logs --follow
railway restart --service <name>
railway variables list
railway variables set KEY=value
railway status
railway rollback
```

### Database (PostgreSQL)
```sql
-- Performance
VACUUM ANALYZE;
CREATE INDEX CONCURRENTLY idx_name ON table(column);

-- Connections
SELECT * FROM pg_stat_activity;
SELECT pg_terminate_backend(pid);
ALTER USER app_user CONNECTION LIMIT 50;

-- Health
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
SHOW max_connections;

-- Constraints
ALTER TABLE table ADD CONSTRAINT check_positive CHECK (col > 0);
ALTER TABLE table ADD CONSTRAINT unique_email UNIQUE (email);
```

### Supabase
```bash
supabase status
supabase functions deploy <name>
supabase db reset
supabase migration list
```

---

## When to Call for Help

**Immediately escalate if:**
- Data breach or security incident
- Data loss or corruption
- Payment processing failures
- Complete service outage >10 minutes
- Database in read-only mode
- Can't rollback (stuck deployment)

**Can handle yourself:**
- Slow queries → add indexes
- High memory → increase limits
- Connection errors → kill idle connections
- Service crash → restart
- Config issues → update env vars
- Old deployment → rollback

**Remember:** Operations fixes are faster than code deploys. Use platform tools first, deploy permanent fixes later.
