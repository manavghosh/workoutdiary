# Server Components Standards

## Overview

**Workout Diary uses Next.js 16 App Router with Server Components as the primary data fetching and authentication pattern.** This document outlines the critical standards and patterns for server component development in this application.

## Core Server Component Requirements

### 1. async/await is MANDATORY

**All server components that use Next.js 16 features MUST be async functions:**

```tsx
// ✅ CORRECT: Async server component
export default async function WorkoutPage({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // MUST await params
  const { userId } = await auth() // MUST await auth()

  const workout = await getWorkoutById(id, userId)
  return <WorkoutClient workout={workout} />
}

// ❌ WRONG: Sync server component (Next.js 16)
export default function WorkoutPage({ params }: {
  params: { id: string } // Type error - params is Promise
}) {
  const { id } = params // Runtime error - params is Promise
  const workout = await getWorkoutById(id) // Missing user filtering
  return <WorkoutClient workout={workout} />
}
```

### 2. Parameter Handling Standards

**Next.js 16 requires awaiting all dynamic route parameters:**

```tsx
// ✅ CORRECT: Proper parameter handling
export default async function ExercisePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string; exerciseId: string }>
  searchParams: Promise<{ category?: string; page?: number }>
}) {
  const { id, exerciseId } = await params
  const { category, page } = await searchParams

  const workout = await getWorkoutById(id)
  const exercises = await getWorkoutExercises(workout.id, category, page)

  return <ExerciseClient workout={workout} exercises={exercises} />
}
```

### 3. Authentication Pattern

**All server components MUST follow the authentication pattern:**

```tsx
// ✅ CORRECT: Standard authentication pattern
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()

  // MANDATORY: Check authentication first
  if (!userId) {
    redirect('/sign-in')
  }

  // MANDATORY: Get user-specific data
  const workout = await getWorkoutById(id, userId)

  if (!workout) {
    redirect('/dashboard')
  }

  return <WorkoutClient workout={workout} />
}
```

### 4. Data Fetching Standards

**Server components must only use `/data` helper functions:**

```tsx
// ✅ CORRECT: Using data helpers with user filtering
import { getUserWorkouts, getWorkoutById } from '@/data/workouts'
import { getUserExercises } from '@/data/exercises'

export default async function DashboardPage({ params }: {
  params: Promise<{}> = Promise.resolve({})
}) {
  await params // Ensure params are resolved
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  // ALWAYS pass userId to data functions
  const workouts = await getUserWorkouts(userId)
  const exercises = await getUserExercises(userId)

  return <DashboardClient workouts={workouts} exercises={exercises} />
}

// ❌ WRONG: Direct database access
import { db } from '@/lib/db'
import { workouts } from '@/lib/schema'

export default async function DashboardPage() {
  const workoutData = await db.select().from(workouts) // NO USER FILTERING
  return <DashboardClient workouts={workoutData} />
}
```

### 5. Error Handling Standards

**Proper error handling in server components:**

```tsx
// ✅ CORRECT: Comprehensive error handling
export default async function WorkoutPage({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()

  try {
    if (!userId) {
      redirect('/sign-in')
    }

    const workout = await getWorkoutById(id, userId)

    if (!workout) {
      notFound() // Next.js 404 helper
    }

    return <WorkoutClient workout={workout} />

  } catch (error) {
    console.error('Failed to load workout:', error)

    // For database errors, redirect to dashboard
    if (error instanceof DatabaseError) {
      redirect('/dashboard?error=database')
    }

    // For other errors, show 500 page
    throw error
  }
}
```

## File Structure Standards

### 1. Server Component Location

**Server components should be in `app/` directory with clear naming:**

```
app/
├── dashboard/
│   ├── page.tsx              # Server Component
│   ├── loading.tsx            # Loading state (Server Component)
│   ├── error.tsx              # Error boundary (Server Component)
│   ├── components/            # Client components for this page
│   │   ├── DashboardClient.tsx
│   │   └── WorkoutCard.tsx
│   └── layout.tsx            # Layout for this section
├── workouts/
│   ├── page.tsx              # Server Component
│   ├── [id]/
│   │   ├── page.tsx          # Server Component with params
│   │   └── components/
│   └── new/
│       ├── page.tsx          # Server Component
│       └── action.ts          # Server Actions
└── layout.tsx                # Root layout (Server Component)
```

### 2. Component Naming Convention

**Clear distinction between server and client components:**

```tsx
// Server Component: Default export, async function
export default async function WorkoutPage({ params }: {
  params: Promise<{ id: string }>
}) {
  // Server-side logic
}

// Client Component: Named export, 'use client' directive
'use client'
export function WorkoutClient({ workout }: { workout: Workout }) {
  // Client-side interactions only
}
```

## Data Flow Architecture

### 1. Server Component Data Flow

**Standard data flow pattern:**

```tsx
// 1. Server Component: Authentication and Data Fetching
export default async function WorkoutsPage({ params, searchParams }: {
  params: Promise<{}> = Promise.resolve({})
  searchParams: Promise<{ page?: string; category?: string }> = Promise.resolve({})
}) {
  await params
  await searchParams

  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  // 2. Fetch data using user-filtered helpers
  const { page = '1', category } = await searchParams
  const workouts = await getUserWorkouts(userId, parseInt(page), category)
  const totalCount = await getUserWorkoutCount(userId, category)

  // 3. Pass data as props to client components
  return (
    <WorkoutsClient
      workouts={workouts}
      totalCount={totalCount}
      currentPage={parseInt(page)}
      category={category}
    />
  )
}
```

### 2. Client Component Data Rendering

**Client components only render data, never fetch:**

```tsx
'use client'
import { WorkoutCard } from './WorkoutCard'
import { Button } from '@/components/ui/button'

interface WorkoutsClientProps {
  workouts: Workout[]
  totalCount: number
  currentPage: number
  category?: string
}

export function WorkoutsClient({
  workouts,
  totalCount,
  currentPage,
  category
}: WorkoutsClientProps) {
  // ✅ CORRECT: Only render received data
  return (
    <div>
      <h1>Your Workouts ({totalCount})</h1>
      <div className="grid gap-4">
        {workouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      {/* ✅ CORRECT: Navigation uses Next.js router */}
      <Button
        onClick={() => window.location.href = `/workouts?page=${currentPage + 1}`}
        disabled={currentPage * 10 >= totalCount}
      >
        Next Page
      </Button>
    </div>
  )
}
```

## Performance Optimization Standards

### 1. Data Fetching Optimization

**Efficient data fetching patterns:**

```tsx
// ✅ CORRECT: Optimized data fetching
export default async function WorkoutAnalyticsPage({ params }: {
  params: Promise<{}> = Promise.resolve({})
}) {
  await params
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  // Parallel data fetching where possible
  const [workouts, exercises, progress] = await Promise.all([
    getUserWorkoutStats(userId),
    getExerciseUsageStats(userId),
    getMonthlyProgress(userId)
  ])

  return <AnalyticsClient stats={{ workouts, exercises, progress }} />
}

// ❌ WRONG: Sequential fetching
export default async function WorkoutAnalyticsPage() {
  const { userId } = await auth()

  // Inefficient - waiting for each request
  const workouts = await getUserWorkoutStats(userId)
  const exercises = await getExerciseUsageStats(userId)
  const progress = await getMonthlyProgress(userId)

  return <AnalyticsClient stats={{ workouts, exercises, progress }} />
}
```

### 2. Caching Strategy

**Next.js caching for server components:**

```tsx
// ✅ CORRECT: Using Next.js caching
import { unstable_cache } from 'next/cache'

const getCachedWorkouts = unstable_cache(
  async (userId: string, page: number = 1) => {
    return getUserWorkouts(userId, page)
  },
  ['workouts-list'], // Cache key
  { revalidate: 300, // 5 minutes
    tags: ['workouts'] }
)

export default async function DashboardPage({ params }: {
  params: Promise<{}> = Promise.resolve({})
}) {
  await params
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const workouts = await getCachedWorkouts(userId)
  return <DashboardClient workouts={workouts} />
}
```

## TypeScript Standards

### 1. Type Safety

**Strict TypeScript usage in server components:**

```tsx
// ✅ CORRECT: Proper typing
import type { Workout, Exercise } from '@/lib/schema'

export default async function WorkoutPage({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const workout: Workout | null = await getWorkoutById(id, userId)

  if (!workout) {
    notFound()
  }

  return <WorkoutClient workout={workout} />
}

// ❌ WRONG: Missing types
export default async function WorkoutPage({ params }) {
  const { id } = await params // TypeScript error
  const workout = await getWorkoutById(id) // Missing user filtering
  return <WorkoutClient workout={workout} />
}
```

### 2. Parameter Typing

**Proper Next.js 16 parameter typing:**

```tsx
// ✅ CORRECT: Next.js 16 parameter types
export default async function SearchPage({
  params,
  searchParams
}: {
  params: Promise<{}>
  searchParams: Promise<{
    q?: string
    category?: 'strength' | 'cardio' | 'flexibility' | 'sports'
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  }>
}) {
  const {} = await params
  const searchParamsData = await searchParams

  const { q, category, difficulty } = searchParamsData
  // ... rest of component
}
```

## Testing Standards

### 1. Server Component Testing

**Testing server components with proper mocking:**

```tsx
// __tests__/app/dashboard/page.test.tsx
import { WorkoutPage } from '@/app/dashboard/page'
import { vi } from 'vitest'
import { auth } from '@clerk/nextjs/server'

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' }),
}))

vi.mock('@/data/workouts', () => ({
  getUserWorkouts: vi.fn().mockResolvedValue([
    { id: '1', title: 'Test Workout', userId: 'test-user-id' }
  ])
}))

test('WorkoutPage should load user workouts', async () => {
  const result = await WorkoutPage({
    params: Promise.resolve({})
  })

  expect(result).toBeDefined()
  // Test that user workouts are loaded
})
```

## Security Requirements

### 1. Data Access Control

**All server components must enforce user data isolation:**

```tsx
// ✅ CORRECT: User data isolation
export default async function UserWorkoutsPage({ params }: {
  params: Promise<{ userId: string }>
}) {
  const { userId: paramUserId } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // SECURITY: Users can only access their own data
  if (userId !== paramUserId) {
    redirect('/dashboard') // Don't expose that other user exists
  }

  const workouts = await getUserWorkouts(userId)
  return <UserWorkoutsClient workouts={workouts} />
}

// ❌ WRONG: No user isolation
export default async function UserWorkoutsPage({ params }: {
  params: Promise<{ userId: string }>
}) {
  const { userId: paramUserId } = await params

  // SECURITY RISK: Accessing any user's data
  const workouts = await getWorkoutsByUserId(paramUserId)
  return <UserWorkoutsClient workouts={workouts} />
}
```

## Common Anti-Patterns to Avoid

### ❌ NEVER DO THIS

```tsx
// ❌ FORBIDDEN: Not awaiting params
export default function WorkoutPage({ params }: {
  params: { id: string } // Type error
}) {
  const workout = await getWorkoutById(params.id) // Runtime error
}

// ❌ FORBIDDEN: Client-side data fetching in server component
export default async function WorkoutPage() {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    fetch('/api/workouts') // FORBIDDEN
      .then(setWorkouts)
  }, [])

  return <WorkoutList workouts={workouts} />
}

// ❌ FORBIDDEN: Missing user authentication
export default async function AdminDashboard() {
  const workouts = await db.select().from(workouts) // NO USER FILTERING
  return <AdminWorkoutsList workouts={workouts} />
}

// ❌ FORBIDDEN: Mixing server and client logic
'use client'
export default function WorkoutPage() {
  const { userId } = await auth() // FORBIDDEN - auth() in client component
  const workout = await getWorkoutById(userId) // FORBIDDEN - server logic in client
  return <WorkoutClient workout={workout} />
}
```

## Required Dependencies

Ensure these packages are available for server component development:

```json
{
  "dependencies": {
    "@clerk/nextjs": "^latest",
    "next": "16.0.3",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "typescript": "^5"
  }
}
```

## Implementation Checklist

### Server Component Development
- [ ] Component is async function
- [ ] All dynamic params are awaited
- [ ] Authentication checked with `await auth()`
- [ ] User data filtered by userId
- [ ] Error handling implemented
- [ ] Proper TypeScript types
- [ ] Data fetched from `/data` helpers only
- [ ] Client components receive data as props
- [ ] Loading states implemented
- [ ] Security patterns followed

### Performance Optimization
- [ ] Parallel data fetching where possible
- [ ] Caching implemented for expensive operations
- [ ] Proper error boundaries
- [ ] Efficient database queries
- [ ] Minimal data fetching

### Testing
- [ ] Server component unit tests
- [ ] Authentication flow tested
- [ ] Error scenarios tested
- [ ] Performance testing
- [ ] Security testing

## Conclusion

Server components in Workout Diary must follow these strict patterns to ensure:

- **Security**: Proper authentication and user data isolation
- **Performance**: Efficient data fetching and caching
- **Type Safety**: Comprehensive TypeScript usage
- **Maintainability**: Clear separation of server/client concerns
- **User Experience**: Proper loading states and error handling

**These server component standards are mandatory and must be followed throughout the application.**