/**
 * Cleroy Engineering Premium Motion System
 * Apple, Linear, Stripe & Awwwards-grade motion curves and Framer Motion presets.
 */

// Premium Easing Curves
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const; // Ultra-smooth Apple-like easeOutExpo
export const EASE_SMOOTH = [0.25, 1, 0.5, 1] as const; // Natural fluid ease
export const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1] as const; // Gentle acceleration & deceleration
export const EASE_BOUNCE_SOFT = [0.34, 1.56, 0.64, 1] as const; // Micro bounce for UI triggers

// Spring Configurations
export const SPRING_PREMIUM = { type: "spring", stiffness: 360, damping: 28, mass: 0.8 };
export const SPRING_SNAPPY = { type: "spring", stiffness: 420, damping: 26 };
export const SPRING_GENTLE = { type: "spring", stiffness: 220, damping: 28 };

// Standard Timings (in seconds)
export const DURATION_FAST = 0.16; // Button presses, micro-interactions
export const DURATION_HOVER = 0.24; // Hover lifts, icon slides, border glows
export const DURATION_CARD = 0.36; // Bento cards, dropdowns, popovers
export const DURATION_SECTION = 0.68; // Scroll section reveals, content blocks
export const DURATION_HERO = 0.88; // Hero reveals, cinematic transitions

// Shared Reusable Variants
export const fadeIn = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: (custom: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_SECTION,
      delay: custom * 0.08,
      ease: EASE_EXPO,
    },
  }),
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_SECTION,
      delay: custom * 0.08,
      ease: EASE_EXPO,
    },
  }),
};

/** Adaptive Framer Motion Variant Generators */
export const getAdaptiveFadeInUp = (tier: "desktop" | "tablet" | "mobile" | "low-end") => {
  const isMobileOrLow = tier === "mobile" || tier === "low-end";
  const isTablet = tier === "tablet";

  return {
    hidden: { 
      opacity: 0, 
      y: isMobileOrLow ? 10 : isTablet ? 18 : 28, 
      filter: isMobileOrLow ? "none" : "blur(6px)" 
    },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration: isMobileOrLow ? 0.35 : isTablet ? 0.5 : DURATION_SECTION,
        delay: custom * (isMobileOrLow ? 0.03 : isTablet ? 0.05 : 0.08),
        ease: EASE_EXPO,
      },
    }),
  };
};

export const getAdaptiveStaggerContainer = (tier: "desktop" | "tablet" | "mobile" | "low-end") => {
  const isMobileOrLow = tier === "mobile" || tier === "low-end";
  const isTablet = tier === "tablet";

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobileOrLow ? 0.03 : isTablet ? 0.05 : 0.08,
        delayChildren: 0.02,
      },
    },
  };
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const hoverLiftCard = {
  rest: {
    y: 0,
    scale: 1,
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  hover: {
    y: -6,
    scale: 1.01,
    shadow: "0 20px 40px rgba(212,90,18,0.15)",
    borderColor: "rgba(212,90,18,0.35)",
    transition: {
      duration: DURATION_HOVER,
      ease: EASE_EXPO,
    },
  },
};
