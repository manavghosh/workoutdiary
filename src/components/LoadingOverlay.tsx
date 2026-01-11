"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <Dialog open={isLoading}>
      <DialogContent
        className="flex flex-col items-center gap-4 border-none bg-transparent shadow-none"
        aria-describedby="loading-description"
      >
        <DialogTitle className="sr-only">Loading</DialogTitle>
        <div
          className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 dark:text-pink-400" />
          <p
            id="loading-description"
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            Loading...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
