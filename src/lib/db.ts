import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '@/db/schema'


const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

export const db = drizzle(neon(databaseUrl), { schema })

// Re-export types from schema for convenience
export type {
  Workout,
  NewWorkout,
  WorkoutExercise,
  NewWorkoutExercise,
  Exercise,
  NewExercise,
  ExerciseSet,
  NewExerciseSet
} from '@/db/schema'

// Export schema tables
export {
  workouts,
  workoutExercises,
  exercises,
  exerciseSets,
  exerciseCategoryEnum
} from '@/db/schema'