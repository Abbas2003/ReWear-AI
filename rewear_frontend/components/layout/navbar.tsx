"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close all menus when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close expanded navbar on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Lock body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ==================== COMPACT NAVBAR (Default) ==================== */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-40 py-4 sm:py-5 px-4 sm:px-8 flex justify-center pointer-events-none"
          >
            <motion.div
              layoutId="navbar-shell"
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              }}
              className={`pointer-events-auto inline-flex items-center gap-2 sm:gap-3 px-2 py-2 rounded-full ${isScrolled
                  ? "bg-white border border-black/10 shadow-lg shadow-black/5"
                  : "bg-white/90 border border-black/5 shadow-md shadow-black/5"
                }`}
            >
              {/* Logo */}
              <Link
                href="/"
                className="font-editorial text-xl sm:text-2xl tracking-tight text-[#0E0E0E] hover:opacity-80 transition-opacity px-3"
              >
                ReWear
              </Link>

              {/* Divider */}
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="w-px h-5 bg-black/10"
                aria-hidden="true"
              />

              {/* Upload Button */}
              <Link href="/upload">
                <Button
                  size="sm"
                  className="gap-1.5 text-[11px] font-mono tracking-wider uppercase h-9 rounded-full px-4"
                >
                  <span className="hidden sm:inline">Upload a garment</span>
                  <span className="sm:hidden">Upload</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                    className="inline-flex"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Button>
              </Link>

              {/* Hamburger */}
              <motion.button
                type="button"
                onClick={toggleExpanded}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-full text-[#0E0E0E] hover:bg-black/5 transition-colors focus:outline-none"
                aria-label="Expand navigation"
                aria-expanded={isExpanded}
              >
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                >
                  <Menu className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ==================== EXPANDED NAVBAR (Full Width) ==================== */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop — NO BLUR, sirf halka dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/5"
              onClick={() => setIsExpanded(false)}
              aria-hidden="true"
            />

            <motion.header
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-5 px-4 sm:px-8"
            >
              <motion.div
                layoutId="navbar-shell"
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 32,
                  mass: 0.8,
                }}
                className={`max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3 rounded-full ${isScrolled
                    ? "bg-white border border-black/10 shadow-lg shadow-black/5"
                    : "bg-white border border-black/5 shadow-md shadow-black/5"
                  }`}
              >
                {/* Editorial Wordmark */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link
                    href="/"
                    onClick={() => setIsExpanded(false)}
                    className="font-editorial text-2xl sm:text-3xl tracking-tight text-[#0E0E0E] hover:opacity-80 transition-opacity"
                  >
                    ReWear
                  </Link>
                </motion.div>

                {/* Desktop Links */}
                <motion.nav
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.15,
                      },
                    },
                  }}
                  className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-mono text-[#6B6860]"
                >
                  {[
                    { href: "/#how-it-works", label: "How it works" },
                    { href: "/upload", label: "Try it" },
                  ].map((item) => (
                    <motion.div
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, y: -8 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsExpanded(false)}
                        className="relative hover:text-[#0E0E0E] transition-colors group"
                      >
                        {item.label}
                        {/* Underline animation on hover */}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#0E0E0E] group-hover:w-full transition-all duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* Desktop CTA + Close */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="hidden md:flex items-center gap-2"
                >
                  <Link href="/upload" onClick={() => setIsExpanded(false)}>
                    <Button
                      size="sm"
                      className="gap-2 text-xs font-mono tracking-wider uppercase rounded-full"
                    >
                      <span>Upload a garment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>

                  <motion.button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="p-2 rounded-full text-[#0E0E0E] hover:bg-black/5 transition-colors focus:outline-none"
                    aria-label="Collapse navigation"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-2">
                  <Link href="/upload" onClick={() => setIsExpanded(false)}>
                    <Button size="sm" className="h-8 text-xs px-3 rounded-full">
                      Upload
                    </Button>
                  </Link>
                  <motion.button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-[#0E0E0E] focus:outline-none"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                  >
                    <motion.div
                      animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mobileMenuOpen ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Menu className="w-5 h-5" />
                      )}
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Mobile Drawer */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="md:hidden mt-3 mx-1 sm:mx-2 overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 bg-white border border-black/10 rounded-2xl sm:rounded-3xl shadow-lg">
                      <motion.nav
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: {},
                          visible: {
                            transition: {
                              staggerChildren: 0.06,
                              delayChildren: 0.05,
                            },
                          },
                        }}
                        className="flex flex-col space-y-1"
                      >
                        {[
                          { href: "/#how-it-works", label: "How it works" },
                          { href: "/upload", label: "Try it" },
                        ].map((item) => (
                          <motion.div
                            key={item.href}
                            variants={{
                              hidden: { opacity: 0, x: -10 },
                              visible: { opacity: 1, x: 0 },
                            }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setIsExpanded(false);
                              }}
                              className="block text-sm font-mono uppercase tracking-wider text-[#0E0E0E] py-3 px-2 rounded-lg hover:bg-black/5 transition-colors"
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.nav>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="pt-4 mt-2 border-t border-black/10"
                      >
                        <Link
                          href="/upload"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIsExpanded(false);
                          }}
                        >
                          <Button className="w-full justify-between h-11 rounded-full">
                            <span>Upload a garment</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.header>
          </>
        )}
      </AnimatePresence>
    </>
  );
}