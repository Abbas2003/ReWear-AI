"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function Cta() {
  return (
    <section className="border-t border-[rgba(14,14,14,0.12)] py-28 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="max-w-4xl space-y-8">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860] mb-4">
            03 &mdash; Begin
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-editorial text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-tight text-[#0E0E0E]">
            Give your wardrobe a second life.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-base sm:text-lg text-[#6B6860] max-w-xl font-sans leading-relaxed mb-6">
            Upload your garment in seconds. No specialty sewing skills or expensive gear required.
          </p>

          <Link href="/upload">
            <Button size="lg" className="gap-3 font-mono text-sm tracking-wider uppercase min-h-[48px]">
              <span>Upload a garment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
