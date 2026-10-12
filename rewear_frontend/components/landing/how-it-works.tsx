"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    num: "01",
    title: "Upload",
    desc: "Provide a clear photo of your worn, torn, or stained garment from any angle.",
  },
  {
    num: "02",
    title: "Analyze",
    desc: "Vision intelligence inspects fabric weave, structural integrity, and damage coordinates.",
  },
  {
    num: "03",
    title: "Guide",
    desc: "Receive an algorithmic blueprint listing household materials and tailored stitch instructions.",
  },
  {
    num: "04",
    title: "Preview",
    desc: "Inspect a high-fidelity visual render of your redesigned garment before making a cut.",
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
      {/* Desktop Pinned Scroll Section */}
      <div ref={containerRef} className="hidden lg:block relative min-h-[300vh]">
        <div className="sticky top-20 h-[85vh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto">
          
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860] mb-8">
            02 &mdash; Method
          </div>

          <div className="grid grid-cols-12 gap-12 items-center">
            {/* Left Column: Big Active Step Display */}
            <div className="col-span-7 space-y-6">
              <div className="font-editorial text-8xl sm:text-9xl text-[#0E0E0E] leading-none select-none transition-all duration-300">
                {STEPS[activeStep].num}
              </div>

              <h3 className="font-editorial text-4xl sm:text-5xl text-[#0E0E0E] tracking-tight transition-all duration-300">
                {STEPS[activeStep].title}
              </h3>

              <p className="text-lg text-[#6B6860] max-w-md font-sans leading-relaxed">
                {STEPS[activeStep].desc}
              </p>
            </div>

            {/* Right Column: Steps List with Vertical Dynamic Progress Line */}
            <div className="col-span-5 relative pl-8 border-l border-[rgba(14,14,14,0.15)] space-y-8">
              {/* Dynamic scroll progress fill line */}
              <motion.div
                className="absolute left-[-1px] top-0 w-[2px] bg-[#0E0E0E] origin-top"
                style={
                  shouldReduceMotion
                    ? undefined
                    : {
                        height: "100%",
                        scaleY: scrollYProgress,
                      }
                }
              />

              {STEPS.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={step.num}
                    className={`transition-all duration-300 ${
                      isActive ? "opacity-100 translate-x-2" : "opacity-35"
                    }`}
                  >
                    <div className="text-xs font-mono uppercase tracking-widest text-[#0E0E0E] mb-1">
                      {step.num} / {step.title}
                    </div>
                    <p className="text-xs text-[#6B6860] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Simplified Vertical List (No Pinning) */}
      <div className="lg:hidden py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860]">
          02 &mdash; Method
        </div>

        <div className="space-y-10 divide-y divide-[rgba(14,14,14,0.1)]">
          {STEPS.map((step) => (
            <Reveal key={step.num} className="pt-8 first:pt-0">
              <span className="font-editorial text-4xl text-[#0E0E0E] block mb-2">
                {step.num}
              </span>
              <h3 className="font-editorial text-2xl text-[#0E0E0E] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#6B6860] leading-relaxed">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
