import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import CleroyButton from "./CleroyButton";

interface ContinuousParticle {
  x: number;
  y: number;
  z: number; // Depth layer: 0.4 (far back), 0.9 (mid), 1.8 (foreground)
  size: number;
  vy: number;
  vxAngle: number;
  vxSpeed: number;
  alpha: number;
  baseAlpha: number;
  glow: boolean;
  seed: number;
}

export default function LetsBuildSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "600px 0px 600px 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Micro-glow states for background oversized typography (reacts subtle to passing particles)
  const [wordGlows, setWordGlows] = useState({
    lets: 0.06,
    build: 0.07,
    create: 0.05,
    engineer: 0.05,
    innovate: 0.06,
  });

  const handleStartProject = () => {
    window.dispatchEvent(new CustomEvent("open-cleroy-discovery"));
  };

  // Continuous falling particle stream canvas simulation with DPR & ResizeObserver awareness
  useEffect(() => {
    if (!isNearViewport) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) return;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const isMobileLocal = width < 640;
      dpr = isMobileLocal ? 1 : Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Stratified particle pool adapted for viewport density
    const count = isMobile ? 40 : 160;
    const particles: ContinuousParticle[] = [];
    const numBuckets = isMobile ? 8 : 14;
    const bucketWidth = Math.max(1, width / numBuckets);

    for (let i = 0; i < count; i++) {
      const zRand = Math.random();
      const z = zRand < 0.25 ? 0.4 : zRand < 0.75 ? 0.9 : 1.8;
      const size = z > 1.2 ? Math.random() * 2.2 + 1.8 : z > 0.6 ? Math.random() * 1.4 + 1.1 : Math.random() * 0.9 + 0.5;
      const vy = (Math.random() * 0.8 + 0.5) * (z > 1.2 ? 1.6 : z < 0.6 ? 0.7 : 1.1);
      const alpha = z > 1.2 ? Math.random() * 0.35 + 0.35 : Math.random() * 0.25 + 0.12;

      const bucketIndex = i % numBuckets;
      const baseX = bucketIndex * bucketWidth + Math.random() * bucketWidth;

      particles.push({
        x: Math.max(5, Math.min(width - 5, baseX)),
        y: Math.random() * height,
        z,
        size,
        vy,
        vxAngle: Math.random() * Math.PI * 2,
        vxSpeed: Math.random() * 0.25 + 0.05,
        alpha,
        baseAlpha: alpha,
        glow: z > 1.2,
        seed: Math.random() * 100,
      });
    }

    let isPaused = false;
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let timeSecs = 0;

    const render = () => {
      if (isPaused) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      timeSecs += 0.016;
      ctx.clearRect(0, 0, width, height);

      let letsCount = 0;
      let buildCount = 0;
      let createCount = 0;
      let engineerCount = 0;
      let innovateCount = 0;

      particles.forEach((p) => {
        if (!p) return;
        p.y += p.vy;
        p.vxAngle += 0.02;
        p.x += Math.sin(p.vxAngle + p.seed) * p.vxSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        if (p.x < width * 0.4 && p.y < height * 0.4) letsCount++;
        if (p.x > width * 0.5 && p.y > height * 0.5) buildCount++;
        if (p.x > width * 0.5 && p.y < height * 0.4) createCount++;
        if (p.x < width * 0.4 && p.y > height * 0.3 && p.y < height * 0.7) engineerCount++;
        if (p.x < width * 0.6 && p.y > height * 0.6) innovateCount++;

        ctx.save();
        if (p.glow) {
          if (!isMobile) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(232, 80, 2, 0.7)";
          }
          ctx.fillStyle = `rgba(255, 122, 0, ${p.alpha})`;
        } else if (p.z < 0.6) {
          ctx.fillStyle = `rgba(232, 80, 2, ${p.alpha * 0.6})`;
        } else {
          ctx.fillStyle = `rgba(232, 80, 2, ${p.alpha})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Throttle React state updates so Framer Motion doesn't re-render on every scroll frame
      if (!isMobile && Math.floor(timeSecs * 60) % 30 === 0) {
        const nextLets = +(0.05 + Math.min(0.04, letsCount * 0.003)).toFixed(2);
        const nextBuild = +(0.06 + Math.min(0.04, buildCount * 0.003)).toFixed(2);
        const nextCreate = +(0.05 + Math.min(0.03, createCount * 0.003)).toFixed(2);
        const nextEngineer = +(0.04 + Math.min(0.03, engineerCount * 0.003)).toFixed(2);
        const nextInnovate = +(0.05 + Math.min(0.04, innovateCount * 0.003)).toFixed(2);

        setWordGlows((prev) => {
          if (
            Math.abs(prev.lets - nextLets) < 0.015 &&
            Math.abs(prev.build - nextBuild) < 0.015
          ) {
            return prev;
          }
          return {
            lets: nextLets,
            build: nextBuild,
            create: nextCreate,
            engineer: nextEngineer,
            innovate: nextInnovate,
          };
        });
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isNearViewport]);

  return (
    <section 
      ref={containerRef}
      id="lets-build"
      className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[68vh] py-[clamp(4rem,10vh,12rem)] px-[clamp(1rem,4vw,3.5rem)] bg-[#020202] text-[#F5EFE7] overflow-hidden flex flex-col items-center justify-center text-center select-none"
    >
      {/* Soft Ambient Volumetric Orange Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[55vh] max-w-[1200px] bg-[#E85002]/8 rounded-full blur-[200px] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" aria-hidden="true" />

      {/* Top/Bottom Seamless Canvas Edge Fade Overlays */}
      <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" aria-hidden="true" />

      {/* Subtle Film Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 
        ======================================================
        CONTINUOUS DOWNWARD FALLING PARTICLE STREAM CANVAS
        Renders BEHIND background typography (z-[1])
        ======================================================
      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* 
        ======================================================
        BACKGROUND: SCATTERED OVERSIZED TYPOGRAPHY
        Renders IN FRONT OF canvas (z-[2]), WITH micro-proximity lighting
        ======================================================
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        
        {/* "LET'S" - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: -20 }}
          whileInView={{ x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          animate={{
            y: [0, -12, 0],
            x: [0, 8, 0],
            opacity: wordGlows.lets,
          }}
          /* @ts-ignore - motion animate loop */
          transition={{
            y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8, ease: "linear" },
          }}
          style={{
            filter: `drop-shadow(0 0 25px rgba(232,80,2,${wordGlows.lets * 1.5}))`,
          }}
          className="absolute -top-6 -left-6 sm:-top-16 sm:-left-12 font-sans text-[clamp(3.5rem,15vw,16vw)] font-black tracking-tighter text-[#F5EFE7] leading-none uppercase select-none transition-all duration-700"
        >
          LET'S
        </motion.div>

        {/* "BUILD" - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 30 }}
          whileInView={{ x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
            opacity: wordGlows.build,
          }}
          /* @ts-ignore - motion animate loop */
          transition={{
            y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8, ease: "linear" },
          }}
          style={{
            filter: `drop-shadow(0 0 30px rgba(232,80,2,${wordGlows.build * 2}))`,
          }}
          className="absolute -bottom-8 -right-6 sm:-bottom-20 sm:-right-16 font-sans text-[clamp(4rem,17vw,18vw)] font-black tracking-tighter text-[#E85002] leading-none uppercase select-none transition-all duration-700"
        >
          BUILD
        </motion.div>

        {/* "CREATE" - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          animate={{
            y: [0, -18, 0],
            opacity: wordGlows.create,
          }}
          /* @ts-ignore - motion animate loop */
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            opacity: { duration: 0.8, ease: "linear" },
          }}
          className="absolute top-2 -right-8 sm:top-8 sm:-right-20 font-serif text-[clamp(3rem,13vw,15vw)] italic font-light tracking-tight text-[#F5EFE7] leading-none uppercase select-none transition-all duration-700"
        >
          CREATE
        </motion.div>

        {/* "ENGINEER" - Center Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          animate={{
            x: [0, 12, 0],
            opacity: wordGlows.engineer,
          }}
          /* @ts-ignore - motion animate loop */
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            opacity: { duration: 0.8, ease: "linear" },
          }}
          className="absolute top-1/2 -translate-y-1/2 -left-12 sm:-left-28 font-mono text-[clamp(2rem,9vw,11vw)] font-bold tracking-widest text-[#B8ACA0] leading-none uppercase select-none transition-all duration-700"
        >
          ENGINEER
        </motion.div>

        {/* "INNOVATE" - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          animate={{
            y: [0, 10, 0],
            opacity: wordGlows.innovate,
          }}
          /* @ts-ignore - motion animate loop */
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            opacity: { duration: 0.8, ease: "linear" },
          }}
          className="absolute -bottom-4 left-1/4 font-sans text-[clamp(2.5rem,11vw,13vw)] font-extrabold tracking-tight text-[#F5EFE7] leading-none uppercase select-none transition-all duration-700"
        >
          INNOVATE
        </motion.div>

      </div>

      {/* 
        ======================================================
        FOREGROUND CONTENT (MINIMAL & ELEVATED - z-10)
        ======================================================
      */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center space-y-[clamp(1.5rem,4vh,2.5rem)]">
        
        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[clamp(0.25em,0.4em,0.5em)] text-[#E85002] uppercase font-bold flex items-center gap-2 bg-[#E85002]/10 border border-[#E85002]/20 px-[clamp(0.85rem,2.5vw,1.25rem)] py-[clamp(0.35rem,1vh,0.5rem)] rounded-full backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E85002] flex-shrink-0" />
          <span>READY WHEN YOU ARE</span>
        </motion.div>

        {/* Large Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[clamp(2.25rem,8.5vw,9.5rem)] font-extrabold tracking-tight text-[#F5EFE7] uppercase leading-[0.95] max-w-full break-words"
        >
          LET'S <span className="text-[#E85002]">BUILD</span>
        </motion.h2>

        {/* One Short Supporting Sentence */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[clamp(1rem,2vw,1.5rem)] text-[#B8ACA0] font-light max-w-2xl leading-relaxed text-center"
        >
          Turn ambitious ideas into digital experiences.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2 sm:pt-4 w-full sm:w-auto flex justify-center"
        >
          <CleroyButton
            variant="primary"
            size="lg"
            onClick={handleStartProject}
            className="w-full sm:w-auto min-h-[48px] px-8 sm:px-10 text-sm sm:text-base tracking-wider font-mono font-bold"
          >
            START YOUR PROJECT
          </CleroyButton>
        </motion.div>

      </div>
    </section>
  );
}
