"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 py-4 sm:py-5 px-4 sm:px-8">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3 rounded-full transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(255,255,255,0.85)] backdrop-blur-md border border-[rgba(14,14,14,0.1)] shadow-sm shadow-black/5"
            : "glass"
        }`}
      >
        {/* Editorial Wordmark */}
        <Link
          href="/"
          className="font-editorial text-2xl sm:text-3xl tracking-tight text-[#0E0E0E] hover:opacity-80 transition-opacity"
        >
          ReWear
        </Link>

        {/* Desktop Links & Action */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-mono text-[#6B6860]">
          <Link
            href="/#how-it-works"
            className="hover:text-[#0E0E0E] transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/upload"
            className="hover:text-[#0E0E0E] transition-colors"
          >
            Try it
          </Link>
        </nav>

        <div className="hidden md:flex items-center">
          <Link href="/upload">
            <Button size="sm" className="gap-2 text-xs font-mono tracking-wider uppercase">
              <span>Upload a garment</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/upload">
            <Button size="sm" className="h-8 text-xs px-3">
              Upload
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0E0E0E] focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-2 p-6 glass rounded-3xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl space-y-4">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono uppercase tracking-wider text-[#0E0E0E] py-2"
          >
            How it works
          </Link>
          <Link
            href="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono uppercase tracking-wider text-[#0E0E0E] py-2"
          >
            Try it
          </Link>
          <div className="pt-2">
            <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-between">
                <span>Upload a garment</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
