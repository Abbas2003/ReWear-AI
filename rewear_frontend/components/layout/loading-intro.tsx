"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function LoadingIntro() {
  // Initialize lazily to avoid setState in effect
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem("rewear_intro_seen");
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const duration = 1050; // Max ~1.1s total

    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          try {
            sessionStorage.setItem("rewear_intro_seen", "true");
          } catch {
            // safe fallback
          }
        }, 150);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F4F1EA] text-[#0E0E0E] pointer-events-none select-none"
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6 text-center">
            {/* Serif Wordmark */}
            <h1 className="font-editorial text-4xl tracking-tight mb-4 text-[#0E0E0E]">
              ReWear
            </h1>

            {/* Percentage Counter */}
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#6B6860] mb-3 tabular-nums">
              {progress}%
            </div>

            {/* Hairline Progress Bar */}
            <div className="w-48 h-[1px] bg-[rgba(14,14,14,0.15)] relative overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 bg-[#0E0E0E] transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
