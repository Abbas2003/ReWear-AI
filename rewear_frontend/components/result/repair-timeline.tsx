"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface RepairTimelineProps {
  steps: string[];
  uploadedAt: string;
}

export function RepairTimeline({ steps, uploadedAt }: RepairTimelineProps) {
  const storageKey = `rewear:steps:${uploadedAt}`;

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [index]: !prev[index] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressRatio = steps.length > 0 ? completedCount / steps.length : 0;
  const isAllFinished = steps.length > 0 && completedCount === steps.length;

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg shadow-black/5 print-break-avoid">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-gray,#6B6860)] block">
            03 &mdash; Method
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--color-ink,#0E0E0E)] mt-1">
            Your repair guide
          </h2>
        </div>

        <span className="text-xs font-mono text-[var(--color-gray,#6B6860)]">
          {completedCount} of {steps.length} done
        </span>
      </div>

      {/* Thin overall progress bar at top */}
      <div className="w-full h-1 bg-black/[0.08] rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-[var(--color-ink,#0E0E0E)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(progressRatio * 100)}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Vertical Steps */}
      <div className="relative pl-8 sm:pl-10 space-y-8 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-black/[0.1]">
        {/* Animated fill line */}
        <motion.div
          className="absolute left-3.5 top-4 w-[1.5px] bg-[var(--color-ink,#0E0E0E)] origin-top"
          style={{ height: `${Math.round(progressRatio * 100)}%` }}
          transition={{ duration: 0.3 }}
        />

        {steps.map((step, idx) => {
          const isDone = Boolean(completedSteps[idx]);
          const stepNumber = String(idx + 1).padStart(2, "0");

          return (
            <div
              key={idx}
              className={`relative rounded-2xl p-5 border transition-all select-none print-break-avoid ${
                isDone
                  ? "bg-black/[0.03] border-black/[0.08]"
                  : "bg-white/40 border-black/[0.06] hover:bg-white/70"
              }`}
            >
              {/* Step Marker Node */}
              <button
                type="button"
                onClick={() => toggleStep(idx)}
                aria-label={`Toggle step ${idx + 1}`}
                className={`absolute -left-8 sm:-left-10 top-5 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all cursor-pointer ${
                  isDone
                    ? "bg-[var(--color-ink,#0E0E0E)] text-white shadow-md"
                    : "bg-white text-[var(--color-ink,#0E0E0E)] border border-black/20"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
              </button>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <span className="font-editorial text-2xl text-[var(--color-ink,#0E0E0E)] block leading-none opacity-80">
                    {stepNumber}
                  </span>
                  <p
                    className={`text-sm sm:text-base leading-relaxed transition-all ${
                      isDone ? "text-[var(--color-gray,#6B6860)] line-through" : "text-[var(--color-ink,#0E0E0E)]"
                    }`}
                  >
                    {step}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStep(idx)}
                  className={`min-h-[44px] px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border transition-colors shrink-0 cursor-pointer ${
                    isDone
                      ? "bg-[var(--color-ink,#0E0E0E)] text-white border-[var(--color-ink,#0E0E0E)]"
                      : "border-black/15 text-[var(--color-gray,#6B6860)] hover:text-[var(--color-ink,#0E0E0E)] hover:border-black/40"
                  }`}
                >
                  {isDone ? "Done" : "Mark done"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {isAllFinished && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 rounded-2xl bg-white/70 border border-black/10 text-center"
        >
          <p className="font-editorial text-lg text-[var(--color-ink,#0E0E0E)]">
            All stitched up.
          </p>
          <p className="text-xs font-mono text-[var(--color-gray,#6B6860)] mt-0.5">
            Your transformed garment is ready to rewear with pride.
          </p>
        </motion.div>
      )}

      {/* Quiet Eco Note */}
      <div className="mt-8 pt-5 border-t border-black/[0.08] text-center">
        <p className="text-xs font-mono text-[var(--color-gray,#6B6860)] tracking-wide">
          Repairing instead of replacing saves water and emissions. (General textile conservation estimate)
        </p>
      </div>
    </div>
  );
}
