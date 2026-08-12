import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from "motion/react";
import { Sparkles, ArrowUpRight, Zap } from "lucide-react";
import CleroyButton from "./CleroyButton";

const LIVE_URL = "https://matts-glitters-demo.vercel.app";

export default React.memo(function FeaturedExhibition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "400px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // InView tracking for heading editorial reveal (Triggers ONLY ONCE)
  const isRightInView = useInView(rightColRef, { once: true, amount: 0.2 });
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (isRightInView) {
      // Hide blinking cursor after total reveal duration (~850ms)
      const timer = setTimeout(() => {
        setShowBlinkingCursor(false);
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [isRightInView]);

  // Mouse tracking for 3D tilt & Magnetic Floating Cursor
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);

  // Magnetic cursor springs
  const cursorSpringConfig = { stiffness: 450, damping: 30 };
  const cursorX = useSpring(rawMouseX, cursorSpringConfig);
  const cursorY = useSpring(rawMouseY, cursorSpringConfig);

  // 3D Card Tilt springs (max ~12 deg tilt)
  const cardTiltConfig = { stiffness: 160, damping: 22 };
  const tiltX = useSpring(useTransform(cardMouseY, [-0.5, 0.5], [12, -12]), cardTiltConfig);
  const tiltY = useSpring(useTransform(cardMouseX, [-0.5, 0.5], [-14, 14]), cardTiltConfig);

  // Dynamic ambient light shift behind card
  const lightShiftX = useSpring(useTransform(cardMouseX, [-0.5, 0.5], [-60, 60]), cardTiltConfig);
  const lightShiftY = useSpring(useTransform(cardMouseY, [-0.5, 0.5], [-60, 60]), cardTiltConfig);

  // Dynamic live metric telemetry counter
  const [telemetryLatency, setTelemetryLatency] = useState(6.4);
  useEffect(() => {
    if (!isNearViewport) return;
    const interval = setInterval(() => {
      setTelemetryLatency(+(6.0 + Math.random() * 0.8).toFixed(1));
    }, 2400);
    return () => clearInterval(interval);
  }, [isNearViewport]);

  // Scroll tracking across the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const activeProgress = isTouchDevice ? scrollYProgress : smoothProgress;

  // Subtle parallax and scale for left side image on scroll
  const imageY = useTransform(activeProgress, [0.1, 0.9], [20, -20]);
  const imageScale = useTransform(activeProgress, [0.1, 0.5, 0.9], [0.97, 1.01, 0.98]);
  const ambientGlowScale = useTransform(activeProgress, [0.2, 0.8], [0.85, 1.2]);
  const leftOpacityTransform = useTransform(smoothProgress, [0.08, 0.28], [0, 1]);
  const leftYTransform = useTransform(smoothProgress, [0.08, 0.28], [40, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isLaunching || isTouchDevice) return;

    // Global coordinates for magnetic floating pill cursor
    rawMouseX.set(e.clientX);
    rawMouseY.set(e.clientY);

    // Card relative coordinates (-0.5 to 0.5) for 3D tilt & lighting
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardMouseX.set(x);
    cardMouseY.set(y);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    rawMouseX.set(e.clientX);
    rawMouseY.set(e.clientY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    cardMouseX.set(0);
    cardMouseY.set(0);
    setIsHovered(false);
  };

  const handleLaunchExperience = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Open live demo in a new browser tab with target="_blank" rel="noopener noreferrer"
    window.open(LIVE_URL, "_blank", "noopener,noreferrer");

    if (isLaunching) return;

    try {
      const state = {
        savedScrollY: window.scrollY,
        isReturning: true,
        sectionId: "featured-work",
        timestamp: Date.now(),
      };
      sessionStorage.setItem("cleroy_saved_navigation_state", JSON.stringify(state));
      if (window.history && window.history.replaceState) {
        window.history.replaceState({ ...window.history.state, cleroyState: state }, "");
      }
    } catch (err) {
      console.error("Failed to save navigation state:", err);
    }

    setIsLaunching(true);

    setTimeout(() => {
      setIsLaunching(false);
    }, 1250);
  };

  return (
    <section
      ref={containerRef}
      id="featured-work"
      className="relative w-full min-h-screen py-[clamp(4rem,10vh,12rem)] px-[clamp(1rem,4vw,4rem)] bg-[#020202] text-[#F5EFE7] overflow-hidden select-none"
    >
      {/* Background Volumetric Ambient Lighting Bleed */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[80vh] max-w-[1400px] bg-[#E85002]/8 rounded-full blur-[220px] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,90,18,0.12)_0%,transparent_65%)] pointer-events-none z-0" aria-hidden="true" />

      {/* Top/Bottom Seamless Canvas Edge Fade Overlays */}
      <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent pointer-events-none z-20" aria-hidden="true" />

      {/* Film Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* EDITORIAL SPLIT-SCREEN LAYOUT 
          On Mobile: Right Column (Text, Heading, Description, Button) comes FIRST (order-1)
                     Left Column (Project Card) comes SECOND (order-2)
          On Desktop (lg): Left Column is lg:order-1, Right Column is lg:order-2
      */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-12 gap-[clamp(2.5rem,6vw,4.5rem)] items-start">
        
        {/* RIGHT SIDE: Sticky Editorial Content Panel (Mobile: Order 1, Desktop: Order 2) */}
        <div 
          ref={rightColRef}
          className="w-full lg:col-span-5 lg:sticky lg:top-36 lg:self-start flex flex-col space-y-[clamp(1.5rem,3.5vh,2.5rem)] pt-2 order-1 lg:order-2"
        >
          
          {/* Small Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isRightInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.4em] text-[#D45A12] uppercase font-bold flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D45A12] flex-shrink-0" />
            <span>DIGITAL EXHIBIT</span>
          </motion.div>

          {/* Main Heading with Premium Editorial Left-to-Right Reveal */}
          <div className="relative flex flex-col space-y-1">
            <h2 className="flex flex-col text-[clamp(2rem,5vw,3.75rem)] tracking-tight leading-[1.08] uppercase">
              
              {/* Line 1: "See it." */}
              <div className="relative overflow-hidden inline-block pr-2">
                <motion.span
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={isRightInView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
                  transition={{ duration: 0.25, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
                  className="inline-block font-serif font-light text-[#F5EFE7] tracking-wider"
                >
                  See it.
                </motion.span>
              </div>

              {/* Line 2: "Feel it." */}
              <div className="relative overflow-hidden inline-block pr-2">
                <motion.span
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={isRightInView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
                  transition={{ duration: 0.25, delay: 0.30, ease: [0.25, 1, 0.5, 1] }}
                  className="inline-block font-serif font-light text-[#F5EFE7] tracking-wider"
                >
                  Feel it.
                </motion.span>
              </div>

              {/* Line 3: "Experience it." */}
              <div className="relative overflow-hidden inline-flex items-center pr-2">
                <motion.span
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={isRightInView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
                  transition={{ duration: 0.30, delay: 0.55, ease: [0.25, 1, 0.5, 1] }}
                  className="inline-block font-sans font-extrabold text-[#D45A12] sm:text-[#E85002] tracking-tight drop-shadow-[0_0_20px_rgba(212,90,18,0.2)]"
                >
                  Experience it.
                </motion.span>

                {/* Blinking Orange Cursor while revealing */}
                {showBlinkingCursor && isRightInView && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.35, repeat: Infinity }}
                    className="inline-block w-3.5 h-[0.85em] bg-[#D45A12] ml-2 shadow-[0_0_12px_#D45A12] rounded-xs align-middle"
                  />
                )}
              </div>

            </h2>
          </div>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isRightInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1rem,1.8vw,1.35rem)] text-[#C5B9AD]/90 font-normal leading-relaxed tracking-wide"
          >
            Every product starts with an idea. <br />
            <span className="text-[#F5EFE7] font-normal">This one became reality.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isRightInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 w-full sm:w-auto"
          >
            <CleroyButton
              variant="primary"
              size="lg"
              onClick={handleLaunchExperience}
              className="w-full sm:w-auto min-h-[48px] px-8 text-sm tracking-wider font-mono font-bold"
            >
              EXPLORE PRODUCT
            </CleroyButton>
          </motion.div>
        </div>

        {/* LEFT SIDE: Large Featured Visual (Mobile: Order 2, Desktop: Order 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-40px" }}
          style={isTouchDevice ? {} : {
            opacity: leftOpacityTransform,
            y: leftYTransform
          }}
          className="w-full lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 order-2 lg:order-1 pt-2 lg:pt-0 max-w-2xl mx-auto lg:max-w-none"
        >
          <motion.div
            ref={cardRef}
            style={isTouchDevice ? { perspective: "1200px" } : { y: imageY, scale: imageScale, perspective: "1200px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleLaunchExperience}
            data-cursor="card"
            className="project-card exhibition-card relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group bg-gradient-to-br from-[#121216] via-[#09090b] to-[#040405] border border-white/10 hover:border-[#E85002]/60 transition-colors duration-700 shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
          >
            {/* 3D Tilted Inner Container */}
            <motion.div
              style={{
                rotateX: isLaunching || isTouchDevice ? 0 : tiltX,
                rotateY: isLaunching || isTouchDevice ? 0 : tiltY,
                transformStyle: "preserve-3d",
              }}
              animate={{
                scale: isLaunching ? 1.05 : isHovered ? 1.02 : 1.0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full relative"
            >
              {/* Dynamic Mouse-Following Ambient Light Glow */}
              <motion.div
                style={{
                  x: lightShiftX,
                  y: lightShiftY,
                  scale: ambientGlowScale,
                }}
                animate={{
                  opacity: isLaunching ? 1.0 : isHovered ? 0.9 : 0.4,
                }}
                transition={{ duration: 0.6 }}
                className="absolute -inset-10 bg-radial from-[#E85002]/35 via-[#E85002]/10 to-transparent blur-3xl pointer-events-none"
              />

              {/* Periodic Soft Orange Light Sweep across project (Desktop only) */}
              {!isTouchDevice && (
                <motion.div
                  animate={{
                    x: ["-100%", "250%"],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    repeatDelay: 8.5,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#E85002]/15 to-transparent skew-x-12 pointer-events-none z-10"
                />
              )}

              {/* PROJECT LIFE: Subtle Abstract Motion Elements in Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,80,2,0.08)_0%,transparent_70%)]" />

                {/* Animated Telemetry Sparkline Graphs */}
                <div className="absolute top-1/3 right-6 sm:right-10 flex items-end gap-1 sm:gap-1.5 h-10 sm:h-12 opacity-30 group-hover:opacity-70 transition-opacity">
                  {[40, 65, 30, 85, 50, 95, 70, 100, 60, 80].map((height, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        height: isHovered
                          ? [`${height}%`, `${Math.max(20, (height + 30) % 100)}%`, `${height}%`]
                          : `${height}%`,
                      }}
                      transition={{
                        duration: 2 + idx * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-0.5 sm:w-1 bg-[#E85002]/60 rounded-full"
                    />
                  ))}
                </div>

                {/* Floating Micro Nodes */}
                {[
                  { top: "25%", left: "20%", delay: 0 },
                  { top: "65%", left: "75%", delay: 1.2 },
                  { top: "80%", left: "30%", delay: 2.1 },
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    style={{ top: node.top, left: node.left }}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: node.delay,
                      ease: "easeInOut",
                    }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#E85002]"
                  />
                ))}
              </div>

              {/* Editorial Product Content Canvas */}
              <div className="absolute inset-0 p-[clamp(1.25rem,4vw,3.25rem)] flex flex-col justify-between z-20">
                {/* Top Bar Metadata */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-[9px] sm:text-xs tracking-[0.25em] text-[#E85002] bg-[#E85002]/10 border border-[#E85002]/30 px-3 py-1 rounded-full uppercase font-bold bg-[#0D0D0F]/90 md:backdrop-blur-md">
                    CLEROY CORE V2.4
                  </span>

                  {/* Dynamic Telemetry Live Badge */}
                  <span className="flex items-center gap-1.5 font-mono text-[9px] sm:text-xs text-emerald-400 font-semibold tracking-wider bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 rounded-full bg-[#0D0D0F]/90 md:backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">STATE LATENCY</span> {telemetryLatency}ms
                  </span>
                </div>

                {/* Center Typography Composition */}
                <div className="my-auto flex flex-col space-y-2 sm:space-y-3">
                  <motion.span
                    animate={{ x: isHovered ? 6 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#B8ACA0] uppercase font-semibold flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E85002] flex-shrink-0" />
                    <span>SALON MANAGEMENT PLATFORM</span>
                  </motion.span>

                  <h3 className="font-sans text-[clamp(1.85rem,5.5vw,4.5rem)] font-extrabold text-[#F5EFE7] group-hover:text-white tracking-tight uppercase transition-colors leading-[0.95] break-words">
                    MATT'S <br />
                    <span className="text-[#E85002] transition-colors group-hover:text-[#FF6A1A]">GLITTERS</span>
                  </h3>
                </div>

                {/* Bottom Details - ENTER Indicator */}
                <div className="pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between gap-2">
                  <motion.div 
                    animate={{ scale: isHovered ? 1.03 : 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex items-center gap-3 group/enter cursor-pointer"
                  >
                    {/* Gentle Pulse Aura when Hovered */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.25, 1] }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="absolute -inset-2 rounded-full bg-[#E85002]/30 blur-md pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {/* Circular ENTER Badge with Rotating Outer Ring */}
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0A0A0E]/90 border border-[#E85002]/40 group-hover:border-[#E85002] flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(232,80,2,0.3)] group-hover:shadow-[0_0_35px_rgba(232,80,2,0.7)] flex-shrink-0">
                      <motion.svg
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ repeat: isHovered ? Infinity : 0, duration: 8, ease: "linear" }}
                        className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] text-[#E85002] pointer-events-none opacity-80"
                        viewBox="0 0 52 52"
                      >
                        <circle
                          cx="26"
                          cy="26"
                          r="23"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="12 6 24 6"
                        />
                      </motion.svg>

                      <ArrowUpRight className="w-4 h-4 text-[#E85002] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-mono text-xs sm:text-sm text-white font-bold tracking-[0.2em] uppercase transition-colors group-hover:text-[#FF6A1A]">
                        CLICK TO ENTER
                      </span>
                      <span className="font-mono text-[8px] sm:text-[9px] text-[#B8ACA0] tracking-[0.18em] uppercase font-medium">
                        PROJECT DISCOVERY V2.4
                      </span>
                    </div>
                  </motion.div>

                  <span className="hidden sm:inline-block font-mono text-[10px] text-white/40 tracking-[0.25em] uppercase font-medium">
                    EXHIBIT 01 / 01
                  </span>
                </div>
              </div>

              {/* Hover Sheen Sweep */}
              <motion.div
                animate={{
                  x: isHovered ? ["-100%", "200%"] : "-100%",
                }}
                transition={{
                  duration: 1.4,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 1.2,
                }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12 pointer-events-none z-30"
              />
            </motion.div>
          </motion.div>

          {/* Subtext under Left Visual */}
          <div className="flex items-center justify-between px-1 font-mono text-[10px] sm:text-xs text-[#B8ACA0]/60 tracking-wider uppercase gap-2 flex-wrap">
            <span>AUTOMATED SCHEDULING • REVENUE ENGINE</span>
            <span className="text-[#E85002] font-semibold">CLEROY PRODUCTIONS</span>
          </div>
        </motion.div>

      </div>

      {/* CUSTOM MAGNETIC FLOATING PILL CURSOR ("OPEN" - 80px x 34px) */}
      <AnimatePresence>
        {isHovered && !isLaunching && !isTouchDevice && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:flex items-center justify-center w-[80px] h-[34px] rounded-full bg-[#0a0a0d]/90 border border-[#E85002]/80 backdrop-blur-md shadow-[0_0_20px_rgba(232,80,2,0.45)]"
          >
            <span className="font-mono text-xs tracking-widest font-bold text-white uppercase">
              OPEN
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN LAUNCH EXPERIENCE OVERLAY */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-none overflow-hidden"
          >
            {/* Volumetric Flare Shockwave Pulse */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 22, opacity: [0, 1, 0.95] }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-96 h-96 bg-radial from-[#E85002] via-[#E85002]/40 to-transparent rounded-full blur-3xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute flex flex-col items-center space-y-3 text-center z-10 px-4"
            >
              <div className="w-8 h-8 border-2 border-[#E85002]/20 border-t-[#E85002] rounded-full animate-spin" />
              <span className="font-mono text-xs tracking-[0.35em] text-[#F5EFE7] uppercase font-bold">
                LAUNCHING MATT'S GLITTERS...
              </span>
              <span className="font-mono text-[10px] text-[#B8ACA0] tracking-widest uppercase">
                OPENING LIVE APPLICATION GATEWAY
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

