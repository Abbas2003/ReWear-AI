"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { ArrowRight, RotateCw, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/image";

interface PhotoPreviewProps {
  file: File;
  previewUrl: string;
  isCompressed: boolean;
  onAnalyze: () => void;
  onChangePhoto: () => void;
  onRemove: () => void;
}

export default function PhotoPreview({
  file,
  previewUrl,
  isCompressed,
  onAnalyze,
  onChangePhoto,
  onRemove,
}: PhotoPreviewProps) {
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle magnetic button pull on desktop
  const handleBtnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
    setBtnOffset({ x, y });
  };

  const handleBtnMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full glass rounded-3xl p-6 sm:p-10 space-y-6"
    >
      {/* Photo Frame with Thin Corner Brackets */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black/5 border border-[rgba(14,14,14,0.12)] shadow-sm">
        {/* Corner Brackets */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#0E0E0E] z-10 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-[#0E0E0E] z-10 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-[#0E0E0E] z-10 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#0E0E0E] z-10 pointer-events-none" />

        {/* The Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Garment Preview"
          className="w-full h-full object-cover"
        />

        {/* Scan Sweep Shine Pass (runs once on mount) */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "150%" }}
            transition={{ duration: 0.85, ease: "easeInOut", delay: 0.1 }}
            className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
          />
        )}
      </div>

      {/* Quiet Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
        <div className="flex items-center gap-2 font-mono text-[#0E0E0E] truncate">
          <span className="truncate max-w-[200px]" title={file.name}>
            {file.name}
          </span>
          <span className="text-[#6B6860]">&bull;</span>
          <span className="text-[#6B6860]">{formatFileSize(file.size)}</span>
          {isCompressed && (
            <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-black/5 text-[#0E0E0E]">
              Optimized
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            type="button"
            onClick={onChangePhoto}
            className="flex items-center gap-1.5 text-[#0E0E0E] underline underline-offset-4 hover:text-[#6B6860] cursor-pointer"
          >
            <RotateCw className="w-3 h-3" />
            <span>Change photo</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-black cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Main Magnetic Action Button */}
      <div
        ref={btnRef}
        onMouseMove={handleBtnMouseMove}
        onMouseLeave={handleBtnMouseLeave}
        className="pt-2 text-center"
      >
        <motion.div
          animate={{ x: btnOffset.x, y: btnOffset.y }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <Button
            size="lg"
            onClick={onAnalyze}
            className="w-full min-h-[50px] gap-3 text-xs sm:text-sm font-mono tracking-widest uppercase cursor-pointer"
          >
            <span>Analyze and redesign</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <p className="text-[11px] font-mono text-[#6B6860] mt-3">
          Takes about 30 seconds.
        </p>
      </div>
    </motion.div>
  );
}
