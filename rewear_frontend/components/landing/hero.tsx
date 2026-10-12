"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "motion/react";
import { HeroIllustration } from "./hero-illustration";
import Background from "@/components/three/background";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isHeroInView = useInView(containerRef, { amount: 0.05 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -40]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden min-h-[92vh] flex flex-col justify-center"
    >
      {/* 3D Background scoped exclusively to Hero */}
      <Background scrollProgress={scrollYProgress} isInView={isHeroInView} />

      {/* Smooth bottom melt gradient into solid paper ivory (approx 200px tall) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-48 sm:h-56 bg-gradient-to-t from-[var(--color-paper,#F4F1EA)] via-[rgba(244,241,234,0.85)] to-transparent pointer-events-none z-10"
      />

      {/* Hero content container above the canvas */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity, y }}
        className="relative z-20 pt-32 pb-24 px-6 sm:px-12 max-w-7xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Editorial Eyebrow Label */}
            <Reveal delay={0.1}>
              <p className="inline-block w-fit text-xs font-mono uppercase tracking-[0.25em] text-white bg-black px-3 py-1.5 rounded-sm mb-6 sm:mb-8">
                01 &mdash; Circular Garment Intelligence
              </p>
            </Reveal>

            {/* Huge Serif Headline */}
            <Reveal delay={0.2} yOffset={32}>
              <h1 className="font-editorial text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98] tracking-tight text-[var(--color-ink,#0E0E0E)] mb-6 sm:mb-8">
                Don&apos;t throw it away.
                <br />
                Rewear it.
              </h1>
            </Reveal>

            {/* Short Subtitle */}
            <Reveal delay={0.3}>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--color-gray,#6B6860)] font-sans max-w-xl leading-relaxed mb-8 sm:mb-10">
                A quiet artificial intelligence that analyzes wear, tears, and flaws in forgotten clothing to formulate step-by-step bespoke upcycling blueprints.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                <Link href="/upload">
                  <Button size="lg" className="min-h-[48px] gap-3 text-sm font-mono tracking-wider uppercase">
                    <span>Upload a garment</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link
                  href="/#how-it-works"
                  className="text-sm font-mono text-[var(--color-ink,#0E0E0E)] underline underline-offset-8 hover:text-[var(--color-gray,#6B6860)] transition-colors py-2"
                >
                  See how it works &rarr;
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Animated Vector Illustration in Glass Panel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <Reveal delay={0.25} yOffset={24} className="w-full flex justify-center lg:justify-end">
              <HeroIllustration />
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
