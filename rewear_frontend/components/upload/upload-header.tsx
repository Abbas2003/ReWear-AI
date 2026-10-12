import React from "react";
import { Reveal } from "@/components/ui/reveal";

export default function UploadHeader() {
  return (
    <div className="space-y-4">
      <Reveal delay={0.05}>
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#6B6860]">
          Step 01 / Upload
        </p>
      </Reveal>

      <Reveal delay={0.15} yOffset={28}>
        <h1 className="font-editorial text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#0E0E0E]">
          Show us your garment.
        </h1>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="text-base text-[#6B6860] font-sans leading-relaxed max-w-md">
          One clear photo is enough. We find the damage and plan the repair.
        </p>
      </Reveal>
    </div>
  );
}
