import { db } from '@/lib/db'
import { exercises, type Exercise } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'sports'

// Prepared statement for getting exercise by ID
const getExerciseByIdStmt = db
  .select()
  .from(exercises)
  .where(eq(exercises.id, sql.placeholder('exerciseId')))
  .limit(1)
  .prepare('getExerciseById')

export async function getExerciseById(exerciseId: string) {
  try {
    const exercise = await getExerciseByIdStmt.execute({ exerciseId });
    return exercise.length > 0 ? exercise[0] : null;
  } catch (error) {
    console.error('Error fetching exercise by ID:', error);
    return null;
  }
}

// Cached result for all exercises since this is a master library that rarely changes
let allExercisesCache: Exercise[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAllExercises() {
  const now = Date.now();
  if (allExercisesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
    return allExercisesCache;
  }

  try {
    const allExercises = await db.select().from(exercises);
    allExercisesCache = allExercises;
    cacheTimestamp = now;
    return allExercises;
  } catch (error) {
    console.error('Error fetching all exercises:', error);
    return [];
  }
}

// Prepared statement for getting exercises by category
const getExercisesByCategoryStmt = db
  .select()
  .from(exercises)
  .where(eq(exercises.category, sql.placeholder('category')))
  .prepare('getExercisesByCategory')

export async function getExercisesByCategory(category: ExerciseCategory) {
  try {
    const categoryExercises = await getExercisesByCategoryStmt.execute({ category });
    return categoryExercises;
  } catch (error) {
    console.error('Error fetching exercises by category:', error);
    return [];
  }
}