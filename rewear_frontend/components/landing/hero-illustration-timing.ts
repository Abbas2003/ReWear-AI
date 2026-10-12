/**
 * Timing constants for the hero vector animation "Tear to Reborn".
 * A continuous 8-second cyclical story divided into 5 clear beats.
 */

export const HERO_ANIMATION_TIMING = {
  duration: 8, // total seconds per cycle
  repeatDelay: 0.4, // subtle pause before repeating

  // Normalized keyframe milestones (0 to 1)
  phases: {
    start: 0,
    scanStart: 0.22,
    scanEnd: 0.45,
    repairStart: 0.44,
    repairEnd: 0.68,
    rebornStart: 0.68,
    rebornEnd: 0.9,
    fadeOut: 0.95,
    reset: 1.0,
  },

  // Easing presets
  ease: {
    smooth: [0.16, 1, 0.3, 1] as const,
    linear: "linear" as const,
  },
} as const;

export type HeroAnimationTiming = typeof HERO_ANIMATION_TIMING;
