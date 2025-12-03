# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Workout Diary** application built with **Next.js 16**, using modern React patterns and TypeScript. It's a fitness tracking application that allows users to log workouts, manage exercises, and track progress over time.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Server Components
- **Language**: TypeScript (strict)
- **Database**: PostgreSQL with Neon
- **ORM**: Drizzle ORM with type-safe queries
- **Authentication**: Clerk (@clerk/nextjs)
- **Styling**: Tailwind CSS v4 + shadcn/ui components (strict)
- **Date Handling**: date-fns with ordinal formatting
- **Build Tool**: Next.js with TypeScript compilation

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

The development server runs on `http://localhost:3000`.

## Database Commands

```bash
# Generate database migrations
npx drizzle-kit generate

# Apply database migrations
npx drizzle-kit migrate

# View database studio
npx drizzle-kit studio
```

## Project Structure

- **`app/`** - Next.js App Router directory
  - `layout.tsx` - Root layout with ClerkProvider and font configuration
  - `page.tsx` - Homepage component (currently starter template)
  - `globals.css` - Global CSS styles
- **`middleware.ts`** - Clerk middleware for authentication (configured)
- **`.env.local`** - Environment variables for Clerk keys (to be created)
- **`public/`** - Static assets (images, icons)
- **`components/`** - React components (to be created)
- **`lib/`** - Utility functions and configurations (to be created)
- **`types/`** - TypeScript type definitions (to be created)

## Architecture Overview

### Core Database Schema
- **exercises**: Master exercise library with categories (strength, cardio, flexibility, sports)
- **workouts**: User workout sessions with metadata and timestamps
- **workout_exercises**: Junction table linking workouts to exercises with order and rest periods
- **exercise_sets**: Individual sets for each exercise (weight, reps, duration, distance)

### Data Access Pattern
- **Server Components Only**: All data fetching happens in server components via `/data` directory
- **User Isolation**: All database queries filtered by `userId` for security
- **Drizzle ORM**: Type-safe database queries with no raw SQL
- **No API Routes**: Forbidden - all data access through server components

### Authentication Flow
- **Clerk Integration**: Full authentication system with Clerk middleware
- **Server/Auth Client Pattern**: `@clerk/nextjs/server` in server components, `@clerk/nextjs` in client components
- **Protected Routes**: Middleware-based route protection with redirect to sign-in

### UI Component Standards
- **shadcn/ui Only**: Strict requirement - no custom components allowed
- **Consistent Patterns**: All UI built from shadcn/ui components (Button, Card, Badge, etc.)
- **Ordinal Dates**: All dates displayed in ordinal format (1st Sep 2025, 2nd Aug 2025)
- **Dark Mode**: Built-in support with proper contrast testing

### File Architecture
- **`app/`**: Next.js App Router with server components
- **`data/`**: Data access functions with user filtering (mandatory)
- **`db/`**: Database schema and migration definitions
- **`lib/`**: Database connections and utilities
- **`components/`**: Reusable React components (client components only)
- **`docs/`**: Architecture documentation and implementation guidelines

## Key Configuration Files

- **`next.config.ts`** - Next.js configuration (currently minimal)
- **`tailwindcss`** - Styled with Tailwind v4 (latest version)
- **`tsconfig.json`** - TypeScript configuration for Next.js
- **`eslint.config.mjs`** - ESLint configuration
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind

## Key Architectural Reference Docs
- /docs/auth.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/ui.md
- /docs/server-components.md
- /docs/routing.md

## Critical Development Rules

### Data Fetching (Mandatory)
```tsx
// ✅ CORRECT: Server Component with data helper
export default async function DashboardPage() {
  const { userId } = await auth()
  const workouts = await getUserWorkouts(userId)
  return <DashboardClient workouts={workouts} />
}

// ❌ FORBIDDEN: Client-side fetching
// ❌ FORBIDDEN: API routes
// ❌ FORBIDDEN: Raw SQL queries
```

### UI Component Standards (Strict)
```tsx
// ✅ CORRECT: shadcn/ui only
<Button variant="default" size="sm">Log Workout</Button>
<Card>
  <CardHeader><CardTitle>Workout Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ FORBIDDEN: Custom components
// ❌ FORBIDDEN: Custom Tailwind classes on shadcn/ui components
// ❌ FORBIDDEN: Non-shadcn/ui UI elements
```

### Date Formatting (Required)
```tsx
// ✅ CORRECT: Ordinal dates everywhere
import { formatDateWithOrdinal } from '@/lib/utils'
<p>Workout for {formatDateWithOrdinal(new Date(2025, 8, 26))}</p>
// Output: "Workout for 26th Aug 2025"

// ❌ WRONG: Standard date formatting
```

### User Data Security (Critical)
```tsx
// ✅ CORRECT: Always filter by userId
export async function getUserWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}

// ❌ FORBIDDEN: No user filtering
// ❌ FORBIDDEN: Cross-user data access
```

## File Creation Guidelines

### Components (`components/`)
- Client components only (`'use client'`)
- Built exclusively with shadcn/ui components
- No data fetching - receive data as props
- TypeScript props with proper interfaces

### Data Access (`data/`)
- Server functions only with user filtering
- Drizzle ORM queries (no raw SQL)
- Exported functions for specific data operations
- Proper error handling and type safety

### Pages (`app/`)
- Server components by default
- Authentication checks with `auth()` from `@clerk/nextjs/server`
- Data fetching via `/data` functions
- Pass data to client components as props

## Database Operations

### Schema Management
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# View database in Drizzle Studio
npm run db:studio
```

### Schema Updates
- Modify `db/schema.ts` for changes
- Generate migrations with Drizzle Kit
- Apply via migration system
- Use Neon database for hosted Postgres

## Environment Setup

### Required Environment Variables (.env.local)
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Neon Database
DATABASE_URL=your_neon_database_connection_string
```

### Clerk Integration Checklist
- [x] Install `@clerk/nextjs` package (already installed)
- [x] Create middleware.ts with `clerkMiddleware()` (completed)
- [ ] Wrap layout.tsx with `<ClerkProvider>`
- [ ] Configure sign-in/up pages
- [ ] Test authentication flow

## Key Implementation Patterns

### Server Component Data Flow
1. **Authentication**: Get userId via `await auth()` from `@clerk/nextjs/server`
2. **Data Fetching**: Call appropriate `/data` function with userId
3. **Error Handling**: Redirect to sign-in if not authenticated
4. **Props Passing**: Send data to client components as props
5. **Rendering**: Client components render data only (no fetching)

### Client Component Rules
- Use `'use client'` directive
- Accept data via props interface
- Use shadcn/ui components exclusively
- No useEffect, useState for data fetching
- Handle user interactions with Clerk components

### Database Query Pattern
```tsx
// data/workouts.ts - Example
import { db } from '@/lib/db'
import { workouts, eq } from 'drizzle-orm'

export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
}
```

## Documentation Reference System

**CRITICAL**: All code generation MUST follow this documentation hierarchy:

1. **First**: Check `/docs` directory for relevant guidance
2. **UI Standards**: Reference `/docs/ui.md` for all component work
3. **Data Standards**: Reference `/docs/data-fetching.md` for data operations
4. **Implement**: Only after documentation review, proceed with code

### Available Documentation
- **`/docs/ui.md`**: Complete shadcn/ui component standards and patterns
- **`/docs/data-fetching.md`**: Strict data fetching rules and security patterns

### Documentation Priority
1. Security and user data isolation (highest priority)
2. UI component consistency (shadcn/ui only)
3. Data fetching patterns (server components only)
4. Date formatting standards (ordinal dates required)

## Current Application State

### Completed Features
- ✅ Next.js 16 setup with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS v4 styling
- ✅ Clerk authentication integration
- ✅ Neon database with Drizzle ORM
- ✅ Database schema for workouts/exercises/sets
- ✅ Data access layer with user filtering
- ✅ shadcn/ui components configured
- ✅ Dashboard with workout logging

### Architecture Established
- ✅ Server-first data fetching pattern
- ✅ User data isolation in all queries
- ✅ shadcn/ui component standards
- ✅ Ordinal date formatting system
- ✅ Authentication flow with Clerk

The application follows a mature, production-ready architecture with strict patterns for security, consistency, and maintainability.

## Key Development Notes

- Use MCP servers for Neon database operations and Playwright browser automation when needed
- `middleware.ts` is `proxy.ts` file in this project - use proxy.ts instead of middleware.ts
- Always refer to design guidelines in `/docs` folder before making code changes
- `/docs` design documents take precedence over general implementation patterns
- Reference `/docs/ui.md`, `/docs/data-fetching.md`, `/docs/auth.md`, and `/docs/data-mutations.md` before any code modifications