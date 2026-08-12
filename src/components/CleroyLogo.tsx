import React from "react";

interface CleroyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  withGlow?: boolean;
  hideText?: boolean;
}

export default function CleroyLogo({
  className = "",
  size = "md",
  withGlow = true,
  hideText = false,
}: CleroyLogoProps) {
  // Dimensions for standard configurations
  const dimensions = {
    sm: { boxSize: 36, textSize: "text-base", tracking: "tracking-[0.25em]", subTracking: "tracking-[0.4em]" },
    md: { boxSize: 52, textSize: "text-lg", tracking: "tracking-[0.3em]", subTracking: "tracking-[0.45em]" },
    lg: { boxSize: 84, textSize: "text-2xl", tracking: "tracking-[0.35em]", subTracking: "tracking-[0.5em]" },
    xl: { boxSize: 140, textSize: "text-4xl", tracking: "tracking-[0.4em]", subTracking: "tracking-[0.6em]" },
  };

  const dim = size === "full" ? dimensions["sm"] : dimensions[size];

  return (
    <div className={`flex items-center gap-4 select-none ${className}`} id="cleroy-brand-container">
      {/* Precision Vector Logo Container */}
      <div 
        className="relative flex-shrink-0" 
        style={size === "full" ? { width: "100%", height: "100%" } : { width: dim.boxSize, height: dim.boxSize }}
      >
        
        {/* Soft atmospheric glow inside the logo environment */}
        {withGlow && (
          <div 
            className="absolute inset-0 blur-2xl opacity-50 rounded-full scale-125"
            style={{
              background: "radial-gradient(circle, rgba(242,138,18,0.3) 0%, rgba(212,90,12,0) 70%)"
            }}
          />
        )}
        
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Ultra-polished Steel/Chrome Linear Gradient for the Outer 'C' */}
            <linearGradient id="silverChrome" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" /> {/* Bright specular highlight */}
              <stop offset="25%" stopColor="#D4D4D4" /> {/* Bright silver */}
              <stop offset="45%" stopColor="#737373" /> {/* Mid-tone shadow */}
              <stop offset="55%" stopColor="#E5E5E5" /> {/* Secondary reflection */}
              <stop offset="75%" stopColor="#A3A3A3" /> {/* Soft metal grain */}
              <stop offset="100%" stopColor="#404040" /> {/* Dark core border */}
            </linearGradient>

            {/* Glowing Molten Core Gradient for the Inner Orange Monogram Elements */}
            <linearGradient id="moltenFire" x1="72" y1="90" x2="187" y2="172" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD8A0" /> {/* Champagne top highlight */}
              <stop offset="40%" stopColor="#F28A12" /> {/* Saturated Golden Orange */}
              <stop offset="100%" stopColor="#D45A12" /> {/* Rich Burnt Orange */}
            </linearGradient>

            {/* Subtle inner reflection mask */}
            <linearGradient id="sheenHighlight" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 
            1. THE METALLIC SILVER "C" CURVE 
            Outer radius 70, inner radius 50. Precise 45-degree angled cuts.
          */}
          <path
            d="M 155 30 L 100 30 A 70 70 0 0 0 100 170 L 115 170 L 135 150 L 100 150 A 50 50 0 0 1 100 50 L 135 50 Z"
            fill="url(#silverChrome)"
          />
          
          {/* Subtle reflection overlay on top of the Silver C for extra glass-metal depth */}
          <path
            d="M 155 30 L 100 30 A 70 70 0 0 0 100 170 L 115 170 L 135 150 L 100 150 A 50 50 0 0 1 100 50 L 135 50 Z"
            fill="url(#sheenHighlight)"
            style={{ mixBlendMode: "overlay" }}
          />

          {/* 
            2. THE ORANGE HORIZONTAL CORE BAR 
            Sits centered at y=100. Double 45-degree angle slices.
          */}
          <path
            d="M 92 90 L 152 90 L 132 110 L 72 110 Z"
            fill="url(#moltenFire)"
          />

          {/* 
            3. THE ORANGE DIAGONAL CORE SLASH 
            Perfect 45-degree down-right translation, parallel to all slices.
          */}
          <path
            d="M 112 122 L 137 122 L 187 172 L 162 172 Z"
            fill="url(#moltenFire)"
          />
        </svg>
      </div>

      {/* Brand Text Block */}
      {size !== "xl" && !hideText && (
        <div className="flex flex-col items-start leading-none justify-center">
          <span
            className={`font-serif ${dim.textSize} ${dim.tracking} font-light text-[#F5EFE7] uppercase tracking-widest relative`}
            style={{
              textShadow: "0 2px 10px rgba(245,239,231,0.1)"
            }}
          >
            CLEROY
          </span>
          <span 
            className={`font-sans text-[8px] sm:text-[9px] ${dim.subTracking} text-[#B8ACA0] font-medium mt-1`}
          >
            ENGINEERING CORE
          </span>
        </div>
      )}
    </div>
  );
}
