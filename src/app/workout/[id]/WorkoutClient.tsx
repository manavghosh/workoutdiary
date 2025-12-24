'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Edit, Save, Trash2, Play, Clock, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackToDashboardButton } from '@/components/BackToDashboardButton'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatDateWithOrdinal, formatTimestampForDisplay } from '@/lib/utils'
import { updateWorkoutAction, deleteWorkoutAction, completeWorkoutAction } from './action'

type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'sports'

interface WorkoutClientProps {
  workoutData: any
}

export default function WorkoutClient({ workoutData }: WorkoutClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Edit state
  const [editTitle, setEditTitle] = useState(workoutData.workout.title)
  const [editNotes, setEditNotes] = useState(workoutData.workout.notes || '')
  const [editDuration, setEditDuration] = useState(workoutData.workout.durationMinutes?.toString() || '')

  // Complete workout state
  const [completeDuration, setCompleteDuration] = useState('')

  const { workout, exercises } = workoutData as { workout: any; exercises: any[] }
  const isCompleted = !!workout.completedAt

  const handleUpdateWorkout = () => {
    if (!editTitle.trim()) {
      alert('Workout title is required')
      return
    }

    setIsNavigating(true)

    startTransition(async () => {
      try {
        const updateData: any = {
          title: editTitle.trim(),
          notes: editNotes.trim() || undefined,
        }

        // Only include duration if provided
        if (editDuration.trim()) {
          updateData.durationMinutes = parseInt(editDuration)
        }

        const result = await updateWorkoutAction(workout.id, updateData)

        if (result.success) {
          setIsEditing(false)
          // Refresh the page to show updated data
          router.refresh()
        } else {
          alert('Failed to update workout')
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to update workout')
      } finally {
        setIsNavigating(false)
      }
    })
  }

  const handleDeleteWorkout = () => {
    setIsNavigating(true)

    startTransition(async () => {
      try {
        const result = await deleteWorkoutAction(workout.id)

        if (result.success) {
          // Redirect to dashboard with the workout's date after successful deletion
          const formattedDate = format(workout.startedAt, "yyyy-MM-dd")
          router.push(`/dashboard?date=${formattedDate}`)
        } else {
          alert('Failed to delete workout')
          setIsNavigating(false)
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete workout')
        setIsNavigating(false)
      }
    })
  }

  const handleCompleteWorkout = () => {
    const duration = parseInt(completeDuration)

    if (!duration || duration < 1) {
      alert('Please enter a valid duration')
      return
    }

    setIsNavigating(true)

    startTransition(async () => {
      try {
        const result = await completeWorkoutAction(workout.id, { durationMinutes: duration })

        if (result.success) {
          setShowCompleteDialog(false)
          setCompleteDuration('')
          // Refresh the page to show completed status
          router.refresh()
        } else {
          alert('Failed to complete workout')
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to complete workout')
      } finally {
        setIsNavigating(false)
      }
    })
  }

  const cancelEdit = () => {
    setEditTitle(workout.title)
    setEditNotes(workout.notes || '')
    setEditDuration(workout.durationMinutes?.toString() || '')
    setIsEditing(false)
  }

  return (
    <>
      <LoadingOverlay isLoading={isNavigating} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Dashboard */}
        <BackToDashboardButton
          onNavigate={() => setIsNavigating(true)}
          workoutDate={workout.startedAt}
        />

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                  <CardTitle className="flex items-center gap-2">
                    {isEditing ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-2xl font-bold p-0 border-0 focus-visible:ring-0 h-auto"
                        placeholder="Workout title"
                      />
                    ) : (
                      <>
                        {workout.title}
                        {isCompleted && (
                          <Badge variant="default" className="ml-2">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateWithOrdinal(workout.startedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTimestampForDisplay(workout.startedAt, 'h:mm a')}
                    </div>
                    {workout.durationMinutes && (
                      <Badge variant="secondary">
                        {workout.durationMinutes} min
                      </Badge>
                    )}
                  </CardDescription>
                </div>

              <div className="flex items-center gap-2">
                {!isCompleted && !isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Complete Workout</DialogTitle>
                          <DialogDescription>
                            Enter the total duration of your workout in minutes.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={completeDuration}
                              onChange={(e) => setCompleteDuration(e.target.value)}
                              placeholder="e.g., 45"
                              min="1"
                              max="1440"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCompleteDialog(false)}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCompleteWorkout}
                            disabled={isPending || !completeDuration.trim()}
                          >
                            {isPending ? 'Completing...' : 'Complete Workout'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                {isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdateWorkout}
                      disabled={isPending || !editTitle.trim()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                )}

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Workout</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this workout? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteWorkout}
                        disabled={isPending}
                      >
                        {isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          {/* Notes Section */}
          {(workout.notes || isEditing) && (
            <CardContent>
              <div>
                <Label>Notes</Label>
                {isEditing ? (
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about this workout..."
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {workout.notes || 'No notes'}
                  </p>
                )}
              </div>
            </CardContent>
          )}

          {/* Duration Section */}
          {isEditing && (
            <CardContent>
              <div>
                <Label htmlFor="duration">Duration (minutes, optional)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  placeholder="e.g., 45"
                  min="1"
                  max="1440"
                  className="mt-1"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Exercises Section */}
        {exercises.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Exercises ({exercises.length})</CardTitle>
              <CardDescription>
                Exercises performed in this workout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exercises.map((exercise: any, index: number) => (
                  <div key={exercise.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{exercise.exercise.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {exercise.exercise.category}
                          </Badge>
                          {exercise.restSeconds && (
                            <Badge variant="secondary" className="text-xs">
                              Rest: {exercise.restSeconds}s
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        #{exercise.order + 1}
                      </div>
                    </div>

                    {exercise.sets.length > 0 && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                          {exercise.sets.map((set: any) => (
                            <div key={set.id} className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded">
                              <div className="font-medium">Set {set.setNumber}</div>
                              <div className="space-y-1 mt-1">
                                {set.reps && (
                                  <div>Reps: {set.reps}</div>
                                )}
                                {set.weightLbs && (
                                  <div>Weight: {set.weightLbs} lbs</div>
                                )}
                                {set.durationSeconds && (
                                  <div>Duration: {set.durationSeconds}s</div>
                                )}
                                {set.distanceMiles && (
                                  <div>Distance: {set.distanceMiles} mi</div>
                                )}
                                {set.notes && (
                                  <div className="text-gray-600 dark:text-gray-400">{set.notes}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {index < exercises.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Status */}
        {workout.completedAt && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Workout Completed</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Completed on {formatDateWithOrdinal(workout.completedAt)} at {formatTimestampForDisplay(workout.completedAt, 'h:mm a')}
                {workout.durationMinutes && (
                  <>
                    {' • Duration: '}{workout.durationMinutes} minutes
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </>
  )
}