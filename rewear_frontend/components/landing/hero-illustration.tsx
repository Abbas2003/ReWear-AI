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

  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);

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
                y: [0, -6, 0],
                transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }
        }
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformPerspective: 1000,
              }
        }
        className="w-full max-w-[400px] lg:max-w-[440px]"
      >
        {/* Quiet Glass Container */}
        <div
          role="img"
          aria-label="Animation: a torn jacket is scanned, repaired with stitches and redesigned"
          className="glass rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden border border-white/60 shadow-xl shadow-black/5"
        >
          {/* Subtle Hairline Corner Accents */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[var(--color-hairline,rgba(14,14,14,0.12))]" aria-hidden="true" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[var(--color-hairline,rgba(14,14,14,0.12))]" aria-hidden="true" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[var(--color-hairline,rgba(14,14,14,0.12))]" aria-hidden="true" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[var(--color-hairline,rgba(14,14,14,0.12))]" aria-hidden="true" />

          {/* Editorial Watermark Label */}
          <div className="w-full flex items-center justify-between mb-2 px-1" aria-hidden="true">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-gray,#6B6860)]">
              Process &bull; Loop
            </span>
            <span className="text-[10px] font-mono text-[var(--color-gray,#6B6860)] opacity-70">
              01 &rarr; 03
            </span>
          </div>

          {/* SVG Vector Story */}
          <HeroIllustrationSvg
            reducedMotion={Boolean(shouldReduceMotion)}
            isPlaying={isPlaying}
          />
        </div>
      </motion.div>
    </div>
  );
}
