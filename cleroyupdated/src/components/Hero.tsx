import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import heroChess from "../assets/hero-chess.webp";
import CleroyButton from "./CleroyButton";

// Seeded deterministic pseudo-random function to ensure consistent layouts across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Helper to calculate cumulative angle for smooth, continuous vortex spin
function getCumulativeAngle(t: number, direction: number, seedSpeedFactor: number) {
  let baseAngle = 0;
  
  if (t < 0.3) {
    // Phase 1 (Slow Start): Speed begins at 60%, ramping up to 100% at t=0.3
    const p = t / 0.3;
    baseAngle = 0.6 * t + 0.5 * (0.4 / 0.3) * t * t;
  } else if (t < 0.6) {
    // Phase 2 (Energetic Spin): Speed remains at 100% (1.0)
    const angle_at_03 = 0.6 * 0.3 + 0.5 * (0.4 / 0.3) * 0.09; // 0.24
    baseAngle = angle_at_03 + (t - 0.3) * 1.0;
  } else {
    // Phase 3 (Decelerating): Speed ramps down to 40% (0.4) at t=1.0
    const angle_at_03 = 0.6 * 0.3 + 0.5 * (0.4 / 0.3) * 0.09; // 0.24
    const angle_at_06 = angle_at_03 + 0.3 * 1.0; // 0.54
    const p = (t - 0.6) / 0.4;
    baseAngle = angle_at_06 + (t - 0.6) * 1.0 - 0.5 * (0.6 / 0.4) * (t - 0.6) * (t - 0.6);
  }

  // Scale baseAngle so that at t = 0.6 (completion of two full phases),
  // a baseline letter completes exactly two full rotations (4 * Math.PI radians)
  const angle_at_06 = 0.54;
  const scaleFactor = (4 * Math.PI) / angle_at_06;

  return baseAngle * scaleFactor * direction * seedSpeedFactor;
}

// 1. Forward Assembly Animation Math
function getForwardTransform(globalIndex: number, group: number, t: number, scaleFactor: number = 1.0) {
  if (t >= 1.0) {
    return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
  }

  const rand = (offset: number) => seededRandom(globalIndex * 19.87 + offset);

  // 8 concentric orbital rings (0 to 7) scaled by screen scaleFactor
  const ringIndex = globalIndex % 8;
  const baseRadius = (120 + ringIndex * 24) * scaleFactor; // Concentric spacing responsive
  
  // Alternating orbital directions (clockwise / counter-clockwise)
  const direction = ringIndex % 2 === 0 ? 1 : -1;
  
  // Varying speeds for different orbit rings
  const seedSpeedFactor = 0.8 + (ringIndex % 3) * 0.25; // 0.8 to 1.3

  // Core center of the vortex relative to each character's final coordinate
  const cx = (-140 + rand(8) * 100) * scaleFactor;
  const cy = (30 + rand(9) * 60) * scaleFactor;

  // Compute the current continuous orbital angle
  const orbitAngle = getCumulativeAngle(t, direction, seedSpeedFactor);

  // Slow radial wave oscillation: letters drift organically between nearby rings
  const radialOscillation = Math.sin(t * Math.PI * 4 + ringIndex * 1.5) * 12 * scaleFactor;
  const currentRadius = baseRadius + radialOscillation;

  // Coordinates of character inside the active vortex
  const x_vortex = cx + currentRadius * Math.cos(orbitAngle);
  const y_vortex = cy + currentRadius * Math.sin(orbitAngle);
  const rot_vortex = (rand(5) - 0.5) * 120 + orbitAngle * (180 / Math.PI) * 0.25;
  const scale_vortex = 0.55 + rand(6) * 0.25;
  const opacity_vortex = 0.25 + rand(7) * 0.5;

  // Stagger releases inside Phase 3 (t >= 0.6)
  // Release schedule for the 5 groups:
  const groupStartSchedule = [0.60, 0.66, 0.72, 0.78, 0.84];
  const groupStart = groupStartSchedule[group];
  const indexStagger = (globalIndex % 15) * 0.003;
  const t_release = Math.min(0.92, groupStart + indexStagger);
  const t_flight = 0.14; // Duration of flight to final place

  if (t < t_release) {
    // Stage 1/2/3: Still orbiting inside the magnetic vortex field
    return { x: x_vortex, y: y_vortex, rotate: rot_vortex, scale: scale_vortex, opacity: opacity_vortex };
  } else {
    // Stage 4: Gently peel away and fly along a curved trajectory to the lock point (0, 0)
    const f = (t - t_release) / t_flight;
    if (f >= 1.0) {
      return { x: 0, y: 0, rotate: 0, scale: 1.0, opacity: 1.0 };
    } else {
      // Calculate exact state at the release instant (prevents any visual jumps/snapping)
      const releaseAngle = getCumulativeAngle(t_release, direction, seedSpeedFactor);
      const releaseRadialOscillation = Math.sin(t_release * Math.PI * 4 + ringIndex * 1.5) * 12 * scaleFactor;
      const releaseRadius = baseRadius + releaseRadialOscillation;
      
      const x_release = cx + releaseRadius * Math.cos(releaseAngle);
      const y_release = cy + releaseRadius * Math.sin(releaseAngle);
      const rot_release = (rand(5) - 0.5) * 120 + releaseAngle * (180 / Math.PI) * 0.25;
      const scale_release = scale_vortex;
      const opacity_release = opacity_vortex;

      // Cubic Ease-Out for luxurious deceleration near destination
      const ease = 1 - Math.pow(1 - f, 3.5);

      // Arc curve offset
      const arcFactor = Math.sin(f * Math.PI);
      const arcX = (rand(12) - 0.5) * 60 * scaleFactor * (1.0 - f);
      const arcY = (rand(13) - 0.5) * 60 * scaleFactor * (1.0 - f);

      const dx = x_release * (1 - ease) + arcX * arcFactor;
      const dy = y_release * (1 - ease) + arcY * arcFactor;
      const rot = rot_release * (1 - ease);
      const scale = scale_release * (1 - ease) + 1.0 * ease;
      const opacity = opacity_release * (1 - ease) + 1.0 * ease;

      return { x: dx, y: dy, rotate: rot, scale, opacity };
    }
  }
}

// 2. Reverse Peeling Vortex Math
function getReverseTransform(globalIndex: number, group: number, t_rev: number, scaleFactor: number = 1.0) {
  if (t_rev >= 1.0) {
    return { x: 0, y: 0, rotate: 0, scale: 0.5, opacity: 0 };
  }

  const rand = (offset: number) => seededRandom(globalIndex * 19.87 + offset);

  // Concentric orbit parameters
  const ringIndex = globalIndex % 8;
  const baseRadius = (120 + ringIndex * 24) * scaleFactor;
  const direction = ringIndex % 2 === 0 ? 1 : -1;
  const seedSpeedFactor = 0.8 + (ringIndex % 3) * 0.25;

  const cx = (-140 + rand(8) * 100) * scaleFactor;
  const cy = (30 + rand(9) * 60) * scaleFactor;

  // Staggered peeling order: bottom groups peel first, top groups last.
  const groupDelay = (4 - group) * 0.10; // 0.0 to 0.40 delay
  const individualDelay = rand(15) * 0.25; // 0.0 to 0.25 delay
  const t_peel = groupDelay + individualDelay; // Total start time: 0.0 to 0.65
  const t_flight_rev = 0.18; // Flight duration back to vortex

  // Calculate the rotating vortex states at current progress t_rev
  const spinSpeed = (t_rev * 12 + t_rev * t_rev * 15) * direction * seedSpeedFactor;
  const radiusFactor = 0.9 - t_rev * 0.25;
  const radialOscillation = Math.sin(t_rev * Math.PI * 4 + ringIndex * 1.5) * 12 * scaleFactor;
  const radius = baseRadius * radiusFactor + radialOscillation;

  const x_vortex = cx + radius * Math.cos(spinSpeed);
  const y_vortex = cy + radius * Math.sin(spinSpeed);
  const rot_vortex = (rand(5) - 0.5) * 120 + spinSpeed * (180 / Math.PI) * 0.25;
  const scale_vortex = (0.55 + rand(6) * 0.25) * (1.0 - t_rev * 0.4);
  const opacity_vortex = (0.25 + rand(7) * 0.5) * (1.0 - t_rev * 0.3);

  let dx = 0, dy = 0, rot = 0, scale = 1.0, opacity = 1.0;

  if (t_rev < t_peel) {
    dx = 0;
    dy = 0;
    rot = 0;
    scale = 1.0;
    opacity = 1.0;
  } else {
    const f_rev = (t_rev - t_peel) / t_flight_rev;
    if (f_rev >= 1.0) {
      dx = x_vortex;
      dy = y_vortex;
      rot = rot_vortex;
      scale = scale_vortex;
      opacity = opacity_vortex;
    } else {
      const ease_rev = f_rev * f_rev * (3 - 2 * f_rev);
      
      const arcFactor = Math.sin(f_rev * Math.PI);
      const arcX = (rand(12) - 0.5) * 60 * scaleFactor * (1.0 - ease_rev);
      const arcY = (rand(13) - 0.5) * 60 * scaleFactor * (1.0 - ease_rev);

      dx = x_vortex * ease_rev + arcX * arcFactor;
      dy = y_vortex * ease_rev + arcY * arcFactor;
      rot = rot_vortex * ease_rev;
      scale = 1.0 * (1 - ease_rev) + scale_vortex * ease_rev;
      opacity = 1.0 * (1 - ease_rev) + opacity_vortex * ease_rev;
    }
  }

  if (t_rev > 0.80) {
    const fadeFactor = Math.max(0, (1.0 - t_rev) / 0.20);
    opacity *= fadeFactor;
  }

  return { x: dx, y: dy, rotate: rot, scale, opacity };
}

interface VortexTextProps {
  text: string;
  group: number;
  globalStartIndex: number;
  animState: "idle" | "forward" | "reverse" | "assembled";
  progress: number;
  scaleFactor?: number;
  className?: string;
}

const VortexText = ({
  text,
  group,
  globalStartIndex,
  animState,
  progress,
  scaleFactor = 1.0,
  className,
}: VortexTextProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    const isVisible = animState === "forward" || animState === "assembled";
    return (
      <span className={className}>
        <span
          className="inline-block transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 8px, 0)",
          }}
        >
          {text}
        </span>
      </span>
    );
  }

  const words = text.split(" ");
  let charAccumulator = 0;

  return (
    <span className={className}>
      {words.map((word, wordIdx) => {
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
            {word.split("").map((char, charIdx) => {
              const globalCharIndex = globalStartIndex + charAccumulator;
              charAccumulator++;

              let transform = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
              
              if (animState === "forward") {
                transform = getForwardTransform(globalCharIndex, group, progress, scaleFactor);
              } else if (animState === "reverse") {
                transform = getReverseTransform(globalCharIndex, group, progress, scaleFactor);
              } else if (animState === "idle") {
                transform = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 };
              } else if (animState === "assembled") {
                transform = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
              }

              const isAssembled = animState === "assembled";

              return (
                <span
                  key={charIdx}
                  className={`inline-block origin-center ${isAssembled ? "" : "will-change-transform"}`}
                  style={
                    isAssembled
                      ? { display: "inline-block", opacity: 1 }
                      : {
                          display: "inline-block",
                          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${transform.rotate}deg) scale(${transform.scale})`,
                          opacity: transform.opacity,
                          transition: "none",
                        }
                  }
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

interface HeroProps {
  phase: "loading" | "completed" | "transitioning" | "done";
  isScrolled: boolean;
  onReverseComplete: () => void;
}

export default function Hero({ phase, isScrolled, onReverseComplete }: HeroProps) {
  // Hero section reveals simultaneously with logo movement (phase === "transitioning" or "done")
  const isHeroVisible = phase === "transitioning" || phase === "done";
  
  const [hasBooted] = useState(() => sessionStorage.getItem("cleroy_boot_completed") === "true");

  const [animState, setAnimState] = useState<"idle" | "forward" | "reverse" | "assembled">(() => {
    return hasBooted ? "assembled" : "idle";
  });
  const [progress, setProgress] = useState(() => {
    return hasBooted ? 1 : 0;
  });

  const [scaleFactor, setScaleFactor] = useState(1.0);

  // Set up responsive viewport scaleFactor listener
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const factor = Math.max(0.40, Math.min(1.15, w / 1100));
      setScaleFactor(factor);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Intro: Synchronized reveal immediately as logo transitions (phase === "transitioning" || "done")
  useEffect(() => {
    if (phase === "transitioning" || phase === "done") {
      const hasBootedBefore = sessionStorage.getItem("cleroy_boot_completed") === "true";
      if (animState === "idle") {
        if (isScrolled || hasBootedBefore) {
          setAnimState("assembled");
          setProgress(1);
        } else {
          setAnimState("forward");
          setProgress(0);
        }
      }
    }
  }, [phase, animState, isScrolled]);

  // Keep Hero fully assembled permanently during the tab session
  useEffect(() => {
    if (isScrolled) {
      if (animState === "forward" || animState === "reverse") {
        setAnimState("assembled");
        setProgress(1);
      }
    }
  }, [isScrolled, animState]);

  // Request Animation Frame loop for butter-smooth 60fps hardware accelerated progress updates
  useEffect(() => {
    if (animState !== "forward" && animState !== "reverse") return;

    let rAFId: number;
    let startTime = performance.now();
    
    // 3.5 seconds forward duration ensures user clearly enjoys the rotations before assembly
    const duration = animState === "forward" ? 3500 : 2500;

    const updateFrame = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const p = Math.min(1.0, elapsed / duration);
      
      setProgress(p);

      if (p >= 1.0) {
        if (animState === "forward") {
          setAnimState("assembled");
        } else if (animState === "reverse") {
          setAnimState("idle");
          onReverseComplete(); // Triggers the logo return flight immediately
        }
      } else {
        rAFId = requestAnimationFrame(updateFrame);
      }
    };

    rAFId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(rAFId);
  }, [animState, onReverseComplete]);

  // Calculate transforms for the two CTA buttons
  let transformBtn1 = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
  let transformBtn2 = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };

  if (animState === "forward") {
    transformBtn1 = getForwardTransform(126, 4, progress, scaleFactor);
    transformBtn2 = getForwardTransform(127, 4, progress, scaleFactor);
  } else if (animState === "reverse") {
    transformBtn1 = getReverseTransform(126, 4, progress, scaleFactor);
    transformBtn2 = getReverseTransform(127, 4, progress, scaleFactor);
  } else if (animState === "idle") {
    transformBtn1 = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 };
    transformBtn2 = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 };
  } else if (animState === "assembled") {
    transformBtn1 = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
    transformBtn2 = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
  }

  const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <section 
      id="hero-section" 
      className="relative w-full min-h-screen pt-[clamp(4.5rem,9vh,6.5rem)] pb-[clamp(1.5rem,4vh,3rem)] flex items-center justify-center z-10 overflow-hidden"
      style={{
        pointerEvents: isHeroVisible ? "auto" : "none"
      }}
    >
      {/* 
        Single Centered Hero Composition Wrapper:
        Fades and translates softly into view only after logo completes travel to navbar (phase === "done").
      */}
      <motion.div
        initial={
          hasBooted
            ? { opacity: 1, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, filter: isMobileDevice ? "none" : "blur(8px)", scale: 0.985 }
        }
        animate={
          isHeroVisible
            ? { opacity: 1, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, filter: isMobileDevice ? "none" : "blur(8px)", scale: 0.985 }
        }
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1], // Soft cinematic ease-out matching logo flight
        }}
        style={{ willChange: "opacity, filter, transform" }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative flex items-center"
      >
        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1.5rem,3vw,2.75rem)] items-center w-full">
          
          {/* Left Column: Premium Content */}
          <div
            id="hero-left-content"
            className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left space-y-[clamp(1rem,1.8vw,1.75rem)] z-20"
          >
            {/* Small Premium Label */}
            <div className="flex items-center gap-2" id="hero-label-container">
              <motion.span 
                className="text-[#D45A12] text-sm font-bold animate-pulse inline-block"
                initial={{ x: 0, y: 0, rotate: 0 }}
                animate={{ x: 0, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.0, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  opacity: animState === "idle" ? 0 : 1,
                }}
              >
                •
              </motion.span>
              <VortexText
                text="CLEROY ENGINEERING CORE"
                group={0}
                globalStartIndex={0}
                animState={animState}
                progress={progress}
                scaleFactor={scaleFactor}
                className="font-mono text-[clamp(0.65rem,0.9vw,0.8rem)] tracking-[clamp(0.2em,0.3vw,0.3em)] text-[#D45A12] font-bold uppercase inline-block"
              />
            </div>

            {/* Large Luxury Editorial Heading */}
            <h1 
              className="font-serif text-[clamp(1.85rem,4.5vw,5rem)] text-[#F5EFE7] leading-[1.08] tracking-tight font-light"
              id="hero-headline"
            >
              <VortexText
                text="We Engineer"
                group={1}
                globalStartIndex={23}
                animState={animState}
                progress={progress}
                scaleFactor={scaleFactor}
                className="inline-block"
              />
              <br />
              <VortexText
                text="Digital Excellence"
                group={2}
                globalStartIndex={34}
                animState={animState}
                progress={progress}
                scaleFactor={scaleFactor}
                className="text-[#D45A12] font-normal italic inline-block"
              />
            </h1>

            {/* Premium Editorial Description: Reduced to 2 lines exactly */}
            <p 
              className="font-sans text-[clamp(0.95rem,1.35vw,1.25rem)] text-[#B8ACA0] max-w-xl leading-relaxed font-light"
              id="hero-description"
            >
              <VortexText
                text="Engineering intelligent software,"
                group={3}
                globalStartIndex={52}
                animState={animState}
                progress={progress}
                scaleFactor={scaleFactor}
                className="inline-block"
              />
              <br className="hidden sm:inline" />
              <VortexText
                text="AI products and scalable digital systems."
                group={3}
                globalStartIndex={85}
                animState={animState}
                progress={progress}
                scaleFactor={scaleFactor}
                className="inline-block"
              />
            </p>

            {/* Buttons Row */}
            <div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[clamp(0.75rem,1.25vw,1.25rem)] w-full sm:w-auto pt-2"
              id="hero-buttons-container"
            >
              {/* Primary: Cleroy Primary CTA */}
              <div
                style={{
                  transform: `translate3d(${transformBtn1.x}px, ${transformBtn1.y}px, 0) rotate(${transformBtn1.rotate}deg) scale(${transformBtn1.scale})`,
                  opacity: transformBtn1.opacity,
                  transition: animState === "assembled" ? "transform 0.2s ease-out, opacity 0.2s ease-out" : "none",
                }}
                className="w-full sm:w-auto flex items-center justify-center"
              >
                <CleroyButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-cleroy-discovery"));
                  }}
                >
                  BUILD YOUR SOLUTION
                </CleroyButton>
              </div>

              {/* Secondary: Cleroy Secondary CTA */}
              <div
                style={{
                  transform: `translate3d(${transformBtn2.x}px, ${transformBtn2.y}px, 0) rotate(${transformBtn2.rotate}deg) scale(${transformBtn2.scale})`,
                  opacity: transformBtn2.opacity,
                  transition: animState === "assembled" ? "transform 0.2s ease-out, opacity 0.2s ease-out" : "none",
                }}
                className="w-full sm:w-auto flex items-center justify-center"
              >
                <CleroyButton
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-cleroy-gallery"));
                  }}
                >
                  EXPLORE OUR WORK
                </CleroyButton>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Hero Chess */}
          <div
            id="hero-right-visual"
            className="lg:col-span-7 flex justify-center items-center relative overflow-visible h-[clamp(280px,44vh,640px)] w-full max-w-xl lg:max-w-none mx-auto lg:mx-0"
          >
            <motion.div
              className="relative z-10 w-full h-full flex justify-center items-center overflow-visible"
              animate={
                isMobileDevice
                  ? { y: 0, rotate: 0 }
                  : {
                      y: [-8, 8, -8],
                      rotate: [-0.4, 0.4, -0.4],
                    }
              }
              transition={{
                duration: 9.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.02,
                transition: {
                  duration: 0.5,
                },
              }}
            >
              {/* 
                Massive zoomed-in chess collision. Crop away transparent margins using extreme scale.
                Positioned so that the white king is completely visible inside the viewport and the black king base is fully visible.
              */}
              <img
                src={heroChess}
                alt="Cleroy Hero Chess"
                className="w-full h-full object-contain select-none scale-[1.35] sm:scale-[1.5] lg:scale-[1.65] xl:scale-[1.78] origin-center translate-x-[2%] lg:translate-x-[4%] -translate-y-[1%] transition-transform duration-300 pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
