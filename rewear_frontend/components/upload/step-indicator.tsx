"use client";

import React from "react";
import { motion } from "motion/react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { num: 1, label: "Add photo", sub: "Upload your garment" },
  { num: 2, label: "Check photo", sub: "Confirm wear details" },
  { num: 3, label: "Analyze", sub: "Generate upcycle plan" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="relative pl-6 py-2 space-y-6 select-none">
      {/* Background track line */}
      <div className="absolute left-[7px] top-4 bottom-4 w-[1px] bg-[rgba(14,14,14,0.12)]" />

      {/* Dynamic fill line */}
      <motion.div
        className="absolute left-[7px] top-4 w-[1px] bg-[#0E0E0E] origin-top"
        initial={{ height: "0%" }}
        animate={{
          height: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {STEPS.map((s) => {
        const isDone = s.num < currentStep;
        const isCurrent = s.num === currentStep;

        return (
          <div key={s.num} className="relative flex items-center gap-3.5 group">
            {/* Step Indicator Dot */}
            <div
              className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDone
                  ? "bg-[#0E0E0E] text-white"
                  : isCurrent
                  ? "bg-[#F4F1EA] border-2 border-[#0E0E0E]"
                  : "bg-[#F4F1EA] border border-[rgba(14,14,14,0.2)]"
              }`}
            >
              {isDone ? (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25 }}
                    d="M2.5 6L5 8.5L9.5 3.5"
                  />
                </svg>
              ) : (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrent ? "bg-[#0E0E0E]" : "bg-transparent"
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div>
              <div
                className={`text-xs font-mono uppercase tracking-wider transition-colors ${
                  isCurrent ? "text-[#0E0E0E] font-semibold" : isDone ? "text-[#0E0E0E]" : "text-[#6B6860]"
                }`}
              >
                0{s.num} / {s.label}
              </div>
              <p className="text-[11px] text-[#6B6860] font-sans">{s.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
