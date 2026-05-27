# Railway Deployment Skill

A comprehensive skill for deploying multi-service applications on Railway platform with best practices for environment configuration, health checks, and debugging.

## What This Skill Covers

- **Multi-Service Architecture**: Setting up frontend, backend, databases, and workers in a single project
- **Environment Variables**: Configuration patterns and service-to-service references
- **Health Checks**: Implementing zero-downtime deployments with overlap/draining settings
- **Railpack Builder**: Railway's default builder (⚠️ Nixpacks is deprecated)
- **Docker Configuration**: Multi-stage builds and Railway-optimized Dockerfiles
- **Private Networking**: Efficient service-to-service communication
- **SSH Debugging**: Direct container access for troubleshooting
- **CI/CD**: GitHub Actions, GitLab integration, and project token deployments
- **Scaling**: Horizontal scaling and automatic resource management
- **Migration**: Moving from Heroku, Docker Compose, or other platforms

## Quick Start

### Deploy a Single Service
```bash
# Install Railway CLI (multiple options)
npm install -g @railway/cli    # via npm
brew install railway           # via Homebrew (macOS)
bash <(curl -fsSL cli.new)     # via shell script

# Login and create project
railway login
railway init

# Deploy
railway up

# Generate public domain
railway domain
```

### Deploy Multi-Service Stack
```bash
# Create project
railway init

# Add services
railway add  # Select GitHub Repo or Empty Service
railway add  # Select PostgreSQL

# Configure environment variables
railway variables --set "DATABASE_URL=${{Postgres.DATABASE_URL}}"

# Deploy
railway up
```

## Key Features

- Automatic GitHub integration for continuous deployment
- Built-in SSL/TLS for custom domains
- Private networking between services (no egress fees)
- Auto-scaling without manual configuration
- PR preview environments
- Zero-downtime deployments with health checks

## Best Use Cases

- Full-stack applications (React + Node.js + PostgreSQL)
- Microservices architectures
- API backends with workers
- Applications requiring multiple databases
- Projects migrating from Heroku
- Monorepo applications

## Requirements

- Railway account (free or paid plan)
- GitHub repository (for automatic deployments)
- Railway CLI (for command-line management)

## Related Resources

- [Railway Documentation](https://docs.railway.com)
- [Railway CLI](https://github.com/railwayapp/cli)
- [Railway Templates](https://railway.app/templates)
