# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY turbo.json ./
COPY apps/socketServerGameHub/package.json ./apps/socketServerGameHub/
COPY packages/database/package.json ./packages/database/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Copy Prisma schema for the database package
COPY packages/database/prisma ./packages/database/prisma/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npm run db:generate --filter=@repo/database

# Build the database package
RUN cd packages/database && npm run build

# Build the socket server directly without turbo
RUN cd apps/socketServerGameHub && npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 socketuser

# Copy the built application
COPY --from=builder --chown=socketuser:nodejs /app/apps/socketServerGameHub/dist ./dist
COPY --from=builder --chown=socketuser:nodejs /app/apps/socketServerGameHub/package.json ./package.json
COPY --from=builder --chown=socketuser:nodejs /app/node_modules ./node_modules

# Copy the built database package so @repo/database can be resolved
COPY --from=builder --chown=socketuser:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=socketuser:nodejs /app/packages/database/package.json ./packages/database/package.json

USER socketuser

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/server.js"] 