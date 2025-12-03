"use client";

import { useState } from "react";
import { format } from 'date-fns'
import { formatTimestampForDisplay } from '@/lib/utils';
import { ChevronRight, Plus, Dumbbell, Calendar as CalendarIcon, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { formatDateWithOrdinal } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";
import { useRouter } from "next/navigation";
import type { WorkoutExercise, Exercise, ExerciseSet } from "@/db/schema";

// Type for workout with related data
interface WorkoutWithDetails extends Workout {
  workoutExercises?: (WorkoutExercise & {
    exercise?: Exercise;
    sets?: ExerciseSet[];
  })[];
}

interface UserStats {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
}

interface Workout {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  durationMinutes: number | null;
  startedAt: Date;
  completedAt: Date | null;
}


interface DashboardClientProps {
  workouts: WorkoutWithDetails[];
  userStats: UserStats;
  selectedDate: Date | null;
}

export default function DashboardClient({
  workouts,
  userStats,
  selectedDate
}: DashboardClientProps) {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Use selectedDate prop directly, fallback to today if null
  const displayDate = selectedDate || new Date();

  // Handle date selection - using ordinal format for consistency
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      // Navigate to new URL with proper Next.js router to trigger server-side data fetching
      router.push(`/dashboard?date=${formattedDate}`);
      // Close dialog immediately after date selection
      setShowDatePicker(false);
    }
  };

  // Handle "Today" button click
  const handleTodayClick = () => {
    // Navigate to dashboard base URL to get fresh server data for today
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Date Picker */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">
                Workout Dashboard
              </CardTitle>
              <Button onClick={() => {
                const formattedDate = format(displayDate, "yyyy-MM-dd");
                router.push(`/workout/new?date=${formattedDate}`);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Log Workout
              </Button>
            </div>
          </CardHeader>

          {/* Date Picker Section */}
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date:
                </span>
              </div>

              <div suppressHydrationWarning>
              <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="min-w-[200px] justify-between" suppressHydrationWarning>
                    <span className="font-medium">
                      {formatDateWithOrdinal(displayDate)}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm p-0">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-center">Select Date</DialogTitle>
                  </DialogHeader>
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTodayClick}
                      >
                        Today
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        {format(displayDate, "MMMM yyyy")}
                      </div>
                    </div>
                    <Calendar
                      selected={displayDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        // Disable dates in the future
                        return date > new Date();
                      }}
                      defaultMonth={displayDate}
                      className="mx-auto"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workouts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={<Dumbbell className="w-5 h-5" />}
            label="Total Workouts"
            value={userStats.totalWorkouts}
            iconBgColor="bg-blue-100 dark:bg-blue-900"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Duration"
            value={`${userStats.totalDuration || 0} min`}
            iconBgColor="bg-purple-100 dark:bg-purple-900"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Average Duration"
            value={`${Math.round(userStats.averageDuration || 0)} min`}
            iconBgColor="bg-orange-100 dark:bg-orange-900"
            iconColor="text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Workouts for {formatDateWithOrdinal(displayDate)}
          </h2>

          {workouts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Dumbbell className="w-12 h-12 text-gray-400" />
                <CardTitle className="text-lg">
                  No workouts logged
                </CardTitle>
                <CardDescription className="mb-6">
                  No workouts found for this date. Start by logging your first workout!
                </CardDescription>
                <Button onClick={() => router.push('/workout/new')}>
                  Log Your First Workout
                </Button>
              </div>
            </Card>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {workout.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Started: {formatTimestampForDisplay(workout.startedAt, "h:mm a")}</span>
                      {workout.completedAt && (
                        <span>
                          Completed: {formatTimestampForDisplay(workout.completedAt, "h:mm a")}
                        </span>
                      )}
                      <span>{workout.durationMinutes || 0} minutes</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/workout/${workout.id}`)}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {workout.workoutExercises?.map((workoutExercise) => (
                    <div
                      key={workoutExercise.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {workoutExercise.exerciseId && `Exercise ID: ${workoutExercise.exerciseId}`}
                        {workoutExercise.exercise && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {workoutExercise.exercise.name} ({workoutExercise.exercise.category})
                          </p>
                        )}
                      </h4>
                      {workoutExercise.sets && workoutExercise.sets.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Workout completed
                        </div>
                      )}
                      {workoutExercise.restSeconds && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Rest: {workoutExercise.restSeconds}s
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {workout.notes && (
                  <div className="mt-4 pt-4">
                    <Separator className="mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {workout.notes}
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}