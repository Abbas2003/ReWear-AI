"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface MaterialsListProps {
  materials: string[];
  uploadedAt: string;
}

export function MaterialsList({ materials, uploadedAt }: MaterialsListProps) {
  const storageKey = `rewear:materials:${uploadedAt}`;

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [index]: !prev[index] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  };

  const gatheredCount = Object.values(checkedItems).filter(Boolean).length;
  const progressRatio = materials.length > 0 ? gatheredCount / materials.length : 0;
  const isAllGathered = materials.length > 0 && gatheredCount === materials.length;

  return (
    <div className="glass rounded-3xl p-6 sm:p-7 border border-white/60 shadow-lg shadow-black/5 print-break-avoid">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-gray,#6B6860)] block">
            02 &mdash; Materials &amp; Tools
          </span>
          <h2 className="font-editorial text-2xl text-[var(--color-ink,#0E0E0E)] mt-1">
            Toolkit checklist
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-[var(--color-gray,#6B6860)] block">
            {gatheredCount} of {materials.length} gathered
          </span>
          {isAllGathered && (
            <span className="text-[10px] font-mono uppercase text-[var(--color-ink,#0E0E0E)] font-bold">
              Complete
            </span>
          )}
        </div>
      </div>

      {/* Thin Ink Progress Bar */}
      <div className="w-full h-1 bg-black/[0.08] rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-[var(--color-ink,#0E0E0E)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(progressRatio * 100)}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Materials List Items */}
      <ul className="space-y-2.5">
        {materials.map((item, idx) => {
          const isChecked = Boolean(checkedItems[idx]);
          return (
            <li
              key={idx}
              onClick={() => toggleItem(idx)}
              className={`min-h-[48px] px-4 py-3 rounded-2xl border transition-all cursor-pointer select-none flex items-center gap-3.5 ${
                isChecked
                  ? "bg-black/[0.04] border-black/[0.08] text-[var(--color-gray,#6B6860)]"
                  : "bg-white/40 border-black/[0.06] text-[var(--color-ink,#0E0E0E)] hover:bg-white/70"
              }`}
            >
              {/* Custom Animated Ink Checkbox */}
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? "bg-[var(--color-ink,#0E0E0E)] border-[var(--color-ink,#0E0E0E)] text-white"
                    : "border-black/30 bg-transparent"
                }`}
              >
                {isChecked && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 stroke-white"
                  >
                    <motion.path
                      d="M3 8.5L6.5 12L13 4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                )}
              </div>

              <span
                className={`text-sm leading-snug transition-all ${
                  isChecked ? "line-through opacity-70" : ""
                }`}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
