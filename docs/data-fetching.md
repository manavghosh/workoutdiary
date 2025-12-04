# Data Fetching Guidelines

## Core Principle

**ALL data fetching within this application MUST be done via Server Components ONLY.** This is a critical architectural requirement that ensures security, performance, and data integrity.

## Strict Requirements

### 1. Server Components Only
- ✅ **Allowed**: Server Components using `async/await` directly
- ❌ **Forbidden**: Route handlers (API routes)
- ❌ **Forbidden**: Client-side data fetching (useEffect, fetch, etc.)
- ❌ **Forbidden**: Direct database queries from client components

### 2. Database Access Pattern
- ✅ **Allowed**: Helper functions within `/data` directory using Drizzle ORM
- ❌ **Forbidden**: Raw SQL queries
- ❌ **Forbidden**: Direct database connections outside helper functions

### 3. Data Security: User Isolation
- **CRITICAL**: Logged-in users can ONLY access their own data
- **NEVER**: Allow users to access data belonging to other users
- **ALWAYS**: Filter database queries by `userId` or similar user identifier
- **REQUIRE**: Row-level security in all data access functions

## Implementation Pattern

### Server Component Example
```tsx
// app/dashboard/page.tsx
import { getUserWorkouts } from '@/data/workouts'
import { auth } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const workouts = await getUserWorkouts(userId)

  return <DashboardClient workouts={workouts} />
}
```

### Data Helper Function Example
```tsx
// data/workouts.ts
import { db } from '@/lib/db'
import { workouts, exercises } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'

export async function getUserWorkouts(userId: string) {
  // ALWAYS filter by userId
  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))

  return userWorkouts
}
```

## Database Query Rules

### 1. Always Use Drizzle ORM
- Use the established Drizzle ORM configuration
- Leverage type-safe query builders
- Never write raw SQL strings

### 2. User Filtering is Mandatory
Every database query MUST include user filtering:
```tsx
// ❌ WRONG - No user filtering
export async function getAllExercises() {
  return db.select().from(exercises)
}

// ✅ CORRECT - User-specific filtering
export async function getUserExercises(userId: string) {
  return db
    .select()
    .from(exercises)
    .where(eq(exercises.userId, userId))
}
```

### 3. Data Helper Location
All data access functions must be in `/data` directory:
- `/data/workouts.ts` - Workout-related queries
- `/data/exercises.ts` - Exercise-related queries
- `/data/progress.ts` - Progress tracking queries
- `/data/users.ts` - User profile queries

## Data Flow Architecture

### Correct Data Flow
1. **Server Component** calls data helper function
2. **Data Helper** uses Drizzle ORM with user filtering
3. **Database** returns user-specific data only
4. **Server Component** passes data as props to client components
5. **Client Component** renders the data (no fetching)

### Data Passing Pattern
```tsx
// Server Component fetches data
export default async function WorkoutsPage() {
  const workouts = await getUserWorkouts(userId)
  return <WorkoutsList workouts={workouts} />
}

// Client Component receives data as props
'use client'
export function WorkoutsList({ workouts }: { workouts: Workout[] }) {
  // Only render, never fetch
  return workouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)
}
```

## Security Considerations

### 1. Row-Level Security
- Every data access must be scoped to the authenticated user
- No cross-user data access under any circumstances
- Validate user ownership in all CRUD operations

### 2. Input Validation
- Validate user inputs in server components before database operations
- Use TypeScript for type safety
- Implement proper error handling

### 3. Performance Optimization
- Leverage Next.js caching where appropriate
- Use database indexes for user columns
- Implement pagination for large datasets

## Common Anti-Patterns to Avoid

### ❌ NEVER DO THIS
```tsx
// Client-side fetching (FORBIDDEN)
'use client'
function WorkoutsList() {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    fetch('/api/workouts') // FORBIDDEN
      .then(res => res.json())
      .then(setWorkouts)
  }, [])

  return workouts.map(/* ... */)
}
```

### ❌ NEVER DO THIS
```tsx
// API route handler (FORBIDDEN)
// app/api/workouts/route.ts
export async function GET() {
  const workouts = await db.select().from(workouts) // NO USER FILTERING
  return Response.json(workouts) // SECURITY RISK
}
```

### ❌ NEVER DO THIS
```tsx
// Raw SQL (FORBIDDEN)
export async function getUserData(userId: string) {
  const result = await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`)
  return result
}
```

## Required Dependencies

Ensure these packages are installed for proper data fetching:
```json
{
  "dependencies": {
    "@clerk/nextjs": "^latest",
    "drizzle-orm": "^latest",
    "@neondatabase/serverless": "^latest"
  }
}
```

## Testing Data Access

When testing data access functions:
- Always pass valid user IDs
- Verify data isolation between users
- Test edge cases (empty results, missing users)
- Ensure proper error handling

## Summary

This strict data fetching architecture ensures:
- **Security**: Users can only access their own data
- **Performance**: Server-side data fetching with Next.js optimizations
- **Type Safety**: Drizzle ORM with TypeScript
- **Maintainability**: Centralized data access patterns
- **Scalability**: Proper database query patterns

**These rules are mandatory and must be followed for all data operations in this application.**