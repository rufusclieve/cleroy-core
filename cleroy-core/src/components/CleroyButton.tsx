import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface CleroyButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  showGlyph?: boolean;
}

/**
 * Custom Cleroy Engineering Motion Glyph SVG Symbol
 * A minimal, precision-crafted geometric mark featuring:
 * - Double 45° angled parallel chevron cut
 * - Core energy tick
 * - Light-trail emission path
 */
export function CleroyMotionGlyph({
  isHovered,
  isActivating,
  size = "md",
}: {
  isHovered: boolean;
  isActivating: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const glyphSize = size === "sm" ? 13 : size === "lg" ? 18 : 15;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0 select-none">
      {/* Light Trail Behind Glyph */}
      <motion.div
        className="absolute left-[-10px] h-[1.5px] rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(255,122,0,0) 0%, rgba(255,122,0,0.85) 100%)",
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isActivating ? 22 : isHovered ? 14 : 0,
          opacity: isActivating ? 1 : isHovered ? 0.75 : 0,
          x: isActivating ? 8 : isHovered ? -2 : -6,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Main Cleroy Motion Glyph Container */}
      <motion.div
        animate={{
          rotate: isActivating ? 40 : isHovered ? 25 : 0,
          x: isActivating ? 12 : isHovered ? 5 : 0,
          scale: isActivating ? 1.15 : isHovered ? 1.08 : 1,
        }}
        transition={{
          duration: isActivating ? 0.25 : 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative flex items-center justify-center"
      >
        <svg
          width={glyphSize}
          height={glyphSize}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]"
        >
          <defs>
            <linearGradient id="glyphGrad" x1="2" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FF8A00" />
              <stop offset="100%" stopColor="#D45A12" />
            </linearGradient>
            <linearGradient id="glyphGlow" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFC080" />
              <stop offset="100%" stopColor="#FF5500" />
            </linearGradient>
          </defs>

          {/* 1. Outer Angular Chevron Cut (Precision 45° Parallel Cut) */}
          <motion.path
            d="M 5 3 L 13 10 L 5 17 L 8 17 L 16 10 L 8 3 Z"
            fill="url(#glyphGrad)"
            animate={{
              d: isHovered
                ? "M 4 3 L 14 10 L 4 17 L 7.5 17 L 17.5 10 L 7.5 3 Z"
                : "M 5 3 L 13 10 L 5 17 L 8 17 L 16 10 L 8 3 Z",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* 2. Core Energy Notch Point */}
          <motion.path
            d="M 2 10 H 5"
            stroke="url(#glyphGlow)"
            strokeWidth="1.75"
            strokeLinecap="round"
            animate={{
              opacity: isHovered ? 1 : 0.6,
              x: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* 3. Molten Core Spark Dot */}
          <circle
            cx="11"
            cy="10"
            r="1.25"
            fill="#FFFFFF"
            className="drop-shadow-[0_0_4px_#FF8A00]"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default function CleroyButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  id,
  type = "button",
  disabled = false,
  fullWidth = false,
  showGlyph = true,
}: CleroyButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handlePointerDown = () => {
    if (disabled) return;
    setIsActivating(true);
  };

  const handlePointerUp = () => {
    if (disabled) return;
    setTimeout(() => {
      setIsActivating(false);
    }, 300);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      if (onClick) onClick(e);
    }, 120);
  };

  // Size specifications
  const sizeStyles = {
    sm: "py-1.5 px-3.5 text-[11px] gap-2 rounded-full",
    md: "py-2.5 px-5 text-[12px] gap-2.5 rounded-full",
    lg: "py-[10px] sm:py-[11px] px-5 sm:px-6 text-[12px] sm:text-[12.5px] gap-2.5 rounded-full",
  };

  // Variant base styles
  const variantStyles = {
    primary:
      "bg-black/80 text-white border border-[#FF7A00]/40 hover:border-[#FF7A00] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]",
    secondary:
      "bg-[#0E0E0E]/90 text-white border border-white/15 hover:border-[#FF7A00]/70 hover:shadow-[0_0_25px_rgba(255,122,0,0.3)]",
    outline:
      "bg-transparent text-white border border-white/20 hover:border-[#FF7A00] hover:bg-black/40 hover:shadow-[0_0_20px_rgba(255,122,0,0.25)]",
    ghost:
      "bg-transparent text-white hover:text-[#FF7A00] py-2 px-3 gap-2 border-b border-transparent hover:border-[#FF7A00]/50",
  };

  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActivating(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      animate={{
        scale: isActivating ? 0.96 : isHovered ? 1.01 : 1,
        brightness: isHovered ? 1.12 : 1,
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden inline-flex items-center justify-center font-semibold tracking-wider uppercase select-none transition-all duration-300 ease-out cursor-pointer ${
        fullWidth ? "w-full" : ""
      } ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
      style={{
        willChange: "transform",
      }}
    >
      {/* 1. Ambient Soft Background Brightening Glow */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        animate={{
          opacity: isActivating ? 0.9 : isHovered ? 0.45 : 0,
        }}
        transition={{ duration: 0.35 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 122, 0, 0.25) 0%, rgba(212, 90, 18, 0.05) 75%, transparent 100%)",
        }}
      />

      {/* 2. Thin Energy Sweep Line Traveling Left-to-Right */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
        <motion.div
          className="absolute top-0 bottom-0 w-[40%] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 122, 0, 0.45) 50%, transparent 100%)",
          }}
          initial={{ x: "-100%" }}
          animate={{
            x: isHovered || isActivating ? ["-100%", "280%"] : "-100%",
          }}
          transition={{
            repeat: isHovered && !isActivating ? Infinity : 0,
            duration: 1.6,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 3. Button Click Activation Light Pulse Fill */}
      <AnimatePresence>
        {isActivating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/30 via-[#D45A12]/40 to-[#FF7A00]/30 rounded-[inherit] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 4. Perfectly Stable Label Text Container */}
      <span className="relative z-10 flex items-center tracking-wider text-center select-none font-sans font-semibold">
        {children}
      </span>

      {/* 5. Signature Cleroy Motion Glyph */}
      {showGlyph && (
        <span className="relative z-10 flex items-center">
          <CleroyMotionGlyph
            isHovered={isHovered}
            isActivating={isActivating}
            size={size}
          />
        </span>
      )}
    </motion.button>
  );
}
