import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
