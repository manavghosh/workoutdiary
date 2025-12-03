import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getWorkoutWithExercises, getWorkoutById } from '@/data/workouts'
import WorkoutClient from './WorkoutClient'

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()

  // MANDATORY: Check authentication first
  if (!userId) {
    redirect('/sign-in')
  }

  try {
    // Get workout with exercises and sets for detailed view
    const workoutData = await getWorkoutWithExercises(id, userId)

    if (!workoutData) {
      notFound()
    }

    return <WorkoutClient workoutData={workoutData} />

  } catch (error) {
    console.error('Failed to load workout:', error)

    // For database errors, redirect to dashboard
    if (error instanceof Error) {
      redirect('/dashboard?error=database')
    }

    // For other errors, show 500 page
    throw error
  }
}