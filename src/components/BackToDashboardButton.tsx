"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export function BackToDashboardButton() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigationWithLoading = () => {
    setIsNavigating(true);

    // Keep loading visible for minimum 2 seconds
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <>
      <LoadingOverlay isLoading={isNavigating} />
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Button
            variant="default"
            size="sm"
            onClick={handleNavigationWithLoading}
            aria-label="Navigate back to workout dashboard"
            className="transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
