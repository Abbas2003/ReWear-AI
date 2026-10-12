"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function Cta() {
  return (
    <section className="relative border-t border-[rgba(14,14,14,0.12)] py-28 sm:py-36 px-6 sm:px-12 overflow-hidden">
      {/* Soft ambient glow background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 30% 50%, rgba(14, 14, 14, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0V60' fill='none' stroke='%230E0E0E' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl space-y-8">
          {/* Section Label */}
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="inline-block w-8 h-px bg-[#0E0E0E]/40" />
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860]">
                03 &mdash; Begin
              </p>
            </div>
          </Reveal>

          {/* Main Heading */}
          <Reveal delay={0.1}>
            <h2 className="font-editorial text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.02] tracking-tight text-[#0E0E0E]">
              Give your wardrobe a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic">second life.</span>
                {/* Underline accent */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 bottom-[0.12em] h-[0.1em] bg-[#0E0E0E]/15 z-0"
                />
              </span>
            </h2>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-[#6B6860] max-w-xl font-sans leading-relaxed">
              Upload your garment in seconds. No specialty sewing skills or expensive gear required.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="group gap-3 font-mono text-sm tracking-wider uppercase min-h-[52px] px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-black/10"
                >
                  <span>Upload a garment</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link
                href="/#how-it-works"
                className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-[#6B6860] hover:text-[#0E0E0E] transition-colors duration-300 px-6 py-4"
              >
                <span>See how it works</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          {/* Small trust note */}
          <Reveal delay={0.4}>
            <div className="flex items-center gap-3 pt-6 text-xs font-mono uppercase tracking-widest text-[#6B6860]/70">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0E0E0E]/40" />
              <span>No signup required</span>
              <span className="inline-block w-px h-3 bg-[#0E0E0E]/20" />
              <span>Takes 30 seconds</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}