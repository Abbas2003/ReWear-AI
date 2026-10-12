"use client";

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { MotionValue } from "motion/react";

const BackgroundScene = dynamic(() => import("./background-scene"), {
  ssr: false,
  loading: () => <BackgroundFallback isStatic={true} />,
});

interface BackgroundFallbackProps {
  isStatic?: boolean;
}

export function BackgroundFallback({ isStatic = false }: BackgroundFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-[#F4F1EA] overflow-hidden"
    >
      {/* Soft ivory radial lighting with warm gray valley shadows */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 75% 65% at 50% 18%, rgba(255, 255, 255, 0.95), transparent 70%)",
            "radial-gradient(ellipse 60% 50% at 85% 85%, rgba(206, 201, 188, 0.35), transparent 60%)",
            "radial-gradient(ellipse 55% 45% at 15% 90%, rgba(195, 189, 175, 0.25), transparent 55%)",
          ].join(", "),
        }}
      />

      {/* Subtle diagonal textile weave pattern */}
      <div
        className={`absolute inset-0 opacity-[0.06] ${isStatic ? "" : "motion-safe:animate-pulse"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M20 40L40 20V40' fill='none' stroke='%230E0E0E' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
          animationDuration: "12s",
        }}
      />

      {/* Gentle top-to-bottom shading */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(14, 14, 14, 0.02) 100%)",
        }}
      />
    </div>
  );
}

const emptySubscribe = () => () => { };

function checkEligibility(): boolean {
  if (typeof window === "undefined") return false;

  // Reduced motion preference check
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  // Mobile check: only screen widths under 640px fallback to save mobile battery
  if (window.innerWidth < 640) return false;

  // Relaxed hardware concurrency check: only drop 3D if less than 2 cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
    return false;
  }

  // WebGL availability
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

interface BackgroundProps {
  scrollProgress?: MotionValue<number> | number;
  isInView?: boolean;
}

export default function Background({ scrollProgress, isInView = true }: BackgroundProps) {
  const isEligible = useSyncExternalStore(
    emptySubscribe,
    checkEligibility,
    () => false
  );

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Fallback layer always present underneath */}
      <BackgroundFallback isStatic={!isEligible} />

      {/* Only render 3D canvas when eligible AND hero is in view */}
      {isEligible && isInView && (
        <BackgroundScene scrollProgress={scrollProgress} />
      )}

      {/* Soft ivory veil behind text and edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 30% 45%, rgba(244, 241, 234, 0.5) 0%, transparent 75%)",
        }}
      />
    </div>
  );
}
