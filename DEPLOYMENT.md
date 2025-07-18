# Deployment Guide

This guide covers deploying both the GameHub frontend (Vercel) and Socket.IO backend (Coolify).

## Frontend Deployment (Vercel)

### 1. Environment Variables

Create a `.env` file in `apps/GameHub/` with:

```env
# Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/gamesprout"

# Socket Server (production URL)
SOCKET_SERVER_URL="https://your-socket-server.coolify.app"

# App Configuration
NODE_ENV="production"
PORT=3000

# Vercel (auto-populated)
VERCEL_URL=""
```

### 2. Vercel Configuration

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Set root directory to `apps/GameHub`

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add all variables from the `.env` file above
   - Set `NODE_ENV=production`

### 3. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Backend Deployment (Coolify)

### 1. Environment Variables

Create a `.env` file in `apps/socketServerGameHub/` with:

```env
# Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/gamesprout"

# Server Configuration
NODE_ENV="production"
PORT=3001

# CORS (frontend URL)
CORS_ORIGIN="https://your-frontend.vercel.app"

# Socket.IO Configuration
SOCKET_CORS_ORIGIN="https://your-frontend.vercel.app"
```

### 2. Coolify Configuration

1. **Create Application**
   - Source: Git Repository
   - Repository: Your GitHub repo
   - Branch: `main`

2. **Build Settings**
   - Build Path: `apps/socketServerGameHub`
   - Dockerfile: `apps/socketServerGameHub/Dockerfile`
   - Build Context: Root directory

3. **Environment Variables**
   - Add all variables from the `.env` file above
   - Set `NODE_ENV=production`

4. **Port Configuration**
   - Expose Port: `3001`
   - Internal Port: `3001`

### 3. Deploy

1. **Build and Deploy**
   - Click "Build & Deploy" in Coolify
   - Monitor the build logs

2. **Health Check**
   - Endpoint: `/health`
   - Expected Response: `200 OK`

## Database Setup

### 1. PostgreSQL Database

1. **Create Database**
   ```sql
   CREATE DATABASE gamesprout;
   CREATE USER gamesprout_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE gamesprout TO gamesprout_user;
   ```

2. **Run Migrations**
   ```bash
   # Generate Prisma client
   npm run build --filter=@repo/database
   
   # Push schema
   npm run db:push --filter=@repo/database
   ```

### 2. Database URLs

- **Development**: `postgresql://localhost:5432/gamesprout`
- **Production**: `postgresql://username:password@your-db-host:5432/gamesprout`

## SSL/TLS Configuration

### Frontend (Vercel)
- Automatic SSL certificate
- Custom domain support
- Edge functions available

### Backend (Coolify)
- Automatic SSL with Let's Encrypt
- Custom domain support
- Reverse proxy configuration

## Monitoring and Logs

### Vercel
- Built-in analytics
- Function logs
- Performance monitoring

### Coolify
- Application logs
- Resource monitoring
- Health checks

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` matches frontend URL exactly
   - Check for trailing slashes

2. **Database Connection**
   - Verify `DATABASE_URL` format
   - Check firewall rules
   - Ensure database is accessible

3. **Socket.IO Connection**
   - Verify `SOCKET_SERVER_URL` is correct
   - Check SSL certificates
   - Ensure ports are open

### Debug Commands

```bash
# Check database connection
npm run db:studio --filter=@repo/database

# Test socket server locally
npm run dev --filter=@repo/socket-server

# Build and test locally
npm run build
npm run start --filter=@repo/socket-server
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong passwords
   - Rotate secrets regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Restrict database access

3. **Network Security**
   - Use HTTPS everywhere
   - Configure CORS properly
   - Implement rate limiting

## Performance Optimization

1. **Frontend**
   - Enable Vercel Edge Functions
   - Use CDN for static assets
   - Implement caching strategies

2. **Backend**
   - Use connection pooling
   - Implement caching
   - Monitor resource usage

3. **Database**
   - Add indexes for queries
   - Use read replicas if needed
   - Monitor query performance 