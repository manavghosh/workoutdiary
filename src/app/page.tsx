import Link from "next/link";
import { Dumbbell, TrendingUp, Calendar } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { DashboardLinkButton } from "@/components/DashboardLinkButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Workout Diary
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Track your fitness journey, monitor progress, and achieve your goals with our comprehensive workout tracking application.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <SignedIn>
              <DashboardLinkButton />
            </SignedIn>
            <SignedOut>
              <Button size="lg" className="w-full" asChild>
                <a href="#">
                  Sign In to Get Started
                </a>
              </Button>
            </SignedOut>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-md mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-center">Track Daily Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Log your exercises, sets, reps, and weights for each workout session.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-md mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-center">Monitor Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Visualize your fitness journey with comprehensive progress tracking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-md mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-center">Custom Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Create and customize workout routines that fit your specific fitness goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
