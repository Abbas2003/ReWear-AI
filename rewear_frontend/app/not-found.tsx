import React from "react";
import Link from "next/link";
import { Scissors, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-36 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[300px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-md w-full mx-auto text-center p-8 sm:p-10 rounded-3xl glass-panel-glow border-emerald-500/30">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6">
          <Scissors className="w-8 h-8 text-emerald-400 -rotate-45" />
        </div>

        <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
          Error 404 &bull; Pattern Not Found
        </span>

        <h1 className="text-3xl font-extrabold text-white font-heading mt-2 mb-3">
          Loose Thread
        </h1>

        <p className="text-sm text-neutral-300 leading-relaxed mb-8">
          The page or garment blueprint you are looking for has unraveled or doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="default" className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </Button>
          </Link>
          <Link href="/upload" className="w-full sm:w-auto">
            <Button variant="secondary" size="default" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Upload Garment</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
