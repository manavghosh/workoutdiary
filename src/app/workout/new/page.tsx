import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewWorkoutClient from "./NewWorkoutClient";
import { parseURLDate } from "@/lib/utils";

interface NewWorkoutPageProps {
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function NewWorkoutPage({ searchParams }: NewWorkoutPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Parse date from URL params or use today
  const params = await searchParams;
  const selectedDate = params.date
    ? parseURLDate(params.date)
    : new Date();

  return <NewWorkoutClient userId={userId} selectedDate={selectedDate} />;
}