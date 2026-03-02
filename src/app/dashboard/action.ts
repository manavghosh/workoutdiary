'use server'

import { deleteWorkout } from '@/data/workouts'
import { auth } from '@clerk/nextjs/server'

export async function deleteWorkoutAction(workoutId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Authentication required')
    }

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
