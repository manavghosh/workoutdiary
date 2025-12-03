"use server"

import { z } from 'zod'
import { createWorkout } from '@/data/workouts'
import { auth } from '@clerk/nextjs/server'
import { format } from 'date-fns'

// Simple validation schema
const CreateWorkoutSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  notes: z.string().optional(),
  startTime: z.string().optional(),
  workoutDate: z.string().min(1, 'Date is required'),
})

export async function createWorkoutAction(data: z.infer<typeof CreateWorkoutSchema>) {
  console.log('Action called with data:', data)

  try {
    // Validate input data
    const validatedData = CreateWorkoutSchema.parse(data)
    console.log('Validation passed:', validatedData)

    // Get authenticated user
    const { userId } = await auth()
    console.log('User ID:', userId)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Parse workout date and create proper datetime with timezone preservation
    // The workoutDate should be in YYYY-MM-DD format from the date picker
    let startedAt: Date

    if (validatedData.startTime) {
      // Combine date and time properly to preserve local timezone
      const [hours, minutes] = validatedData.startTime.split(':')
      const [year, month, day] = validatedData.workoutDate.split('-').map(Number)

      // Create date using local timezone (not UTC)
      // This ensures the date/time is interpreted in the user's local timezone
      startedAt = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes), 0, 0)

      console.log('Local timezone components:', { year, month, day, hours, minutes })
      console.log('Created local datetime:', startedAt)
      console.log('Local datetime ISO:', startedAt.toISOString())
    } else {
      // If no time provided, use the date at noon in local timezone
      const [year, month, day] = validatedData.workoutDate.split('-').map(Number)
      startedAt = new Date(year, month - 1, day, 12, 0, 0, 0)

      console.log('Local date with default time:', startedAt)
      console.log('Local datetime ISO:', startedAt.toISOString())
    }

    console.log('Final datetime for DB (preserves local timezone):', startedAt.toISOString())

    // Call data helper function
    const workout = await createWorkout({
      userId,
      title: validatedData.title,
      notes: validatedData.notes,
      startedAt,
    })

    console.log('Workout created:', workout)
    console.log('Workout startedAt date:', workout.startedAt)

    // Format date for redirect
    const redirectDate = format(workout.startedAt, 'yyyy-MM-dd')
    console.log('Formatted redirect date:', redirectDate)

    // Return success response with date for redirect
    return {
      success: true,
      workout,
      redirectDate
    }

  } catch (error) {
    console.error('Error in createWorkoutAction:', error)

    if (error instanceof z.ZodError) {
      console.error('Zod errors:', error.issues)
      throw new Error(error.issues[0]?.message || 'Validation error')
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error message:', errorMessage)
    throw new Error(`Failed to create workout: ${errorMessage}`)
  }
}