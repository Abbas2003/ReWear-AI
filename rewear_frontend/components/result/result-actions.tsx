"use client";

import React from "react";
import Link from "next/link";
import { Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResultActions() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-[var(--color-hairline,rgba(14,14,14,0.12))] no-print">
      <Link href="/upload">
        <button
          type="button"
          className="min-h-[44px] px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[var(--color-gray,#6B6860)] hover:text-[var(--color-ink,#0E0E0E)] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try another garment</span>
        </button>
      </Link>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handlePrint}
          className="min-h-[44px] px-6 text-xs font-mono uppercase tracking-wider gap-2.5"
        >
          <Printer className="w-4 h-4" />
          <span>Save as PDF</span>
        </Button>
      </div>
    </footer>
  );
}
