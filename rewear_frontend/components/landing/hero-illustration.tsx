"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { HeroIllustrationSvg } from "./hero-illustration-svg";

export function HeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Pause when browser tab is inactive
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const isPlaying = !shouldReduceMotion && isInView && isTabVisible;

  // Desktop subtle mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  // Glow position follows cursor subtly
  const glowX = useTransform(springX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["30%", "70%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || typeof window === "undefined" || window.innerWidth < 1024) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full flex items-center justify-center py-4 lg:py-0"
    >
      {/* Outer Floating Wrapper */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
              y: [0, -8, 0],
              transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }
        }
        style={
          shouldReduceMotion
            ? undefined
            : {
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
        }
        className="w-full max-w-[400px] lg:max-w-[440px]"
      >
        {/* Quiet Glass Container */}
        <div
          role="img"
          aria-label="Animation: a torn jacket is scanned, repaired with stitches and redesigned"
          className="relative rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden border border-white/60 shadow-xl shadow-black/5 backdrop-blur-md bg-white/60"
        >
          {/* Cursor-following ambient glow */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background: `radial-gradient(circle 320px at ${glowX} ${glowY}, rgba(14,14,14,0.05), transparent 70%)`,
            }}
          />

          {/* Subtle grid texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='%230E0E0E' stroke-width='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Subtle Hairline Corner Accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[rgba(14,14,14,0.18)]" aria-hidden="true" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[rgba(14,14,14,0.18)]" aria-hidden="true" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[rgba(14,14,14,0.18)]" aria-hidden="true" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[rgba(14,14,14,0.18)]" aria-hidden="true" />

          {/* Editorial Watermark Label */}
          <div className="relative w-full flex items-center justify-between mb-3 px-1 z-10" aria-hidden="true">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0E0E0E]/70 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B6860]">
                Process &bull; Loop
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6B6860] opacity-70 tabular-nums">
              01 &rarr; 03
            </span>
          </div>

          {/* Hairline divider */}
          <div className="relative w-full h-px bg-gradient-to-r from-transparent via-[#0E0E0E]/10 to-transparent mb-4 z-10" aria-hidden="true" />

          {/* SVG Vector Story */}
          <div className="relative z-10">
            <HeroIllustrationSvg
              reducedMotion={Boolean(shouldReduceMotion)}
              isPlaying={isPlaying}
            />
          </div>

          {/* Bottom status strip */}
          <div className="relative w-full flex items-center justify-between mt-4 px-1 z-10" aria-hidden="true">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#6B6860]/70">
              AI Repair Engine
            </span>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-[#0E0E0E]/40" />
              <span className="inline-block w-1 h-1 rounded-full bg-[#0E0E0E]/40" />
              <span className="inline-block w-1 h-1 rounded-full bg-[#0E0E0E]/70" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}