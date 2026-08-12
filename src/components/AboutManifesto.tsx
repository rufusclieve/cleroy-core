import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useAdaptivePerformance } from "../utils/useAdaptivePerformance";
import CoreMethodologyCinematic from "./CoreMethodologyCinematic";

export default function AboutManifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isMobile, isTablet, particleMultiplier, shadowBlurMultiplier } = useAdaptivePerformance();

  // Set up smooth scroll tracking across the deep scroll section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Inertial spring smooth scroll progress for Apple-grade fluid motions
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 26,
    restDelta: 0.0005,
  });

  const activeScrollProgress = isMobile ? scrollYProgress : scrollProgress;

  // --------------------------------------------------------------------------
  // STEP 1: Small Orange Label ("ABOUT CLEROY")
  // --------------------------------------------------------------------------
  const labelOpacity = useTransform(activeScrollProgress, [0.0, 0.03, 0.88, 0.94], [0, 1, 1, 0]);
  const labelY = useTransform(activeScrollProgress, [0.0, 0.03, 0.88, 0.94], [20, 0, 0, -20]);

  // --------------------------------------------------------------------------
  // STEP 2: Oversized Editorial Manifesto Words ("WE BUILD WHAT OTHERS IMAGINE.")
  // --------------------------------------------------------------------------
  const word1Opacity = useTransform(activeScrollProgress, [0.02, 0.05], [0, 1]);
  const word1Scale = useTransform(activeScrollProgress, [0.02, 0.05], [0.82, 1]);
  const word1Blur = useTransform(activeScrollProgress, [0.02, 0.05], [16, 0]);
  const word1Y = useTransform(activeScrollProgress, [0.02, 0.05], [30, 0]);

  const word2Opacity = useTransform(activeScrollProgress, [0.05, 0.08], [0, 1]);
  const word2Scale = useTransform(activeScrollProgress, [0.05, 0.08], [0.82, 1]);
  const word2Blur = useTransform(activeScrollProgress, [0.05, 0.08], [16, 0]);
  const word2Y = useTransform(activeScrollProgress, [0.05, 0.08], [30, 0]);

  const word3Opacity = useTransform(activeScrollProgress, [0.08, 0.11], [0, 1]);
  const word3Scale = useTransform(activeScrollProgress, [0.08, 0.11], [0.82, 1]);
  const word3Blur = useTransform(activeScrollProgress, [0.08, 0.11], [16, 0]);
  const word3Y = useTransform(activeScrollProgress, [0.08, 0.11], [30, 0]);

  const word4Opacity = useTransform(activeScrollProgress, [0.11, 0.15], [0, 1]);
  const word4Scale = useTransform(activeScrollProgress, [0.11, 0.15], [0.82, 1]);
  const word4Blur = useTransform(activeScrollProgress, [0.11, 0.15], [16, 0]);
  const word4Y = useTransform(activeScrollProgress, [0.11, 0.15], [30, 0]);

  // Scale down manifesto slightly & fade out
  const manifestoContainerScale = useTransform(activeScrollProgress, [0.15, 0.20], [1.0, 0.75]);
  const manifestoContainerY = useTransform(activeScrollProgress, [0.15, 0.20], [0, -60]);
  const manifestoContainerOpacity = useTransform(activeScrollProgress, [0.15, 0.21], [1.0, 0.0]);

  // --------------------------------------------------------------------------
  // STEP 3: Company Philosophy - Line-by-line reveal
  // --------------------------------------------------------------------------
  const philVisibility = useTransform(activeScrollProgress, [0.18, 0.33], [1, 1]);

  const philLine1Opacity = useTransform(activeScrollProgress, [0.19, 0.22, 0.29, 0.32], [0, 1, 1, 0]);
  const philLine1Y = useTransform(activeScrollProgress, [0.19, 0.22, 0.29, 0.32], [25, 0, 0, -20]);
  const philLine1Blur = useTransform(activeScrollProgress, [0.19, 0.22, 0.29, 0.32], [10, 0, 0, 8]);

  const philLine2Opacity = useTransform(activeScrollProgress, [0.22, 0.25, 0.29, 0.32], [0, 1, 1, 0]);
  const philLine2Y = useTransform(activeScrollProgress, [0.22, 0.25, 0.29, 0.32], [25, 0, 0, -20]);
  const philLine2Blur = useTransform(activeScrollProgress, [0.22, 0.25, 0.29, 0.32], [10, 0, 0, 8]);

  const philLine3Opacity = useTransform(activeScrollProgress, [0.25, 0.28, 0.29, 0.32], [0, 1, 1, 0]);
  const philLine3Y = useTransform(activeScrollProgress, [0.25, 0.28, 0.29, 0.32], [25, 0, 0, -20]);
  const philLine3Blur = useTransform(activeScrollProgress, [0.25, 0.28, 0.29, 0.32], [10, 0, 0, 8]);

  const philLine4Opacity = useTransform(activeScrollProgress, [0.28, 0.31, 0.29, 0.32], [0, 1, 1, 0]);
  const philLine4Y = useTransform(activeScrollProgress, [0.28, 0.31, 0.29, 0.32], [25, 0, 0, -20]);
  const philLine4Blur = useTransform(activeScrollProgress, [0.28, 0.31, 0.29, 0.32], [10, 0, 0, 8]);

  // --------------------------------------------------------------------------
  // STEP 4: CHAPTER 02 // OUR VISION
  // --------------------------------------------------------------------------
  const visionVisibility = useTransform(activeScrollProgress, [0.32, 0.47], [1, 1]);

  const visionLabelOpacity = useTransform(activeScrollProgress, [0.33, 0.36, 0.44, 0.47], [0, 1, 1, 0]);
  const visionLabelY = useTransform(activeScrollProgress, [0.33, 0.36, 0.44, 0.47], [20, 0, 0, -15]);

  const visionHeadingOpacity = useTransform(activeScrollProgress, [0.34, 0.37, 0.44, 0.47], [0, 1, 1, 0]);
  const visionHeadingY = useTransform(activeScrollProgress, [0.34, 0.37, 0.44, 0.47], [30, 0, 0, -20]);

  const visionLineWidth = useTransform(activeScrollProgress, [0.35, 0.39, 0.44, 0.47], ["0%", "100%", "100%", "0%"]);

  const visionBody1Opacity = useTransform(activeScrollProgress, [0.36, 0.39, 0.44, 0.47], [0, 1, 1, 0]);
  const visionBody1Y = useTransform(activeScrollProgress, [0.36, 0.39, 0.44, 0.47], [20, 0, 0, -15]);
  const visionBody1Blur = useTransform(activeScrollProgress, [0.36, 0.39, 0.44, 0.47], [8, 0, 0, 6]);

  const visionBody2Opacity = useTransform(activeScrollProgress, [0.38, 0.41, 0.44, 0.47], [0, 1, 1, 0]);
  const visionBody2Y = useTransform(activeScrollProgress, [0.38, 0.41, 0.44, 0.47], [20, 0, 0, -15]);
  const visionBody2Blur = useTransform(activeScrollProgress, [0.38, 0.41, 0.44, 0.47], [8, 0, 0, 6]);

  const visionBody3Opacity = useTransform(activeScrollProgress, [0.40, 0.43, 0.44, 0.47], [0, 1, 1, 0]);
  const visionBody3Y = useTransform(activeScrollProgress, [0.40, 0.43, 0.44, 0.47], [20, 0, 0, -15]);
  const visionBody3Blur = useTransform(activeScrollProgress, [0.40, 0.43, 0.44, 0.47], [8, 0, 0, 6]);

  // --------------------------------------------------------------------------
  // STEP 5: CHAPTER 03 // OUR MISSION (Reveals from Opposite Direction)
  // --------------------------------------------------------------------------
  const missionVisibility = useTransform(activeScrollProgress, [0.46, 0.61], [1, 1]);

  const missionLabelOpacity = useTransform(activeScrollProgress, [0.47, 0.50, 0.57, 0.60], [0, 1, 1, 0]);
  const missionLabelX = useTransform(activeScrollProgress, [0.47, 0.50, 0.57, 0.60], [35, 0, 0, -25]);

  const missionHeadingOpacity = useTransform(activeScrollProgress, [0.48, 0.51, 0.57, 0.60], [0, 1, 1, 0]);
  const missionHeadingX = useTransform(activeScrollProgress, [0.48, 0.51, 0.57, 0.60], [45, 0, 0, -30]);

  const missionLineWidth = useTransform(activeScrollProgress, [0.49, 0.53, 0.57, 0.60], ["0%", "100%", "100%", "0%"]);

  const missionBody1Opacity = useTransform(activeScrollProgress, [0.50, 0.53, 0.57, 0.60], [0, 1, 1, 0]);
  const missionBody1X = useTransform(activeScrollProgress, [0.50, 0.53, 0.57, 0.60], [30, 0, 0, -20]);
  const missionBody1Blur = useTransform(activeScrollProgress, [0.50, 0.53, 0.57, 0.60], [8, 0, 0, 6]);

  const missionBody2Opacity = useTransform(activeScrollProgress, [0.52, 0.55, 0.57, 0.60], [0, 1, 1, 0]);
  const missionBody2X = useTransform(activeScrollProgress, [0.52, 0.55, 0.57, 0.60], [30, 0, 0, -20]);
  const missionBody2Blur = useTransform(activeScrollProgress, [0.52, 0.55, 0.57, 0.60], [8, 0, 0, 6]);

  const missionBody3Opacity = useTransform(activeScrollProgress, [0.54, 0.57, 0.57, 0.60], [0, 1, 1, 0]);
  const missionBody3X = useTransform(activeScrollProgress, [0.54, 0.57, 0.57, 0.60], [30, 0, 0, -20]);
  const missionBody3Blur = useTransform(activeScrollProgress, [0.54, 0.57, 0.57, 0.60], [8, 0, 0, 6]);

  // --------------------------------------------------------------------------
  // STEP 6: TRANSITION - Orange divider line extends down & dissolves into particles
  // --------------------------------------------------------------------------
  const dividerLineScaleY = useTransform(activeScrollProgress, [0.59, 0.64, 0.68], [0, 1, 1]);
  const dividerLineOpacity = useTransform(activeScrollProgress, [0.59, 0.64, 0.66, 0.69], [0, 0.9, 0.7, 0]);

  // --------------------------------------------------------------------------
  // STEP 7: THREE GIANT EDITORIAL STATEMENTS: THINK / ENGINEER / DELIVER
  // --------------------------------------------------------------------------
  const statementsOpacity = useTransform(activeScrollProgress, [0.66, 0.71, 0.84, 0.88], [0, 1, 1, 0]);
  const statementsY = useTransform(activeScrollProgress, [0.66, 0.71, 0.84, 0.88], [35, 0, 0, -25]);
  const blueprintDrawProgress = useTransform(activeScrollProgress, [0.67, 0.81], [0, 1]);

  const thinkOpacity = useTransform(activeScrollProgress, [0.68, 0.72], [0, 1]);
  const thinkY = useTransform(activeScrollProgress, [0.68, 0.72], [20, 0]);

  const engineerOpacity = useTransform(activeScrollProgress, [0.72, 0.76], [0, 1]);
  const engineerY = useTransform(activeScrollProgress, [0.72, 0.76], [20, 0]);

  const deliverOpacity = useTransform(activeScrollProgress, [0.76, 0.80], [0, 1]);
  const deliverY = useTransform(activeScrollProgress, [0.76, 0.80], [20, 0]);

  // --------------------------------------------------------------------------
  // STEP 8: FINAL STATEMENT ("Ideas deserve exceptional engineering.")
  // --------------------------------------------------------------------------
  const finalStatementOpacity = useTransform(activeScrollProgress, [0.86, 0.91, 0.96, 1.0], [0, 1, 1, 0]);
  const finalStatementY = useTransform(activeScrollProgress, [0.86, 0.91, 0.96, 1.0], [35, 0, 0, -25]);
  const finalStatementScale = useTransform(activeScrollProgress, [0.86, 0.91, 0.96, 1.0], [0.94, 1.0, 1.0, 0.97]);

  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "500px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Canvas loop handling:
  // 1. Drifting floating ambient particles during Chapter 02 & Chapter 03
  // 2. Vertical line dissolving into streaming particles during transition (0.62 to 0.70)
  // 3. Blueprint S-curve particles for THINK → ENGINEER → DELIVER (0.67 to 0.88)
  useEffect(() => {
    if (!isNearViewport || isMobile) return;
    let animationFrameId: number;
    let startTime = Date.now();

    // Floating particles state initialization
    const floatParticles = Array.from({ length: 24 }).map(() => ({
      xRatio: Math.random(),
      yRatio: Math.random(),
      radius: 1 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.04,
      speedY: -0.02 - Math.random() * 0.03,
      alpha: 0.2 + Math.random() * 0.6,
    }));

    const getCubic = (p0: number, p1: number, p2: number, p3: number, t: number) => {
      const oneMinusT = 1 - t;
      return (
        oneMinusT * oneMinusT * oneMinusT * p0 +
        3 * oneMinusT * oneMinusT * t * p1 +
        3 * oneMinusT * t * t * p2 +
        t * t * t * p3
      );
    };

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(renderCanvas);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameId = requestAnimationFrame(renderCanvas);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const sp = scrollProgress.get();
      const elapsed = (Date.now() - startTime) / 1000;

      // ----------------------------------------------------------------------
      // PHASE 1: Floating ambient particles around Chapter 02 (Vision) & Chapter 03 (Mission)
      // (sp: 0.32 to 0.62)
      // ----------------------------------------------------------------------
      if (sp >= 0.32 && sp <= 0.62) {
        const floatFade = Math.min((sp - 0.32) / 0.04, Math.min(1, (0.62 - sp) / 0.04));

        floatParticles.forEach((p) => {
          p.xRatio += p.speedX * 0.016;
          p.yRatio += p.speedY * 0.016;

          if (p.yRatio < 0) p.yRatio = 1;
          if (p.xRatio < 0) p.xRatio = 1;
          if (p.xRatio > 1) p.xRatio = 0;

          const px = p.xRatio * width;
          const py = p.yRatio * height;

          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha * floatFade;
          ctx.fillStyle = "#FF9F55";
          ctx.shadowColor = "#D45A12";
          ctx.shadowBlur = isMobile ? 0 : 6;
          ctx.fill();
        });
      }

      // ----------------------------------------------------------------------
      // PHASE 2: Transition Divider Line Dissolve into Streaming Particles
      // (sp: 0.62 to 0.70)
      // ----------------------------------------------------------------------
      if (sp >= 0.62 && sp <= 0.70) {
        const transFade = Math.min((sp - 0.62) / 0.03, Math.min(1, (0.70 - sp) / 0.03));
        const streamCount = isMobile ? 10 : 20;
        const lineBottomY = height * 0.45;
        const lineTopY = height * 0.15;

        for (let i = 0; i < streamCount; i++) {
          const progress = (elapsed * 0.35 + i / streamCount) % 1;
          const px = width * 0.50 + Math.sin(progress * Math.PI * 4 + i) * (15 + progress * 40);
          const py = lineTopY + (lineBottomY + height * 0.25 - lineTopY) * progress;

          ctx.beginPath();
          ctx.arc(px, py, 2 + Math.random() * 1.5, 0, Math.PI * 2);
          ctx.globalAlpha = (1 - progress * 0.5) * transFade * 0.85;
          ctx.fillStyle = "#FF9F55";
          ctx.shadowColor = "#FF9F55";
          ctx.shadowBlur = isMobile ? 0 : 8;
          ctx.fill();
        }
      }

      // ----------------------------------------------------------------------
      // PHASE 3: Blueprint S-curve particles for THINK → ENGINEER → DELIVER
      // (sp: 0.66 to 0.88)
      // ----------------------------------------------------------------------
      if (sp >= 0.66 && sp <= 0.88) {
        const fadeAlpha = Math.min((sp - 0.66) / 0.04, Math.min(1, (0.88 - sp) / 0.04));

        const pTHINK = { x: width * 0.20, y: height * 0.24 };
        const pENGINEER = { x: width * 0.50, y: height * 0.50 };
        const pDELIVER = { x: width * 0.80, y: height * 0.76 };

        const cp1A = { x: width * 0.38, y: height * 0.26 };
        const cp1B = { x: width * 0.44, y: height * 0.48 };

        const cp2A = { x: width * 0.56, y: height * 0.52 };
        const cp2B = { x: width * 0.62, y: height * 0.74 };

        const particleCount = isMobile ? 5 : 10;

        // Path 1 (THINK -> ENGINEER)
        for (let i = 0; i < particleCount; i++) {
          const t = (elapsed * 0.2 + i / particleCount) % 1;
          const rawX = getCubic(pTHINK.x, cp1A.x, cp1B.x, pENGINEER.x, t);
          const rawY = getCubic(pTHINK.y, cp1A.y, cp1B.y, pENGINEER.y, t);

          const nextX = getCubic(pTHINK.x, cp1A.x, cp1B.x, pENGINEER.x, Math.min(1, t + 0.02));
          const nextY = getCubic(pTHINK.y, cp1A.y, cp1B.y, pENGINEER.y, Math.min(1, t + 0.02));
          const tangentAngle = Math.atan2(nextY - rawY, nextX - rawX) + Math.PI / 2;

          const driftDist = Math.sin(elapsed * 2.2 + i * 1.8) * (2.5 + (i % 3) * 1.5);
          const px = rawX + Math.cos(tangentAngle) * driftDist;
          const py = rawY + Math.sin(tangentAngle) * driftDist;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.globalAlpha = 0.85 * fadeAlpha;
          ctx.fillStyle = "#FF9F55";
          ctx.shadowColor = "#FF9F55";
          ctx.shadowBlur = isMobile ? 0 : 10;
          ctx.fill();
        }

        // Path 2 (ENGINEER -> DELIVER)
        for (let i = 0; i < particleCount; i++) {
          const t = (elapsed * 0.2 + (i + 0.5) / particleCount) % 1;
          const rawX = getCubic(pENGINEER.x, cp2A.x, cp2B.x, pDELIVER.x, t);
          const rawY = getCubic(pENGINEER.y, cp2A.y, cp2B.y, pDELIVER.y, t);

          const nextX = getCubic(pENGINEER.x, cp2A.x, cp2B.x, pDELIVER.x, Math.min(1, t + 0.02));
          const nextY = getCubic(pENGINEER.y, cp2A.y, cp2B.y, pDELIVER.y, Math.min(1, t + 0.02));
          const tangentAngle = Math.atan2(nextY - rawY, nextX - rawX) + Math.PI / 2;

          const driftDist = Math.sin(elapsed * 2.5 + i * 2.1) * (2.5 + (i % 3) * 1.5);
          const px = rawX + Math.cos(tangentAngle) * driftDist;
          const py = rawY + Math.sin(tangentAngle) * driftDist;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.globalAlpha = 0.85 * fadeAlpha;
          ctx.fillStyle = "#FF9F55";
          ctx.shadowColor = "#FF9F55";
          ctx.shadowBlur = isMobile ? 0 : 10;
          ctx.fill();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(renderCanvas);
    };

    animationFrameId = requestAnimationFrame(renderCanvas);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollProgress, isNearViewport]);

  // 22 deterministic floating particles matching desktop atmospheric color depth
  const mobileParticles = React.useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const size = 2 + (i % 3) * 1.2;
      const left = `${(i * 19 + 7) % 88 + 6}%`;
      const top = `${(i * 23 + 13) % 88 + 6}%`;
      const duration = 16 + (i % 5) * 3;
      const delay = -(i * 1.4);
      const opacity = 0.35 + (i % 4) * 0.12;
      const color = i % 4 === 0 ? "#FF9D2E" : i % 4 === 1 ? "#FF7A00" : i % 4 === 2 ? "#E85002" : "#FF802B";
      const dx = ((i % 5) - 2) * 24;
      const dy = -28 - (i % 4) * 18;
      return { id: i, size, left, top, duration, delay, opacity, color, dx, dy };
    });
  }, []);

  if (isMobile) {
    return <MobileAboutSection containerRef={containerRef} activeScrollProgress={activeScrollProgress} />;
  }

  return (
    <section
      ref={containerRef}
      id="about-manifesto"
      className="relative w-full bg-[#020202] text-[#F5EFE7] selection:bg-[#D45A12]/30 selection:text-[#FFD8A0]"
      style={{ height: "900vh" }} // Deep scroll canvas for unhurried, cinematic pacing
    >
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#020202] px-6 sm:px-12 md:px-20 z-10">
        
        {/* Continuous Atmospheric Ambient Background Gradients & Edge Bleeds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,90,18,0.06)_0%,rgba(2,2,2,0)_70%)] pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#F5EFE7_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" />

        {/* Top/Bottom Seamless Canvas Edge Fade Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />

        {/* Global Canvas Overlay for Ambient Particles & Transitions */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-15" />

        {/* ------------------------------------------------------------------ */}
        {/* 1. SMALL ORANGE LABEL: ABOUT CLEROY (CENTERED) */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="absolute top-8 sm:top-10 md:top-12 lg:top-14 z-30 text-center pointer-events-none"
        >
          <span className="font-mono text-xs sm:text-sm tracking-[0.45em] text-[#D45A12] uppercase font-bold">
            ABOUT CLEROY
          </span>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. OVERSIZED EDITORIAL MANIFESTO: "WE BUILD WHAT OTHERS IMAGINE." */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{
            scale: manifestoContainerScale,
            y: manifestoContainerY,
            opacity: manifestoContainerOpacity,
          }}
          className="relative z-20 flex flex-col items-center justify-center text-center max-w-5xl pointer-events-none select-none my-auto"
        >
          {/* WE BUILD */}
          <motion.div
            style={{
              opacity: word1Opacity,
              scale: word1Scale,
              y: word1Y,
              filter: useTransform(word1Blur, (b) => `blur(${b}px)`),
            }}
            className="font-serif text-[clamp(2.25rem,5.2vw,6.25rem)] font-light text-[#F5EFE7] tracking-tight leading-[0.95]"
          >
            WE BUILD
          </motion.div>

          {/* WHAT */}
          <motion.div
            style={{
              opacity: word2Opacity,
              scale: word2Scale,
              y: word2Y,
              filter: useTransform(word2Blur, (b) => `blur(${b}px)`),
            }}
            className="font-serif text-[clamp(2.25rem,5.2vw,6.25rem)] font-light text-[#F5EFE7] tracking-tight leading-[0.95] my-0.5 sm:my-1"
          >
            WHAT
          </motion.div>

          {/* OTHERS */}
          <motion.div
            style={{
              opacity: word3Opacity,
              scale: word3Scale,
              y: word3Y,
              filter: useTransform(word3Blur, (b) => `blur(${b}px)`),
            }}
            className="font-serif text-[clamp(2.25rem,5.2vw,6.25rem)] font-light text-[#F5EFE7] tracking-tight leading-[0.95]"
          >
            OTHERS
          </motion.div>

          {/* IMAGINE. (Orange Italic) */}
          <motion.div
            style={{
              opacity: word4Opacity,
              scale: word4Scale,
              y: word4Y,
              filter: useTransform(word4Blur, (b) => `blur(${b}px)`),
            }}
            className="font-serif italic text-[clamp(2.25rem,5.2vw,6.25rem)] font-normal text-[#D45A12] tracking-tight leading-[0.95] mt-1 sm:mt-2 drop-shadow-[0_0_35px_rgba(212,90,18,0.3)]"
          >
            IMAGINE.
          </motion.div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. COMPANY PHILOSOPHY: REVEALED AS A SINGLE ELEGANT PARAGRAPH */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{ opacity: philVisibility }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-12 pointer-events-none"
        >
          <div className="max-w-3xl text-center">
            <motion.p
              style={{
                opacity: philLine1Opacity,
                y: philLine1Y,
                filter: useTransform(philLine1Blur, (b) => `blur(${b}px)`),
              }}
              className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#F5EFE7] font-light leading-relaxed sm:leading-relaxed md:leading-relaxed tracking-wide max-w-3xl mx-auto"
            >
              We engineer intelligent digital products that combine strategy, design, and technology to create experiences that solve real-world problems and move businesses forward.
            </motion.p>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. VISION */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{ opacity: visionVisibility }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-12 pointer-events-none"
        >
          <div className="max-w-3xl flex flex-col items-center text-center space-y-4 sm:space-y-6">
            <motion.h2
              style={{ opacity: visionHeadingOpacity, y: visionHeadingY }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl text-[#F5EFE7] font-light tracking-wide uppercase leading-none pt-2 sm:pt-4"
            >
              VISION
            </motion.h2>

            {/* Thin growing orange horizontal line */}
            <div className="w-28 sm:w-36 h-[1.5px] relative overflow-hidden my-2 sm:my-3">
              <motion.div
                style={{ width: visionLineWidth }}
                className="h-full bg-gradient-to-r from-transparent via-[#D45A12] to-transparent mx-auto"
              />
            </div>

            {/* Body text revealed line-by-line */}
            <div className="pt-2 space-y-2 text-center max-w-2xl">
              <motion.p
                style={{
                  opacity: visionBody1Opacity,
                  y: visionBody1Y,
                  filter: useTransform(visionBody1Blur, (b) => `blur(${b}px)`),
                }}
                className="font-sans text-lg sm:text-2xl text-[#F5EFE7] font-light leading-relaxed tracking-wide"
              >
                To shape the future through intelligent engineering,
              </motion.p>
              <motion.p
                style={{
                  opacity: visionBody2Opacity,
                  y: visionBody2Y,
                  filter: useTransform(visionBody2Blur, (b) => `blur(${b}px)`),
                }}
                className="font-sans text-lg sm:text-2xl text-[#B8ACA0] font-light leading-relaxed tracking-wide"
              >
                purposeful innovation, and technology
              </motion.p>
              <motion.p
                style={{
                  opacity: visionBody3Opacity,
                  y: visionBody3Y,
                  filter: useTransform(visionBody3Blur, (b) => `blur(${b}px)`),
                }}
                className="font-sans text-lg sm:text-2xl text-[#FF9F55] font-light leading-relaxed tracking-wide italic"
              >
                that creates lasting impact.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 5. MISSION */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{ opacity: missionVisibility }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-12 pointer-events-none"
        >
          <div className="max-w-3xl flex flex-col items-center text-center space-y-4 sm:space-y-6">
            <motion.h2
              style={{ opacity: missionHeadingOpacity, x: missionHeadingX }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl text-[#F5EFE7] font-light tracking-wide uppercase leading-none pt-2 sm:pt-4"
            >
              MISSION
            </motion.h2>

            {/* Thin growing orange horizontal line */}
            <div className="w-28 sm:w-36 h-[1.5px] relative overflow-hidden my-2 sm:my-3">
              <motion.div
                style={{ width: missionLineWidth }}
                className="h-full bg-gradient-to-r from-transparent via-[#D45A12] to-transparent mx-auto"
              />
            </div>

            {/* Body text revealed line-by-line from opposite direction */}
            <div className="pt-2 space-y-2 text-center max-w-2xl">
              <motion.p
                style={{
                  opacity: missionBody1Opacity,
                  x: missionBody1X,
                  filter: useTransform(missionBody1Blur, (b) => `blur(${b}px)`),
                }}
                className="font-sans text-lg sm:text-2xl text-[#F5EFE7] font-light leading-relaxed tracking-wide"
              >
                To design and deliver intelligent digital experiences
              </motion.p>
              <motion.p
                style={{
                  opacity: missionBody2Opacity,
                  x: missionBody2X,
                  filter: useTransform(missionBody2Blur, (b) => `blur(${b}px)`),
                }}
                className="font-sans text-lg sm:text-2xl text-[#B8ACA0] font-light leading-relaxed tracking-wide"
              >
                with clarity, precision,
              </motion.p>
              <motion.p
                style={{
                  opacity: missionBody3Opacity,
                  x: missionBody3X,
                  filter: useTransform(missionBody3Blur, (b) => `blur(${b}px)`),
                }}
                className="font-sans text-lg sm:text-2xl text-[#FF9F55] font-light leading-relaxed tracking-wide italic"
              >
                and exceptional engineering.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 6. TRANSITION: VERTICAL DIVIDER LINE EXTENDING DOWNWARD & DISSOLVING */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{ opacity: dividerLineOpacity }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="w-[1.5px] h-48 bg-gradient-to-b from-[#D45A12] via-[#FF9F55] to-transparent relative origin-top">
            <motion.div
              style={{ scaleY: dividerLineScaleY }}
              className="w-full h-full bg-[#D45A12] origin-top drop-shadow-[0_0_12px_rgba(212,90,18,0.5)]"
            />
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 7. CINEMATIC CORE METHODOLOGY: THINK / ENGINEER / DELIVER */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{ opacity: statementsOpacity, y: statementsY }}
          className="absolute inset-0 z-20 w-full h-full pointer-events-auto"
        >
          <CoreMethodologyCinematic />
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* 8. FINAL STATEMENT: "Ideas deserve exceptional engineering." */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          style={{
            opacity: finalStatementOpacity,
            y: finalStatementY,
            scale: finalStatementScale,
          }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 sm:px-12 pointer-events-none"
        >
          <div className="max-w-4xl text-center space-y-4">
            <h2 className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F5EFE7] tracking-tight leading-[1.1] font-light">
              Ideas deserve <br className="hidden sm:inline" />
              <span className="font-normal not-italic text-[#D45A12] drop-shadow-[0_0_30px_rgba(212,90,18,0.25)]">
                exceptional engineering.
              </span>
            </h2>

            <div className="pt-6">
              <span className="inline-block w-12 h-[1px] bg-[#D45A12]/40 rounded-full" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

type MobileScene =
  | "about"
  | "intro-para"
  | "vision"
  | "mission"
  | "methodology"
  | "closing";

function getSceneFromProgress(p: number): MobileScene {
  if (p < 0.12) return "about";
  if (p < 0.25) return "intro-para";
  if (p < 0.38) return "vision";
  if (p < 0.51) return "mission";
  if (p < 0.88) return "methodology";
  return "closing";
}

function MobileAboutSection({
  containerRef,
  activeScrollProgress,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeScrollProgress: any;
}) {
  const [activeScene, setActiveScene] = useState<MobileScene>(() => {
    return getSceneFromProgress(activeScrollProgress?.get?.() || 0);
  });

  useMotionValueEvent(activeScrollProgress, "change", (latest: number) => {
    const nextScene = getSceneFromProgress(latest);
    setActiveScene((prev) => (prev !== nextScene ? nextScene : prev));
  });

  const mobileParticles = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const size = 1.5 + (i % 3) * 1.0;
      const cx = `${(i * 17 + 9) % 86 + 7}%`;
      const cy = `${(i * 23 + 11) % 86 + 7}%`;
      const color = i % 3 === 0 ? "#FF9F55" : i % 3 === 1 ? "#D45A12" : "#FF802B";
      const opacity = 0.25 + (i % 4) * 0.12;
      const dx = ((i % 5) - 2) * 18;
      const dy = -22 - (i % 4) * 14;
      const duration = 12 + (i % 4) * 3;
      const delay = -(i * 1.2);
      return { id: i, size, cx, cy, color, opacity, dx, dy, duration, delay };
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="about-manifesto"
      className="relative w-full bg-[#020202] text-[#F5EFE7] selection:bg-[#D45A12]/30 selection:text-[#FFD8A0]"
      style={{ height: "800vh" }}
    >
      <style>{`
        @keyframes mobileParticleDrift {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(var(--dx), var(--dy), 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#020202] px-6 z-20">
        
        {/* Volumetric Radial Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.18)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,128,43,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

        {/* Top & Bottom Subtle Fade Gradients */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#020202] to-transparent pointer-events-none z-30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none z-30" />

        {/* 24 SVG Floating Particles */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {mobileParticles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: p.cx,
                top: p.cy,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                ["--dx" as any]: `${p.dx}px`,
                ["--dy" as any]: `${p.dy}px`,
                animation: `mobileParticleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
                willChange: "transform",
              }}
            />
          ))}
        </div>

        {/* AnimatePresence with mode="wait" guarantees exit before enter */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            {activeScene === "about" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-col items-center space-y-2 mb-2">
                  <span className="font-mono text-[10px] tracking-[0.40em] text-[#D45A12] uppercase font-bold">
                    ABOUT CLEROY
                  </span>
                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF802B] to-transparent" />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex flex-wrap items-center justify-center gap-x-2.5">
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#F5EFE7] tracking-tight uppercase">
                      WE
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#F5EFE7] tracking-tight uppercase">
                      BUILD
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#F5EFE7] tracking-tight uppercase">
                      WHAT
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-2.5">
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#F5EFE7] tracking-tight uppercase">
                      OTHERS
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-normal italic text-[#D45A12] tracking-tight uppercase drop-shadow-[0_0_24px_rgba(212,90,18,0.45)]">
                      IMAGINE.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeScene === "intro-para" && (
              <div className="max-w-xs sm:max-w-sm space-y-4">
                <p className="font-sans text-sm sm:text-base text-[#C5B9AD] font-light leading-relaxed tracking-wide">
                  We engineer intelligent digital products that combine strategy, design, and technology to create experiences that solve real-world problems and move businesses forward.
                </p>
                <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D45A12] to-transparent mx-auto" />
              </div>
            )}

            {activeScene === "vision" && (
              <div className="max-w-xs sm:max-w-sm flex flex-col items-center space-y-3">
                <span className="font-mono text-[9px] tracking-[0.38em] text-[#D45A12] uppercase font-bold">
                  CHAPTER 01 // OUR VISION
                </span>
                <h3 className="font-serif text-4xl sm:text-5xl font-light text-[#F5EFE7] tracking-wider uppercase leading-tight">
                  VISION
                </h3>
                <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D45A12] to-transparent mx-auto my-1" />
                <p className="font-sans text-sm sm:text-base text-[#C5B9AD] font-light leading-relaxed tracking-wide">
                  To shape the future through intelligent engineering, purposeful innovation, and technology that creates <span className="text-[#FF9F55] italic font-normal">lasting impact</span>.
                </p>
              </div>
            )}

            {activeScene === "mission" && (
              <div className="max-w-xs sm:max-w-sm flex flex-col items-center space-y-3">
                <span className="font-mono text-[9px] tracking-[0.38em] text-[#FF9F55] uppercase font-bold">
                  CHAPTER 02 // OUR MISSION
                </span>
                <h3 className="font-serif text-4xl sm:text-5xl font-light text-[#F5EFE7] tracking-wider uppercase leading-tight">
                  MISSION
                </h3>
                <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF9F55] to-transparent mx-auto my-1" />
                <p className="font-sans text-sm sm:text-base text-[#C5B9AD] font-light leading-relaxed tracking-wide">
                  To design and deliver intelligent digital experiences with clarity, precision, and <span className="text-[#FF9F55] italic font-normal">exceptional engineering</span>.
                </p>
              </div>
            )}

            {activeScene === "methodology" && (
              <div className="w-full h-full absolute inset-0 pointer-events-auto">
                <CoreMethodologyCinematic />
              </div>
            )}

            {activeScene === "closing" && (
              <div className="max-w-xs sm:max-w-sm space-y-4">
                <h2 className="font-serif italic text-2xl sm:text-3xl text-[#F5EFE7] tracking-tight leading-snug font-light">
                  Ideas deserve{" "}
                  <span className="font-normal not-italic text-[#D45A12] drop-shadow-[0_0_24px_rgba(212,90,18,0.4)]">
                    exceptional engineering.
                  </span>
                </h2>
                <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#D45A12] to-transparent mx-auto" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
