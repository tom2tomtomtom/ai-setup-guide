---
name: railway-deployment
description: Deploys multi-service applications to Railway with environment variables, health checks, and private networking; use when setting up Next.js, Node.js, Python stacks on Railway
---

# Railway Deployment

Comprehensive guide for deploying multi-service applications on Railway with environment variables, health checks, private networking, and production configurations.

## When to Use This Skill

Use this skill when:
- Deploying applications to Railway platform
- Setting up multi-service architectures (frontend + backend + database)
- Configuring environment variables and service-to-service communication
- Implementing health checks for zero-downtime deployments
- Configuring Railpack (Railway's default builder) or custom Dockerfiles
- Debugging deployment issues or build failures
- Migrating from Heroku, Render, or other PaaS platforms
- Setting up PR preview environments

## Core Concepts

### Projects and Services
- **Project**: Container for organizing infrastructure (application stack, services, databases)
- **Service**: Individual deployable unit (API, frontend, worker, etc.)
- **Environment**: Isolated deployment context (production, staging, PR previews)
- **Private Networking**: Internal service-to-service communication within a project

### Key Features
- **Railpack**: Automatic language detection and optimized builds (successor to Nixpacks)
- Automatic builds from GitHub on push
- Zero-downtime deployments with health checks
- Private networking between services (no egress fees)
- Automatic SSL/TLS for custom domains
- Infrastructure as Code with `railway.json` and `railpack.json`
- Multi-region deployments with replica scaling
- Automatic compute scaling (no manual instance sizing)

## Environment Variables

### Basic Configuration

```bash
# Set via Railway CLI
railway variables --set "PORT=3000"
railway variables --set "NODE_ENV=production"
railway variables --set "API_KEY=secret-value"

# View current variables
railway variables
```

### Service-to-Service References

Railway provides automatic variable references between services:

```bash
# Reference another service's variable
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
API_URL=${{api-service.RAILWAY_PUBLIC_DOMAIN}}

# Private networking (faster, no egress costs)
INTERNAL_API_URL=${{api-service.RAILWAY_PRIVATE_DOMAIN}}
```

### Common Patterns

**Node.js/Express Configuration:**
```javascript
// Use Railway's PORT variable (automatically assigned)
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Database connection
const db = pgp(process.env.DATABASE_URL);
```

**Python/Flask Configuration:**
```python
import os

# Railway assigns PORT automatically
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)

# Database URL
DATABASE_URL = os.environ.get('DATABASE_URL')
```

**Environment-Specific Variables:**
```bash
# Production
NODE_ENV=production
LOG_LEVEL=error

# Staging
NODE_ENV=staging
LOG_LEVEL=debug

# PR Environments (auto-generated)
# Railway creates isolated environments for each PR
```

### Variable Management via API

**Fetch Variables:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query variables($projectId: ID!, $environmentId: ID!, $serviceId: ID) { variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId) }",
    "variables": {
      "projectId": "your-project-id",
      "environmentId": "your-env-id",
      "serviceId": "your-service-id"
    }
  }'
```

**Upsert Variable:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation variableUpsert($input: VariableUpsertInput!) { variableUpsert(input: $input) }",
    "variables": {
      "input": {
        "projectId": "your-project-id",
        "environmentId": "your-env-id",
        "serviceId": "your-service-id",
        "name": "API_KEY",
        "value": "secret-value"
      }
    }
  }'
```

## Multi-Service Architecture

### Project Structure Best Practice

Keep related services in the same project for:
- **Private Networking**: Fast, free service-to-service communication
- **Shared Variables**: Easy environment variable management
- **Organization**: Clean dashboard without project clutter

**Example Stack:**
```
Project: MyApp
├── frontend (React/Next.js)
├── api (Node.js/Express)
├── worker (Background jobs)
├── postgres (Database)
└── redis (Cache)
```

### Setting Up Multi-Service Project

**Via Railway CLI:**
```bash
# Initialize project
railway init

# Add services
railway add  # Select "Empty Service" or "GitHub Repo"

# Link services to GitHub repos
railway service  # Select service
railway link    # Connect to GitHub repo

# Add database
railway add  # Select "PostgreSQL" or "Redis"
```

**Via Dashboard:**
1. Create new project
2. Click "Create" → "New Service"
3. Connect GitHub repo or Docker image
4. Repeat for each service
5. Add databases via "Create" → "Database"

### Service Configuration

**railway.json (Infrastructure as Code):**
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "./Dockerfile"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Restart Policy Options:**
- `ALWAYS`: Always restart the deployment when it crashes
- `ON_FAILURE`: Only restart on non-zero exit codes (recommended for most apps)
- `NEVER`: Never restart - useful for one-off jobs or cron tasks

**Environment-Specific Overrides:**
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  },
  "environments": {
    "staging": {
      "deploy": {
        "startCommand": "npm run staging"
      }
    },
    "pr": {
      "deploy": {
        "startCommand": "npm run preview"
      }
    }
  }
}
```

## Health Checks

Health checks enable zero-downtime deployments by ensuring new deployments are ready before routing traffic.

### Implementation Patterns

**Node.js/Express:**
```javascript
// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// Advanced health check (with dependencies)
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.query('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    res.status(200).json({
      status: 'ok',
      timestamp: Date.now(),
      services: {
        database: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message
    });
  }
});
```

**Python/Flask:**
```python
from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

@app.route('/health')
def health_check():
    try:
        # Check database
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.close()
        
        return jsonify({
            'status': 'ok',
            'timestamp': int(time.time())
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 503
```

**Configuration in railway.json:**
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "overlapSeconds": 60,
    "drainingSeconds": 10
  }
}
```

**Zero-Downtime Deployment Settings:**
- `overlapSeconds`: Time (seconds) the previous deploy overlaps with the new one during transition
- `drainingSeconds`: Time (seconds) between SIGTERM and SIGKILL for graceful shutdown

### Health Check Best Practices

1. **Keep it lightweight**: Don't perform heavy operations
2. **Return quickly**: Aim for <100ms response time
3. **Check critical dependencies**: Database, cache, external APIs
4. **Use appropriate status codes**: 200 (healthy), 503 (unhealthy)
5. **Include timestamp**: Helps verify endpoint is responding
6. **Don't require authentication**: Health checks should be public

## Railpack (Default Builder)

Railpack is Railway's default builder, succeeding Nixpacks. It automatically detects your application's language and framework to generate optimized builds.

> **⚠️ DEPRECATED:** Nixpacks is deprecated and no longer maintained. All new deployments should use **Railpack** (the default) or a custom **Dockerfile**. If you have existing `nixpacks.toml` configurations, migrate them to `railpack.json`.

### How Railpack Works

Railpack automatically:
- Detects languages (Node.js, Python, Go, Rust, PHP, etc.)
- Installs dependencies
- Runs build commands
- Configures start commands
- Optimizes the final image

### Configuration via `railpack.json`

Create a `railpack.json` in your project root to customize builds:

```json
{
  "$schema": "https://schema.railpack.com",
  "provider": "node",
  "packages": {
    "node": "22",
    "python": "3.12"
  },
  "buildAptPackages": ["build-essential", "libpq-dev"],
  "deploy": {
    "startCommand": "node dist/server.js",
    "aptPackages": ["ca-certificates"],
    "variables": {
      "NODE_ENV": "production"
    }
  }
}
```

### Environment Variable Overrides

Override Railpack behavior via environment variables:

```bash
# Specify commands
RAILPACK_BUILD_CMD="npm run custom-build"
RAILPACK_INSTALL_CMD="npm ci"
RAILPACK_START_CMD="node server.js"

# Specify package versions
RAILPACK_PACKAGES="node@22 python@3.11"

# Install system packages
RAILPACK_BUILD_APT_PACKAGES="imagemagick ffmpeg"
RAILPACK_DEPLOY_APT_PACKAGES="curl wget"

# Language-specific versions
NODE_VERSION="20.10.0"
BUN_VERSION="1.0.0"
```

### Custom Steps

Add custom build steps in `railpack.json`:

```json
{
  "$schema": "https://schema.railpack.com",
  "steps": {
    "build": {
      "commands": ["...", "./my-custom-build.sh"]
    }
  },
  "deploy": {
    "inputs": [
      "...",
      { "image": "some-image", "include": ["/usr/bin/tool"] }
    ]
  }
}
```

### When to Use Dockerfile Instead

Use a custom Dockerfile when you need:
- Full control over the build process
- Specific base images
- Complex multi-stage builds
- Non-standard runtime requirements

## Dockerfile Configuration

### Multi-Stage Build Example

**Node.js Application:**
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build if needed
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Railway provides PORT environment variable
EXPOSE $PORT

CMD ["node", "dist/server.js"]
```

**React/Frontend with Caddy:**
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve with Caddy
FROM caddy:latest

WORKDIR /app

# Copy Caddyfile
COPY Caddyfile ./

# Format Caddyfile
RUN caddy fmt Caddyfile --overwrite

# Copy built assets
COPY --from=build /app/dist ./dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
```

**Caddyfile (for Railway):**
```caddyfile
{
    # Global options
    admin off
    persist_config off
    auto_https off  # Railway handles HTTPS
    
    log {
        format json
    }
    
    servers {
        trusted_proxies static private_ranges 100.0.0.0/8
    }
}

# Listen on Railway's PORT
:{$PORT:3000} {
    log {
        format json
    }

    # Health check
    rewrite /health /*

    # Serve static files
    root * dist
    encode gzip
    file_server

    # Client-side routing fallback
    try_files {path} /index.html
}
```

### Custom Dockerfile Path

```bash
# Set custom Dockerfile location
railway variables --set "RAILWAY_DOCKERFILE_PATH=docker/Dockerfile.prod"

# Or in subdirectory
railway variables --set "RAILWAY_DOCKERFILE_PATH=/build/Dockerfile"
```

## Debugging Deployments

### View Logs

**Via CLI:**
```bash
# Stream live logs
railway logs

# Follow logs for specific service
railway logs --service api

# View recent logs
railway logs --tail 100
```

**Via API - Get Build Logs:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -d '{
    "query": "query deployment($id: String!) { deployment(id: $id) { buildLogs } }",
    "variables": { "id": "deployment-id" }
  }'
```

### Common Deployment Issues

**Build Failures:**

1. **Missing Environment Variables During Build**
   - Solution: Set build-time variables with `RAILWAY_` prefix
   ```bash
   railway variables --set "RAILWAY_BUILD_NODE_VERSION=20"
   ```

2. **Port Binding Issues**
   - Solution: Always bind to `0.0.0.0` and use `process.env.PORT`
   ```javascript
   // ❌ Wrong
   app.listen(3000, 'localhost');
   
   // ✅ Correct
   app.listen(process.env.PORT || 3000, '0.0.0.0');
   ```

3. **Start Command Not Found**
   - Solution: Explicitly set start command
   ```json
   {
     "deploy": {
       "startCommand": "node dist/server.js"
     }
   }
   ```

4. **Health Check Timeout**
   - Solution: Increase timeout or fix slow startup
   ```json
   {
     "deploy": {
       "healthcheckPath": "/health",
       "healthcheckTimeout": 300
     }
   }
   ```

### SSH Debugging

Railway provides direct SSH access to running containers for debugging:

```bash
# Interactive SSH session
railway ssh --project=<project-id> --environment=<env-id> --service=<service-id>

# Execute single command
railway ssh -- ls

# Get SSH command from dashboard (Service → Connect → SSH)
```

**Common SSH Use Cases:**
- Debugging production issues
- Running database migrations manually
- Checking file system state
- Testing environment variables
- Framework-specific tasks (Rails console, Django shell)

### Debugging Commands

**Check Service Status:**
```bash
# Get deployment info
railway status

# View environment variables
railway variables

# Get service details
railway service

# Generate public domain
railway domain
```

**Local Development:**
```bash
# Run with Railway environment
railway run npm start

# Open shell with Railway env
railway shell

# Change linked environment
railway environment
```

## Private Networking

Railway provides automatic private networking between services in the same project.

### Usage Patterns

**Connecting to Database:**
```bash
# Use private domain (faster, no egress)
DATABASE_URL=${{Postgres.RAILWAY_PRIVATE_DOMAIN}}

# Format: railway.internal:port
# postgresql://postgres.railway.internal:5432/railway
```

**API to API Communication:**
```javascript
// Frontend calling backend
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.INTERNAL_API_URL  // ${{api.RAILWAY_PRIVATE_DOMAIN}}
  : 'http://localhost:3001';

// Make request
const response = await fetch(`${API_URL}/api/data`);
```

**Service Discovery:**
```bash
# Each service gets automatic variables:
RAILWAY_PRIVATE_DOMAIN=service-name.railway.internal
RAILWAY_PUBLIC_DOMAIN=service-name-production.up.railway.app

# Use in environment variables:
REDIS_URL=redis://${{Redis.RAILWAY_PRIVATE_DOMAIN}}:6379
API_INTERNAL=https://${{api-service.RAILWAY_PRIVATE_DOMAIN}}
```

## Scaling and Performance

### Horizontal Scaling

**Deploy Multiple Replicas:**
```bash
# Via Railway Dashboard:
# Service Settings → Replicas → Set count

# Via railway.json (coming soon)
{
  "deploy": {
    "numReplicas": 3,
    "regions": ["us-west1", "us-east1", "eu-west1"]
  }
}
```

**Load Distribution:**
- Railway automatically distributes traffic across replicas
- Public traffic routes to nearest region
- Random distribution within region
- Each replica gets full resource allocation

**Resource Calculation:**
```
Total Resources = Number of Replicas × Max Resources per Replica

Example (Pro Plan):
3 replicas × 32 vCPU × 32 GB RAM = 96 vCPU + 96 GB RAM total
```

### Automatic Compute Scaling

Railway automatically scales compute resources based on demand:
- No manual instance sizing needed
- No threshold configuration required
- Pay only for resources used
- Automatic scale up/down based on workload

**Serverless Option:**
```bash
# Enable serverless mode (sleeps after 10min idle)
# Set in Service Settings → Serverless
# Wakes on incoming request
# No compute charges while asleep
```

## CI/CD Integration

### Project Token Deployment

Use project tokens for automated deployments without user authentication:

```bash
# Set token as environment variable
export RAILWAY_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# Deploy with token
railway up

# Or inline
RAILWAY_TOKEN=your-token railway up
```

**Getting a Project Token:**
1. Go to Project Settings → Tokens
2. Create new token with appropriate permissions
3. Store securely in CI/CD secrets

### GitHub Actions

**Deploy on Push:**
```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: railway up --service=${{ secrets.SERVICE_ID }}
```

**Post-Deploy Webhook:**
```yaml
name: Post-Deploy Actions

on:
  deployment_status

jobs:
  post-deploy:
    runs-on: ubuntu-latest
    if: github.event.deployment.environment == 'production'
    steps:
      - name: Run tests
        run: npm test
      
      - name: Notify team
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"Deployed to production!"}'
```

### GitLab CI/CD

```yaml
deploy-job:
  image: ghcr.io/railwayapp/cli:latest
  variables:
    SVC_ID: my-service
  script:
    - railway up --service=$SVC_ID
  environment:
    name: production
  only:
    - main
```

## Database Setup

### PostgreSQL

**Add via CLI:**
```bash
railway add  # Select PostgreSQL

# Get connection string
railway variables --service postgres
```

**Connection Pattern:**
```javascript
// Node.js with pg
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

**Migrations:**
```bash
# Run migrations on deploy
# Add to railway.json:
{
  "build": {
    "preDeploy": "npm run migrate"
  }
}
```

### Redis

**Setup:**
```bash
railway add  # Select Redis

# Reference in app
REDIS_URL=${{Redis.RAILWAY_PRIVATE_DOMAIN}}:6379
```

**Connection:**
```javascript
import { createClient } from 'redis';

const redis = createClient({
  url: `redis://${process.env.REDIS_URL}`
});

await redis.connect();
```

## Templates and Monorepos

### Creating Templates

**From Existing Project:**
```bash
# Generate template from project
railway template create

# Configure:
# - Service names and repos
# - Environment variables
# - Start commands
# - Root directories (for monorepos)
```

**Template Configuration:**
```json
{
  "services": [
    {
      "name": "frontend",
      "source": {
        "repo": "user/repo",
        "directory": "apps/web"
      },
      "env": {
        "NEXT_PUBLIC_API_URL": {
          "description": "API endpoint URL",
          "default": "${{api.RAILWAY_PUBLIC_DOMAIN}}"
        }
      },
      "startCommand": "npm run start",
      "healthcheckPath": "/api/health"
    },
    {
      "name": "api",
      "source": {
        "repo": "user/repo",
        "directory": "apps/api"
      },
      "env": {
        "DATABASE_URL": {
          "description": "PostgreSQL connection string",
          "default": "${{Postgres.DATABASE_URL}}"
        }
      }
    }
  ]
}
```

### Monorepo Support

**Structure:**
```
monorepo/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Express backend
│   └── worker/       # Background jobs
├── packages/
│   ├── shared/       # Shared code
│   └── config/       # Shared configs
└── package.json
```

**Service Configuration:**
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "./Dockerfile",
    "buildCommand": "npm run build:web"
  },
  "deploy": {
    "startCommand": "npm run start:web"
  }
}
```

> **⚠️ Note:** Nixpacks is deprecated and no longer supported. Railway now uses **Railpack** as the default builder. Railpack is the successor to Nixpacks with improved performance and reliability. Migrate any `nixpacks.toml` files to `railpack.json`. You can also use `"builder": "DOCKERFILE"` with a custom Dockerfile for full control.

**Root Directory:**
```bash
# Set for each service
railway variables --set "RAILWAY_SERVICE_ROOT_DIRECTORY=apps/web"
```

## Best Practices

### Organization
1. **One project per application stack**: Keep related services together
2. **Use private networking**: Faster and free for internal communication
3. **Environment separation**: Use Railway's built-in environments (production, staging, PR)
4. **Meaningful service names**: Use descriptive names (api, frontend, worker)

### Configuration
1. **Always use environment variables**: Never hardcode secrets or config
2. **Set appropriate timeouts**: Health checks, build timeouts, start timeouts
3. **Use service references**: `${{service.VARIABLE}}` syntax
4. **Configure health checks**: Enable zero-downtime deployments

### Performance
1. **Enable private networking**: Use `RAILWAY_PRIVATE_DOMAIN` for internal calls
2. **Use multi-stage builds**: Smaller images, faster deploys
3. **Implement proper health checks**: Prevent routing to unhealthy instances
4. **Consider serverless mode**: For low-traffic or bursty workloads

### Security
1. **Use service variables**: Scope secrets to specific services when possible
2. **Never commit secrets**: Use Railway's variable management
3. **Enable HTTPS**: Railway provides automatic TLS
4. **Restrict public access**: Use private networking when possible

### Monitoring
1. **Stream logs regularly**: `railway logs` for troubleshooting
2. **Set up alerts**: Use Railway's webhooks for deployment notifications
3. **Monitor metrics**: Check CPU, memory, and network usage
4. **Test deployments**: Use PR environments for pre-production testing

## Migration Guides

### From Heroku

**Key Differences:**
- No Procfile needed (use railway.json or package.json scripts)
- Automatic SSL (no need for custom domains setup)
- Private networking included (vs Heroku Private Spaces)
- Automatic scaling (vs manual dyno management)

**Migration Steps:**
```bash
# 1. Create Railway project
railway init

# 2. Add database
railway add  # Select PostgreSQL

# 3. Set environment variables
railway variables --set "KEY=value"

# 4. Deploy
railway up

# 5. Add domain
# Via dashboard: Settings → Domains → Add Domain
```

### From Docker Compose

Railway doesn't directly support docker-compose files, but you can translate them:

**docker-compose.yml:**
```yaml
services:
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:5432/db
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret
```

**Railway Translation:**
1. Create service for `api` (link GitHub repo, root: ./api)
2. Add PostgreSQL database
3. Set variables:
   ```bash
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

## Troubleshooting

### Build Issues

**Issue: "Start command not found"**
```json
// Solution: Explicitly set in railway.json
{
  "deploy": {
    "startCommand": "node dist/index.js"
  }
}
```

**Issue: "Module not found"**
```bash
# Solution: Ensure dependencies are in package.json
npm install --save missing-package
git commit -am "Add missing dependency"
git push
```

### Runtime Issues

**Issue: "Port binding failed"**
```javascript
// Solution: Use Railway's PORT and bind to 0.0.0.0
app.listen(process.env.PORT || 3000, '0.0.0.0');
```

**Issue: "Database connection failed"**
```bash
# Check DATABASE_URL is set
railway variables

# Use private domain for internal connections
DATABASE_URL=${{Postgres.RAILWAY_PRIVATE_DOMAIN}}
```

### Health Check Issues

**Issue: "Health check timeout"**
```json
// Solution: Increase timeout
{
  "deploy": {
    "healthcheckTimeout": 300
  }
}
```

**Issue: "Health check returns 404"**
```javascript
// Solution: Ensure endpoint exists and returns 200
app.get('/health', (req, res) => {
  res.sendStatus(200);
});
```

## Quick Reference

### Common CLI Commands
```bash
# Project management
railway init                    # Create new project
railway link                    # Link to existing project
railway status                  # Check project status

# Service management
railway service                 # Select active service
railway add                     # Add new service/database

# Deployment
railway up                      # Deploy current directory
railway up --service=api        # Deploy specific service
railway logs                    # Stream logs
railway logs --tail 100         # Recent logs

# Variables
railway variables               # List variables
railway variables --set "KEY=value"
railway variables --json        # Export as JSON

# Development
railway run npm start           # Run with Railway env
railway shell                   # Open shell with env
```

### Environment Variable Reference
```bash
# Railway-provided
PORT                           # Assigned port
RAILWAY_ENVIRONMENT            # Environment name
RAILWAY_PROJECT_ID             # Project identifier
RAILWAY_SERVICE_NAME           # Service name
RAILWAY_DEPLOYMENT_ID          # Deployment identifier
RAILWAY_PRIVATE_DOMAIN         # Private network address
RAILWAY_PUBLIC_DOMAIN          # Public URL

# Service references
${{ServiceName.VARIABLE}}      # Reference another service
${{Postgres.DATABASE_URL}}     # Database connection string
```

### railway.json Schema
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "./Dockerfile",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "environments": {
    "production": {
      "deploy": {
        "startCommand": "npm run start:prod"
      }
    }
  }
}
```

## AIDEN Platform Deployment Map

**Railway is the main deploy target for the entire AIDEN platform.** Every AIDEN service — Gateway, Creative Agent (a.k.a. Ads / Creative Pipeline at ads.aiden.services), Listen, Pressure Test, Studio V2, Chat/Unified — runs on Railway. Not Vercel, not Render, not Fly. If you think you're pushing to a different platform, you're wrong — check `server: railway-edge` in any response header to confirm.

Each service has a **different deploy method**. Using the wrong one will either fail or break auto-deploy.

### Decision Tree

```
Which AIDEN service are you deploying?
  |
  ├── Gateway (aiden.services)
  │   └── Use Railway CLI: `railway up --detach`
  │   └── Project: AIDEN-GATEWAY, Service: gateway
  │
  ├── Creative Agent / Ads / Creative Pipeline (ads.aiden.services)
  │   └── This is ONE product with several internal names:
  │       "Creative Agent" (product name),
  │       "Ads" (the subdomain ads.aiden.services),
  │       "AIDEN Creative Pipeline" (UI title / repo name).
  │       They all refer to the same Railway service.
  │   └── Git push to `main` branch (auto-deploy)
  │   └── Project: aiden-creative-pipeline, Service: web
  │   └── Repo: tom2tomtomtom/aiden-creative-pipeline
  │   └── Local path: ~/aiden-creative-pipeline
  │   └── DO NOT use `railway up` — git push only
  │
  └── Listen (listen.aiden.services)
      └── Git push to specific remote: `git push aiden-listen culture-wire:main`
      └── Local repo: ~/Code_Projects/research-agent/ on `culture-wire` branch
      └── Project: AIDEN-LISTENING
```

### Gateway (`aiden.services`)

```bash
# Deploy Gateway -- the ONLY AIDEN service using Railway CLI
cd ~/AIDEN-GATEWAY
railway up --detach
# Project: AIDEN-GATEWAY, Service: gateway
```

### Creative Agent / Ads (`ads.aiden.services`)

One product, three names. The product is called "Creative Agent" but is
served at ads.aiden.services and the repo / Railway project is named
"aiden-creative-pipeline". Anywhere you see "Ads", "Creative Agent",
or "AIDEN Creative Pipeline" in conversation or code, it's this
service.

```bash
# Auto-deploys from main branch
cd ~/aiden-creative-pipeline
git push origin main
# Railway picks up the push and rebuilds automatically.
# railway.json is committed in the repo with:
#   - builder: RAILPACK
#   - healthcheckPath: /api/health
#   - Next.js standalone start command

# WARNING: Do NOT run `railway up`, `railway deploy`, or any Railway CLI
# deploy commands. This will conflict with the auto-deploy pipeline.
```

### Listen (`listen.aiden.services`)

```bash
# Listen deploys via git push to a specific remote and branch mapping
cd ~/Code_Projects/research-agent
git push aiden-listen culture-wire:main
# Remote: aiden-listen
# Local branch: culture-wire -> maps to remote main
# Project: AIDEN-LISTENING
```

### Pre-Deploy Checklist (All AIDEN Services)

```bash
# Always build before deploying to catch TS errors
npm run build

# If build passes, deploy using the correct method above
```

### DO NOT

- Run `railway up` on Creative Agent / Ads (conflicts with auto-deploy — git push only)
- Push directly to `main` on Listen without the remote mapping
- Deploy without running `npm run build` first
- Skip type regeneration if schema changed (see supabase-cli skill)
- Assume any AIDEN service is on Vercel, Render, Fly, or self-hosted. It isn't. Railway is the only production deploy target.

---

## Resources

- [Railway Documentation](https://docs.railway.com)
- [Railway CLI GitHub](https://github.com/railwayapp/cli)
- [Railway Templates](https://railway.app/templates)
- [Railway Status](https://status.railway.app)
- [Railway Community](https://discord.gg/railway)
