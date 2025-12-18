"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BackToDashboardButton() {
  const router = useRouter();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push("/dashboard")}
          aria-label="Navigate back to workout dashboard"
          className="transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
