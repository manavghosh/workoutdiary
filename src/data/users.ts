import { db } from '@/lib/db'
import { workouts, workoutExercises } from '@/db/schema'
import { eq, sum, count, gte, lte, and, sql } from 'drizzle-orm'

// Prepared statement for user workout statistics (all time)
const getUserWorkoutStatsAllTimeStmt = db
  .select({
    totalWorkouts: count(workouts.id),
    totalDuration: sum(sql`COALESCE(${workouts.durationMinutes}, 0)`).mapWith(Number),
    averageDuration: sql`AVG(COALESCE(${workouts.durationMinutes}, 0))`.mapWith(Number)
  })
  .from(workouts)
  .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
  .where(eq(workouts.userId, sql.placeholder('userId')))
  .prepare('getUserWorkoutStatsAllTime')

// Prepared statement for user workout statistics (date filtered) - workouts only
const getUserWorkoutStatsByDateRangeStmt = db
  .select({
    totalWorkouts: count(workouts.id),
    totalDuration: sum(sql`COALESCE(${workouts.durationMinutes}, 0)`).mapWith(Number),
    averageDuration: sql`AVG(COALESCE(${workouts.durationMinutes}, 0))`.mapWith(Number)
  })
  .from(workouts)
  .where(
    and(
      eq(workouts.userId, sql.placeholder('userId')),
      gte(workouts.startedAt, sql.placeholder('startDate')),
      lte(workouts.startedAt, sql.placeholder('endDate'))
    )
  )
  .prepare('getUserWorkoutStatsByDateRange')

export async function getUserWorkoutStats(userId: string, startDate?: Date, endDate?: Date) {
  try {
    if (startDate && endDate) {
      const stats = await getUserWorkoutStatsByDateRangeStmt.execute({
        userId,
        startDate,
        endDate
      });
      return stats[0] || {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0
      };
    } else {
      const stats = await getUserWorkoutStatsAllTimeStmt.execute({ userId });
      return stats[0] || {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0
      };
    }
  } catch (error) {
    console.error('Error fetching user workout stats:', error);
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0
    };
  }
}