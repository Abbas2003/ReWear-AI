"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PhotoTips() {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    "Bright, natural daylight without harsh flash",
    "Lay garment flat to reveal fabric texture",
    "Keep damaged area centered and in focus",
    "Use a contrasting, uncluttered surface",
  ];

  return (
    <div className="border-t border-[rgba(14,14,14,0.12)] pt-4 select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#0E0E0E] hover:text-[#6B6860] transition-colors py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0E0E0E]"
        aria-expanded={isOpen}
      >
        <span>Photo tips for best results</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden space-y-2 pt-2 text-xs text-[#6B6860] font-sans"
          >
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#0E0E0E]/40" />
                <span>{tip}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
