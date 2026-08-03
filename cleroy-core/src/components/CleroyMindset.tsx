import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useAdaptivePerformance } from "../utils/useAdaptivePerformance";

// Standard easing helpers for fluid cinematic transition curves
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
};

interface ParticlePoint {
  x: number;
  y: number;
}

interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  noiseOffset: number;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  pulseOffset: number;
}

interface NeuralSpark {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

interface VolumetricSmoke {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  phase: number;
}

interface ForegroundEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

// Samples words into a collection of coordinates for particle typographic forming
function sampleWordPixels(
  word: string,
  count: number,
  isImpactPeak: boolean
): ParticlePoint[] {
  const canvas = document.createElement("canvas");
  canvas.width = 650;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx || canvas.width <= 0 || canvas.height <= 0) {
    return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // High-end display typography size
  const fontSize = isImpactPeak ? 74 : 84;
  ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(word, canvas.width / 2, canvas.height / 2);

  if (canvas.width <= 0 || canvas.height <= 0) {
    return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  }
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const candidates: ParticlePoint[] = [];

  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const idx = (y * canvas.width + x) * 4;
      if (imgData.data[idx] > 120) {
        candidates.push({
          x: x - canvas.width / 2,
          y: y - canvas.height / 2,
        });
      }
    }
  }

  // Fallback coords if canvas isn't fully ready
  if (candidates.length === 0) {
    for (let i = 0; i < count; i++) {
      candidates.push({
        x: (Math.random() - 0.5) * 260,
        y: (Math.random() - 0.5) * 60,
      });
    }
  }

  // Extract exactly 'count' evenly spaced coordinates
  const points: ParticlePoint[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor((i / count) * candidates.length) % candidates.length;
    points.push({ ...candidates[idx] });
  }

  return points;
}

export default React.memo(function CleroyMindset() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ready, setReady] = useState(false);
  const { isMobile, isTablet, isLowEnd, particleMultiplier } = useAdaptivePerformance();

  const BASE_PARTICLE_COUNT = 850;
  const PARTICLE_COUNT = Math.max(180, Math.round(BASE_PARTICLE_COUNT * particleMultiplier));
  const wordPointsRef = useRef<{
    imagine: ParticlePoint[];
    create: ParticlePoint[];
    evolve: ParticlePoint[];
    impact: ParticlePoint[];
  }>({ imagine: [], create: [], evolve: [], impact: [] });

  // Persistent metadata pool for natural orbital flight paths
  const particleMetaRef = useRef<{
    angleOffset: number;
    orbitRadiusX: number;
    orbitRadiusY: number;
    orbitDirection: number;
    orbitSpeed: number;
    size: number;
    brightness: number;
  }[]>([]);

  // Cinematic background refs
  const ambientParticlesRef = useRef<BackgroundParticle[]>([]);
  const neuralNodesRef = useRef<NeuralNode[]>([]);
  const neuralSparksRef = useRef<NeuralSpark[]>([]);
  const smokeBlobsRef = useRef<VolumetricSmoke[]>([]);
  const foregroundEmbersRef = useRef<ForegroundEmber[]>([]);

  if (particleMetaRef.current.length === 0) {
    const meta = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      meta.push({
        angleOffset: Math.random() * Math.PI * 2,
        orbitRadiusX: 120 + Math.random() * 220,
        orbitRadiusY: 60 + Math.random() * 100,
        orbitDirection: Math.random() > 0.5 ? 1 : -1,
        orbitSpeed: 0.4 + Math.random() * 0.6,
        size: 0.7 + Math.random() * 1.3,
        brightness: 0.4 + Math.random() * 0.6,
      });
    }
    particleMetaRef.current = meta;
  }

  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "600px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;
    if (wordPointsRef.current.imagine && wordPointsRef.current.imagine.length > 0) {
      setReady(true);
      return;
    }
    const runSampling = async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
      const imagine = sampleWordPixels("IMAGINE", PARTICLE_COUNT, false);
      await new Promise(r => setTimeout(r, 0));
      const create = sampleWordPixels("CREATE", PARTICLE_COUNT, false);
      await new Promise(r => setTimeout(r, 0));
      const evolve = sampleWordPixels("EVOLVE", PARTICLE_COUNT, false);
      await new Promise(r => setTimeout(r, 0));
      const impact = sampleWordPixels("IMPACT", PARTICLE_COUNT, true);

      wordPointsRef.current = { imagine, create, evolve, impact };
      setReady(true);
    };
    runSampling();
  }, [isNearViewport]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Inertial spring smooth scroll progress
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 24,
    restDelta: 0.0005,
  });

  const activeProgress = isMobile ? scrollYProgress : scrollProgress;

  // Derived Transforms for Title Emerge / Exit
  const titleOpacity = useTransform(activeProgress, [0.0, 0.04, 0.96, 0.99], [0, 1, 1, 0]);
  const titleY = useTransform(activeProgress, [0.0, 0.04, 0.96, 0.99], [10, 0, 0, -10]);

  // Derived Subtitle Transforms for Scenes 1 - 4 (IMAGINE, CREATE, EVOLVE, IMPACT)
  const imagineSubOpacity = useTransform(activeProgress, [0.0, 0.04, 0.14, 0.18], [0.0, 1.0, 1.0, 0.0]);
  const imagineSubY = useTransform(activeProgress, [0.0, 0.04, 0.14, 0.18], [15, 0, 0, -15]);

  const createSubOpacity = useTransform(activeProgress, [0.28, 0.32, 0.40, 0.44], [0.0, 1.0, 1.0, 0.0]);
  const createSubY = useTransform(activeProgress, [0.28, 0.32, 0.40, 0.44], [15, 0, 0, -15]);

  const evolveSubOpacity = useTransform(activeProgress, [0.54, 0.58, 0.66, 0.70], [0.0, 1.0, 1.0, 0.0]);
  const evolveSubY = useTransform(activeProgress, [0.54, 0.58, 0.66, 0.70], [15, 0, 0, -15]);

  const impactSubOpacity = useTransform(activeProgress, [0.78, 0.82, 0.95, 0.99], [0.0, 1.0, 1.0, 0.0]);
  const impactSubY = useTransform(activeProgress, [0.78, 0.82, 0.95, 0.99], [15, 0, 0, -15]);

  const dimensionRef = useRef({ width: 0, height: 0 });

  // Maintain High-DPI canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const handleCanvasResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        dimensionRef.current = { width, height };
      }
    };

    const observer = new ResizeObserver(handleCanvasResize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Initialize Neural Network Nodes, Volumetric Smoke, & Parallax Embers
  useEffect(() => {
    const w = window.innerWidth || 1200;
    const h = window.innerHeight || 800;

    // 1. Ambient embers
    const count = 55;
    const list: BackgroundParticle[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.06 + Math.random() * 0.14),
        size: 0.5 + Math.random() * 1.1,
        alpha: 0.12 + Math.random() * 0.35,
        noiseOffset: Math.random() * 50,
      });
    }
    ambientParticlesRef.current = list;

    // 2. Neural Nodes (42 nodes distributed in 3D depth space)
    const nodeCount = 42;
    const nodes: NeuralNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        z: 0.3 + Math.random() * 0.9,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    neuralNodesRef.current = nodes;

    // 3. Neural Sparks (12 sparks traveling along network connections)
    const sparks: NeuralSpark[] = [];
    for (let i = 0; i < 12; i++) {
      sparks.push({
        fromIdx: Math.floor(Math.random() * nodeCount),
        toIdx: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
      });
    }
    neuralSparksRef.current = sparks;

    // 4. Volumetric Smoke Blobs
    const smoke: VolumetricSmoke[] = [
      { x: 0.25, y: 0.35, radius: 340, vx: 0.02, vy: -0.01, phase: 0 },
      { x: 0.75, y: 0.65, radius: 440, vx: -0.015, vy: 0.01, phase: 1.8 },
      { x: 0.50, y: 0.20, radius: 290, vx: 0.01, vy: 0.02, phase: 3.4 },
      { x: 0.80, y: 0.25, radius: 380, vx: -0.02, vy: -0.015, phase: 5.1 },
    ];
    smokeBlobsRef.current = smoke;

    // 5. Foreground Parallax Embers (Soft-focused particles passing closer to camera)
    const fgEmbers: ForegroundEmber[] = [];
    for (let i = 0; i < 16; i++) {
      fgEmbers.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(0.18 + Math.random() * 0.28),
        size: 2.2 + Math.random() * 2.8,
        alpha: 0.12 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    }
    foregroundEmbersRef.current = fgEmbers;
  }, []);

  // Frame Loop
  useEffect(() => {
    let frameId: number;
    const startTime = Date.now();

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        frameId = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext("2d");
      const { width, height } = dimensionRef.current;
      if (!ctx || width === 0 || height === 0) {
        frameId = requestAnimationFrame(renderLoop);
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      const s = scrollProgress.get(); // Normalized spring-smoothed scroll progress [0, 1]

      // Clear Frame with calm persistence trails
      ctx.fillStyle = "rgba(2, 2, 2, 0.16)";
      ctx.fillRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // LAYER 1: Volumetric Smoke & Depth Atmosphere
      // -----------------------------------------------------------------
      const smokeIntensity = 0.02 + s * 0.04;
      smokeBlobsRef.current.forEach((blob) => {
        const bx = (blob.x * width) + Math.sin(elapsed * 0.15 + blob.phase) * 40;
        const by = (blob.y * height) + Math.cos(elapsed * 0.12 + blob.phase) * 30 - (s * 50);
        const grad = ctx.createRadialGradient(bx, by, 10, bx, by, blob.radius);
        grad.addColorStop(0, `rgba(212, 90, 18, ${smokeIntensity * 0.75})`);
        grad.addColorStop(0.5, `rgba(212, 90, 18, ${smokeIntensity * 0.22})`);
        grad.addColorStop(1, "rgba(2, 2, 2, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // -----------------------------------------------------------------
      // LAYER 2: Subtle Engineering Blueprint Grid & Axis Lines
      // -----------------------------------------------------------------
      // Blueprint grid opacity evolves smoothly:
      // Statement 1: 0.015->0.04 | Statement 2: 0.04->0.065 | Statement 3: 0.065->0.085 | Statement 4: 0.085->0.10
      const gridOpacity = Math.min(0.10, 0.015 + s * 0.085);
      const gridSpacing = 80;
      const gridYOffset = (s * 80) % gridSpacing;
      const gridXOffset = (s * 30) % gridSpacing;

      ctx.lineWidth = 0.75;
      ctx.strokeStyle = `rgba(212, 90, 18, ${gridOpacity * 0.38})`;

      // Vertical blueprint lines
      for (let x = gridXOffset; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal blueprint lines
      for (let y = gridYOffset; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Crosshair tick marks at intersections
      ctx.strokeStyle = `rgba(255, 122, 0, ${gridOpacity * 0.8})`;
      ctx.lineWidth = 1.0;
      const tickLen = 3.5;
      for (let x = gridXOffset; x < width; x += gridSpacing * 2) {
        for (let y = gridYOffset; y < height; y += gridSpacing * 2) {
          ctx.beginPath();
          ctx.moveTo(x - tickLen, y);
          ctx.lineTo(x + tickLen, y);
          ctx.moveTo(x, y - tickLen);
          ctx.lineTo(x, y + tickLen);
          ctx.stroke();
        }
      }

      // Glowing Center Axis Lines (Emerge during Statement 3 & 4)
      if (s > 0.45) {
        const axisAlpha = Math.min(0.12, (s - 0.45) * 0.24);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(255, 122, 0, ${axisAlpha})`;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
      }

      // -----------------------------------------------------------------
      // LAYER 3: Procedural Neural Connections & Network Nodes
      // -----------------------------------------------------------------
      const maxConnDist = 110 + s * 75;
      const networkAlpha = Math.min(0.15, 0.03 + s * 0.12);
      const nodes = neuralNodesRef.current;
      const nodeCount = nodes.length;

      // Update node positions with natural inertia
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];
        n.x += n.vx + Math.sin(elapsed * 0.2 + n.pulseOffset) * 0.12;
        n.y += n.vy + Math.cos(elapsed * 0.18 + n.pulseOffset) * 0.12;

        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Draw connection lines
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnDist) {
            const lineRatio = 1 - dist / maxConnDist;
            const alpha = lineRatio * networkAlpha;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 122, 0, ${alpha})`;
            ctx.lineWidth = 0.8 * lineRatio + 0.2;
            ctx.stroke();
          }
        }
      }

      // Draw neural nodes
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 1.5 + n.pulseOffset);
        const nodeSize = (1.2 + pulse * 1.0) * n.z;
        const nodeAlpha = (0.2 + pulse * 0.3) * (0.4 + s * 0.6);

        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? "#FFE0CC" : "#FF7A00";
        ctx.globalAlpha = Math.min(0.8, nodeAlpha);
        ctx.fill();

        // Glowing outer node rings in Statement 4 (IMPACT)
        if (s > 0.72) {
          const ringAlpha = (s - 0.72) * 0.35 * pulse;
          ctx.beginPath();
          ctx.arc(n.x, n.y, nodeSize * 2.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 122, 0, ${ringAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1.0;

      // Sparks traveling along Neural Network (Emerge in Statement 2, 3, 4)
      if (s > 0.22) {
        const sparks = neuralSparksRef.current;
        const sparkAlpha = Math.min(0.7, (s - 0.22) * 1.1);

        sparks.forEach((spark) => {
          spark.progress += spark.speed;
          if (spark.progress >= 1) {
            spark.progress = 0;
            spark.fromIdx = Math.floor(Math.random() * nodeCount);
            spark.toIdx = Math.floor(Math.random() * nodeCount);
          }

          const nFrom = nodes[spark.fromIdx];
          const nTo = nodes[spark.toIdx];
          if (nFrom && nTo) {
            const dx = nFrom.x - nTo.x;
            const dy = nFrom.y - nTo.y;
            if (Math.sqrt(dx * dx + dy * dy) < maxConnDist * 1.3) {
              const sx = nFrom.x + (nTo.x - nFrom.x) * spark.progress;
              const sy = nFrom.y + (nTo.y - nFrom.y) * spark.progress;

              ctx.beginPath();
              ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = "#FFFFFF";
              ctx.globalAlpha = sparkAlpha;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(sx, sy, 4.0, 0, Math.PI * 2);
              ctx.fillStyle = "#FF7A00";
              ctx.globalAlpha = sparkAlpha * 0.35;
              ctx.fill();
            }
          }
        });
        ctx.globalAlpha = 1.0;
      }

      // -----------------------------------------------------------------
      // LAYER 4: Radial Ambient Glow & Depth Lighting Peak
      // -----------------------------------------------------------------
      let glowStrength = 1.0;
      if (s >= 0.75 && s <= 0.94) {
        const impactT = (s - 0.75) / 0.19;
        glowStrength = 1.0 + Math.sin(impactT * Math.PI) * 0.85;
      } else if (s > 0.94) {
        const fade = Math.max(0, 1 - (s - 0.94) / 0.06);
        glowStrength = fade;
      }

      const baseGlowAlpha = (0.040 + 0.015 * Math.sin(elapsed * 1.2)) * glowStrength;
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.58
      );
      glowGrad.addColorStop(0, `rgba(255, 122, 0, ${baseGlowAlpha * 1.3})`);
      glowGrad.addColorStop(0.45, `rgba(212, 90, 18, ${baseGlowAlpha * 0.4})`);
      glowGrad.addColorStop(1, "rgba(2, 2, 2, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // LAYER 5: Background Drifting Embers
      // -----------------------------------------------------------------
      ambientParticlesRef.current.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * 0.4 + p.noiseOffset) * 0.05;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#FF7A00";
        ctx.globalAlpha = p.alpha * (0.6 + s * 0.4);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // -----------------------------------------------------------------
      // LAYER 6: Foreground Parallax Embers (Soft-focused near camera)
      // -----------------------------------------------------------------
      foregroundEmbersRef.current.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * 0.3 + p.phase) * 0.12;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20 || p.x > width + 20) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#FFE0CC";
        ctx.globalAlpha = p.alpha * (0.3 + 0.7 * Math.sin(elapsed + p.phase));
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      const points = wordPointsRef.current;
      if (ready && points.imagine.length > 0) {
        const cx = width / 2;
        const cy = height / 2;
        const scaleFactor = width < 400 ? 0.46 : (width < 640 ? 0.60 : (width < 1024 ? 1.0 : 1.35));

        // Shared Orbit Position Helper
        const getOrbitPos = (i: number, scrollVal: number): ParticlePoint => {
          const meta = particleMetaRef.current[i] || {
            angleOffset: (i * 0.1) % (Math.PI * 2),
            orbitRadiusX: 150,
            orbitRadiusY: 80,
            orbitDirection: 1,
            orbitSpeed: 0.5,
            size: 1.0,
            brightness: 0.5,
          };
          const rx = meta.orbitRadiusX * scaleFactor * 0.95;
          const ry = meta.orbitRadiusY * scaleFactor * 0.95;
          const angle = meta.angleOffset + scrollVal * 13 * meta.orbitDirection + Math.sin(elapsed * 0.45 + i) * 0.08;
          return {
            x: cx + Math.cos(angle) * rx,
            y: cy + Math.sin(angle) * ry,
          };
        };

        // Render Typographic Particles (Adaptive density by tier)
        const activeParticleCount = Math.min(PARTICLE_COUNT, points.imagine.length);
        for (let i = 0; i < activeParticleCount; i++) {
          const meta = particleMetaRef.current[i] || {
            size: 1.0,
            brightness: 0.5,
          };
          const ptImagine = points.imagine[i] || { x: 0, y: 0 };
          const ptCreate = points.create[i] || points.create[i % points.create.length] || ptImagine;
          const ptEvolve = points.evolve[i] || points.evolve[i % points.evolve.length] || ptImagine;
          const ptImpact = points.impact[i] || points.impact[i % points.impact.length] || ptImagine;

          let px = cx;
          let py = cy;

          if (s <= 0.15) {
            // Scene 1: IMAGINE Static / Emerge
            px = cx + ptImagine.x * scaleFactor;
            py = cy + ptImagine.y * scaleFactor;
          } else if (s > 0.15 && s <= 0.32) {
            // Transition 1: IMAGINE -> CREATE (Collapse -> Orbit -> Gather)
            const startX = cx + ptImagine.x * scaleFactor;
            const startY = cy + ptImagine.y * scaleFactor;
            const endX = cx + ptCreate.x * scaleFactor;
            const endY = cy + ptCreate.y * scaleFactor;

            if (s <= 0.21) {
              const t = (s - 0.15) / 0.06;
              const te = easeInOutCubic(t);
              const o = getOrbitPos(i, 0.21);
              px = (1 - te) * startX + te * o.x;
              py = (1 - te) * startY + te * o.y;
            } else if (s > 0.21 && s <= 0.26) {
              const o = getOrbitPos(i, s);
              px = o.x;
              py = o.y;
            } else {
              const t = (s - 0.26) / 0.06;
              const te = easeInOutCubic(t);
              const o = getOrbitPos(i, 0.26);
              px = (1 - te) * o.x + te * endX;
              py = (1 - te) * o.y + te * endY;
            }
          } else if (s > 0.32 && s <= 0.44) {
            // Scene 2: CREATE Static
            px = cx + ptCreate.x * scaleFactor;
            py = cy + ptCreate.y * scaleFactor;
          } else if (s > 0.44 && s <= 0.58) {
            // Transition 2: CREATE -> EVOLVE (Collapse -> Orbit -> Gather)
            const startX = cx + ptCreate.x * scaleFactor;
            const startY = cy + ptCreate.y * scaleFactor;
            const endX = cx + ptEvolve.x * scaleFactor;
            const endY = cy + ptEvolve.y * scaleFactor;

            if (s <= 0.49) {
              const t = (s - 0.44) / 0.05;
              const te = easeInOutCubic(t);
              const o = getOrbitPos(i, 0.49);
              px = (1 - te) * startX + te * o.x;
              py = (1 - te) * startY + te * o.y;
            } else if (s > 0.49 && s <= 0.53) {
              const o = getOrbitPos(i, s);
              px = o.x;
              py = o.y;
            } else {
              const t = (s - 0.53) / 0.05;
              const te = easeInOutCubic(t);
              const o = getOrbitPos(i, 0.53);
              px = (1 - te) * o.x + te * endX;
              py = (1 - te) * o.y + te * endY;
            }
          } else if (s > 0.58 && s <= 0.70) {
            // Scene 3: EVOLVE Static
            px = cx + ptEvolve.x * scaleFactor;
            py = cy + ptEvolve.y * scaleFactor;
          } else if (s > 0.70 && s <= 0.82) {
            // Transition 3: EVOLVE -> IMPACT (Collapse -> Orbit -> Gather)
            const startX = cx + ptEvolve.x * scaleFactor;
            const startY = cy + ptEvolve.y * scaleFactor;
            const peakScale = scaleFactor * 1.25;
            const endX = cx + ptImpact.x * peakScale;
            const endY = cy + ptImpact.y * peakScale;

            if (s <= 0.74) {
              const t = (s - 0.70) / 0.04;
              const te = easeInOutCubic(t);
              const o = getOrbitPos(i, 0.74);
              px = (1 - te) * startX + te * o.x;
              py = (1 - te) * startY + te * o.y;
            } else if (s > 0.74 && s <= 0.78) {
              const o = getOrbitPos(i, s);
              px = o.x;
              py = o.y;
            } else {
              const t = (s - 0.78) / 0.04;
              const te = easeInOutCubic(t);
              const o = getOrbitPos(i, 0.78);
              px = (1 - te) * o.x + te * endX;
              py = (1 - te) * o.y + te * endY;
            }
          } else if (s > 0.82 && s <= 0.95) {
            // Scene 4: IMPACT Static (Emotional Peak)
            const peakScale = scaleFactor * 1.25;
            px = cx + ptImpact.x * peakScale;
            py = cy + ptImpact.y * peakScale;
          } else {
            // Transition 4: IMPACT Dissolves (Continuous organic dispersion)
            const startX = cx + ptImpact.x * scaleFactor * 1.25;
            const startY = cy + ptImpact.y * scaleFactor * 1.25;
            const t = (s - 0.95) / 0.05;
            const te = easeInOutCubic(t);
            const o = getOrbitPos(i, s);
            px = (1 - te) * startX + te * o.x;
            py = (1 - te) * startY + te * o.y;
          }

          // Universal Micro-drift (continuous organic drift applied uniformly to avoid boundary jumps)
          px += Math.sin(elapsed * 0.4 + i) * 0.6;
          py += Math.cos(elapsed * 0.35 + i) * 0.6;

          // Draw Individual Particle
          ctx.beginPath();
          ctx.arc(px, py, meta.size, 0, Math.PI * 2);

          // Elegant ember-like color grading
          let color = "#FF7A00"; // Soft orange accent
          if (i % 3 === 0) color = "#FFE0CC"; // Soft champagne highlight
          if (i % 7 === 0) color = "#E65C00"; // Rich amber
          ctx.fillStyle = color;

          let alpha = meta.brightness;
          if (s < 0.05) {
            const fade = s / 0.05;
            alpha *= fade;
          } else if (s > 0.95) {
            const fade = Math.max(0, 1 - (s - 0.95) / 0.05);
            alpha *= fade;
          }

          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    if (isNearViewport && ready) {
      frameId = requestAnimationFrame(renderLoop);
    }
    return () => cancelAnimationFrame(frameId);
  }, [ready, isMobile, isNearViewport]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#020202] flex flex-col justify-start overflow-visible z-20"
      id="cleroy-mindset-section"
      style={{ height: isMobile ? "320vh" : "650vh" }} // Responsive canvas height for smooth scrolling
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020202]">
        
        {/* Continuous Ambient Lighting Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.10)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.10)_0%,transparent_65%)] pointer-events-none z-0" />

        {/* Feathered Grid Overlay (Soft edge mask eliminates hard boundary lines) */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 pointer-events-none opacity-[0.025] mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]">
          {Array.from({ length: 48 }).map((_, idx) => (
            <div key={idx} className="border-t border-l border-white/30 w-full h-full" />
          ))}
        </div>

        {/* Top/Bottom Seamless Canvas Edge Fade Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />

        {/* Dynamic canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Section Header */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-16 left-0 right-0 mx-auto text-center pointer-events-none z-30 px-6"
          id="mindset-section-header"
        >
          <h2 className="font-mono text-xs tracking-[0.4em] text-[#FF7A00] uppercase font-bold">
            HOW DO WE THINK?
          </h2>
          <p className="font-serif text-lg text-[#B8ACA0] italic mt-2 font-light">
            The Cleroy Mindset
          </p>
        </motion.div>



        {/* Subtitles Overlay */}
        <div className="absolute inset-x-0 bottom-[26%] md:bottom-[23%] flex flex-col items-center justify-center text-center pointer-events-none z-30 px-6">
          
          {/* IMAGINE Subtitle */}
          <motion.div
            style={{ opacity: imagineSubOpacity, y: imagineSubY }}
            className="absolute font-sans text-base sm:text-lg md:text-xl text-[#B8ACA0] font-light tracking-wide max-w-xl"
            id="subtitle-imagine"
          >
            "Every breakthrough begins with an idea."
          </motion.div>

          {/* CREATE Subtitle */}
          <motion.div
            style={{ opacity: createSubOpacity, y: createSubY }}
            className="absolute font-sans text-base sm:text-lg md:text-xl text-[#B8ACA0] font-light tracking-wide max-w-xl"
            id="subtitle-create"
          >
            "Ideas become purposeful digital experiences."
          </motion.div>

          {/* EVOLVE Subtitle */}
          <motion.div
            style={{ opacity: evolveSubOpacity, y: evolveSubY }}
            className="absolute font-sans text-base sm:text-lg md:text-xl text-[#B8ACA0] font-light tracking-wide max-w-xl"
            id="subtitle-evolve"
          >
            "Every iteration moves us closer to excellence."
          </motion.div>

          {/* IMPACT Subtitle */}
          <motion.div
            style={{ opacity: impactSubOpacity, y: impactSubY }}
            className="absolute font-sans text-base sm:text-lg md:text-xl text-[#B8ACA0] font-light tracking-wide max-w-xl font-medium text-[#F5EFE7]"
            id="subtitle-impact"
          >
            "Technology becomes meaningful only when it creates impact."
          </motion.div>
        </div>

      </div>
    </div>
  );
});
