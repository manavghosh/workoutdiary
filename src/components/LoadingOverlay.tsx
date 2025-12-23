"use client";

import Image from "next/image";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Workout Icon with Animation */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Pulsing background effect */}
          <div className="absolute inset-0 bg-pink-500/20 rounded-full animate-ping"></div>

          {/* Animated workout icon */}
          <div className="relative animate-bounce">
            <Image
              src="/workout-icon.png"
              alt="Loading workout"
              width={64}
              height={64}
              className="w-16 h-16 drop-shadow-lg"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-600 dark:border-pink-400 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Loading...
        </p>
      </div>
    </div>
  );
}
