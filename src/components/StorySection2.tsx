import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "motion/react";
import {
  Bot,
  Sparkles,
  Cpu,
  Globe,
  Layout,
  LineChart,
  Layers,
  Terminal,
  Compass,
  Palette,
  Type,
  RefreshCw,
  Zap,
  Workflow,
  ArrowUpRight,
  ArrowRight,
  Code2,
  Server,
  Activity,
  Sliders,
  ShieldCheck,
  BarChart3,
  Rocket,
  ChevronDown
} from "lucide-react";
import CleroyLogo from "./CleroyLogo";

// Import SVG assets so Vite bundles them correctly in the build
import aiAssistantPurple from "../assets/ai_assistant_purple.svg";
import sellerDashboardOrange from "../assets/seller_dashboard_orange.svg";
import aiBusinessAutomationOrange from "../assets/ai_business_automation_orange.svg";
import webExperience1 from "../assets/web_experience_1.svg";
import webExperience2 from "../assets/web_experience_2.svg";
import webExperience3 from "../assets/web_experience_3.svg";
import digitalPlatform1 from "../assets/digital_platform_1.svg";
import digitalPlatform2 from "../assets/digital_platform_2.svg";
import digitalPlatform3 from "../assets/digital_platform_3.svg";
import brandDesign1 from "../assets/brand_design_1.svg";
import brandDesign2 from "../assets/brand_design_2.svg";
import brandDesign3 from "../assets/brand_design_3.svg";
import automationInnovation1 from "../assets/automation_innovation_1.svg";
import automationInnovation2 from "../assets/automation_innovation_2.svg";
import automationInnovation3 from "../assets/automation_innovation_3.svg";

// Bezier interpolation helper for natural curves and ease profiles
const getCubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number): number => {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
};

// Master Bezier trajectory logic for each image card
const getCardBezierPath = (
  category: "ai" | "web" | "plat" | "brand" | "auto",
  cardIdx: number,
  t: number,
  scaleFactor: number
) => {
  let activeX = 0;
  let activeY = 0;
  let exitX = 0;
  let exitY = 0;
  let offsetX = 0;
  let offsetY = 0;

  if (category === "ai") {
    if (cardIdx === 1) {
      activeX = 0; activeY = -220;
      exitX = 0; exitY = -1200;
      offsetX = 60; offsetY = 0;
    } else if (cardIdx === 2) {
      activeX = -330; activeY = 40;
      exitX = -1400; exitY = 150;
      offsetX = 0; offsetY = -100;
    } else {
      activeX = 330; activeY = 40;
      exitX = 1400; exitY = 150;
      offsetX = 0; offsetY = -100;
    }
  } else if (category === "web") {
    if (cardIdx === 1) {
      activeX = 0; activeY = -240;
      exitX = 0; exitY = -1200;
      offsetX = -60; offsetY = 0;
    } else if (cardIdx === 2) {
      activeX = -350; activeY = 55;
      exitX = -1400; exitY = 150;
      offsetX = 0; offsetY = -120;
    } else {
      activeX = 350; activeY = 55;
      exitX = 1400; exitY = 150;
      offsetX = 0; offsetY = -120;
    }
  } else if (category === "plat") {
    if (cardIdx === 1) {
      activeX = 0; activeY = -230;
      exitX = 0; exitY = -1200;
      offsetX = 0; offsetY = 0;
    } else if (cardIdx === 2) {
      activeX = -350; activeY = 60;
      exitX = -1400; exitY = 150;
      offsetX = 0; offsetY = -140;
    } else {
      activeX = 350; activeY = 60;
      exitX = 1400; exitY = 150;
      offsetX = 0; offsetY = -140;
    }
  } else if (category === "brand") {
    if (cardIdx === 1) {
      activeX = 0; activeY = -260;
      exitX = 0; exitY = -1200;
      offsetX = 40; offsetY = 0;
    } else if (cardIdx === 2) {
      activeX = -290; activeY = 60;
      exitX = -1400; exitY = 150;
      offsetX = 0; offsetY = -80;
    } else {
      activeX = 290; activeY = 60;
      exitX = 1400; exitY = 150;
      offsetX = 0; offsetY = -80;
    }
  } else { // auto
    if (cardIdx === 1) {
      activeX = 0; activeY = -230;
      exitX = 0; exitY = -1200;
      offsetX = 0; offsetY = 0;
    } else if (cardIdx === 2) {
      activeX = -300; activeY = 60;
      exitX = -1400; exitY = 150;
      offsetX = 0; offsetY = -80;
    } else {
      activeX = 300; activeY = 60;
      exitX = 1400; exitY = 150;
      offsetX = 0; offsetY = -80;
    }
  }

  activeX *= scaleFactor;
  activeY *= scaleFactor;
  exitX *= scaleFactor;
  exitY *= scaleFactor;
  offsetX *= scaleFactor;
  offsetY *= scaleFactor;

  const p0x = 0;
  const p0y = 0;

  const p1x = 1.333 * activeX - 0.166 * exitX + offsetX;
  const p1y = 1.333 * activeY - 0.166 * exitY + offsetY;

  const p2x = 1.333 * activeX - 0.166 * exitX - offsetX;
  const p2y = 1.333 * activeY - 0.166 * exitY - offsetY;

  const p3x = exitX;
  const p3y = exitY;

  return {
    x: getCubicBezier(t, p0x, p1x, p2x, p3x),
    y: getCubicBezier(t, p0y, p1y, p2y, p3y)
  };
};

interface StoryTitleProps {
  key?: string;
  title: string;
  scrollProgress: any;
  scaleFactor: number;
  startEmerging: number;
  fullExit: number;
  finalYOffset: number;
}

// Service Title emerges smoothly from the logo center down to finalYOffset.
// Words stay intact and wrap cleanly onto 2 lines on narrow viewports without letter collisions or overlap.
const StoryTitle = React.memo(function StoryTitle({
  title,
  scrollProgress,
  scaleFactor,
  startEmerging,
  fullExit,
  finalYOffset
}: StoryTitleProps) {
  const finalY = finalYOffset * Math.max(0.60, Math.min(1.0, scaleFactor));

  // Map the raw scroll progress to a normalized u parameter (0 to 1) for this specific category
  const u = useTransform(scrollProgress, [startEmerging, fullExit], [0, 1]);

  const currentY = useTransform(u, (val: number) => {
    if (val < 0) return 0;
    if (val <= 0.45) {
      const t = val / 0.45;
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      return easeT * finalY;
    } else if (val <= 0.55) {
      return finalY;
    } else {
      // Rapid downward exit to make room for the next emerging category
      const t = Math.min(1.0, (val - 0.55) / 0.20);
      const easeT = t * t * (3 - 2 * t); // Smoothstep exit
      const exitY = finalY + (scaleFactor < 0.75 ? 180 : 320);
      return (1 - easeT) * finalY + easeT * exitY;
    }
  });

  const currentScale = useTransform(u, (val: number) => {
    if (val < 0) return 0;
    if (val <= 0.45) {
      const t = val / 0.45;
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      return easeT * 1.0;
    } else if (val <= 0.55) {
      return 1.0;
    } else {
      const t = Math.min(1.0, (val - 0.55) / 0.20);
      return 1.0 + t * 0.12;
    }
  });

  const currentOpacity = useTransform(u, (val: number) => {
    if (val < 0 || val > 0.75) return 0;
    if (val <= 0.40) {
      const t = val / 0.40;
      return t; // fade in
    } else if (val <= 0.58) {
      return 1.0; // linger dominant
    } else {
      const t = Math.min(1.0, (val - 0.58) / 0.17);
      return 1.0 - t; // rapid fade out
    }
  });

  const words = title.split(" ");

  return (
    <motion.div
      style={{
        y: currentY,
        scale: currentScale,
        opacity: currentOpacity,
        position: "absolute",
      }}
      className="z-20 flex flex-wrap items-center justify-center text-center max-w-[95vw] lg:max-w-[800px] px-3 select-none pointer-events-none"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-center leading-snug sm:leading-normal">
        {words.map((word, wIdx) => (
          <span
            key={wIdx}
            className="inline-block whitespace-nowrap font-sans font-semibold text-[#D45A12] sm:text-[#FF9F55] uppercase drop-shadow-[0_0_20px_rgba(212,90,18,0.25)] tracking-[clamp(0.18em,0.25vw,0.30em)] text-[clamp(1.1rem,2.8vw,2.25rem)]"
          >
            {word}
          </span>
        ))}
      </div>
    </motion.div>
  );
});

interface ProjectCardImageProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

const ProjectCardImage = React.memo(function ProjectCardImage({ src, alt, title, description }: ProjectCardImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const displayTitle = title || alt;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c1c22] via-[#0f0f13] to-[#08080a]">
      {/* Soft orange ambient glow background - always present */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,159,85,0.20)_0%,rgba(255,159,85,0.04)_50%,transparent_80%)] pointer-events-none z-0" />

      {/* Subtle brand grid accent */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff9f55_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* High-quality Branded Placeholder (visible while loading or if error occurs) */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-0 select-none">
          <CleroyLogo size="sm" withGlow={true} hideText={true} />
          <span className="text-[#F5EFE7] font-sans text-[10px] uppercase tracking-[0.20em] mt-3 font-semibold">
            {displayTitle}
          </span>
          {description && (
            <p className="text-[#C5B9AD]/90 font-serif text-xs font-normal leading-relaxed max-w-[85%] mt-1 text-center">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Actual Preview Image */}
      {!hasError && (
        <>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`relative z-10 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-[1.03] ${
              isLoaded ? "opacity-95 group-hover:opacity-100" : "opacity-0"
            }`}
            referrerPolicy="no-referrer"
          />
          {/* Service Card Hover Overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 sm:p-4 flex flex-col justify-end text-left pointer-events-none">
            <span className="font-sans font-semibold text-xs sm:text-sm text-white uppercase tracking-wider mb-1">
              {displayTitle}
            </span>
            {description && (
              <p className="font-serif font-normal text-[11px] sm:text-xs text-[#E0D5C9]/90 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
});

export default React.memo(function StorySection2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Category 1 (AI SOLUTIONS) Cards
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // Category 2 (WEB EXPERIENCES) Cards
  const webCard1Ref = useRef<HTMLDivElement>(null);
  const webCard2Ref = useRef<HTMLDivElement>(null);
  const webCard3Ref = useRef<HTMLDivElement>(null);

  // Category 3 (DIGITAL PLATFORMS) Cards
  const platCard1Ref = useRef<HTMLDivElement>(null);
  const platCard2Ref = useRef<HTMLDivElement>(null);
  const platCard3Ref = useRef<HTMLDivElement>(null);

  // Category 4 (BRAND & DESIGN) Cards
  const brandCard1Ref = useRef<HTMLDivElement>(null);
  const brandCard2Ref = useRef<HTMLDivElement>(null);
  const brandCard3Ref = useRef<HTMLDivElement>(null);

  // Category 5 (AUTOMATION & INNOVATION) Cards
  const autoCard1Ref = useRef<HTMLDivElement>(null);
  const autoCard2Ref = useRef<HTMLDivElement>(null);
  const autoCard3Ref = useRef<HTMLDivElement>(null);

  const logoRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1.0);

  // Preload all 15 preview images before the animation sequence begins
  useEffect(() => {
    const imagesToPreload = [
      aiAssistantPurple,
      sellerDashboardOrange,
      aiBusinessAutomationOrange,
      webExperience1,
      webExperience2,
      webExperience3,
      digitalPlatform1,
      digitalPlatform2,
      digitalPlatform3,
      brandDesign1,
      brandDesign2,
      brandDesign3,
      automationInnovation1,
      automationInnovation2,
      automationInnovation3,
    ];

    imagesToPreload.forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);

  // Set up responsive state listener with fluid scale factor for 320px to 4K displays
  useEffect(() => {
    const checkResponsive = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      const factor = Math.max(0.50, Math.min(1.15, w / 1200));
      setScaleFactor(factor);
    };
    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  // Track scroll position of our custom tall scroll wrapper
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // LOWER stiffness and DAMPING for an extremely premium, buttery smooth Apple-style inertial glide
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.2,
    restDelta: 0.0001
  });

  const timeRef = useRef(0);
  const particlesRef = useRef<any[]>([]);
  const lastScrollValRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const dimensionRef = useRef({ width: 0, height: 0 });

  // Fixed deterministic spark positions for gathering phase
  const sparksRef = useRef<{ angle: number; radius: number; speedOffset: number; size: number }[]>([]);
  if (sparksRef.current.length === 0) {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        radius: 140 + Math.random() * 200,
        speedOffset: 0.12 * (Math.random() - 0.5),
        size: 0.8 + Math.random() * 1.6,
      });
    }
    sparksRef.current = arr;
  }

  // Resize listener for background canvas sizing
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
        dimensionRef.current = { width, height };
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // High-performance Framer Motion transforms mapped to exact scroll progress
  // "WHAT WE CREATE" Heading and descriptive text
  // Displayed cleanly at entry (0.00 to 0.08), dissolves smoothly on scroll (0.08 to 0.18) as logo softly emerges
  const introOpacity = useTransform(scrollProgress, [0.0, 0.08, 0.18], [1.0, 1.0, 0.0]);
  const introY = useTransform(scrollProgress, [0.08, 0.18], [0, -35]);
  const introScale = useTransform(scrollProgress, [0.08, 0.18], [1.0, 0.92]);
  const introBlur = useTransform(scrollProgress, [0.0, 0.08, 0.18], ["blur(0px)", "blur(0px)", "blur(10px)"]);

  // Cleroy Logo is invisible during reading phase (0.0 to 0.08),
  // then softly fades into view with scale and blur reduction (0.08 to 0.18), remaining active through all categories
  const logoOpacity = useTransform(scrollProgress, [0.0, 0.08, 0.18, 0.94, 1.0], [0.0, 0.0, 1.0, 1.0, 0.0]);
  const logoScale = useTransform(scrollProgress, [0.08, 0.18, 0.94], [0.55, 1.0, 0.92]);

  // Master Stage Exit transforms at the end of the sticky timeline
  const stageExitOpacity = useTransform(scrollProgress, [0.91, 1.0], [1.0, 0.0]);
  const stageExitScale = useTransform(scrollProgress, [0.91, 1.0], [1.0, 0.95]);

  // Premium easing (Ease Out Quart for explosive acceleration and slow gentle settle)
  const easeOutCustom = (v: number): number => {
    return 1 - Math.pow(1 - v, 4);
  };

  // State-interpolated smoothed scroll tracking to decouple from raw scroll updates
  const smoothedScrollValRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "800px 0px 800px 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Integrated drawing and direct element manipulation thread (60fps)
  useEffect(() => {
    if (!isNearViewport || isMobile) {
      lastFrameTimeRef.current = null;
      return;
    }

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        requestRef.current = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext("2d");
      const { width, height } = dimensionRef.current;
      if (!ctx || width === 0 || height === 0) {
        requestRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      if (lastFrameTimeRef.current !== null) {
        const delta = (now - lastFrameTimeRef.current) / 1000;
        accumulatedTimeRef.current += Math.min(0.1, delta);
      }
      lastFrameTimeRef.current = now;
      const elapsed = accumulatedTimeRef.current;
      timeRef.current = elapsed;

      // Direct 1:1 synchronization on mobile to eliminate touch scroll lag, spring-interpolated on desktop
      const scrollVal = isMobile ? scrollYProgress.get() : scrollProgress.get();
      smoothedScrollValRef.current = scrollVal;

      // Clean canvas background on every frame to prevent trailing smearing on reverse scroll
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric radial glow from center
      const glowAlpha = 0.035 + 0.015 * Math.sin(elapsed * 0.8);
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        30,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.55
      );
      glowGrad.addColorStop(0, `rgba(212, 90, 18, ${glowAlpha})`);
      glowGrad.addColorStop(0.5, `rgba(212, 90, 18, ${glowAlpha * 0.25})`);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Deep vignetting
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      vignetteGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignetteGrad.addColorStop(1, "rgba(0, 0, 0, 0.88)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. GATHER SPARKS Rushing to center of logo when scrolling between [0.08, 0.18]
      const SPARKS_START = 0.08;
      const SPARKS_END = 0.18;
      if (scrollVal >= SPARKS_START && scrollVal <= SPARKS_END) {
        const t_spark = (scrollVal - SPARKS_START) / (SPARKS_END - SPARKS_START);
        
        ctx.shadowBlur = isMobile ? 0 : 4;
        ctx.shadowColor = "#D45A12";
        sparksRef.current.forEach((p) => {
          if (!p) return;
          const currentRadius = p.radius * Math.max(0, 1 - (t_spark + p.speedOffset));
          if (currentRadius > 2) {
            const x = width / 2 + Math.cos(p.angle) * currentRadius;
            const y = height / 2 + Math.sin(p.angle) * currentRadius;
            
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "#FFA366";
            ctx.globalAlpha = Math.min(1.0, (1 - currentRadius / p.radius) * 1.5) * (1 - t_spark);
            ctx.fill();
            
            // Draw a subtle trail segment pointing inward
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(p.angle) * 8, y + Math.sin(p.angle) * 8);
            ctx.strokeStyle = "rgba(255, 163, 102, 0.35)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // 2. THE CHOREOGRAPHED PULSES AT EACH CATEGORY ENTRANCE
      const pulseThresholds = [0.18, 0.33, 0.48, 0.63, 0.78];
      pulseThresholds.forEach((triggerVal) => {
        const pulseProgress = Math.max(0, Math.min(1, (scrollVal - triggerVal) / 0.12));
        if (pulseProgress > 0.001 && pulseProgress < 0.999) {
          const pulseRadius = pulseProgress * (isMobile ? 150 : 280);
          const pulseAlpha = Math.sin(pulseProgress * Math.PI) * 0.65;
          
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 110, 20, ${pulseAlpha})`;
          ctx.lineWidth = isMobile ? 1.5 : 2.5;
          ctx.shadowColor = "#FF6B00";
          ctx.shadowBlur = isMobile ? 0 : 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // 3. MASTER ENERGY TRAILS
      const activeScaleFactor = isMobile ? 0.65 : scaleFactor;

      const drawEnergyTrails = (category: "ai" | "web" | "plat" | "brand" | "auto", cardIdx: number, u: number) => {
        // We only show trails during the initial launch phase (u from 0.0 to 0.5)
        if (u < 0.001 || u >= 0.50) return;
        
        // Compute the theoretical velocity based on the derivative of our path function g(u)
        const vel = 1 + 2 * Math.PI * 0.14 * Math.cos(2 * Math.PI * u);
        const speedFactor = Math.max(0, Math.min(1, (vel - 0.12) / 1.76)); // 1.0 at u=0, down to 0.0 at u=0.5
        
        const trailsConfig = [
          { delay: 0.00, latOffset: -3.0, maxLen: 0.32, color: "rgba(255, 110, 20, 0.60)", width: 1.6 },
          { delay: 0.02, latOffset: 0.0, maxLen: 0.45, color: "rgba(255, 150, 40, 0.70)", width: 2.2 },
          { delay: 0.04, latOffset: 3.0, maxLen: 0.24, color: "rgba(255, 110, 20, 0.50)", width: 1.4 }
        ];

        trailsConfig.forEach((config) => {
          const u_trail = Math.max(0, u - config.delay);
          if (u_trail <= 0) return;
          
          const trailVel = 1 + 2 * Math.PI * 0.14 * Math.cos(2 * Math.PI * u_trail);
          const trailSpeed = Math.max(0, Math.min(1, (trailVel - 0.12) / 1.76));
          
          const t_path = u_trail + 0.14 * Math.sin(2 * Math.PI * u_trail);
          const currentLen = config.maxLen * trailSpeed;
          const pEnd = t_path;
          const pStart = Math.max(0, pEnd - currentLen);
          if (pEnd - pStart < 0.002) return;

          ctx.beginPath();
          const steps = 15;
          for (let step = 0; step <= steps; step++) {
            const p = pStart + (pEnd - pStart) * (step / steps);
            const basePos = getCardBezierPath(category, cardIdx, p, activeScaleFactor);

            // Perpendicular normal vector for elegant wiggle
            const nextP = Math.min(1.0, p + 0.005);
            const nextPos = getCardBezierPath(category, cardIdx, nextP, activeScaleFactor);
            let dx = nextPos.x - basePos.x;
            let dy = nextPos.y - basePos.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            if (len === 0) { dx = 0; dy = -1; len = 1; }
            const tx = dx / len;
            const ty = dy / len;
            const nx = -ty;
            const ny = tx;

            const wiggle = Math.sin(p * Math.PI * 4.5 + elapsed * 15) * (isMobile ? 1.0 : 2.0) * Math.sin(p * Math.PI);
            const totalLateralOffset = config.latOffset * (isMobile ? 0.65 : 1.0) + wiggle;

            const sx = width / 2 + basePos.x + nx * totalLateralOffset;
            const sy = height / 2 + basePos.y + ny * totalLateralOffset;

            if (step === 0) { ctx.moveTo(sx, sy); } else { ctx.lineTo(sx, sy); }
          }

          const finalAlpha = config.color.replace(/[\d\.]+\)$/, (m) => {
            const val = parseFloat(m);
            return (val * trailSpeed).toFixed(3) + ")";
          });

          ctx.strokeStyle = finalAlpha;
          ctx.lineWidth = isMobile ? config.width * 0.7 : config.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowColor = "#FF6B00";
          ctx.shadowBlur = isMobile ? 0 : 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      };

      // Draw energy trails for the active emerging category based on scroll triggers
      const categoriesInfo = [
        { key: "ai", start: 0.18, duration: 0.33 - 0.18 },
        { key: "web", start: 0.33, duration: 0.48 - 0.33 },
        { key: "plat", start: 0.48, duration: 0.63 - 0.48 },
        { key: "brand", start: 0.63, duration: 0.78 - 0.63 },
        { key: "auto", start: 0.78, duration: 0.92 - 0.78 }
      ];

      categoriesInfo.forEach((cat) => {
        if (scrollVal >= cat.start && scrollVal <= cat.start + cat.duration) {
          const u_emerg = (scrollVal - cat.start) / cat.duration;
          drawEnergyTrails(cat.key as any, 1, u_emerg);
          drawEnergyTrails(cat.key as any, 2, u_emerg);
          drawEnergyTrails(cat.key as any, 3, u_emerg);
        }
      });

      // Keep permanent ambient sparkles and drifting embers alive
      const targetCount = 60;
      if (particlesRef.current.length < targetCount) {
        const toAdd = targetCount - particlesRef.current.length;
        for (let i = 0; i < toAdd; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: -(0.15 + Math.random() * 0.35),
            size: 0.6 + Math.random() * 1.3,
            color: Math.random() > 0.45 ? "#D45A12" : "#FFA366",
            alpha: 0.15 + Math.random() * 0.65,
            decay: 0.0005 + Math.random() * 0.0015,
            speed: 0.2,
            angle: Math.random() * Math.PI * 2,
            noiseOffset: Math.random() * 100
          });
        }
      }

      // Track scroll delta to power radial interactive starfield warp effect
      const lastScrollVal = lastScrollValRef.current;
      const scrollDelta = scrollVal - lastScrollVal;
      lastScrollValRef.current = scrollVal;

      // Physics update and boundary respawns
      particlesRef.current = particlesRef.current.map((p) => {
        p.angle += 0.008;
        const noiseForce = Math.sin(p.angle + p.noiseOffset) * 0.04;
        p.x += p.vx + noiseForce;
        p.y += p.vy;

        if (Math.abs(scrollDelta) > 0.0001) {
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const rx = dx / dist;
          const ry = dy / dist;
          const pushForce = scrollDelta * 380 * (dist / 200 + 0.5);
          p.x += rx * pushForce;
          p.y += ry * pushForce;
        }

        p.alpha -= p.decay;

        if (p.y < -10 || p.alpha <= 0 || p.x < -10 || p.x > width + 10) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.alpha = 0.2 + Math.random() * 0.6;
          p.vx = (Math.random() - 0.5) * 0.35;
          p.vy = -(0.15 + Math.random() * 0.35);
        }
        return p;
      });

      // Draw particle layer
      particlesRef.current.forEach((p) => {
        if (!p) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // CINEMATIC TRANSITION SEQUENCE (scrollVal >= 0.08 && scrollVal <= 0.20)
      // During logo emergence (0.08 to 0.18), we render soft orange particles orbiting the center and subtle radiating energy lines.
      if (scrollVal >= 0.08 && scrollVal <= 0.20) {
        let cinAlpha = 0.0;
        if (scrollVal < 0.12) {
          cinAlpha = (scrollVal - 0.08) / 0.04; // Fade in with logo
        } else if (scrollVal > 0.16) {
          cinAlpha = Math.max(0, 1 - (scrollVal - 0.16) / 0.04); // Soft transition into showcase
        } else {
          cinAlpha = 1.0;
        }

        if (cinAlpha > 0.001) {
          const cx = width / 2;
          const cy = height / 2;

          // Scale factor to adjust based on mobile vs desktop
          const radialScale = isMobile ? 0.7 : 1.0;

          // 1. Draw subtle radiating energy lines gently pulsing/waving outward
          const lineCount = 8;
          ctx.lineWidth = 1.0;
          for (let j = 0; j < lineCount; j++) {
            const angleOffset = (j * Math.PI * 2) / lineCount;
            // Slow, smooth rotation over time
            const lineAngle = angleOffset + elapsed * 0.1;
            
            // Starts slightly outside the logo bounds, expanding outward
            const rStart = (isMobile ? 30 : 50) + Math.sin(elapsed * 1.5 + j) * 4;
            const rEnd = rStart + (isMobile ? 50 : 90) + Math.cos(elapsed * 0.8 + j * 1.5) * 12;

            const x1 = cx + Math.cos(lineAngle) * rStart * radialScale;
            const y1 = cy + Math.sin(lineAngle) * rStart * 0.75 * radialScale; // slightly tilted plane
            const x2 = cx + Math.cos(lineAngle) * rEnd * radialScale;
            const y2 = cy + Math.sin(lineAngle) * rEnd * 0.75 * radialScale;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            // Ultra delicate soft fire glow
            ctx.strokeStyle = `rgba(212, 90, 18, ${0.11 * cinAlpha * (0.6 + 0.4 * Math.sin(elapsed * 2.0 + j))})`;
            ctx.stroke();

            // Tiny elegant glow nodes at the tip
            ctx.beginPath();
            ctx.arc(x2, y2, 0.9, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 163, 102, ${0.18 * cinAlpha})`;
            ctx.fill();
          }

          // 2. Draw soft orange particles orbiting the center logo
          const orbitCount = 18;
          for (let i = 0; i < orbitCount; i++) {
            // Distinct speeds and directions for organic complexity
            const direction = (i % 2 === 0) ? 1 : -1;
            const orbitSpeed = 0.3 + (i % 3) * 0.15;
            const angle = (i * Math.PI * 2) / orbitCount + elapsed * orbitSpeed * direction;
            
            // Dynamic radii for organic wave-like orbit behavior
            const baseRadius = (isMobile ? 45 : 75) + (i % 4) * (isMobile ? 12 : 22);
            const radius = baseRadius * (1.0 + 0.06 * Math.sin(elapsed * 1.8 + i));

            const px = cx + Math.cos(angle) * radius * radialScale;
            const py = cy + Math.sin(angle) * radius * 0.65 * radialScale; // tilted orbits create dimensional depth

            const pSize = 0.8 + (i % 3) * 0.5;
            
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            // Dynamic orange palette: lighter peach vs deep fire orange
            ctx.fillStyle = (i % 3 === 0) ? "#FFA366" : "#FF6B00";
            ctx.globalAlpha = (0.28 + (i % 3) * 0.14) * cinAlpha;
            ctx.fill();
          }
          ctx.globalAlpha = 1.0;
        }
      }

      // 4. LOGO COMPRESSION AND RECOIL PHYSICS
      let compressionFactor = 1.0;
      const triggers = [0.18, 0.33, 0.48, 0.63, 0.78];
      
      let activeTrigger = -1;
      for (let i = 0; i < triggers.length; i++) {
        const t = triggers[i];
        if (scrollVal >= t - 0.04 && scrollVal < t + 0.06) {
          activeTrigger = i;
          break;
        }
      }

      if (activeTrigger !== -1) {
        const t = triggers[activeTrigger];
        if (scrollVal < t) {
          // Tension compression build
          const prog = (scrollVal - (t - 0.04)) / 0.04;
          compressionFactor = 1.0 - prog * 0.16;
        } else {
          // Release recoil bounce
          const prog = (scrollVal - t) / 0.06;
          compressionFactor = 0.84 + prog * 0.16;
        }
      }

      // Update Centered Cleroy Logo Style with beautiful slowed-down elegant floating micro-motions
      if (logoRef.current) {
        const opacity = logoOpacity.get();
        const baseScale = logoScale.get();
        
        // Slowed down floating by 50% for high-end luxury feel
        const floatY = Math.sin(elapsed * 0.4) * 1.4;
        const floatX = Math.cos(elapsed * 0.25) * 0.7;
        const floatRot = Math.sin(elapsed * 0.3) * 0.4;
        
        const scale = baseScale * compressionFactor;
        
        // Multi-peak flash breathing glow at launch triggers
        const pulseFactor1 = Math.exp(-Math.pow((scrollVal - 0.18), 2) / 0.0016);
        const pulseFactor2 = Math.exp(-Math.pow((scrollVal - 0.33), 2) / 0.0016);
        const pulseFactor3 = Math.exp(-Math.pow((scrollVal - 0.48), 2) / 0.0016);
        const pulseFactor4 = Math.exp(-Math.pow((scrollVal - 0.63), 2) / 0.0016);
        const pulseFactor5 = Math.exp(-Math.pow((scrollVal - 0.78), 2) / 0.0016);
        const activePulse = Math.max(pulseFactor1, pulseFactor2, pulseFactor3, pulseFactor4, pulseFactor5);

        // Softened glow bounds for ultra-smooth rendering
        const glowBlur = (15 + Math.sin(elapsed * 0.7) * 2.5) + (activePulse * 12);
        const glowAlpha = (0.35 + Math.sin(elapsed * 0.7) * 0.05) + (activePulse * 0.30);
        
        // Gentle blur reduction during entrance (0.08 to 0.18)
        let blurPx = 0;
        if (scrollVal < 0.08) {
          blurPx = 8;
        } else if (scrollVal < 0.18) {
          blurPx = (1 - (scrollVal - 0.08) / 0.10) * 8;
        }
        
        logoRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) scale(${scale}) rotate(${floatRot}deg)`;
        logoRef.current.style.opacity = `${opacity}`;
        logoRef.current.style.filter = !isMobile && blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : "none";
      }

      // Helper to update card position, opacity, scale, rotation, and blur using a single continuous timeline
      const updateCardPhysics = (
        ref: React.RefObject<HTMLDivElement | null>,
        category: "ai" | "web" | "plat" | "brand" | "auto",
        cardIdx: number,
        startEmerging: number,
        fullExit: number
      ) => {
        if (!ref.current) return;

        // Active duration of the card flight lifecycle
        const lifespan = fullExit - startEmerging;
        const u = (scrollVal - startEmerging) / lifespan;

        if (u < 0 || u > 1) {
          // Outside active window: hide and skip heavy style updates to preserve performance
          ref.current.style.opacity = "0";
          ref.current.style.pointerEvents = "none";
          return;
        }

        // Apply our mathematically continuous interpolation parameter t_path
        // It has extreme linger/drift in the center (u = 0.5) and fast launch/exit speeds!
        const t_path = u + 0.14 * Math.sin(2 * Math.PI * u);

        // Get perfectly smooth continuous Bezier coordinates
        const currentPos = getCardBezierPath(category, cardIdx, t_path, activeScaleFactor);
        let posX = currentPos.x;
        let posY = currentPos.y;

        // Slow hover float during active linger phase (around t_path = 0.5)
        const activeFactor = Math.exp(-Math.pow((t_path - 0.5), 2) / 0.04); // peaks at 1.0 at t_path=0.5
        const floatX = Math.sin(elapsed * 1.0 + cardIdx * 1.5 + (category === "web" ? 2 : 0)) * 5 * activeFactor;
        const floatY = Math.cos(elapsed * 0.8 + cardIdx * 1.2 + (category === "web" ? 3 : 0)) * 5 * activeFactor;
        posX += floatX;
        posY += floatY;

        // Start, active, and exit rotations for physics bankings
        let startRotZ = 0, activeRotZ = 0, exitRotZ = 0;
        let startRotX = 0, activeRotX = 0, exitRotX = 0;
        let startRotY = 0, activeRotY = 0, exitRotY = 0;

        if (category === "ai") {
          if (cardIdx === 1) {
            startRotZ = 12; activeRotZ = -1.5; exitRotZ = -4;
            startRotX = 15; activeRotX = -10; exitRotX = -15;
            startRotY = 0; activeRotY = 0; exitRotY = 5;
          } else if (cardIdx === 2) {
            startRotZ = -15; activeRotZ = 2; exitRotZ = 8;
            startRotX = 20; activeRotX = 8; exitRotX = 12;
            startRotY = 0; activeRotY = -18; exitRotY = -30;
          } else {
            startRotZ = 15; activeRotZ = -2; exitRotZ = -8;
            startRotX = 20; activeRotX = 8; exitRotX = 12;
            startRotY = 0; activeRotY = 18; exitRotY = 30;
          }
        } else if (category === "web") {
          if (cardIdx === 1) {
            startRotZ = -14; activeRotZ = -1.2; exitRotZ = 4;
            startRotX = 18; activeRotX = -11; exitRotX = -16;
            startRotY = 0; activeRotY = 0; exitRotY = -5;
          } else if (cardIdx === 2) {
            startRotZ = -22; activeRotZ = 2; exitRotZ = 6;
            startRotX = 18; activeRotX = 8; exitRotX = 14;
            startRotY = 0; activeRotY = -18; exitRotY = -32;
          } else {
            startRotZ = 22; activeRotZ = -2; exitRotZ = -6;
            startRotX = 18; activeRotX = 8; exitRotX = 14;
            startRotY = 0; activeRotY = 18; exitRotY = 32;
          }
        } else if (category === "plat") {
          if (cardIdx === 1) {
            startRotZ = -15; activeRotZ = -2; exitRotZ = 5;
            startRotX = -15; activeRotX = 5; exitRotX = 10;
            startRotY = -20; activeRotY = 8; exitRotY = 15;
          } else if (cardIdx === 2) {
            startRotZ = 25; activeRotZ = 4; exitRotZ = -8;
            startRotX = -15; activeRotX = 5; exitRotX = 12;
            startRotY = -20; activeRotY = -15; exitRotY = -25;
          } else {
            startRotZ = -25; activeRotZ = -4; exitRotZ = 8;
            startRotX = -15; activeRotX = 5; exitRotX = 12;
            startRotY = -20; activeRotY = 15; exitRotY = 25;
          }
        } else if (category === "brand") {
          if (cardIdx === 1) {
            startRotZ = 5; activeRotZ = 0; exitRotZ = -2;
            startRotX = 5; activeRotX = -3; exitRotX = -8;
            startRotY = 0; activeRotY = 0; exitRotY = 3;
          } else if (cardIdx === 2) {
            startRotZ = -10; activeRotZ = -2; exitRotZ = 4;
            startRotX = 8; activeRotX = -3; exitRotX = 5;
            startRotY = 0; activeRotY = -5; exitRotY = -12;
          } else {
            startRotZ = 10; activeRotZ = 2; exitRotZ = -4;
            startRotX = 8; activeRotX = -3; exitRotX = 5;
            startRotY = 0; activeRotY = 5; exitRotY = 12;
          }
        } else { // auto
          if (cardIdx === 1) {
            startRotZ = -5; activeRotZ = -1.5; exitRotZ = 3;
            startRotX = 10; activeRotX = -8; exitRotX = -12;
            startRotY = 0; activeRotY = 0; exitRotY = -5;
          } else if (cardIdx === 2) {
            startRotZ = -15; activeRotZ = 4; exitRotZ = 10;
            startRotX = 10; activeRotX = -8; exitRotX = -14;
            startRotY = 0; activeRotY = -15; exitRotY = -25;
          } else {
            startRotZ = 15; activeRotZ = -4; exitRotZ = -10;
            startRotX = 10; activeRotX = -8; exitRotX = -14;
            startRotY = 0; activeRotY = 15; exitRotY = 25;
          }
        }

        const rotZ = getCubicBezier(t_path, startRotZ, activeRotZ, activeRotZ, exitRotZ);
        const rotX = getCubicBezier(t_path, startRotX, activeRotX, activeRotX, exitRotX);
        const rotY = getCubicBezier(t_path, startRotY, activeRotY, activeRotY, exitRotY);

        // Continuous scaling and 3D depth change
        const scaleVal = getCubicBezier(t_path, 0.0, 1.25, 1.15, 0.85);
        const zDepth = getCubicBezier(t_path, -400, -100, 0, 150);

        // Smooth Opacity Mapping
        let opacity = 0;
        if (t_path < 0.20) {
          opacity = t_path / 0.20;
        } else if (t_path > 0.70) {
          const t_fade = (t_path - 0.70) / 0.30;
          opacity = Math.cos(t_fade * Math.PI / 2);
        } else {
          opacity = 1.0;
        }

        // Write transforms with complete 3D hardware acceleration and zero layout shifts
        if (isMobile) {
          ref.current.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) scale(${scaleVal.toFixed(2)}) rotate(${rotZ.toFixed(1)}deg)`;
        } else {
          ref.current.style.transform = `perspective(1200px) translate3d(${posX}px, ${posY}px, ${zDepth}px) scale(${scaleVal}) rotate(${rotZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
        ref.current.style.opacity = `${opacity.toFixed(2)}`;
        ref.current.style.pointerEvents = opacity > 0.15 ? "auto" : "none";
      };

      // 5. Update Card Physics dynamically for all 5 categories
      updateCardPhysics(card1Ref, "ai", 1, 0.18, 0.33);
      updateCardPhysics(card2Ref, "ai", 2, 0.18, 0.33);
      updateCardPhysics(card3Ref, "ai", 3, 0.18, 0.33);

      updateCardPhysics(webCard1Ref, "web", 1, 0.33, 0.48);
      updateCardPhysics(webCard2Ref, "web", 2, 0.33, 0.48);
      updateCardPhysics(webCard3Ref, "web", 3, 0.33, 0.48);

      updateCardPhysics(platCard1Ref, "plat", 1, 0.48, 0.63);
      updateCardPhysics(platCard2Ref, "plat", 2, 0.48, 0.63);
      updateCardPhysics(platCard3Ref, "plat", 3, 0.48, 0.63);

      updateCardPhysics(brandCard1Ref, "brand", 1, 0.63, 0.78);
      updateCardPhysics(brandCard2Ref, "brand", 2, 0.63, 0.78);
      updateCardPhysics(brandCard3Ref, "brand", 3, 0.63, 0.78);

      updateCardPhysics(autoCard1Ref, "auto", 1, 0.78, 0.92);
      updateCardPhysics(autoCard2Ref, "auto", 2, 0.78, 0.92);
      updateCardPhysics(autoCard3Ref, "auto", 3, 0.78, 0.92);

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile, isNearViewport]);

  // Comprehensive Category Configuration List
  const categoriesList = [
    {
      key: "ai",
      title: "AI SOLUTIONS",
      startEmerging: 0.18,
      fullExit: 0.33,
      yOffset: 125,
    },
    {
      key: "web",
      title: "WEB EXPERIENCES",
      startEmerging: 0.33,
      fullExit: 0.48,
      yOffset: 135,
    },
    {
      key: "plat",
      title: "DIGITAL PLATFORMS",
      startEmerging: 0.48,
      fullExit: 0.63,
      yOffset: 125,
    },
    {
      key: "brand",
      title: "BRAND & DESIGN",
      startEmerging: 0.63,
      fullExit: 0.78,
      yOffset: 135,
    },
    {
      key: "auto",
      title: "AUTOMATION & INNOVATION",
      startEmerging: 0.78,
      fullExit: 0.92,
      yOffset: 130,
    },
  ];

  // Map of Card asset settings
  const categoryCards = [
    // Category 1: AI Solutions
    {
      catKey: "ai",
      idx: 1,
      ref: card1Ref,
      img: aiAssistantPurple,
      alt: "AI SYSTEM ASSISTANT",
      title: "AI System Assistant",
      description: "Adaptive cognitive interface for real-time decision intelligence.",
      aspect: "aspect-square",
      width: "w-[200px] md:w-[300px]",
      zIndex: 32,
    },
    {
      catKey: "ai",
      idx: 2,
      ref: card2Ref,
      img: sellerDashboardOrange,
      alt: "FORECASTING DASHBOARD",
      title: "Forecasting Dashboard",
      description: "Predictive analytics and real-time market telemetry.",
      aspect: "aspect-[4/3]",
      width: "w-[220px] md:w-[340px]",
      zIndex: 31,
    },
    {
      catKey: "ai",
      idx: 3,
      ref: card3Ref,
      img: aiBusinessAutomationOrange,
      alt: "INTELLIGENT WORKFLOWS",
      title: "Intelligent Workflows",
      description: "Automated neural agent orchestration at global scale.",
      aspect: "aspect-[4/5]",
      width: "w-[180px] md:w-[280px]",
      zIndex: 30,
    },

    // Category 2: Web Experiences
    {
      catKey: "web",
      idx: 1,
      ref: webCard1Ref,
      img: webExperience1,
      alt: "HAND INTERACTION",
      title: "Interactive WebGL",
      description: "Immersive 3D interaction and tactile sensory design.",
      aspect: "aspect-[4/3]",
      width: "w-[200px] md:w-[300px]",
      zIndex: 35,
    },
    {
      catKey: "web",
      idx: 2,
      ref: webCard2Ref,
      img: webExperience2,
      alt: "SaaS PLATFORM",
      title: "SaaS Platforms",
      description: "High-throughput cloud software engineered for performance.",
      aspect: "aspect-[4/3]",
      width: "w-[220px] md:w-[340px]",
      zIndex: 34,
    },
    {
      catKey: "web",
      idx: 3,
      ref: webCard3Ref,
      img: webExperience3,
      alt: "HI-RISE WEBSITE",
      title: "Digital Showcases",
      description: "Editorial web design built for global brand storytelling.",
      aspect: "aspect-[4/3]",
      width: "w-[200px] md:w-[300px]",
      zIndex: 33,
    },

    // Category 3: Digital Platforms
    {
      catKey: "plat",
      idx: 1,
      ref: platCard1Ref,
      img: digitalPlatform1,
      alt: "PLATFORM ARCHITECTURE",
      title: "Platform Architecture",
      description: "Modular micro-frontend architecture with instant state sync.",
      aspect: "aspect-square",
      width: "w-[200px] md:w-[300px]",
      zIndex: 38,
    },
    {
      catKey: "plat",
      idx: 2,
      ref: platCard2Ref,
      img: digitalPlatform2,
      alt: "ANALYTIC INSIGHTS",
      title: "Analytic Insights",
      description: "Deep data visualization with real-time stream processing.",
      aspect: "aspect-[4/3]",
      width: "w-[220px] md:w-[340px]",
      zIndex: 37,
    },
    {
      catKey: "plat",
      idx: 3,
      ref: platCard3Ref,
      img: digitalPlatform3,
      alt: "GLOBAL DISTRIBUTION",
      title: "Global Distribution",
      description: "Distributed edge deployment infrastructure with low latency.",
      aspect: "aspect-[4/3]",
      width: "w-[200px] md:w-[300px]",
      zIndex: 36,
    },

    // Category 4: Brand & Design
    {
      catKey: "brand",
      idx: 1,
      ref: brandCard1Ref,
      img: brandDesign1,
      alt: "BRAND IDENTITY",
      title: "Brand Identity",
      description: "Holistic design systems crafted for industry visionaries.",
      aspect: "aspect-[4/5]",
      width: "w-[180px] md:w-[280px]",
      zIndex: 41,
    },
    {
      catKey: "brand",
      idx: 2,
      ref: brandCard2Ref,
      img: brandDesign2,
      alt: "VISUAL SYSTEMS",
      title: "Visual Systems",
      description: "Scalable design tokens and cohesive multi-channel guidelines.",
      aspect: "aspect-[4/3]",
      width: "w-[220px] md:w-[340px]",
      zIndex: 40,
    },
    {
      catKey: "brand",
      idx: 3,
      ref: brandCard3Ref,
      img: brandDesign3,
      alt: "TYPE SCALE",
      title: "Editorial Typography",
      description: "Bespoke typographic rhythm and high-contrast editorial hierarchy.",
      aspect: "aspect-square",
      width: "w-[200px] md:w-[300px]",
      zIndex: 39,
    },

    // Category 5: Automation & Innovation
    {
      catKey: "auto",
      idx: 1,
      ref: autoCard1Ref,
      img: automationInnovation1,
      alt: "AUTONOMOUS FLOW",
      title: "Autonomous Flow",
      description: "Self-healing enterprise pipelines with proactive monitoring.",
      aspect: "aspect-[4/3]",
      width: "w-[200px] md:w-[300px]",
      zIndex: 44,
    },
    {
      catKey: "auto",
      idx: 2,
      ref: autoCard2Ref,
      img: automationInnovation2,
      alt: "CENTRAL PIPELINE",
      title: "Central Pipeline",
      description: "Unified data orchestration connecting legacy systems to AI.",
      aspect: "aspect-square",
      width: "w-[200px] md:w-[300px]",
      zIndex: 43,
    },
    {
      catKey: "auto",
      idx: 3,
      ref: autoCard3Ref,
      img: automationInnovation3,
      alt: "CONTINUOUS PIPELINE",
      title: "Continuous Integration",
      description: "Resilient automated deployment workflows for rapid iteration.",
      aspect: "aspect-[4/3]",
      width: "w-[220px] md:w-[340px]",
      zIndex: 42,
    }
  ];

  if (isMobile) {
    return <MobileServicesSection containerRef={containerRef} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#020202] flex flex-col justify-start overflow-visible z-20"
      id="story-cinematic-chapter2"
      style={{ height: "1000vh" }} // Perfectly balanced scroll height for immediate entry and buttery smooth progression
    >
      {/* Fixed full-screen viewing box for standard sticky performance */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020202]">
        
        {/* Soft Volumetric Background Ambient Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" />

        {/* Top/Bottom Seamless Canvas Edge Fade Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />

        {/* Dynamic canvas drawing glows, sparks and energy trails in background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* 1. "WHAT WE CREATE" INTRO CINEMATIC PANEL */}
        <motion.div
          style={{
            opacity: introOpacity,
            scale: introScale,
            filter: introBlur,
            y: introY,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-40 px-4 sm:px-6 max-w-4xl mx-auto"
        >
          <span className="text-[#D45A12] font-mono text-[10px] sm:text-[11px] tracking-[0.45em] uppercase block mb-2 sm:mb-4 font-bold">
            CHAPTER TWO
          </span>

          <h1 className="flex flex-row items-baseline justify-center text-center leading-[1.05] mb-6 sm:mb-10 select-none drop-shadow-[0_0_35px_rgba(255,255,255,0.15)] whitespace-nowrap gap-x-2.5 sm:gap-x-5 md:gap-x-6 text-[clamp(1.75rem,5.5vw,5.5rem)]">
            <span className="font-serif font-light text-white tracking-wider uppercase">
              WHAT WE
            </span>
            <span className="font-sans font-extrabold text-white tracking-tight uppercase">
              CREATE
            </span>
          </h1>

          <div className="flex flex-col space-y-2 sm:space-y-3.5 max-w-xl mx-auto">
            <p className="text-[#ECE5DC] font-serif text-[clamp(0.95rem,2vw,1.5rem)] font-normal leading-relaxed tracking-wide">
              Ideas become products.
            </p>
            <p className="text-[#ECE5DC] font-serif text-[clamp(0.95rem,2vw,1.5rem)] font-normal leading-relaxed tracking-wide">
              Products become platforms.
            </p>
            <p className="text-[#ECE5DC] font-serif text-[clamp(0.95rem,2vw,1.5rem)] font-normal leading-relaxed tracking-wide">
              Platforms become businesses.
            </p>
          </div>
        </motion.div>

        {/* 2. THE MAIN CONSTELLATION CONTAINER */}
        <motion.div 
          className="relative flex items-center justify-center w-full h-full"
          style={{
            opacity: stageExitOpacity,
            scale: stageExitScale,
          }}
        >
          {/* CENTERED FIXED LOGO - ENERGY CORE */}
          <div
            ref={logoRef}
            className="absolute z-40 flex items-center justify-center"
            style={{
              width: `${Math.round(150 * (isMobile ? 0.65 : scaleFactor))}px`,
              height: `${Math.round(150 * (isMobile ? 0.65 : scaleFactor))}px`,
            }}
          >
            <CleroyLogo size="xl" withGlow={true} hideText={true} />
          </div>

          {/* ALL 5 CATEGORIES TITLES - Emerge and travel downward out of the screen */}
          {categoriesList.map((cat) => (
            <StoryTitle
              key={`title-${cat.key}`}
              title={cat.title}
              scrollProgress={scrollProgress}
              scaleFactor={scaleFactor}
              startEmerging={cat.startEmerging}
              fullExit={cat.fullExit}
              finalYOffset={cat.yOffset}
            />
          ))}

          {/* ==================== ALL 15 IMAGE CARDS (5 Categories x 3 Cards) ==================== */}
          {categoryCards.map((card) => (
            <div
              key={`${card.catKey}-${card.idx}`}
              ref={card.ref}
              className={`absolute flex flex-col items-center justify-center group select-none ${card.width}`}
              style={{
                zIndex: card.zIndex,
                opacity: 0,
              }}
            >
              <div className={`relative w-full ${card.aspect} overflow-hidden rounded-xl border border-white/10 group-hover:border-[#FF9F55]/30 transition-colors duration-500 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.95)]`}>
                <ProjectCardImage src={card.img} alt={card.alt} title={card.title} description={card.description} />
              </div>
            </div>
          ))}

        </motion.div>

      </div>
    </div>
  );
});

interface MobileServicesSectionProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  isCore: boolean;
  pulsePhase: number;
  depth: number;
  targets: Array<{ x: number; y: number }>;
}

interface EnergyPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

const MODULE_DATA = [
  {
    id: "mod-ai",
    number: "01",
    categoryLabel: "COGNITIVE ARCHITECTURE",
    title: "AI SOLUTIONS",
    shortDesc: "Adaptive cognitive interfaces, custom LLM pipelines, and retrieval-augmented neural agents engineered for enterprise scale.",
    techs: ["LLM OPS", "NEURAL AGENTS", "RAG ENGINE"],
  },
  {
    id: "mod-web",
    number: "02",
    categoryLabel: "INTERACTIVE SURFACES",
    title: "WEB EXPERIENCES",
    shortDesc: "Immersive 60 FPS digital surfaces, tactile micro-interactions, and editorial web showcases for global visionaries.",
    techs: ["WEBGL 2.0", "CUSTOM SHADERS", "TACTILE UI"],
  },
  {
    id: "mod-plat",
    number: "03",
    categoryLabel: "DISTRIBUTED SYSTEMS",
    title: "DIGITAL PLATFORMS",
    shortDesc: "High-throughput cloud architecture, modular micro-frontends, and edge-distributed service meshes with real-time state sync.",
    techs: ["MICRO-FRONTEND", "SERVICE MESH", "EDGE CDN"],
  },
  {
    id: "mod-auto",
    number: "04",
    categoryLabel: "AUTONOMOUS FLOWS",
    title: "AUTOMATION",
    shortDesc: "Self-healing event pipelines, continuous integration workflows, and real-time ETL data orchestration.",
    techs: ["SELF-HEALING", "ETL PIPELINE", "CI/CD ORCHESTRATION"],
  },
  {
    id: "mod-brand",
    number: "05",
    categoryLabel: "VISUAL SYSTEMS",
    title: "BRAND & DESIGN",
    shortDesc: "Mathematical typography scales, holistic design systems, and multi-channel design tokens for industry visionaries.",
    techs: ["DESIGN TOKENS", "TYPE SCALE", "GOLDEN RATIO"],
  },
];

function createNeuralParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const isCore = i % 7 === 0;
    const depth = 0.35 + (i % 5) * 0.16;

    // Module 0: AI Solutions - Synaptic Brain Core
    const a0 = (i / count) * Math.PI * 8;
    const r0 = 0.05 + (i % 9) * 0.038;
    const m0x = 0.5 + Math.cos(a0) * r0;
    const m0y = 0.38 + Math.sin(a0) * r0 * 0.8;

    // Module 1: Web Experiences - Undulating Surface Grid
    const col1 = i % 10;
    const row1 = Math.floor(i / 10);
    const m1x = 0.12 + (col1 / 9) * 0.76;
    const m1y = 0.22 + (row1 / 11) * 0.36 + Math.sin(col1 * 0.7 + row1) * 0.04;

    // Module 2: Digital Platforms - Distributed Micro-Hubs
    const hubIndex = i % 3;
    const hubCenters = [
      { x: 0.26, y: 0.32 },
      { x: 0.74, y: 0.30 },
      { x: 0.50, y: 0.52 },
    ];
    const hub = hubCenters[hubIndex];
    const r2 = (i % 7) * 0.032;
    const a2 = (i * 2.4) % (Math.PI * 2);
    const m2x = hub.x + Math.cos(a2) * r2;
    const m2y = hub.y + Math.sin(a2) * r2;

    // Module 3: Automation - Event Pipelines
    const lane = i % 4;
    const stepInLane = Math.floor(i / 4) / 28;
    const m3x = 0.12 + stepInLane * 0.76;
    const m3y = 0.22 + lane * 0.11 + stepInLane * 0.04;

    // Module 4: Brand & Design - Golden Spiral
    const phi = (1 + Math.sqrt(5)) / 2;
    const theta = (i * 2 * Math.PI) / phi;
    const rSpiral = Math.sqrt(i / count) * 0.34;
    const m4x = 0.5 + Math.cos(theta) * rSpiral;
    const m4y = 0.38 + Math.sin(theta) * rSpiral;

    particles.push({
      x: m0x,
      y: m0y,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: isCore ? 3.5 * depth : 1.8 * depth,
      baseAlpha: isCore ? 0.95 : 0.35 + (i % 4) * 0.15,
      isCore,
      pulsePhase: Math.random() * Math.PI * 2,
      depth,
      targets: [
        { x: m0x, y: m0y },
        { x: m1x, y: m1y },
        { x: m2x, y: m2y },
        { x: m3x, y: m3y },
        { x: m4x, y: m4y },
      ],
    });
  }
  return particles;
}

function MobileServicesSection({ containerRef }: MobileServicesSectionProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = containerRef || localRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(true);

  // Scroll Progress value ref to avoid re-binding canvas loop on every state change
  const scrollValRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollValRef.current = latest;
    const idx = Math.min(4, Math.max(0, Math.floor(latest * 5)));
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  // IntersectionObserver to pause loop when off-screen
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetRef]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isNearViewport) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles = createNeuralParticles(110);
    let pulses: EnergyPulse[] = [];

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Scroll interpolation across 5 modules
      const scroll = scrollValRef.current;
      const progressMapped = Math.min(4, Math.max(0, scroll * 5));
      const prevModule = Math.floor(progressMapped);
      const nextModule = Math.min(4, prevModule + 1);
      const tSegment = progressMapped - prevModule;
      // Smooth step
      const smoothT = tSegment * tSegment * (3 - 2 * tSegment);

      // Active pairs for energy pulse spawning
      const activeConnections: Array<[number, number, number, number, number, number]> = [];

      // Update particle positions towards current morph targets
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const targetA = p.targets[prevModule];
        const targetB = p.targets[nextModule];

        const targetX = (targetA.x + (targetB.x - targetA.x) * smoothT) * width;
        const targetY = (targetA.y + (targetB.y - targetA.y) * smoothT) * height;

        // Subtle ambient organic drift
        const driftX = Math.sin(elapsed * 1.2 + p.pulsePhase) * 1.5;
        const driftY = Math.cos(elapsed * 0.9 + p.pulsePhase) * 1.5;

        // Smooth physics spring/lerp towards target
        p.x += (targetX + driftX - p.x) * 0.08;
        p.y += (targetY + driftY - p.y) * 0.08;
      }

      // Proximity threshold for line connections
      const maxDist = Math.min(width, height) * 0.28;
      const maxDistSq = maxDist * maxDist;

      // Draw Proximity Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.35 * Math.min(p1.baseAlpha, p2.baseAlpha);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 128, 43, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();

            // Store connection for energy pulse
            if (lineAlpha > 0.1) {
              activeConnections.push([i, j, p1.x, p1.y, p2.x, p2.y]);
            }
          }
        }
      }

      // Maintain ~18 active flowing energy pulses along connections
      if (pulses.length < 18 && activeConnections.length > 0) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        pulses.push({
          fromIdx: conn[0],
          toIdx: conn[1],
          progress: 0,
          speed: 0.015 + Math.random() * 0.025,
        });
      }

      // Update & Draw Energy Pulses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const p1 = particles[pulse.fromIdx];
        const p2 = particles[pulse.toIdx];

        if (p1 && p2) {
          const px = p1.x + (p2.x - p1.x) * pulse.progress;
          const py = p1.y + (p2.y - p1.y) * pulse.progress;
          const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.85;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 216, 160, ${pulseAlpha.toFixed(2)})`;
          ctx.shadowColor = "#FF802B";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Particles & Core Node Pulsing Halos
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Core Nodes Pulsing Ring
        if (p.isCore) {
          const ringR = p.radius + 3 + Math.sin(elapsed * 2.5 + p.pulsePhase) * 2.5;
          const ringAlpha = 0.25 + Math.sin(elapsed * 2.5 + p.pulsePhase) * 0.15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 128, 43, ${ringAlpha.toFixed(2)})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Ambient Node Glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(212, 90, 18, 0.15)";
          ctx.fill();
        }

        // Particle Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isCore
          ? `rgba(255, 160, 85, ${p.baseAlpha})`
          : `rgba(245, 239, 231, ${p.baseAlpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isNearViewport]);

  const currentModule = MODULE_DATA[activeIndex];

  return (
    <section
      ref={targetRef}
      id="story-cinematic-chapter2"
      className="relative w-full bg-[#020202] text-[#F5EFE7] z-20"
      style={{ height: "500vh" }}
    >
      {/* Fixed Sticky Full-Screen Mobile Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center py-6 px-5 overflow-hidden bg-[#020202]">
        
        {/* Fullscreen Living Neural Network Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Ambient Orange Lighting Radial Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.18)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" />

        {/* Top/Bottom Subtle Gradient Overlays for Seamless Edge Blending */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#020202] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none z-10" />

        {/* Top Section Badge & Indicator */}
        <div className="relative z-20 w-full flex flex-col items-center text-center space-y-1 pt-1 pointer-events-none">
          <span className="text-[#D45A12] font-mono text-[9px] tracking-[0.38em] uppercase font-bold">
            CHAPTER TWO // WHAT WE CREATE
          </span>
          <span className="font-serif text-xs sm:text-sm font-light text-white/90 tracking-widest uppercase">
            LIVING NEURAL ENGINE
          </span>
        </div>

        {/* Right Edge Sticky Indicator Dots */}
        <div className="fixed right-3.5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 pointer-events-none">
          {MODULE_DATA.map((mod, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={mod.id}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-2.5 h-2.5 bg-[#FF802B] shadow-[0_0_12px_#FF802B] scale-125"
                    : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            );
          })}
        </div>

        {/* Center Editorial Module Presentation (Overlaying Network) */}
        <div className="relative z-20 w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center pointer-events-none px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-3.5"
            >
              {/* Module Tag & Line */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF802B] shadow-[0_0_8px_#FF802B]" />
                <span className="font-mono text-[9px] tracking-[0.3em] font-bold uppercase text-[#D45A12]">
                  MODULE {currentModule.number} // {currentModule.categoryLabel}
                </span>
              </motion.div>

              {/* Title (Fades Upward) */}
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="text-3xl sm:text-4xl font-serif font-normal text-white uppercase tracking-wider leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {currentModule.title}
              </motion.h2>

              {/* Subtitle / Paragraph (Appears Afterward) */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                className="text-[#C5B9AD] font-sans text-xs sm:text-sm font-light leading-relaxed max-w-xs text-center tracking-wide"
              >
                {currentModule.shortDesc}
              </motion.p>

              {/* Technology Pills (Slide Upward Individually) */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1 max-w-xs">
                {currentModule.techs.map((tech, pillIdx) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.32 + pillIdx * 0.08,
                    }}
                    className="font-mono text-[9px] tracking-wider px-2.5 py-1 rounded-full bg-[#D45A12]/10 border border-[#D45A12]/30 text-[#FFD8A0] font-medium shadow-[0_0_12px_rgba(212,90,18,0.15)]"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom System Status Bar */}
        <div className="relative z-20 w-full max-w-xs flex items-center justify-between text-[10px] font-mono border-t border-white/10 pt-3 pb-1 text-[#B8ACA0] pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF802B] animate-pulse" />
            <span className="font-bold text-[#FF802B] uppercase tracking-wider">
              NETWORK MORPH ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">0{activeIndex + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/40">05</span>
          </div>
        </div>

      </div>
    </section>
  );
}

