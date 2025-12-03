import { db } from '@/lib/db'
import { exercises } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import type { Exercise } from '@/lib/db'

type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'sports'

// Prepared statement for getting exercise by ID
const getExerciseByIdStmt = db
  .select()
  .from(exercises)
  .where(eq(exercises.id, sql.placeholder('exerciseId')))
  .limit(1)
  .prepare('getExerciseById')

export async function getExerciseById(exerciseId: string) {
  const exercise = await getExerciseByIdStmt.execute({ exerciseId })

  return exercise.length > 0 ? exercise[0] : null
}

// Cached result for all exercises since this is a master library that rarely changes
let allExercisesCache: Exercise[] | null = null
let cacheTimestamp: number | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getAllExercises() {
  // Note: This function returns all exercises from the master exercise library
  // User-specific filtering happens at the workout level

  // Return cached result if still valid
  const now = Date.now()
  if (allExercisesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
    return allExercisesCache
  }

  // Fresh fetch
  const allExercises = await db.select().from(exercises)

  // Update cache
  allExercisesCache = allExercises
  cacheTimestamp = now

  return allExercises
}

// Prepared statement for getting exercises by category
const getExercisesByCategoryStmt = db
  .select()
  .from(exercises)
  .where(eq(exercises.category, sql.placeholder('category')))
  .prepare('getExercisesByCategory')

export async function getExercisesByCategory(category: ExerciseCategory) {
  const categoryExercises = await getExercisesByCategoryStmt.execute({ category })

  return categoryExercises
}