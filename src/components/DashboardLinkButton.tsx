"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export function DashboardLinkButton() {
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
      <Button
        size="lg"
        className="w-full"
        onClick={handleNavigationWithLoading}
      >
        Go to Dashboard
      </Button>
    </>
  );
}
