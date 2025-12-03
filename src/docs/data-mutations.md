# Data Mutations Guidelines

## Core Principle

**ALL data mutations (CREATE, UPDATE, DELETE) in this application MUST be done via Server Actions that use helper functions in the `/data` directory.** This is a critical architectural requirement that ensures security, data integrity, and consistent validation patterns.

## Strict Requirements

### 1. Server Actions Only
- ✅ **Allowed**: Server Actions in colocated `action.ts` files
- ✅ **Allowed**: Direct database mutations via helper functions in `/data`
- ❌ **Forbidden**: Client-side mutations (useEffect, fetch POST/PUT/DELETE)
- ❌ **Forbidden**: API route handlers for data mutations
- ❌ **Forbidden**: Direct database access from client components

### 2. Helper Functions in `/data` Directory
- ✅ **Allowed**: Helper functions using Drizzle ORM
- ✅ **Allowed**: Typed parameters and return values
- ❌ **Forbidden**: Raw SQL queries in mutations
- ❌ **Forbidden**: Direct database connections outside helper functions

### 3. Server Action Location and Structure
- **CRITICAL**: Server Actions must be in colocated `action.ts` files
- **ALWAYS**: Use `'use server'` directive at the top of action files
- **ALWAYS**: Export named functions for each mutation operation
- **REQUIRE**: Proper TypeScript types for all parameters and return values
- **FORBIDDEN**: Using `redirect()` function within server actions - redirects should be handled client-side after the server action resolves

## Implementation Architecture

### Directory Structure
```
app/
├── workouts/
│   ├── page.tsx           # Server Component
│   ├── action.ts          # Workout mutations (CREATE/UPDATE/DELETE)
│   └── components/         # Client components
├── exercises/
│   ├── page.tsx
│   ├── action.ts          # Exercise mutations
│   └── components/
└── ...

data/
├── workouts.ts            # Workout data helpers (SELECT + mutations)
├── exercises.ts          # Exercise data helpers
├── progress.ts           # Progress tracking helpers
└── users.ts              # User profile helpers
```

## Server Action Pattern

### Basic Server Action Structure
```tsx
// app/workouts/action.ts
'use server'

import { z } from 'zod'
import { createWorkout } from '@/data/workouts'
import { auth } from '@clerk/nextjs/server'

// Validation schema with Zod
const CreateWorkoutSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  date: z.string().datetime('Invalid date format'),
  notes: z.string().optional(),
})

export async function createWorkoutAction(data: z.infer<typeof CreateWorkoutSchema>) {
  try {
    // Validate input data
    const validatedData = CreateWorkoutSchema.parse(data)

    // Get authenticated user
    const { userId } = await auth()
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Call data helper function
    const workout = await createWorkout({
      userId,
      title: validatedData.title,
      date: new Date(validatedData.date),
      notes: validatedData.notes,
    })

    // Return success response - client handles redirect
    return { success: true, workout }

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      throw new Error(error.errors[0].message)
    }

    // Handle other errors
    throw new Error('Failed to create workout')
  }
}
```

### Update Server Action
```tsx
// app/workouts/action.ts
export async function updateWorkoutAction(
  id: string,
  data: z.infer<typeof UpdateWorkoutSchema>
) {
  try {
    const validatedData = UpdateWorkoutSchema.parse(data)
    const { userId } = await auth()

    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Verify user ownership
    const existingWorkout = await getWorkoutById(id)
    if (!existingWorkout || existingWorkout.userId !== userId) {
      throw new Error('Workout not found or access denied')
    }

    const updatedWorkout = await updateWorkout(id, {
      title: validatedData.title,
      date: new Date(validatedData.date),
      notes: validatedData.notes,
    })

    return { success: true, workout: updatedWorkout }

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw new Error('Failed to update workout')
  }
}
```

### Delete Server Action
```tsx
// app/workouts/action.ts
export async function deleteWorkoutAction(id: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Verify user ownership before deletion
    const existingWorkout = await getWorkoutById(id)
    if (!existingWorkout || existingWorkout.userId !== userId) {
      throw new Error('Workout not found or access denied')
    }

    await deleteWorkout(id)

    return { success: true }

  } catch (error) {
    throw new Error('Failed to delete workout')
  }
}
```

## Data Helper Function Pattern

### Mutation Helper Functions
```tsx
// data/workouts.ts
import { db } from '@/lib/db'
import { workouts, eq, and } from 'drizzle-orm'
import type { NewWorkout, Workout } from '@/lib/schema'

export async function createWorkout(data: {
  userId: string
  title: string
  date: Date
  notes?: string
}): Promise<Workout> {
  const [workout] = await db
    .insert(workouts)
    .values({
      userId: data.userId,
      title: data.title,
      date: data.date,
      notes: data.notes,
    })
    .returning()

  return workout
}

export async function updateWorkout(
  id: string,
  data: Partial<Pick<NewWorkout, 'title' | 'date' | 'notes'>>
): Promise<Workout> {
  const [workout] = await db
    .update(workouts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workouts.id, id))
    .returning()

  return workout
}

export async function deleteWorkout(id: string): Promise<void> {
  await db
    .delete(workouts)
    .where(eq(workouts.id, id))
}
```

## Zod Validation Requirements

### Mandatory Zod Schemas
**ALL** server action parameters must be validated with Zod schemas:

```tsx
import { z } from 'zod'

// Example validation schemas
const CreateExerciseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.enum(['strength', 'cardio', 'flexibility', 'sports']),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
})

const CreateSetSchema = z.object({
  workoutExerciseId: z.string().uuid('Invalid workout exercise ID'),
  reps: z.number().min(1, 'At least 1 rep required').max(1000),
  weight: z.number().min(0, 'Weight cannot be negative').optional(),
  duration: z.number().min(1, 'Duration must be positive').optional(),
  distance: z.number().min(0, 'Distance cannot be negative').optional(),
})

const UpdateProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50),
  bio: z.string().max(500).optional(),
  preferences: z.object({
    units: z.enum(['metric', 'imperial']),
    defaultRestTime: z.number().min(0).max(600),
  }).optional(),
})
```

### Validation Error Handling
```tsx
export async function serverAction(data: unknown) {
  try {
    const validatedData = Schema.parse(data)
    // proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return specific validation error
      return {
        success: false,
        error: error.errors[0].message
      }
    }
    // Handle other errors
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}
```

## Client Component Integration

### Using Server Actions in Forms
```tsx
// components/WorkoutForm.tsx
'use client'

import { createWorkoutAction } from '../workouts/action'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateWorkoutSchema } from '../workouts/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type FormData = z.infer<typeof CreateWorkoutSchema>

export function WorkoutForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(CreateWorkoutSchema),
  })

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const result = await createWorkoutAction(data)

        if (result.success) {
          toast.success('Workout created successfully!')
          form.reset()

          // Client-side redirect after server action resolves
          router.push(`/workouts/${result.workout.id}`)
          router.refresh()
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to create workout')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('title')} placeholder="Workout title" />
      <Input {...form.register('date')} type="datetime-local" />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Workout'}
      </Button>
    </form>
  )
}
```

### Using Server Actions with Buttons
```tsx
// components/WorkoutCard.tsx
'use client'

import { deleteWorkoutAction } from '../workouts/action'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface WorkoutCardProps {
  workout: Workout
  onDelete?: () => void
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    setIsDeleting(true)
    deleteWorkoutAction(workout.id)
      .then((result) => {
        if (result.success) {
          toast.success('Workout deleted')
          onDelete?.()

          // Client-side redirect after successful deletion
          router.push('/workouts')
          router.refresh()
        }
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date: {workout.date.toLocaleDateString()}</p>
        {workout.notes && <p>Notes: {workout.notes}</p>}
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Data Mutation Patterns

### Complex Mutations (Transactions)
```tsx
// data/workouts.ts
import { db } from '@/lib/db'
import { workouts, workoutExercises, exerciseSets } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function createWorkoutWithExercises(data: {
  userId: string
  title: string
  date: Date
  exercises: Array<{
    exerciseId: string
    order: number
    sets: Array<{
      reps: number
      weight?: number
      duration?: number
    }>
  }>
}): Promise<{ workout: Workout; exercises: WorkoutExercise[] }> {
  return await db.transaction(async (tx) => {
    // Create workout
    const [workout] = await tx
      .insert(workouts)
      .values({
        userId: data.userId,
        title: data.title,
        date: data.date,
      })
      .returning()

    // Create workout exercises
    const workoutExercisePromises = data.exercises.map(async (exercise) => {
      const [workoutExercise] = await tx
        .insert(workoutExercises)
        .values({
          workoutId: workout.id,
          exerciseId: exercise.exerciseId,
          order: exercise.order,
        })
        .returning()

      // Create exercise sets
      if (exercise.sets.length > 0) {
        await tx.insert(exerciseSets).values(
          exercise.sets.map(set => ({
            workoutExerciseId: workoutExercise.id,
            reps: set.reps,
            weight: set.weight,
            duration: set.duration,
          }))
        )
      }

      return workoutExercise
    })

    const exercises = await Promise.all(workoutExercisePromises)

    return { workout, exercises }
  })
}
```

### Batch Operations
```tsx
// data/exercises.ts
export async function updateExerciseCategories(
  updates: Array<{ id: string; category: string }>
): Promise<Exercise[]> {
  return await db.transaction(async (tx) => {
    const results = await Promise.all(
      updates.map(update =>
        tx
          .update(exercises)
          .set({ category: update.category, updatedAt: new Date() })
          .where(eq(exercises.id, update.id))
          .returning()
      )
    )

    return results.flat()
  })
}
```

## Security Requirements

### User Ownership Verification
**ALL mutations must verify user ownership:**

```tsx
// In every server action that modifies existing data
export async function updateDataAction(id: string, data: UpdateData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  // ALWAYS verify ownership before mutation
  const existingData = await getDataById(id)
  if (!existingData || existingData.userId !== userId) {
    throw new Error('Data not found or access denied')
  }

  // Proceed with mutation
  return await updateData(id, data)
}
```

### Input Sanitization
```tsx
// Use Zod for validation and sanitization
const CreateExerciseSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .trim() // Remove whitespace
    .transform(name => name.charAt(0).toUpperCase() + name.slice(1)), // Capitalize first letter

  description: z.string()
    .max(500, 'Description too long')
    .optional()
    .transform(desc => desc?.trim()), // Remove whitespace if provided
})
```

## Error Handling Patterns

### Standard Error Response
```tsx
// Standard error handling for all server actions
try {
  const validatedData = Schema.parse(data)
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Authentication required')
  }

  const result = await mutationHelper({ ...validatedData, userId })
  return { success: true, data: result }

} catch (error) {
  if (error instanceof z.ZodError) {
    return { success: false, error: error.errors[0].message }
  }

  if (error instanceof Error) {
    return { success: false, error: error.message }
  }

  return { success: false, error: 'An unexpected error occurred' }
}
```

### Logging and Monitoring
```tsx
// Add logging for debugging (in development)
export async function mutationAction(data: MutationData) {
  try {
    console.log('Mutation started:', { operation: 'create', data: sanitizedData })

    const result = await createData(data)

    console.log('Mutation completed:', { id: result.id })
    return { success: true, data: result }

  } catch (error) {
    console.error('Mutation failed:', { error: error.message, data: sanitizedData })
    throw error
  }
}
```

## Performance Considerations

### Optimistic Updates (When Appropriate)
```tsx
// For better UX, combine server actions with optimistic updates
export function WorkoutCard({ workout }: { workout: Workout }) {
  const [optimisticWorkout, setOptimisticWorkout] = useOptimistic(workout)

  const handleTitleUpdate = async (newTitle: string) => {
    // Update UI immediately
    setOptimisticWorkout({ ...optimisticWorkout, title: newTitle })

    try {
      await updateWorkoutAction(workout.id, { title: newTitle })
    } catch (error) {
      // Revert on error
      setOptimisticWorkout(optimisticWorkout)
      toast.error('Failed to update workout')
    }
  }

  return (
    <Card>
      <CardContent>
        <h3>{optimisticWorkout.title}</h3>
      </CardContent>
    </Card>
  )
}
```

### Batch vs Individual Mutations
```tsx
// Prefer batch operations for multiple related changes
export async function updateMultipleWorkoutsAction(
  updates: Array<{ id: string; title: string }>
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  // Verify ownership for all workouts
  const workoutIds = updates.map(u => u.id)
  const existingWorkouts = await getWorkoutsByIds(workoutIds)

  const unauthorizedWorkouts = existingWorkouts.filter(w => w.userId !== userId)
  if (unauthorizedWorkouts.length > 0) {
    throw new Error('Some workouts not found or access denied')
  }

  return await updateMultipleWorkoutTitles(updates)
}
```

## Testing Data Mutations

### Unit Testing Helper Functions
```tsx
// __tests__/data/workouts.test.ts
import { createWorkout, updateWorkout } from '@/data/workouts'
import { db } from '@/lib/db'
import { beforeEach } from 'vitest'

beforeEach(async () => {
  await db.delete(workouts)
})

test('createWorkout should create a workout with user data', async () => {
  const userId = 'test-user-id'
  const workoutData = {
    userId,
    title: 'Morning Workout',
    date: new Date(),
  }

  const workout = await createWorkout(workoutData)

  expect(workout).toMatchObject({
    userId,
    title: 'Morning Workout',
    date: workoutData.date,
  })
})
```

### Integration Testing Server Actions
```tsx
// __tests__/actions/workout-actions.test.ts
import { createWorkoutAction } from '@/app/workouts/action'
import { vi } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' }),
}))

test('createWorkoutAction should create workout and redirect', async () => {
  const data = {
    title: 'Test Workout',
    date: '2024-01-01T10:00:00Z',
  }

  await expect(createWorkoutAction(data)).rejects.toThrow('NEXT_REDIRECT')
})
```

## Required Dependencies

Ensure these packages are installed for data mutations:
```json
{
  "dependencies": {
    "@clerk/nextjs": "^latest",
    "drizzle-orm": "^latest",
    "@neondatabase/serverless": "^latest",
    "zod": "^latest",
    "react-hook-form": "^latest",
    "@hookform/resolvers": "^latest",
    "sonner": "^latest"
  }
}
```

## Common Anti-Patterns to Avoid

### ❌ NEVER DO THIS
```tsx
// Server action with redirect (FORBIDDEN)
// app/workouts/action.ts
'use server'

import { redirect } from 'next/navigation'
import { createWorkout } from '@/data/workouts'

export async function createWorkoutAction(data: WorkoutData) {
  const { userId } = await auth()
  const workout = await createWorkout({ ...data, userId })

  // FORBIDDEN: redirect() in server action
  redirect(`/workouts/${workout.id}`)
}
```

### ❌ NEVER DO THIS
```tsx
// Client-side mutation (FORBIDDEN)
'use client'
function CreateWorkoutForm() {
  const [workout, setWorkout] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    // FORBIDDEN: Direct fetch to API
    const response = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout)
    })
  }
}
```

### ❌ NEVER DO THIS
```tsx
// API route handler (FORBIDDEN)
// app/api/workouts/route.ts
export async function POST(request: Request) {
  const data = await request.json()

  // FORBIDDEN: No user validation
  const workout = await db.insert(workouts).values(data)
  return Response.json(workout)
}
```

### ❌ NEVER DO THIS
```tsx
// Missing Zod validation (FORBIDDEN)
export async function createWorkoutAction(data: unknown) {
  // FORBIDDEN: No validation
  const { userId } = await auth()
  return await createWorkout({ ...data, userId })
}
```

### ❌ NEVER DO THIS
```tsx
// Missing ownership verification (FORBIDDEN)
export async function updateWorkoutAction(id: string, data: UpdateData) {
  const { userId } = await auth()

  // FORBIDDEN: No ownership check
  return await updateWorkout(id, data)
}
```

## Summary

This strict data mutation architecture ensures:

- **Security**: All mutations require authentication and ownership verification
- **Data Integrity**: Zod validation prevents invalid data
- **Type Safety**: TypeScript throughout the mutation chain
- **Maintainability**: Consistent patterns and error handling
- **Performance**: Server-side mutations with proper database transactions
- **User Experience**: Optimistic updates and proper error feedback

**These rules are mandatory and must be followed for all data mutation operations in this application.**