import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Dashboard Button Skeleton */}
        <Skeleton className="h-10 w-48 mb-6" />

        {/* Header Card Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Exercises Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          <Skeleton className="h-4 w-12 mb-2" />
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {i < 3 && <div className="mt-4 h-px bg-gray-200 dark:bg-gray-700" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
