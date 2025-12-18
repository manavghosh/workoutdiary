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
}): Promise<Workout | null> {
  try {
    const [workout] = await db
      .insert(workouts)
      .values({
        userId: data.userId,
        title: data.title,
        notes: data.notes,
        durationMinutes: data.durationMinutes,
        startedAt: data.startedAt,
      })
      .returning();
    return workout;
  } catch (error) {
    console.error('Error creating workout:', error);
    return null;
  }
}

// Get workouts filtered by date range (for dashboard) - simplified for workout-only view
export async function getUserWorkoutsByDate(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Workout[]> {
  try {
    const conditions = [eq(workouts.userId, userId)];

    if (startDate && !endDate) {
      const startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
      const endOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999);
      conditions.push(
        gte(workouts.startedAt, startOfDay),
        lte(workouts.startedAt, endOfDay)
      );
    } else {
      if (startDate) {
        conditions.push(gte(workouts.startedAt, startDate));
      }
      if (endDate) {
        conditions.push(lte(workouts.startedAt, endDate));
      }
    }

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

    return workoutResults.map(workout => ({
      ...workout,
      startedAt: new Date(workout.startedAt),
      completedAt: workout.completedAt ? new Date(workout.completedAt) : null,
    }));
  } catch (error) {
    console.error('Error fetching user workouts by date:', error);
    return [];
  }
}

// Get a single workout by ID with user filtering
export async function getWorkoutById(workoutId: string, userId: string): Promise<Workout | null> {
  try {
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

    return {
      ...workout,
      startedAt: new Date(workout.startedAt),
      completedAt: workout.completedAt ? new Date(workout.completedAt) : null,
    };
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    return null;
  }
}

// Get workout with exercises and sets for detailed view
export async function getWorkoutWithExercises(workoutId: string, userId: string) {
  try {
    const workout = await getWorkoutById(workoutId, userId);

    if (!workout) {
      return null;
    }

    // This can be expanded later
    return {
      workout,
      exercises: [], // Placeholder
    };
  } catch (error) {
    console.error('Error fetching workout with exercises:', error);
    return null;
  }
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
  try {
    const existingWorkout = await getWorkoutById(workoutId, userId);

    if (!existingWorkout) {
      return null;
    }

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

    return {
      ...updatedWorkout,
      startedAt: new Date(updatedWorkout.startedAt),
      completedAt: updatedWorkout.completedAt ? new Date(updatedWorkout.completedAt) : null,
    };
  } catch (error) {
    console.error('Error updating workout:', error);
    return null;
  }
}

// Delete workout function (cascade will handle exercises and sets)
export async function deleteWorkout(workoutId: string, userId: string): Promise<boolean> {
  try {
    const existingWorkout = await getWorkoutById(workoutId, userId);

    if (!existingWorkout) {
      return false;
    }

    const result = await db
      .delete(workouts)
      .where(and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      ));

    return result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
}

// Mark workout as completed
export async function completeWorkout(workoutId: string, userId: string, durationMinutes?: number): Promise<Workout | null> {
  return updateWorkout(workoutId, userId, {
    completedAt: new Date(),
    durationMinutes: durationMinutes,
  });
}