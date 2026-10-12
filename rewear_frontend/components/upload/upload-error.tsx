"use client";

import React from "react";
import { AlertCircle, RefreshCw, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadErrorProps {
  message: string;
  hint?: string;
  onRetry: () => void;
  onShowDemo: () => void;
}

export default function UploadError({
  message,
  hint,
  onRetry,
  onShowDemo,
}: UploadErrorProps) {
  return (
    <div
      role="alert"
      className="w-full glass rounded-2xl p-6 border border-neutral-300 space-y-4 animate-shake"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#0E0E0E] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-[#0E0E0E]">
            Analysis Notice
          </h4>
          <p className="text-xs text-[#6B6860] leading-relaxed">{message}</p>
          {hint && (
            <p className="text-[11px] font-mono text-[#6B6860] pt-1">
              {hint}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          size="sm"
          onClick={onRetry}
          className="gap-2 text-xs font-mono tracking-wider uppercase h-9"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Try again</span>
        </Button>

        <button
          type="button"
          onClick={onShowDemo}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#0E0E0E] underline underline-offset-4 hover:text-[#6B6860] cursor-pointer py-1.5"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Show demo result instead</span>
        </button>
      </div>
    </div>
  );
}
