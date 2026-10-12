"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    num: "01",
    title: "Upload",
    desc: "Provide a clear photo of your worn, torn, or stained garment from any angle.",
    tag: "Input",
  },
  {
    num: "02",
    title: "Analyze",
    desc: "Vision intelligence inspects fabric weave, structural integrity, and damage coordinates.",
    tag: "Scan",
  },
  {
    num: "03",
    title: "Guide",
    desc: "Receive an algorithmic blueprint listing household materials and tailored stitch instructions.",
    tag: "Plan",
  },
  {
    num: "04",
    title: "Preview",
    desc: "Inspect a high-fidelity visual render of your redesigned garment before making a cut.",
    tag: "Render",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(3, Math.floor(latest * 4));
    setActiveStep(idx);
  });

  return (
    <section id="how-it-works" className="relative border-t border-[rgba(14,14,14,0.12)]">
      {/* ================= DESKTOP PINNED SCROLL ================= */}
      <div ref={containerRef} className="hidden lg:block relative min-h-[300vh]">
        <div className="sticky top-20 h-[85vh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto">

          {/* Section Label */}
          <div className="flex items-center gap-4 mb-10">
            <span className="inline-block w-8 h-px bg-[#0E0E0E]/40" />
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860]">
              02 &mdash; Method
            </div>
          </div>

          <div className="grid grid-cols-12 gap-16 items-center">

            {/* ===== LEFT: Active Step Display ===== */}
            <div className="col-span-7 relative">

              {/* Giant ghost number in background */}
              <div
                aria-hidden="true"
                className="absolute -top-16 -left-8 font-editorial text-[22rem] leading-none text-[#0E0E0E]/[0.03] select-none pointer-events-none transition-all duration-700"
              >
                {STEPS[activeStep].num}
              </div>

              <div className="relative space-y-6">

                {/* Step indicator row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-500 ${idx === activeStep
                            ? "w-8 bg-[#0E0E0E]"
                            : idx < activeStep
                              ? "w-4 bg-[#0E0E0E]/50"
                              : "w-1.5 bg-[#0E0E0E]/15"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B6860]">
                    Step {STEPS[activeStep].num} / 04
                  </span>
                </div>

                {/* Big active number */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="font-editorial text-[8rem] xl:text-[10rem] text-[#0E0E0E] leading-none select-none tracking-tight"
                  >
                    {STEPS[activeStep].num}
                  </motion.div>
                </AnimatePresence>

                {/* Title */}
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={`title-${activeStep}`}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                    className="font-editorial text-4xl xl:text-5xl text-[#0E0E0E] tracking-tight"
                  >
                    {STEPS[activeStep].title}
                  </motion.h3>
                </AnimatePresence>

                {/* Description */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${activeStep}`}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
                    className="text-lg text-[#6B6860] max-w-md font-sans leading-relaxed"
                  >
                    {STEPS[activeStep].desc}
                  </motion.p>
                </AnimatePresence>

              </div>
            </div>

            {/* ===== RIGHT: Vertical Step List ===== */}
            <div className="col-span-5 relative">
              {/* Vertical rail */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#0E0E0E]/10" />

              {/* Animated progress fill */}
              <motion.div
                className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-[#0E0E0E] to-[#0E0E0E]/40 origin-top"
                style={
                  shouldReduceMotion
                    ? { height: "100%" }
                    : { height: "100%", scaleY: scrollYProgress }
                }
              />

              <div className="pl-8 space-y-10">
                {STEPS.map((step, idx) => {
                  const isActive = idx === activeStep;
                  const isPast = idx < activeStep;

                  return (
                    <div
                      key={step.num}
                      className={`relative transition-all duration-500 ${isActive
                          ? "opacity-100 translate-x-2"
                          : isPast
                            ? "opacity-50"
                            : "opacity-25"
                        }`}
                    >
                      {/* Node dot */}
                      <span
                        className={`absolute -left-[37px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${isActive
                            ? "bg-[#0E0E0E] border-[#0E0E0E] scale-125"
                            : isPast
                              ? "bg-[#0E0E0E]/60 border-[#0E0E0E]/60"
                              : "bg-transparent border-[#0E0E0E]/25"
                          }`}
                      />

                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="text-xs font-mono uppercase tracking-widest text-[#0E0E0E]">
                          {step.num}
                        </div>
                        <div className="flex-1 h-px bg-[#0E0E0E]/10" />
                        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#6B6860]/70">
                          {step.tag}
                        </span>
                      </div>

                      <h4
                        className={`font-editorial text-xl mb-1 transition-colors duration-500 ${isActive ? "text-[#0E0E0E]" : "text-[#6B6860]"
                          }`}
                      >
                        {step.title}
                      </h4>

                      <p className="text-xs text-[#6B6860] leading-relaxed max-w-xs">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= MOBILE SIMPLIFIED ================= */}
      <div className="lg:hidden py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">

        {/* Section Label */}
        <div className="flex items-center gap-4">
          <span className="inline-block w-8 h-px bg-[#0E0E0E]/40" />
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860]">
            02 &mdash; Method
          </div>
        </div>

        <div className="space-y-0">
          {STEPS.map((step, idx) => (
            <Reveal key={step.num}>
              <div
                className={`relative py-8 ${idx !== STEPS.length - 1 ? "border-b border-[rgba(14,14,14,0.1)]" : ""
                  }`}
              >
                {/* Step header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-editorial text-4xl text-[#0E0E0E]">
                    {step.num}
                  </span>
                  <div className="flex-1 h-px bg-[#0E0E0E]/10" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#6B6860]/70">
                    {step.tag}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl text-[#0E0E0E] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B6860] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}