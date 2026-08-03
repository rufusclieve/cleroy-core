import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // Depth layer: 0.3 (far back) to 2.2 (foreground)
  size: number;
  alpha: number;
  baseAlpha: number;
  targetX: number;
  targetY: number;
  trail: { x: number; y: number; alpha: number }[];
  driftAngle: number;
  driftSpeed: number;
  color: string;
  seed: number;
  isFormer: boolean; // True for ~30% particles forming letters, False for ~70% falling background stream
  formerIdx: number; // Sample point index if isFormer is true
}

interface Point {
  x: number;
  y: number;
}

// Layout helper for exact multi-line phrase typography & fluid responsive alignment
function getPhraseLayout(
  phrase: string,
  width: number,
  height: number,
  isMobile: boolean
) {
  // Max width & height constraints to prevent any overflow on all screen sizes
  const maxAllowedWidth = width * 0.86;
  const maxAllowedHeight = height * 0.68;

  let lines: string[] = [];

  if (phrase === "WHAT IF YOUR NEXT PRODUCT") {
    if (width < 480) {
      lines = ["WHAT IF", "YOUR NEXT", "PRODUCT"];
    } else if (width < 920) {
      lines = ["WHAT IF YOUR", "NEXT PRODUCT"];
    } else {
      lines = ["WHAT IF YOUR NEXT PRODUCT"];
    }
  } else if (phrase === "WHAT IF YOUR NEXT PRODUCT CHANGED EVERYTHING") {
    if (width < 420) {
      lines = ["WHAT IF", "YOUR NEXT PRODUCT", "CHANGED", "EVERYTHING"];
    } else if (width < 768) {
      lines = ["WHAT IF YOUR", "NEXT PRODUCT", "CHANGED EVERYTHING"];
    } else if (width < 1400) {
      lines = ["WHAT IF YOUR NEXT PRODUCT", "CHANGED EVERYTHING"];
    } else {
      lines = ["WHAT IF YOUR NEXT PRODUCT", "CHANGED EVERYTHING"];
    }
  } else {
    lines = [phrase];
  }

  // Fluid font scaling formula using viewport ratios bounded safely
  let baseFontSize: number;
  if (width < 640) {
    baseFontSize = Math.max(22, Math.min(width * 0.085, 46));
  } else if (width < 1024) {
    baseFontSize = Math.max(34, Math.min(width * 0.065, 68));
  } else if (width < 1920) {
    baseFontSize = Math.max(48, Math.min(width * 0.058, 96));
  } else {
    baseFontSize = Math.max(64, Math.min(width * 0.048, 120));
  }

  const fontStack = `"Plus Jakarta Sans", "Inter", -apple-system, sans-serif`;

  // Measure text width using an offscreen canvas to guarantee fitting
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  if (measureCtx) {
    measureCtx.font = `900 ${baseFontSize}px ${fontStack}`;

    // Find longest line width
    let maxLineWidth = 0;
    lines.forEach((line) => {
      const w = measureCtx.measureText(line).width;
      if (w > maxLineWidth) maxLineWidth = w;
    });

    // Scale font size down if maxLineWidth exceeds maxAllowedWidth
    if (maxLineWidth > maxAllowedWidth) {
      const scaleFactor = maxAllowedWidth / maxLineWidth;
      baseFontSize = Math.floor(baseFontSize * scaleFactor);
    }

    // Scale font size down if vertical total height exceeds maxAllowedHeight
    let lineHeight = baseFontSize * 1.2;
    let totalHeight = lines.length * lineHeight;
    if (totalHeight > maxAllowedHeight) {
      const heightScale = maxAllowedHeight / totalHeight;
      baseFontSize = Math.floor(baseFontSize * heightScale);
    }
  }

  const fontSize = Math.max(18, baseFontSize);
  const fontStr = `900 ${fontSize}px ${fontStack}`;
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = (height - totalHeight) / 2 + fontSize * 0.38;

  return { fontSize, fontStr, lines, lineHeight, startY };
}

// Multi-line sampling helper function for responsive particle typography
function samplePhraseCoordinates(
  phrase: string,
  width: number,
  height: number,
  isMobile: boolean,
  targetPointCount: number
): Point[] {
  if (width <= 0 || height <= 0) return [];
  const sampleWidth = Math.max(10, Math.floor(Math.min(width, isMobile ? 480 : 800)));
  const sampleHeight = Math.max(10, Math.floor(Math.min(height, isMobile ? 320 : 500)));
  if (sampleWidth <= 0 || sampleHeight <= 0) return [];

  const scaleX = width / sampleWidth;
  const scaleY = height / sampleHeight;

  const { fontStr, lines, lineHeight, startY } = getPhraseLayout(phrase, sampleWidth, sampleHeight, isMobile);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  canvas.width = sampleWidth;
  canvas.height = sampleHeight;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, sampleWidth, sampleHeight);

  ctx.font = fontStr;
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  lines.forEach((line, idx) => {
    const y = startY + idx * lineHeight;
    ctx.fillText(line, sampleWidth / 2, y);
  });

  if (sampleWidth <= 0 || sampleHeight <= 0 || canvas.width <= 0 || canvas.height <= 0) return [];
  const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imgData.data;

  const rawPixels: Point[] = [];
  const step = isMobile ? 3 : 2;

  for (let y = 0; y < sampleHeight; y += step) {
    for (let x = 0; x < sampleWidth; x += step) {
      const idx = (y * sampleWidth + x) * 4;
      if (data[idx] > 120) {
        rawPixels.push({ x: x * scaleX, y: y * scaleY });
      }
    }
  }

  if (rawPixels.length === 0) return [];

  const sampledPoints: Point[] = [];
  for (let i = 0; i < targetPointCount; i++) {
    const pIdx = Math.floor((i / targetPointCount) * rawPixels.length) % rawPixels.length;
    const pt = rawPixels[pIdx];
    sampledPoints.push({
      x: pt.x + (Math.random() - 0.5) * 1.5,
      y: pt.y + (Math.random() - 0.5) * 1.5,
    });
  }

  return sampledPoints;
}

export default React.memo(function CinematicTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isMobile, setIsMobile] = useState(false);
  const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;

  // Scroll tracking hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Soft ambient lighting background scale & opacity transform
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.1, 1, 1, 0.2]);

  const phrase1 = "WHAT IF";
  const phrase2 = "WHAT IF YOUR NEXT PRODUCT";
  const phrase3 = "WHAT IF YOUR NEXT PRODUCT CHANGED EVERYTHING";
  const phrase5 = "WHY NOT";
  const phrase6 = "LET'S BUILD";

  const points1Ref = useRef<Point[]>([]);
  const points2Ref = useRef<Point[]>([]);
  const points3Ref = useRef<Point[]>([]);
  const points5Ref = useRef<Point[]>([]);
  const points6Ref = useRef<Point[]>([]);

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const smoothProgressRef = useRef<number>(0);

  const dimensionsRef = useRef({ width: 1200, height: 800 });
  const dprRef = useRef(1);
  const isMobileRef = useRef(false);

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

  // Initialize canvas, DPR & sample coordinates
  useEffect(() => {
    const canvas = canvasRef.current;

    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 768;
      const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

      dimensionsRef.current = { width, height };
      dprRef.current = dpr;
      isMobileRef.current = mobile;

      setDimensions({ width, height });
      setIsMobile(mobile);

      if (canvas) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      const tablet = width >= 768 && width < 1024;
      const poolSize = mobile ? 180 : (tablet ? 1100 : 1600);
      const formerCount = Math.floor(poolSize * (mobile ? 0.45 : 0.32)); // Form letters smoothly

      // Non-blocking staggered sampling so main thread never freezes during boot
      const runDeferredSampling = async () => {
        points1Ref.current = samplePhraseCoordinates(phrase1, width, height, mobile, formerCount);
        await new Promise(r => setTimeout(r, 0));
        points2Ref.current = samplePhraseCoordinates(phrase2, width, height, mobile, formerCount);
        await new Promise(r => setTimeout(r, 0));
        points3Ref.current = samplePhraseCoordinates(phrase3, width, height, mobile, formerCount);
        await new Promise(r => setTimeout(r, 0));
        points5Ref.current = samplePhraseCoordinates(phrase5, width, height, mobile, formerCount);
        await new Promise(r => setTimeout(r, 0));
        points6Ref.current = samplePhraseCoordinates(phrase6, width, height, mobile, poolSize);
      };

      runDeferredSampling();

      // Populate living glowing orange particles distributed evenly
      if (particlesRef.current.length === 0 || particlesRef.current.length !== poolSize) {
        const particles: Particle[] = [];
        const numBuckets = mobile ? 10 : 16;
        const bucketWidth = width / numBuckets;

        let formerCounter = 0;
        for (let i = 0; i < poolSize; i++) {
          const isFormer = i % 10 < 3;
          const formerIdx = isFormer ? formerCounter++ : -1;
          const z = Math.random() < 0.25 ? Math.random() * 0.4 + 1.4 : Math.random() * 0.9 + 0.3;
          const bucket = i % numBuckets;
          const startX = bucket * bucketWidth + Math.random() * bucketWidth;

          particles.push({
            x: Math.max(10, Math.min(width - 10, startX)),
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.8 + 0.5,
            z,
            size: (Math.random() * 1.5 + 0.8) * (z > 1 ? 1.3 : 1.0),
            alpha: Math.random() * 0.35 + 0.15,
            baseAlpha: Math.random() * 0.3 + 0.15,
            targetX: startX,
            targetY: Math.random() * height,
            trail: [],
            driftAngle: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.25 + 0.05,
            color: "rgba(255, 122, 0, 0.75)",
            seed: Math.random() * 1000,
            isFormer,
            formerIdx,
          });
        }
        particlesRef.current = particles;
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        updateSize();
      });
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Main high-performance render loop
  useEffect(() => {
    if (!isNearViewport) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rippleRadius = 0;
    let rippleOpacity = 0;
    let isPaused = false;

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (isPaused || !isNearViewport) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      const { width, height } = dimensionsRef.current;
      const dpr = dprRef.current;
      const mobile = isMobileRef.current;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Deep matte black space clear with subtle trail history
      ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
      ctx.fillRect(0, 0, width, height);

      // Smooth exponential interpolation (lerp) for butter-smooth scroll feel (60FPS continuous interpolation)
      const targetProgress = scrollYProgress.get();
      const diff = targetProgress - smoothProgressRef.current;
      smoothProgressRef.current += diff * 0.09;
      if (Math.abs(diff) < 0.0001) {
        smoothProgressRef.current = targetProgress;
      }
      const progress = smoothProgressRef.current;
      const timeSecs = Date.now() / 1000;

      // Continuous subtle camera drift & parallax breathing
      const camX = Math.sin(timeSecs * 0.22) * 16 + Math.cos(timeSecs * 0.09) * 8;
      const camY = Math.cos(timeSecs * 0.18) * 12 + Math.sin(timeSecs * 0.06) * 6;
      const parallaxMult = 1.0;

      // Phase boundaries mapped precisely across 0.0 - 1.0
      // 0: Stage 1 - Falling orange particles continuing seamlessly from previous section (0.00 - 0.03)
      // 1: Stage 2-5 - WHAT IF (0.03 - 0.20)
      // 1.5: Dissolving 1 (0.20 - 0.23)
      // 2: WHAT IF YOUR NEXT PRODUCT (0.23 - 0.40)
      // 2.5: Dissolving 2 (0.40 - 0.43)
      // 3: WHAT IF YOUR NEXT PRODUCT CHANGED EVERYTHING (0.43 - 0.60)
      // 4: Collapse & Pulse Ripple (0.60 - 0.72)
      // 5: WHY NOT (0.72 - 0.86)
      // 6: Downward particle stream flowing into Let's Build (0.86 - 1.00)

      let activePhase = 0;
      let rawPhaseProgress = 0;

      if (progress < 0.03) {
        activePhase = 0; // Stage 1 natural falling entry
        rawPhaseProgress = progress / 0.03;
      } else if (progress >= 0.03 && progress < 0.20) {
        activePhase = 1;
        rawPhaseProgress = (progress - 0.03) / 0.17;
      } else if (progress >= 0.20 && progress < 0.23) {
        activePhase = 1.5;
        rawPhaseProgress = (progress - 0.20) / 0.03;
      } else if (progress >= 0.23 && progress < 0.40) {
        activePhase = 2;
        rawPhaseProgress = (progress - 0.23) / 0.17;
      } else if (progress >= 0.40 && progress < 0.43) {
        activePhase = 2.5;
        rawPhaseProgress = (progress - 0.40) / 0.03;
      } else if (progress >= 0.43 && progress < 0.60) {
        activePhase = 3;
        rawPhaseProgress = (progress - 0.43) / 0.17;
      } else if (progress >= 0.60 && progress < 0.72) {
        activePhase = 4;
        rawPhaseProgress = (progress - 0.60) / 0.12;
      } else if (progress >= 0.72 && progress < 0.86) {
        activePhase = 5;
        rawPhaseProgress = (progress - 0.72) / 0.14;
      } else if (progress >= 0.86) {
        activePhase = 6;
        rawPhaseProgress = (progress - 0.86) / 0.14;
      }

      // 18% Speed boost at the start of particle gathering while settling slightly slower at the tail
      const phaseInterpolation =
        activePhase === 1 || activePhase === 2 || activePhase === 3 || activePhase === 5
          ? Math.pow(Math.min(1, Math.max(0, rawPhaseProgress)), 0.82)
          : rawPhaseProgress;

      // Calculate white text alpha (Stage 4 & 5 reveal: white text fades in behind orange particles)
      let activePhraseText = "";
      let whiteTextAlpha = 0;

      if (activePhase === 1) {
        activePhraseText = phrase1;
        if (phaseInterpolation > 0.02) {
          whiteTextAlpha = Math.min(1.0, (phaseInterpolation - 0.02) / 0.18);
          if (phaseInterpolation > 0.80) {
            whiteTextAlpha = Math.max(0, 1.0 - (phaseInterpolation - 0.80) / 0.20);
          }
        }
      } else if (activePhase === 2) {
        activePhraseText = phrase2;
        if (phaseInterpolation > 0.02) {
          whiteTextAlpha = Math.min(1.0, (phaseInterpolation - 0.02) / 0.18);
          if (phaseInterpolation > 0.80) {
            whiteTextAlpha = Math.max(0, 1.0 - (phaseInterpolation - 0.80) / 0.20);
          }
        }
      } else if (activePhase === 3) {
        activePhraseText = phrase3;
        if (phaseInterpolation > 0.02) {
          whiteTextAlpha = Math.min(1.0, (phaseInterpolation - 0.02) / 0.18);
          if (phaseInterpolation > 0.80) {
            whiteTextAlpha = Math.max(0, 1.0 - (phaseInterpolation - 0.80) / 0.20);
          }
        }
      } else if (activePhase === 5) {
        activePhraseText = phrase5;
        if (phaseInterpolation > 0.02) {
          whiteTextAlpha = Math.min(1.0, (phaseInterpolation - 0.02) / 0.18);
          if (phaseInterpolation > 0.80) {
            whiteTextAlpha = Math.max(0, 1.0 - (phaseInterpolation - 0.80) / 0.20);
          }
        }
      }

      // Render crisp bright white typography directly on canvas behind particles
      if (whiteTextAlpha > 0.01 && activePhraseText) {
        const layout = getPhraseLayout(activePhraseText, width, height, isMobile);
        ctx.save();
        ctx.font = layout.fontStr;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255, 255, 255, ${whiteTextAlpha * 0.98})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${whiteTextAlpha * 0.85})`;
        ctx.shadowBlur = whiteTextAlpha * 28;

        layout.lines.forEach((line, lIdx) => {
          const ly = layout.startY + lIdx * layout.lineHeight;
          ctx.fillText(line, width / 2, ly);
        });
        ctx.restore();
      }

      // Handle Stage 4 (Shockwave Pulse Ripple) trigger
      if (activePhase === 4) {
        const pointCompressEnd = 0.45;
        if (phaseInterpolation > pointCompressEnd && phaseInterpolation < pointCompressEnd + 0.25) {
          const pulseProg = (phaseInterpolation - pointCompressEnd) / 0.25;
          rippleRadius = pulseProg * Math.max(width, height) * 0.45;
          rippleOpacity = Math.sin(pulseProg * Math.PI) * 0.6;
        } else {
          rippleRadius = 0;
          rippleOpacity = 0;
        }
      } else {
        rippleRadius = 0;
        rippleOpacity = 0;
      }

      // Draw shockwave pulse ring if active
      if (rippleOpacity > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232, 80, 2, ${rippleOpacity * 0.7})`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(232, 80, 2, 0.8)";
        ctx.stroke();
        ctx.restore();
      }

      const particles = particlesRef.current;
      const pts1 = points1Ref.current;
      const pts2 = points2Ref.current;
      const pts3 = points3Ref.current;
      const pts5 = points5Ref.current;

      // Sort particles by Z-depth for correct layered rendering
      particles.sort((a, b) => a.z - b.z);

      particles.forEach((p, idx) => {
        if (!p) return;
        let isAttracted = false;

        // Apply camera drift offset with Z-parallax factor
        const parallaxFactor = (p.z - 0.8) * 1.4;
        const cX = camX * parallaxFactor;
        const cY = camY * parallaxFactor;

        // Micro living oscillation inside words
        const microVibX = Math.sin(timeSecs * 2.5 + p.seed) * 1.2;
        const microVibY = Math.cos(timeSecs * 2.2 + p.seed) * 1.2;

        const seedBucket = Math.abs(Math.floor(p.seed * 10)) % 100;

        if (activePhase === 0 || !p.isFormer) {
          // 70% Non-former particles (or Stage 1 entry): Continuous natural downward fall & horizontal drift
          if (activePhase !== 4 && activePhase !== 6) {
            p.y += p.vy * (p.z > 1 ? 1.4 : 0.85);
            p.x += Math.sin(timeSecs * 1.5 + p.seed * 0.1) * 0.6;
            if (p.y > height + 20) {
              p.y = -20;
              p.x = Math.random() * width;
            }
            p.color = "rgba(255, 122, 0, 0.65)";
            p.alpha = p.baseAlpha * 1.5;
          }
        }

        if (p.isFormer) {
          if (activePhase === 1) {
            if (pts1[p.formerIdx]) {
              isAttracted = true;
              if (phaseInterpolation > 0.48 && seedBucket < 60) {
                const driftProgress = (phaseInterpolation - 0.48) / 0.52;
                p.targetX = pts1[p.formerIdx].x + Math.sin(p.seed + timeSecs * 2) * 50 * driftProgress;
                p.targetY = pts1[p.formerIdx].y + driftProgress * 120 * (p.z > 1 ? 1.4 : 0.8);
                p.color = "rgba(232, 80, 2, 0.45)";
                p.alpha = Math.max(0.1, p.baseAlpha * (1.0 - driftProgress * 1.4));
              } else {
                p.targetX = pts1[p.formerIdx].x + microVibX;
                p.targetY = pts1[p.formerIdx].y + microVibY;
                p.color = "rgba(255, 140, 20, 0.95)";
                p.alpha = Math.min(1.0, p.baseAlpha * 2.4);
              }
            }
          } else if (activePhase === 1.5) {
            if (pts1[p.formerIdx]) {
              isAttracted = true;
              p.targetX = pts1[p.formerIdx].x + Math.sin(p.seed + timeSecs * 3) * 70 * phaseInterpolation;
              p.targetY = pts1[p.formerIdx].y - phaseInterpolation * 100;
              p.color = "rgba(255, 122, 0, 0.6)";
              p.alpha = Math.max(0.1, p.baseAlpha * (1 - phaseInterpolation));
            }
          } else if (activePhase === 2) {
            if (pts2[p.formerIdx]) {
              isAttracted = true;
              if (phaseInterpolation > 0.48 && seedBucket < 60) {
                const driftProgress = (phaseInterpolation - 0.48) / 0.52;
                p.targetX = pts2[p.formerIdx].x + Math.sin(p.seed + timeSecs * 2) * 50 * driftProgress;
                p.targetY = pts2[p.formerIdx].y + driftProgress * 120 * (p.z > 1 ? 1.4 : 0.8);
                p.color = "rgba(232, 80, 2, 0.45)";
                p.alpha = Math.max(0.1, p.baseAlpha * (1.0 - driftProgress * 1.4));
              } else {
                p.targetX = pts2[p.formerIdx].x + microVibX;
                p.targetY = pts2[p.formerIdx].y + microVibY;
                p.color = "rgba(255, 140, 20, 0.95)";
                p.alpha = Math.min(1.0, p.baseAlpha * 2.4);
              }
            }
          } else if (activePhase === 2.5) {
            if (pts2[p.formerIdx]) {
              isAttracted = true;
              p.targetX = pts2[p.formerIdx].x + Math.cos(p.seed + timeSecs * 3) * 70 * phaseInterpolation;
              p.targetY = pts2[p.formerIdx].y - phaseInterpolation * 100;
              p.color = "rgba(255, 122, 0, 0.6)";
              p.alpha = Math.max(0.1, p.baseAlpha * (1 - phaseInterpolation));
            }
          } else if (activePhase === 3) {
            if (pts3[p.formerIdx]) {
              isAttracted = true;
              if (phaseInterpolation > 0.48 && seedBucket < 60) {
                const driftProgress = (phaseInterpolation - 0.48) / 0.52;
                p.targetX = pts3[p.formerIdx].x + Math.sin(p.seed + timeSecs * 2) * 50 * driftProgress;
                p.targetY = pts3[p.formerIdx].y + driftProgress * 120 * (p.z > 1 ? 1.4 : 0.8);
                p.color = "rgba(232, 80, 2, 0.45)";
                p.alpha = Math.max(0.1, p.baseAlpha * (1.0 - driftProgress * 1.4));
              } else {
                p.targetX = pts3[p.formerIdx].x + microVibX;
                p.targetY = pts3[p.formerIdx].y + microVibY;
                p.color = "rgba(255, 140, 20, 0.95)";
                p.alpha = Math.min(1.0, p.baseAlpha * 2.4);
              }
            }
          } else if (activePhase === 5) {
            if (pts5[p.formerIdx]) {
              isAttracted = true;
              if (phaseInterpolation > 0.48 && seedBucket < 60) {
                const driftProgress = (phaseInterpolation - 0.48) / 0.52;
                p.targetX = pts5[p.formerIdx].x + Math.sin(p.seed + timeSecs * 2) * 50 * driftProgress;
                p.targetY = pts5[p.formerIdx].y + driftProgress * 120 * (p.z > 1 ? 1.4 : 0.8);
                p.color = "rgba(232, 80, 2, 0.45)";
                p.alpha = Math.max(0.1, p.baseAlpha * (1.0 - driftProgress * 1.4));
              } else {
                p.targetX = pts5[p.formerIdx].x + microVibX;
                p.targetY = pts5[p.formerIdx].y + microVibY;
                p.color = "rgba(255, 140, 20, 0.95)";
                p.alpha = Math.min(1.0, p.baseAlpha * 2.4);
              }
            }
          }
        }

        if (activePhase === 4) {
          // Collapse sentence inward into one glowing orange point at screen center
          isAttracted = true;
          const centerX = width / 2;
          const centerY = height / 2;

          if (phaseInterpolation <= 0.45) {
            const angle = p.seed + phaseInterpolation * 12;
            const radius = (1 - phaseInterpolation / 0.45) * (width * 0.35);
            p.targetX = centerX + Math.cos(angle) * radius;
            p.targetY = centerY + Math.sin(angle) * radius;
            p.color = "rgba(255, 122, 0, 0.95)";
            p.alpha = 1.0;
          } else if (phaseInterpolation <= 0.7) {
            const pushDist = (rippleRadius > 0 ? rippleRadius * 0.15 : 0) * (p.z > 1 ? 1.2 : 0.8);
            const angle = p.seed;
            p.targetX = centerX + Math.cos(angle) * pushDist;
            p.targetY = centerY + Math.sin(angle) * pushDist;
            p.color = "rgba(255, 140, 0, 1.0)";
            p.alpha = 1.0;
          } else {
            p.targetX = centerX + (Math.random() - 0.5) * 10;
            p.targetY = centerY + (Math.random() - 0.5) * 10;
            p.color = "rgba(232, 80, 2, 0.9)";
            p.alpha = 0.9;
          }
        } else if (activePhase === 6) {
          // Transition from "WHY NOT" into continuous downward particle stream flowing into Let's Build
          isAttracted = true;
          const depthMultiplier = p.z > 1.2 ? 1.6 : p.z < 0.6 ? 0.75 : 1.0;
          const flowSpeed = (phaseInterpolation * 750 + (p.seed % 200) + 120) * depthMultiplier;
          
          const sway = Math.sin(timeSecs * 1.8 + p.seed * 0.1) * (20 + (p.seed % 25));
          const spreadX = ((idx * 1.618) % 1) * width;
          const targetXFull = pts5[p.formerIdx >= 0 ? p.formerIdx : idx % 480]
            ? pts5[p.formerIdx >= 0 ? p.formerIdx : idx % 480].x * Math.max(0, 1 - phaseInterpolation * 1.8) + spreadX * Math.min(1, phaseInterpolation * 1.8)
            : spreadX;
          p.targetX = targetXFull + sway;
          p.targetY = (pts5[p.formerIdx >= 0 ? p.formerIdx : idx % 480] ? pts5[p.formerIdx >= 0 ? p.formerIdx : idx % 480].y : height / 2) + flowSpeed;
          
          if (p.z > 1.2) {
            p.color = "rgba(255, 122, 0, 0.9)";
            p.alpha = Math.max(0.2, (1.0 - phaseInterpolation * 0.4) * p.baseAlpha * 2.2);
          } else {
            p.color = "rgba(232, 80, 2, 0.65)";
            p.alpha = Math.max(0.1, (1.0 - phaseInterpolation * 0.5) * p.baseAlpha * 1.5);
          }
        }

        // Particle physics update with high-performance spring momentum & organic inertia
        if (isAttracted) {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          
          // Organic spring acceleration & soft friction damping per particle seed
          // Speed up initial gather response while allowing organic inertia
          const spring = activePhase === 4 ? 0.16 : seedBucket < 60 ? 0.24 : seedBucket < 88 ? 0.16 : 0.09;
          const friction = activePhase === 4 ? 0.62 : seedBucket < 60 ? 0.70 : 0.78;

          p.vx = p.vx * friction + dx * spring;
          p.vy = p.vy * friction + dy * spring;

          p.x += p.vx;
          p.y += p.vy;
        } else if (activePhase !== 0) {
          // Ambient organic Brownian floating motion with momentum decay
          p.driftAngle += (Math.random() - 0.5) * 0.08;
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.x += Math.cos(p.driftAngle) * p.driftSpeed + p.vx;
          p.y += Math.sin(p.driftAngle) * p.driftSpeed + p.vy;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          p.alpha = p.baseAlpha;
          p.color = "rgba(255, 122, 0, 0.4)";
        }

        // Maintain delicate motion trails for moving particles
        if (isAttracted && (Math.abs(p.vx) > 0.1 || activePhase === 4)) {
          p.trail.push({ x: p.x + cX, y: p.y + cY, alpha: p.alpha * 0.4 });
          if (p.trail.length > 4) p.trail.shift();
        } else {
          p.trail = [];
        }

        // Render delicate motion trails
        p.trail.forEach((tPt, tIdx) => {
          ctx.fillStyle = "rgba(232, 80, 2, 0.15)";
          ctx.beginPath();
          ctx.arc(tPt.x, tPt.y, p.size * (tIdx / p.trail.length), 0, Math.PI * 2);
          ctx.fill();
        });

        // Render main particle with camera parallax coordinates applied
        const renderX = p.x + cX;
        const renderY = p.y + cY;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Render glowing orange aura around foreground & active phrase particles
        if ((isAttracted || activePhase === 0) && p.z > 1.1) {
          ctx.shadowBlur = mobile ? 0 : 12;
          ctx.shadowColor = "rgba(255, 122, 0, 0.7)";
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 122, 0, 0.15)";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(render);
    };

    if (isNearViewport) {
      render();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [scrollYProgress, isNearViewport]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#020202] overflow-visible z-20 select-none"
      style={{ height: isMobile ? "320vh" : "420vh" }}
    >
      {/* Sticky full-screen visual viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020202]">
        
        {/* Soft Volumetric Ambient Studio Lighting */}
        <motion.div
          style={{
            scale: bgScale,
            opacity: bgOpacity,
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div
            className="absolute -top-[50%] -left-[50%] w-[130vw] h-[130vw] max-w-[1600px] max-h-[1600px] rounded-full"
            style={{
              background: `radial-gradient(ellipse at 40% 40%, 
                rgba(255, 157, 46, 0.04) 0%, 
                rgba(255, 122, 0, 0.09) 16%, 
                rgba(232, 80, 2, 0.14) 30%, 
                rgba(138, 46, 6, 0.18) 48%, 
                rgba(28, 8, 1, 0.15) 75%, 
                #020202 100%
              )`,
              filter: isMobileViewport ? "blur(40px)" : "blur(380px)",
            }}
          />

          <div
            className="absolute -bottom-[50%] -right-[50%] w-[110vw] h-[110vw] max-w-[1400px] max-h-[1400px] rounded-full"
            style={{
              background: `radial-gradient(ellipse at 60% 60%, 
                rgba(255, 157, 46, 0.03) 0%, 
                rgba(255, 122, 0, 0.07) 16%, 
                rgba(232, 80, 2, 0.11) 32%, 
                rgba(138, 46, 6, 0.13) 50%, 
                rgba(28, 8, 1, 0.10) 78%, 
                #020202 100%
              )`,
              filter: isMobileViewport ? "blur(35px)" : "blur(350px)",
            }}
          />
        </motion.div>

        {/* Top/Bottom Seamless Canvas Edge Fade Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" />

        {/* Subtle Film Grain Overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.02,
          }}
        />

        {/* Main living particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
        />

      </div>
    </div>
  );
});

function MobileWhatIfSection({
  containerRef,
}: {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetRef = containerRef || sectionRef;

  // Track scroll position inside this mobile section for subtle interactive scroll reactivity
  const { scrollYProgress } = useScroll({
    target: targetRef as React.RefObject<HTMLDivElement>,
    offset: ["start end", "end start"],
  });

  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.4, 0.8, 0.4]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.95, 1.15, 0.95]);

  // 18 deterministic particles matching desktop color palette & organic floating motion
  const particles = React.useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const size = 2.2 + (i % 3) * 1.1; // 2.2px to 4.4px
      const left = `${(i * 19 + 7) % 88 + 6}%`;
      const top = `${(i * 23 + 13) % 84 + 8}%`;
      const duration = 16 + (i % 5) * 3; // 16s to 28s
      const delay = -(i * 1.4);
      const opacity = 0.35 + (i % 4) * 0.12; // 0.35 to 0.71
      const color = i % 4 === 0 ? "#FF9D2E" : i % 4 === 1 ? "#FF7A00" : i % 4 === 2 ? "#E85002" : "#FF802B";
      const dx = ((i % 5) - 2) * 22; // -44px to +44px
      const dy = -28 - (i % 4) * 18; // -28px to -82px
      return { id: i, size, left, top, duration, delay, opacity, color, dx, dy };
    });
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById("contact") || document.getElementById("lets-build-section");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={targetRef as React.RefObject<HTMLDivElement>}
      id="what-if-mobile"
      className="relative w-full bg-[#020202] text-[#F5EFE7] py-24 px-6 sm:px-8 overflow-hidden z-20 flex flex-col items-center justify-center text-center min-h-[80vh] select-none"
    >
      <style>{`
        @keyframes mobileParticleFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(var(--dx), var(--dy), 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes buttonPulseOnce {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(212, 90, 18, 0);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 28px rgba(212, 90, 18, 0.5);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 16px rgba(212, 90, 18, 0.3);
          }
        }
      `}</style>

      {/* Dark Base */}
      <div className="absolute inset-0 bg-[#020202] z-0 pointer-events-none" />

      {/* Volumetric Ambient Studio Lighting (Matches Desktop Color Depth) */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
      >
        <div
          className="w-[120vw] h-[120vw] max-w-[520px] max-h-[520px] rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, 
              rgba(255, 157, 46, 0.12) 0%, 
              rgba(255, 122, 0, 0.22) 22%, 
              rgba(232, 80, 2, 0.28) 42%, 
              rgba(138, 46, 6, 0.18) 64%, 
              rgba(28, 8, 1, 0.10) 82%, 
              transparent 100%
            )`,
          }}
        />
      </motion.div>

      {/* Film Grain Texture Overlay (Matches Desktop) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Floating Orange Particles (18 particles) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
              ["--dx" as any]: `${p.dx}px`,
              ["--dy" as any]: `${p.dy}px`,
              animation: `mobileParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-md mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Subtitle / Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-30px" }}
        >
          <span className="text-[#D45A12] font-mono text-[11px] sm:text-[12px] tracking-[0.40em] uppercase font-bold block">
            CHAPTER THREE // WHAT IF
          </span>
        </motion.div>

        {/* Headline Lines */}
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.08, ease: "easeOut" }}
            viewport={{ once: true, margin: "-30px" }}
            className="font-sans font-extrabold text-3xl sm:text-4xl text-[#F5EFE7] tracking-tight leading-[1.15] uppercase"
          >
            WHAT IF YOUR
          </motion.h2>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.16, ease: "easeOut" }}
            viewport={{ once: true, margin: "-30px" }}
            className="font-sans font-extrabold text-3xl sm:text-4xl text-[#F5EFE7] tracking-tight leading-[1.15] uppercase"
          >
            NEXT PRODUCT
          </motion.h2>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.24, ease: "easeOut" }}
            viewport={{ once: true, margin: "-30px" }}
            className="font-sans font-black text-3xl sm:text-4xl tracking-tight leading-[1.15] uppercase text-[#FF802B] drop-shadow-[0_0_25px_rgba(255,128,43,0.45)]"
          >
            CHANGED EVERYTHING?
          </motion.h2>
        </div>

        {/* Expanding Glowing Orange Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.32, ease: "easeOut" }}
          viewport={{ once: true, margin: "-30px" }}
          className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF802B] to-transparent my-2"
        />

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-30px" }}
          className="font-serif text-sm sm:text-base text-[#C5B9AD] font-normal leading-relaxed max-w-sm"
        >
          What if strategy, design, and software combined into a single force that transforms industries?
        </motion.p>

        {/* Large Premium CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.48, ease: "easeOut" }}
          viewport={{ once: true, margin: "-30px" }}
          className="pt-2"
        >
          <a
            href="#contact"
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D45A12] to-[#FF7024] text-white font-sans font-bold text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,90,18,0.35)] hover:shadow-[0_0_30px_rgba(255,112,36,0.6)] active:scale-95"
            style={{
              animation: "buttonPulseOnce 1.2s ease-out 0.8s 1 normal forwards",
            }}
          >
            <span>BUILD THE IMPOSSIBLE</span>
            <span className="text-base font-light leading-none">→</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
