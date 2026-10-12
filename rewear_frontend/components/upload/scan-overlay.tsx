"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface ScanOverlayProps {
  previewUrl: string;
  onCancel: () => void;
}

const STAGES = [
  "Uploading photo",
  "Reading fabric & damage",
  "Planning repair blueprint",
  "Generating redesign preview",
];

const GENERAL_FACTS = [
  "Repairing a garment extends its wearable life and prevents virgin textile processing.",
  "Traditional Sashiko embroidery was historically developed to strengthen and mend worn fabric.",
  "Simple patch reinforcements transform structural tears into distinct aesthetic details.",
  "Keeping garments in circulation preserves water and energy used in original manufacturing.",
];

const TAGS = [
  { text: "Reading fabric weave", pos: "top-4 left-4", delay: 900 },
  { text: "Looking for damage", pos: "top-14 right-4", delay: 2800 },
  { text: "Formulating repair vectors", pos: "bottom-14 left-4", delay: 6200 },
  { text: "Synthesizing preview", pos: "bottom-4 right-4", delay: 9500 },
];

export default function ScanOverlay({ previewUrl, onCancel }: ScanOverlayProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [factIndex, setFactIndex] = useState(0);
  const [visibleTags, setVisibleTags] = useState<number[]>([]);
  const shouldReduceMotion = useReducedMotion();

  // Progress stepper on timed intervals
  useEffect(() => {
    const t1 = setTimeout(() => setStageIndex(1), 3500);
    const t2 = setTimeout(() => setStageIndex(2), 10000);
    const t3 = setTimeout(() => setStageIndex(3), 20000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Smooth asymptotic progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 45) return p + 1.2;
        if (p < 75) return p + 0.55;
        if (p < 90) return p + 0.2;
        if (p < 95) return p + 0.04;
        return p;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Facts rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % GENERAL_FACTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Sequenced detection tags
  useEffect(() => {
    const timers = TAGS.map((t, idx) =>
      setTimeout(() => setVisibleTags((prev) => [...prev, idx]), t.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Analyzing garment"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#F4F1EA]/85 backdrop-blur-2xl overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl glass rounded-3xl p-6 sm:p-10 flex flex-col items-center text-[#0E0E0E]">
        {/* Top Bar with Cancel */}
        <div className="w-full flex items-center justify-between pb-6 border-b border-[rgba(14,14,14,0.12)] mb-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6B6860]">
            Live Inspection &bull; Analyzing
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-mono text-[#0E0E0E] hover:text-[#6B6860] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Center Photo with Ink Brackets & Laser */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border border-[rgba(14,14,14,0.15)] bg-white/40 mb-8 select-none shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Garment being scanned"
            className="w-full h-full object-cover filter contrast-[1.02]"
          />

          {/* Corner Ink Brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0E0E0E]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0E0E0E]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0E0E0E]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0E0E0E]" />

          {/* Subtle Ink Laser Sweep */}
          {!shouldReduceMotion && (
            <motion.div
              animate={{ top: ["4%", "94%", "4%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-[2px] bg-[#0E0E0E] shadow-[0_0_8px_rgba(14,14,14,0.5)] pointer-events-none"
            />
          )}

          {/* Glass Detection Pills */}
          {TAGS.map((tag, idx) => {
            if (!visibleTags.includes(idx)) return null;
            return (
              <div
                key={idx}
                className={`absolute ${tag.pos} z-10 glass px-2.5 py-1 rounded-full text-[10px] font-mono text-[#0E0E0E] shadow-xs`}
              >
                {tag.text}
              </div>
            );
          })}
        </div>

        {/* Progress Tracker */}
        <div className="w-full max-w-md space-y-3 mb-8">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#0E0E0E]">
              Stage {stageIndex + 1} of 4: {STAGES[stageIndex]}
            </span>
            <span className="tabular-nums font-semibold text-[#0E0E0E]">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full h-1 bg-[rgba(14,14,14,0.1)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0E0E0E] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Short General Wisdom */}
        <div className="w-full max-w-md text-center pt-2">
          <p className="text-xs text-[#6B6860] font-sans leading-relaxed italic">
            &ldquo;{GENERAL_FACTS[factIndex]}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
