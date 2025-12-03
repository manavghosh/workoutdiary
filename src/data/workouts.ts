import { db } from '@/lib/db'
import { workouts, Workout, workoutExercises, exercises, exerciseSets } from '@/db/schema'
import { eq, and, gte, lte, sql } from 'drizzle-orm'

// Simple workout creation (for action.ts)
export async function createWorkout(data: {
  userId: string;
  title: string;
  notes?: string;
  durationMinutes?: number;
  startedAt: Date;
}): Promise<Workout> {
  const [workout] = await db
    .insert(workouts)
    .values({
      userId: data.userId,        // Use JavaScript field names from schema
      title: data.title,
      notes: data.notes,
      durationMinutes: data.durationMinutes,
      startedAt: data.startedAt,
    })
    .returning();

  return workout;
}

// Get workouts filtered by date range (for dashboard) - simplified for workout-only view
export async function getUserWorkoutsByDate(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Workout[]> {
  // Build conditions array for user ID filter and date conditions
  const conditions = [eq(workouts.userId, userId)];

  // If only startDate is provided (no endDate), set date range for that specific day
  if (startDate && !endDate) {
    const startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999);
    conditions.push(
      gte(workouts.startedAt, startOfDay),
      lte(workouts.startedAt, endOfDay)
    );
  } else {
    // Add date range conditions if provided separately
    if (startDate) {
      conditions.push(gte(workouts.startedAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(workouts.startedAt, endDate));
    }
  }

  // Return only essential workout information (no exercise/sets joins for performance)
  const workoutResults = await db
    .select({
      id: workouts.id,
      userId: workouts.userId,
      title: workouts.title,
      notes: workouts.notes,
      durationMinutes: workouts.durationMinutes,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseCount: sql<number>`(
        SELECT count(*)
        FROM workout_exercises
        WHERE workout_exercises.workout_id = workouts.id
      )`.mapWith(Number).as('exerciseCount'),
    })
    .from(workouts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(workouts.startedAt);

  // Convert UTC timestamps to local timezone for display
  return workoutResults.map(workout => ({
    ...workout,
    startedAt: new Date(workout.startedAt), // Convert to local Date
    completedAt: workout.completedAt ? new Date(workout.completedAt) : null,
  }));
}

// Get a single workout by ID with user filtering
export async function getWorkoutById(workoutId: string, userId: string): Promise<Workout | null> {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId)
    ));

  if (!workout) {
    return null;
  }

  // Convert timestamps to local timezone
  return {
    ...workout,
    startedAt: new Date(workout.startedAt),
    completedAt: workout.completedAt ? new Date(workout.completedAt) : null,
  };
}

// Get workout with exercises and sets for detailed view
export async function getWorkoutWithExercises(workoutId: string, userId: string) {
  const workout = await getWorkoutById(workoutId, userId);

  if (!workout) {
    return null;
  }

  // For now, return just the workout without exercises/sets to avoid SQL complexity
  // This can be expanded later when the exercise/sets functionality is needed
  return {
    workout,
    exercises: [], // Placeholder - can be expanded later
  };
}

// Update workout function
export async function updateWorkout(
  workoutId: string,
  userId: string,
  data: {
    title?: string;
    notes?: string;
    durationMinutes?: number;
    completedAt?: Date | null;
  }
): Promise<Workout | null> {
  // First verify user ownership
  const existingWorkout = await getWorkoutById(workoutId, userId);

  if (!existingWorkout) {
    return null;
  }

  // Update the workout
  const [updatedWorkout] = await db
    .update(workouts)
    .set(data)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId)
    ))
    .returning();

  if (!updatedWorkout) {
    return null;
  }

  // Convert timestamps to local timezone
  return {
    ...updatedWorkout,
    startedAt: new Date(updatedWorkout.startedAt),
    completedAt: updatedWorkout.completedAt ? new Date(updatedWorkout.completedAt) : null,
  };
}

// Delete workout function (cascade will handle exercises and sets)
export async function deleteWorkout(workoutId: string, userId: string): Promise<boolean> {
  // First verify user ownership
  const existingWorkout = await getWorkoutById(workoutId, userId);

  if (!existingWorkout) {
    return false;
  }

  // Delete the workout (cascade will delete related exercises and sets)
  const result = await db
    .delete(workouts)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId)
    ));

  return result.rowCount > 0;
}

// Mark workout as completed
export async function completeWorkout(workoutId: string, userId: string, durationMinutes?: number): Promise<Workout | null> {
  return updateWorkout(workoutId, userId, {
    completedAt: new Date(),
    durationMinutes: durationMinutes,
  });
}