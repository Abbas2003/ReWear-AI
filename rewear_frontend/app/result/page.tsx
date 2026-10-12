"use client";

import React, { useSyncExternalStore, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StoredResultData } from "@/lib/api";
import { Reveal } from "@/components/ui/reveal";
import { ResultHeader } from "@/components/result/result-header";
import { CompareSlider } from "@/components/result/compare-slider";
import { DamageNote } from "@/components/result/damage-note";
import { MaterialsList } from "@/components/result/materials-list";
import { RepairTimeline } from "@/components/result/repair-timeline";
import { ResultActions } from "@/components/result/result-actions";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("rewear:result");
}

export default function ResultPage() {
  const router = useRouter();

  const raw = useSyncExternalStore(
    subscribeStorage,
    getSessionSnapshot,
    () => null
  );

  const data = useMemo<StoredResultData | null>(() => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.result) return parsed;
      return null;
    } catch {
      return null;
    }
  }, [raw]);

  // Gracefully redirect to /upload if no data in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("rewear:result")) {
      router.replace("/upload");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-gray,#6B6860)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-ink,#0E0E0E)] animate-ping" />
          <span>Opening upcycling blueprint...</span>
        </div>
      </div>
    );
  }

  const { result, originalImageDataUrl, uploadedAt } = data;

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* 1. Header */}
      <ResultHeader result={result} />

      {/* 2. Before / After Comparison Slider */}
      <Reveal delay={0.2} yOffset={20}>
        <section aria-label="Garment visual redesign preview">
          <CompareSlider
            originalImage={originalImageDataUrl}
            previewImage={result.preview_image_url}
            garmentType={result.garment_type}
          />
        </section>
      </Reveal>

      {/* 3. Two-Column Editorial Details */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        {/* Left Column: Diagnostics & Materials (Sticky on Desktop) */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          <Reveal delay={0.25} yOffset={20}>
            <DamageNote detectedDamage={result.detected_damage} />
          </Reveal>

          <Reveal delay={0.3} yOffset={20}>
            <MaterialsList
              materials={result.materials_needed}
              uploadedAt={uploadedAt}
            />
          </Reveal>
        </div>

        {/* Right Column: Step-by-Step Upcycling Blueprint */}
        <div className="lg:col-span-7">
          <Reveal delay={0.35} yOffset={20}>
            <RepairTimeline
              steps={result.upcycling_steps}
              uploadedAt={uploadedAt}
            />
          </Reveal>
        </div>
      </section>

      {/* 4. Footer Actions */}
      <Reveal delay={0.4}>
        <ResultActions />
      </Reveal>
    </div>
  );
}
