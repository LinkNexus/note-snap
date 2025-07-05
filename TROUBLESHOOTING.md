# Authentication Troubleshooting Guide

## Current Issues and Solutions

### Error: GET /api/auth/session 500 (Internal Server Error)

This error occurs when NextAuth cannot properly initialize. Here are the fixes implemented:

#### 1. Environment Variables
**Problem**: Missing or incorrect environment variables
**Solution**: Updated `.env.local` and `compose.yaml` with proper values

```bash
# .env.local - Fixed
DATABASE_URL="postgres://app:!ChangeMe!@database:5432/app"
NEXTAUTH_URL="http://note-snap.docker.localhost"
NEXTAUTH_SECRET="your-development-secret-key-change-this-in-production-make-it-long-and-secure"
```

#### 2. Database Connection
**Problem**: Database not accessible or schema not created
**Solution**: 
- Created centralized database connection in `/lib/db.ts`
- Added database setup script in `/scripts/setup-db.sh`
- Updated all database imports to use centralized connection

#### 3. OAuth Provider Configuration
**Problem**: Missing OAuth credentials causing NextAuth to fail
**Solution**: 
- Modified auth configuration to conditionally load OAuth providers
- Added dummy values for development
- Added proper error handling for missing credentials

#### 4. NextAuth Configuration
**Problem**: Invalid NextAuth configuration
**Solution**:
- Added debug mode for development
- Improved error handling in credentials provider
- Added proper TypeScript types

## Recent Fixes Applied

### Fix for Prisma Client Not Initialized Error

**Problem**: `@prisma/client did not initialize yet. Please run "prisma generate"`

**Root Cause**: 
- Prisma commands were running at Docker build time instead of runtime
- Database was not available during build process
- Prisma client generation was happening before database connection

**Solution Applied**:
1. **Updated Dockerfile**: Moved Prisma operations to runtime via entrypoint script
2. **Created entrypoint.sh**: Proper startup sequence with database wait
3. **Added PostgreSQL client**: Installed `pg_isready` for database health checks
4. **Updated database connection**: Improved Prisma client initialization
5. **Added health check**: API endpoint to verify database connectivity

**Files Modified**:
- `/Dockerfile` - Moved Prisma operations to runtime
- `/entrypoint.sh` - New startup script with proper sequencing
- `/src/lib/db.ts` - Improved Prisma client initialization
- `/src/app/api/health/route.ts` - New health check endpoint
- `/compose.yaml` - Added service dependencies and health checks

**New Startup Sequence**:
1. Wait for database service to be healthy
2. Install dependencies if needed
3. Generate Prisma client
4. Push database schema
5. Start Next.js application

## Setup Instructions

### 1. Database Setup
```bash
# Run the database setup script
./scripts/setup-db.sh
```

### 2. Environment Configuration
Make sure all environment variables are set in both `.env.local` and `compose.yaml`:

```bash
# Check environment variables
docker-compose exec app printenv | grep -E "(DATABASE_URL|NEXTAUTH_)"
```

### 3. Database Schema
```bash
# Generate Prisma client
docker-compose exec app npx prisma generate

# Push schema to database
docker-compose exec app npx prisma db push
```

### 4. Test Database Connection
```bash
# Test database connection
docker-compose exec app npx prisma db push --preview-feature
```

## Development Workflow

### 1. Start Services
```bash
docker-compose up -d
```

### 2. Check Logs
```bash
# Check app logs
docker-compose logs app

# Check database logs
docker-compose logs database
```

### 3. Access Application
- Main app: http://note-snap.docker.localhost
- Database: localhost:5432 (from host)

## Common Issues and Solutions

### Issue: "ClientFetchError: Unexpected token '<'"
**Cause**: NextAuth API returning HTML instead of JSON
**Solution**: 
- Check environment variables are set
- Verify database connection
- Ensure Prisma client is generated

### Issue: Database connection failed
**Cause**: Database not ready or wrong credentials
**Solution**:
- Wait for database to be ready
- Check database logs
- Verify connection string

### Issue: Social login not working
**Cause**: Missing OAuth credentials
**Solution**:
- Add proper OAuth app credentials
- Or use credentials-only login for development

### Issue: Middleware errors
**Cause**: Auth configuration issues
**Solution**:
- Added error handling in middleware
- Fallback to allow requests on auth errors

## Testing the Authentication

### 1. Test Registration
```bash
curl -X POST http://note-snap.docker.localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 2. Test Login
- Go to: http://note-snap.docker.localhost/login
- Use credentials created above

### 3. Test Session
```bash
# Check session endpoint
curl http://note-snap.docker.localhost/api/auth/session
```

## Production Considerations

### 1. Environment Variables
- Set proper NEXTAUTH_SECRET (32+ characters)
- Use real OAuth credentials
- Secure database connection

### 2. Database
- Use managed PostgreSQL service
- Set up proper backups
- Configure connection pooling

### 3. Security
- Enable HTTPS
- Set secure cookies
- Configure CORS properly

## File Changes Made

### New Files
- `/lib/db.ts` - Centralized database connection
- `/scripts/setup-db.sh` - Database setup script
- `/app/error.tsx` - Error boundary component
- `/entrypoint.sh` - New startup script for Docker

### Modified Files
- `/lib/auth.ts` - Improved NextAuth configuration
- `/app/api/auth/register/route.ts` - Updated database import
- `/middleware.ts` - Added error handling
- `/.env.local` - Fixed environment variables
- `/compose.yaml` - Added NextAuth environment variables
- `/app/login/page.tsx` - Improved error handling
- `/app/signup/page.tsx` - Improved error handling
- `/Dockerfile` - Moved Prisma operations to runtime
- `/src/lib/db.ts` - Improved Prisma client initialization
- `/src/app/api/health/route.ts` - New health check endpoint

## Next Steps

1. **Run database setup**: `./scripts/setup-db.sh`
2. **Test basic auth**: Try registering and logging in
3. **Check logs**: Monitor for any remaining errors
4. **Set up OAuth**: Add real OAuth credentials when needed
5. **Test protected routes**: Verify middleware is working

The authentication system should now work with basic email/password authentication. Social login will work once proper OAuth credentials are configured.
