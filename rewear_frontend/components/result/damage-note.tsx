"use client";

import React from "react";

interface DamageNoteProps {
  detectedDamage: string;
}

export function DamageNote({ detectedDamage }: DamageNoteProps) {
  return (
    <div className="glass rounded-3xl p-6 sm:p-7 border border-white/60 shadow-lg shadow-black/5 print-break-avoid">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-gray,#6B6860)]">
          01 &mdash; What we found
        </span>
        <span className="text-[11px] font-mono text-[var(--color-gray,#6B6860)]">
          Diagnostic
        </span>
      </div>

      <blockquote className="font-editorial text-lg sm:text-xl leading-relaxed text-[var(--color-ink,#0E0E0E)] border-l-2 border-[var(--color-ink,#0E0E0E)] pl-4 py-1 italic">
        {detectedDamage}
      </blockquote>
    </div>
  );
}
