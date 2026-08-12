import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import CleroyLogo from "./CleroyLogo";

interface PreloaderProps {
  phase: "loading" | "completed" | "transitioning" | "done";
  onPhaseChange: (phase: "loading" | "completed" | "transitioning" | "done") => void;
  isScrolled?: boolean;
}

export default function Preloader({ phase, onPhaseChange, isScrolled = false }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Smooth continuous progress ticker (0% to 100%)
  useEffect(() => {
    let rAFId: number;
    const startTime = performance.now();
    const duration = 3600; // 3.6 seconds smooth boot duration

    let displayed = 0;

    const updateBootProgress = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const rawRatio = Math.min(1.0, elapsed / duration);
      
      // Smooth power easing profile
      const easedRatio = Math.pow(rawRatio, 1.05);
      const target = Math.min(100, Math.floor(easedRatio * 100));

      if (displayed < target) {
        // Interpolate smoothly: advance by step proportional to distance, min 1
        const step = Math.max(1, Math.min(3, Math.floor((target - displayed) * 0.25)));
        displayed = Math.min(target, displayed + step);
      } else if (rawRatio >= 1.0 && displayed < 100) {
        displayed = 100;
      }

      setProgress(displayed);

      if (displayed >= 100 && rawRatio >= 1.0) {
        setProgress(100);
        setIsReady(true);
      } else {
        rAFId = requestAnimationFrame(updateBootProgress);
      }
    };

    rAFId = requestAnimationFrame(updateBootProgress);
    return () => cancelAnimationFrame(rAFId);
  }, []);

  const handleLogoClick = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isReady && (phase === "loading" || phase === "completed")) {
      sessionStorage.setItem("cleroy_boot_completed", "true");
      onPhaseChange("transitioning");
    }
  };

  const isOverlayActive = phase === "loading" || phase === "completed";

  // Circle radius = 85, Circumference = 2 * PI * 85 = 534.07
  const circumference = 534.07;
  const strokeOffset = circumference * (1 - progress / 100);
  const glowAmount = (progress / 100) * 24;
  const brightnessAmount = 1 + (progress / 100) * 0.2;

  return (
    <div id="preloader-root">
      {phase !== "done" && (
        <motion.div
          id="preloader-overlay"
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: isOverlayActive ? 1 : 0,
            pointerEvents: isOverlayActive ? "auto" : "none"
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 flex flex-col justify-between bg-[#050505] p-6 sm:p-10 select-none overflow-hidden"
        >
          {/* TOP MARGIN METADATA */}
          <motion.div 
            style={{ opacity: isOverlayActive ? 1 : 0, transition: "opacity 0.25s ease-out" }}
            className="w-full flex justify-between items-center text-[#737373] font-mono text-[9px] tracking-[0.3em] uppercase z-10" 
            id="preloader-header"
          >
            <span>CLEROY / STUDIO</span>
            <span>EDITION 2026</span>
          </motion.div>

          {/* CENTER COMPOSITION: Logo and rotating stroke */}
          <div className="relative flex flex-col items-center justify-center self-center" id="preloader-center-group">
            <div className="relative flex items-center justify-center w-52 h-52">
              
              {/* Outer thin ring - animated stroke based on progress */}
              <motion.svg
                className="absolute w-44 h-44 pointer-events-none -rotate-90"
                viewBox="0 0 200 200"
                style={{ opacity: isOverlayActive ? 1 : 0, transition: "opacity 0.25s ease-out" }}
              >
                {/* Dark background track ring */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="85" 
                  stroke="#262626" 
                  strokeWidth="1" 
                  fill="none" 
                />
                {/* Active burnt-orange progress ring */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="85" 
                  stroke="#D45A12" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.05s linear" }}
                />
              </motion.svg>

              {/* Logo icon - interactive click when 100% ready */}
              {isOverlayActive && (
                <motion.div
                  layoutId="shared-logo-icon"
                  className={`w-[84px] h-[84px] flex items-center justify-center relative z-10 touch-manipulation ${
                    isReady ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={handleLogoClick}
                  onTouchEnd={handleLogoClick}
                  whileHover={isReady ? {
                    scale: 1.08,
                    filter: "brightness(1.25) drop-shadow(0 0 22px rgba(212, 90, 18, 0.75))",
                  } : {}}
                  whileTap={isReady ? { scale: 0.95 } : {}}
                  animate={{
                    scale: isReady ? [1, 1.05, 1] : 1,
                    filter: `brightness(${brightnessAmount}) drop-shadow(0 0 ${glowAmount}px rgba(212, 90, 18, ${(progress / 100) * 0.9}))`,
                  }}
                  transition={{
                    layout: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                    scale: isReady ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.2 },
                  }}
                  style={{ willChange: "transform" }}
                >
                  <CleroyLogo size="full" withGlow={true} hideText={true} />
                </motion.div>
              )}
            </div>

            {/* Sub-label under logo */}
            <motion.span 
              style={{ opacity: isOverlayActive ? 1 : 0, transition: "opacity 0.25s ease-out" }}
              className={`font-mono text-[9px] sm:text-[10px] tracking-[0.5em] uppercase mt-3 font-medium text-center transition-colors duration-300 ${
                isReady ? "text-[#D45A12] animate-pulse" : "text-[#888888]"
              }`}
            >
              {!isReady ? "INITIALIZING SYSTEM..." : "SYSTEM READY"}
            </motion.span>
          </div>

          {/* BOTTOM MARGIN METADATA */}
          <motion.div 
            style={{ opacity: isOverlayActive ? 1 : 0, transition: "opacity 0.25s ease-out" }}
            className="w-full flex justify-between items-end z-10" 
            id="preloader-footer"
          >
            {/* Bottom Left: Status Label */}
            <span className={`font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase pb-2 transition-colors duration-300 ${
              isReady ? "text-[#D45A12] font-semibold animate-pulse" : "text-[#737373]"
            }`}>
              {!isReady 
                ? `BOOT SEQUENCE IN PROGRESS... [${progress}%]` 
                : "SYSTEM READY — CLICK CLEROY LOGO TO COMMENCE"
              }
            </span>

            {/* Bottom Right: Clean percentage tracker (integer 0% to 100%) */}
            <div className="flex items-end leading-none font-sans" id="preloader-percentage-container">
              <span className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-[#F5EFE7]">
                {progress}
              </span>
              <span className="text-base sm:text-lg text-[#D45A12] font-semibold tracking-wide ml-1 pb-1 sm:pb-2">
                %
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

