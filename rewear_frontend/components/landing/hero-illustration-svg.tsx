"use client";

import React from "react";
import { motion } from "motion/react";
import { HERO_ANIMATION_TIMING } from "./hero-illustration-timing";

interface HeroIllustrationSvgProps {
  reducedMotion: boolean;
  isPlaying: boolean;
}

export function HeroIllustrationSvg({ reducedMotion, isPlaying }: HeroIllustrationSvgProps) {
  const { duration } = HERO_ANIMATION_TIMING;

  // Static fallback for reduced motion
  if (reducedMotion) {
    return (
      <svg
        viewBox="0 0 380 430"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[380px] select-none text-[var(--color-ink,#0E0E0E)]"
        aria-hidden="true"
      >
        {/* Jacket outline */}
        <path
          d="M 150 90 Q 190 108 230 90 L 275 112 C 285 140, 296 175, 298 220 L 305 250 L 275 255 L 255 190 L 255 330 Q 190 338 125 330 L 125 190 L 105 255 L 75 250 C 78 205, 88 150, 105 112 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M 190 100 L 190 334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 140 160 L 170 160" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Subtle closed seam */}
        <path d="M 295 180 L 298 215" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity={0.4} />

        {/* Botanical embroidery motif */}
        <path
          d="M 298 215 C 302 200, 294 185, 298 170 M 298 190 Q 308 185 306 178 Q 298 185 298 190 M 298 198 Q 288 194 290 186 Q 298 192 298 198"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Reborn pill */}
        <g transform="translate(250, 140)">
          <rect width="68" height="20" rx="10" fill="white" stroke="currentColor" strokeWidth="1" opacity={0.8} />
          <text x="34" y="13" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace" letterSpacing="0.05em">
            Reborn
          </text>
        </g>
      </svg>
    );
  }

  // Animation timeline configuration
  const animateState = isPlaying ? "animate" : "initial";

  return (
    <svg
      viewBox="0 0 380 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[380px] select-none text-[var(--color-ink,#0E0E0E)]"
      aria-hidden="true"
    >
      {/* Whole garment group with gentle lift on beat 4 */}
      <motion.g
        variants={{
          initial: { y: 0 },
          animate: {
            y: [0, 0, 0, 0, -8, -8, 0],
            transition: {
              duration,
              repeat: Infinity,
              times: [0, 0.45, 0.66, 0.72, 0.8, 0.9, 0.98],
              ease: "easeInOut",
            },
          },
        }}
        initial="initial"
        animate={animateState}
      >
        {/* Beat 1: Main Jacket Outline */}
        <motion.path
          d="M 150 90 Q 190 108 230 90 L 275 112 C 285 140, 295 160, 295 175 L 305 185 L 292 196 L 306 208 L 298 222 L 305 250 L 275 255 L 255 190 L 255 330 Q 190 338 125 330 L 125 190 L 105 255 L 75 250 C 78 205, 88 150, 105 112 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            initial: { pathLength: 0, opacity: 0 },
            animate: {
              pathLength: [0, 1, 1, 1, 1, 0],
              opacity: [0, 1, 1, 1, 0.2, 0],
              transition: {
                duration,
                repeat: Infinity,
                times: [0, 0.22, 0.88, 0.94, 0.98, 1],
                ease: "easeInOut",
              },
            },
          }}
          initial="initial"
          animate={animateState}
        />

        {/* Center Placket Seam */}
        <motion.path
          d="M 190 100 L 190 334"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={{
            initial: { pathLength: 0 },
            animate: {
              pathLength: [0, 1, 1, 0],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.1, 0.24, 0.92, 0.98],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        />

        {/* Loose thread hanging from tear */}
        <motion.path
          d="M 306 208 Q 324 214 318 228"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          variants={{
            initial: { pathLength: 0, opacity: 0 },
            animate: {
              pathLength: [0, 1, 1, 0, 0],
              opacity: [0, 1, 1, 0, 0],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.14, 0.24, 0.44, 0.5, 1],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        />

        {/* Beat 2: Scan Beam */}
        <motion.line
          x1="60"
          y1="0"
          x2="320"
          y2="0"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 2"
          variants={{
            initial: { y: 70, opacity: 0 },
            animate: {
              y: [70, 80, 330, 340, 70],
              opacity: [0, 0.85, 0.85, 0, 0],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.22, 0.25, 0.42, 0.45, 1],
                ease: "linear",
              },
            },
          }}
          initial="initial"
          animate={animateState}
        />

        {/* Beat 2: Corner Brackets around tear */}
        <motion.g
          variants={{
            initial: { opacity: 0, scale: 0.9 },
            animate: {
              opacity: [0, 1, 1, 0, 0],
              scale: [0.92, 1, 1, 0.95, 0.92],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.25, 0.29, 0.44, 0.47, 1],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        >
          {/* Top-left */}
          <path d="M 282 178 L 282 170 L 290 170" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          {/* Top-right */}
          <path d="M 320 170 L 328 170 L 328 178" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          {/* Bottom-left */}
          <path d="M 282 222 L 282 230 L 290 230" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          {/* Bottom-right */}
          <path d="M 320 230 L 328 230 L 328 222" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </motion.g>

        {/* Beat 2: Label "Damage found" */}
        <motion.g
          variants={{
            initial: { opacity: 0, y: 4 },
            animate: {
              opacity: [0, 1, 1, 0, 0],
              y: [4, 0, 0, -3, 4],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.27, 0.31, 0.43, 0.46, 1],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        >
          <rect x="238" y="148" width="94" height="20" rx="10" fill="white" stroke="currentColor" strokeWidth="1" opacity={0.9} />
          <text x="285" y="161" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace" letterSpacing="0.04em">
            Damage found
          </text>
        </motion.g>

        {/* Beat 3: Stitches closing the tear */}
        <motion.g
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: [0, 0, 1, 1, 0, 0],
              transition: {
                duration,
                repeat: Infinity,
                times: [0, 0.44, 0.48, 0.88, 0.94, 1],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        >
          <motion.path
            d="M 292 180 L 306 186 M 294 192 L 308 198 M 291 204 L 305 210 M 293 216 L 307 222"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            variants={{
              initial: { pathLength: 0 },
              animate: {
                pathLength: [0, 0, 1, 1, 0],
                transition: {
                  duration,
                  repeat: Infinity,
                  times: [0, 0.46, 0.62, 0.9, 0.96],
                },
              },
            }}
            initial="initial"
            animate={animateState}
          />
        </motion.g>

        {/* Beat 3: Label "Repair planned" */}
        <motion.g
          variants={{
            initial: { opacity: 0, y: 4 },
            animate: {
              opacity: [0, 1, 1, 0, 0],
              y: [4, 0, 0, -3, 4],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.47, 0.51, 0.63, 0.67, 1],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        >
          <rect x="234" y="148" width="98" height="20" rx="10" fill="white" stroke="currentColor" strokeWidth="1" opacity={0.9} />
          <text x="283" y="161" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace" letterSpacing="0.04em">
            Repair planned
          </text>
        </motion.g>

        {/* Beat 4: Botanical embroidery motif */}
        <motion.g
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: [0, 0, 1, 1, 0],
              transition: {
                duration,
                repeat: Infinity,
                times: [0, 0.67, 0.72, 0.92, 0.98],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        >
          <motion.path
            d="M 298 226 C 302 208, 294 190, 298 174 M 298 196 Q 310 190 307 182 Q 298 188 298 196 M 298 206 Q 286 200 289 192 Q 298 198 298 206 M 298 174 L 298 170 M 296 172 L 300 172"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              initial: { pathLength: 0 },
              animate: {
                pathLength: [0, 0, 1, 1, 0],
                transition: {
                  duration,
                  repeat: Infinity,
                  times: [0, 0.68, 0.82, 0.92, 0.98],
                  ease: "easeInOut",
                },
              },
            }}
            initial="initial"
            animate={animateState}
          />
        </motion.g>

        {/* Beat 4: Label "Reborn" */}
        <motion.g
          variants={{
            initial: { opacity: 0, y: 4 },
            animate: {
              opacity: [0, 1, 1, 0, 0],
              y: [4, 0, 0, -3, 4],
              transition: {
                duration,
                repeat: Infinity,
                times: [0.69, 0.73, 0.9, 0.94, 1],
              },
            },
          }}
          initial="initial"
          animate={animateState}
        >
          <rect x="256" y="148" width="66" height="20" rx="10" fill="white" stroke="currentColor" strokeWidth="1" opacity={0.9} />
          <text x="289" y="161" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace" letterSpacing="0.04em">
            Reborn
          </text>
        </motion.g>
      </motion.g>
    </svg>
  );
}
