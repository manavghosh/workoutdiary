"use server"

import { z } from 'zod'
import { createWorkout } from '@/data/workouts'
import { auth } from '@clerk/nextjs/server'
import { format } from 'date-fns'

// Simple validation schema
const CreateWorkoutSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  notes: z.string().optional(),
  // UTC ISO string computed in the browser (preserves user's local timezone)
  startedAtISO: z.string().min(1, 'Start datetime is required'),
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

    // Parse the UTC ISO string directly — the client already converted local time to UTC
    const startedAt = new Date(validatedData.startedAtISO)

    // Call data helper function
    const workout = await createWorkout({
      userId,
      title: validatedData.title,
      notes: validatedData.notes,
      startedAt,
    })

    if (!workout) {
      throw new Error('Failed to create workout - no workout returned')
    }

    // Format date for redirect using UTC date components to match what the client sent
    const redirectDate = format(startedAt, 'yyyy-MM-dd')

    // Return success response with date for redirect
    return {
      success: true,
      workout,
      redirectDate
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0]?.message || 'Validation error')
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to create workout: ${errorMessage}`)
  }
}
