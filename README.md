# GameSprout - Turbo Monorepo

A modern game platform built with Remix, Socket.IO, and Prisma, organized as a Turbo monorepo.

## 🏗️ Project Structure

```
gamesprout/
├── apps/
│   ├── gamehub/           # Remix frontend app (deployed on Vercel)
│   └── socket-server/     # Socket.IO backend server (deployed on Coolify)
├── packages/
│   ├── database/          # Shared Prisma schema and client
│   ├── types/             # Shared TypeScript types
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── package.json           # Root package.json with workspace configuration
└── turbo.json            # Turbo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 11.2.0
- Database (PostgreSQL recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gamesprout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp apps/gamehub/.env.example apps/gamehub/.env
   cp apps/socket-server/.env.example apps/socket-server/.env
   cp packages/database/.env.example packages/database/.env
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run build --filter=@repo/database
   
   # Push database schema
   npm run db:push --filter=@repo/database
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev --filter=@repo/gamehub
   npm run dev --filter=@repo/socket-server
   ```

## 📦 Available Scripts

### Root Level
- `npm run build` - Build all packages and apps
- `npm run dev` - Start development servers for all apps
- `npm run lint` - Lint all packages and apps
- `npm run check-types` - Type check all packages and apps

### Individual Apps
- `npm run dev --filter=@repo/gamehub` - Start Remix frontend
- `npm run dev --filter=@repo/socket-server` - Start Socket.IO server
- `npm run build --filter=@repo/gamehub` - Build Remix app
- `npm run build --filter=@repo/socket-server` - Build Socket.IO server

### Database Operations
- `npm run db:generate --filter=@repo/database` - Generate Prisma client
- `npm run db:push --filter=@repo/database` - Push schema to database
- `npm run db:migrate --filter=@repo/database` - Run migrations
- `npm run db:studio --filter=@repo/database` - Open Prisma Studio

## 🌐 Deployment

### Frontend (Vercel)

The Remix app is configured for Vercel deployment:

1. **Connect to Vercel**
   - Link your repository to Vercel
   - Set the root directory to `apps/gamehub`
   - Configure build command: `npm run build`
   - Set output directory: `build`

2. **Environment Variables**
   ```env
   DATABASE_URL=your_database_url
   SOCKET_SERVER_URL=your_socket_server_url
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend (Coolify)

The Socket.IO server is configured for Coolify deployment:

1. **Docker Configuration**
   - Create a `Dockerfile` in `apps/socket-server/`
   - Set build context to the root directory
   - Use multi-stage build for optimization

2. **Environment Variables**
   ```env
   DATABASE_URL=your_database_url
   PORT=3001
   NODE_ENV=production
   ```

3. **Deploy to Coolify**
   - Connect your repository
   - Set the build path to `apps/socket-server`
   - Configure the build and start commands

## 🔧 Development

### Adding New Packages

1. Create a new directory in `packages/`
2. Add `package.json` with `@repo/` prefix
3. Update root `package.json` workspaces if needed
4. Add to `turbo.json` tasks if necessary

### Adding New Apps

1. Create a new directory in `apps/`
2. Add `package.json` with `@repo/` prefix
3. Configure build and dev scripts
4. Update `turbo.json` if needed

### Shared Dependencies

- **Database**: Use `@repo/database` for Prisma operations
- **Types**: Use `@repo/types` for shared interfaces
- **UI**: Use `@repo/ui` for shared components
- **Config**: Use `@repo/eslint-config` and `@repo/typescript-config`

## 🗄️ Database

The database is managed through the shared `@repo/database` package:

- **Schema**: `packages/database/prisma/schema.prisma`
- **Migrations**: `packages/database/prisma/migrations/`
- **Client**: Generated in `packages/database/node_modules/.prisma/`

### Database Operations

```bash
# Generate client
npm run build --filter=@repo/database

# Push schema changes
npm run db:push --filter=@repo/database

# Create migration
npm run db:migrate --filter=@repo/database

# Open Prisma Studio
npm run db:studio --filter=@repo/database
```

## 🔌 Socket.IO Integration

The frontend and backend communicate via Socket.IO:

- **Frontend**: Uses `socket.io-client` to connect to the server
- **Backend**: Uses `socket.io` to handle real-time connections
- **Types**: Shared types in `@repo/types` ensure type safety

### Socket Events

- `joinGame` - Player joins a game
- `leaveGame` - Player leaves a game
- `gameStateUpdate` - Game state changes
- `playerJoined` - New player joins
- `playerLeft` - Player disconnects

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test --filter=@repo/gamehub
npm run test --filter=@repo/socket-server

# Run e2e tests
npm run test:e2e --filter=@repo/gamehub
```

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is private and proprietary.
