================================================================================
WORKOUT DIARY - PROJECT ARCHITECTURE & GUIDELINES
================================================================================

PROJECT OVERVIEW
----------------
A fitness tracking application built with Next.js 16, allowing users to log
workouts, manage exercises, and track progress over time with modern React
patterns and TypeScript.

TECH STACK
----------
- Framework: Next.js 16 (App Router) with Server Components
- Language: TypeScript (strict mode)
- Database: PostgreSQL with Neon
- ORM: Drizzle ORM (type-safe queries)
- Authentication: Clerk (@clerk/nextjs)
- Styling: Tailwind CSS v4
- UI Components: shadcn/ui (STRICT REQUIREMENT)
- Date Handling: date-fns with ordinal formatting
- Validation: Zod schemas

DEVELOPMENT COMMANDS
--------------------
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linting

DATABASE COMMANDS
-----------------
npx drizzle-kit generate    # Generate database migrations
npx drizzle-kit migrate     # Apply database migrations
npx drizzle-kit studio      # View database in Drizzle Studio

ENVIRONMENT VARIABLES (.env.local)
----------------------------------
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_neon_database_connection_string

================================================================================
CORE ARCHITECTURE PRINCIPLES
================================================================================

1. SERVER-FIRST DATA FETCHING
------------------------------
✅ ALL data fetching MUST happen in Server Components via /data directory
✅ Use Drizzle ORM with type-safe queries
✅ ALWAYS filter database queries by userId for security
❌ FORBIDDEN: API routes for data access
❌ FORBIDDEN: Client-side data fetching (useEffect, fetch)
❌ FORBIDDEN: Raw SQL queries

2. USER DATA ISOLATION (CRITICAL SECURITY)
-------------------------------------------
✅ Logged-in users can ONLY access their own data
✅ Every database query MUST filter by userId
✅ Verify ownership before UPDATE/DELETE operations
❌ NEVER allow cross-user data access
❌ NEVER skip user filtering in queries

3. AUTHENTICATION FLOW
----------------------
✅ Use Clerk for all authentication
✅ Server components: import { auth } from '@clerk/nextjs/server'
✅ Client components: import { useUser, useAuth } from '@clerk/nextjs'
✅ All protected pages MUST check authentication
✅ Redirect unauthenticated users to home page

4. UI COMPONENT STANDARDS (STRICT)
-----------------------------------
✅ ONLY use shadcn/ui components - NO custom components allowed
✅ Use shadcn/ui Button, Card, Badge, Input, etc. exclusively
✅ All dates MUST use ordinal format (1st Sep 2025, 2nd Aug 2025)
❌ FORBIDDEN: Custom components or UI elements
❌ FORBIDDEN: Custom Tailwind classes on shadcn/ui components

5. NEXT.JS 16 SERVER COMPONENT REQUIREMENTS
--------------------------------------------
✅ All server components MUST be async functions
✅ All dynamic route parameters MUST be awaited: const { id } = await params
✅ All search parameters MUST be awaited: const { query } = await searchParams
✅ Authentication MUST use: const { userId } = await auth()
❌ NEVER mix server and client logic in the same component

6. DATA MUTATIONS
-----------------
✅ ALL mutations MUST use Server Actions in colocated action.ts files
✅ Use 'use server' directive at top of action files
✅ Validate ALL inputs with Zod schemas
✅ Call data helper functions from /data directory
❌ FORBIDDEN: Using redirect() inside server actions (handle client-side)
❌ FORBIDDEN: Client-side mutations or API routes
❌ FORBIDDEN: Missing ownership verification

================================================================================
PROJECT STRUCTURE
================================================================================

app/                      # Next.js App Router
├── layout.tsx           # Root layout with ClerkProvider
├── page.tsx             # Homepage
├── dashboard/           # Dashboard pages
│   ├── page.tsx        # Server Component
│   ├── action.ts       # Server Actions for mutations
│   └── components/     # Client components
├── workouts/           # Workout management
│   ├── page.tsx       # Workouts list (Server Component)
│   ├── [id]/          # Dynamic route for workout details
│   │   └── page.tsx   # Workout detail page
│   └── action.ts      # Workout mutations
└── globals.css        # Global styles

data/                   # Data access layer (SERVER-SIDE ONLY)
├── workouts.ts        # Workout data helpers with user filtering
├── exercises.ts       # Exercise data helpers
└── users.ts           # User profile helpers

db/                     # Database schema and migrations
├── schema.ts          # Drizzle ORM schema definitions
└── migrations/        # Database migration files

lib/                    # Utility functions
├── db.ts              # Database connection
└── utils.ts           # Utility functions (cn, date formatting)

components/            # Reusable client components
└── ui/               # shadcn/ui components only

docs/                  # Architecture documentation
├── auth.md           # Authentication patterns
├── data-fetching.md  # Data fetching rules
├── data-mutations.md # Server Actions guidelines
├── ui.md             # UI component standards
├── server-components.md  # Server component patterns
└── routing.md        # Route protection standards

proxy.ts              # Clerk middleware (used instead of middleware.ts)

================================================================================
CRITICAL DEVELOPMENT PATTERNS
================================================================================

SERVER COMPONENT DATA FLOW
--------------------------
✅ CORRECT Pattern:
export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const workouts = await getUserWorkouts(userId)
  return <DashboardClient workouts={workouts} />
}

❌ FORBIDDEN Patterns:
- Client-side fetching in useEffect
- API routes for data access
- Missing userId filtering
- Raw SQL queries

DATA HELPER FUNCTIONS
---------------------
✅ CORRECT Pattern (data/workouts.ts):
export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))  // ALWAYS filter by userId
}

❌ FORBIDDEN: No user filtering or raw SQL

SERVER ACTIONS FOR MUTATIONS
-----------------------------
✅ CORRECT Pattern (app/workouts/action.ts):
'use server'

const CreateWorkoutSchema = z.object({
  title: z.string().min(1).max(100),
  date: z.string().datetime(),
})

export async function createWorkoutAction(data: z.infer<typeof CreateWorkoutSchema>) {
  const validatedData = CreateWorkoutSchema.parse(data)
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Not authenticated')
  }

  const workout = await createWorkout({ ...validatedData, userId })
  return { success: true, workout }  // Client handles redirect
}

CLIENT COMPONENT INTEGRATION
-----------------------------
✅ CORRECT Pattern:
'use client'
export function WorkoutForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await createWorkoutAction(data)
      if (result.success) {
        router.push(`/workouts/${result.workout.id}`)  // Client-side redirect
        router.refresh()
      }
    })
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}

UI COMPONENT USAGE
------------------
✅ CORRECT - shadcn/ui only:
<Button variant="default" size="sm">Log Workout</Button>
<Card>
  <CardHeader><CardTitle>Workout Title</CardTitle></CardHeader>
  <CardContent>Content here</CardContent>
</Card>

❌ FORBIDDEN - Custom components or styling:
<button className="custom-button">...</button>  // NO
<div className="custom-card">...</div>          // NO

DATE FORMATTING
---------------
✅ CORRECT - Ordinal dates everywhere:
import { formatDateWithOrdinal } from '@/lib/utils'
<p>{formatDateWithOrdinal(new Date(2025, 8, 26))}</p>
// Output: "26th Aug 2025"

❌ FORBIDDEN - Standard date formatting

================================================================================
DATABASE SCHEMA
================================================================================

CORE TABLES
-----------
exercises           - Master exercise library
  - id, name, category, muscleGroups, equipment, userId
  - Categories: strength, cardio, flexibility, sports

workouts            - User workout sessions
  - id, userId, title, date, notes, createdAt, updatedAt

workout_exercises   - Junction table (workouts ↔ exercises)
  - id, workoutId, exerciseId, order, restPeriod

exercise_sets       - Individual sets per exercise
  - id, workoutExerciseId, reps, weight, duration, distance

================================================================================
SECURITY REQUIREMENTS
================================================================================

1. USER DATA ISOLATION
   ✅ Every query MUST filter by userId
   ✅ Verify ownership before UPDATE/DELETE
   ✅ Never expose other users' data

2. AUTHENTICATION
   ✅ Check authentication in ALL server components
   ✅ Redirect unauthenticated users
   ✅ Use Clerk auth() for server, useAuth() for client

3. INPUT VALIDATION
   ✅ Validate ALL inputs with Zod schemas
   ✅ Sanitize user input (trim, transform)
   ✅ Handle validation errors gracefully

4. ERROR HANDLING
   ✅ Implement try/catch in server actions
   ✅ Log errors for debugging
   ✅ Return user-friendly error messages

================================================================================
PERFORMANCE BEST PRACTICES
================================================================================

1. PARALLEL DATA FETCHING
   const [workouts, exercises] = await Promise.all([
     getUserWorkouts(userId),
     getUserExercises(userId)
   ])

2. CACHING
   Use Next.js unstable_cache for expensive operations

3. OPTIMISTIC UPDATES
   Use useOptimistic for better UX

4. BATCH OPERATIONS
   Prefer batch mutations over individual operations

================================================================================
TESTING STANDARDS
================================================================================

1. Unit test data helper functions
2. Mock Clerk auth in tests
3. Test server actions with validation
4. Verify user data isolation
5. Test error scenarios

================================================================================
KEY DOCUMENTATION FILES
================================================================================

MANDATORY READING BEFORE CODE CHANGES:
1. /docs/ui.md              - UI component standards
2. /docs/data-fetching.md   - Data fetching rules
3. /docs/data-mutations.md  - Server Actions patterns
4. /docs/auth.md            - Authentication requirements
5. /docs/server-components.md - Next.js 16 server patterns
6. /docs/routing.md         - Route protection standards

================================================================================
COMPLETED FEATURES
================================================================================

✅ Next.js 16 setup with App Router
✅ TypeScript configuration (strict mode)
✅ Tailwind CSS v4 styling
✅ Clerk authentication integration
✅ Neon database with Drizzle ORM
✅ Database schema (workouts/exercises/sets)
✅ Data access layer with user filtering
✅ shadcn/ui components configured
✅ Dashboard with workout logging
✅ Server-first data fetching pattern
✅ User data isolation in all queries
✅ Ordinal date formatting system

================================================================================
DEVELOPMENT NOTES
================================================================================

1. proxy.ts is used instead of middleware.ts for Clerk middleware
2. MCP servers available: Neon (database), Playwright (browser automation)
3. Always check /docs before making code changes
4. Documentation takes precedence over general patterns
5. Security and user data isolation are HIGHEST priority
6. shadcn/ui component standards are STRICT - no exceptions

================================================================================
FORBIDDEN PRACTICES (NEVER DO THESE)
================================================================================

❌ API routes for data access
❌ Client-side data fetching (useEffect + fetch)
❌ Raw SQL queries
❌ Custom UI components (must use shadcn/ui)
❌ Cross-user data access
❌ Missing userId filtering in queries
❌ Using redirect() in server actions
❌ Missing Zod validation in server actions
❌ Missing ownership verification before mutations
❌ Standard date formatting (must use ordinal)
❌ Mixing server and client logic

================================================================================
SUMMARY
================================================================================

This project follows a mature, production-ready architecture with strict
patterns for security, consistency, and maintainability:

- Server Components for ALL data fetching
- User data isolation in EVERY query
- shadcn/ui components EXCLUSIVELY
- Zod validation for ALL inputs
- Clerk authentication throughout
- Next.js 16 async/await patterns
- Ordinal date formatting everywhere

ALWAYS refer to /docs directory before making ANY code changes.
Security and user data protection are the HIGHEST priorities.

================================================================================
