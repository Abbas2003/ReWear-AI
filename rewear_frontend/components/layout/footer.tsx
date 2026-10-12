import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(14,14,14,0.12)] py-12 px-6 sm:px-12 bg-transparent text-[#6B6860] text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-baseline justify-between gap-6">
        <div>
          <Link
            href="/"
            className="font-editorial text-2xl text-[#0E0E0E] block mb-2 hover:opacity-80 transition-opacity"
          >
            ReWear
          </Link>
          <p className="max-w-sm text-neutral-500 font-sans leading-relaxed">
            Quiet AI architecture for circular garments and sustainable wardrobes.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-[11px] text-[#6B6860]">
          <span>&copy; 2026 ReWear</span>
        </div>
      </div>
    </footer>
  );
}
