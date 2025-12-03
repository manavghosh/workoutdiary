"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { formatDateWithOrdinal } from "@/lib/utils";
import { createWorkoutAction } from "./action";

interface NewWorkoutClientProps {
  userId: string;
  selectedDate?: Date;
}

export default function NewWorkoutClient({ userId, selectedDate }: NewWorkoutClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [workoutDate, setWorkoutDate] = useState<Date>(selectedDate || new Date());

  // Initialize with current time in local timezone
  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Format: HH:MM
  };

  const [startTime, setStartTime] = useState(getCurrentTimeString());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSaveWorkout = () => {
    if (!title.trim()) {
      alert("Please enter a workout title");
      return;
    }

    startTransition(async () => {
      try {
        // Format date as YYYY-MM-DD for proper parsing
        const formattedDate = workoutDate.getFullYear() + '-' +
          String(workoutDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(workoutDate.getDate()).padStart(2, '0');

        console.log('Formatted date for action:', formattedDate);
        console.log('Start time for action:', startTime);

        const result = await createWorkoutAction({
          title: title.trim(),
          notes: notes.trim() || undefined,
          workoutDate: formattedDate,
          startTime: startTime, // Send the time as selected by user (defaults to current time)
        });

        if (result.success && result.redirectDate) {
          console.log('Workout saved successfully, redirecting...', result);

          // If workout date is today, redirect to dashboard without date
          const today = new Date().toISOString().split('T')[0];
          const redirectUrl = result.redirectDate === today
            ? "/dashboard"
            : `/dashboard?date=${result.redirectDate}`;

          console.log('Redirecting to:', redirectUrl);

          // Use window.location for immediate redirect
          // This bypasses any Next.js router issues
          window.location.href = redirectUrl;
        } else {
          console.error('Unexpected result from action:', result);
          alert('Workout saved but redirect failed. Please navigate manually.');
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to create workout');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
                <CardTitle>Log New Workout</CardTitle>
              </div>
              <Button
                onClick={handleSaveWorkout}
                disabled={isPending || !title.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Saving..." : "Save Workout"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Workout Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning Strength Training"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this workout..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date and Time Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Date Picker Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Workout Date
              </CardTitle>
              <CardDescription>
                Select the date for your workout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {formatDateWithOrdinal(workoutDate)}
                </Button>

                {showCalendar && (
                  <div className="border rounded-lg p-2 bg-background">
                    <Calendar
                      selected={workoutDate}
                      onSelect={(date) => {
                        if (date) {
                          setWorkoutDate(date);
                          setShowCalendar(false);
                        }
                      }}
                      defaultMonth={workoutDate}
                      disabled={(date) => {
                        // Disable dates in the future
                        return date > new Date();
                      }}
                      className="w-full"
                    />
                  </div>
                )}

                <Badge variant="secondary" className="text-xs">
                  {workoutDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Time Picker Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Start Time
              </CardTitle>
              <CardDescription>
                Set the start time for your workout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {startTime && (
                  <Badge variant="outline" className="text-xs">
                    Workout starts at {startTime}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workout Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Workout Summary</CardTitle>
            <CardDescription>
              Review your workout details before saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="text-sm">{title || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="text-sm">{formatDateWithOrdinal(workoutDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Time</Label>
                  <p className="text-sm">{startTime || "Not specified"}</p>
                </div>
              </div>

              {notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                  <p className="text-sm mt-1">{notes}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    Ready to save
                  </Badge>
                  <Button
                    onClick={handleSaveWorkout}
                    disabled={isPending || !title.trim()}
                    size="lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Saving..." : "Save Workout"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}