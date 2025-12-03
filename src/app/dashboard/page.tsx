import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserWorkoutsByDate } from "@/data/workouts";
import { getUserWorkoutStats } from "@/data/users";
import DashboardClient from "./DashboardClient";
import { parseURLDate, startOfDay, endOfDay } from "@/lib/utils";

interface DashboardPageProps {
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Await searchParams and parse date from URL params or use today
  const params = await searchParams;
  const selectedDate = params.date
    ? parseURLDate(params.date)
    : new Date();

  // Get workouts for the selected date
  const workouts = await getUserWorkoutsByDate(userId, selectedDate);

  // Get user workout statistics for dashboard summary (filtered by selected date)
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);
  const userStats = await getUserWorkoutStats(userId, dayStart, dayEnd);

  return (
    <DashboardClient
      workouts={workouts}
      userStats={userStats}
      selectedDate={selectedDate}
    />
  );
}