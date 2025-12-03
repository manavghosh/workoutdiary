'use server'

import { z } from 'zod'
import { updateWorkout, deleteWorkout, completeWorkout } from '@/data/workouts'
import { auth } from '@clerk/nextjs/server'

// Validation schema for workout updates
const UpdateWorkoutSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute').max(1440, 'Duration cannot exceed 24 hours').optional(),
  completedAt: z.date().optional().nullable(),
})

// Validation schema for workout completion
const CompleteWorkoutSchema = z.object({
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute').max(1440, 'Duration cannot exceed 24 hours'),
})

export async function updateWorkoutAction(
  workoutId: string,
  data: z.infer<typeof UpdateWorkoutSchema>
) {
  try {
    // Validate input data
    const validatedData = UpdateWorkoutSchema.parse(data)

    // Get authenticated user
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Authentication required')
    }

    // Update workout with user ownership verification
    const updatedWorkout = await updateWorkout(workoutId, userId, validatedData)

    if (!updatedWorkout) {
      throw new Error('Workout not found or access denied')
    }

    return {
      success: true,
      workout: updatedWorkout,
      message: 'Workout updated successfully'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return specific validation error
      throw new Error(error.issues[0].message)
    }

    // Handle other errors
    throw new Error(error instanceof Error ? error.message : 'Failed to update workout')
  }
}

export async function deleteWorkoutAction(workoutId: string) {
  try {
    // Get authenticated user
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Authentication required')
    }

    // Delete workout with user ownership verification
    const success = await deleteWorkout(workoutId, userId)

    if (!success) {
      throw new Error('Workout not found or access denied')
    }

    return {
      success: true,
      message: 'Workout deleted successfully'
    }

  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete workout')
  }
}

export async function completeWorkoutAction(
  workoutId: string,
  data: z.infer<typeof CompleteWorkoutSchema>
) {
  try {
    // Validate input data
    const validatedData = CompleteWorkoutSchema.parse(data)

    // Get authenticated user
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Authentication required')
    }

    // Complete workout with user ownership verification
    const completedWorkout = await completeWorkout(workoutId, userId, validatedData.durationMinutes)

    if (!completedWorkout) {
      throw new Error('Workout not found or access denied')
    }

    return {
      success: true,
      workout: completedWorkout,
      message: 'Workout completed successfully'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return specific validation error
      throw new Error(error.issues[0].message)
    }

    // Handle other errors
    throw new Error(error instanceof Error ? error.message : 'Failed to complete workout')
  }
}