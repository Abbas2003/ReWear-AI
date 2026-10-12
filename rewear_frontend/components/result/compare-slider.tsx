"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ImageOff, MoveHorizontal } from "lucide-react";
import { useReducedMotion } from "motion/react";

interface CompareSliderProps {
  originalImage: string;
  previewImage: string;
  garmentType: string;
}

export function CompareSlider({
  originalImage,
  previewImage,
  garmentType,
}: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // One-time intro teaser movement (50 -> 68 -> 50)
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timeout = setTimeout(() => {
      setSliderPosition(68);
      const returnTimeout = setTimeout(() => {
        setSliderPosition(50);
      }, 700);
      return () => clearTimeout(returnTimeout);
    }, 450);
    return () => clearTimeout(timeout);
  }, [shouldReduceMotion]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updatePosition(e.clientX);
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) updatePosition(e.touches[0].clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  // Preview URL validation
  const isValidPreviewUrl =
    previewImage && (previewImage.startsWith("https://") || previewImage.startsWith("data:"));

  return (
    <div className="w-full select-none print-break-avoid">
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Before and after garment redesign comparison slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
        className="glass relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[560px] rounded-3xl overflow-hidden border border-white/60 shadow-xl shadow-black/5 cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[var(--color-ink,#0E0E0E)]"
      >
        {/* Layer 1: "After" AI Redesign */}
        <div className="absolute inset-0 w-full h-full bg-[#EAE7DF]">
          {isValidPreviewUrl && !imageFailed ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewImage}
              alt={`Redesigned ${garmentType}`}
              onError={() => setImageFailed(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-md">
              <ImageOff className="w-10 h-10 text-[var(--color-gray,#6B6860)] mb-3 opacity-60" />
              <h4 className="font-editorial text-xl text-[var(--color-ink,#0E0E0E)] mb-1">
                Visual Preview Expired
              </h4>
              <p className="text-xs text-[var(--color-gray,#6B6860)] max-w-sm">
                The temporary image link has expired, but your step-by-step upcycling blueprint is preserved below.
              </p>
            </div>
          )}

          <div className="absolute bottom-5 right-5 z-10 px-3.5 py-1.5 rounded-full glass-subtle text-[11px] font-mono tracking-wider uppercase text-[var(--color-ink,#0E0E0E)] pointer-events-none">
            After &bull; Redesign
          </div>
        </div>

        {/* Layer 2: "Before" Original Garment */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalImage}
            alt={`Original ${garmentType}`}
            className="w-full h-full object-cover filter contrast-[1.02]"
          />
          <div className="absolute bottom-5 left-5 z-10 px-3.5 py-1.5 rounded-full glass-subtle text-[11px] font-mono tracking-wider uppercase text-[var(--color-ink,#0E0E0E)] pointer-events-none">
            Before &bull; Original
          </div>
        </div>

        {/* Thin Ink Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 w-[1.5px] bg-[var(--color-ink,#0E0E0E)] transition-none shadow-sm"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Circular Ink Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[var(--color-ink,#0E0E0E)] text-white shadow-lg flex items-center justify-center cursor-ew-resize active:scale-95 transition-transform border border-white/40">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
