import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface CleroyScrollTypographyProps {
  targetRef?: React.RefObject<HTMLElement | null>;
}

export default function CleroyScrollTypography({ targetRef }: CleroyScrollTypographyProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const scrollTarget = targetRef || localRef;

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end start"],
  });

  // Entry & Parallax upward movement:
  // 0.00 -> 0.35: Entry stage. Word starts at 140px below and smoothly rises upward to 0px.
  // 0.35 -> 1.00: Parallax stage. Word continues moving slowly upward to -260px (20-30% of scroll speed).
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.35, 1],
    [140, 0, -260]
  );

  // Ultra-smooth spring physics for 60 FPS GPU-accelerated motion without bounce or overshoot
  const y = useSpring(rawY, {
    stiffness: 85,
    damping: 26,
    mass: 0.35,
  });

  const letters = ["C", "L", "E", "R", "O", "Y"];

  return (
    <div
      ref={localRef}
      className="relative w-full overflow-hidden py-10 sm:py-16 my-4 flex items-center justify-center select-none pointer-events-none z-0"
    >
      {/* Soft burnt orange ambient glow accent */}
      <div className="absolute inset-0 bg-radial from-[#E85002]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      <motion.div
        style={{ y, willChange: "transform" }}
        className="flex items-center justify-center w-full max-w-[1600px] px-2 font-sans font-black text-[21vw] sm:text-[23vw] md:text-[25vw] leading-none tracking-tighter uppercase gap-0.5 sm:gap-1 text-[#080808] drop-shadow-[0_4px_30px_rgba(232,80,2,0.12)] select-none"
      >
        {letters.map((char, index) => {
          // Subtle micro-stagger for individual letter depth while maintaining unified word movement
          const letterOffset = (index - 2.5) * 3;
          return (
            <span
              key={index}
              style={{ transform: `translateY(${letterOffset}px)` }}
              className="inline-block"
            >
              {char}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
