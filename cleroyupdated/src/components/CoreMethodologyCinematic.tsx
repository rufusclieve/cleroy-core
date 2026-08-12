import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const WORDS = ["THINK", "ENGINEER", "DELIVER"];

export default function CoreMethodologyCinematic() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // IntersectionObserver to pause loop when scrolled out of viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cycle active word continuously every 3.6 seconds
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Particle Canvas Engine
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Sample particle target coordinates for words on offscreen canvas
    const sampleWordTargets = (text: string, count: number) => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 600;
      offCanvas.height = 180;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return [];

      offCtx.font = "bold 64px serif";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";
      offCtx.fillText(text, 300, 90);

      const imgData = offCtx.getImageData(0, 0, 600, 180).data;
      const pts: Array<{ x: number; y: number }> = [];

      const step = 2;
      for (let y = 0; y < 180; y += step) {
        for (let x = 0; x < 600; x += step) {
          const alpha = imgData[(y * 600 + x) * 4 + 3];
          if (alpha > 128) {
            pts.push({
              x: (x - 300) * 1.25,
              y: (y - 90) * 1.25,
            });
          }
        }
      }

      if (pts.length === 0) {
        return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
      }

      const result: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < count; i++) {
        const pt = pts[Math.floor((i / count) * pts.length)];
        result.push(pt);
      }
      return result;
    };

    const particleCount = 320;
    const wordTargetsMap = WORDS.map((w) => sampleWordTargets(w, particleCount));

    // Particle Array Initialization
    const particles = Array.from({ length: particleCount }).map((_, i) => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 1.2 + Math.random() * 2.0,
      color: i % 3 === 0 ? "#FFD8A0" : i % 3 === 1 ? "#FF802B" : "#D45A12",
      alpha: 0.35 + Math.random() * 0.65,
      spinSpeed: (Math.random() - 0.5) * 0.08,
      spinRadius: 40 + Math.random() * 120,
    }));

    // Drifting background particles
    const bgParticles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.25,
      radius: 1.0 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.45,
    }));

    // Expanding Energy Pulse Rings
    let pulseRings: Array<{ r: number; alpha: number; speed: number; maxR: number }> = [];
    let lastWordIndex = activeWordIndex;

    let cycleStartTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Render Drifting Background Particles
      bgParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF802B";
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Word change detection: trigger pulse ring
      if (lastWordIndex !== activeWordIndex) {
        lastWordIndex = activeWordIndex;
        cycleStartTime = now;
        pulseRings.push({ r: 20, alpha: 0.95, speed: 4.2, maxR: Math.max(width, height) * 0.45 });
      }

      // Draw pulse rings radiating out from circular core center
      for (let i = pulseRings.length - 1; i >= 0; i--) {
        const ring = pulseRings[i];
        ring.r += ring.speed;
        ring.alpha -= 0.015;
        if (ring.alpha <= 0 || ring.r > ring.maxR) {
          pulseRings.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 128, 43, ${ring.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = "#FF802B";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      const cycleElapsed = (now - cycleStartTime) % 3600;
      const currentTargets = wordTargetsMap[activeWordIndex];

      // Update & Draw Morphing Particles
      particles.forEach((p, i) => {
        const t = currentTargets[i] || { x: 0, y: 0 };
        const targetX = cx + t.x;
        const targetY = cy + t.y;

        if (cycleElapsed > 2600) {
          // SWIRL / BREAK PHASE: particles break from word shape, swirl in vortex around center
          const angle = Math.atan2(p.y - cy, p.x - cx) + p.spinSpeed;
          const dist = p.spinRadius + Math.sin(now * 0.002 + i) * 30;
          const swirlX = cx + Math.cos(angle) * dist;
          const swirlY = cy + Math.sin(angle) * dist;

          p.x += (swirlX - p.x) * 0.12;
          p.y += (swirlY - p.y) * 0.12;
        } else {
          // FORMING & HOLD PHASE: particles spring smoothly to text target points
          p.x += (targetX - p.x) * 0.10;
          p.y += (targetY - p.y) * 0.10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        if (cycleElapsed < 2400) {
          ctx.shadowColor = "#FF802B";
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeWordIndex, isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden bg-[#020202] select-none pointer-events-auto"
    >
      {/* Background Engineering Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50 z-0" />

      {/* Soft Orange Spotlight Behind Center Word */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,128,43,0.22)_0%,rgba(212,90,18,0.06)_50%,transparent_75%)] pointer-events-none z-0" />

      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* TOP: CHAPTER 03 // CORE METHODOLOGY */}
      <div className="absolute top-10 sm:top-14 md:top-16 z-30 flex flex-col items-center space-y-2 pointer-events-none px-4">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.40em] text-[#D45A12] uppercase font-bold drop-shadow-[0_0_12px_rgba(212,90,18,0.4)]">
          CHAPTER 03 // CORE METHODOLOGY
        </span>
        <div className="w-16 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF802B] to-transparent" />
      </div>

      {/* CENTER: GLOWING CIRCULAR CORE & ANIMATED WORD */}
      <div className="relative z-30 flex items-center justify-center">
        {/* Single Glowing Circular Core */}
        <div className="w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full relative flex items-center justify-center border border-[#FF802B]/30 bg-[radial-gradient(circle,rgba(255,128,43,0.15)_0%,rgba(212,90,18,0.03)_60%,transparent_85%)] shadow-[0_0_80px_rgba(212,90,18,0.25),inset_0_0_60px_rgba(255,128,43,0.12)]">
          {/* Rotating Dashed Core Accent Ring */}
          <div className="absolute -inset-3 sm:-inset-4 md:-inset-5 rounded-full border border-dashed border-[#D45A12]/30 animate-[spin_45s_linear_infinite] pointer-events-none" />

          {/* Soft Outer Pulse Aura Ring */}
          <div className="absolute -inset-1 rounded-full border border-[#FF9F55]/20 animate-pulse pointer-events-none" />

          {/* Animated Words Sequence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={WORDS[activeWordIndex]}
              initial={{ scale: 0.82, opacity: 0, filter: "blur(14px)" }}
              animate={{ scale: 1.0, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.22, opacity: 0, filter: "blur(18px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center text-center select-none"
            >
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#F5EFE7] tracking-[0.18em] uppercase leading-none drop-shadow-[0_0_35px_rgba(255,128,43,0.6)]">
                {WORDS[activeWordIndex]}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
