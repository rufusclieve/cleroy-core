import React from "react";
import { useAdaptivePerformance } from "../utils/useAdaptivePerformance";

export default function GlobalBackground() {
  const { isMobile, isLowEnd, isTablet } = useAdaptivePerformance();

  const filterBlur = isMobile || isLowEnd ? "blur(35px)" : "blur(130px)";
  const wrapperOpacity = isMobile || isLowEnd ? 0.75 : isTablet ? 0.88 : 0.98;

  return (
    <div
      id="global-atmosphere-container"
      className="fixed inset-0 w-full h-screen pointer-events-none select-none z-0 overflow-hidden bg-[#020202]"
    >
      <style>{`
        /* GPU Accelerated organic fluid keyframes for 4 distinct SVG waves */
        @media (max-width: 767px) {
          #lava-waves-wrapper {
            filter: none !important;
            opacity: 0.35 !important;
          }
        }

        @keyframes lava-wave-alpha {
          0% {
            transform: translate3d(-8%, 5%, 0) rotate(-1deg) scaleY(0.9);
          }
          50% {
            transform: translate3d(8%, -5%, 0) rotate(1.5deg) scaleY(1.15);
          }
          100% {
            transform: translate3d(-8%, 5%, 0) rotate(-1deg) scaleY(0.9);
          }
        }

        @keyframes lava-wave-beta {
          0% {
            transform: translate3d(6%, -3%, 0) rotate(2deg) scaleY(1.1);
          }
          50% {
            transform: translate3d(-10%, 7%, 0) rotate(-1.5deg) scaleY(0.8);
          }
          100% {
            transform: translate3d(6%, -3%, 0) rotate(2deg) scaleY(1.1);
          }
        }

        @keyframes lava-wave-gamma {
          0% {
            transform: translate3d(-5%, -6%, 0) rotate(-0.5deg) scale(1.0);
          }
          50% {
            transform: translate3d(5%, 4%, 0) rotate(0.8deg) scale(1.12);
          }
          100% {
            transform: translate3d(-5%, -6%, 0) rotate(-0.5deg) scale(1.0);
          }
        }

        @keyframes lava-wave-delta {
          0% {
            transform: translate3d(4%, 6%, 0) rotate(1.2deg) scaleY(0.85);
          }
          50% {
            transform: translate3d(-6%, -4%, 0) rotate(-1deg) scaleY(1.1);
          }
          100% {
            transform: translate3d(4%, 6%, 0) rotate(-1deg) scaleY(0.85);
          }
        }
      `}</style>

      {/* 
        The Wave Animation Stage
        Using blur filter and container size stretching wide to 
        entirely hide any sharp edges.
      */}
      <div
        id="lava-waves-wrapper"
        className={`absolute bottom-0 left-[-40%] w-[180%] h-[38vh] overflow-visible pointer-events-none ${(isMobile || isLowEnd) ? "" : "will-change-transform"}`}
        style={{ 
          filter: filterBlur,
          opacity: wrapperOpacity
        }}
      >
        {/* SVG Wave 1: Pure Fiery Orange-Red / Bright Ember */}
        <div
          className="absolute inset-0 w-full h-full opacity-45"
          style={{
            animation: (isMobile || isLowEnd) ? "none" : "lava-wave-alpha 52s ease-in-out infinite",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 2400 400" preserveAspectRatio="none">
            <path
              d="M 0,220 Q 300,100 600,240 T 1200,200 T 1800,260 T 2400,180 L 2400,400 L 0,400 Z"
              fill="#ff3d00"
            />
          </svg>
        </div>

        {/* SVG Wave 2: Hot Saturated Fire Orange */}
        {!isLowEnd && (
          <div
            className="absolute inset-0 w-full h-full opacity-40"
            style={{
              animation: isMobile ? "lava-wave-beta 90s ease-in-out infinite" : "lava-wave-beta 68s ease-in-out infinite",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 2400 400" preserveAspectRatio="none">
              <path
                d="M 0,260 Q 400,340 800,180 T 1600,260 T 2400,210 L 2400,400 L 0,400 Z"
                fill="#ff5722"
              />
            </svg>
          </div>
        )}

        {/* SVG Wave 3: Deep Flame Glow */}
        {!isMobile && !isLowEnd && (
          <div
            className="absolute inset-0 w-full h-full opacity-35"
            style={{
              animation: "lava-wave-gamma 86s ease-in-out infinite",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 2400 400" preserveAspectRatio="none">
              <path
                d="M 0,160 Q 350,280 750,140 T 1500,220 T 2400,150 L 2400,400 L 0,400 Z"
                fill="#ff4500"
              />
            </svg>
          </div>
        )}

        {/* SVG Wave 4: Radiant Saturated Ember Glow */}
        {!isMobile && !isLowEnd && (
          <div
            className="absolute inset-0 w-full h-full opacity-38"
            style={{
              animation: "lava-wave-delta 104s ease-in-out infinite",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 2400 400" preserveAspectRatio="none">
              <path
                d="M 0,310 Q 500,210 1000,330 T 2000,250 T 2400,320 L 2400,400 L 0,400 Z"
                fill="#ff6d00"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Atmospheric Cinematic Overlay Mask */}
      <div
        id="global-atmosphere-mask"
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #020202 0%, #020202 72%, rgba(2, 2, 2, 0.99) 76%, rgba(2, 2, 2, 0.85) 83%, rgba(2, 2, 2, 0.3) 92%, transparent 100%)",
        }}
      />
    </div>
  );
}
