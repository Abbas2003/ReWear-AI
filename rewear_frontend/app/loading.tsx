import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-emerald-400/90">
          Loading ReWear AI...
        </p>
      </div>
    </div>
  );
}
