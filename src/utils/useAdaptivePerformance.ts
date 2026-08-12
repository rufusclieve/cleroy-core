import { useState, useEffect } from "react";

export type DeviceTier = "desktop" | "tablet" | "mobile" | "low-end";

export interface PerformanceConfig {
  tier: DeviceTier;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  particleMultiplier: number;
  blurEnabled: boolean;
  shadowBlurMultiplier: number;
  staggerDelay: number;
  glowIntensity: number;
  maxParticles: (desktopCount: number) => number;
}

export function getDevicePerformanceConfig(): PerformanceConfig {
  if (typeof window === "undefined") {
    // Default SSR / initial fallback
    return {
      tier: "desktop",
      isDesktop: true,
      isTablet: false,
      isMobile: false,
      isLowEnd: false,
      prefersReducedMotion: false,
      particleMultiplier: 1.0,
      blurEnabled: true,
      shadowBlurMultiplier: 1.0,
      staggerDelay: 0.08,
      glowIntensity: 1.0,
      maxParticles: (count: number) => count,
    };
  }

  const width = window.innerWidth;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hardwareConcurrency = navigator.hardwareConcurrency || 8;
  // @ts-ignore - deviceMemory is available in Chrome/Edge
  const deviceMemory = navigator.deviceMemory || 8;

  const isLowEndHardware = hardwareConcurrency <= 2 || deviceMemory <= 2;

  let tier: DeviceTier = "desktop";

  if (prefersReducedMotion || isLowEndHardware) {
    tier = "low-end";
  } else if (width < 768) {
    tier = "mobile";
  } else if (width < 1024) {
    tier = "tablet";
  } else {
    tier = "desktop";
  }

  const isDesktop = tier === "desktop";
  const isTablet = tier === "tablet";
  const isMobile = tier === "mobile";
  const isLowEnd = tier === "low-end";

  let particleMultiplier = 1.0;
  let shadowBlurMultiplier = 1.0;
  let glowIntensity = 1.0;
  let staggerDelay = 0.08;
  let blurEnabled = true;

  if (isTablet) {
    particleMultiplier = 0.7;
    shadowBlurMultiplier = 0.5;
    glowIntensity = 0.75;
    staggerDelay = 0.06;
    blurEnabled = true;
  } else if (isMobile) {
    particleMultiplier = 0.3;
    shadowBlurMultiplier = 0.0;
    glowIntensity = 0.35;
    staggerDelay = 0.03;
    blurEnabled = false;
  } else if (isLowEnd) {
    particleMultiplier = 0.2;
    shadowBlurMultiplier = 0.0;
    glowIntensity = 0.2;
    staggerDelay = 0.02;
    blurEnabled = false;
  }

  return {
    tier,
    isDesktop,
    isTablet,
    isMobile,
    isLowEnd,
    prefersReducedMotion,
    particleMultiplier,
    blurEnabled,
    shadowBlurMultiplier,
    staggerDelay,
    glowIntensity,
    maxParticles: (desktopCount: number) =>
      Math.max(2, Math.round(desktopCount * particleMultiplier)),
  };
}

export function useAdaptivePerformance(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>(getDevicePerformanceConfig);

  useEffect(() => {
    const handleResize = () => {
      setConfig(getDevicePerformanceConfig());
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      setConfig(getDevicePerformanceConfig());
    };

    window.addEventListener("resize", handleResize, { passive: true });
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMotionChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMotionChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return config;
}
